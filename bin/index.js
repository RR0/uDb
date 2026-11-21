#!/usr/bin/env node

import { program } from "commander"
import { readFileSync } from "node:fs"
import { Format, Logger, Memory, OutputFactory, Query } from "../dist/index.js"
import { Interactive } from "../dist/Interactive.js"
import { DatabaseFactory } from "../dist/input/db/DatabaseFactory.js"

const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))

program
  .version(version)
  .option("-d, --database <udb|nuforc>", "Database to read (defaults to udb).")
  .option("--source <file|url>",
    `Database source. Defaults to ${DatabaseFactory.UDB_DATA_FILE_DEFAULT} for udb, ${DatabaseFactory.NUFORC_URL_DEFAULT} for nuforc.`)
  .option("-s, --sources <sourcesFile>", `Sources file to read. Defaults to ${DatabaseFactory.UDB_SOURCES_FILE_DEFAULT}`)
  .option("-w, --worldmap <wmFile>", `World map file to read. Defaults to ${DatabaseFactory.UDB_WORLD_MAP_FILE_DEFAULT}`)
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
const db = DatabaseFactory.create(dbType, logger, opts)

const format = opts.format || Format.default
OutputFactory.create(opts.out).then(async (output) => {
  try {
    const input = await db.init()
    const firstIndex = 1
    logger.logVerbose(`\nReading cases from #${firstIndex}:`)
    const lastIndex = 10000000
    const maxCount = count || (lastIndex - firstIndex + 1)
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
