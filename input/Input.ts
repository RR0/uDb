import {Record} from "./db/RecordReader";
import {RecordEnumerator} from "./RecordEnumerator";

export interface Input {
  readRecord(recordIndex: number): Promise<Record>;
  hasNext(): boolean;
  goToRecord(recordIndex: number);
  close(): void;

  recordEnumerator(firstIndex: number, maxCount: number): RecordEnumerator;
}
