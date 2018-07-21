import {NuforcInputRecord} from "./NuforcInputRecord";
import {Logger} from "../../../Logger";
import {RecordReader} from "../RecordReader";

/**
 * Creates an Udb InputRecord from a web page.
 */
export class NuforcRecordReader extends RecordReader {

  constructor(buffer, logger: Logger) {
    super(buffer, logger);
  }

  read(filePos: number): NuforcInputRecord {
    const record = <NuforcInputRecord>super.read(filePos);
    let startToken = '<td>';
    let page = this.buffer;
    let headerStart = page.indexOf(startToken);
    let headerEnd = page.indexOf('</td>', headerStart);
    record.header = page.substring(headerStart + startToken.length, headerEnd);

    let descStart = page.indexOf(startToken, headerEnd);
    let descEnd = page.indexOf('</td>', descStart);
    record.desc = page.substring(descStart + startToken.length, descEnd);

    return record;
  }
}
