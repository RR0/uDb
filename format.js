const util = require('./util');
const geo = require('./geo');
const time = require('./time');
const flags = require('./flags');

exports.RecordFormatter = class RecordFormatter {

  constructor(prototypeRecord) {
    this.sortedRecord = this.formatProperties(util.copy(prototypeRecord));
  }

  static flagsKeysStr(flagsByte, flagsLabels) {
    let flagsStr = '';
    let keys = Object.keys(flagsLabels);
    let sep = '';

    util.forEachBit(flagsByte, (i) => {
      let key = keys[i];
      flagsStr += sep + (flagsLabels[key].name ? flagsLabels[key].name : key);
      sep = ', ';
    });
    return flagsStr;
  }

  format(record) {
    return this.formatData(this.formatProperties(record));
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
    const sortedRecord = util.sortProps(record, (prop1, prop2) => {
      let index1 = expectedKeysOrder.indexOf(prop1);
      if (index1 < 0) index1 = 1000;
      let index2 = expectedKeysOrder.indexOf(prop2);
      if (index2 < 0) index2 = 1000;
      return index1 < index2 ? -1 : index1 > index2 ? 1 : 0;
    });
    return sortedRecord;
  }

  formatData(record) {
    let continent = geo.getContinent(record.continentCode);
    if (continent) {
      record.continent = continent.name;
      delete record.continentCode;

      let country = geo.getCountry(continent, record.countryCode);
      record.country = country.name;
      delete record.countryCode;

      record.stateOrProvince = geo.getStateOrProvince(country, record);
    }
    record.longitude = parseFloat(record.longitude.toFixed(2));
    record.latitude = parseFloat(record.latitude.toFixed(2));
    record.locale = geo.getLocale(record);
    record.year = time.getYear(record);
    record.month = time.getMonth(record);
    record.day = time.getDay(record);
    record.hour = time.getTime(record);
    record.elevation = geo.getElevation(record);
    record.relativeAltitude = geo.getRelativeAltitude(record);
    record.locationFlags = RecordFormatter.flagsKeysStr(record.locationFlags, flags.locationFlagsLabels);
    record.miscellaneousFlags = RecordFormatter.flagsKeysStr(record.miscellaneousFlags, flags.miscellaneousFlagsLabels);
    record.typeOfUfoCraftFlags = RecordFormatter.flagsKeysStr(record.typeOfUfoCraftFlags, flags.typeOfUfoCraftFlagsLabels);
    record.aliensMonstersFlags = RecordFormatter.flagsKeysStr(record.aliensMonstersFlags, flags.aliensMonstersLabels);
    record.apparentUfoOccupantActivitiesFlags = RecordFormatter.flagsKeysStr(record.apparentUfoOccupantActivitiesFlags, flags.apparentUfoOccupantActivitiesLabels);
    record.placesVisitedAndThingsAffectedFlags = RecordFormatter.flagsKeysStr(record.placesVisitedAndThingsAffectedFlags, flags.placesVisitedAndThingsAffectedLabels);
    record.evidenceAndSpecialEffectsFlags = RecordFormatter.flagsKeysStr(record.evidenceAndSpecialEffectsFlags, flags.evidenceAndSpecialEffectsLabels);
    record.miscellaneousDetailsFlags = RecordFormatter.flagsKeysStr(record.miscellaneousDetailsFlags, flags.miscellaneousDetailsLabels);
    return record;
  }
};
