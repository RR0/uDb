import {Record} from "./db/RecordReader";

export interface Input {
  readRecord(recordIndex: number): Record;
  hasNext(): boolean;
  goToRecord(recordIndex: number);
  close(): void;
}