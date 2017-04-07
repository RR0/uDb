import {FileInput} from "./input/FileInput";
import {Sources} from "./input/Sources";
import {WorldMap} from "./input/WorldMap";
import {Interactive} from "./Interactive";

import {Logger} from "./log";
import {Memory} from "./output/Memory";
import {OutputFactory} from "./output/OutputFactory";
import {Output} from "./output/RecordOutput";
import {Query} from "./Query";
import WritableStream = NodeJS.WritableStream;
import {RecordFormatter} from "./output/format";

const program = require('commander');

function range(val) {
  return val.split('..').map(Number);
}
program
  .version('0.0.2')
  .option('-d, --data [dataFile]', 'Data file to read. Defaults to ./input/data/U.RND')
  .option('-s, --sources [sourcesFile]', 'Sources file to read. Defaults to ./input/data/usources.txt')
  .option('-wm, --worldmap [wmFile]', 'World map file to read. Defaults to ./input/data/WM.VCE')
  .option('-c, --count <maxCount>', 'Maximum number of records to output.')
  .option('-m, --match <criterion>[&otherCriterion...]', 'Output records that match the criteria.')
  .option('-f, --format <default|csv|xml> [csvSeparator]', 'Format of the output')
  .option('-o, --out <outputFile|memory>', 'Name of the file to output. "memory" will enter interactive mode.')
  .option('-v, --verbose', 'Displays detailed processing information.')
  .option('--debug', 'Displays debug info.')
  .parse(process.argv);

const logger = new Logger(program.debug, program.verbose);
const sourcesFile = program.dataFile || 'input/data/usources.txt';
const dataFile = program.sourcesFile || 'input/data/U.RND';
const worldMap = program.wmFile || 'input/data/WM.VCE';
const format = program.format || 'default';

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

  const input: FileInput = new FileInput(dataFile, logger);
  input.open(() => {
    const firstIndex = 1;
    logger.logVerbose(`\nReading cases from #${firstIndex}:`);
    let lastIndex = 10000000;
    let maxCount = program.count || (lastIndex - firstIndex + 1);
    let matchCriteria = program.match;

    let output: Output = OutputFactory.getOutput(program.out);
    new Query(input, output, logger, new RecordFormatter(), format.toLocaleLowerCase(), sources)
      .execute(matchCriteria, firstIndex, maxCount);

    input.close();

    if (output instanceof Memory) {
      new Interactive(output, sources, logger).start();
    }
  });
});