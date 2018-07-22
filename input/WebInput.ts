const http = require("http");

import {Input} from "./Input";
import {Record} from "./db/RecordReader";
import {Database} from "./db/Database";

/**
 * Web page contents and its source url.
 */
export interface WebRecord {
  contents: string;
  source: string;
}

/**
 * A Web source to read from.
 */
export class WebInput implements Input {
  pages: WebRecord[] = [];
  recordIndex = 0;

  constructor(private db: Database, private baseUrl: string, private max = 10000000) {
  }

  protected get logger() {
    return this.db.logger;
  }

  goToRecord(recordIndex: number) {
    this.recordIndex = recordIndex;
  }

  hasNext(): boolean {
    return this.recordIndex <= this.pages.length;
  }

  readRecord(recordIndex: number): Record {
    let page = this.pages[recordIndex - 1];
    const recordReader = this.db.recordReader(page);
    return recordReader.read(recordIndex);
  }

  readPage(url: string): Promise<WebRecord> {
    if (!url.startsWith('http')) {
      url = `${this.baseUrl}/${url}`;
    }
    return new Promise((resolve, reject) => {
      this.logger.log(`Reading ${url}`, false);
      let content = "";
      const req = http.get(url, res => {
        const size = parseInt(res.headers['content-length'], 10);
        this.logger.log(` (${(size / 1024).toFixed(1)} KB) `, false, false);
        res.setEncoding("utf8");
        let chunks = 0;
        res.on("data", (chunk) => {
          chunks++;
          if (chunks % 10 == 0) {
            this.logger.log(`.`, false, false);
          }
          content += chunk;
        });
        res.on("error", error => {
          reject(`Could not read ${url}: ${error}`);
        });
        res.on("end", () => {
          this.logger.log(' OK', true, false);
          this.logger.flush();
          resolve(<WebRecord>{contents: content, source: url});
        });
      });
      req.end();
    });
  }

  readEachLink(allLinks: string[], cb?: Function): Promise<WebRecord[]> {
    const allContents: WebRecord[] = [];
    const groups = [];
    const groupSize = 1;
    let group;
    allLinks.forEach((link, index) => {
      if (index % groupSize === 0) {
        group = [];
        groups.push(group);
      }
      group.push(link);
    });
    return groups.reduce((promise, group) => {
      return promise
        .then(all => {
          const groupPromises = [];
          group.forEach(link => {
            groupPromises.push(this.readPage(link)
              .then(webRecord => {
                allContents.push(webRecord);
                if (cb) {
                  cb(webRecord);
                }
              })
              .catch(error => {
                throw Error(error);
              })
            );
          });
          return Promise.all(groupPromises);
        })
        .then(oneContent => {
          return allContents;
        });
    }, Promise.resolve([]));
  }

  getLinks(pageContents: WebRecord, linkSelection: Function): string[] {
    const reports = [];
    let pos = 0;
    let reportLinkStart;
    let done = 0;
    const token = '<a href=';
    const lowercaseContents = pageContents.contents.toLowerCase();
    do {
      reportLinkStart = lowercaseContents.indexOf(token, pos);
      if (reportLinkStart >= 0) {
        const reportLinkEnd = lowercaseContents.indexOf('>', reportLinkStart);
        let reportLink = lowercaseContents.substring(reportLinkStart + token.length, reportLinkEnd).trim();
        if (reportLink.charAt(0) === '"') {
          reportLink = reportLink.substring(1, reportLink.lastIndexOf('"'));
        }
        if (linkSelection(reportLink)) {
          reports.push(`${this.baseUrl}/${reportLink}`);
        }
        pos = reportLinkEnd;
        done++;
      }
    } while (reportLinkStart >= 0 && done <= this.max);
    return reports;
  }

  close(): void {
  }

  addData(report: WebRecord) {
    this.pages.push(report);
  }
}