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

export interface OutputFormatSpec {
  format: OutputFormat,
  params: any,
}

export class RecordOutputFactory {

  /**
   *
   * @param formatSpec
   * @param output
   * @param sortedRecord A record that will help to build column headings.
   */
  static getRecordOutput(formatSpec: OutputFormatSpec, output: Output, sortedRecord: Record): RecordOutput {
    let recordOutput: RecordOutput;
    switch (formatSpec.format) {
      case OutputFormat.csv:
        recordOutput = new CsvRecordOutput(output, sortedRecord, formatSpec.params);
        break;
      case OutputFormat.xml:
        recordOutput = new XmlRecordOutput(output, sortedRecord, formatSpec.params);
        break;
      case OutputFormat.memory:
        recordOutput = new MemoryRecordOutput(output, sortedRecord, formatSpec.params);
        break;
      default:
        recordOutput = new UdbTextRecordOutput(output, formatSpec.params);
    }
    return recordOutput;
  }
}
