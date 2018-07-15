import {UdbOutputRecord} from "./udb/UdbOutputRecord";
import {InputRecord} from "../../input/InputRecord";

export interface RecordFormatter {
  formatProperties(record: InputRecord): UdbOutputRecord;
  formatData(rec: InputRecord): UdbOutputRecord;
}