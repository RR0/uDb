import {Util} from "../util";
import {Geo} from "../geo";
import {Time} from "../time";
import {Flags} from "../flags";
import {InputRecord} from "../input/InputRecord";
import {OutputRecord} from "./OutputRecord";

export class RecordFormatter {
  private sortedRecord: OutputRecord;

  constructor(prototypeRecord: InputRecord) {
    this.sortedRecord = this.formatProperties(Util.copy(prototypeRecord));
  }

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

  formatProperties(record: InputRecord): OutputRecord {
    delete record.unknownMonthPart;
    delete record.refIndexHigh;
    delete record.ymdt;
    delete record.unknown1;
    delete record.unknown2;
    delete record.unknown3;
    delete record.continentCode;
    delete record.countryCode;

    let expectedKeysOrder = ['year', 'month', 'day', 'time', 'location', 'stateOrProvince', 'country', 'continent', 'title', 'description', 'locale', 'duration',];
    let sortedRecord: OutputRecord = <OutputRecord>Util.sortProps(record, (prop1, prop2) => {
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

  formatData(rec: InputRecord): OutputRecord {
    const record: OutputRecord = <OutputRecord>Util.copy(rec);
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
    record.locationFlags = RecordFormatter.flagsKeysStr(record.locationFlags, Flags.locationFlagsLabels);
    record.miscellaneousFlags = RecordFormatter.flagsKeysStr(record.miscellaneousFlags, Flags.miscellaneousFlagsLabels);
    record.typeOfUfoCraftFlags = RecordFormatter.flagsKeysStr(record.typeOfUfoCraftFlags, Flags.typeOfUfoCraftFlagsLabels);
    record.aliensMonstersFlags = RecordFormatter.flagsKeysStr(record.aliensMonstersFlags, Flags.aliensMonstersLabels);
    record.apparentUfoOccupantActivitiesFlags = RecordFormatter.flagsKeysStr(record.apparentUfoOccupantActivitiesFlags, Flags.apparentUfoOccupantActivitiesLabels);
    record.placesVisitedAndThingsAffectedFlags = RecordFormatter.flagsKeysStr(record.placesVisitedAndThingsAffectedFlags, Flags.placesVisitedAndThingsAffectedLabels);
    record.evidenceAndSpecialEffectsFlags = RecordFormatter.flagsKeysStr(record.evidenceAndSpecialEffectsFlags, Flags.evidenceAndSpecialEffectsLabels);
    record.miscellaneousDetailsFlags = RecordFormatter.flagsKeysStr(record.miscellaneousDetailsFlags, Flags.miscellaneousDetailsLabels);
    return record;
  }
}
