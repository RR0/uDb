import {RecordReader} from "./RecordReader";
import {Logger} from "../../Logger";

/**
 * Creates an InputRecord from a web page content.
 */
export abstract class WebRecordReader extends RecordReader {

  constructor(buffer, logger: Logger) {
    super(buffer, logger);
  }

  protected getTokenValue(startToken: string, endToken: string): string {
    let tokenStart = this.buffer.indexOf(startToken, this.recordPos);
    let tokenEnd = this.buffer.indexOf(endToken, tokenStart);
    this._recordPos = tokenEnd;
    let value = this.buffer.substring(tokenStart + startToken.length, tokenEnd);
    value = this.plainString(value);
    return value;
  }

  private plainString(value) {
    return value.trim().replace(/<BR>/g, '\n');
  }
}