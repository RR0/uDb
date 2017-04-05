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
import {WorldMap} from "./input/WorldMap";
import WritableStream = NodeJS.WritableStream;
import {Sources} from "./input/Sources";
import {Interactive} from "./Interactive";

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

let output: Output;

function getOutput(sortedRecord: OutputRecord) {
  output = OutputFactory.getOutput(program.out);
  return OutputFormatFactory.getOutputFormat(format.toLocaleLowerCase(), output, sortedRecord, sources.primaryReferences);
}

const wm = new WorldMap(logger).open(worldMap, count => logger.logVerbose(`Read ${count} WM records.\n`));

let readline = require('readline');

let sources = new Sources(logger);
sources.open(sourcesFile, () => {
    logger.logVerbose('Reading sources:');
    logger.logVerbose(`- ${Object.keys(sources.primaryReferences).length} primary references`);
    logger.logVerbose(`- ${Object.keys(sources.newspapersAndFootnotes).length} newspapers and footnotes`);
    logger.logVerbose(`- ${Object.keys(sources.otherDatabasesAndWebsites).length} newspapers and footnotes`);
    logger.logVerbose(`- ${Object.keys(sources.otherPeriodicals).length} other periodicals`);
    logger.logVerbose(`- ${Object.keys(sources.misc).length} misc. books, reports, files & correspondance`);
    logger.logVerbose(`- ${sources.discredited.length} discredited reports`);

    const firstIndex = 1;
    let recordIndex = firstIndex;

    const input: FileInput = new FileInput(dataFile, logger);
    input.open(() => {
      logger.logVerbose(`\nReading cases from #${recordIndex}:`);
      let count = 0;

      let lastIndex = 10000000;
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
        new Interactive(logger).start();
      }
    });
  });