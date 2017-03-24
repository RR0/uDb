const fs = require('fs');
const program = require('commander');

function range(val) {
  return val.split('..').map(Number);
}
program
  .version('0.0.1')
  .option('-d, --data [dataFile]', 'Specify data file. Defaults to ./U.RND')
  .option('-s, --sources [sourcesFile]', 'Specify sources file. Defaults to ./usources.txt')
  .option('-wm, --worldmap [wmFile]', 'Specify world map file. Defaults to ./WM.VCE')
  .option('-r, --range <fromIndex>..<toIndex>', 'Specify first record to output. Defaults to 1..end', range)
  .option('-r, --records <recordsIndexes>', 'Specify a list of indexes of records to output.')
  .option('-c, --count <maxCount>', 'Specify the maximim number of records to output.')
  .option('-f, --format <default|csv|rawcsv> [csvSeparator]', 'The format of the output')
  .option('-o, --out <outputFile>', 'The name of the file to output. Will output as CSV if file extension is .csv')
  .option('-v, --verbose', 'Displayed detailed processing information.')
  .option('--debug', 'Displays debug info.')
  .parse(process.argv);

const sourcesFile = program.dataFile || 'usources.txt';
const dataFile = program.sourcesFile || 'U.RND';
const worldMap = program.wmFile || 'WM.VCE';
const format = program.format || 'default';

const primaryReferences = {};
const newspapersAndFootnotes = {};
const otherDatabasesAndWebsites = {};
const otherPeriodicals = {};
const misc = {};
const discredited = [];

const DEBUG = program.debug;

function logDebug(msg) {
  if (DEBUG) console.log('DEBUG: ' + msg);
}

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
function ddToDms(lat, lng) {
  let latResult = getDms(lat) + ' ';
  latResult += !lng ? 'Q' : lat > 0 ? 'N' : 'S';

  let lngResult = getDms(lng) + ' ';
  lngResult += !lng ? 'Z' : lng > 0 ? 'W' : 'E';

  return lngResult + ' ' + latResult;
}

function trimZeroEnd(str) {
  const zeroEnd = str.indexOf('\u0000');
  if (zeroEnd > 0) {
    str = str.substring(0, zeroEnd);
  }
  return str;
}

function logVerbose(msg) {
  if (program.verbose) {
    console.log(msg);
  }
}

fs.open(worldMap, 'r', function (status, fd) {
  logVerbose('Reading world map:');
  if (status) {
    console.log(status.message);
    return;
  }
  fs.fstat(fd, function (err, stats) {
    const fileSize = stats.size;
    let position = 0;
    let recordSize = 6;
    let count = 0;
    const buffer = new Buffer(recordSize);
    while (position < fileSize) {
      if ((position + recordSize) > fileSize) {
        let recordSize = fileSize - position;
        logDebug('last recordSize=' + recordSize);
      }
      fs.readSync(fd, buffer, 0, recordSize, position);
      //console.log('  ' + buffer.toString('hex'));
      count++;
      position += recordSize;
    }
    logVerbose(`Read ${count} WM records.\n`)
  });
});

const sourcesReader = require('readline').createInterface({
  input: require('fs').createReadStream(sourcesFile)
});

function addDiscredited(line) {
  discredited.push(line.substring(2));
}
function addSource(arr, line) {
  const ref = parseInt(line.substring(1, 4), 0);
  arr[ref] = line.substring(5);
}
sourcesReader
  .on('line', function (line) {
    switch (line.charAt(0)) {
      case '/':
        addSource(primaryReferences, line);
        break;
      case '$':
        addSource(newspapersAndFootnotes, line);
        break;
      case '+':
        addSource(otherDatabasesAndWebsites, line);
        break;
      case '%':
        addSource(otherPeriodicals, line, true);
        break;
      case '#':
        addSource(misc, line);
        break;
      case '!':
        addDiscredited(line);
        break;
    }
  })
  .on('close', function () {
    logVerbose('Reading sources:');
    logVerbose('- ' + Object.keys(primaryReferences).length + ' primary references');
    logVerbose('- ' + Object.keys(newspapersAndFootnotes).length + ' newspapers and footnotes');
    logVerbose('- ' + Object.keys(otherDatabasesAndWebsites).length + ' newspapers and footnotes');
    logVerbose('- ' + Object.keys(otherPeriodicals).length + ' other periodicals');
    logVerbose('- ' + Object.keys(misc).length + ' misc. books, reports, files & correspondance');
    logVerbose('- ' + discredited.length + ' discredited reports');

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

    let recordSize = 112;
    const buffer = new Buffer(recordSize);

    fs.open(dataFile, 'r', function (status, fd) {
      let recordIndex = (program.range && program.range[0]) || 1;
      logVerbose(`\nReading cases from #${recordIndex}:`);
      if (status) {
        console.log(status.message);
        return;
      }
      let position = recordIndex * recordSize;

      fs.fstat(fd, function (err, stats) {
        const fileSize = stats.size;
        // logDebug('File size=' + fileSize);

        let recordPos;
        let recordHex;
        let recordRead;

        function read(l) {
          let max = recordPos + l;
          for (; recordPos < max; ++recordPos) {
            let value = buffer[recordPos];
            recordHex += value < 0x10 ? '0' : '';
            recordHex += value.toString(16) + ' ';
            recordRead += 'rr ';
          }
        }

        function bufferToRecord() {
          const record = {};
          recordPos = 0;
          recordHex = '';
          recordRead = '';

          function logReadPos(prop) {
            let pos = position + recordPos;
            let value = record[prop];
            if (typeof value === 'string') {
              value = `'${value}'`;
            } else {
              value += ` (0x${value.toString(16)}, ${value.toString(2)})`;
            }
            let logStr = `at ${pos} (0x${pos.toString(16)}) read ${prop}=${value}`;
            logDebug(logStr);
          }

          function readString(length, prop) {
            let str = buffer.toString('utf8', recordPos, recordPos + length);
            record[prop] = trimZeroEnd(str);
            logReadPos(prop);
            read(length);
            return str;
          }

          function readByte(prop) {
            const byte = buffer[recordPos];
            record[prop] = byte;
            logReadPos(prop);
            read(1);
            return byte;
          }

          function readNibbles(prop1, prop2) {
            const byte = buffer[recordPos];
            record[prop1] = byte >> 4;
            record[prop2] = byte & 0xF;
            logReadPos(prop1);
            logReadPos(prop2);
            read(1);
            return byte;
          }

          function readByteBits(prop1, size, prop2) {
            const byte = buffer[recordPos];
            record[prop1] = byte >> size;
            record[prop2] = byte & ((1 << size) - 1);
            logReadPos(prop1);
            logReadPos(prop2);
            read(1);
            return byte;
          }

          function readSignedInt(prop) {
            let sInt = buffer.readInt16LE(recordPos);
            record[prop] = sInt;
            logReadPos(prop);
            read(2);
            return sInt;
          }

          function readLatLong(prop) {
            let firstByte = buffer[recordPos + 1];
            let extraBit = firstByte >> 7;
            logDebug('extrabit=' + extraBit);
            let sInt = readSignedInt(prop);
            sInt = (sInt >> 1);
            sInt = sInt / 100;
            // logDebug('orig=' + sInt);
            record[prop] = sInt * 1.11111111111;
            return sInt;
          }

          readSignedInt('year');
          readByte('locale');
          readByteBits('beforeMonth', 4, 'month');
          readByteBits('beforeDay', 5, 'day');
          readByte('hour');
          readByte('ymdt');
          readByte('duration');
          readByte('unknown1');
          readLatLong('longitude');
          readLatLong('latitude');
          readSignedInt('elevation');
          readSignedInt('relativeAltitude');
          readByte('unknown2');
          readNibbles('continentCode', 'countryCode');
          readString(3, 'area');
          readByte('unknown3');
          readByte('locationFlags');
          readByte('miscellaneousFlags');
          readByte('typeOfUfoCraftFlags');
          readByte('aliensMonstersFlags');
          readByte('apparentUfoOccupantActivitiesFlags');
          readByte('placesVisitedAndThingsAffectedFlags');
          readByte('evidenceAndSpecialEffectsFlags');
          readByte('miscellaneousDetailsFlags');
          readString(78, 'description');
          const split = record.description.split(':');
          record.location = split[0];
          record.title = split[1];
          record.description = split[2];
          const description2 = split[3];
          if (description2) {
            record.description += '\n' + description2;
          }
          const description3 = split[4];
          if (description3) {
            record.description += '\n' + description3;
          }
          const description4 = split[5];
          if (description4) {
            record.description += '\n' + description4;
          }
          readByte('ref');
          readByte('refIndex');
          readNibbles('strangeness', 'credibility');

          logDebug(`buffer=${recordHex}\n              ${recordRead}`);
          return record;
        }

        function readRecord() {
          fs.readSync(fd, buffer, 0, recordSize, position);
          return bufferToRecord(buffer);
        }

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

        function getCountry(continent, countryCode) {
          let country = continent.countries[countryCode];
          return country ? (country.name ? country : {name: country}) : {name: 'country#' + countryCode};
        }

        function getContinent(continentCode) {
          return continents[continentCode] ? continents[continentCode] : {
            name: 'continent#' + continentCode,
            countries: {}
          };
        }

        function getLocale(record) {
          const locale = record.locale;
          return locales[locale] ? locales[locale] : 'locale#' + locale;
        }

        class ReadableCsvRecordOutput extends CsvRecordOutput {
          format(record) {
            let continent = getContinent(record.continentCode);
            if (continent) {
              record.continent = continent.name;
              delete record.continentCode;

              record.country = getCountry(continent, record.countryCode).name;
              delete record.countryCode;
            }
            record.locale = getLocale(record.locale);
            record.year = getYear(record);
            record.month = getMonth(record);
            record.day = getDay(record);
            record.hour = getTime(record);
            record.elevation = getElevation(record);
            record.relativeAltitude = getRelativeAltitude(record);
            return record;
          }

          getColumns(record) {
            const headerRecord = JSON.parse(JSON.stringify(record));
            delete headerRecord.beforeMonth;
            delete headerRecord.beforeDay;
            delete headerRecord.ymdt;
            delete headerRecord.unknown1;
            delete headerRecord.unknown2;
            delete headerRecord.unknown3;
            delete headerRecord.continentCode;
            headerRecord.continent = 'continent';
            delete headerRecord.countryCode;
            headerRecord.country = 'country';
            return super.getColumns(headerRecord);
          }
        }

        function accuracy(value, valueAccuracy) {
          let accurateValue = '';
          switch (valueAccuracy) {
            case 0:
              break;
            case 1:
              accurateValue = '?';
              break;
            case 2:
              accurateValue = '~';
            case 3:
              accurateValue += value;
          }
          return accurateValue;
        }

        function getDay(record) {
          const dayAccuracy = (record.ymdt >> 2) & 3;
          return accuracy((record.day > 31 ? '--' : (record.day < 10 ? '0' : '') + record.day), dayAccuracy);
        }

        function getMonth(record) {
          const monthAccuracy = (record.ymdt >> 4) & 3;
          return accuracy((record.month < 10 ? '0' : '') + record.month, monthAccuracy);
        }

        function getYear(record) {
          const yearAccuracy = (record.ymdt >> 6) & 3;
          return accuracy(record.year, yearAccuracy);
        }

        function getTime(record) {
          let time = record.hour;
          const timeAccuracy = record.ymdt & 3;
          let hours = Math.floor(time / 6);
          let minutes = (time % 6) * 10;
          return accuracy((hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes, timeAccuracy);
        }

        function getElevation(record) {
          let elevation = record.elevation;
          return elevation !== -99 ? elevation : '';
        }

        function getRelativeAltitude(record) {
          const relativeAltitude = record.relativeAltitude;
          return relativeAltitude !== 999 ? relativeAltitude : '';
        }

        class DefaultRecordOutput {
          constructor(output) {
            this.output = output;
          }

          desc(record) {
            let continentCode = record.continentCode;
            const continent = getContinent(continentCode);
            let countryCode = record.countryCode;
            const country = getCountry(continent, countryCode);
            let year = getYear(record);
            let month = getMonth(record);
            let day = getDay(record);
            let timeStr = getTime(record);
            let localeStr = getLocale(record);

            const ref = record.ref ? primaryReferences[record.ref] : '';

            let recordIndex = position / recordSize;
            let elevationStr = getElevation(record);
            let relativeAltitudeStr = getRelativeAltitude(record);
            let desc = '\nRecord #' + recordIndex + '\n  Title       : ' + record.title + '\n' +
              '  Date        : ' + year + '/' + month + '/' + day + ', ' + timeStr + '\n';
            let countryStr = country.name + (country.description ? ` (${country.description})` : '');
            let locationStr = '  Location    : ' + localeStr + ', '
              + record.location
              + ' (' + record.area + ', ' + countryStr + ', ' + continent.name + '), '
              + ddToDms(record.latitude, record.longitude) + '\n' +
              (elevationStr || relativeAltitudeStr ? ('                ' + (elevationStr ? 'Elevation ' + elevationStr + ' m' : '')
              + (relativeAltitudeStr ? ', relative altitude ' + relativeAltitudeStr + ' m' : '') + '\n') : '');

            function flagsStr(flagsByte, flagsLabels) {
              let flagsStr = '';
              let byte = flagsByte;
              let keys = Object.keys(flagsLabels);
              for (let i = 0; i < 8; i++) {
                const bit = byte & 1;
                if (bit) {
                  let key = keys[i];
                  flagsStr += '                - ' + key + ': ' + flagsLabels[key] + '\n';
                }
                byte = byte >> 1;
              }
              return flagsStr;
            }

            /**
             * Location of the OBSERVER.
             * @type {{MAP: string, GND: string, CST: string, SEA: string, AIR: string, MIL: string, CIV: string, HQO: string}}
             */
            const locationFlagsLabels = {
              MAP: 'Coordinates are known.  OK to place event on screen maps.',
              GND: 'At least ONE observer (or radar) was on land.',
              CST: 'Sighting in coastal area, possibly just offshore.',
              SEA: 'Sighting was at sea, typically from some marine craft.',
              AIR: 'Airborne observer.  Observer aboard aircraft.',
              MIL: 'At least ONE observer was military.',
              CIV: 'At least ONE observer was civilian',
              HQO: 'High Quality Observer(s): Scientists, Engineers, well trained individuals. 3 or more people with consistent descriptions.',
            };
            locationStr += '                Observer:\n' + flagsStr(record.locationFlags, locationFlagsLabels);

            let description = record.description && record.description.replace(/\n/g, '\n                ');
            let descriptionStr = '  Description : ' + (description ? description : '') + '\n';
            /**
             * Miscellaneous details and features.
             * @type {{SCI: string, TLP: string, NWS: string, MID: string, HOX: string, CNT: string, ODD: string, WAV: string}}
             */
            const miscellaneousFlagsLabels = {
              SCI: 'A scientist was involved, as an observer or investigator. Also, Scientific testing of traces or effects of sighting.',
              TLP: '"Telepathy":  Silent or voiceless communication.',
              NWS: 'Report from the news media, or else "sighting made the news".',
              MID: 'Likely Mis-IDentification of mundane object: (Venus, rocket..)',
              HOX: 'Suspicion or indications of a HOAX, journalistic prank etc.',
              CNT: 'Contactee:  Reports from would-be cult leaders -or- repeat "witnesses" with trite and predictable "messages for mankind".',
              ODD: 'Oddity:  1) A very strange event, even if not UFO related. 2) An atypical oddity that occurred during a UFO event. 3) Forteana or paranormal features.',
              WAV: 'Wave or Cluster of UFO sightings.  Sighting is part of a wave.'
            };
            let miscFlagsStr = flagsStr(record.miscellaneousFlags, miscellaneousFlagsLabels);
            if (miscFlagsStr) {
              descriptionStr += '                Miscellaneous details and features:\n' + miscFlagsStr;
            }
            /**
             * Type of UFO / Craft
             * @type {{SCR: string, CIG: string, DLT: string, NLT: string, PRB: string, FBL: string, SUB: string, NFO: string}}
             */
            const typeOfUfoCraftLabels = {
              SCR: 'Classic Saucer, Disk, Ovoid or Sphere.  Not just some light.',
              CIG: 'Torpedo, cigar, fuselage or cylinder shaped vehicle. (Use SCR for a classic "saucer" seen edge-on.)',
              DLT: 'Delta, Vee, boomerang, rectangular UFO.  Sharp corners and edges.',
              NLT: 'Nightlights:  Points of light with no discernable shape.',
              PRB: 'Probe:  Small weird object maneuvers.  Remote controlled craft?',
              FBL: 'Fireball:  Blazing undistinguished form.  Possible meteors etc.',
              SUB: 'Submersible: UFO rises from, or submerges into a body of water.',
              NFO: 'No UFO Craft actually SEEN.  (Not necessarily absent..)'
            };
            let typeOfUfoCraftStr = flagsStr(record.typeOfUfoCraftFlags, typeOfUfoCraftLabels);
            if (typeOfUfoCraftStr) {
              descriptionStr += '                Type of UFO / Craft:\n' + typeOfUfoCraftStr;
            }
            /**
             * Aliens!  Monsters! ( sorry, no religious figures. )
             * @type {{OID: string, RBT: string, PSH: string, MIB: string, MON: string, GNT: string, FIG: string, NOC: string}}
             */
            const aliensMonstersLabels = {
              OID: 'Humanoid: Smallish alien figure, often "grey".',
              RBT: 'Possible Robot:  May resemble "Grey".  Mechanical motions.',
              PSH: '1) Pseudo-Human: Possible clone, robot or worse. 2) "Human" seen working with or for alien figures.',
              MIB: 'Man-in-Black: 1) PSH impersonating humans. 2) Mysterious man who tries to suppress UFO reports.',
              MON: 'Monster:  Apparent life form fits no standard category.',
              GNT: 'Giant:    Apparent alien larger than most humans.',
              FIG: 'Undefined or poorly seen "figure" or entity.  A shadow.',
              NOC: 'No entity / occupant seen by observer(s).'
            };
            let aliensMonstersStr = flagsStr(record.aliensMonstersFlags, aliensMonstersLabels);
            if (aliensMonstersStr) {
              descriptionStr += '                Aliens! Monsters! (sorry, no religious figures):\n' + aliensMonstersStr;
            }
            /**
             * Apparent UFO/Occupant activities.
             * @type {{OBS: string, RAY: string, SMP: string, MST: string, ABD: string, OPR: string, SIG: string, CVS: string}}
             */
            const apparentUfoOccupantActivitiesLabels = {
              OBS: 'Observation: Surveillance.  Chasing/pacing vehicles.',
              RAY: 'Odd light RAY, searchlight or visible beam.  Anything laserlike.',
              SMP: 'Sampling: Plant, animal, soil, rock, tissue or other specimens.',
              MST: 'Missing Time: Unexplained time-lapse or other time anomaly.',
              ABD: 'Known/suspected human abduction.  Animals also if taken whole.',
              OPR: 'Operations on humans.  Animal Mutilation.  Any invasive surgery.',
              SIG: 'ANY indication of possible signals to, from, between UFOs or their occupants;  -or- responses to human signals.',
              CVS: 'Conversation: ANY communication between "us" and "them"'
            };
            let apparentUfoOccupantActivitiesStr = flagsStr(record.apparentUfoOccupantActivitiesFlags, apparentUfoOccupantActivitiesLabels);
            if (apparentUfoOccupantActivitiesStr) {
              descriptionStr += '                Apparent UFO/Occupant activities:\n' + apparentUfoOccupantActivitiesStr;
            }
            /**
             * Places visited and things affected.
             * @type {{NUC: string, DRT: string, VEG: string, ANI: string, HUM: string, VEH: string, BLD: string, LND: string}}
             */
            const placesVisitedAndThingsAffectedLabels = {
              NUC: 'Any nuclear facility: Power plant.  Military.  Research facility.',
              DRT: 'Dirt affected: Traces in soil: landing marks, footprints etc.',
              VEG: 'Plants affected or sampled.  Broken tree limbs.  Crop circles.',
              ANI: 'Animals affected: Panic. Change of behavior. Injuries. Marks.',
              HUM: 'Human affected: Injury. burns. marks. psychology. abduction. death.',
              VEH: 'Vehicle affected: Marks, burns, electro-magnetic (EME) effects.',
              BLD: 'Building or ANY MANMADE STRUCTURE: Roads, Bridges, Power lines..',
              LND: 'Apparent Landing.  UFO (or any part thereof) sets down.'
            };
            let placesVisitedAndThingsAffectedStr = flagsStr(record.placesVisitedAndThingsAffectedFlags, placesVisitedAndThingsAffectedLabels);
            if (apparentUfoOccupantActivitiesStr) {
              descriptionStr += '                Places visited and things affected:\n' + placesVisitedAndThingsAffectedStr;
            }
            /**
             * Evidence and special effects
             * @type {{PHT: string, RDR: string, RDA: string, EME: string, TRC: string, TCH: string, HST: string, INJ: string}}
             */
            const evidenceAndSpecialEffectsLabels = {
              PHT: 'Photos, movies or videos taken of UFO and related phenomena.',
              RDR: 'Anomalous Radar traces/blips corresponding to UFO sightings.',
              RDA: 'Radiation or high energy fields detected during or after sighting.',
              EME: 'Electro-Magnetic Effect: Car, radio, lights, instruments.',
              TRC: 'Physical traces discovered ( most any variety. )',
              TCH: 'NEW Technical details.  Clues to alien technology.',
              HST: 'Historical account OR sighting makes history.',
              INJ: 'Wounds, scars, burns etc. as apparent result of close encounter. Resulting illness or death. Mutilations.'
            };
            let evidenceAndSpecialEffectsStr = flagsStr(record.evidenceAndSpecialEffectsFlags, evidenceAndSpecialEffectsLabels);
            if (evidenceAndSpecialEffectsStr) {
              descriptionStr += '                Evidence and special effects:\n' + evidenceAndSpecialEffectsStr;
            }
            /**
             * Miscellaneous details
             * @type {{MIL: string, BBK: string, GSA: string, OGA: string, SND: string, ODR: string, COV: string, CMF: string}}
             */
            const miscellaneousDetailsLabels = {
              MIL: 'Military investigation: Covert or open, foreign or domestic.',
              BBK: 'US Air Force BLUEBOOK case, regardless of finding.',
              GSA: 'Government Security Agency involvement: FBI, CIA, NSA, NRO, covert security arms of other agencies, foreign & domestic.',
              OGA: 'Other Government Agencies: Police, FAA, NASA, non-covert agency involvement in any way.',
              SND: 'UFO sounds heard or recorded.',
              ODR: 'ODORS associated with UFOs, or given off by them.',
              COV: 'Any indication of official Coverup.  Not simple incompetence.',
              CMF: 'Camouflage:  Apparent attempt of UFO or alien to hide or disguise itself or its operations in any way:  Cloud cigars, flying buses or haystacks,  false scenery or settings..'
            };
            let miscellaneousDetailsStr = flagsStr(record.miscellaneousDetailsFlags, miscellaneousDetailsLabels);
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
        }

        let count = 0;

        class ArrayRecordEnumerator {
          constructor(recordsIndexes) {
            this.recordsIndexes = recordsIndexes;
            position = recordsIndexes[recordIndex] * recordSize;
          }

          hasNext() {
            return recordIndex < this.recordsIndexes.length;
          }

          next() {
            recordIndex++;
            position = this.recordsIndexes[recordIndex] * recordSize;
          }
        }

        class DefaultRecordEnumerator {
          constructor(maxCount) {
            this.maxCount = maxCount;
            position = recordIndex * recordSize;
          }

          hasNext() {
            return position < fileSize && count < this.maxCount;
          }

          next() {
            recordIndex++;
            position += recordSize;
          }
        }

        let output = process.stdout;
        if (program.out) {
          output = fs.createWriteStream(program.out, {flags: 'w'});
        }

        let outputFormat;
        switch (format.toLocaleLowerCase()) {
          case 'rawcsv':
            outputFormat = new CsvRecordOutput('\t', output);
            break;
          case 'csv':
            outputFormat = new ReadableCsvRecordOutput('\t', output);
            break;
          default:
            outputFormat = new DefaultRecordOutput(output);
        }
        let maxCount = program.count || 10000000;
        const recordEnumerator = new DefaultRecordEnumerator(maxCount);
        //const recordEnumerator = new MaxCountRecordEnumerator(500);
        //const recordEnumerator = new ArrayRecordEnumerator([18121]);

        while (recordEnumerator.hasNext()) {
          if ((position + recordSize) > fileSize) {
            recordSize = fileSize - position;
            fs.readSync(fd, buffer, 0, recordSize, position);
            logDebug('last record=' + buffer.toString());
            position += recordSize;
          } else {
            const record = readRecord();
            outputFormat.write(record);
            recordEnumerator.next();
            count++;
          }
        }
        logVerbose(`\nRead ${count} reports.`);
        fs.close(fd);
      });
    });
  });