export class Logger {
  protected logMsg : string;
  private _autoFlush: boolean;
  private subscriber: Function;

  constructor(private DEBUG: boolean, private verbose: boolean) {
    this.reset();
  }

  subscribe(cb) {
    this.subscriber = cb;
  }

  set autoFlush(value) {
    this._autoFlush = value;
  }

  log(msg: string, lineFeed: boolean = true) {
    while (msg.charAt(0) == '\n') {
      this.logMsg += '\n';
      msg = msg.substring(1);
    }
    this.logMsg += msg + (lineFeed ? '\n' : '');
    if (this._autoFlush) {
      this.flush();
    }
  }

  logDebug(msg) {
    if (this.DEBUG) {
      this.log('DEBUG: ' + msg);
    }
  }

  error(msg: string) {
    console.error(msg.substring(0, msg.length - 1));
  }

  logVerbose(msg: string, lineFeed: boolean = true) {
    if (this.verbose) {
      this.log(msg, lineFeed);
    }
  }

  reset() {
    this.logMsg = '';
  }

  flush() {
    if (this.logMsg && this.subscriber) {
      this.subscriber(this.logMsg);
    }
    this.reset();
  }
}
