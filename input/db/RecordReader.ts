import {Logger} from "../../Logger";
import {Record} from "./BinaryRecordReader";

export interface Record {
  id: number;
}

/**
 * Creates an InputRecord from a raw binary record.
 */
export abstract class RecordReader {
  protected _record: Record;

  protected _filePos: number;
  protected _recordPos: number;

  protected constructor(protected _buffer, protected _logger: Logger) {
  }

  protected get record(): Record {
    return this._record;
  }

  protected get logger() {
    return this._logger;
  }

  protected get buffer() {
    return this._buffer;
  }

  protected get recordPos(): number {
    return this._recordPos;
  }

  protected get filePos() {
    return this._filePos;
  }

  read(filePos: number, recordIndex?: number): Record {
    const record: Record = this._record = this.createRecord(recordIndex);
    this._recordPos = 0;
    this._filePos = filePos;
    return record;
  }

  protected createRecord(id?: number): Record {
    return <Record>{id};
  }
}
