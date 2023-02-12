import {Output} from "./RecordOutput"
import {Input} from "../input/Input"
import {RecordEnumerator} from "../input/RecordEnumerator"
import {UdbRecord} from "../input/db/UdbRecord"

export class Memory implements Input, Output<UdbRecord> {
  records: UdbRecord[] = []
  private recordIndex

  hasNext(): boolean {
    return this.recordIndex < this.records.length - 1
  }

  readRecord(): Promise<UdbRecord> {
    return Promise.resolve(this.records[this.recordIndex])
  }

  goToRecord(recordIndex: number) {
    this.recordIndex = recordIndex
  }

  write(record: UdbRecord): boolean {
    this.records.push(record)
    return true
  }

  close(): void {
  }

  recordEnumerator(firstIndex: number, maxCount: number): RecordEnumerator {
    return new RecordEnumerator(this, firstIndex, maxCount)
  }

  toString() {
    return "Memory"
  }
}
