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

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(sourcesFile)
});

function addDiscredited(line) {
  discredited.push(line.substring(2));
}
function addSource(arr, line) {
  const ref = line.substring(1, 4);
  arr[ref] = line.substring(5);
}
lineReader
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
    locationKinds[2] = 'Town & City';
    locationKinds[3] = 'Farmlands';
    locationKinds[4] = 'Pasture';
    locationKinds[8] = 'Mountains';
    locationKinds[18] = 'Military base';
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

        function read(l) {
          let max = recordPos + l;
          for (; recordPos < max; ++recordPos) {
            recordHex += 'rr ';
          }
        }

        function skip(l) {
          let max = recordPos + l;
          for (; recordPos < max; ++recordPos) {
            let value = buffer[recordPos];
            recordHex += value < 0x10 ? '0' : '';
            recordHex += value.toString(16) + ' ';
          }
        }

        function readString(length) {
          let str = buffer.toString('utf8', recordPos, recordPos + length);
          // logDebug('at ' + (position + recordPos) + ' read \'' + str + '\'');
          read(length);
          const zeroEnd = str.indexOf('\u0000');
          if (zeroEnd > 0) {
            str = str.substring(0, zeroEnd);
          }
          return str;
        }

        function readByte() {
          const byte = buffer[recordPos];
          //logDebug('at ' + (position + recordPos) + ' read ' + byte);
          read(1);
          return byte;
        }

        function readSignedInt() {
          const byteA = buffer[recordPos + 1];
          const byteB = buffer[recordPos];
          const sign = byteA & (1 << 7);
          let uInt = (((byteA & 0xFF) << 8) | (byteB & 0xFF));
          if (sign) {
            uInt = 0xFFFF0000 | uInt;  // fill in most significant bits with 1's
          }
          //  logDebug('at ' + (position + recordPos) + ' read ' + uInt);
          read(2);
          return uInt;
        }

        function readLatLong() {
          const degrees = 31;
          const semiCircles = degrees * ( 2 << 31 / 180 );
        }

        function bufferToRecord() {
          const record = {};
          recordPos = 0;
          recordHex = '';

          record.year = readSignedInt();
          record.locationKind = readByte();
          record.month = readByte();
          record.day = readByte();
          record.hour = readByte();
          record.flags = readByte();
          record.duration = readByte();
          skip(10);
          record.countryCode = readByte();
          record.area = readString(3);
          skip(9);
          const description = readString(78);
          const split = description.split(':');
          record.location = split[0];
          record.title = split[1];
          record.description = split[2];
          record.description2 = split[3];
          record.description3 = split[4];

          let ref = readByte();
          if (ref) {
            if (ref < 100) ref = '0' + ref;
            if (ref < 10) ref = '0' + ref;
            ref = primaryReferences[ref];
          } else {
            ref = '';
          }
          record.ref = ref;
          record.refIndex = readByte();

          logDebug('buffer=' + recordHex);
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
          let desc = '\nRecord #' + (count + 1) + '\n- Title       : ' + record.title + '\n' +
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
          desc += '  Duration    : ' + record.duration + ' mn\n';
          desc += '  Flags       : ' + flags + '\n';
          desc += '  Source      : ' + record.ref + '\n'
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

        const recordEnumerator = new MaxCountRecordEnumerator(14);
        //const recordEnumerator = new ArrayRecordEnumerator([89, 175, 958]);
        while (position < fileSize && recordEnumerator.hasNext()) {
          if ((position + recordSize) > fileSize) {
            recordSize = fileSize - position;
            logDebug('last recordSize=' + recordSize);
          }
          const record = readRecord();
          console.log(recordDesc(record));
          recordEnumerator.next();
        }
        console.log('\nRead ' + count + ' reports.');
        fs.close(fd);
      });
    });
  });