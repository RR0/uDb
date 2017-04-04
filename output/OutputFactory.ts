import * as fs from "fs";
import WritableStream = NodeJS.WritableStream;

export class OutputFactory {

  static getOutput(out: string) {
    let output: WritableStream = process.stdout;
    if (out) {
      output = fs.createWriteStream(out, {flags: 'w'});
    }
    return output;
  }
}