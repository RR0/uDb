import {Record} from "../input/db/RecordReader";

export interface Output {
  write(object: any);
}

export interface RecordOutput {
  write(record: Record);
  end();
}
