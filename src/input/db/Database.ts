import {RecordFormatter} from "../../output/db/RecordFormatter"
import {Logger} from "../../Logger"
import {RecordReader} from "./RecordReader"
import {Input} from "../Input"

export interface Database {
  logger: Logger;

  init(): Promise<Input>;

  recordFormatter(): RecordFormatter;

  recordReader(buffer): RecordReader;
}
