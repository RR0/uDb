import {FileInput} from "../FileInput";
import {RecordFormatter} from "../../output/db/RecordFormatter";

export interface Database {
  init(): Promise<FileInput>;
  recordFormatter(): RecordFormatter;
}