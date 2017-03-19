const fs = require('fs');

const sourcesFile = process.argv[2] || 'usources.txt';
const dataFile = process.argv[3] || 'U.RND';
const worldMap = process.argv[4] || 'WM.VCE';

const primaryReferences = {};
const newspapersAndFootnotes = {};
const otherDatabasesAndWebsites = {};
const otherPeriodicals = {};
const misc = {};
const discredited = [];

const DEBUG = false;

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

fs.open(worldMap, 'r', function (status, fd) {
  console.log('Reading world map:');
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
    console.log(`Read ${count} WM records.\n`)
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
    console.log('Reading sources:');
    console.log('- ' + Object.keys(primaryReferences).length + ' primary references');
    console.log('- ' + Object.keys(newspapersAndFootnotes).length + ' newspapers and footnotes');
    console.log('- ' + Object.keys(otherDatabasesAndWebsites).length + ' newspapers and footnotes');
    console.log('- ' + Object.keys(otherPeriodicals).length + ' other periodicals');
    console.log('- ' + Object.keys(misc).length + ' misc. books, reports, files & correspondance');
    console.log('- ' + discredited.length + ' discredited reports');

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
      console.log('\nReading cases:');
      if (status) {
        console.log(status.message);
        return;
      }
      const recordNumber = 1;
      let position = recordNumber * recordSize;

      fs.fstat(fd, function (err, stats) {
        const fileSize = stats.size;
        // logDebug('File size=' + fileSize);

        let count = 0;
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
              value += ` (0x${value.toString(16)})`;
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
            logDebug('orig=' + sInt);
            record[prop] = sInt * 1.11111111111;
            logReadPos(prop);
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
          skip(5);
          readByte('countryCode');
          readString(3, 'area');
          skip(9);
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

        class CsvRecordWriter {
          constructor(separator, output) {
            this.separator = separator;
            this.output = output;
            output.write('Country code,Source code,Source position\n');
          }

          desc(record) {
            return record.countryCode + this.separator +
              record.ref + this.separator +
              record.refIndex;
          }

          write(record) {
            this.output.write(this.desc(record) + '\n');
          }
        }

        class HumanRecordWriter {
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
            let desc = '\nRecord #' + recordIndex + '\n  Title       : ' + record.title + '\n' +
                '  Date        : ' + year + '/' + month + '/' + day + ', ' + time + '\n' +
                '  Location    : ' + locale + ', ' + record.location + ' (' + record.area + ', ' + country + '), ' + ddToDms(record.latitude, record.longitude) + '\n' +
                '  Description : ' + (record.description ? record.description : '') + '\n'
              ;
            if (record.description2) {
              desc += '                ' + record.description2 + '\n';
            }
            if (record.description3) {
              desc += '                ' + record.description3 + '\n';
            }
            if (record.description4) {
              desc += '                ' + record.description4 + '\n';
            }
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

        class MaxCountRecordEnumerator {
          constructor(maxCount) {
            this.maxCount = maxCount;
          }

          hasNext() {
            return count < this.maxCount;
          }

          next() {
            count++;
            position += recordSize;
          }
        }

        class ArrayRecordEnumerator {
          constructor(records) {
            this.records = records;
            position = records[count] * recordSize;
          }

          hasNext() {
            return count < this.records.length;
          }

          next() {
            count++;
            position = this.records[count] * recordSize;
          }
        }

        class DefaultRecordEnumerator {
          hasNext() {
            return position < fileSize;
          }

          next() {
            count++;
            position += recordSize;
          }
        }
        const output = process.stdout;
        const format = new HumanRecordWriter(output);
        //const format = new CsvRecordWriter(',',output);
        //const recordEnumerator = new DefaultRecordEnumerator();
        const recordEnumerator = new MaxCountRecordEnumerator(10);
        //const recordEnumerator = new ArrayRecordEnumerator([182]);
        while (recordEnumerator.hasNext()) {
          if ((position + recordSize) > fileSize) {
            recordSize = fileSize - position;
            logDebug('last recordSize=' + recordSize);
          }
          const record = readRecord();
          format.write(record);
          recordEnumerator.next();
        }
        console.log(`\nRead ${count} reports.`);
        fs.close(fd);
      });
    });
  });