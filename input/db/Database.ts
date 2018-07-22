import {FileInput} from "../FileInput";
import {RecordFormatter} from "../../output/db/RecordFormatter";
import {Logger} from "../../Logger";
import {RecordReader} from "./RecordReader";

export interface Database {
  logger: Logger;

  init(): Promise<FileInput>;

  recordFormatter(): RecordFormatter;

  recordReader(buffer): RecordReader;
}