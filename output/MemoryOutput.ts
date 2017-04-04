import {Output} from "./RecordOutput";

export class MemoryOutput implements Output {
  private records = [];

  write(record): boolean {
    this.records.push(record);
    return true;
  }
}