import {OutputRecord} from "./OutputRecord";

export interface Output {
  write(object: any);
}

export interface RecordOutput {
  write(record: OutputRecord, position?: number);
  end();
}