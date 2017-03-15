var fs = require('fs');

var sourcesFile = process.argv[2] || 'usources.txt';
var dataFile = process.argv[4] || 'U.RND';

var primaryReferences = {};
var newspapersAndFootnotes = {};
var otherDatabasesAndWebsites = {};
var otherPeriodicals = {};
var misc = {};
var discredited = [];

var debug = true;

function logDebug(msg) {
  if (debug) console.log('logDebug: ' + msg);
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

    fs.open(dataFile, 'r', function (status, fd) {
      console.log('\nReading cases:');
      if (status) {
        console.log(status.message);
        return;
      }
      var recordSize = 112;
      var recordNumber = 92;
      var position = recordNumber * recordSize;

      fs.fstat(fd, function (err, stats) {
        var fileSize = stats.size;

        var buffer = new Buffer(recordSize);
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
          var int = (((byteA & 0xFF) << 8) | (byteB & 0xFF));
          if (sign) {
            int = 0xFFFF0000 | int;  // fill in most significant bits with 1's
          }
          logDebug('at ' + (position + recordPos) + ' read ' + int);
          recordPos += 2;
          return int;
        }

        function readLatLong() {
          const degrees = 31;
          const semiCircles = degrees * ( 2 << 31 / 180 );
        }

        while (position < fileSize && count < 10) {
          if ((position + recordSize) > fileSize) {
            recordSize = fileSize - position;
          }
          fs.readSync(fd, buffer, 0, recordSize, position);
          recordPos = 0;

          var year = readSignedInt();
          recordPos += 1;
          var month = readByte();
          var day = readByte();

          recordPos += 2;
          var duration = readByte();

          recordPos += 10;
          var countryCode = readByte();
          var country = countries[countryCode] ? countries[countryCode] : 'country#' + countryCode;
          var area = readString(3);

          recordPos += 9;
          var description = readString(78);
          var split = description.split(':');
          var location = split[0] + ' (' + area + ', ' + country + ')';
          var title = split[1];
          description = split[2];
          var description2 = split[3];
          var description3 = split[4];

          var ref = readByte();
          if (ref) {
            if (ref < 100) ref = '0' + ref;
            if (ref < 10) ref = '0' + ref;
            ref = primaryReferences[ref];
          } else {
            ref = '';
          }
          var refIndex = readByte();

          var recordDesc = '\n- Title       : ' + title + '\n' +
            '  Date        : ' + year + '/' + month + '/' + (day > 31 ? '--' : day) + '\n' +
            '  Location    : ' + location + '\n' +
            '  Description : ' + (description ? description : '') + '\n';
          if (description2) {
            recordDesc += '                ' + description2 + '\n';
          }
          if (description3) {
            recordDesc += '                ' + description3 + '\n';
          }
          recordDesc += '  Duration    : ' + duration + ' mn\n';
          recordDesc += '  Source      : ' + ref + '\n' + +'                at index #' + refIndex;
          console.log(recordDesc);
          count++;
          position += recordSize;
        }
        console.log('\nRead ' + count + ' reports.');
        fs.close(fd);
      });
    });
  });