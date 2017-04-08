import {InputRecord} from "./input/InputRecord";
import {Logger} from "./log";
import {Util} from "./util";

export interface Record {
  id: number;
}

/**
 * Creates an InputRecord from a raw binary record.
 */
export class RecordReader {
  private filePos: number;
  private recordPos: number;
  private recordHex: string;
  private record: InputRecord;
  private unknownOnly: boolean = true;

  constructor(private buffer, private logger: Logger) {
  }

  readed(l: number) {
    let max = this.recordPos + l;
    for (; this.recordPos < max; ++this.recordPos) {
      let value = this.buffer[this.recordPos];
      this.recordHex += value < 0x10 ? '0' : '';
      this.recordHex += value.toString(16) + ' ';
    }
  }

  logReadPos(prop: string) {
    if (!this.unknownOnly || prop.startsWith('unknown')) {
      let pos = this.filePos + this.recordPos;
      let value = this.record[prop];
      if (typeof value === 'string') {
        value = `'${value}'`;
      } else {
        value += ` (0x${value.toString(16)}, ${value.toString(2)})`;
      }
      let logStr = `at ${pos} (0x${pos.toString(16)}) read ${prop}=${value}`;
      this.logger.logDebug(logStr);
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
    this.logger.logDebug('extrabit=' + extraBit);
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
    this.recordHex = '';
    this.recordPos = 0;
    this.filePos = filePos;

    this.readSignedInt('year');
    this.readNibbles('unknownLocale', 'locale');
    this.readNibbles('unknownMonth', 'month');
    this.readByteBits('refIndexHigh', 5, 'day');
    this.readByte('time');
    this.readByte('ymdt');
    this.readByte('duration');
    this.readByte('unknown1');
    this.readLatLong('longitude');
    this.readLatLong('latitude');
    this.readSignedInt('elevation');
    this.readSignedInt('relativeAltitude');
    this.readByte('unknown2');
    this.readNibbles('continentCode', 'countryCode');
    this.readString(3, 'stateOrProvince');
    this.readByte('unknown3');
    this.readByte('locationFlags');
    this.readByte('miscellaneousFlags');
    this.readByte('typeOfUfoCraftFlags');
    this.readByte('aliensMonstersFlags');
    this.readByte('apparentUfoOccupantActivitiesFlags');
    this.readByte('placesVisitedAndThingsAffectedFlags');
    this.readByte('evidenceAndSpecialEffectsFlags');
    this.readByte('miscellaneousDetailsFlags');
    this.readString(78, 'description');
    const split = record.description.split(':');
    record.location = split[0];
    record.title = split[1];
    record.description = split[2];
    const description2 = split[3];
    if (description2) {
      record.description += '\n' + description2;
    }
    const description3 = split[4];
    if (description3) {
      record.description += '\n' + description3;
    }
    const description4 = split[5];
    if (description4) {
      record.description += '\n' + description4;
    }
    this.readByte('ref');

    this.readByte('refIndex');
    record.refIndex = (record.refIndexHigh << 8) + record.refIndex;

    this.readNibbles('strangeness', 'credibility');

    const width = 3 * 16;
    const dataRow = (n) => {
      let rowPos = this.filePos + n * width / 3;
      return rowPos + ': ' + this.recordHex.substring(width * n, width * (n + 1)) + '\n';
    };
    this.logger.logDebug(`buffer=\n${dataRow(0) + dataRow(1) + dataRow(2) + dataRow(3) + dataRow(4) + dataRow(5) + dataRow(6)}`);
    return record;
  }
}