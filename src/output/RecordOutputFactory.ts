import {Output, RecordOutput} from "./RecordOutput"
import {UdbRecord} from "../input"

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
  static async getRecordOutput(formatSpec: OutputFormatSpec, output: Output<any>,
                               sortedRecord: UdbRecord): Promise<RecordOutput<any>> {
    let recordOutput: RecordOutput<any>
    switch (formatSpec.format) {
      case OutputFormat.csv:
        const {CsvRecordOutput} = await import("./CsvRecordOutput")
        recordOutput = new CsvRecordOutput(output, sortedRecord, formatSpec.params)
        break
      case OutputFormat.xml:
        const {XmlRecordOutput} = await import("./XmlRecordOutput")
        recordOutput = new XmlRecordOutput(output, sortedRecord)
        break
      case OutputFormat.memory:
        const {MemoryRecordOutput} = await import("./MemoryRecordOutput")
        recordOutput = new MemoryRecordOutput(output, sortedRecord, formatSpec.params)
        break
      default:
        const {UdbTextRecordOutput} = await import("./db/udb/UdbTextRecordOutput")
        recordOutput = new UdbTextRecordOutput(output, formatSpec.params)
    }
    return recordOutput
  }
}
