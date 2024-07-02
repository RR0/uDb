#!/usr/bin/env tsx

import { program } from "commander"
import { Database, Format, Input, Logger, Memory, OutputFactory, Query } from "../dist"
import { Interactive } from "../dist/Interactive"
import { version } from "../package.json"
import { DatabaseFactory } from "../dist/input/db/DatabaseFactory"

program
  .version(version)
  .option("-db, --database <udb|nuforc> [source]",
    `Database to read (defaults to udb).\nOptional source, depending on database, can default to ${DatabaseFactory.UDB_DATA_FILE_DEFAULT} or ${DatabaseFactory.NUFORC_URL_DEFAULT})`)
  .option("-s, --sources [sourcesFile]", "Sources file to read. Defaults to ../data/udb/input/usources.txt")
  .option("-wm, --worldmap [wmFile]", "World map file to read. Defaults to ../data/udb/input/data/WM.VCE")
  .option("-c, --count <maxCount>", "Maximum number of records to output.")
  .option("-m, --match <field=value>[&field=value...][|field=value...]", "Output records that match the criteria.")
  .option("-f, --format <default|csv|xml>[?params]", "Format of the output. default params are latLng=dms|dd, csv" +
    " params are separator")
  .option("-o, --out <outputFile|memory>", "Name of the file to output. \"memory\" will enter interactive mode.")
  .option("-v, --verbose", "Displays detailed processing information.")
  .option("--debug", "Displays debug info.")
  .parse()

const opts = program.opts()

const logger = new Logger(opts.debug, opts.verbose, "udb: ")
logger.onLog(msg => {
  process.stdout.write(msg)
})
logger.onError(msg => {
  process.stderr.write(msg)
})

const count = parseInt(opts.count, 10)
const matchCriteria = opts.match

const dbType = opts.database || "udb"
const db: Database = DatabaseFactory.create(dbType, logger, program)

const format = Format[opts.format] || Format.default
OutputFactory.create(opts.out).then(async (output) => {
  try {
    const input: Input = await db.init()
    const firstIndex = 1
    logger.logVerbose(`\nReading cases from #${firstIndex}:`)
    let lastIndex = 10000000
    let maxCount = count || (lastIndex - firstIndex + 1)
    try {
      await new Query(input, output, logger, db.recordFormatter(), format)
        .execute(matchCriteria, firstIndex, maxCount, true)
    } finally {
      input.close()
    }
    if (output instanceof Memory) {
      new Interactive(output, logger).start()
    }
  } catch (err) {
    logger.error(err.toString())
  }
})
