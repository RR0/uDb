import {Util} from "./util";

export interface FormattedRecord {
  miscellaneousDetailsFlags: string;
  evidenceAndSpecialEffectsFlags: string;
  placesVisitedAndThingsAffectedFlags: string;
  apparentUfoOccupantActivitiesFlags: string;
  aliensMonstersFlags: string;
  typeOfUfoCraftFlags: string;
  miscellaneousFlags: string;
  locationFlags: string;
  relativeAltitude: string;
  elevation: string | number;
  hour: string | number;
  day: string | number;
  month: string | number;
  year: string | number;
  locale: string;
  latitude: number;
  longitude: number;
  stateOrProvince: any;
  country: string;
  continent: string;
}
export interface RawRecord {
  countryCode: number;
  continentCode: number;
  unknown3: number;
  unknown2: number;
  unknown1: number;
  ymdt: number;
  beforeMonth: number;
  refIndexHigh: number;
  refIndex: any;
  title: string;
  location: string;
  description: string;
}

export class RecordReader {
  private recordPos: number;
  private recordHex: string;
  private recordRead: string;
  private record: any;

  constructor(private buffer, private logger, private position) {
  }

  readed(l) {
    let max = this.recordPos + l;
    for (; this.recordPos < max; ++this.recordPos) {
      let value = this.buffer[this.recordPos];
      this.recordHex += value < 0x10 ? '0' : '';
      this.recordHex += value.toString(16) + ' ';
      this.recordRead += 'rr ';
    }
  }

  logReadPos(prop) {
    let pos = this.position + this.recordPos;
    let value = this.record[prop];
    if (typeof value === 'string') {
      value = `'${value}'`;
    } else {
      value += ` (0x${value.toString(16)}, ${value.toString(2)})`;
    }
    let logStr = `at ${pos} (0x${pos.toString(16)}) read ${prop}=${value}`;
    this.logger.logDebug(logStr);
  }

  readString(length, prop) {
    let str = this.buffer.toString('utf8', this.recordPos, this.recordPos + length);
    this.record[prop] = RecordReader.validString(Util.trimZeroEnd(str)).trim();
    this.logReadPos(prop);
    this.readed(length);
    return str;
  }

  readByte(prop) {
    const byte = this.buffer[this.recordPos];
    this.record[prop] = byte;
    this.logReadPos(prop);
    this.readed(1);
    return byte;
  }

  readByteBits(prop1, size, prop2) {
    const byte = this.buffer[this.recordPos];
    this.record[prop1] = byte >> size;
    this.record[prop2] = byte & ((1 << size) - 1);
    this.logReadPos(prop1);
    this.logReadPos(prop2);
    this.readed(1);
    return byte;
  }

  readNibbles(prop1, prop2) {
    return this.readByteBits(prop1, 4, prop2);
  }

  readSignedInt(prop) {
    let sInt = this.buffer.readInt16LE(this.recordPos);
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

  static validString(str) {
    const invalidXmlChars = /[^\x09\x0A\x0D\x20-\xFF]/g;
    return str ? str.replace(invalidXmlChars, ' ') : '';
  }

  read(): RawRecord {
    const record: RawRecord = this.record = <RawRecord>{};
    this.recordHex = '';
    this.recordRead = '';
    this.recordPos = 0;

    this.readSignedInt('year');
    this.readByte('locale');
    this.readByteBits('beforeMonth', 4, 'month');
    this.readByteBits('refIndexHigh', 5, 'day');
    this.readByte('hour');
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

    this.logger.logDebug(`buffer=${this.recordHex}\n              ${this.recordRead}`);
    return record;
  }
}