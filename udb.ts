import * as fs from "fs";
import {FileInput} from "./input/FileInput";
import {RecordEnumerator} from "./input/Input";
import {InputRecord} from "./input/InputRecord";

import {Logger} from "./log";
import {RecordMatcher} from "./match";
import {RecordFormatter} from "./output/format";
import {MemoryOutput} from "./output/MemoryOutput";
import {OutputFactory} from "./output/OutputFactory";
import {OutputFormatFactory} from "./output/OutputFormatFactory";
import {OutputRecord} from "./output/OutputRecord";
import {Output, RecordOutput} from "./output/RecordOutput";
import {Util} from "./util";
import {WorldMap} from "./WorldMap";
import WritableStream = NodeJS.WritableStream;

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
  .option('-c, --count <maxCount>', 'Maximum number of records to output.')
  .option('-m, --match <criterion>[&otherCriterion...]', 'Output records that match the criteria.')
  .option('-i, --interactive', 'Enter interactive mode.')
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

let output: Output;

function getOutput(sortedRecord: OutputRecord) {
  output = OutputFactory.getOutput(program.out);
  return OutputFormatFactory.getOutputFormat(format.toLocaleLowerCase(), output, sortedRecord, primaryReferences);
}

function interactive() {
  const rl = readline.createInterface({input: process.stdin, output: process.stdout});
  rl.setPrompt('udb> ');
  rl.prompt();

  rl.on('line', (line) => {
    switch (line.trim()) {
      case 'exit':
        rl.close();
        process.stdin.destroy();
        return;
      default:
        console.log(`Say what? I might have heard \`${line.trim()}\``);
        break;
    }
    rl.prompt();
  }).on('close', function () {
    logger.logVerbose('Exiting');
    process.exit(0);
  });
}

const wm = new WorldMap(logger).open(worldMap, count => logger.logVerbose(`Read ${count} WM records.\n`));

let readline = require('readline');

const sourcesReader = readline.createInterface({
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
    logger.logVerbose(`- ${Object.keys(primaryReferences).length} primary references`);
    logger.logVerbose(`- ${Object.keys(newspapersAndFootnotes).length} newspapers and footnotes`);
    logger.logVerbose(`- ${Object.keys(otherDatabasesAndWebsites).length} newspapers and footnotes`);
    logger.logVerbose(`- ${Object.keys(otherPeriodicals).length} other periodicals`);
    logger.logVerbose(`- ${Object.keys(misc).length} misc. books, reports, files & correspondance`);
    logger.logVerbose(`- ${discredited.length} discredited reports`);

    const firstIndex = program.rangexe != undefined ? program.range[0] : 1;
    let recordIndex = firstIndex;

    const input: FileInput = new FileInput(dataFile, logger);
    input.open(() => {
      logger.logVerbose(`\nReading cases from #${recordIndex}:`);
      let count = 0;

      let lastIndex = (program.range && program.range[1]) || 10000000;
      let maxCount = program.count || (lastIndex - firstIndex + 1);
      const recordEnumerator: RecordEnumerator = new RecordEnumerator(input, recordIndex);

      let recordFormatter: RecordFormatter;
      let outputFormat: RecordOutput;
      const recordMatcher = new RecordMatcher(program.match);

      while (recordEnumerator.hasNext() && count < maxCount) {
        if (input.filePos + input.recordSize > input.fileSize) {
          input.recordSize = input.fileSize - input.filePos;
          fs.readSync(input.fd, input.buffer, 0, input.recordSize, input.filePos);
          logger.logDebug('last record=' + input.buffer.toString());
          logger.flush();
          input.filePos += input.recordSize;
        } else {
          const inputRecord: InputRecord = recordEnumerator.next();
          if (recordMatcher.matches(inputRecord)) {
            if (!recordFormatter) {
              recordFormatter = new RecordFormatter(inputRecord);
              let outputRecord: OutputRecord = recordFormatter.formatProperties(Util.copy(inputRecord));
              outputFormat = getOutput(outputRecord);
            }
            logger.flush();
            const outputRecord: OutputRecord = recordFormatter.formatData(inputRecord);
            outputFormat.write(outputRecord, input.filePos);
            count++;
          } else {
            logger.reset();
          }
        }
      }
      outputFormat.end();
      input.close();
      const processingDuration = Date.now() - processingStart;
      logger.autoFlush = true;
      logger.logVerbose(`\nProcessed ${count} reports in ${(processingDuration / 1000).toFixed(2)} seconds.`);

      if (output instanceof MemoryOutput) {
        interactive();
      }
    });

  });