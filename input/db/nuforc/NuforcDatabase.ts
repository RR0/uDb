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
  }

  get logger(): Logger {
    return this._logger;
  }

  init(): Promise<Input> {
    this.input = new WebInput(this, this.baseUrl);
    return this.input.readPage(this.baseUrl + '/ndxevent.html')
      .then(content => {
        this.logger.log(`Finding reports`);
        const reportLinks = this.input.getLinks(content, reportLink => reportLink.startsWith('ndxe'));
        return this.input.readEachLink(reportLinks)
          .then(reports => {
            return reports.reduce((promise, page) => {
              return promise
                .then(all => {
                  let links = this.input.getLinks(page, link => !link.startsWith('http://'));
                  return this.input.readEachLink(links)
                    .then(reports => {
                      this.input.pages = this.input.pages.concat(reports);
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

  recordReader(buffer: Buffer): RecordReader {
    return new NuforcRecordReader(buffer, this._logger);
  }
}