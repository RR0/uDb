import {InputRecord} from "./input/InputRecord";

interface CriterionMatcher {
  getType(): string;
  match(record: InputRecord): boolean;
}
class EqualMatcher implements CriterionMatcher {
  constructor(private type: string, private prop, private value) {
  }

  getType(): string {
    return this.type;
  }

  match(record: InputRecord): boolean {
    return record[this.prop] == this.value;
  }
}
export class RecordMatcher {
  private matchers = [];

  constructor(private criteria = '') {
    const andCriterions = criteria.split('&');
    for (let a = 0; a < andCriterions.length; ++a) {
      let type: string = 'and';
      const andCriterion = andCriterions[a];
      let orCriterions = andCriterion.split('|');
      for (let o = 0; o < orCriterions.length; ++o) {
        const orCriterion = orCriterions[o];
        let operands = orCriterion.split('=');
        const matcher = new EqualMatcher(type, operands[0], operands[1]);
        type = 'or';
        this.matchers.push(matcher);
      }
    }
  }

  matches(record: InputRecord) {
    let type;
    let result = true;
    for (let i = 0; i < this.matchers.length; ++i) {
      let matcher = this.matchers[i];
      let matched = matcher.match(record);
      type = matcher.getType();
      switch (matcher.getType()) {
        case 'or':
          result = result || matched;
          break;
        case 'and':
        default:
          result = result && matched;
      }
    }
    return result;
  }
}