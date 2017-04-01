const fs = require('fs');
const program = require('commander');

const log = require('./log');
const util = require('./util');
const flags = require('./flags');
const geo = require('./geo');
const time = require('./time');
const record = require('./record');
const formatModule = require('./output/format');
const defaultOutput = require('./output/default');
const csv = require('./output/csv');
const xml = require('./output/xml');

function range(val) {
  return val.split('..').map(Number);
}
program
  .version('0.0.1')
  .option('-d, --data [dataFile]', 'Data file to read. Defaults to ./U.RND')
  .option('-s, --sources [sourcesFile]', 'Sources file to read. Defaults to ./usources.txt')
  .option('-wm, --worldmap [wmFile]', 'World map file to read. Defaults to ./WM.VCE')
  .option('-r, --range <fromIndex>..<toIndex>', 'Record range to output. Defaults to 1..end', range)
  .option('-i, --records <recordsIndexes>', 'List of indexes of records to output.')
  .option('-c, --count <maxCount>', 'Maximum number of records to output.')
  .option('-f, --format <default|csv|xml> [csvSeparator]', 'Format of the output')
  .option('-o, --out <outputFile>', 'Name of the file to output. Will output as CSV if file extension is .csv')
  .option('-v, --verbose', 'Displays detailed processing information.')
  .option('--debug', 'Displays debug info.')
  .parse(process.argv);

const logger = new log.Logger(program.debug, program.verbose);
const sourcesFile = program.dataFile || 'input/usources.txt';
const dataFile = program.sourcesFile || 'input/U.RND';
const worldMap = program.wmFile || 'input/WM.VCE';
const format = program.format || 'default';

const primaryReferences = {};
const newspapersAndFootnotes = {};
const otherDatabasesAndWebsites = {};
const otherPeriodicals = {};
const misc = {};
const discredited = [];


fs.open(worldMap, 'r', function (status, fd) {
  logger.logVerbose('Reading world map:');
  if (status) {
    logger.error(status.message);
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
    logger.logVerbose(`Read ${count} WM records.\n`)
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
    logger.logVerbose('Reading sources:');
    logger.logVerbose('- ' + Object.keys(primaryReferences).length + ' primary references');
    logger.logVerbose('- ' + Object.keys(newspapersAndFootnotes).length + ' newspapers and footnotes');
    logger.logVerbose('- ' + Object.keys(otherDatabasesAndWebsites).length + ' newspapers and footnotes');
    logger.logVerbose('- ' + Object.keys(otherPeriodicals).length + ' other periodicals');
    logger.logVerbose('- ' + Object.keys(misc).length + ' misc. books, reports, files & correspondance');
    logger.logVerbose('- ' + discredited.length + ' discredited reports');

    let recordSize = 112;
    const buffer = new Buffer(recordSize);

    fs.open(dataFile, 'r', function (status, fd) {
      const firstsIndex = (program.range && program.range[0]) || 1;
      let recordIndex = firstsIndex;
      logger.logVerbose(`\nReading cases from #${recordIndex}:`);
      if (status) {
        logger.error(status.message);
        return;
      }
      let position = recordIndex * recordSize;

      fs.fstat(fd, function (err, stats) {
        const fileSize = stats.size;
        // logDebug('File size=' + fileSize);

        function readRecord() {
          fs.readSync(fd, buffer, 0, recordSize, position);
          const recordReader = new record.RecordReader(buffer, logger, position);
          return recordReader.read();
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

        function getOutput(sortedRecord) {
          let output = process.stdout;
          if (program.out) {
            output = fs.createWriteStream(program.out, {flags: 'w'});
          }

          let outputFormat;
          let csvSeparator = ',';
          switch (format.toLocaleLowerCase()) {
            case 'csv':
              outputFormat = new csv.CsvRecordOutput(csvSeparator, output, sortedRecord);
              break;
            case 'xml':
              outputFormat = new xml.XmlRecordOutput(output, sortedRecord);
              break;
            default:
              outputFormat = new defaultOutput.DefaultRecordOutput(output, position, recordSize, primaryReferences);
          }
          return outputFormat;
        }

        let lastIndex = (program.range && program.range[1]) || 10000000;
        let maxCount = program.count || (lastIndex - firstsIndex + 1);
        const recordEnumerator = new DefaultRecordEnumerator(maxCount);
        //const recordEnumerator = new MaxCountRecordEnumerator(500);
        //const recordEnumerator = new ArrayRecordEnumerator([18121]);

        let recordFormatter;
        let outputFormat;

        while (recordEnumerator.hasNext()) {
          if ((position + recordSize) > fileSize) {
            recordSize = fileSize - position;
            fs.readSync(fd, buffer, 0, recordSize, position);
            logger.logDebug('last record=' + buffer.toString());
            position += recordSize;
          } else {
            const rawRecord = readRecord();
            if (!recordFormatter) {
              recordFormatter = new formatModule.RecordFormatter(rawRecord);
              let sortedRecord = recordFormatter.formatProperties(util.copy(rawRecord));
              outputFormat = getOutput(sortedRecord);
            }
            const formattedRecord = recordFormatter.formatData(rawRecord);
            outputFormat.write(formattedRecord);
            recordEnumerator.next();
            count++;
          }
        }
        outputFormat.end();
        logger.logVerbose(`\nRead ${count} reports.`);
        fs.close(fd);
      });
    });
  });