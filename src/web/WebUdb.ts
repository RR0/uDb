import { Logger } from "../Logger"
import { WebFileInput } from "./WebFileInput"
import { UdbService, WebReadLine } from "./UdbService"
import { UdbController } from "./UdbController"

export type WebUdbConfig = {
  log: {
    debug: boolean,
    verbose: boolean,
    prefix: string
  }
  data: {
    dir: string
  }
}

export class WebUdb {
  readonly controller: UdbController

  readonly defaultConfig: WebUdbConfig = {
    log: {
      debug: false,
      verbose: false,
      prefix: undefined
    },
    data: {
      dir: "./"
    }
  }

  constructor(userConfig: Partial<WebUdbConfig> = {}) {
    const config = Object.assign(this.defaultConfig, userConfig)
    const logger = new Logger(config.log.debug, config.log.verbose, config.log.prefix)
    const webFileInput = new WebFileInput(logger)
    const webReadLine = new WebReadLine()
    const udbService = new UdbService(logger, webFileInput, webReadLine)
    this.controller = new UdbController(udbService, logger, config.data.dir)
  }
}
