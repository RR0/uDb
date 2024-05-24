import { RecordFormatter } from "../../output"
import { Logger } from "../../Logger"
import { RecordReader } from "./RecordReader"
import { Input } from "../Input"

export interface DatabaseConfig {
}

export interface Database {
  logger: Logger;

  init(): Promise<Input>;

  recordFormatter(): RecordFormatter;

  recordReader(buffer): RecordReader;
}
