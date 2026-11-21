import {UdbInputRecord} from "./UdbInputRecord.js"
import {Logger} from "../../../Logger.js"
import {BinaryRecordReader} from "../BinaryRecordReader.js"

/**
 * Creates an Udb InputRecord from a raw binary record buffer.
 */
export class UdbRecordReader extends BinaryRecordReader {

  constructor(buffer, logger: Logger) {
    super(buffer, logger)
  }

  /**
   * Reads a longitude or latitude.
   *
   * It is stored as a signed 16 bits integer counting units of 20 seconds of arc (1/180 degree),
   * as the *U* manual states that "seconds are rounded to the nearest 20 seconds".
   * Positive longitudes are West.
   */
  readLatLong(prop: "longitude" | "latitude") {
    const sInt = this.readSignedInt(prop)
    let degrees = sInt / 180
    if (prop === "longitude") {
      degrees = -degrees
    }
    this.record[prop] = degrees
    return sInt
  }

  read(filePos: number, recordIndex?: number): UdbInputRecord {
    const record = <UdbInputRecord>super.read(filePos, recordIndex);

    this.readSignedInt('year');
    this.readByte('locale');
    this.readNibbles('unknownMonth', 'month');
    this.readByteBits('refIndexHigh', 5, 'day');
    this.readByte('time');
    this.readByte('ymdt');
    this.readSignedInt('duration');
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
    record.refIndex = (record.refIndexHigh << 8) + record.refIndex;  // 11 bits

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
