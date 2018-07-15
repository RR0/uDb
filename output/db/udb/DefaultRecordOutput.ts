import {Geo} from "../../../geo";
import {Output, RecordOutput} from "../../RecordOutput";
import {UdbOutputRecord} from "./UdbOutputRecord";
import WritableStream = NodeJS.WritableStream;

let indent = 0;

function line(str?) {
  let lineStr = '';
  for (let i = 0; i < indent; i++) lineStr += '\t';
  return lineStr + (str ? str : '') + '\n';
}

export class DefaultRecordOutput implements RecordOutput {

  constructor(private output: Output) {
  }

  desc(record: UdbOutputRecord) {
    const ref = record.ref ? record.ref : '';

    const month = record.month;
    const day = record.day;
    const time = record.time;
    let desc = line()
      + line(`Record #${record.id}`);
    indent++;
    desc += line(`Title\t\t: ${record.title}`)
      + line(`Date\t\t: ${record.year}${month ? '/' + month : ''}${day ? '/' + day : ''}${time ? ', ' + time : ''}`);
    const relativeAltitude = record.relativeAltitude;
    const elevation = record.elevation;
    let elevationStr = `${elevation || relativeAltitude ? line((elevation ? '\tElevation ' + elevation + ' m' : '') 
      + (relativeAltitude ? ', relative altitude ' + relativeAltitude + ' m' : '')) : ''}`;
    let location = line('Location\t:')
      + line(`\t${record.locale}, ${record.location} (${record.stateOrProvince}, ${record.country}, ${record.continent}), ${Geo.ddToDms(record.latitude, record.longitude)}`)
      + elevationStr;
    indent++;
    location += line(`Observer: ${record.locationFlags}`);

    indent--;
    let description = record.description && record.description.replace(/\n/g, '\n\t\t');
    let descriptionStr = line('Description :')
      + line(description ? `\t${description}` : '');

    let miscFlags = record.miscellaneousFlags;
    if (miscFlags) {
      descriptionStr += line(`Miscellaneous details and features\t\t\t\t: ${miscFlags}`);
    }
    let typeOfUfoCraft = record.typeOfUfoCraftFlags;
    if (typeOfUfoCraft) {
      descriptionStr += line(`Type of UFO / Craft\t\t\t\t\t\t\t: ${typeOfUfoCraft}`);
    }

    let aliensMonsters = record.aliensMonstersFlags;
    if (aliensMonsters) {
      descriptionStr += line(`Aliens! Monsters! (no religious figures)\t: ${aliensMonsters}`);
    }
    let apparentUfoOccupantActivities = record.apparentUfoOccupantActivitiesFlags;
    if (apparentUfoOccupantActivities) {
      descriptionStr += line(`Apparent UFO/Occupant activities\t\t\t: ${apparentUfoOccupantActivities}`);
    }
    let placesVisitedAndThingsAffected = record.placesVisitedAndThingsAffectedFlags;
    if (placesVisitedAndThingsAffected) {
      descriptionStr += line(`Places visited and things affected\t\t\t: ${placesVisitedAndThingsAffected}`);
    }
    let evidenceAndSpecialEffects = record.evidenceAndSpecialEffectsFlags;
    if (evidenceAndSpecialEffects) {
      descriptionStr += line(`Evidence and special effects\t\t\t\t: ${evidenceAndSpecialEffects}`);
    }
    let miscellaneousDetails = record.miscellaneousDetailsFlags;
    if (miscellaneousDetails) {
      descriptionStr += line(`Miscellaneous details\t\t\t\t\t: ${miscellaneousDetails}`);
    }

    desc += location;
    desc += descriptionStr;
    desc += line(`Duration\t\t\t\t\t\t\t\t\t: ${record.duration} min`);
    desc += line(`Strangeness\t\t\t\t\t\t\t\t\t: ${record.strangeness}`);
    desc += line(`Credibility\t\t\t\t\t\t\t\t\t: ${record.credibility}`);
    desc += line(`Reference\t\t\t\t\t\t\t\t\t: ${ref}`);
    indent--;
    return desc;
  }

  write(record: UdbOutputRecord) {
    this.output.write(line(this.desc(record)));
  }

  end() {
  }
}