export class Logger {
  protected logMsg : string;
  private _autoFlush: boolean;

  constructor(private DEBUG: boolean, private verbose: boolean) {
    this.reset();
  }

  set autoFlush(value) {
    this._autoFlush = value;
  }

  log(msg: string) {
    while (msg.charAt(0) == '\n') {
      this.logMsg += '\n';
      msg = msg.substring(1);
    }
    this.logMsg += `udb: ${msg}\n`;
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

  logVerbose(msg: string) {
    if (this.verbose) {
      this.log(msg);
    }
  }

  reset() {
    this.logMsg = '';
  }

  flush() {
    if (this.logMsg) {
      console.log(this.logMsg);
    }
    this.reset();
  }
}
