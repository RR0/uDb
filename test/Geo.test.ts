import {Geo} from "../output/db/udb/geo";
import {expect} from 'chai';

describe('geo', function () {
  describe('DDToDMS', function () {
    it('should return correct conversion', function () {
      expect(Geo.ddToDms(31, 46.17)).to.eq(`31º00'00" N 46º10'12" E`); // #1: Iraq
      expect(Geo.ddToDms(37.06, -3.99)).to.eq(`37º03'36" N 3º59'24" W`); // #18094: Spain
      expect(Geo.ddToDms(-34.62, -58.44)).to.eq(`34º37'12" S 58º26'24" W`); // Buenos Aires
      expect(Geo.ddToDms(-33.7, 117.56)).to.eq(`33º42'00" S 117º33'36" E`); // Australia
    });
  });
  describe('getLocale', () => {
    it('should return known locale', () => {
      expect(Geo.getLocale({locale: 0})).to.eq('Metropolis');
      expect(Geo.getLocale({locale: 20})).to.eq('Road + rails');
    });
    it('should return unknown locale', function () {
      expect('locale#21').to.eq(Geo.getLocale({locale: 21}));
    });
  });
  describe('getElevation', function () {
    it('should return known elevation', function () {
      expect(Geo.getElevation({elevation: 200})).to.eq(200);
    });
    it('should return unknown elevation', function () {
      expect(Geo.getElevation({elevation: -99})).to.eq('');
    });
  });
  describe('getRelativeAltitude', function () {
    it('should return known relative altitude', function () {
      expect(Geo.getRelativeAltitude({relativeAltitude: 20})).to.eq(20);
    });
    it('should return unknown elevation', function () {
      expect('').to.eq(Geo.getRelativeAltitude({relativeAltitude: 999}));
    });
  });
  describe('getContinent', function () {
    it('should return known continent', function () {
      let continent0 = Geo.getContinent(0);
      expect('North America').to.eq(continent0.name);
      expect('Actual Continent including Central America').to.eq(continent0.description);
      expect(10).to.eq(Object.keys(continent0.countries).length);

      let continent11 = Geo.getContinent(11);
      expect('Space').to.eq(continent11.name);
      expect(11).to.eq(Object.keys(continent11.countries).length);
    });
    it('should return unknown continent', () => {
      let unknownContinent = Geo.getContinent(12);
      expect('continent#12').to.eq(unknownContinent.name);
      expect(0).to.eq(Object.keys(unknownContinent.countries).length);
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
      let country = Geo.getCountry(continent0, 1);
      expect('Canada', country.name);
      expect(13).to.eq(Object.keys(country.statesOrProvinces).length);
    });
    it('should return unknown country', function () {
      expect({name: 'country#11'}).to.deep.eq(Geo.getCountry(continent0, 11));
    });
  });
});
