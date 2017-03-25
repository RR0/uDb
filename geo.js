const continents = {
  0: {
    name: 'North America',
    description: 'Actual Continent including Central America.',
    countries: {
      1: 'Canada',
      2: 'USA',
      3: 'Mexico',
      4: 'Guatemala',
      5: 'Belize',
      6: 'Honduras',
      7: 'El Salvador',
      8: 'Nicaragua',
      9: 'Costa Rica',
      10: 'Panama',
    }
  },
  1: {
    name: 'South America',
    description: 'Actual Continent',
    countries: {
      1: 'Brazil',
      2: 'Paraguay',
      3: 'Uruguay',
      4: 'Argentina',
      5: 'Chile',
      6: 'Bolivia',
      7: 'Peru',
      8: 'Ecuador',
      9: 'Colombia',
      10: 'Venezuela',
      11: 'Guyanas (all 3 of them)',
    }
  },
  2: {
    /**
     *  AUSTRALIA / NEW ZEALAND  and the great Oceans.
     */
    name: 'Oceania',
    countries: {
      1: 'Australia',
      2: 'New Zealand',
      3: 'Atlantic Ocean + islands',
      4: 'Pacific Ocean and non-Asian islands',
      5: 'Caribbean area',
      6: 'Indian Ocean + islands',
      7: 'Arctic above 70 degrees North',
      8: 'Antarctic below 70 degrees South',
      9: 'Iceland',
      10: 'Greenland',
    }
  },
  3: {
    /**
     * Actual Continent.
     */
    name: 'Western Europe',
    countries: {
      1: 'Great Britain and Ireland',
      2: 'Scandanavian and Finland',
      3: 'Germany',
      4: 'Belgium, Netherlands and Luxembourg',
      5: 'France',
      6: 'Spain',
      7: 'Portugal',
      8: 'Austria',
      9: 'Italy',
      10: 'Switzerland',
      11: 'Greece and Island nations',
    }
  },
  4: {
    /**
     * Includes some former Soviet Republics.
     */
    name: 'Eastern Europe',
    countries: {
      1: 'Poland',
      2: 'Czech and Slovak Republics',
      3: 'Hungary',
      4: {
        name: 'Former Yugoslavia',
        description: 'Province field indicates present republics'
      },
      5: 'Romania',
      6: 'Bulgaria',
      7: 'Albania',
      8: 'Estonia, Latvia & Lithuania',
      9: 'Belorus',
      10: 'Ukraine',
    }
  },
  5: {
    /**
     * ( except Vietnam, Cambodia and Laos. )
     */
    name: 'Asia Mainland',
    countries: {
      1: 'Red China',
      2: 'Mongolia',
      3: 'India',
      4: 'Pakistan',
      5: 'Afghanistan',
      6: {
        name: 'Himalayan states',
        description: 'Nepal, Bhutan, Shangri-la etc.'
      },
      7: 'Bangladesh',
      8: 'Burma',
      9: {
        name: 'Korea',
        description: 'both sides'
      },
    }
  },
  6: {
    /**
     * (except Vietnam, Cambodia and Laos)
     * Small remote islands are under Oceania
     */
    name: 'Asia Pacific',
    countries: {
      1: 'Japan',
      2: 'Philippines',
      3: 'Taiwan China',
      4: 'Vietnam',
      5: 'Laos',
      6: 'Cambodia',
      7: 'Thailand',
      8: 'Malaysia',
      9: 'Indonesia',
    }
  },
  7: {
    name: 'Northern and Northwest Africa',
    decription: 'North of the Equator',
    countries: {
      1: 'Egypt',
      2: 'Sudan',
      3: 'Ethiopia',
      4: 'Libya',
      5: 'Tunisia',
      6: 'Algeria',
      7: 'Morocco',
      8: {
        name: 'Sahara',
        description: 'includes Chad, Niger, Mali, Mauritania and Upper Volta'
      },
      9: 'Ivory Coast, Ghana, Togo, Benin, Liberia.',
      10: 'Nigeria',
    }
  },
  8: {
    /**
     * Generally on or South of the Equator.
     */
    name: 'Southern Africa',
    countries: {
      1: 'Rep of South Africa',
      2: {
        name: 'Zimbabwe & Zambia',
        description: 'Rhodesia'
      },
      3: 'Angola',
      4: {
        name: 'Kalahari Desert',
        description: 'Botswana etc.'
      },
      5: 'Mozambique',
      6: 'Tanzania',
      7: 'Uganda',
      8: 'Kenya',
      9: 'Somalia',
      10: {
        name: 'Congo states',
        description: 'includes Congo, Zaire, Central Afr Rep, Rwanda, Burundi..'
      },
      11: 'Ivory Coast,Ghana,Togo,Benin,Liberia etc.',
      12: 'Nigeria.',
    }
  },
  9: {
    /**
     * except Baltics, Ukraine & Belorus.
     */
    name: 'Russia and former soviet',
    countries: {
      1: {
        name: 'Russia',
        description: 'includes various ethnic Okrugs, all within the former RSFSR'
      },
      2: 'Georgia',
      3: 'Armenia',
      4: 'Azerbaijan',
      5: 'Kazakh Republic',
      6: 'Turkmen Republic',
      7: 'Uzbek Republic',
      8: 'Tadzhik Republic',
    }
  },
  10: {
    /**
     * Turkey, Israel, Iran and Arabic speaking lands.
     */
    name: 'Middle East',
    countries: {
      1: 'Turkey',
      2: 'Syria',
      3: 'Iraq',
      4: 'Iran',
      5: 'Jordan',
      6: 'Israel',
      7: {
        name: 'Arabian Peninsula',
        description: '(not Kuwait)'
      },
      8: 'Kuwait',
      9: 'Cyprus',
      10: 'Lebanon',
    }
  },
  11: {
    /**
     * Anywhere outside of Earth's Atmosphere.
     */
    name: 'Space',
    countries: {
      1: 'Earth Orbit. Space stations, capsules. Astronauts & Cosmonauts.',
      2: 'The Moon',
      3: 'Venus',
      4: 'Mars',
      5: 'Asteroids',
      6: 'Jupiter',
      7: 'Saturn',
      8: 'Uranus',
      9: 'Neptune',
      10: 'Deep Space',
      11: 'Pluto',
    }
  },
};

const statesOrProvinces = {
  CHL: 'Chaldea',

  SIB: 'Siberia',

  EST: 'Estonia',
  SRB: 'Serbia',
  PRS: 'Prussia',

  IVC: 'Ivory Coast',

  BLG: 'Belgium',

  ALS: 'Alaska',
  TYR: 'Tyre',
  CLR: 'Colorado',
  CNN: 'Connecticut',
  HWI: 'Hawaii',
  IOW: 'Iowa',
  MNT: 'Montana',
  MSC: 'Massachusetts',
  MSO: 'Missouri',
  MSP: 'Mississippi',
  NBR: 'Nebraska',
  NCR: 'North Carolina',
  NDK: 'North Dakota',
  OHI: 'Ohio',
  ORG: 'Oregon',
  SCR: 'South Carolina',
  SDK: 'South Dakota',
  UTA: 'Utah',
  VRG: 'Virginia',
  WVA: 'Western Virginia',
  WSH: 'Washington',
  NMX: 'New Mexico',

  SNL: 'Sinaloa',
  CHH: 'Chihuahua',

  ALB: 'Alberta',
  BCO: 'British Columbia',
  MBA: 'Manitoba',
  NBR: 'New Brunswick', // TODO: Duplicate!
  NFL: 'Newfoundland',
  NSC: 'Nova Scotia',
  NWT: 'Northwest Territories',
  ONT: 'Ontario',
  QBC: 'Quebec',
  SSK: 'Sasketchewan',
  YUK: 'Yukon',
  PEI: 'Prince Edward Island',
  IRL: 'Ireland',
  ENG: 'England',
  SCT: 'Scotland',
  WAL: 'Wales',
  NI: 'Northern Ireland',
  CLF: 'California',
  NVD: 'Nevada',
  KNS: 'Kansas',
  ILN: 'Illinois',
  IND: 'Indiana',
  TXS: 'Texas',
  MCH: 'Michigan',
  ARK: 'Arkansas',

  MSE: 'Meuse',

  DRK: 'Dark side'
};

exports.getStateOrProvince = function (record) {
  let stateOrProvinceKey = record.stateOrProvince;
  let statesOrProvinceStr = statesOrProvinces[stateOrProvinceKey];
  return statesOrProvinceStr ? statesOrProvinceStr : stateOrProvinceKey;
};

const locales = {};
locales[0] = 'Metropolis';
locales[1] = 'Residential';
locales[2] = 'Town & city';
locales[3] = 'Farmlands';
locales[4] = 'Pasture';
locales[5] = 'Oil & coal';
locales[6] = 'Tundra';
locales[7] = 'Desert';
locales[8] = 'Mountains';
locales[9] = 'Wetlands';
locales[10] = 'Forest';
locales[11] = 'Rainforest';
locales[12] = 'Coastlands';
locales[13] = 'Offshore';
locales[14] = 'High seas';
locales[15] = 'Islands';
locales[16] = 'In-flight';
locales[17] = 'Space';
locales[18] = 'Military base';
locales[19] = 'Unknown';
locales[20] = 'Road + rails';

function getDms(val) {
  val = Math.abs(val);

  let valDeg = Math.floor(val);
  let valMin = Math.floor((val - valDeg) * 60);
  let valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000;

  if (valSec >= 60) {
    valMin++;
    valSec = 0;
  }
  if (valMin >= 60) {
    valDeg++;
    valMin = 0;
  }
  let result = valDeg + "º"; // 40º
  result += (valMin < 10 ? '0' + valMin : valMin) + "'"; // 40º36'
  result += (valSec < 10 ? '0' + valSec : valSec) + '"'; // 40º36'4.331"
  return result;
}

exports.ddToDms = function (lat, lng) {
  let latResult = getDms(lat) + ' ';
  latResult += !lng ? 'Q' : lat > 0 ? 'N' : 'S';

  let lngResult = getDms(lng) + ' ';
  lngResult += !lng ? 'Z' : lng > 0 ? 'W' : 'E';

  return lngResult + ' ' + latResult;
};

exports.getLocale = function (record) {
  const locale = record.locale;
  return locales[locale] ? locales[locale] : 'locale#' + locale;
};

exports.getElevation = function (record) {
  let elevation = record.elevation;
  return elevation !== -99 ? elevation : '';
};

exports.getRelativeAltitude = function (record) {
  const relativeAltitude = record.relativeAltitude;
  return relativeAltitude !== 999 ? relativeAltitude : '';
};

exports.getCountry = function getCountry(continent, countryCode) {
  let country = continent.countries[countryCode];
  return country ? (country.name ? country : {name: country}) : {name: 'country#' + countryCode};
};

exports.getContinent = function getContinent(continentCode) {
  return continents[continentCode] ? continents[continentCode] : {
    name: 'continent#' + continentCode,
    countries: {}
  };
};
