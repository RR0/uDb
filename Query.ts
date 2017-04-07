import {Input} from "./input/Input";
import {Sources} from "./input/Sources";
import {Logger} from "./log";
import {RecordMatcher} from "./match";
import {RecordFormatter} from "./output/format";
import {OutputFormatFactory} from "./output/OutputFormatFactory";
import {OutputRecord} from "./output/OutputRecord";
import {Output, RecordOutput} from "./output/RecordOutput";
import {Record} from "./RecordReader";
import {Util} from "./util";
import {RecordEnumerator} from "./input/RecordEnumerator";

/**
 * Query input using criteria
 */
export class Query<RecordType extends Record> {
  constructor(private input: Input<RecordType>, private output: Output, private logger: Logger,
              private recordFormatter: RecordFormatter, private format: string, private sources: Sources) {
  }

  execute(matchCriteria: string, firstIndex: number, maxCount: number) {
    const processingStart = Date.now();

    const recordEnumerator: RecordEnumerator<RecordType> = new RecordEnumerator<RecordType>(this.input, firstIndex);
    const recordMatcher = new RecordMatcher<RecordType>(matchCriteria);
    let outputFormat: RecordOutput;

    let count = 0;
    while (recordEnumerator.hasNext() && count < maxCount) {
      const inputRecord: RecordType = recordEnumerator.next();
      if (recordMatcher.matches(inputRecord)) {
        let outputRecord: OutputRecord;
        if (this.recordFormatter) {
          if (!outputFormat) {
            let outputRecord: OutputRecord = this.recordFormatter.formatProperties(Util.copy(inputRecord));
            outputFormat = OutputFormatFactory.getOutputFormat(this.format, this.output, outputRecord, this.sources.primaryReferences);
          }
          outputRecord = this.recordFormatter.formatData(inputRecord);
        } else {
          if (!outputFormat) {
            outputFormat = OutputFormatFactory.getOutputFormat(this.format, this.output, outputRecord, this.sources.primaryReferences);
          }
          outputRecord = inputRecord;
        }
        outputFormat.write(outputRecord);
        count++;
        this.logger.flush();
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