import { Logger } from "../Logger"
import { WebFileInput } from "./WebFileInput"
import { UdbService, WebReadLine } from "./UdbService"
import { UdbController } from "./UdbController"

export type WebUdbConfig = {
  log: {
    debug: false,
    verbose: false,
    prefix: undefined
  }
  data: {
    dir: "./"
  }
}

export class WebUdb {
  readonly controller: UdbController

  constructor(config: WebUdbConfig) {
    const logger = new Logger(config.log.debug, config.log.verbose, config.log.prefix)
    const webFileInput = new WebFileInput(logger)
    const webReadLine = new WebReadLine()
    const udbService = new UdbService(logger, webFileInput, webReadLine)
    const win = window as any
    win.udbController = this.controller = new UdbController(udbService, logger, config.data.dir)
  }
}
