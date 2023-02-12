import {RecordEnumerator} from "./RecordEnumerator"
import {UdbRecord} from "./db/UdbRecord"

export interface Input {
  readRecord(recordIndex: number): Promise<UdbRecord>;

  hasNext(): boolean;

  goToRecord(recordIndex: number);

  close(): void;

  recordEnumerator(firstIndex: number, maxCount: number): RecordEnumerator;
}
