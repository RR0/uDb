import {Input} from "../../Input";

const http = require("http");

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
    this.input = new WebInput(this);
    return this.readPage(this.baseUrl + '/ndxevent.html')
      .then(content => {
        const reportLinks = this.findReports(content);
        return this.readReports(reportLinks)
          .then(reports => {
            this.input.records = reports;
            return this.input;
          });
      });
  }

  private readPage(url): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.logger.log(`Reading ${url}`);
      let content = "";
      const req = http.get(url, res => {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
          content += chunk;
        });
        res.on("end", () => {
          resolve(content);
        });
      });
      req.end();
    });
  }

  recordFormatter(): RecordFormatter {
    return new NuforcRecordFormatter();
  }

  recordReader(buffer: Buffer): RecordReader {
    return new NuforcRecordReader(buffer, this._logger);
  }

  private findReports(page: string): string[] {
    this.logger.log(`Finding reports`);
    const reports = [];
    let pos = 0;
    let reportLinkStart;
    const max = 5;
    let done = 0;
    const token = '<A HREF=';
    do {
      reportLinkStart = page.indexOf(token, pos);
      if (reportLinkStart) {
        const reportLinkEnd = page.indexOf('>', reportLinkStart);
        const reportLink = page.substring(reportLinkStart + token.length, reportLinkEnd).trim();
        reports.push(reportLink);
        pos = reportLinkEnd;
        done++;
      }
    } while (reportLinkStart >= 0 && done <= max);
    return reports;
  }

  private readReports(allReportLinks: string[]): Promise<string[]> {
    const allMonthReports = [];
    return allReportLinks.reduce((promise, reportLink) => {
      return promise
        .then(all => {
          let reportUrl = `${this.baseUrl}/${reportLink}`;
          return this.readMonthReport(reportUrl);
        })
        .then(report => {
          allMonthReports.push(report);
          return allMonthReports;
        });
    }, Promise.resolve([]));
  }

  private readMonthReport(reportLink: string): Promise<string> {
    return this.readPage(reportLink);
  }
}