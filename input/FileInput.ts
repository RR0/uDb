import * as fs from "fs";
import {Logger} from "../Logger";
import {RecordReader} from "../RecordReader";
import {Input} from "./Input";
import {InputRecord} from "./InputRecord";
const bops = require("bops");

export class FileInput implements Input<InputRecord> {
  filePos: number;
  buffer: Buffer;
  recordSize = 112;
  private recordReader: RecordReader;
  fileSize: number;
  fd: number;

  constructor(private logger: Logger) {
  }

  open(dataFile: string, whenDone: Function) {
    fs.open(dataFile, 'r', (err: NodeJS.ErrnoException, fd: number) => {
      this.logger.logVerbose(`\nReading file ${dataFile}`);
      if (err) {
        return;
      }
      this.fd = fd;

      fs.fstat(fd, (err, stats) => {
        this.fileSize = stats.size;
        // logDebug('File size=' + fileSize);
        this.buffer = bops.create(this.recordSize);
        this.recordReader = new RecordReader(this.buffer, this.logger);

        whenDone();
      });
    });
  }

  goToRecord(recordIndex) {
    this.filePos = recordIndex * this.recordSize;
  }

  hasNext(): boolean {
    return this.filePos + this.recordSize < this.fileSize;
  }

  readRecord(recordIndex: number): InputRecord {
    fs.readSync(this.fd, this.buffer, 0, this.recordSize, this.filePos);
    let inputRecord = this.recordReader.read(this.filePos);
    inputRecord.id = recordIndex;
    return inputRecord;
  }

  close() {
    fs.close(this.fd);
  }
}
