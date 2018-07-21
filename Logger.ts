export class Logger {
  protected logMsg : string;
  private _autoFlush: boolean;
  private logCb: Function;
  private logError: Function;

  /*@ngInject*/
  constructor(private DEBUG: boolean, private verbose: boolean, private prefix: string) {
    this.reset();
  }

  onLog(cb) {
    this.logCb = cb;
  }

  onError(cb) {
    this.logError = cb;
  }

  set autoFlush(value) {
    this._autoFlush = value;
  }

  log(msg: string, lineFeed: boolean = true, withPrefix = true, cb = this.logCb) {
    while (msg.charAt(0) == '\n') {
      this.logMsg += '\n';
      msg = msg.substring(1);
    }
    this.logMsg += (withPrefix ? this.prefix : '') + msg + (lineFeed ? '\n' : '');
    if (this._autoFlush) {
      this.flush(cb);
    }
  }

  logDebug(msg) {
    if (this.DEBUG) {
      this.log('DEBUG: ' + msg);
    }
  }

  error(msg: string) {
    this.flush();
    this.log(msg, true, true, this.logError);
    this.flush(this.logError);
  }

  logVerbose(msg: string, lineFeed: boolean = true) {
    if (this.verbose) {
      this.log(msg, lineFeed);
    }
  }

  reset() {
    this.logMsg = '';
  }

  flush(cb: Function = this.logCb) {
    if (this.logMsg && cb) {
      cb(this.logMsg);
    }
    this.reset();
  }
}
