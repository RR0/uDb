import {Input} from "./Input"
import {UdbRecord} from "./db/UdbRecord"

export class RecordEnumerator {

  private count = 0

  constructor(private input: Input, private recordIndex: number, private maxCount: number) {
    this.input.goToRecord(this.recordIndex)
  }

  hasNext(): boolean {
    return this.count < this.maxCount && this.input.hasNext();
  }

  async next(): Promise<UdbRecord> {
    this.input.goToRecord(this.recordIndex)
    const promise = this.input.readRecord(this.recordIndex)
    this.recordIndex++
    this.count++
    return promise
  }
}
