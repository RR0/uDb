import { Input } from "../../Input"

import { Logger } from "../../../Logger"
import { Database, DatabaseConfig } from "../Database"
import { RecordReader } from "../RecordReader"
import { NuforcRecordReader } from "./NuforcRecordReader"
import { WebInput, WebRecord } from "../../WebInput"
import { NuforcRecordFormatter, RecordFormatter } from "../../../output"

export interface NuforcDatabaseConfig extends DatabaseConfig {
  baseUrl: string
  count: number
}

export class NuforcDatabase implements Database {

  protected input: WebInput

  constructor(name: string, private _logger: Logger, config: NuforcDatabaseConfig) {
    _logger.autoFlush = true
    this.input = new WebInput(this, config.baseUrl, config.count)
  }

  get logger(): Logger {
    return this._logger
  }

  init(): Promise<Input> {
    return this.input.readPage("ndxevent.html")
      .then(webRecord => {
        const monthsLinks = this.input.getLinks(webRecord, foundLink => foundLink.startsWith("ndxe"))
        const monthsToScan = monthsLinks.slice(0, 2)
        this.logger.log(`Processing ${monthsToScan.length} months indexes`)
        monthsToScan.forEach(monthToScanUrl => {
          this.input.enqueueReadPage(monthToScanUrl).done
            .then(monthSummary => {
              let reportLinks = this.input.getLinks(monthSummary, foundLink => !foundLink.startsWith("http://"))
              reportLinks = reportLinks.slice(0, 10)
              const monthLabel = this.urlToLabel(monthSummary.source)
              this.logger.log(`Found ${reportLinks.length} reports for ${monthLabel}`)
              reportLinks.forEach(link => this.input.enqueueReadPage(link).done
                .then(report => {
                  this.logger.log(`read ${link}`)
                }))
            })
        })
        return this.input.run()
          .then(pages => {
            return this.input
          })
      })
  }

  recordReader(buffer: WebRecord): RecordReader {
    return new NuforcRecordReader(buffer, this._logger)
  }

  recordFormatter(): RecordFormatter {
    return new NuforcRecordFormatter()
  }

  private urlToLabel(monthLabel) {
    let tok = "/ndxe"
    let date = monthLabel.substring(monthLabel.indexOf(tok) + tok.length)
    let year = date.substring(0, 4)
    let month = date.substring(4, 6)
    return year + "-" + month
  }
}
