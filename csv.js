const util = require('./util');
const geo = require('./geo');
const time = require('./time');
const flags = require('./flags');

class CsvRecordOutput {
  constructor(separator, output) {
    this.separator = separator;
    this.output = output;
  }

  csvValue(value) {
    if (typeof value === 'string') {
      value = value.replace(/"/g, '""');  // Escape quotes in value
      value = '"' + value + '"';
    }
    return value;
  }

  format(record) {
    return record;
  }

  desc(record) {
    let str = '';
    let sep = '';
    for (let i = 0; i < this.props.length; ++i) {
      const prop = this.props[i];
      let value = record[prop];
      str += sep + this.csvValue(value);
      sep = this.separator;
    }
    return str;
  }

  getColumnValue(record, prop) {
    return record[prop];
  }

  getColumns(record) {
    return Object.keys(record);
  }

  write(record) {
    if (!this.props) {
      this.props = this.getColumns(record);
      const headerRecord = {};
      for (let i = 0; i < this.props.length; ++i) {
        const prop = this.props[i];
        headerRecord[prop] = prop;
      }
      this.output.write(this.desc(headerRecord) + '\n');
    }
    record = this.format(record);
    this.output.write(this.desc(record) + '\n');
  }
}

exports.CsvRecordOutput = CsvRecordOutput;

exports.ReadableCsvRecordOutput = class ReadableCsvRecordOutput extends CsvRecordOutput {
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
    record.locationFlags = ReadableCsvRecordOutput.flagsKeysStr(record.locationFlags, flags.locationFlagsLabels);
    record.miscellaneousFlags = ReadableCsvRecordOutput.flagsKeysStr(record.miscellaneousFlags, flags.miscellaneousFlagsLabels);
    record.typeOfUfoCraftFlags = ReadableCsvRecordOutput.flagsKeysStr(record.typeOfUfoCraftFlags, flags.typeOfUfoCraftFlagsLabels);
    record.aliensMonstersFlags = ReadableCsvRecordOutput.flagsKeysStr(record.aliensMonstersFlags, flags.aliensMonstersLabels);
    record.apparentUfoOccupantActivitiesFlags = ReadableCsvRecordOutput.flagsKeysStr(record.apparentUfoOccupantActivitiesFlags, flags.apparentUfoOccupantActivitiesLabels);
    record.placesVisitedAndThingsAffectedFlags = ReadableCsvRecordOutput.flagsKeysStr(record.placesVisitedAndThingsAffectedFlags, flags.placesVisitedAndThingsAffectedLabels);
    record.evidenceAndSpecialEffectsFlags = ReadableCsvRecordOutput.flagsKeysStr(record.evidenceAndSpecialEffectsFlags, flags.evidenceAndSpecialEffectsLabels);
    record.miscellaneousDetailsFlags = ReadableCsvRecordOutput.flagsKeysStr(record.miscellaneousDetailsFlags, flags.miscellaneousDetailsLabels);
    return record;
  }

  getColumns(record) {
    const headerRecord = util.copy(record);

    delete headerRecord.beforeMonth;
    delete headerRecord.refIndexHigh;
    delete headerRecord.ymdt;
    delete headerRecord.unknown1;
    delete headerRecord.unknown2;
    delete headerRecord.unknown3;

    delete headerRecord.continentCode;
    headerRecord.continent = 'continent';

    delete headerRecord.countryCode;
    headerRecord.country = 'country';

    let expectedKeysOrder = ['year', 'month', 'day', 'hour', 'location', 'stateOrProvince', 'country', 'continent', 'title', 'description', 'locale', 'duration',];
    const sortedRecord = util.sortProps(headerRecord, (prop1, prop2) => {
      let index1 = expectedKeysOrder.indexOf(prop1);
      if (index1 < 0) index1 = 1000;
      let index2 = expectedKeysOrder.indexOf(prop2);
      if (index2 < 0) index2 = 1000;
      return index1 < index2 ? -1 : index1 > index2 ? 1 : 0;
    });

    return super.getColumns(sortedRecord);
  }
};
