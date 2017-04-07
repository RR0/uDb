import {Output} from "./RecordOutput";
import {Input} from "../input/Input";
import {OutputRecord} from "./OutputRecord";

export class Memory implements Input<OutputRecord>, Output {
  private records = [];
  private recordIndex;

  hasNext(): boolean {
    return this.recordIndex < this.records.length - 1;
  }

  readRecord(): OutputRecord {
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