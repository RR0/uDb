import {Input} from "../input/Input";
import {Logger} from "../Logger";
import {UdbRecordReader} from "../input/db/udb/UdbRecordReader";
import {Record} from "../input/db/RecordReader";
import {RecordEnumerator} from "../input/RecordEnumerator";

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

  recordEnumerator(firstIndex: number, maxCount: number): RecordEnumerator {
    return new RecordEnumerator(this, firstIndex, maxCount);
  }

  goToRecord(recordIndex) {
    this.filePos = recordIndex * this.recordSize;
  }

  hasNext(): boolean {
    return this.filePos + (this.recordSize * 2) < this.fileSize;
  }

  readRecord(recordIndex: number): Promise<Record> {
    return new Promise<Record>((resolve, reject) => {
      this.getBuffer();
      let inputRecord = this.recordReader.read(this.filePos);
      inputRecord.id = recordIndex;
      resolve(inputRecord);
    });
  }

  close(): void {
  }

  private getBuffer() {
    this.buffer.set(new Uint8Array(this.fileData, this.filePos, this.recordSize));
  }
}
