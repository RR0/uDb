import {CsvRecordOutput} from "./CsvRecordOutput";
import {DefaultRecordOutput} from "./db/udb/DefaultRecordOutput";
import {Output, RecordOutput} from "./RecordOutput";
import {XmlRecordOutput} from "./XmlRecordOutput";
import {MemoryRecordOutput} from "./MemoryRecordOutput";
import {OutputRecord} from "./db/OutputRecord";

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