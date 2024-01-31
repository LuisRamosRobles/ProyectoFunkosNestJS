import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  HttpCode,
  Put,
  UsePipes,
  ValidationPipe,
  Patch,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Req,
  ParseIntPipe,
} from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as process from 'process'
import e from 'express'
import { parse } from 'path'
import { extname } from 'path'
import { Request } from 'express'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, PaginateQuery } from 'nestjs-paginate'

@Controller('funkos')
@UseInterceptors(CacheInterceptor) //Aquí se aplica el interceptor de caché
export class FunkosController {
  private readonly logger: Logger = new Logger(FunkosController.name)
  constructor(private readonly funkosService: FunkosService) {}

  @Get()
  @CacheKey('all_funkos')
  @CacheTTL(30)
  async findAll(@Paginate() query: PaginateQuery) {
    this.logger.log('Obteniendo todos los Funkos.')
    return await this.funkosService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    this.logger.log(`Obteniendo Funko con id: ${id}`)
    return await this.funkosService.findOne(+id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  @HttpCode(201)
  async create(@Body() createFunkoDto: CreateFunkoDto) {
    this.logger.log('Creando Funko.')
    return await this.funkosService.create(createFunkoDto)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    this.logger.log(`Actualizando Funko con id: ${id}`)
    return await this.funkosService.update(+id, updateFunkoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Eliminando producto con id: ${id}`)
    return await this.funkosService.remove(+id)
  }

  //mirar y tmb el controller y el service de storage
  @Patch('/imagen/:id')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorage({
        destination: process.env.UPLOADS_DIR || 'storage-dir',
        filename(
          req: e.Request,
          archivo,
          cb: (error: Error | null, filename: string) => void,
        ) {
          const { name } = parse(archivo.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(archivo.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      // Validación de archivos
      fileFilter(
        req: any,
        archivo: {
          fieldname: string
          originalname: string
          encoding: string
          mimetype: string
          size: number
          destination: string
          filename: string
          path: string
          buffer: Buffer
        },
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
        ]
        const maxFileSize = 1024 * 1024 // 1 megabyte
        if (!allowedMimes.includes(archivo.mimetype)) {
          cb(
            new BadRequestException(
              'Formato de archivo no soportado. No es del tipo imagen válido.',
            ),
            false,
          )
        } else if (archivo.size > maxFileSize) {
          cb(
            new BadRequestException(
              'El tamaño del archivo no debe superar 1 megabyte.',
            ),
            false,
          )
        } else {
          cb(null, true)
        }
      },
    }),
  )
  updateImagen(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    this.logger.log(`Actualizando la imagen del funko(${id}): ${file}`)

    return this.funkosService.updateImage(id, file, req, true)
  }
}
