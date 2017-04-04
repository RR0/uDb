export interface InputRecord {
  id: number;

  /**
   * Signed int
   */
  year: number;

  /**
   * Byte
   */
  locale: number;

  /**
   * 4 bits
   */
  unknownMonthPart: number;

  /**
   * 4 bits
   */
  month: number;

  /**
   * 3 bits
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
   * Duration in minutes.
   *
   * 1 byte
   */
  duration: number;

  /**
   * 1 byte
   */
  unknown1: number;

  /**
   * 11 bits of signed int
   */
  longitude: number;

  /**
   * 11 bits of signed int
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
   * 1 byte
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
   * 1 byte
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
   * 1 byte
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
