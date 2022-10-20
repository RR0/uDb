import {Logger} from "../../Logger"
import {UdbRecord} from "./UdbRecord"

/**
 * Creates an InputRecord from a raw binary record.
 */
export abstract class RecordReader {
  protected _record: UdbRecord

  protected _filePos: number
  protected _recordPos: number

  protected constructor(protected _buffer, protected _logger: Logger) {
  }

  protected get record(): UdbRecord {
    return this._record
  }

  protected get logger() {
    return this._logger;
  }

  protected get buffer() {
    return this._buffer;
  }

  protected get recordPos(): number {
    return this._recordPos
  }

  protected get filePos() {
    return this._filePos
  }

  read(filePos: number, recordIndex?: number): UdbRecord {
    const record: UdbRecord = this._record = this.createRecord(recordIndex)
    this._recordPos = 0
    this._filePos = filePos
    return record
  }

  protected createRecord(id?: number): UdbRecord {
    return <UdbRecord>{id}
  }
}
