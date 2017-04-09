import {Logger} from "../log";

export class WebLogger extends Logger {
  private subscriber: Function;

  subscribe(cb) {
    this.subscriber = cb;
  }

  flush() {
    if (this.logMsg) {
      this.subscriber(this.logMsg);
    }
    super.flush();
  }
}