import * as fs from "fs"
import {Input} from "./Input"
import {Database} from "./db/Database"
import {RecordReader} from "./db/RecordReader"
import {RecordEnumerator} from "./RecordEnumerator"
import {UdbRecord} from "./db/UdbRecord"

const bops = require("bops")

export class FileInput implements Input {
  filePos: number
  buffer: Buffer
  recordSize = 112
  fileSize: number
  fd: number

  private recordReader: RecordReader;

  constructor(private db: Database) {
  }

  open(dataFile: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.logger.logVerbose(`\nOpening file ${dataFile}`);
      fs.open(dataFile, 'r', (err: NodeJS.ErrnoException, fd: number) => {
        if (err) {
          reject(err);
        } else {
          this.fd = fd;

          fs.fstat(fd, (err, stats) => {
            this.fileSize = stats.size;
            // logDebug('File size=' + fileSize);
            this.buffer = bops.create(this.recordSize);
            this.recordReader = this.db.recordReader(this.buffer);

            resolve();
          });
        }
      });
    });
  }

  recordEnumerator(firstIndex: number, maxCount: number): RecordEnumerator {
    return new RecordEnumerator(this, firstIndex, maxCount);
  }

  goToRecord(recordIndex: number) {
    this.filePos = recordIndex * this.recordSize;
  }

  hasNext(): boolean {
    let has = this.filePos + this.recordSize < this.fileSize;
    // this.db.logger.logVerbose(`hasNext():${this.filePos} + ${this.recordSize} < ${this.fileSize}) = ${has}`).flush();
    return has;
  }

  readRecord(recordIndex: number): Promise<UdbRecord> {
    // this.db.logger.logVerbose(`readRecord(${recordIndex})`).flush();
    return new Promise((resolve, reject) => {
      let bytesRead = fs.readSync(this.fd, this.buffer, 0, this.recordSize, this.filePos)
      let inputRecord = this.recordReader.read(this.filePos, recordIndex)
      inputRecord.id = recordIndex
      resolve(inputRecord)
    })
  }

  close() {
    fs.close(this.fd, err => {
      if (err) {
        console.error('Error while closing', err);
        throw err;
      }
    });
  }
}
