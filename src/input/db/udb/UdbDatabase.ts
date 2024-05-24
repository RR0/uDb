import { FileInput } from "../../FileInput"
import { Logger } from "../../../Logger"
import { WorldMap } from "./WorldMap"
import * as fs from "fs"
import { Sources } from "./Sources"
import { UdbRecordFormatter } from "../../../output/db/udb/UdbRecordFormatter"
import { RecordFormatter } from "../../../output"
import { Database, DatabaseConfig } from "../Database"
import { RecordReader } from "../RecordReader"
import { UdbRecordReader } from "./UdbRecordReader"
import readline from "readline"

export interface UdbDatabaseConfig extends DatabaseConfig {
  sourcesFile: string
  dataFile: string
  worldMap: string
}

export class UdbDatabase implements Database {

  protected vm: WorldMap
  protected sources: Sources

  constructor(name: string, protected _logger: Logger, protected config: UdbDatabaseConfig) {
  }

  get logger(): Logger {
    return this._logger
  }

  async init(): Promise<FileInput> {
    this.vm = new WorldMap(this._logger)
    const count = await this.vm.open(this.config.worldMap)
    this._logger.logVerbose(`Read ${count} WM records.\n`)

    this.sources = new Sources()
    this._logger.logVerbose("Reading sources:" + this.config.sourcesFile)
    const sourcesReader = readline.createInterface({
      input: fs.createReadStream(this.config.sourcesFile)
    })
    await this.sources.open(sourcesReader)
    this._logger.logVerbose(`- ${Object.keys(this.sources.primaryReferences).length} primary references`)
    this._logger.logVerbose(`- ${Object.keys(this.sources.newspapersAndFootnotes).length} newspapers and footnotes`)
    this._logger.logVerbose(`- ${Object.keys(this.sources.otherDatabasesAndWebsites).length} newspapers and footnotes`)
    this._logger.logVerbose(`- ${Object.keys(this.sources.otherPeriodicals).length} other periodicals`)
    this._logger.logVerbose(`- ${Object.keys(this.sources.misc).length} misc. books, reports, files & correspondance`)
    this._logger.logVerbose(`- ${this.sources.discredited.length} discredited reports`)

    const input: FileInput = new FileInput(this)

    await input.open(this.config.dataFile)
    return input
  }

  recordFormatter(): RecordFormatter {
    return new UdbRecordFormatter(this.sources)
  }

  recordReader(buffer: Buffer): RecordReader {
    return new UdbRecordReader(buffer, this._logger)
  }
}
