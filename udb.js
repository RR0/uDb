var fs = require('fs');

var sourcesFile = process.argv[2] || 'usources.txt';
var dataFile = process.argv[4] || 'U.RND';

var primaryReferences = {};
var newspapersAndFootnotes = {};
var otherDatabasesAndWebsites = {};
var otherPeriodicals = {};
var misc = {};
var discredited = [];

var DEBUG = true;

function logDebug(msg) {
  if (DEBUG) console.log('DEBUG: ' + msg);
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(sourcesFile)
});

function addDiscredited(line) {
  discredited.push(line.substring(2));
}
function addSource(arr, line) {
  var ref = line.substring(1, 4);
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

    var countries = {};
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

    var recordSize = 112;
    var buffer = new Buffer(recordSize);

    fs.open(dataFile, 'r', function (status, fd) {
      console.log('\nReading cases:');
      if (status) {
        console.log(status.message);
        return;
      }
      var recordNumber = 1;
      var position = recordNumber * recordSize;

      fs.fstat(fd, function (err, stats) {
        var fileSize = stats.size;
        logDebug('File size=' + fileSize);

        var count = 0;
        var recordPos;

        function readString(length) {
          var str = buffer.toString('utf8', recordPos, recordPos + length);
          logDebug('at ' + (position + recordPos) + ' read \'' + str + '\'');
          recordPos += length;
          var zeroEnd = str.indexOf('\u0000');
          if (zeroEnd > 0) {
            str = str.substring(0, zeroEnd);
          }
          return str;
        }

        function readByte() {
          var byte = buffer[recordPos];
          logDebug('at ' + (position + recordPos) + ' read ' + byte);
          recordPos++;
          return byte;
        }

        function readSignedInt() {
          var byteA = buffer[recordPos + 1];
          var byteB = buffer[recordPos];
          var sign = byteA & (1 << 7);
          var uInt = (((byteA & 0xFF) << 8) | (byteB & 0xFF));
          if (sign) {
            uInt = 0xFFFF0000 | uInt;  // fill in most significant bits with 1's
          }
          logDebug('at ' + (position + recordPos) + ' read ' + uInt);
          recordPos += 2;
          return uInt;
        }

        function readLatLong() {
          const degrees = 31;
          const semiCircles = degrees * ( 2 << 31 / 180 );
        }

        function bufferToRecord() {
          recordPos = 0;

          var record = {};
          record.year = readSignedInt();
          recordPos += 1;
          record.month = readByte();
          record.day = readByte();

          recordPos += 2;
          record.duration = readByte();

          recordPos += 10;
          record.countryCode = readByte();
          record.area = readString(3);

          recordPos += 9;
          var description = readString(78);
          var split = description.split(':');
          record.location = split[0];
          record.title = split[1];
          record.description = split[2];
          record.description2 = split[3];
          record.description3 = split[4];

          var ref = readByte();
          if (ref) {
            if (ref < 100) ref = '0' + ref;
            if (ref < 10) ref = '0' + ref;
            ref = primaryReferences[ref];
          } else {
            ref = '';
          }
          record.ref = ref;
          record.refIndex = readByte();
          return record;
        }

        function readRecord() {
          fs.readSync(fd, buffer, 0, recordSize, position);
          var hexBuffer = buffer.toString('hex');
          var hexStr = '';
          var rows = 4;
          var rowLength = recordSize / rows;
          for (var i = 0; i < rows; i++) {
            var rowStr = hexBuffer.substring(i * rowLength, (i + 1) * rowLength);
            hexStr += '\n' + rowStr;
          }
          logDebug('buffer (' + rowLength + ' bytes per line)' + hexStr);
          return bufferToRecord(buffer);
        }

        function recordDesc(record) {
          var country = countries[record.countryCode] ? countries[record.countryCode] : 'country#' + record.countryCode;
          var desc = '\n- Title       : ' + record.title + '\n' +
            '  Date        : ' + record.year + '/' + record.month + '/' + (record.day > 31 ? '--' : record.day) + '\n' +
            '  Location    : ' + record.location + ' (' + record.area + ', ' + country + ')' + '\n' +
            '  Description : ' + (record.description ? record.description : '') + '\n';
          if (record.description2) {
            desc += '                ' + record.description2 + '\n';
          }
          if (record.description3) {
            desc += '                ' + record.description3 + '\n';
          }
          desc += '  Duration    : ' + record.duration + ' mn\n';
          desc += '  Source      : ' + record.ref + '\n'
            + '                at index #' + record.refIndex;
          return desc;
        }

        const MaxCountRecordEnumerator = function (maxCount) {
          return {
            hasNext: function () {
              return count < maxCount;
            },
            next: function () {
              count++;
              position += recordSize;
            }
          }
        };
        const ArrayRecordEnumerator = function (records) {
          position = records[count] * recordSize;
          return {
            hasNext: function () {
              return count < records.length;
            },
            next: function () {
              count++;
              position = records[count] * recordSize;
            }
          }
        };

        //const recordEnumerator = new MaxCountRecordEnumerator(10);
        const recordEnumerator = new ArrayRecordEnumerator([40, 80]);
        while (position < fileSize && recordEnumerator.hasNext()) {
          if ((position + recordSize) > fileSize) {
            recordSize = fileSize - position;
            logDebug('last recordSize=' + recordSize);
          }
          var record = readRecord();
          console.log(recordDesc(record));
          recordEnumerator.next();
        }
        console.log('\nRead ' + count + ' reports.');
        fs.close(fd);
      });
    });
  });