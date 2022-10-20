import {IncomingMessage} from "http"
import * as https from "https"

export class HttpUtil {

  static getLocale(req: IncomingMessage): string {
    const langHeader = req.headers["accept-language"] || ""
    const langs = Array.isArray(langHeader) ? langHeader : langHeader.split(",")
    const lg = langs.map(lang => lang.split(";")[0])
    return (lg[0] || "en").toLowerCase()
  }

  static get(host: string, path: string, headers = {}): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const options = {
        path: path,
        host: host,
        port: 443,
        headers: headers
      }
      https.get(options, async (res: IncomingMessage) => {
        let status = res.statusCode || 500
        if (status >= 200 && status < 400) {
          const body = await HttpUtil.readBody(res)
          resolve(body)
        } else {
          reject(status)
        }
      }).on("error", function (e: Error) {
        reject(e)
      })
    })
  }

  static async readBody(req: IncomingMessage): Promise<string> {
    const buffers = []
    for await (const chunk of req) {
      buffers.push(chunk)
    }
    return Buffer.concat(buffers).toString()
  }
}
