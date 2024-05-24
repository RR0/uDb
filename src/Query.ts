import { Input, RecordEnumerator, UdbRecord } from "./input"
import { Logger } from "./Logger"
import { MatchError, RecordMatcher } from "./match"
import { Output, OutputFormat, OutputFormatSpec, RecordFormatter, RecordOutput, RecordOutputFactory } from "./output"
import { Util } from "./Util"

export enum Format {
  memory = "memory",
  default = "default",
  json = "json",
  xml = "xml"
}

/**
 * Query input using criteria
 */
export class Query {

  constructor(private input: Input, private output: Output<any>, private logger: Logger,
              private recordFormatter: RecordFormatter, private format: Format) {
  }

  async execute(matchCriteria: string, firstIndex: number, maxCount: number, format: boolean = true,
                allowEmpty: boolean = true): Promise<void> {
    this.logger.logVerbose(`Querying...`)
    const processingStart = Date.now()
    const recordEnumerator: RecordEnumerator = this.input.recordEnumerator(firstIndex, maxCount)
    try {
      const recordMatcher = new RecordMatcher(matchCriteria, allowEmpty)
      let output: RecordOutput<any>
      let count = 0
      while (recordEnumerator.hasNext()) {
        let inputRecord: UdbRecord = await recordEnumerator.next()
        if (recordMatcher.matches(inputRecord)) {
          let outputRecord: UdbRecord
          if (!output) {
            output = await this.getOutput(inputRecord, format)
            this.logger.logDebug(`Writing ${output}`)
          }
          if (format && this.recordFormatter) {
            outputRecord = this.recordFormatter.formatData(<any>inputRecord)
          } else {
            outputRecord = <any>inputRecord
          }
          output.write(outputRecord)
          count++
          this.logger.flush()
        } else {
          this.logger.reset()
        }
      }
      if (output) {
        output.end()
      }
      const processingDuration = Date.now() - processingStart
      this.logger.autoFlush = true
      this.logger.logVerbose(`Found ${count} records in ${(processingDuration / 1000).toFixed(2)} seconds.`)
    } catch (e) {
      if (e instanceof MatchError) {
        this.logger.error(e.message)
      }
    }
  }

  private getOutput(inputRecord: UdbRecord, format: boolean): Promise<RecordOutput<any>> {
    let outputRecord: UdbRecord
    if (format && this.recordFormatter) {
      outputRecord = this.recordFormatter.formatProperties(Util.copy(inputRecord))
    } else {
      outputRecord = <any>inputRecord
    }
    let params = new URLSearchParams(this.format)
    const paramsStart = this.format.indexOf("?")
    let outputFormat: OutputFormatSpec = {
      format: OutputFormat[this.format.substring(0, paramsStart > 0 ? paramsStart : undefined).toLocaleLowerCase()],
      params
    }
    return RecordOutputFactory.getRecordOutput(outputFormat, this.output, outputRecord)
  }
}
