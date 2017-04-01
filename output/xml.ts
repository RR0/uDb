const json2xml = require('json2xml');

export class XmlRecordOutput {
  constructor(private output, private sortedRecord) {
    this.output.write('<?xml version="1.0" encoding="UTF-8"?>\n<udb>\n')
  }

  desc(record) {
    return json2xml(record).toString();
  }

  write(record) {
    let formattedRecord = {};
    for (let prop in this.sortedRecord) {
      formattedRecord[prop] = record[prop];
    }
    this.output.write(`<record>${this.desc(formattedRecord)}</record>\n`);
  }

  end() {
    this.output.write('</udb>')
  }
}
