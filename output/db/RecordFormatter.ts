import {Record} from "../../input/db/RecordReader";

export interface RecordFormatter {
  formatProperties(record: Record): Record;
  formatData(rec: Record): Record;
}