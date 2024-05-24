import { Input, RecordEnumerator, UdbRecord, UdbRecordReader } from "../input"
import { Logger } from "../Logger"

/**
 * A FileInput that reads from a webapp.
 */
export class WebFileInput implements Input {
  buffer: Uint8Array
  fileData: ArrayBuffer
  filePos: number = 0
  recordSize = 112
  fileSize: number
  private recordReader: UdbRecordReader

  constructor(private logger: Logger) {
  }

  async open(dataFile: string) {
    const response = await fetch(dataFile, {headers: {"User-Agent": "@rr0/udb", responseType: "arraybuffer"}})
    if (response.ok) {
      this.fileData = await response.arrayBuffer()
      this.fileSize = this.fileData.byteLength
      // logDebug('File size=' + fileSize);
      this.buffer = new Uint8Array(this.fileData, this.filePos, this.recordSize)
      this.recordReader = new UdbRecordReader(this.buffer, this.logger)
    } else {
      throw Error(response.statusText)
    }
  }

  recordEnumerator(firstIndex: number, maxCount: number): RecordEnumerator {
    return new RecordEnumerator(this, firstIndex, maxCount)
  }

  goToRecord(recordIndex) {
    this.filePos = recordIndex * this.recordSize
  }

  hasNext(): boolean {
    return this.filePos + (this.recordSize * 2) < this.fileSize
  }

  readRecord(recordIndex: number): Promise<UdbRecord> {
    return new Promise<UdbRecord>((resolve, reject) => {
      this.getBuffer()
      let inputRecord = this.recordReader.read(this.filePos)
      inputRecord.id = recordIndex
      resolve(inputRecord)
    })
  }

  close(): void {
  }

  private getBuffer() {
    this.buffer.set(new Uint8Array(this.fileData, this.filePos, this.recordSize))
  }
}
