import * as fs from "fs";
import {Input} from "./Input";
import {Database} from "./db/Database";
import {Record, RecordReader} from "./db/RecordReader";

const bops = require("bops");

export class FileInput implements Input {
  private recordReader: RecordReader;
  filePos: number;
  buffer: Buffer;
  recordSize = 112;
  fileSize: number;
  fd: number;

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

  goToRecord(recordIndex) {
    this.filePos = recordIndex * this.recordSize;
  }

  hasNext(): boolean {
    return this.filePos + this.recordSize < this.fileSize;
  }

  readRecord(recordIndex: number): Record {
    fs.readSync(this.fd, this.buffer, 0, this.recordSize, this.filePos);
    let inputRecord = this.recordReader.read(this.filePos);
    inputRecord.id = recordIndex;
    return inputRecord;
  }

  close() {
    fs.close(this.fd);
  }
}
