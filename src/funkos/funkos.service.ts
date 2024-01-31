import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { Funko } from './entities/funko.entity'
import { FunkosMapper } from './mappers/funkos.mapper/funko.mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Categoria } from '../categorias/entities/categoria.entity'
import { ResponseFunkoDto } from './dto/response-funko.dto'
import { StorageService } from '../storage/storage.service'
import * as process from 'process'
import { Request } from 'express'
import { TipoWebSocket, WsocketModel } from '../websockets/models/wsocket.model'
import { FunkosWebsocketGateway } from '../websockets/funkos-websocket.gateway'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { hash } from 'typeorm/util/StringUtils'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'

@Injectable()
export class FunkosService {
  private readonly logger: Logger = new Logger(FunkosService.name)

  constructor(
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly funkoMapper: FunkosMapper,
    private readonly storageService: StorageService,
    private readonly funkosWebsocketGateway: FunkosWebsocketGateway,
    @Inject(CACHE_MANAGER) private managerCache: Cache,
  ) {}

  async findAll(query: PaginateQuery) {
    this.logger.log('Obteniendo todos los funkos.')
    //check cache
    const cache = await this.managerCache.get(
      `all_funkos_page_${hash(JSON.stringify(query))}`,
    )
    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }

    //a continuación esta el queryBuilder que es el facilita hacer
    //el leftJoinAndSelect con la categoria
    const funkos = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.categoria', 'categoria')

    const paginacion = await paginate(query, funkos, {
      sortableColumns: [
        'nombre',
        'categoria',
        'descripcion',
        'precio',
        'stock',
      ],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: [
        'nombre',
        'categoria',
        'descripcion',
        'precio',
        'stock',
      ],
      filterableColumns: {
        nombre: [FilterOperator.EQ, FilterSuffix.NOT],
        categoria: [],
        descripcion: [],
        precio: true,
        stock: true,
      },
    })

    // a continuación mapeamos los elementos de la página para devolverlos en el
    // formato que queramos con la categoria

    const res = {
      data: (paginacion.data ?? []).map((funko) =>
        this.funkoMapper.mapResponseDto(funko),
      ),
      meta: paginacion.meta,
      links: paginacion.links,
    }

    //seguidamente se guarda en cache
    await this.managerCache.set(
      `all_funkos_page_${hash(JSON.stringify(query))}`,
      res,
      60,
    )

    return res
  }

  async findOne(id: number): Promise<ResponseFunkoDto> {
    this.logger.log(`Obteniendo el funko con ID: ${id}`)

    //Cache
    const cache: ResponseFunkoDto = await this.managerCache.get(`funko_${id}`)

    if (cache) {
      console.log('Cache hit')
      this.logger.log('Cache hit')
      return cache
    }
    //no se puede usar .findOneBy si se quiere devolver el nombre de la categoria
    const foundFunko = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.categoria', 'categoria')
      .where('funko.id = :id', { id })
      .getOne()
    if (!foundFunko) {
      throw new NotFoundException(
        `El Funko con ID (${id}) no ha sido encontrado.`,
      )
    }

    const res = this.funkoMapper.mapResponseDto(foundFunko)
    await this.managerCache.set(`funko_${id}`, res, 60)
    return res
  }
  async create(createFunkoDto: CreateFunkoDto): Promise<ResponseFunkoDto> {
    this.logger.log('Creando un nuevo Funko.')
    const categoria = await this.existsCategoria(createFunkoDto.categoria)
    const creandoFunko = this.funkoMapper.mapCreateDtotoEntity(
      createFunkoDto,
      categoria,
    )
    const nuevoFunko = await this.funkoRepository.save(creandoFunko)
    const dto = this.funkoMapper.mapResponseDto(nuevoFunko)
    this.onChange(TipoWebSocket.CREATE, dto)
    //la siguiente linea sirve para invalidar la cache de funkos_all cuando se crea
    //un funko nuevo
    await this.invalidateCacheKey('all_funkos')

    return dto
  }
  async update(
    id: number,
    updateFunkoDto: UpdateFunkoDto,
  ): Promise<ResponseFunkoDto> {
    this.logger.log(`Actualizando el funko con ID: ${id}`)
    const foundFunko = await this.existsFunko(id)
    let categoria: Categoria
    if (updateFunkoDto.categoria) {
      categoria = await this.existsCategoria(updateFunkoDto.categoria)
    }
    const updateFunko = await this.funkoRepository.save({
      ...foundFunko,
      ...updateFunkoDto,
      categoria: categoria ? categoria : foundFunko.categoria,
    })
    const dto = this.funkoMapper.mapResponseDto(updateFunko)
    this.onChange(TipoWebSocket.UPDATE, dto)

    //las siguientes lineas invalidan la cache de un funko específico
    //y funko_all cuando se actualiza un funko
    await this.invalidateCacheKey(`funko_${id}`)
    await this.invalidateCacheKey('all_funkos')

    return dto
  }

  async remove(id: number) {
    this.logger.log(`Eliminando el funko con ID: ${id}`)
    const funkoAEliminar = await this.existsFunko(id)
    const funkoEliminado = await this.funkoRepository.remove(funkoAEliminar)
    if (funkoAEliminar.imagen !== Funko.IMAGENPORDEFECTO) {
      this.logger.log(`Eliminando imagen ${funkoAEliminar.imagen}`)
      this.storageService.removeFile(funkoAEliminar.imagen)
    }

    const dto = this.funkoMapper.mapResponseDto(funkoEliminado)
    this.onChange(TipoWebSocket.DELETE, dto)

    await this.invalidateCacheKey(`funko_${id}`)
    await this.invalidateCacheKey('all_funkos')

    return dto
  }

  public async existsCategoria(nombreCategoria: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository
      .createQueryBuilder()
      .where('LOWER(nombre) = LOWER(:nombre)', {
        nombre: nombreCategoria.toLowerCase(),
      })
      .getOne()
    if (!categoria) {
      this.logger.log(
        `No existe ninguna categoria con el siguiente nombre ${nombreCategoria}`,
      )
      throw new BadRequestException(
        `No existe ninguna categoria con el siguiente nombre ${nombreCategoria}`,
      )
    }

    return categoria
  }

  public async existsFunko(id: number): Promise<Funko> {
    const funko = await this.funkoRepository.findOneBy({ id })

    if (!funko) {
      this.logger.log(`El Funko con el ID(${id}) no existe.`)
      throw new NotFoundException(`El Funko con el ID(${id}) no existe.`)
    }

    return funko
  }
  //mirar los import y este metodo
  public async updateImage(
    id: number,
    archivo: Express.Multer.File,
    req: Request,
    withUrl: boolean = true,
  ) {
    this.logger.log(`Update image funko by id: ${id}`)
    const funkoToUpdate = await this.existsFunko(id)
    // Borramos su imagen si es distinta a la imagen por defecto
    if (funkoToUpdate.imagen !== Funko.IMAGENPORDEFECTO) {
      this.logger.log(`Borrando imagen ${funkoToUpdate.imagen}`)
      let imagePath = funkoToUpdate.imagen
      if (withUrl) {
        imagePath = this.storageService.getFileName(funkoToUpdate.imagen)
      }
      try {
        this.storageService.removeFile(imagePath)
      } catch (error) {
        this.logger.error(error)
      }
    }

    if (!archivo) {
      throw new BadRequestException('Archivo no encontrado.')
    }

    let filePath: string

    if (withUrl) {
      this.logger.log(`Generando url para ${archivo.filename}`)
      // Construimos la url del fichero, que será la url de la API + el nombre del fichero
      const apiVersion = process.env.API_VERSION
        ? `/${process.env.API_VERSION}`
        : ''
      filePath = `${req.protocol}://${req.get('host')}${apiVersion}/storage/${
        archivo.filename
      }`
    } else {
      filePath = archivo.filename
    }

    funkoToUpdate.imagen = filePath
    const funkoActualizado = await this.funkoRepository.save(funkoToUpdate)
    const dto = this.funkoMapper.mapResponseDto(funkoActualizado)
    this.onChange(TipoWebSocket.UPDATE, dto)
    await this.invalidateCacheKey(`funko_${id}`)
    await this.invalidateCacheKey('all_funkos')
    return dto
  }

  private onChange(tipo: TipoWebSocket, data: ResponseFunkoDto) {
    const notificacion = new WsocketModel<ResponseFunkoDto>(
      'FUNKOS',
      tipo,
      data,
      new Date(),
    )

    this.funkosWebsocketGateway.sendMessage(notificacion)
  }

  async invalidateCacheKey(keyPattern: string): Promise<void> {
    const cacheKeys = await this.managerCache.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.managerCache.del(key))
    await Promise.all(promises)
  }
}
