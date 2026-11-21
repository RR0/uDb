import {UdbRecord} from "../../input/index.js"

export interface RecordFormatter {
  formatProperties(record: UdbRecord): UdbRecord;

  formatData(rec: UdbRecord): UdbRecord;
}
