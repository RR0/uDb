import {FileInput} from "../../FileInput";

let readline = require('readline');

import {Logger} from "../../../Logger";
import {WorldMap} from "./WorldMap";
import * as fs from "fs";
import {Sources} from "./Sources";
import {UdbRecordFormatter} from "../../../output/db/udb/UdbRecordFormatter";
import {RecordFormatter} from "../../../output/db/RecordFormatter";
import {Database} from "../Database";
import {RecordReader} from "../RecordReader";
import {UdbRecordReader} from "./UdbRecordReader";

export class UdbDatabase implements Database {
  static DATA_FILE_DEFAULT = 'input/db/udb/data/U.RND';

  private sourcesFile: string;
  private dataFile: string;
  private worldMap: string;
  private vm: WorldMap;
  private sources: Sources;

  constructor(name: string, private _logger: Logger, program: any) {
    this.sourcesFile = program.sourcesFile || 'input/db/udb/data/usources.txt';
    this.dataFile = program.dataFile || UdbDatabase.DATA_FILE_DEFAULT;
    this.worldMap = program.wmFile || 'input/db/udb/data/WM.VCE';
  }

  get logger(): Logger {
    return this._logger;
  }

  init(): Promise<FileInput> {
    return new Promise((resolve, reject) => {
      this.vm = new WorldMap(this._logger);
      this.vm.open(this.worldMap, count => this._logger.logVerbose(`Read ${count} WM records.\n`));

      this.sources = new Sources();
      const sourcesReader = readline.createInterface({
        input: fs.createReadStream(this.sourcesFile)
      });

      this.sources.open(sourcesReader, () => {
        this._logger.logVerbose('Reading sources:');
        this._logger.logVerbose(`- ${Object.keys(this.sources.primaryReferences).length} primary references`);
        this._logger.logVerbose(`- ${Object.keys(this.sources.newspapersAndFootnotes).length} newspapers and footnotes`);
        this._logger.logVerbose(`- ${Object.keys(this.sources.otherDatabasesAndWebsites).length} newspapers and footnotes`);
        this._logger.logVerbose(`- ${Object.keys(this.sources.otherPeriodicals).length} other periodicals`);
        this._logger.logVerbose(`- ${Object.keys(this.sources.misc).length} misc. books, reports, files & correspondance`);
        this._logger.logVerbose(`- ${this.sources.discredited.length} discredited reports`);

        const input: FileInput = new FileInput(this);

        input.open(this.dataFile)
          .then(() => {
            resolve(input);
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  }

  recordFormatter(): RecordFormatter {
    return new UdbRecordFormatter(this.sources);
  }

  recordReader(buffer: Buffer): RecordReader {
    return new UdbRecordReader(buffer, this._logger);
  }
}