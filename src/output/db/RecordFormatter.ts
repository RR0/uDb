import {UdbRecord} from "../../input/db/UdbRecord"

export interface RecordFormatter {
  formatProperties(record: UdbRecord): UdbRecord;

  formatData(rec: UdbRecord): UdbRecord;
}
