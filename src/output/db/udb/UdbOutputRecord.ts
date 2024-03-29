import {UdbRecord} from "../../../input/db/UdbRecord"

export interface UdbOutputRecord extends UdbRecord {
  year: string | number;
  month: string | number;
  day: string | number;
  time: string | number;
  location: string;
  stateOrProvince: any;
  country: string;
  continent: string;
  title: string;
  description: string;
  locale: string;
  duration: number;
  miscellaneousDetailsFlags: string;
  evidenceAndSpecialEffectsFlags: string;
  placesVisitedAndThingsAffectedFlags: string;
  apparentUfoOccupantActivitiesFlags: string;
  aliensMonstersFlags: string;
  typeOfUfoCraftFlags: string;
  miscellaneousFlags: string;
  locationFlags: string;
  relativeAltitude: string;
  elevation: string | number;
  latitude: number;
  longitude: number;
  ref: string;
  strangeness: number;
  credibility: number;
  refIndex: number;
}
