export class Logger {
  private logMsg;

  constructor(private DEBUG: boolean, private verbose: boolean) {
    this.reset();
  }

  log(msg: string) {
    this.logMsg += msg + '\n';
  }

  logDebug(msg) {
    if (this.DEBUG) {
      this.log('DEBUG: ' + msg);
    }
  }

  error(msg: string) {
    console.error(msg);
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
    console.log(this.logMsg);
    this.reset();
  }
}
