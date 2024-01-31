import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Req,
  Logger,
  Res,
} from '@nestjs/common'
import { StorageService } from './storage.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Request, Response } from 'express' // importamos Request y Response de express
import * as process from 'process'
import e from 'express'

@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name)

  constructor(private readonly storageService: StorageService) {}

  //se usa el Interceptor para que antes de que se ejecute ningún tipo
  //de almacenamiento se realicen previamente las ejecuciones siguientes
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorage({
        destination: process.env.UPLOADS_DIR,
        filename(
          req: e.Request,
          archivo: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) {
          const nombreArch = uuidv4() // aquí se genera el nombre unico con el que el archivo será guardado
          const extesionArch = extname(archivo.originalname) // se extrae la extension del archivo
          cb(null, `${nombreArch}${extesionArch}`) // con el nombre generado y la extension recogida
          // se llama al callback para unir los dos elementos
        },
      }),
      //con fileFilter podemos filtrar como queremos que sean los archivos que se pueden subir
      //ya sea la extension, tamaño o número máximo de archivos que se pueden subir
      //a la vez entre otros
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
        cb,
      ) {
        if (!archivo.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          //en caso de que el fichero que se vaya a subir no cumpla
          //con la condición del if se llama al callback para que muestre
          //el error por el cual no se puede subir
          cb(
            new BadRequestException(
              'La extensión del archivo no esta soportada',
            ),
            false,
          )
        } else {
          //en caso contrario se llama también al callback para indicar
          //que el archivo ha sido aceptado
          cb(null, true)
        }
      },
    }),
  ) // 'archivo' es el nombre que del campo en el formulario
  // el metodo storeFile realiza el guardado del archivo
  storeFile(@UploadedFile() archivo: Express.Multer.File, @Req() req: Request) {
    this.logger.log(`Archivo (${archivo}) subiendose.`)

    if (!archivo) {
      throw new BadRequestException('No se encontro ningún fichero.')
    }
    // aquí se construye la url del archivo, que sera la url de la API + el nombre del fichero
    const versionApi = process.env.API_VERSION
      ? `/${process.env.API_VERSION}`
      : ''
    const url = `${req.protocol}://${req.get('host')}${versionApi}/storage/${
      archivo.filename
    }`
    console.log(archivo)
    return {
      originalname: archivo.originalname, //nombre original del archivo
      filename: archivo.filename, //nombre del archivo después de haber sido subido
      size: archivo.size, //tamaño del archivo
      mimetype: archivo.mimetype, //el tipo MIME del archivo, se usa para identificar
      // el tipo de dato que se encuentra en un archivo
      path: archivo.path, //ruta local donde ha sido guardado el archivo
      // en el sistema de archivos del servidor
      url: url, //url del archivo que se creo previamente
    }
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    this.logger.log(`Busacando el archivo: ${filename}`)
    const filePath = this.storageService.findFile(filename)
    this.logger.log(`Archivo encontrado ${filePath}`)
    res.sendFile(filePath)
  }
}
