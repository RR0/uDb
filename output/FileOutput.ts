import * as fs from "fs";
import {WriteStream} from "fs";
import {Output} from "./RecordOutput";

export class FileOutput implements Output {
  private writeStream: WriteStream;

  constructor(out: string) {
    this.writeStream = fs.createWriteStream(out, {flags: 'w'});
  }
  write(object: any) {
    this.writeStream.write(object);
  }

  toString() {
    return `file ${this.writeStream.path}`;
  }
}
