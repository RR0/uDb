import {UdbService, WebReadLine} from "./UdbService"
import {WebFileInput} from "./WebFileInput"
import {Logger} from "./Logger"
import {UdbController} from "./UdbController"

export class WebUdbConfig {
  log = {
    debug: false,
    verbose: false,
    prefix: undefined
  }
  data = {
    dir: "./"
  }
}

export class WebUdb {
  /**
   *
   * @param {WebUdbConfig} config
   */
  constructor(config) {
    const logger = new Logger(config.log.debug, config.log.verbose, config.log.prefix)
    const webFileInput = new WebFileInput(logger)
    const webReadLine = new WebReadLine()
    const udbService = new UdbService(logger, webFileInput, webReadLine)
    window.udbController = new UdbController(udbService, logger, config.data.dir)
  }
}
