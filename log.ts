export class Logger {
  constructor(private DEBUG, private verbose) {
  }

  logDebug(msg) {
    if (this.DEBUG) {
      console.log('DEBUG: ' + msg);
    }
  }

  error(msg) {
    console.error(msg);
  }

  logVerbose(msg) {
    if (this.verbose) {
      console.log(msg);
    }
  }
}
