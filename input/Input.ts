import {InputRecord} from "./InputRecord";
import {FileInput} from "./FileInput";

export interface Input {
  hasNext(): boolean;
}

export class RecordEnumerator {

  constructor(private input: FileInput, private recordIndex: number) {
    this.input.goToRecord(this.recordIndex);
  }

  hasNext(): boolean {
    return this.input.hasNext();
  }

  next() {
    this.input.goToRecord(this.recordIndex);
    const inputRecord: InputRecord = this.input.readRecord();
    inputRecord.id = this.recordIndex;
    this.recordIndex++;
    return inputRecord;
  }
}