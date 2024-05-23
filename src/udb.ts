import { Database, DatabaseFactory, Input, NuforcDatabase, UdbDatabase } from "./input"
import { Interactive } from "./Interactive"
import { Logger } from "./Logger"
import { Memory, OutputFactory } from "./output"
import { Format, Query } from "./Query"
import program from "commander"

const DB_DEFAULT = "udb"

program
  .version("1.0.2")
  .option("-db, --database <udb|nuforc> [source]",
    `Database to read (defaults to ${DB_DEFAULT}).\nOptional source, depending on database, can default to ${UdbDatabase.DATA_FILE_DEFAULT} or ${NuforcDatabase.URL_DEFAULT})`)
  .option("-s, --sources [sourcesFile]", "Sources file to read. Defaults to ../data/udb/input/usources.txt")
  .option("-wm, --worldmap [wmFile]", "World map file to read. Defaults to ../data/udb/input/data/WM.VCE")
  .option("-c, --count <maxCount>", "Maximum number of records to output.")
  .option("-m, --match <field=value>[&field=value...][|field=value...]", "Output records that match the criteria.")
  .option("-f, --format <default|csv|xml>[?params]", "Format of the output. default params are latLng=dms|dd, csv" +
    " params are separator")
  .option("-o, --out <outputFile|memory>", "Name of the file to output. \"memory\" will enter interactive mode.")
  .option("-v, --verbose", "Displays detailed processing information.")
  .option("--debug", "Displays debug info.")
  .parse(process.argv)

let db: Database

const logger = new Logger(program.debug, program.verbose, "udb: ")
logger.onLog(msg => {
  process.stdout.write(msg)
})
logger.onError(msg => {
  process.stderr.write(msg)
})

const count = parseInt(program.count, 10)
const matchCriteria = program.match

db = DatabaseFactory.create(program.database || DB_DEFAULT, logger, program)

const format = Format[program.format] || Format.default
OutputFactory.create(program.out).then(output => {
  db.init()
    .then((input: Input) => {
      const firstIndex = 1
      logger.logVerbose(`\nReading cases from #${firstIndex}:`)
      let lastIndex = 10000000
      let maxCount = count || (lastIndex - firstIndex + 1)

      new Query(input, output, logger, db.recordFormatter(), format)
        .execute(matchCriteria, firstIndex, maxCount, true)
        .then(() => input.close())
        .catch(() => input.close())

      if (output instanceof Memory) {
        new Interactive(output, logger).start()
      }
    })
    .catch(err => {
      logger.error(err.toString())
    })
})
