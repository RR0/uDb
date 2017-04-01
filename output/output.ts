import {FormattedRecord} from "../record";

export interface RecordOutput {
  write(record: FormattedRecord, position?: number);
  end();
}