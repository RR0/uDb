import {Input} from "./Input";
import {Record} from "./db/RecordReader";

export class RecordEnumerator {

  constructor(private input: Input, private recordIndex: number) {
    this.input.goToRecord(this.recordIndex);
  }

  hasNext(): boolean {
    return this.input.hasNext();
  }

  next() {
    this.input.goToRecord(this.recordIndex);
    const inputRecord: Record = this.input.readRecord(this.recordIndex);
    this.recordIndex++;
    return inputRecord;
  }
}