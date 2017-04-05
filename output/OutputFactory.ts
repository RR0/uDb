import * as fs from "fs";
import WritableStream = NodeJS.WritableStream;
import {Memory} from "./Memory";
import {Output} from "./RecordOutput";
import {WriteStream} from "fs";

class FileOutput implements Output {

  private writeStream: WriteStream;

  constructor(out: string) {
    this.writeStream = fs.createWriteStream(out, {flags: 'w'});
  }
  write(object: any) {
    this.writeStream.write(object);
  }
}
export class OutputFactory {

  static getOutput(out: string) {
    let output: Output = process.stdout;
    if (out) {
      if (out == 'memory') {
        output = new Memory();
      } else {
        output = new FileOutput(out);
      }
    }
    return output;
  }
}