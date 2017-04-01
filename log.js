exports.Logger = class Logger {
  constructor(DEBUG, verbose) {
    this.DEBUG = DEBUG;
    this.verbose = verbose;
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
};

