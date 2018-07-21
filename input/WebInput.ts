import {Input} from "./Input";
import {Record} from "./db/RecordReader";
import {Database} from "./db/Database";

export class WebInput implements Input {
  records: string[];

  constructor(private db: Database) {
  }

  goToRecord(recordIndex: number) {
  }

  hasNext(): boolean {
    return false;
  }

  readRecord(recordIndex: number): Record {
    return undefined;
  }
}