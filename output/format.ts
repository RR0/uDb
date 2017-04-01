import {Util} from "../util";
import {Geo} from "../geo";
import {Time} from "../time";
import {Flags} from "../flags";

export class RecordFormatter {
  private sortedRecord: any;

  constructor(prototypeRecord) {
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

  formatProperties(record) {
    delete record.beforeMonth;
    delete record.refIndexHigh;
    delete record.ymdt;
    delete record.unknown1;
    delete record.unknown2;
    delete record.unknown3;

    delete record.continentCode;
    record.continent = 'continent';

    delete record.countryCode;
    record.country = 'country';

    let expectedKeysOrder = ['year', 'month', 'day', 'hour', 'location', 'stateOrProvince', 'country', 'continent', 'title', 'description', 'locale', 'duration',];
    let sortedRecord = Util.sortProps(record, (prop1, prop2) => {
      let index1 = expectedKeysOrder.indexOf(prop1);
      if (index1 < 0) index1 = 1000;
      let index2 = expectedKeysOrder.indexOf(prop2);
      if (index2 < 0) index2 = 1000;
      return index1 < index2 ? -1 : index1 > index2 ? 1 : 0;
    });
    return sortedRecord;
  }

  formatData(record) {
    let continent = Geo.getContinent(record.continentCode);
    if (continent) {
      record.continent = continent.name;
      delete record.continentCode;

      let country = Geo.getCountry(continent, record.countryCode);
      record.country = country.name;
      delete record.countryCode;

      record.stateOrProvince = Geo.getStateOrProvince(country, record);
    }
    record.longitude = parseFloat(record.longitude.toFixed(2));
    record.latitude = parseFloat(record.latitude.toFixed(2));
    record.locale = Geo.getLocale(record);
    record.year = Time.getYear(record);
    record.month = Time.getMonth(record);
    record.day = Time.getDay(record);
    record.hour = Time.getTime(record);
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
