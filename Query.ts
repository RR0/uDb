import {RecordEnumerator} from "./input/Input";
import {RecordFormatter} from "./output/format";
import {RecordOutput} from "./output/RecordOutput";
import {RecordMatcher} from "./match";
import {InputRecord} from "./input/InputRecord";
import {OutputRecord} from "./output/OutputRecord";
import {Util} from "./util";

/**
 * Query input using criteria
 */
export class Query {
  constructor(private input, private logger, private getOutput) {}

  execute(matchCriteria, firstIndex, maxCount) {
    const processingStart = Date.now();

    const recordEnumerator: RecordEnumerator = new RecordEnumerator(this.input, firstIndex);
    let recordFormatter: RecordFormatter;
    let outputFormat: RecordOutput;
    const recordMatcher = new RecordMatcher(matchCriteria);

    let count = 0;
    while (recordEnumerator.hasNext() && count < maxCount) {
      const inputRecord: InputRecord = recordEnumerator.next();
      if (recordMatcher.matches(inputRecord)) {
        if (!recordFormatter) {
          recordFormatter = new RecordFormatter(inputRecord);
          let outputRecord: OutputRecord = recordFormatter.formatProperties(Util.copy(inputRecord));
          outputFormat = this.getOutput(outputRecord);
        }
        this.logger.flush();
        const outputRecord: OutputRecord = recordFormatter.formatData(inputRecord);
        outputFormat.write(outputRecord);
        count++;
      } else {
        this.logger.reset();
      }
    }
    outputFormat.end();
    const processingDuration = Date.now() - processingStart;
    this.logger.autoFlush = true;
    this.logger.logVerbose(`\nFound ${count} reports in ${(processingDuration / 1000).toFixed(2)} seconds.`);
  }
}