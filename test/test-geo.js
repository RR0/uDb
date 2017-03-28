const assert = require('assert');
const geo = require('../geo');

describe('geo', function () {
  describe('getLocale', function () {
    it('should return known locale', function () {
      assert.equal('Metropolis', geo.getLocale({locale: 0}));
      assert.equal('Road + rails', geo.getLocale({locale: 20}));
    });
    it('should return unknown locale', function () {
      assert.equal('locale#21', geo.getLocale({locale: 21}));
    });
  });
  describe('getElevation', function () {
    it('should return known elevation', function () {
      assert.equal('200', geo.getElevation({elevation: 200}));
    });
    it('should return unknown elevation', function () {
      assert.equal('', geo.getElevation({elevation: -99}));
    });
  });
  describe('getRelativeAltitude', function () {
    it('should return known relative altitude', function () {
      assert.equal('20', geo.getRelativeAltitude({relativeAltitude: 20}));
    });
    it('should return unknown elevation', function () {
      assert.equal('', geo.getRelativeAltitude({relativeAltitude: 999}));
    });
  });
  describe('getContinent', function () {
    it('should return known continent', function () {
      let continent0 = geo.getContinent(0);
      assert.equal('North America', continent0.name);
      assert.equal('Actual Continent including Central America', continent0.description);
      assert.equal(10, Object.keys(continent0.countries).length);

      let continent11 = geo.getContinent(11);
      assert.equal('Space', continent11.name);
      assert.equal(11, Object.keys(continent11.countries).length);
    });
    it('should return unknown continent', function () {
      let unknownContinent = geo.getContinent(12);
      assert.equal('continent#12', unknownContinent.name);
      assert.equal(0, Object.keys(unknownContinent.countries).length);
    });
  });
  describe('getCountry', function () {
    const continent0 = {
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
    };
    it('should return known country', function () {
      let country = geo.getCountry(continent0, 1);
      assert.equal('Canada', country.name);
      assert.equal(13, Object.keys(country.statesOrProvinces).length);
    });
    it('should return unknown country', function () {
      assert.deepEqual({name: 'country#11'}, geo.getCountry(continent0, 11));
    });
  });
});