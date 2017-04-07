import {Record} from "../RecordReader";

export interface Input<RecordType extends Record> {
  readRecord(recordIndex: number): RecordType;
  hasNext(): boolean;
  goToRecord(recordIndex: number);
}