const http = require("http");

import {Input} from "./Input";
import {Record} from "./db/RecordReader";
import {Database} from "./db/Database";

export class WebInput implements Input {
  pages: string[] = [];
  recordIndex = 0;

  constructor(private db: Database, private baseUrl) {
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

  readPage(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db.logger.log(`Reading ${url}`);
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

  readEachLink(allLinks: string[]): Promise<string[]> {
    const allContents = [];
    return allLinks.reduce((promise, path) => {
      return promise
        .then(all => {
          let url = `${this.baseUrl}/${path}`;
          return this.readPage(url);
        })
        .then(oneContent => {
          allContents.push(oneContent);
          return allContents;
        });
    }, Promise.resolve([]));
  }

  getLinks(pageContents: string, linkSelection: Function): string[] {
    const reports = [];
    let pos = 0;
    let reportLinkStart;
    const max = 2;
    let done = 0;
    const token = '<a href=';
    const lowercaseContents = pageContents.toLowerCase();
    do {
      reportLinkStart = lowercaseContents.indexOf(token, pos);
      if (reportLinkStart) {
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
    } while (reportLinkStart >= 0 && done <= max);
    return reports;
  }

  close(): void {
  }
}