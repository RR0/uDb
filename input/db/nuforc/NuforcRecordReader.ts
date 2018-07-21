import {NuforcInputRecord} from "./NuforcInputRecord";
import {Logger} from "../../../Logger";
import {WebRecordReader} from "../WebRecordReader";

/**
 * Creates an Udb InputRecord from a web page.
 */
export class NuforcRecordReader extends WebRecordReader {

  constructor(buffer, logger: Logger) {
    super(buffer, logger);
  }

  read(filePos: number): NuforcInputRecord {
    const record = <NuforcInputRecord>super.read(filePos);

    record.occurred = this.getTokenValue('Occurred : ', ' (');
    record.entered = this.getTokenValue('Entered as : ', ')');
    record.reported = this.getTokenValue('Reported: ', '<BR>');
    record.posted = this.getTokenValue('Posted: ', '<BR>');
    record.location = this.getTokenValue('Location: ', '<BR>');
    record.shape = this.getTokenValue('Shape: ', '<BR>');
    record.duration = this.getTokenValue('Duration:', '</FONT>');
    record.desc = this.getTokenValue('COLOR=#000000>', '</FONT>');

    return record;
  }
}
