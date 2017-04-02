import {InputRecord} from "./input/InputRecord";

export class RecordMatcher {
  private matchers = [];

  constructor(private criteria = '') {
    const criterions = criteria.split('&');
    for (let i = 0; i < criterions.length; ++i) {
      const criterion = criterions[i];
      let operands = criterion.split('=');
      const equalMatcher = (record) => {
        let prop = operands[0];
        let value = operands[1];
        return record[prop] == value;
      };
      this.matchers.push(equalMatcher);
    }
  }

  matches(record: InputRecord) {
    for (let i = 0; i < this.matchers.length; ++i) {
      let matcher = this.matchers[i];
      if (!matcher(record)) {
        return false;
      }
    }
    return true;
  }
}