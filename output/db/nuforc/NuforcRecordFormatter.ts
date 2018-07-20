import {Util} from "../../../util";
import {NuforcInputRecord} from "../../../input/db/Nuforc/NuforcInputRecord";
import {NuforcOutputRecord} from "./NuforcOutputRecord";
import {RecordFormatter} from "../RecordFormatter";

/**
 * Formats input records as output records.
 */
export class NuforcRecordFormatter implements RecordFormatter {

  constructor() {}

  formatProperties(record: NuforcInputRecord): NuforcOutputRecord {
    delete record.unknownMonth;
    delete record.unknownLocale;
    delete record.refIndexHigh;
    delete record.ymdt;
    delete record.unknown1;
    delete record.unknown2;
    delete record.unknown3;
    delete record.continentCode;
    delete record.countryCode;
    delete record.refIndex;

    let expectedKeysOrder = ['id', 'year', 'month', 'day', 'time', 'location', 'stateOrProvince', 'country', 'continent', 'title', 'description', 'locale', 'duration',];
    let sortedRecord: NuforcOutputRecord = <NuforcOutputRecord>Util.sortProps(record, (prop1, prop2) => {
      let index1 = expectedKeysOrder.indexOf(prop1);
      if (index1 < 0) index1 = 1000;
      let index2 = expectedKeysOrder.indexOf(prop2);
      if (index2 < 0) index2 = 1000;
      return index1 < index2 ? -1 : index1 > index2 ? 1 : 0;
    });
    return sortedRecord;
  }

  formatData(rec: NuforcInputRecord): NuforcOutputRecord {
    const record: NuforcOutputRecord = <NuforcOutputRecord>Util.copy(rec);
    record.longitude = parseFloat(record.longitude.toFixed(2));
    record.latitude = parseFloat(record.latitude.toFixed(2));
    delete record.refIndex;
    return record;
  }
}
