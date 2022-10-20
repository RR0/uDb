import {XmlRecordOutput} from "./XmlRecordOutput"

const stream = require("stream")

class MemoryWritable extends stream.Writable {

  constructor(options?) {
    super(options)
    this.contents = ""
  }

  write(chunk) {
    this.contents += chunk
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
      const outputFormat = new XmlRecordOutput(output, record)
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
      const outputFormat = new XmlRecordOutput(output, record)
      outputFormat.write(record)
      outputFormat.end()
      expect(output.contents).toBe("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<udb>\n" +
        "<record><id>124</id><field>&lt;somewhere&gt;</field></record>\n</udb>")
    })
  })
})
