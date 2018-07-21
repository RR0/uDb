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
    let expectedKeysOrder = ['header', 'desc'];
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
    return record;
  }
}
