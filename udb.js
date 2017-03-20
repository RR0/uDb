const fs = require('fs');
const program = require('commander');

program
  .version('0.0.1')
  .option('-d, --data [dataFile]', 'Specify data file. Defaults to ./U.RND')
  .option('-s, --sources [sourcesFile]', 'Specify sources file. Defaults to ./usources.txt')
  .option('-wm, --worldmap [wmFile]', 'Specify world map file. Defaults to ./WM.VCE')
  .option('-i, --interval <fromIndex>..<toIndex>', 'Specify first record to output. Defaults to 1')
  .option('-r, --records <recordsIndexes>', 'Specify a list of indexes of records to output.')
  .option('-c, --count <maxCount>', 'Specify the maximim number of records to output.')
  .option('-f, --format <default|csv> [csvSeparator]', 'The format of the output')
  .option('-o, --output <outputFile>', 'The name of the file to output. Will output as CSV if file extension is .csv')
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

    const countries = {};
    countries[2] = 'USA';
    countries[20] = 'Argentina';
    countries[49] = 'Great Britain';
    countries[51] = 'Germany';
    countries[53] = 'France';
    countries[54] = 'Spain';
    countries[57] = 'Italy';
    countries[83] = 'India';
    countries[97] = 'Japan';
    countries[163] = 'Irak';
    countries[166] = 'Israël';
    countries[170] = 'Lebanon';
    countries[178] = 'Moon';

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
      let recordIndex = 1;
      if (program.from) {
        recordIndex = parseInt(program.from, 10);
      }
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

        function skip(l) {
          let max = recordPos + l;
          for (; recordPos < max; ++recordPos) {
            let value = buffer[recordPos];
            recordHex += value < 0x10 ? '0' : '';
            recordHex += value.toString(16) + ' ';
            recordRead += '   ';
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
          readByte('unknown');
          readLatLong('longitude');
          readLatLong('latitude');
          readSignedInt('elevation');
          readSignedInt('relativeAltitude');
          skip(1);
          readByte('countryCode');
          readString(3, 'area');
          skip(1);
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
          record.description2 = split[3];
          record.description3 = split[4];
          record.description4 = split[5];

          readByte('ref');
          readByte('refIndex');
          readByte('strangenessAndCredibility');

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

          desc(record) {
            let props = Object.keys(record);
            let str = '';
            let sep = '';
            for (let i = 0; i < props.length; ++i) {
              const prop = props[i];
              str += sep + record[prop];
              sep = this.separator;
            }
            return str;
          }

          write(record) {
            if (!this.header) {
              let props = Object.keys(record);
              const headerRecord = {};
              for (let i = 0; i < props.length; ++i) {
                const prop = props[i];
                headerRecord[prop] = prop;
              }
              this.output.write(this.desc(headerRecord) + '\n');
              this.header = true;
            }
            this.output.write(this.desc(record) + '\n');
          }
        }

        class DefaultRecordOutput {
          constructor(output) {
            this.output = output;
          }

          accuracy(value, valueAccuracy) {
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

          desc(record) {
            const country = countries[record.countryCode] ? countries[record.countryCode] : 'country#' + record.countryCode;

            const yearAccuracy = (record.ymdt >> 6) & 3;
            const monthAccuracy = (record.ymdt >> 4) & 3;
            const dayAccuracy = (record.ymdt >> 2) & 3;
            const timeAccuracy = record.ymdt & 3;

            let year = this.accuracy(record.year, yearAccuracy);
            let month = this.accuracy((record.month < 10 ? '0' : '') + record.month, monthAccuracy);
            let day = this.accuracy((record.day > 31 ? '--' : (record.day < 10 ? '0' : '') + record.day), dayAccuracy);

            let hours = Math.floor(record.hour / 6);
            let minutes = (record.hour % 6) * 10;
            let time = this.accuracy((hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes, timeAccuracy);

            let locale = (locales[record.locale] ? locales[record.locale] : 'locale#' + record.locale);

            const ref = record.ref ? primaryReferences[record.ref] : '';

            let strangeness = record.strangenessAndCredibility >> 4;
            let credibility = record.strangenessAndCredibility & 0xF;

            let recordIndex = position / recordSize;
            let elevation = record.elevation !== -99 ? record.elevation : null;
            let relativeAltitude = record.relativeAltitude !== 999 ? record.relativeAltitude : null;
            let desc = '\nRecord #' + recordIndex + '\n  Title       : ' + record.title + '\n' +
              '  Date        : ' + year + '/' + month + '/' + day + ', ' + time + '\n';
            let locationStr = '  Location    : ' + locale + ', '
              + record.location
              + ' (' + record.area + ', ' + country + '), '
              + ddToDms(record.latitude, record.longitude) + '\n' +
              (elevation || relativeAltitude ? ('                ' + (elevation ? 'Elevation ' + elevation + ' m' : '')
              + (relativeAltitude ? ', relative altitude ' + relativeAltitude + ' m' : '') + '\n') : '');

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

            let descriptionStr = '  Description : ' + (record.description ? record.description : '') + '\n';
            if (record.description2) {
              descriptionStr += '                ' + record.description2 + '\n';
            }
            if (record.description3) {
              descriptionStr += '                ' + record.description3 + '\n';
            }
            if (record.description4) {
              descriptionStr += '                ' + record.description4 + '\n';
            }
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
            desc += '  Strangeness : ' + strangeness + '\n';
            desc += '  Credibility : ' + credibility + '\n';
            desc += '  Reference   : ' + ref + '\n'
              + '                at index #' + record.refIndex;
            return desc;
          }

          write(record) {
            this.output.write(this.desc(record) + '\n');
          }
        }

        let count = 0;
        class MaxCountRecordEnumerator {
          constructor(maxCount) {
            position = recordIndex * recordSize;
            this.maxCount = maxCount;
          }

          hasNext() {
            return count < this.maxCount;
          }

          next() {
            recordIndex++;
            position += recordSize;
          }
        }

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
          constructor() {
            position = recordIndex * recordSize;
          }

          hasNext() {
            return position < fileSize;
          }

          next() {
            recordIndex++;
            position += recordSize;
          }
        }

        let output = process.stdout;
        if (program.output) {
          output = fs.createWriteStream(program.output, {flags: 'w'});
        }

        let outputFormat;
        switch (format.toLocaleLowerCase()) {
          case 'csv':
            outputFormat = new CsvRecordOutput('\t', output);
            break;
          default:
            outputFormat = new DefaultRecordOutput(output);
        }
        const recordEnumerator = new DefaultRecordEnumerator();
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