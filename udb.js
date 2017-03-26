const fs = require('fs');
const program = require('commander');
const json2xml = require('json2xml');

const util = require('./util');
const csv = require('./csv');
const flags = require('./flags');
const geo = require('./geo');
const time = require('./time');

function range(val) {
  return val.split('..').map(Number);
}
program
  .version('0.0.1')
  .option('-d, --data [dataFile]', 'Specify data file. Defaults to ./U.RND')
  .option('-s, --sources [sourcesFile]', 'Specify sources file. Defaults to ./usources.txt')
  .option('-wm, --worldmap [wmFile]', 'Specify world map file. Defaults to ./WM.VCE')
  .option('-r, --range <fromIndex>..<toIndex>', 'Specify record range to output. Defaults to 1..end', range)
  .option('-r, --records <recordsIndexes>', 'Specify a list of indexes of records to output.')
  .option('-c, --count <maxCount>', 'Specify the maximim number of records to output.')
  .option('-f, --format <default|csv|xml> [csvSeparator]', 'The format of the output')
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

    let recordSize = 112;
    const buffer = new Buffer(recordSize);

    fs.open(dataFile, 'r', function (status, fd) {
      const firstsIndex = (program.range && program.range[0]) || 1;
      let recordIndex = firstsIndex;
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
            record[prop] = util.trimZeroEnd(str).trim();
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

          function readNibbles(prop1, prop2) {
            return readByteBits(prop1, 4, prop2);
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
          readByteBits('refIndexHigh', 5, 'day');
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
          readString(3, 'stateOrProvince');
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
          let text = split[2];
          record.description = text ? text : '';
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
          record.refIndex = (record.refIndexHigh << 8) + record.refIndex;

          readNibbles('strangeness', 'credibility');

          logDebug(`buffer=${recordHex}\n              ${recordRead}`);
          return record;
        }

        function readRecord() {
          fs.readSync(fd, buffer, 0, recordSize, position);
          return bufferToRecord(buffer);
        }

        class DefaultRecordOutput {
          constructor(output) {
            this.output = output;
          }

          desc(record) {
            let continentCode = record.continentCode;
            const continent = geo.getContinent(continentCode);
            let countryCode = record.countryCode;
            const country = geo.getCountry(continent, countryCode);
            let year = time.getYear(record);
            let month = time.getMonth(record, true);
            let day = time.getDay(record, true);
            let timeStr = time.getTime(record);
            let localeStr = geo.getLocale(record);

            const ref = record.ref ? primaryReferences[record.ref] : '';

            let recordIndex = position / recordSize;
            let elevationStr = geo.getElevation(record);
            let relativeAltitudeStr = geo.getRelativeAltitude(record);
            let desc = '\nRecord #' + recordIndex + '\n  Title       : ' + record.title + '\n' +
              '  Date        : ' + year + '/' + month + '/' + day + ', ' + timeStr + '\n';
            let countryStr = country.name + (country.description ? ` (${country.description})` : '');
            let stateOrProvince = geo.getStateOrProvince(country, record);
            let locationStr = '  Location    : ' + localeStr + ', '
              + record.location
              + ' (' + stateOrProvince + ', ' + countryStr + ', ' + continent.name + '), '
              + geo.ddToDms(record.latitude, record.longitude) + '\n' +
              (elevationStr || relativeAltitudeStr ? ('                ' + (elevationStr ? 'Elevation ' + elevationStr + ' m' : '')
              + (relativeAltitudeStr ? ', relative altitude ' + relativeAltitudeStr + ' m' : '') + '\n') : '');

            function flagsStr(flagsByte, flagsLabels) {
              let flagsStr = '';
              let keys = Object.keys(flagsLabels);
              util.forEachBit(flagsByte, (i) => {
                let key = keys[i];
                let flagLabels = flagsLabels[key];
                flagsStr += '                - ' + key + ': ' + (flagLabels.description ? flagLabels.description : flagLabels) + '\n';
              });
              return flagsStr;
            }

            locationStr += '                Observer:\n' + flagsStr(record.locationFlags, flags.locationFlagsLabels);

            let description = record.description && record.description.replace(/\n/g, '\n                ');
            let descriptionStr = '  Description : ' + (description ? description : '') + '\n';

            let miscFlagsStr = flagsStr(record.miscellaneousFlags, flags.miscellaneousFlagsLabels);
            if (miscFlagsStr) {
              descriptionStr += '                Miscellaneous details and features:\n' + miscFlagsStr;
            }
            let typeOfUfoCraftStr = flagsStr(record.typeOfUfoCraftFlags, flags.typeOfUfoCraftFlagsLabels);
            if (typeOfUfoCraftStr) {
              descriptionStr += '                Type of UFO / Craft:\n' + typeOfUfoCraftStr;
            }

            let aliensMonstersStr = flagsStr(record.aliensMonstersFlags, flags.aliensMonstersLabels);
            if (aliensMonstersStr) {
              descriptionStr += '                Aliens! Monsters! (sorry, no religious figures):\n' + aliensMonstersStr;
            }
            let apparentUfoOccupantActivitiesStr = flagsStr(record.apparentUfoOccupantActivitiesFlags, flags.apparentUfoOccupantActivitiesLabels);
            if (apparentUfoOccupantActivitiesStr) {
              descriptionStr += '                Apparent UFO/Occupant activities:\n' + apparentUfoOccupantActivitiesStr;
            }
            let placesVisitedAndThingsAffectedStr = flagsStr(record.placesVisitedAndThingsAffectedFlags, flags.placesVisitedAndThingsAffectedLabels);
            if (apparentUfoOccupantActivitiesStr) {
              descriptionStr += '                Places visited and things affected:\n' + placesVisitedAndThingsAffectedStr;
            }
            let evidenceAndSpecialEffectsStr = flagsStr(record.evidenceAndSpecialEffectsFlags, flags.evidenceAndSpecialEffectsLabels);
            if (evidenceAndSpecialEffectsStr) {
              descriptionStr += '                Evidence and special effects:\n' + evidenceAndSpecialEffectsStr;
            }
            let miscellaneousDetailsStr = flagsStr(record.miscellaneousDetailsFlags, flags.miscellaneousDetailsLabels);
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

          end() {

          }
        }

        class XmlRecordOutput {
          constructor(output) {
            this.output = output;
            this.output.write('<?xml version="1.0" encoding="UTF-8">\n<udb>')
          }

          desc(record) {
            return json2xml(record).toString();
          }

          write(record) {
            this.output.write('<record>'+this.desc(record) + '</record>\n');
          }

          end() {
            this.output.write('</udb>')
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
        let csvSeparator = ',';
        switch (format.toLocaleLowerCase()) {
          case 'rawcsv':
            outputFormat = new csv.CsvRecordOutput(csvSeparator, output);
            break;
          case 'csv':
            outputFormat = new csv.ReadableCsvRecordOutput(csvSeparator, output);
            break;
          case 'xml':
            outputFormat = new XmlRecordOutput(output);
            break;
          default:
            outputFormat = new DefaultRecordOutput(output);
        }
        let lastIndex = (program.range && program.range[1]) || 10000000;
        let maxCount = program.count || (lastIndex - firstsIndex + 1);
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
        outputFormat.end();
        logVerbose(`\nRead ${count} reports.`);
        fs.close(fd);
      });
    });
  });