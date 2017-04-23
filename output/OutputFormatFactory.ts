import {CsvRecordOutput} from "./CsvRecordOutput";
import {DefaultRecordOutput} from "./DefaultRecordOutput";
import {Output, RecordOutput} from "./RecordOutput";
import {OutputRecord} from "./OutputRecord";
import {XmlRecordOutput} from "./XmlRecordOutput";
import WritableStream = NodeJS.WritableStream;
import {MemoryRecordOutput} from "./MemoryRecordOutput";

export class OutputFormatFactory {

  static getOutputFormat(format: string, output: Output, sortedRecord: OutputRecord): RecordOutput {
    let outputFormat: RecordOutput;
    switch (format.toLocaleLowerCase()) {
      case 'csv':
        outputFormat = new CsvRecordOutput(output, sortedRecord);
        break;
      case 'xml':
        outputFormat = new XmlRecordOutput(output, sortedRecord);
        break;
      case 'memory':
        outputFormat = new MemoryRecordOutput(output, sortedRecord);
        break;
      default:
        outputFormat = new DefaultRecordOutput(output);
    }
    return outputFormat;
  }
}