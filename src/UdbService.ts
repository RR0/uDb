import { ReadInterface, Sources } from "./input"
import { Logger } from "./Logger"
import { Memory } from "./output"
import { UdbRecordFormatter } from "./output/db/udb/UdbRecordFormatter"
import { Format, Query } from "./Query"
import { WebFileInput } from "./WebFileInput"

export class WebReadLine implements ReadInterface {

  lineCb: Function
  closeCb: Function
  private data: string
  private pos: number

  createInterface(param): ReadInterface {
    param.input.then((text) => {
      this.data = text
      this.read()
    })
    return this
  }

  on(eventName, cb) {
    switch (eventName) {
      case "line":
        this.lineCb = cb
        break
      case "close":
        this.closeCb = cb
        break
      default:
    }
    return this
  }

  private read() {
    this.pos = 0
    let end: boolean
    do {
      let index = this.data.indexOf("\n", this.pos + 1)
      end = index < 0
      if (end) {
        index = this.data.length
      }
      const line = this.data.substring(this.pos, index)
      this.lineCb(line)
      this.pos = index + 1
    } while (!end)
    this.closeCb()
  }
}

export class UdbService {

  private readonly sources = new Sources()
  private readonly memory = new Memory()
  private format = Format.memory
  private firstIndex: number = 1
  private maxCount: number = 1000000

  private recordFormatter = new UdbRecordFormatter(this.sources)

  constructor(private logger: Logger, private webFileInput: WebFileInput, private webReadLine: WebReadLine) {
  }

  async load(sourcesFilename: string, dataFilename: string) {
    await this.loadSources(sourcesFilename)
    await this.loadData(dataFilename)
  }

  async match(matchCriteria): Promise<Memory> {
    const results = new Memory()
    await new Query(this.memory, results, this.logger, null, this.format)
      .execute(matchCriteria, this.firstIndex, this.maxCount, false, false)
    return results
  }

  protected async loadSources(sourcesFilename: string) {
    this.logger.logVerbose(`\nReading sources from #${sourcesFilename}:`)
    try {
      const response = await fetch(sourcesFilename)
      if (response.ok) {
        const input = response.text()
        const sourcesReader = await this.webReadLine.createInterface({input})
        await this.sources.open(sourcesReader)
        this.logger.logVerbose("Reading sources:")
        this.logger.logVerbose(`- ${Object.keys(this.sources.primaryReferences).length} primary references`)
        this.logger.logVerbose(`- ${Object.keys(this.sources.newspapersAndFootnotes).length} newspapers and footnotes`)
        this.logger.logVerbose(
          `- ${Object.keys(this.sources.otherDatabasesAndWebsites).length} newspapers and footnotes`)
        this.logger.logVerbose(`- ${Object.keys(this.sources.otherPeriodicals).length} other periodicals`)
        this.logger.logVerbose(
          `- ${Object.keys(this.sources.misc).length} misc. books, reports, files & correspondance`)
        this.logger.logVerbose(`- ${this.sources.discredited.length} discredited reports`)
      }
    } catch (e) {
      throw Error(`Cannot load sources "${sourcesFilename}": ${e.message}`)
    }
  }

  private async loadData(dataFilename: string) {
    const firstIndex = 1
    this.logger.logVerbose(`\nReading cases from #${firstIndex}:`)
    await this.webFileInput.open(dataFilename)
    await new Query(this.webFileInput, this.memory, this.logger, this.recordFormatter, Format.memory)
      .execute(undefined, firstIndex, this.maxCount)
  }
}
