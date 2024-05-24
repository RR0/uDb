import { FileInput } from "../../FileInput"
import { Logger } from "../../../Logger"
import { WorldMap } from "./WorldMap"
import * as fs from "fs"
import { Sources } from "./Sources"
import { UdbRecordFormatter } from "../../../output/db/udb/UdbRecordFormatter"
import { RecordFormatter } from "../../../output"
import { Database } from "../Database"
import { RecordReader } from "../RecordReader"
import { UdbRecordReader } from "./UdbRecordReader"
import readline from "readline"
import { FileUtil } from "../../../FileUtil"

export class UdbDatabase implements Database {
  static DATA_FILE_DEFAULT = "../data/udb/input/U.RND"

  private readonly sourcesFile: string
  private readonly dataFile: string
  private readonly worldMap: string
  private vm: WorldMap
  private sources: Sources

  constructor(name: string, private _logger: Logger, program: any) {
    this.sourcesFile = FileUtil.getPath(program.sourcesFile || "../data/udb/input/usources.txt")
    this.dataFile = FileUtil.getPath(program.source || UdbDatabase.DATA_FILE_DEFAULT)
    this.worldMap = FileUtil.getPath(program.wmFile || "../data/udb/input/WM.VCE")
  }

  get logger(): Logger {
    return this._logger
  }

  async init(): Promise<FileInput> {
    this.vm = new WorldMap(this._logger)
    const count = await this.vm.open(this.worldMap)
    this._logger.logVerbose(`Read ${count} WM records.\n`)

    this.sources = new Sources()
    this._logger.logVerbose("Reading sources:" + this.sourcesFile)
    const sourcesReader = readline.createInterface({
      input: fs.createReadStream(this.sourcesFile)
    })
    await this.sources.open(sourcesReader)
    this._logger.logVerbose(`- ${Object.keys(this.sources.primaryReferences).length} primary references`)
    this._logger.logVerbose(`- ${Object.keys(this.sources.newspapersAndFootnotes).length} newspapers and footnotes`)
    this._logger.logVerbose(`- ${Object.keys(this.sources.otherDatabasesAndWebsites).length} newspapers and footnotes`)
    this._logger.logVerbose(`- ${Object.keys(this.sources.otherPeriodicals).length} other periodicals`)
    this._logger.logVerbose(`- ${Object.keys(this.sources.misc).length} misc. books, reports, files & correspondance`)
    this._logger.logVerbose(`- ${this.sources.discredited.length} discredited reports`)

    const input: FileInput = new FileInput(this)

    await input.open(this.dataFile)
    return input
  }

  recordFormatter(): RecordFormatter {
    return new UdbRecordFormatter(this.sources)
  }

  recordReader(buffer: Buffer): RecordReader {
    return new UdbRecordReader(buffer, this._logger)
  }
}
