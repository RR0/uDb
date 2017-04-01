const assert = require('assert');
const stream = require('stream');
const xml = require('../build/output/xml');

class MemoryWritable extends stream.Writable {
  constructor(options) {
    super(options);
    this.contents = '';
  }

  write(chunk) {
    this.contents += chunk;
  }
}

describe('xml', function () {
  describe('output', function () {

    it('should return simple XML', function () {
      const record = {
        year: '1954',
        location: 'loc',
      };
      const output = new MemoryWritable();
      const outputFormat = new xml.XmlRecordOutput(output, record);
      outputFormat.write(record);
      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<udb>\n' +
        '<record><year>1954</year><location>loc</location></record>\n', output.contents);
    });
    it('should replace special characters', function () {
      const record = {
        field: '<somewhere>',
      };
      const output = new MemoryWritable();
      const outputFormat = new xml.XmlRecordOutput(output, record);
      outputFormat.write(record);
      assert.equal('<?xml version="1.0" encoding="UTF-8"?>\n<udb>\n' +
        '<record><field>&lt;somewhere&gt;</field></record>\n', output.contents);
    });
  });
});