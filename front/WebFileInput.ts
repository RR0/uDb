import {Input} from "../input/Input";
import {InputRecord} from "../input/InputRecord";
import {Logger} from "../log";
import {RecordReader} from "../RecordReader";

export class WebFileInput implements Input<InputRecord> {
  buffer: Uint8Array;
  fileData: ArrayBuffer;
  filePos: number = 0;
  recordSize = 112;
  private recordReader: RecordReader;
  fileSize: number;

  constructor(private logger: Logger, private $http) {
  }

  open(dataFile, whenDone: Function) {
    this.$http.get(dataFile, {responseType: "arraybuffer"}).then((response) => {
      this.fileData = response.data;
      this.fileSize = this.fileData.byteLength;
      // logDebug('File size=' + fileSize);
      this.buffer = new Uint8Array(this.fileData, this.filePos, this.recordSize);
      this.recordReader = new RecordReader(this.buffer, this.logger);

      whenDone();
    });
  }

  goToRecord(recordIndex) {
    this.filePos = recordIndex * this.recordSize;
  }

  hasNext(): boolean {
    return this.filePos + (this.recordSize * 2) < this.fileSize;
  }

  readRecord(recordIndex: number): InputRecord {
    this.getBuffer();
    let inputRecord = this.recordReader.read(this.filePos);
    inputRecord.id = recordIndex;
    return inputRecord;
  }

  private getBuffer() {
    this.buffer.set(new Uint8Array(this.fileData, this.filePos, this.recordSize));
  }
}
