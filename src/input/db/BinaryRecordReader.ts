import {Logger} from "../../Logger.js"
import {Util} from "../../Util.js"
import {RecordReader} from "./RecordReader.js"
import {UdbRecord} from "./UdbRecord.js"

/**
 * Creates an InputRecord from a raw binary record.
 */
export abstract class BinaryRecordReader extends RecordReader {
  private _recordHex: string
  private unknownOnly: boolean = true

  protected constructor(buffer, logger: Logger) {
    super(buffer, logger)
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
      str += BinaryRecordReader.cp437Char(this._buffer[i]);
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

  /**
   * Characters 0x80-0xFF of the MS-DOS code page 437 (the one *U* used).
   */
  private static readonly CP437_HIGH = "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "

  /**
   * Control codes that MS-DOS displayed as glyphs and that *U* uses in texts (mostly 0x18 = ↑ and 0x19 = ↓).
   */
  private static readonly CP437_LOW: { [code: number]: string } = {0x18: "↑", 0x19: "↓", 0x1A: "→", 0x1B: "←"}

  /**
   * Decodes a byte as a MS-DOS code page 437 character.
   */
  static cp437Char(byte: number): string {
    if (byte >= 0x80) {
      return BinaryRecordReader.CP437_HIGH.charAt(byte - 0x80)
    }
    return BinaryRecordReader.CP437_LOW[byte] || String.fromCharCode(byte)
  }

  /**
   * Replaces characters that are invalid in XML 1.0 by spaces.
   */
  static validString(str: string) {
    const invalidXmlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g;
    return str ? str.replace(invalidXmlChars, ' ') : '';
  }


  read(filePos: number, recordIndex?: number): UdbRecord {
    let record = super.read(filePos, recordIndex)
    this._recordHex = ""
    return record
  }
}
