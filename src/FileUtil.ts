import { fileURLToPath } from "url"
import { dirname } from "path"
import path from "node:path"

export class FileUtil {

  static getPath(somePath: string): string {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    return path.resolve(__dirname, somePath)
  }
}
