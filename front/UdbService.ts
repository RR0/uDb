import {Sources} from "../input/Sources";
import {Logger} from "../Logger";
import {Memory} from "../output/Memory";
import {UdbRecordFormatter} from "../output/db/udb/UdbRecordFormatter";
import {Query} from "../Query";
import {WebFileInput} from "./WebFileInput";

export class WebReadLine {
  lineCb: Function;
  closeCb: Function;
  private data: string;
  private pos: number;

  createInterface(param) {
    param.input.then((response) => {
      this.data = response.data;
      this.read();
    });
    return this;
  }

  private read() {
    this.pos = 0;
    let end: boolean;
    do {
      let index = this.data.indexOf('\n', this.pos + 1);
      end = index < 0;
      if (end) {
        index = this.data.length;
      }
      const line = this.data.substring(this.pos, index);
      this.lineCb(line);
      this.pos = index + 1;
    } while (!end);
    this.closeCb();
  }

  on(eventName, cb) {
    switch (eventName) {
      case 'line':
        this.lineCb = cb;
        break;
      case 'close':
        this.closeCb = cb;
        break;
      default:
    }
    return this;
  }
}

export class UdbService {
  private sources: Sources;
  private format: string = 'memory';
  private firstIndex: number = 1;
  private maxCount: number = 1000000;
  private memory: Memory;

  private recordFormatter;

  /*@ngInject*/
  constructor(private logger: Logger, private webFileInput: WebFileInput, private $http, private webReadLine: WebReadLine) {
    this.memory = new Memory();
    this.sources = new Sources();
    this.recordFormatter = new UdbRecordFormatter(this.sources);
  }

  load(sourcesFilename: string, dataFilename: string) {
    this.loadSources(sourcesFilename, () => {
      this.loadData(dataFilename);
    });
  }

  private loadSources(sourcesFilename: string, cb: Function) {
    this.logger.logVerbose(`\nReading sources from #${sourcesFilename}:`);
    const sourcesReader = this.webReadLine.createInterface({
      input: this.$http.get(sourcesFilename)
    });
    this.sources.open(sourcesReader, () => {
      this.logger.logVerbose('Reading sources:');
      this.logger.logVerbose(`- ${Object.keys(this.sources.primaryReferences).length} primary references`);
      this.logger.logVerbose(`- ${Object.keys(this.sources.newspapersAndFootnotes).length} newspapers and footnotes`);
      this.logger.logVerbose(`- ${Object.keys(this.sources.otherDatabasesAndWebsites).length} newspapers and footnotes`);
      this.logger.logVerbose(`- ${Object.keys(this.sources.otherPeriodicals).length} other periodicals`);
      this.logger.logVerbose(`- ${Object.keys(this.sources.misc).length} misc. books, reports, files & correspondance`);
      this.logger.logVerbose(`- ${this.sources.discredited.length} discredited reports`);
      cb();
    });
  }

  private loadData(dataFilename: string) {
    const firstIndex = 1;
    this.logger.logVerbose(`\nReading cases from #${firstIndex}:`);
    this.webFileInput.open(dataFilename, () => {
      new Query(this.webFileInput, this.memory, this.logger, this.recordFormatter, 'memory')
        .execute(undefined, firstIndex, this.maxCount);
    });
  }

  match(matchCriteria) {
    let results = new Memory();
    new Query(this.memory, results, this.logger, null, this.format)
      .execute(matchCriteria, this.firstIndex, this.maxCount, false, false);
    return results;
  }
}