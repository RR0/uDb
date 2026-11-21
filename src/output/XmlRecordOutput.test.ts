import {describe, expect, it} from "vitest"
import {Writable} from "node:stream"
import {XmlRecordOutput} from "./XmlRecordOutput.js"

class MemoryWritable extends Writable {
  contents: string

  constructor(options?) {
    super(options)
    this.contents = ""
  }

  write(chunk): boolean {
    this.contents += chunk
    return true
  }
}

describe("xml", function () {

  describe("output", function () {

    it("should return simple XML", function () {
      const record = {
        id: 123,
        year: "1954",
        location: "loc"
      }
      const output = new MemoryWritable()
      const outputFormat = new XmlRecordOutput(output as any, record)
      outputFormat.write(record)
      outputFormat.end()
      expect(output.contents).toBe("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<udb>\n" +
        "<record><id>123</id><year>1954</year><location>loc</location></record>\n</udb>")
    })

    it("should replace special characters", function () {
      const record = {
        id: 124,
        field: "<somewhere>"
      }
      const output = new MemoryWritable()
      const outputFormat = new XmlRecordOutput(output as any, record)
      outputFormat.write(record)
      outputFormat.end()
      expect(output.contents).toBe("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<udb>\n" +
        "<record><id>124</id><field>&lt;somewhere&gt;</field></record>\n</udb>")
    })
  })
})
