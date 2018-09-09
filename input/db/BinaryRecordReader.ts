import {Logger} from "../../Logger";
import {Util} from "../../util";
import {RecordReader} from "./RecordReader";

export interface Record {
  id: number;
}

/**
 * Creates an InputRecord from a raw binary record.
 */
export abstract class BinaryRecordReader extends RecordReader {
  private _recordHex: string;
  private unknownOnly: boolean = true;

  protected constructor(buffer, logger: Logger) {
    super(buffer, logger);
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
    this._record[prop] = BinaryRecordReader.validString(Util.trimZeroEnd(str)).trim();
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
    let sInt = BinaryRecordReader.readInt16LE(this._buffer, this._recordPos);
    this._record[prop] = sInt;
    this.logReadPos(prop);
    this.readed(2);
    return sInt;
  }

  static validString(str: string) {
    const invalidXmlChars = /[^\x09\x0A\x0D\x20-\xFF]/g;
    return str ? str.replace(invalidXmlChars, ' ') : '';
  }


  read(filePos: number): Record {
    let record = super.read(filePos);
    this._recordHex = '';
    return record;
  }
}