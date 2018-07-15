import {OutputRecord} from "../OutputRecord";
import {InputRecord} from "../../input/InputRecord";

export interface RecordFormatter {
  formatProperties(record: InputRecord): OutputRecord;
  formatData(rec: InputRecord): OutputRecord;
}