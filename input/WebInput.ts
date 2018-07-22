const http = require("http");

import {Input} from "./Input";
import {Record} from "./db/RecordReader";
import {Database} from "./db/Database";

export interface WebRecord {
  contents: string;
  source: string;
}

export class WebInput implements Input {
  pages: string[] = [];
  recordIndex = 0;
  sources: string[] = [];

  constructor(private db: Database, private baseUrl: string, private max = 10000000) {
  }

  goToRecord(recordIndex: number) {
    this.recordIndex = recordIndex;
  }

  hasNext(): boolean {
    return this.recordIndex <= this.pages.length;
  }

  readRecord(recordIndex: number): Record {
    let page = this.pages[recordIndex - 1];
    let source = this.sources[recordIndex - 1];
    const recordReader = this.db.recordReader(page, source);
    return recordReader.read(recordIndex);
  }

  readPage(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db.logger.log(`Reading ${url} `, false);
      let content = "";
      const req = http.get(url, res => {
        res.setEncoding("utf8");
        let chunks = 0;
        res.on("data", (chunk) => {
          chunks++;
          if (chunks % 10 == 0) {
            this.db.logger.log(`.`, false, false);
          }
          content += chunk;
        });
        res.on("end", () => {
          const size = parseInt(res.headers['content-length'], 10);
          this.db.logger.log(` ${size} bytes`, true, false);
          this.db.logger.flush();
          resolve(content);
        });
      });
      req.end();
    });
  }

  readEachLink(allLinks: string[]): Promise<WebRecord[]> {
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
            let url = `${this.baseUrl}/${link}`;
            groupPromises.push(this.readPage(url)
              .then(oneContent => {
                let webRecord: WebRecord = {contents: oneContent, source: url};
                allContents.push(webRecord);
              }));
          });
          return Promise.all(groupPromises);
        })
        .then(oneContent => {
          return allContents;
        });
    }, Promise.resolve([]));
  }

  getLinks(pageContents: string, linkSelection: Function): string[] {
    const reports = [];
    let pos = 0;
    let reportLinkStart;
    let done = 0;
    const token = '<a href=';
    const lowercaseContents = pageContents.toLowerCase();
    do {
      reportLinkStart = lowercaseContents.indexOf(token, pos);
      if (reportLinkStart >= 0) {
        const reportLinkEnd = lowercaseContents.indexOf('>', reportLinkStart);
        let reportLink = lowercaseContents.substring(reportLinkStart + token.length, reportLinkEnd).trim();
        if (reportLink.charAt(0) === '"') {
          reportLink = reportLink.substring(1, reportLink.lastIndexOf('"'));
        }
        if (linkSelection(reportLink)) {
          reports.push(reportLink);
        }
        pos = reportLinkEnd;
        done++;
      }
    } while (reportLinkStart >= 0 && done <= this.max);
    return reports;
  }

  close(): void {
  }
}