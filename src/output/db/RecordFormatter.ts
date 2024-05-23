import {UdbRecord} from "../../input"

export interface RecordFormatter {
  formatProperties(record: UdbRecord): UdbRecord;

  formatData(rec: UdbRecord): UdbRecord;
}
