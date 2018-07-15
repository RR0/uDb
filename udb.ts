const program = require('commander');

import {Interactive} from "./Interactive";
import {Logger} from "./Logger";
import {Memory} from "./output/Memory";
import {OutputFactory} from "./output/OutputFactory";
import {Output} from "./output/RecordOutput";
import {Query} from "./Query";
import {UdbDatabase} from "./input/db/udb/UdbDatabase";
import {Database} from "./input/db/Database";

program
  .version('1.0.1')
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

const count = program.count;
const matchCriteria = program.match;

const db: Database = new UdbDatabase('uDB', logger, program);

const format = program.format || 'default';
let output: Output = OutputFactory.getOutput(program.out);

db.init().then(input => {
  const firstIndex = 1;
  logger.logVerbose(`\nReading cases from #${firstIndex}:`);
  let lastIndex = 10000000;
  let maxCount = count || (lastIndex - firstIndex + 1);

  new Query(input, output, logger, db.recordFormatter(), format.toLocaleLowerCase())
    .execute(matchCriteria, firstIndex, maxCount, false);

  input.close();

  if (output instanceof Memory) {
    new Interactive(output, logger).start();
  }
});
