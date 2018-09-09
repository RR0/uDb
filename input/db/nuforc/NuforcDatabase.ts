import {Input} from "../../Input";

import {Logger} from "../../../Logger";
import {NuforcRecordFormatter} from "../../../output/db/nuforc/NuforcRecordFormatter";
import {RecordFormatter} from "../../../output/db/RecordFormatter";
import {Database} from "../Database";
import {RecordReader} from "../RecordReader";
import {NuforcRecordReader} from "./NuforcRecordReader";
import {WebInput, WebRecord} from "../../WebInput";

export class NuforcDatabase implements Database {
  static URL_DEFAULT = 'http://www.nuforc.org/webreports';

  private baseUrl: string;
  private input: WebInput;

  constructor(name: string, private _logger: Logger, program: any) {
    this.baseUrl = program.source || NuforcDatabase.URL_DEFAULT;
    _logger.autoFlush = true;
    this.input = new WebInput(this, this.baseUrl, program.count);
  }

  get logger(): Logger {
    return this._logger;
  }

  init(): Promise<Input> {
    return this.input.readPage('ndxevent.html')
      .then(webRecord => {
        const monthsLinks = this.input.getLinks(webRecord, foundLink => foundLink.startsWith('ndxe'));
        const monthsToScan = monthsLinks.slice(0, 2);
        this.logger.log(`Processing ${monthsToScan.length} months indexes`);
        monthsToScan.forEach(monthToScanUrl => {
          this.input.enqueueReadPage(monthToScanUrl).done
            .then(monthSummary => {
              let reportLinks = this.input.getLinks(monthSummary, foundLink => !foundLink.startsWith('http://'));
              reportLinks = reportLinks.slice(0, 10);
              const monthLabel = this.urlToLabel(monthSummary.source);
              this.logger.log(`Found ${reportLinks.length} reports for ${monthLabel}`);
              reportLinks.forEach(link => this.input.enqueueReadPage(link).done
                .then(report => {
                  this.input.addData(report);
                }));
            });
        });
        return this.input.run()
          .then(pages => {
            return this.input;
          });
      });
  }

  recordReader(buffer: WebRecord): RecordReader {
    return new NuforcRecordReader(buffer, this._logger);
  }

  recordFormatter(): RecordFormatter {
    return new NuforcRecordFormatter();
  }

  private urlToLabel(monthLabel) {
    let tok = '/ndxe';
    let date = monthLabel.substring(monthLabel.indexOf(tok) + tok.length);
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    return year + '-' + month;
  }
}