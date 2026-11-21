import {UdbRecord} from "../UdbRecord.js"

export interface UdbInputRecord extends UdbRecord {
  /**
   * Signed int
   */
  year: number;

  /**
   * Terrain code (0-20), 1 byte.
   */
  locale: number;

  /**
   * High nibble of the month byte.
   *
   * Set (to 1) on 73 records only, which are nearly all non-UFO "context" events
   * (astronomers' lunar observations, space missions, A-bomb tests, Sputnik, Apollo 11, Chernobyl...).
   * Probably the "tagged" status of a record (tagged records are displayed with a green background in *U*),
   * but this has not been confirmed with the original software.
   * 3 other records have values 4, 8 and 10.
   */
  unknownMonth: number;

  /**
   * 4 bits
   */
  month: number;

  /**
   * 3 high bits of the 11-bits reference index ("pinpoint": page, issue, case number...).
   */
  refIndexHigh: number;

  /**
   * 5 bits
   */
  day: number;

  /**
   * 1 byte
   */
  time: number;

  /**
   * Year, Month, Day and Time accuracies.
   *
   * 1 byte
   */
  ymdt: number;

  /**
   * Duration in minutes (0-32000).
   *
   * Signed int (only 7 records need the high byte, such as 1440 min = 24 hours).
   */
  duration: number;

  /**
   * Decimal degrees, positive is East.
   *
   * Stored as a signed int counting units of 20 seconds of arc, positive is West.
   */
  longitude: number;

  /**
   * Decimal degrees, positive is North.
   *
   * Stored as a signed int counting units of 20 seconds of arc.
   */
  latitude: number;

  /**
   * Signed int
   */
  elevation: number;

  /**
   * Signed int
   */
  relativeAltitude: number;

  /**
   * 1 byte, always 0 (padding).
   */
  unknown2: number;

  /**
   * 4 bits
   */
  continentCode: number;

  /**
   * 4 bits
   */
  countryCode: number;

  /**
   * 3 chars
   */
  stateOrProvince: string;

  /**
   * 1 byte, always 0 (end of the 3-chars state/province string).
   */
  unknown3: number;

  /**
   * 1 byte
   */
  locationFlags: number;

  /**
   * 1 byte
   */
  miscellaneousFlags: number;

  /**
   * 1 byte
   */
  typeOfUfoCraftFlags: number;

  /**
   * 1 byte
   */
  aliensMonstersFlags: number;

  /**
   * 1 byte
   */
  apparentUfoOccupantActivitiesFlags: number;

  /**
   * 1 byte
   */
  placesVisitedAndThingsAffectedFlags: number;

  /**
   * 1 byte
   */
  evidenceAndSpecialEffectsFlags: number;

  /**
   * 1 byte
   */
  miscellaneousDetailsFlags: number;

  /**
   * 78 chars
   */
  description: string;

  location: string;
  title: string;

  /**
   * 1 byte
   */
  ref: number;

  /**
   * Low 8 bits of the reference index, then (once read) the full 11-bits index.
   *
   * How it is displayed (page, issue, volume/issue, case number, etc.) depends on the reference only.
   * @see Sources.getPinpoint
   */
  refIndex: number;

  /**
   * 4 bits
   */
  strangeness: number;

  /**
   * 4 bits
   */
  credibility: number;
}
