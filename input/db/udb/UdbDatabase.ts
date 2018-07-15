import {FileInput} from "../../FileInput";

let readline = require('readline');

import {Logger} from "../../../Logger";
import {WorldMap} from "../../WorldMap";
import * as fs from "fs";
import {Sources} from "../../Sources";
import {UdbRecordFormatter} from "../../../output/db/udb/UdbRecordFormatter";
import {RecordFormatter} from "../../../output/db/RecordFormatter";
import {Database} from "../Database";

export class UdbDatabase implements Database {
  private sourcesFile: string;
  private dataFile: string;
  private worldMap: string;
  private vm: WorldMap;
  private _sources: Sources;

  constructor(name: string, private logger: Logger, program: any) {
    this.sourcesFile = program.dataFile || 'input/data/usources.txt';
    this.dataFile = program.sourcesFile || 'input/data/U.RND';
    this.worldMap = program.wmFile || 'input/data/WM.VCE';
  }

  get sources(): Sources {
    return this._sources;
  }

  init(): Promise<FileInput> {
    return new Promise((resolve, reject) => {
      this.vm = new WorldMap(this.logger);
      this.vm.open(this.worldMap, count => this.logger.logVerbose(`Read ${count} WM records.\n`));

      this._sources = new Sources();
      const sourcesReader = readline.createInterface({
        input: fs.createReadStream(this.sourcesFile)
      });

      this._sources.open(sourcesReader, () => {
        this.logger.logVerbose('Reading sources:');
        this.logger.logVerbose(`- ${Object.keys(this._sources.primaryReferences).length} primary references`);
        this.logger.logVerbose(`- ${Object.keys(this._sources.newspapersAndFootnotes).length} newspapers and footnotes`);
        this.logger.logVerbose(`- ${Object.keys(this._sources.otherDatabasesAndWebsites).length} newspapers and footnotes`);
        this.logger.logVerbose(`- ${Object.keys(this._sources.otherPeriodicals).length} other periodicals`);
        this.logger.logVerbose(`- ${Object.keys(this._sources.misc).length} misc. books, reports, files & correspondance`);
        this.logger.logVerbose(`- ${this._sources.discredited.length} discredited reports`);

        const input: FileInput = new FileInput(this.logger);

        input.open(this.dataFile, () => {
          resolve(input);
        });
      });
    });
  }

  recordFormatter(): RecordFormatter {
    return new UdbRecordFormatter(this.sources);
  }
}