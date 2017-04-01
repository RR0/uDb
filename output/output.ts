import {OutputRecord} from "./OutputRecord";

export interface RecordOutput {
  write(record: OutputRecord, position?: number);
  end();
}