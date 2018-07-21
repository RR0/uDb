import {CsvRecordOutput} from "./CsvRecordOutput";
import {UdbTextRecordOutput} from "./db/udb/UdbTextRecordOutput";
import {Output, RecordOutput} from "./RecordOutput";
import {XmlRecordOutput} from "./XmlRecordOutput";
import {MemoryRecordOutput} from "./MemoryRecordOutput";
import {Record} from "../input/db/RecordReader";

export enum OutputFormat {
  xml,
  csv,
  memory
}
export class RecordOutputFactory {

  static getRecordOutput(format: OutputFormat, output: Output, sortedRecord: Record): RecordOutput {
    let recordOutput: RecordOutput;
    switch (format) {
      case OutputFormat.csv:
        recordOutput = new CsvRecordOutput(output, sortedRecord);
        break;
      case OutputFormat.xml:
        recordOutput = new XmlRecordOutput(output, sortedRecord);
        break;
      case OutputFormat.memory:
        recordOutput = new MemoryRecordOutput(output, sortedRecord);
        break;
      default:
        recordOutput = new UdbTextRecordOutput(output);
    }
    return recordOutput;
  }
}