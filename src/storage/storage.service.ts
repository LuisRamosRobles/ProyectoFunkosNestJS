import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import * as process from 'process'
import * as fs from 'fs'
import * as path from 'path'
import { join } from 'path'

@Injectable()
export class StorageService {
  private readonly uploadsDir = process.env.UPLOADS_DIR || 'storage-dir'
  private readonly isDev = process.env.NODE_ENV === 'dev'
  private readonly logger = new Logger(StorageService.name)

  //El siguiente metodo se ejecuta en el momento que se incia el módulo
  //En caso de que estemos en entorno de desarrollo, se eliminan los archivos
  //del directorio uploads y se crea de nuevo
  //Esto sirve para que cuando se inicie el servidor siempre este vació el directorio
  async onModuleInit() {
    if (this.isDev) {
      if (fs.existsSync(this.uploadsDir)) {
        this.logger.log(`Eliminando ficheros de ${this.uploadsDir}`)
        fs.readdirSync(this.uploadsDir).forEach((archivo) => {
          fs.unlinkSync(path.join(this.uploadsDir, archivo))
        })
      } else {
        this.logger.log(
          `Creando directorio de subida de archivos en ${this.uploadsDir}`,
        )
        fs.mkdirSync(this.uploadsDir)
      }
    }
  }

  findFile(nombreArch: string): string {
    this.logger.log(`Buscando fichero ${nombreArch}`)
    const archivo = join(
      process.cwd(), //esta parte devuelve el directorio de trabajo actual
      process.env.UPLOADS_DIR || 'storage-dir', //aquí se indica el directorio de subida de archivos
      nombreArch, //nombre del archivo
    )
    if (fs.existsSync(archivo)) {
      this.logger.log(`Fichero encontrado ${archivo}`)
      return archivo
    } else {
      throw new NotFoundException(`El fichero ${nombreArch} no existe.`)
    }
  }

  getFileName(urlArch: string): string {
    try {
      const url = new URL(urlArch)
      const pathname = url.pathname
      const segments = pathname.split('/')
      const nombreArch = segments[segments.length - 1]
      return nombreArch
    } catch (error) {
      this.logger.error(error)
      return urlArch
    }
  }

  removeFile(nombreArch: string): void {
    this.logger.log(`Eliminando fichero ${nombreArch}`)
    const archivo = join(
      process.cwd(), //Devuelve el directorio de trabajo actual
      process.env.UPLOADS_DIR, //directorio de subida de archivos
      nombreArch, //nombre del archivo
    )
    if (fs.existsSync(archivo)) {
      fs.unlinkSync(archivo)
    } else {
      throw new NotFoundException(`El archivo ${nombreArch} no existe.`)
    }
  }
}
