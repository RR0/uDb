import {RecordEnumerator} from "./RecordEnumerator"
import {Input} from "./Input"
import {Database} from "./db/Database"
import {UdbRecord} from "./db/UdbRecord"

const http = require("http")

/**
 * Web page contents and its source url.
 */
export interface WebRecord {
  contents: string;
  source: string;
}

export type LinkCheck = (url: string) => boolean;
export type WebRead = {
  done?: Promise<WebRecord>;
  execute?: Function;
};

/**
 * A Web source to read from.
 */
export class WebInput implements Input {
  //static KB = 1000;

  pages: WebRecord[] = [];
  recordIndex = 0;
  maxConcurrent = 10;
  queue: WebRead[] = [];
  readIdleDuration = 100;
  private reading: number;
  private readPromises: Promise<WebRecord>[];

  constructor(private db: Database, private baseUrl: string, private max = 10000000) {
  }

  enqueue(read: WebRead): WebRead {
    this.queue.push(read);
    return read;
  }

  enqueueReadPage(url: string) {
    let read: WebRead = {};
    read.done = new Promise((resolve, reject) => {
      read.execute = () => this.readPage(url)
        .then(report => {
          this.addData(report);
          resolve(report);
        })
        .catch(error => reject(error));
    });
    return this.enqueue(read);
  }

  recordEnumerator(firstIndex: number, maxCount: number): RecordEnumerator {
    return new RecordEnumerator(this, firstIndex, maxCount);
  }

  run(): Promise<WebRecord[]> {
    this.reading = 0;

    return new Promise((resolve, reject) => {
      this.readPromises = [];
      const inter = setInterval(() => {
        if (!this.fetch(reject)) {
          clearInterval(inter);
          resolve(this.pages);
        }
      }, this.readIdleDuration);
    });
  }

  readRecord(recordIndex: number): Promise<UdbRecord> {
    return new Promise((resolve, reject) => {
      const inter = setInterval(() => {
        let page = this.pages[recordIndex - 1]
        if (page) {
          clearInterval(inter)
          const recordReader = this.db.recordReader(page)
          let record = recordReader.read(recordIndex)
          this.removeData(recordIndex)
          resolve(record)
        }
      }, this.readIdleDuration);
    });
  }

  protected get logger() {
    return this.db.logger;
  }

  goToRecord(recordIndex: number) {
    this.recordIndex = recordIndex;
  }

  hasNext(): boolean {
    return this.recordIndex < this.pages.length;
  }

  private fetch(reject) {
    let remaining = this.queue.length > 0 || this.reading > 0;
    if (remaining) {
      if (this.queue.length > 0 && this.reading <= this.maxConcurrent) {
        let read = this.queue.shift();
        if (read) {
          this.reading++;
          read.execute();
          read.done
            .then(() => {
              this.reading--;
            })
            .catch(error => {
              reject(error);
            });
          this.readPromises.push(read.done);
        }
      } else {
        Promise.all(this.readPromises).then(() => {
          this.readPromises = [];
        });
      }
    }
    return remaining;
  }

  /**
   * Read a web page.
   *
   * @param url The URL of the page to read.
   * @returns A promise to provide a web record.
   */
  readPage(url: string): Promise<WebRecord> {
    return new Promise<WebRecord>((resolve, reject) => {
      url = this.absoluteUrl(url);
      this.logger.log(`Reading ${url}`/*, false*/);
      let content = "";
      const req = http.get(url, res => {
        const size = parseInt(res.headers['content-length'], 10);
        // this.logger.log(` (${(size / WebInput.KB).toFixed(1)} KB) `, false, false);
        res.setEncoding("utf8");
        //let chunks = 0;
        res.on("data", (chunk) => {
          /*chunks++;
          if (chunks % 10 == 0) {
            this.logger.log(`.`, false, false);
          }*/
          content += chunk;
        });
        res.on("error", error => {
          reject(`Could not read ${url}: ${error}`);
        });
        res.on("end", () => {
          //   this.logger.log(' OK', true, false);
          //    this.logger.flush();
          resolve(<WebRecord>{contents: content, source: url});
        });
      });
      req.end();
    });
  }

  /**
   * Search a web record for anchor links.
   *
   * @param pageContents The web record to search into.
   * @param linkCheck A function to filter a link in.
   * @returns The array of found links.
   */
  getLinks(pageContents: WebRecord, linkCheck: LinkCheck): string[] {
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
        if (linkCheck(reportLink)) {
          reports.push(this.absoluteUrl(reportLink));
        }
        pos = reportLinkEnd;
        done++;
      }
    } while (reportLinkStart >= 0 && done <= this.max);
    return reports;
  }

  private absoluteUrl(url: string) {
    if (!url.startsWith('http')) {
      url = `${this.baseUrl}/${url}`;
    }
    return url;
  }

  close(): void {
  }

  addData(report: WebRecord) {
    this.pages.push(report);
  }

  private removeData(recordIndex: number) {
    this.pages[recordIndex] = null;
  }
}
