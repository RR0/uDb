import {Logger} from "../log";
import {Query} from "../Query";
import {Memory} from "../output/Memory";
import {Sources} from "../input/Sources";
import {WebFileInput} from "./WebFileInput";
import {RecordFormatter} from "../output/format";

export class UdbService {
  private sources: Sources;
  private format: string = 'memory';
  private firstIndex: number = 1;
  private maxCount: number = 1000000;
  private memory: Memory;

  private recordFormatter = new RecordFormatter();

  constructor(private logger: Logger, webFileInput: WebFileInput) {
    this.memory = new Memory();
    this.sources = new Sources();

    const firstIndex = 1;
    logger.logVerbose(`\nReading cases from #${firstIndex}:`);

    webFileInput.open('../input/data/U.RND', () => {
      new Query(webFileInput, this.memory, logger, this.recordFormatter, 'memory', this.sources)
        .execute(undefined, firstIndex, this.maxCount);
    });
  }

  match(matchCriteria) {
    let results = new Memory();
    new Query(this.memory, results, this.logger, this.recordFormatter, this.format, this.sources)
      .execute(matchCriteria, this.firstIndex, this.maxCount, false);
    return results;
  }
}