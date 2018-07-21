import {RecordReader} from "./RecordReader";
import {Logger} from "../../Logger";

/**
 * Creates an InputRecord from a web page content.
 */
export abstract class WebRecordReader extends RecordReader {

  constructor(buffer, logger: Logger) {
    super(buffer, logger);
  }

  protected getTokenValue(tokenStart: string, tokenEnd: string): string {
    let occurredStart = this.buffer.indexOf(tokenStart, this.recordPos);
    let occurredEnd = this.buffer.indexOf(tokenEnd, occurredStart);
    this._recordPos = occurredEnd;
    let value = this.buffer.substring(occurredStart + tokenStart.length, occurredEnd);
    value = this.plainString(value);
    return value;
  }

  private plainString(value) {
    return value.trim().replace(/<BR>/g, '\n');
  }
}