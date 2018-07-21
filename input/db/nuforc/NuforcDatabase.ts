import {Input} from "../../Input";

import {Logger} from "../../../Logger";
import {NuforcRecordFormatter} from "../../../output/db/nuforc/NuforcRecordFormatter";
import {RecordFormatter} from "../../../output/db/RecordFormatter";
import {Database} from "../Database";
import {RecordReader} from "../RecordReader";
import {NuforcRecordReader} from "./NuforcRecordReader";
import {WebInput} from "../../WebInput";

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
        const reportLinks = this.input.getLinks(content, reportLink => reportLink.startsWith('ndxe'));
        this.logger.log(`Found ${reportLinks.length} months indexes`);
        const toScan = reportLinks;
        return this.input.readEachLink(toScan)
          .then(reports => {
            return reports.reduce((promise, page) => {
              return promise
                .then(all => {
                  let links = this.input.getLinks(page.contents, link => !link.startsWith('http://'));
                  return this.input.readEachLink(links)
                    .then(webRecords => {
                      webRecords.forEach((report, i) => {
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