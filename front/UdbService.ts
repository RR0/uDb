import {Logger} from "../Logger";
import {Query} from "../Query";
import {Memory} from "../output/Memory";
import {Sources} from "../input/Sources";
import {WebFileInput} from "./WebFileInput";
import {RecordFormatter} from "../output/RecordFormatter";

export class UdbService {
  private sources: Sources;
  private format: string = 'memory';
  private firstIndex: number = 1;
  private maxCount: number = 1000000;
  private memory: Memory;
  private status;

  private recordFormatter = new RecordFormatter();

  constructor(private logger: Logger, private webFileInput: WebFileInput) {
    this.memory = new Memory();
    this.sources = new Sources();
  }

  load(dataFile) {
    const firstIndex = 1;
    this.logger.logVerbose(`\nReading cases from #${firstIndex}:`);
    this.webFileInput.open(dataFile, () => {
      new Query(this.webFileInput, this.memory, this.logger, this.recordFormatter, 'memory', this.sources)
        .execute(undefined, firstIndex, this.maxCount);
    });
  }

  match(matchCriteria) {
    let results = new Memory();
    new Query(this.memory, results, this.logger, null, this.format, this.sources)
      .execute(matchCriteria, this.firstIndex, this.maxCount, false, false);
    return results;
  }
}