import {NuforcInputRecord} from "./NuforcInputRecord";
import {Logger} from "../../../Logger";
import {RecordReader} from "../RecordReader";

/**
 * Creates an Udb InputRecord from a raw binary record.
 */
export class NuforcRecordReader extends RecordReader {

  constructor(buffer, logger: Logger) {
    super(buffer, logger);
  }
  read(filePos: number): NuforcInputRecord {
    const record = <NuforcInputRecord>super.read(filePos);

    this.readSignedInt('year');
    this.readNibbles('unknownLocale', 'locale');
    this.readNibbles('unknownMonth', 'month');
    this.readByteBits('refIndexHigh', 5, 'day');
    this.readByte('time');
    this.readByte('ymdt');
    this.readByte('duration');
    this.readByte('unknown1');
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