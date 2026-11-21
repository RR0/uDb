import {RecordEnumerator} from "./RecordEnumerator.js"
import {UdbRecord} from "./db/UdbRecord.js"

export interface Input {
  readRecord(recordIndex: number): Promise<UdbRecord>;

  hasNext(): boolean;

  goToRecord(recordIndex: number);

  close(): void;

  recordEnumerator(firstIndex: number, maxCount: number): RecordEnumerator;
}
