import {OutputRecord} from "./db/OutputRecord";

export interface Output {
  write(object: any);
}

export interface RecordOutput {
  write(record: OutputRecord);
  end();
}