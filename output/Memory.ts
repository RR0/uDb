import {Output} from "./RecordOutput";
import {Input} from "../input/Input";

export class Memory implements Input, Output {
  private recordIndex;

  hasNext(): boolean {
    return this.recordIndex < this.records.length;
  }
  private records = [];

  write(record): boolean {
    this.records.push(record);
    return true;
  }
}