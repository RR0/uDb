import * as fs from "fs";
import {InputRecord} from "./input/InputRecord";

import {Logger} from "./log";
import {CsvRecordOutput} from "./output/csv";
import {DefaultRecordOutput} from "./output/default";
import {RecordFormatter} from "./output/format";
import {RecordOutput} from "./output/output";
import {OutputRecord} from "./output/OutputRecord";
import {XmlRecordOutput} from "./output/xml";
import {RecordReader} from "./record";
import {Util} from "./util";
import WritableStream = NodeJS.WritableStream;
import {RecordMatcher} from "./match";

const program = require('commander');

const processingStart = Date.now();

function range(val) {
  return val.split('..').map(Number);
}
program
  .version('0.0.1')
  .option('-d, --data [dataFile]', 'Data file to read. Defaults to ./input/data/U.RND')
  .option('-s, --sources [sourcesFile]', 'Sources file to read. Defaults to ./input/data/usources.txt')
  .option('-wm, --worldmap [wmFile]', 'World map file to read. Defaults to ./input/data/WM.VCE')
  .option('-r, --range <fromIndex>..<toIndex>', 'Record range to output. Defaults to 1..end', range)
  .option('-i, --records <recordsIndexes>', 'List of indexes of records to output.')
  .option('-c, --count <maxCount>', 'Maximum number of records to output.')
  .option('-m, --match <criterion>[&otherCriterion...]', 'Output records that match the criteria.')
  .option('-f, --format <default|csv|xml> [csvSeparator]', 'Format of the output')
  .option('-o, --out <outputFile>', 'Name of the file to output. Will output as CSV if file extension is .csv')
  .option('-v, --verbose', 'Displays detailed processing information.')
  .option('--debug', 'Displays debug info.')
  .parse(process.argv);

const logger = new Logger(program.debug, program.verbose);
const sourcesFile = program.dataFile || 'input/data/usources.txt';
const dataFile = program.sourcesFile || 'input/data/U.RND';
const worldMap = program.wmFile || 'input/data/WM.VCE';
const format = program.format || 'default';

const primaryReferences = {};
const newspapersAndFootnotes = {};
const otherDatabasesAndWebsites = {};
const otherPeriodicals = {};
const misc = {};
const discredited = [];

fs.open(worldMap, 'r', function (err: NodeJS.ErrnoException, fd: number) {
  logger.logVerbose('Reading world map:');
  if (err) {
    logger.error(`Could not read world map: ${err.errno}`);
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
        logger.logDebug('last recordSize=' + recordSize);
      }
      fs.readSync(fd, buffer, 0, recordSize, position);
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
        addSource(otherPeriodicals, line);
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

    fs.open(dataFile, 'r', function (err: NodeJS.ErrnoException, fd: number) {
      const firstsIndex = (program.range && program.range[0]) || 1;
      let recordIndex = firstsIndex;
      logger.logVerbose(`\nReading cases from #${recordIndex}:`);
      if (err) {
        return;
      }
      let position = recordIndex * recordSize;
      const recordReader = new RecordReader(buffer, logger);

      fs.fstat(fd, function (err, stats) {
        const fileSize = stats.size;
        // logDebug('File size=' + fileSize);

        function readRecord(): InputRecord {
          fs.readSync(fd, buffer, 0, recordSize, position);
          return recordReader.read(position);
        }

        let count = 0;

        class ArrayRecordEnumerator {
          recordsIndexes: any;

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
          maxCount: any;

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

        function getOutput(sortedRecord: OutputRecord) {
          let output: WritableStream = process.stdout;
          if (program.out) {
            output = fs.createWriteStream(program.out, {flags: 'w'});
          }

          let outputFormat: RecordOutput;
          switch (format.toLocaleLowerCase()) {
            case 'csv':
              outputFormat = new CsvRecordOutput(output, sortedRecord);
              break;
            case 'xml':
              outputFormat = new XmlRecordOutput(output, sortedRecord);
              break;
            default:
              outputFormat = new DefaultRecordOutput(output, recordSize, primaryReferences);
          }
          return outputFormat;
        }

        let lastIndex = (program.range && program.range[1]) || 10000000;
        let maxCount = program.count || (lastIndex - firstsIndex + 1);
        const recordEnumerator = new DefaultRecordEnumerator(maxCount);
        //const recordEnumerator = new ArrayRecordEnumerator([18121]);

        let recordFormatter: RecordFormatter;
        let outputFormat: RecordOutput;
        const recordMatcher = new RecordMatcher(program.match);

        while (recordEnumerator.hasNext()) {
          if ((position + recordSize) > fileSize) {
            recordSize = fileSize - position;
            fs.readSync(fd, buffer, 0, recordSize, position);
            logger.logDebug('last record=' + buffer.toString());
            position += recordSize;
          } else {
            const inputRecord: InputRecord = readRecord();
            if (recordMatcher.matches(inputRecord)) {
              if (!recordFormatter) {
                recordFormatter = new RecordFormatter(inputRecord);
                let outputRecord: OutputRecord = recordFormatter.formatProperties(Util.copy(inputRecord));
                outputFormat = getOutput(outputRecord);
              }
              const outputRecord: OutputRecord = recordFormatter.formatData(inputRecord);
              outputFormat.write(outputRecord, position);
              count++;
            }
            recordEnumerator.next();
          }
        }
        outputFormat.end();
        fs.close(fd);
        const processingDuration = Date.now() - processingStart;
        logger.logVerbose(`\nProcessed ${count} reports in ${(processingDuration/1000).toFixed(2)} seconds.`);
      });
    });
  });