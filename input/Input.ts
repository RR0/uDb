import {InputRecord} from "./InputRecord";

export interface Input {
  readRecord(): InputRecord;
}
