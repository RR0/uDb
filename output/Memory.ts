import {Output} from "./RecordOutput";
import {Input} from "../input/Input";
import {Record} from "../input/db/RecordReader";
import {RecordEnumerator} from "../input/RecordEnumerator";

export class Memory implements Input, Output {
  records = [];
  private recordIndex;

  hasNext(): boolean {
    return this.recordIndex < this.records.length - 1;
  }

  readRecord(): Promise<Record> {
    return Promise.resolve(this.records[this.recordIndex]);
  }

  goToRecord(recordIndex: number) {
    this.recordIndex = recordIndex;
  }

  write(record): boolean {
    this.records.push(record);
    return true;
  }

  close(): void {
  }

  recordEnumerator(firstIndex: number, maxCount: number): RecordEnumerator {
    return new RecordEnumerator(this, firstIndex, maxCount);
  }
}