import {UdbService, WebReadLine} from "./UdbService"
import {WebFileInput} from "./WebFileInput"
import {Logger} from "./Logger"
import {UdbController} from "./UdbController"

const logger = new Logger(false, true)
const webFileInput = new WebFileInput(logger)
const webReadLine = new WebReadLine()
const udbService = new UdbService(logger, webFileInput, webReadLine)
const win = window as any
win.udbController = new UdbController(udbService, logger, "../data/udb/input/")
