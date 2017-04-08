const statesOrProvinces = {

  SIB: 'Siberia',
  STP: 'Saint Petersburg',

  EST: 'Estonia',
  SRB: 'Serbia',
  //PRS: 'Prussia',

  LIT: 'Lituania',

  AFR: 'Africa',
  IVC: 'Ivory Coast',
  PGF: 'Persian Gulf',
  SAH: 'Sahara',

  DMK: 'Danemark',

  WAL: 'Wales?',
  WLS: 'Wales',

  BRL: 'Berlin',

  GRC: 'Greece',

  SAI: 'Saigon',
  SKR: 'South Korea',

  MRC: 'Maracaibo',

  DRK: 'Dark side'
};

export class Geo {
  private static getDms(val) {
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

  static ddToDms(lat, lng) {
    let latResult = Geo.getDms(lat) + ' ';
    latResult += !lng ? 'Q' : lat > 0 ? 'N' : 'S';

    let lngResult = Geo.getDms(lng) + ' ';
    lngResult += !lng ? 'Z' : lng > 0 ? 'W' : 'E';

    return lngResult + ' ' + latResult;
  }

  static getLocale(record) {
    const locale = record.locale;
    return Geo.locales[locale] ? Geo.locales[locale] : 'locale#' + locale;
  }

  static getElevation(record) {
    let elevation = record.elevation;
    return elevation !== -99 ? elevation : '';
  }

  static getRelativeAltitude(record) {
    const relativeAltitude = record.relativeAltitude;
    return relativeAltitude !== 999 ? relativeAltitude : '';
  }

  static getCountry(continent, countryCode) {
    let country = continent.countries[countryCode];
    return country ? (country.name ? country : {name: country}) : {name: 'country#' + countryCode};
  }

  static getStateOrProvince(country, record) {
    let stateOrProvinceKey = record.stateOrProvince;
    let end;
    let found;
    do {
      let newEnd = stateOrProvinceKey.lastIndexOf('.');
      found = newEnd > 0;
      if (found) {
        end = newEnd;
        stateOrProvinceKey = stateOrProvinceKey.substring(0, end);
      }
    } while (found);
    let statesOrProvinceStr;
    if (country.statesOrProvinces) {
      statesOrProvinceStr = country.statesOrProvinces[stateOrProvinceKey];
    } else {
      statesOrProvinceStr = statesOrProvinces[stateOrProvinceKey];
    }
    return statesOrProvinceStr ? statesOrProvinceStr : stateOrProvinceKey;
  }

  static getContinent(continentCode) {
    return Geo.continents[continentCode] ? Geo.continents[continentCode] : {
      name: 'continent#' + continentCode,
      countries: {}
    };
  }

  private static continents = {
    0: {
      name: 'North America',
      description: 'Actual Continent including Central America',
      countries: {
        1: {
          name: 'Canada',
          statesOrProvinces: {
            ALB: 'Alberta',
            ALT: 'Alta',
            BCO: 'British Columbia',
            MBA: 'Manitoba',
            NBR: 'New Brunswick',
            NFL: 'Newfoundland',
            NSC: 'Nova Scotia',
            NWT: 'Northwest Territories',
            ONT: 'Ontario',
            QBC: 'Quebec',
            SSK: 'Sasketchewan',
            YUK: 'Yukon',
            PEI: 'Prince Edward Island',
          }
        },
        2: {
          name: 'USA',
          statesOrProvinces: {
            ALS: 'Alaska',
            ALA: 'Alabama',
            ALB: 'Alabama', // Duplicate!
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
            ORE: 'Oregon',
            SCR: 'South Carolina',
            SDK: 'South Dakota',
            UTA: 'Utah',
            VRG: 'Virginia',
            WVA: 'Western Virginia',
            WSH: 'Washington',
            NMX: 'New Mexico',
            ARZ: 'Arizona',
            MNS: 'Minnesota',
            WSC: 'Wisconsin',
            FLR: 'Florida',
            PNS: 'Pennsylvania',
            GRG: 'Georgia',
            NJR: 'New Jersey',
            ME: 'Maine',
            PRC: 'Puerto Rico',
            TNS: 'Tennessee',
            KNT: 'Kentucky',
            WYO: 'Wyoming',
            DLW: 'Delaware',
            CNC: 'Connecticut',
            LSN: 'Louisiana',
            RHD: 'Rhode Island',
            CLF: 'California',
            NVD: 'Nevada',
            KNS: 'Kansas',
            ILN: 'Illinois',
            IND: 'Indiana',
            TXS: 'Texas',
            MCH: 'Michigan',
            ARK: 'Arkansas',
            KNY: 'Kentucky',
            NYK: 'New York',
            VRM: 'Vermont',
            IDH: 'Idaho',
            OKL: 'Oklahoma',
            NHM: 'New Hampshire',
          }
        },
        3: {
          name: 'Mexico',
          statesOrProvinces: {
            SNL: 'Sinaloa',
            CHH: 'Chihuahua',
            BCN: 'Baja California',
          }
        },
        4: 'Guatemala',
        5: 'Belize',
        6: 'Honduras',
        7: 'El Salvador',
        8: 'Nicaragua',
        9: 'Costa Rica',
        10: {
          name: 'Panama',
          statesOrProvinces: {
            CNZ: 'Canal Zone',
          }
        }
      }
    },
    1: {
      name: 'South America',
      description: 'Actual Continent',
      countries: {
        1: {
          name: 'Brazil',
          statesOrProvinces: {
            AMZ: 'Amazonas',
            BAH: 'Bahia',
            RIO: 'Rio'
          }
        },
        2: 'Paraguay',
        3: 'Uruguay',
        4: {
          name: 'Argentina', statesOrProvinces: {
            BNA: 'Buenos Aires',
            JJY: 'Juhuy',
          }
        },
        5: {
          name: 'Chile',
          statesOrProvinces: {
            ANT: 'Antofagasta',
            ATC: 'Atacama'
          }
        },
        6: 'Bolivia',
        7: {
          name: 'Peru',
          statesOrProvinces: {
            ARQ: 'Arequipa',
          }
        },
        8: 'Ecuador',
        9: {
          name: 'Colombia',
          statesOrProvinces: {
            BGT: 'Bogota  '
          }
        },
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
        1: {
          name: 'Australia',
          statesOrProvinces: {
            ACT: 'Australian Capital Territory',
            VCT: 'Victoria',
            SAU: 'South Australia',
            WAU: 'Western Australia',
          }
        }
        ,
        2: 'New Zealand',
        3: {
          name: 'Atlantic Ocean + islands',
          statesOrProvinces: {
            AZR: 'Azores',
            BAH: 'Bahamas',
            BRM: 'Bermuda',
          }
        }
        ,
        4: 'Pacific Ocean and non-Asian islands',
        5: 'Caribbean area',
        6: 'Indian Ocean + islands',
        7: 'Arctic above 70 degrees North',
        8: {
          name: 'Antarctic below 70 degrees South',
          statesOrProvinces: {
            VST: 'Vostok',
          }
        }
        ,
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
        1: {
          name: 'Great Britain and Ireland',
          statesOrProvinces: {
            IRL: 'Ireland',
            ENG: 'England',
            SCT: 'Scotland',
            NI: 'Northern Ireland'
          }
        },
        2: {
          name: 'Scandanavian and Finland',
          statesOrProvinces: {
            NRW: 'Norway',
            FNL: 'Finland',
            SWD: 'Sweden',
            DMK: 'Danemark',
          }
        },
        3: {
          name: 'Germany',
          statesOrProvinces: {
            BDW: 'Bade-Wurtemberg',
            BVR: 'Bavaria',
            SXN: 'Saxony',
          }
        },
        4: {
          name: 'Belgium, Netherlands and Luxembourg',
          statesOrProvinces: {
            BLG: 'Belgium',
            NTH: 'Netherlands'
          }
        },
        5: {
          name: 'France',
          statesOrProvinces: {
            ARG: 'Ariège',
            AUD: 'Aude',
            AIN: 'Ain',
            AVR: 'Aveyron',
            AND: 'Andorre',
            BRH: 'Bas-Rhin',
            SMR: 'Seine Maritime',
            ADC: 'Ardèche',
            ASN: 'Aisne',
            ADN: 'Ardennes',
            AMR: 'Alpes Maritimes',
            AHP: 'Alpes de Haute Provence',
            BDR: 'Bouches-du-Rhône',
            CNT: 'Cantal',
            CRS: 'Creuse',
            DRM: 'Drôme',
            FNS: 'Finistère',
            FRB: 'Bretagne',
            GRD: 'Gard',
            'M&M': 'Meurthe-et-Moselle',
            HAL: 'Hautes Alpes',
            HGR: 'Haute Garonne',
            JRA: 'Jura',
            LOI: 'Loire',
            LRE: 'Loire', // Duplicate
            LRT: 'Loiret',
            LOT: 'Lot',
            LRA: 'Loire Atlantique',
            LND: 'Landes',
            LZR: 'Lozère',
            MNC: 'Manche',
            MSE: 'Meuse',
            NRD: 'Nord',
            PDC: 'Pas-de-Calais',
            RHN: 'Rhône',
            'S&L': 'Saône-et-Loire',
            'T&G': 'Tarn-et-Garonne',
            VSG: 'Vosges',
          }
        },
        6: {
          name: 'Spain',
          statesOrProvinces: {
            ALB: 'Albacete',
            BDJ: 'Badajoz',
            BRC: 'Barcelone',
            BRG: 'Burgos',
            CNC: 'Cuenca',
          }
        },
        7: {
          name: 'Portugal',
          statesOrProvinces: {
            ALG: 'Algarve',
            BRL: 'Beira littoral',
            DRO: 'Douro',
          }
        },
        8: {
          name: 'Austria',
          statesOrProvinces: {
            UAU: 'Upper Austria'
          }
        },
        9: {
          name: 'Italy',
          statesOrProvinces: {
            AL: 'Alessandria',
            AQ: 'Aquila',
            ASC: 'Ascoli Piceno',
            AN: 'Ancona',
            BS: 'Brescia',
            BA: 'Bari',
            BG: 'Bergamo',
            CA: 'Cagliari',
            CMP: 'Campania',
            GR: 'Grosseto',
            FI: 'Firenze',
            MI: 'Milano',
            LMB: 'Lombardy',
            LU: 'Lucques',
          }
        },
        10: {
          name: 'Switzerland',
          statesOrProvinces: {
            VAU: 'Vaud',
            BRN: 'Berne',
            BSL: 'Basel',
          }
        },
        11: 'Greece and Island nations',
      }
    },
    4: {
      /**
       * Includes some former Soviet Republics.
       */
      name: 'Eastern Europe',
      countries: {
        1: {
          name: 'Poland',
          statesOrProvinces: {
            WRS: 'Warsaw',
            KRK: 'Krakow',
          }
        },
        2: 'Czech and Slovak Republics',
        3: 'Hungary',
        4: {
          name: 'Former Yugoslavia',
          description: 'Province field indicates present republics'
        },
        5: {
          name: 'Romania',
          statesOrProvinces: {
            BCU: 'Bacău',
            BHR: 'Bihor',
            BSV: 'Brasov',
            BUC: 'Bucharest',
            CNS: 'Constanța',
          }
        },
        6: {
          name: 'Bulgaria',
          statesOrProvinces: {
            SOF: 'Sofia',
          }
        },
        7: 'Albania',
        8: {
          name: 'Estonia, Latvia & Lithuania',
          statesOrProvinces: {
            LTH: 'Lithuania',
            LTV: 'Latvia',
          }
        },
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
        1: {
          name: 'Red China',
          statesOrProvinces: {
            ANH: 'Anhui',
            JNS: 'Jiangsu',
            JNX: 'Jianxi',
          }
        },
        2: 'Mongolia',
        3: 'India',
        4: 'Pakistan',
        5: {
          name: 'Afghanistan',
          statesOrProvinces: {
            GHZ: 'Ghazni',
          }
        },
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
        1: {
          name: 'Japan',
          statesOrProvinces: {
            KYU: 'Kyushu'
          }
        },
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
        6: {
          name: 'Algeria',
          statesOrProvinces: {
            ALG: 'Alger',
            ORN: 'Oran',
            LAM: 'Lamoriciere',
            BOU: 'Boukanefis  ',
            MOS: 'Mostaganem',
            CNS: 'Constantine',
            BCH: 'Bechar',
            ANB: 'Annaba',
          }
        },
        7: {
          name: 'Morocco',
          statesOrProvinces: {
            AGD: 'Agadir'
          }
        },
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
        1: {
          name: 'Republic of South Africa',
          statesOrProvinces: {
            NAT: 'KwaZulu-Natal',
          }
        },
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
          description: 'includes various ethnic Okrugs, all within the former RSFSR',
          statesOrProvinces: {
            LEN: 'Leningrad',
          }
        },
        2: {
          name: 'Georgia',
          statesOrProvinces: {
            ABK: 'Abkhazia'
          }
        },
        3: 'Armenia',
        4: 'Azerbaijan',
        5: {
          name: 'Kazakh Republic',
          statesOrProvinces: {
            ALM: 'Alma'
          }
        },
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
        1: {
          name: 'Turkey',
          statesOrProvinces: {
            ANK: 'Ankara'
          }
        },
        2: 'Syria',
        3: {
          name: 'Iraq',
          statesOrProvinces: {
            CHL: 'Chaldea',
          }
        },
        4: 'Iran',
        5: {
          name: 'Jordan',
          statesOrProvinces: {
            AMN: 'Amman'
          }
        },
        6: 'Israel',
        7: {
          name: 'Arabian Peninsula',
          description: '(not Kuwait)'
        },
        8: 'Kuwait',
        9: 'Cyprus',
        10: {
          name: 'Lebanon',
          statesOrProvinces: {
            TYR: 'Tyre',
            BEI: 'Beirut',
          }
        }
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
    }
  };

  private static locales = {
    0: 'Metropolis',
    1: 'Residential',
    2: 'Town & city',
    3: 'Farmlands',
    4: 'Pasture',
    5: 'Oil & coal',
    6: 'Tundra',
    7: 'Desert',
    8: 'Mountains',
    9: 'Wetlands',
    10: 'Forest',
    11: 'Rainforest',
    12: 'Coastlands',
    13: 'Offshore',
    14: 'High seas',
    15: 'Islands',
    16: 'In-flight',
    17: 'Space',
    18: 'Military base',
    19: 'Unknown',
    20: 'Road + rails',
  };
}