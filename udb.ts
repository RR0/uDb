import * as fs from "fs";
import WritableStream = NodeJS.WritableStream;

const program = require('commander');

import {FileInput} from "./input/FileInput";
import {Sources} from "./input/Sources";
import {WorldMap} from "./input/WorldMap";
import {Interactive} from "./Interactive";
import {Logger} from "./Logger";
import {Memory} from "./output/Memory";
import {OutputFactory} from "./output/OutputFactory";
import {Output} from "./output/RecordOutput";
import {Query} from "./Query";
import {RecordFormatter} from "./output/RecordFormatter";

program
  .version('0.0.2')
  .option('-d, --data [dataFile]', 'Data file to read. Defaults to ./input/data/U.RND')
  .option('-s, --sources [sourcesFile]', 'Sources file to read. Defaults to ./input/data/usources.txt')
  .option('-wm, --worldmap [wmFile]', 'World map file to read. Defaults to ./input/data/WM.VCE')
  .option('-c, --count <maxCount>', 'Maximum number of records to output.')
  .option('-m, --match <field=value>[&field=value...][|field=value...]', 'Output records that match the criteria.')
  .option('-f, --format <default|csv|xml> [csvSeparator]', 'Format of the output')
  .option('-o, --out <outputFile|memory>', 'Name of the file to output. "memory" will enter interactive mode.')
  .option('-v, --verbose', 'Displays detailed processing information.')
  .option('--debug', 'Displays debug info.')
  .parse(process.argv);

const logger = new Logger(program.debug, program.verbose);
logger.subscribe(msg => process.stdout.write('udb: ' + msg));
const sourcesFile = program.dataFile || 'input/data/usources.txt';
const dataFile = program.sourcesFile || 'input/data/U.RND';
const worldMap = program.wmFile || 'input/data/WM.VCE';
const format = program.format || 'default';

const wm = new WorldMap(logger).open(worldMap, count => logger.logVerbose(`Read ${count} WM records.\n`));

let readline = require('readline');

let sources = new Sources();
const sourcesReader = readline.createInterface({
  input: fs.createReadStream(sourcesFile)
});
sources.open(sourcesReader, () => {
  logger.logVerbose('Reading sources:');
  logger.logVerbose(`- ${Object.keys(sources.primaryReferences).length} primary references`);
  logger.logVerbose(`- ${Object.keys(sources.newspapersAndFootnotes).length} newspapers and footnotes`);
  logger.logVerbose(`- ${Object.keys(sources.otherDatabasesAndWebsites).length} newspapers and footnotes`);
  logger.logVerbose(`- ${Object.keys(sources.otherPeriodicals).length} other periodicals`);
  logger.logVerbose(`- ${Object.keys(sources.misc).length} misc. books, reports, files & correspondance`);
  logger.logVerbose(`- ${sources.discredited.length} discredited reports`);

  let output: Output = OutputFactory.getOutput(program.out);
  const input: FileInput = new FileInput(logger);
  let count = program.count;
  let matchCriteria = program.match;

  input.open(dataFile, () => {
    const firstIndex = 1;
    logger.logVerbose(`\nReading cases from #${firstIndex}:`);
    let lastIndex = 10000000;
    let maxCount = count || (lastIndex - firstIndex + 1);

    new Query(input, output, logger, new RecordFormatter(), format.toLocaleLowerCase(), sources)
      .execute(matchCriteria, firstIndex, maxCount, false);

    input.close();

    if (output instanceof Memory) {
      new Interactive(output, sources, logger).start();
    }
  });
});