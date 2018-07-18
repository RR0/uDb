import {Output} from "./RecordOutput";
import {Input} from "../input/Input";
import {Record} from "../input/db/RecordReader";

export class Memory implements Input, Output {
  records = [];
  private recordIndex;

  hasNext(): boolean {
    return this.recordIndex < this.records.length - 1;
  }

  readRecord(): Record {
    return this.records[this.recordIndex];
  }

  goToRecord(recordIndex: number) {
    this.recordIndex = recordIndex;
  }

  write(record): boolean {
    this.records.push(record);
    return true;
  }
}