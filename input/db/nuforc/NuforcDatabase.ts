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
    return this.input.readPage(this.baseUrl + '/ndxevent.html')
      .then(content => {
        const monthsLinks = this.input.getLinks(content, reportLink => reportLink.startsWith('ndxe'));
        this.logger.log(`Found ${monthsLinks.length} months indexes`);
        const monthsToScan = [monthsLinks[400], monthsLinks[401]];
        return this.input.readEachLink(monthsToScan)
          .then((monthSummaries: WebRecord[]) => {
            return monthSummaries.reduce((promise, monthSummary) => {
              return promise
                .then(input => {
                  let reportLinks = this.input.getLinks(monthSummary.contents, foundLink => !foundLink.startsWith('http://'));
                  let monthLabel = monthSummary.source;
                  let tok = '/ndxe';
                  let pos = monthLabel.indexOf(tok);
                  let date = monthLabel.substring(pos + tok.length);
                  let year = date.substring(0, 4);
                  let month = date.substring(4, 6);
                  this.logger.log(`Found ${reportLinks.length} reports for ${year}-${month}`);
                  return this.input.readEachLink(reportLinks)
                    .then((reports: WebRecord[]) => {
                      reports.forEach((report: WebRecord) => {
                        this.input.sources.push(report.source);
                        this.input.pages.push(report.contents);
                      });
                    });
                })
                .then(oneContent => {
                  return this.input;
                });
            }, Promise.resolve(this.input));
          });
      });
  }

  recordFormatter(): RecordFormatter {
    return new NuforcRecordFormatter();
  }

  recordReader(buffer, source?: string): RecordReader {
    return new NuforcRecordReader(buffer, this._logger, source);
  }
}