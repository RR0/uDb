import WritableStream = NodeJS.WritableStream;
import {Memory} from "./Memory";
import {Output} from "./RecordOutput";

import {FileOutput} from "./FileOutput";

export class OutputFactory {

  static getOutput(out?: string) {
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