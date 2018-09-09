import {Input} from "../input/Input";
import {Logger} from "../Logger";
import {UdbRecordReader} from "../input/db/udb/UdbRecordReader";
import {Record} from "../input/db/RecordReader";

/**
 * A FileInput that reads from a webapp.
 */
export class WebFileInput implements Input {
  buffer: Uint8Array;
  fileData: ArrayBuffer;
  filePos: number = 0;
  recordSize = 112;
  private recordReader: UdbRecordReader;
  fileSize: number;

  /*@ngInject*/
  constructor(private logger: Logger, private $http) {
  }

  open(dataFile, whenDone: Function) {
    this.$http.get(dataFile, {responseType: "arraybuffer"}).then((response) => {
      this.fileData = response.data;
      this.fileSize = this.fileData.byteLength;
      // logDebug('File size=' + fileSize);
      this.buffer = new Uint8Array(this.fileData, this.filePos, this.recordSize);
      this.recordReader = new UdbRecordReader(this.buffer, this.logger);

      whenDone();
    });
  }

  goToRecord(recordIndex) {
    this.filePos = recordIndex * this.recordSize;
  }

  hasNext(): boolean {
    return this.filePos + (this.recordSize * 2) < this.fileSize;
  }

  readRecord(recordIndex: number): Record {
    this.getBuffer();
    let inputRecord = this.recordReader.read(this.filePos);
    inputRecord.id = recordIndex;
    return inputRecord;
  }

  close(): void {
  }

  private getBuffer() {
    this.buffer.set(new Uint8Array(this.fileData, this.filePos, this.recordSize));
  }
}
