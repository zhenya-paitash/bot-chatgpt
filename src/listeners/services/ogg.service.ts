import { createWriteStream } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import axios, { AxiosError, AxiosResponse } from "axios"
import ffmpeg from 'fluent-ffmpeg'
import installer from '@ffmpeg-installer/ffmpeg'
import { rmFile } from '../utils/utils.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

class OggConverterService {
  /**
   * This constructor sets the path for the ffmpeg library.
   */
  constructor() {
    ffmpeg.setFfmpegPath(installer.path)
  }

  /**
   * This is an async function that downloads a file from a given URL and saves it
   * to a specified output path.
   * @param {string} url - The URL of the file to be downloaded.
   * @param {string} output - The name of the output file that will be saved as a
   * .ogg file in the "voices" directory.
   * @returns A Promise that resolves to the path of the downloaded file.
   */
  async download(url: string, output: string): Promise<string> {
    try {
      const pathOgg = resolve(__dirname, '..', '..', '..', 'voices', `${output}.ogg`)
      const response: AxiosResponse = await axios({ method: 'get', url, responseType: 'stream' })
      return new Promise(resolve => {
        const stream = createWriteStream(pathOgg)
        response.data.pipe(stream)
        stream.on('finish', () => resolve(pathOgg))
      })
    } catch (e: AxiosError | Error | any) {
      const error = `OggConverter download error: ${e?.message}`
      throw new Error(error)
    }
  }

  /**
   * This function converts an input file to an MP3 format and saves it as an
   * output file.
   * @param {string} input - The path to the input file that needs to be converted
   * to MP3 format.
   * @param {string} output - The desired name of the output file, without the file
   * extension. The function will add the ".mp3" extension automatically.
   * @returns A Promise that resolves to a string representing the path to the
   * output file.
   */
  toMp3(input: string, output: string): Promise<string> {
    try {
      const pathOutput = resolve(dirname(input), `${output}.mp3`)
      return new Promise((resolve, reject) => {
        ffmpeg(input)
          .inputOption('-t 30')
          .output(pathOutput)
          .on('end', () => {
            rmFile(input)
            resolve(pathOutput)
          })
          .on('error', err => reject(err.message))
          .run()
      })
    } catch (e: Error | any) {
      const error = `OggConverter convert to mp3 error: ${e?.message}`
      throw new Error(error)
    }
  }
}

/* Exporting an instance of the `OggConverterService` class as `oggService`, which
can be imported and used in other modules. */
export const oggService = new OggConverterService()