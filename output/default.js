const util = require('../util');
const geo = require('../geo');
const flags = require('../flags');

exports.DefaultRecordOutput = class DefaultRecordOutput {
  constructor(output, position, recordSize, primaryReferences) {
    this.output = output;
    this.position = position;
    this.recordSize = recordSize;
    this.primaryReferences = primaryReferences;
  }

  desc(record) {
    const ref = record.ref ? this.primaryReferences[record.ref] : '';

    let recordIndex = this.position / this.recordSize;
    const month = record.month;
    const day = record.day;
    const timeStr = record.time;
    let desc = '\nRecord #' + recordIndex + '\n  Title       : ' + record.title + '\n' +
      '  Date        : ' + record.year + (month ? '/' + month : '') + (day ? '/' + day : '') + (timeStr ? ', ' + timeStr : '') + '\n';
    const relativeAltitudeStr = record.relativeAltitude;
    const elevationStr = record.elevation;
    let locationStr = '  Location    : ' + record.locale + ', '
      + record.location
      + ' (' + record.stateOrProvince + ', ' + record.country + ', ' + record.continent + '), '
      + geo.ddToDms(record.latitude, record.longitude) + '\n' +
      (elevationStr || relativeAltitudeStr ? ('                ' + (elevationStr ? 'Elevation ' + elevationStr + ' m' : '')
      + (relativeAltitudeStr ? ', relative altitude ' + relativeAltitudeStr + ' m' : '') + '\n') : '');

    function flagsStr(flagsByte, flagsLabels) {
      let flagsStr = '';
      let keys = Object.keys(flagsLabels);
      util.forEachBit(flagsByte, (i) => {
        let key = keys[i];
        let flagLabels = flagsLabels[key];
        flagsStr += '                - ' + key + ': ' + (flagLabels.description ? flagLabels.description : flagLabels) + '\n';
      });
      return flagsStr;
    }

    locationStr += '                Observer:\n' + flagsStr(record.locationFlags, flags.locationFlagsLabels);

    let description = record.description && record.description.replace(/\n/g, '\n                ');
    let descriptionStr = '  Description : ' + (description ? description : '') + '\n';

    let miscFlagsStr = flagsStr(record.miscellaneousFlags, flags.miscellaneousFlagsLabels);
    if (miscFlagsStr) {
      descriptionStr += '                Miscellaneous details and features:\n' + miscFlagsStr;
    }
    let typeOfUfoCraftStr = flagsStr(record.typeOfUfoCraftFlags, flags.typeOfUfoCraftFlagsLabels);
    if (typeOfUfoCraftStr) {
      descriptionStr += '                Type of UFO / Craft:\n' + typeOfUfoCraftStr;
    }

    let aliensMonstersStr = flagsStr(record.aliensMonstersFlags, flags.aliensMonstersLabels);
    if (aliensMonstersStr) {
      descriptionStr += '                Aliens! Monsters! (sorry, no religious figures):\n' + aliensMonstersStr;
    }
    let apparentUfoOccupantActivitiesStr = flagsStr(record.apparentUfoOccupantActivitiesFlags, flags.apparentUfoOccupantActivitiesLabels);
    if (apparentUfoOccupantActivitiesStr) {
      descriptionStr += '                Apparent UFO/Occupant activities:\n' + apparentUfoOccupantActivitiesStr;
    }
    let placesVisitedAndThingsAffectedStr = flagsStr(record.placesVisitedAndThingsAffectedFlags, flags.placesVisitedAndThingsAffectedLabels);
    if (apparentUfoOccupantActivitiesStr) {
      descriptionStr += '                Places visited and things affected:\n' + placesVisitedAndThingsAffectedStr;
    }
    let evidenceAndSpecialEffectsStr = flagsStr(record.evidenceAndSpecialEffectsFlags, flags.evidenceAndSpecialEffectsLabels);
    if (evidenceAndSpecialEffectsStr) {
      descriptionStr += '                Evidence and special effects:\n' + evidenceAndSpecialEffectsStr;
    }
    let miscellaneousDetailsStr = flagsStr(record.miscellaneousDetailsFlags, flags.miscellaneousDetailsLabels);
    if (miscellaneousDetailsStr) {
      descriptionStr += '                Miscellaneous details:\n' + miscellaneousDetailsStr;
    }

    desc += locationStr;
    desc += descriptionStr;
    desc += '  Duration    : ' + record.duration + ' min\n';
    desc += '  Strangeness : ' + record.strangeness + '\n';
    desc += '  Credibility : ' + record.credibility + '\n';
    desc += '  Reference   : ' + ref + '\n'
      + '                at index #' + record.refIndex;
    return desc;
  }

  write(record) {
    this.output.write(this.desc(record) + '\n');
  }

  end() {
  }
};