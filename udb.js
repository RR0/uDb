const fs = require('fs');

const sourcesFile = process.argv[2] || 'usources.txt';
const dataFile = process.argv[3] || 'U.RND';

const primaryReferences = {};
const newspapersAndFootnotes = {};
const otherDatabasesAndWebsites = {};
const otherPeriodicals = {};
const misc = {};
const discredited = [];

const DEBUG = true;

function logDebug(msg) {
  if (DEBUG) console.log('DEBUG: ' + msg);
}

function trimZeroEnd(str) {
  const zeroEnd = str.indexOf('\u0000');
  if (zeroEnd > 0) {
    str = str.substring(0, zeroEnd);
  }
  return str;
}

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

    const locationKinds = {};
    locationKinds[0] = 'Metropolis';
    locationKinds[1] = 'Residential';
    locationKinds[2] = 'Town & city';
    locationKinds[3] = 'Farmlands';
    locationKinds[4] = 'Pasture';
    locationKinds[5] = 'Oil & coal';
    locationKinds[6] = 'Tundra';
    locationKinds[7] = 'Desert';
    locationKinds[8] = 'Mountains';
    locationKinds[9] = 'Wetlands';
    locationKinds[10] = 'Forest';
    locationKinds[11] = 'Rainforest';
    locationKinds[12] = 'Coastlands';
    locationKinds[13] = 'Offshore';
    locationKinds[14] = 'High seas';
    locationKinds[15] = 'Islands';
    locationKinds[16] = 'In-flight';
    locationKinds[17] = 'Space';
    locationKinds[18] = 'Military base';
    locationKinds[19] = 'Unknown';
    locationKinds[20] = 'Road + rails';

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
            }
            logDebug(`at ${pos} (0x${pos.toString(16)}) read ${prop}=${value} (0x${value.toString(16)})`);
          }

          function readString(length, prop) {
            let str = buffer.toString('utf8', recordPos, recordPos + length);
            read(length);
            record[prop] = trimZeroEnd(str);
            logReadPos(prop);
            return str;
          }

          function readByte(prop) {
            const byte = buffer[recordPos];
            read(1);
            record[prop] = byte;
            logReadPos(prop);
            return byte;
          }

          function readSignedInt(prop) {
            const byteA = buffer[recordPos + 1];
            const byteB = buffer[recordPos];
            const sign = byteA & (1 << 7);
            let sInt = (((byteA & 0xFF) << 8) | (byteB & 0xFF));
            if (sign) {
              sInt = 0xFFFF0000 | sInt;  // fill in most significant bits with 1's
            }
            record[prop] = sInt;
            read(2);
            logReadPos(prop);
            return sInt;
          }

          function readLatLong() {
            const degrees = 31;
            const semiCircles = degrees * ( 2 << 31 / 180 );
          }

          readSignedInt('year');
          readByte('locationKind');
          readByte('month');
          readByte('day');
          readByte('hour');
          readByte('flags');
          readByte('duration');
          skip(10);
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
          readByte('otherFlags');

          logDebug(`buffer=${recordHex}\n              ${recordRead}`);
          return record;
        }

        function readRecord() {
          fs.readSync(fd, buffer, 0, recordSize, position);
          return bufferToRecord(buffer);
        }

        function recordDesc(record) {
          const country = countries[record.countryCode] ? countries[record.countryCode] : 'country#' + record.countryCode;
          let hours = Math.floor(record.hour / 6);
          let minutes = (record.hour % 6) * 10;
          let hour = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
          let locationKind = (locationKinds[record.locationKind] ? locationKinds[record.locationKind] : 'locationKind#' + record.locationKind);
          let day = (record.day > 31 ? '--' : (record.day < 10 ? '0' : '') + record.day);
          let month = (record.month < 10 ? '0' : '') + record.month;

          let flags = '';
          flags += (record.flags >> 6) & 3;
          flags += (record.flags >> 4) & 3;
          flags += (record.flags >> 2) & 3;
          flags += record.flags & 3;

          let otherFlags = (record.otherFlags >> 4).toString(16) + ':' + (record.otherFlags & 0xF).toString(16);

          let recordIndex = position / recordSize;
          let desc = '\nRecord #' + recordIndex + '\n- Title       : ' + record.title + '\n' +
              '  Date        : ' + record.year + '/' + month + '/' + day + ' ' + hour + '\n' +
              '  Location    : ' + locationKind + ', ' + record.location + ' (' + record.area + ', ' + country + ')' + '\n' +
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
          desc += '  Duration    : ' + record.duration + ' mn\n';
          desc += '  Flags       : ' + flags + '\n';
          desc += '  Other flags : ' + otherFlags + '\n';
          ref = record.ref ? primaryReferences[record.ref] : '';
          desc += '  Source      : ' + ref + '\n'
            + '                at index #' + record.refIndex;
          return desc;
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
        //const recordEnumerator = new DefaultRecordEnumerator();
        //const recordEnumerator = new MaxCountRecordEnumerator(40);
        const recordEnumerator = new ArrayRecordEnumerator([0]);
        while (recordEnumerator.hasNext()) {
          if ((position + recordSize) > fileSize) {
            recordSize = fileSize - position;
            logDebug('last recordSize=' + recordSize);
          }
          const record = readRecord();
          console.log(recordDesc(record));
          recordEnumerator.next();
        }
        console.log(`\nRead ${count} reports.`);
        fs.close(fd);
      });
    });
  });