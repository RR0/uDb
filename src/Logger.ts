export class Logger {

  protected logMsg: string
  private logCb: Function
  private logError: Function

  constructor(protected DEBUG = false, protected verbose = false, protected prefix?: string) {
    this.reset()
  }

  private _autoFlush: boolean

  set autoFlush(value) {
    this._autoFlush = value
  }

  onLog(cb) {
    this.logCb = cb
  }

  onError(cb) {
    this.logError = cb
  }

  log(msg: string, lineFeed: boolean = true, withPrefix = true, cb = this.logCb) {
    while (msg.charAt(0) == "\n") {
      this.logMsg += "\n"
      msg = msg.substring(1)
    }
    this.logMsg += (withPrefix && this.prefix ? this.prefix : "") + msg + (lineFeed ? "\n" : "")
    if (this._autoFlush) {
      this.flush(cb)
    }
  }

  logDebug(msg) {
    if (this.DEBUG) {
      this.log("DEBUG: " + msg)
    }
  }

  error(msg: string) {
    this.flush()
    this.log(msg, true, true, this.logError)
    this.flush(this.logError)
  }

  logVerbose(msg: string, lineFeed: boolean = true) {
    if (this.verbose) {
      this.log(msg, lineFeed)
    }
    return this
  }

  reset() {
    this.logMsg = ""
  }

  flush(cb: Function = this.logCb) {
    if (this.logMsg && cb) {
      cb(this.logMsg)
    }
    this.reset()
  }
}
