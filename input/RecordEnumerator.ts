import {Input} from "./Input";
import {Record} from "./db/RecordReader";

export class RecordEnumerator<RecordType extends Record> {

  constructor(private input: Input<RecordType>, private recordIndex: number) {
    this.input.goToRecord(this.recordIndex);
  }

  hasNext(): boolean {
    return this.input.hasNext();
  }

  next() {
    this.input.goToRecord(this.recordIndex);
    const inputRecord: RecordType = this.input.readRecord(this.recordIndex);
    this.recordIndex++;
    return inputRecord;
  }
}