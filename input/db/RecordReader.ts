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
  private recordPos: number;
  private _recordHex: string;
  private record: InputRecord;
  private unknownOnly: boolean = true;

  constructor(private buffer, private _logger: Logger) {
  }

  get logger() {
    return this._logger;
  }

  get filePos() {
    return this._filePos;
  }

  get recordHex() {
    return this._recordHex;
  }

  readed(l: number) {
    let max = this.recordPos + l;
    for (; this.recordPos < max; ++this.recordPos) {
      let value = this.buffer[this.recordPos];
      this._recordHex += value < 0x10 ? '0' : '';
      this._recordHex += value.toString(16) + ' ';
    }
  }

  logReadPos(prop: string) {
    if (!this.unknownOnly || prop.startsWith('unknown')) {
      let pos = this._filePos + this.recordPos;
      let value = this.record[prop];
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
    for (let i = this.recordPos; i < this.recordPos + length; i++) {
      str += String.fromCharCode(this.buffer[i]);
    }
    this.record[prop] = RecordReader.validString(Util.trimZeroEnd(str)).trim();
    this.logReadPos(prop);
    this.readed(length);
    return str;
  }

  readByte(prop: string) {
    const byte = this.buffer[this.recordPos];
    this.record[prop] = byte;
    this.logReadPos(prop);
    this.readed(1);
    return byte;
  }

  readByteBits(prop1: string, size: number, prop2: string) {
    const byte = this.buffer[this.recordPos];
    this.record[prop1] = byte >> size;
    this.record[prop2] = byte & ((1 << size) - 1);
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
    let sInt = RecordReader.readInt16LE(this.buffer, this.recordPos);
    this.record[prop] = sInt;
    this.logReadPos(prop);
    this.readed(2);
    return sInt;
  }

  readLatLong(prop) {
    let firstByte = this.buffer[this.recordPos + 1];
    let extraBit = firstByte >> 7;
    this._logger.logDebug('extrabit=' + extraBit);
    let sInt = this.readSignedInt(prop);
    sInt = (sInt >> 1);
    sInt = sInt / 100;
    // logDebug('orig=' + sInt);
    this.record[prop] = sInt * 1.11111111111;
    return sInt;
  }

  static validString(str: string) {
    const invalidXmlChars = /[^\x09\x0A\x0D\x20-\xFF]/g;
    return str ? str.replace(invalidXmlChars, ' ') : '';
  }

  read(filePos: number): InputRecord {
    const record: InputRecord = this.record = <InputRecord>{};
    this._recordHex = '';
    this.recordPos = 0;
    this._filePos = filePos;

    return record;
  }
}