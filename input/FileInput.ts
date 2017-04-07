import * as fs from "fs";
import {Logger} from "../log";
import {RecordReader} from "../RecordReader";
import {Input} from "./Input";
import {InputRecord} from "./InputRecord";

export class FileInput implements Input<InputRecord> {
  filePos: number;
  buffer: Buffer;
  recordSize = 112;
  private recordReader: RecordReader;
  fileSize: number;
  fd: number;

  constructor(private dataFile: string, private logger: Logger) {
  }

  open(cb) {
    fs.open(this.dataFile, 'r', (err: NodeJS.ErrnoException, fd: number) => {
      this.logger.logVerbose(`\nReading file ${this.dataFile}`);
      if (err) {
        return;
      }
      this.fd = fd;

      fs.fstat(fd, (err, stats) => {
        this.fileSize = stats.size;
        // logDebug('File size=' + fileSize);
        this.buffer = new Buffer(this.recordSize);
        this.recordReader = new RecordReader(this.buffer, this.logger);

        cb();
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
