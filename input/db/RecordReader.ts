import {InputRecord} from "../InputRecord";
import {Logger} from "../../Logger";
import {Util} from "../../util";

export interface Record {
  id: number;
}

/**
 * Creates an InputRecord from a raw binary record.
 */
export abstract class RecordReader {
  private _filePos: number;
  private _recordPos: number;
  private _recordHex: string;
  private _record: InputRecord;
  private unknownOnly: boolean = true;

  constructor(private _buffer, private _logger: Logger) {
  }

  protected get record(): InputRecord {
    return this._record;
  }

  protected get logger() {
    return this._logger;
  }

  protected get recordPos(): number {
    return this._recordPos;
  }

  protected get buffer() {
    return this._buffer;
  }

  protected get filePos() {
    return this._filePos;
  }

  protected get recordHex() {
    return this._recordHex;
  }

  readed(l: number) {
    let max = this._recordPos + l;
    for (; this._recordPos < max; ++this._recordPos) {
      let value = this._buffer[this._recordPos];
      this._recordHex += value < 0x10 ? '0' : '';
      this._recordHex += value.toString(16) + ' ';
    }
  }

  logReadPos(prop: string) {
    if (!this.unknownOnly || prop.startsWith('unknown')) {
      let pos = this._filePos + this._recordPos;
      let value = this._record[prop];
      if (typeof value === 'string') {
        value = `'${value}'`;
      } else {
        value += ` (0x${value.toString(16)}, ${value.toString(2)})`;
      }
      let logStr = `at ${pos} (0x${pos.toString(16)}) read ${prop}=${value}`;
      this._logger.logDebug(logStr);
    }
  }

  readString(length: number, prop: string) {
    let str = '';
    for (let i = this._recordPos; i < this._recordPos + length; i++) {
      str += String.fromCharCode(this._buffer[i]);
    }
    this._record[prop] = RecordReader.validString(Util.trimZeroEnd(str)).trim();
    this.logReadPos(prop);
    this.readed(length);
    return str;
  }

  readByte(prop: string) {
    const byte = this._buffer[this._recordPos];
    this._record[prop] = byte;
    this.logReadPos(prop);
    this.readed(1);
    return byte;
  }

  readByteBits(prop1: string, size: number, prop2: string) {
    const byte = this._buffer[this._recordPos];
    this._record[prop1] = byte >> size;
    this._record[prop2] = byte & ((1 << size) - 1);
    this.logReadPos(prop1);
    this.logReadPos(prop2);
    this.readed(1);
    return byte;
  }

  readNibbles(prop1: string, prop2: string) {
    return this.readByteBits(prop1, 4, prop2);
  }

  static readInt16LE(buffer, pos) {
    const byteA = buffer[pos + 1];
    const byteB = buffer[pos];
    const sign = byteA & (1 << 7);
    let int = (((byteA & 0xFF) << 8) | (byteB & 0xFF));
    if (sign) {
      int = 0xFFFF0000 | int;  // fill in most significant bits with 1's
    }
    return int;
  }

  readSignedInt(prop: string) {
    let sInt = RecordReader.readInt16LE(this._buffer, this._recordPos);
    this._record[prop] = sInt;
    this.logReadPos(prop);
    this.readed(2);
    return sInt;
  }

  static validString(str: string) {
    const invalidXmlChars = /[^\x09\x0A\x0D\x20-\xFF]/g;
    return str ? str.replace(invalidXmlChars, ' ') : '';
  }

  read(filePos: number): InputRecord {
    const record: InputRecord = this._record = <InputRecord>{};
    this._recordHex = '';
    this._recordPos = 0;
    this._filePos = filePos;

    return record;
  }
}