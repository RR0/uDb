import {Util} from "../../../util";
import {Geo} from "./geo";
import {Time} from "./time";
import {Flags} from "./flags";
import {UdbInputRecord} from "../../../input/db/udb/UdbInputRecord";
import {UdbOutputRecord} from "./UdbOutputRecord";
import {Sources} from "../../../input/db/udb/Sources";
import {RecordFormatter} from "../RecordFormatter";

/**
 * Formats input records as output records.
 */
export class UdbRecordFormatter implements RecordFormatter {

  static flagsKeysStr(flagsByte, flagsLabels) {
    let flagsStr = '';
    let keys = Object.keys(flagsLabels);
    let sep = '';

    Util.forEachBit(flagsByte, (i) => {
      let key = keys[i];
      flagsStr += sep + (flagsLabels[key].name ? flagsLabels[key].name : key);
      sep = ', ';
    });
    return flagsStr;
  }

  constructor(private sources: Sources) {}

  formatProperties(record: UdbInputRecord): UdbOutputRecord {
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
    let sortedRecord: UdbOutputRecord = <UdbOutputRecord>Util.sortProps(record, (prop1, prop2) => {
      let index1 = expectedKeysOrder.indexOf(prop1);
      if (index1 < 0) index1 = 1000;
      let index2 = expectedKeysOrder.indexOf(prop2);
      if (index2 < 0) index2 = 1000;
      return index1 < index2 ? -1 : index1 > index2 ? 1 : 0;
    });
    sortedRecord.continent = 'continent';
    sortedRecord.country = 'country';
    return sortedRecord;
  }

  formatData(rec: UdbInputRecord): UdbOutputRecord {
    const record: UdbOutputRecord = <UdbOutputRecord>Util.copy(rec);
    let continent = Geo.getContinent(rec.continentCode);
    if (continent) {
      record.continent = continent.name;

      let country = Geo.getCountry(continent, rec.countryCode);
      record.country = country.name;

      record.stateOrProvince = Geo.getStateOrProvince(country, record);
    }
    record.longitude = parseFloat(record.longitude.toFixed(2));
    record.latitude = parseFloat(record.latitude.toFixed(2));
    record.locale = Geo.getLocale(record);
    record.year = Time.getYear(record);
    record.month = Time.getMonth(record);
    record.day = Time.getDay(record);
    record.time = Time.getTime(record);
    record.elevation = Geo.getElevation(record);
    record.relativeAltitude = Geo.getRelativeAltitude(record);
    record.locationFlags = UdbRecordFormatter.flagsKeysStr(record.locationFlags, Flags.locationFlagsLabels);
    record.miscellaneousFlags = UdbRecordFormatter.flagsKeysStr(record.miscellaneousFlags, Flags.miscellaneousFlagsLabels);
    record.typeOfUfoCraftFlags = UdbRecordFormatter.flagsKeysStr(record.typeOfUfoCraftFlags, Flags.typeOfUfoCraftFlagsLabels);
    record.aliensMonstersFlags = UdbRecordFormatter.flagsKeysStr(record.aliensMonstersFlags, Flags.aliensMonstersLabels);
    record.apparentUfoOccupantActivitiesFlags = UdbRecordFormatter.flagsKeysStr(record.apparentUfoOccupantActivitiesFlags, Flags.apparentUfoOccupantActivitiesLabels);
    record.placesVisitedAndThingsAffectedFlags = UdbRecordFormatter.flagsKeysStr(record.placesVisitedAndThingsAffectedFlags, Flags.placesVisitedAndThingsAffectedLabels);
    record.evidenceAndSpecialEffectsFlags = UdbRecordFormatter.flagsKeysStr(record.evidenceAndSpecialEffectsFlags, Flags.evidenceAndSpecialEffectsLabels);
    record.miscellaneousDetailsFlags = UdbRecordFormatter.flagsKeysStr(record.miscellaneousDetailsFlags, Flags.miscellaneousDetailsLabels);
    record.ref = this.sources.getReference(rec.ref, record.refIndex);
    delete record.refIndex;
    return record;
  }
}
