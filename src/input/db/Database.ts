import { RecordFormatter } from "../../output/index.js"
import { Logger } from "../../Logger.js"
import { RecordReader } from "./RecordReader.js"
import { Input } from "../Input.js"

export interface DatabaseConfig {
}

export interface Database {
  logger: Logger;

  init(): Promise<Input>;

  recordFormatter(): RecordFormatter;

  recordReader(buffer): RecordReader;
}
