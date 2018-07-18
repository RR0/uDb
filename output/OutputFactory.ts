import {Memory} from "./Memory";
import {Output} from "./RecordOutput";

import {FileOutput} from "./FileOutput";

export class OutputFactory {

  static create(out?: string): Output {
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