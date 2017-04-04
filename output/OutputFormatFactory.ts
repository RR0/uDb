import {CsvRecordOutput} from "./csv";
import {DefaultRecordOutput} from "./default";
import {RecordOutput} from "./output";
import {OutputRecord} from "./OutputRecord";
import {XmlRecordOutput} from "./xml";
import WritableStream = NodeJS.WritableStream;

export class OutputFormatFactory {

  static getOutputFormat(format: string, output: WritableStream, sortedRecord: OutputRecord, primaryReferences) {
    let outputFormat: RecordOutput;
    switch (format.toLocaleLowerCase()) {
      case 'csv':
        outputFormat = new CsvRecordOutput(output, sortedRecord);
        break;
      case 'xml':
        outputFormat = new XmlRecordOutput(output, sortedRecord);
        break;
      default:
        outputFormat = new DefaultRecordOutput(output, primaryReferences);
    }
    return outputFormat;
  }
}