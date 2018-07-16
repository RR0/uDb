import {CsvRecordOutput} from "./CsvRecordOutput";
import {TextRecordOutput} from "./db/udb/TextRecordOutput";
import {Output, RecordOutput} from "./RecordOutput";
import {XmlRecordOutput} from "./XmlRecordOutput";
import {MemoryRecordOutput} from "./MemoryRecordOutput";
import {OutputRecord} from "./db/OutputRecord";

export enum OutputFormat {
  xml,
  csv,
  memory
}
export class RecordOutputFactory {

  static getRecordOutput(format: OutputFormat, output: Output, sortedRecord: OutputRecord): RecordOutput {
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
        recordOutput = new TextRecordOutput(output);
    }
    return recordOutput;
  }
}