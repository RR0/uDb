const http = require("http");
import {FileInput} from "../../FileInput";

let readline = require('readline');

import {Logger} from "../../../Logger";
import {NuforcRecordFormatter} from "../../../output/db/nuforc/NuforcRecordFormatter";
import {RecordFormatter} from "../../../output/db/RecordFormatter";
import {Database} from "../Database";
import {RecordReader} from "../RecordReader";
import {NuforcRecordReader} from "./NuforcRecordReader";

export class NuforcDatabase implements Database {
  private url = 'http://www.nuforc.org//webreports/ndxevent.html';

  constructor(name: string, private _logger: Logger, program: any) {
  }

  get logger(): Logger {
    return this._logger;
  }

  init(): Promise<FileInput> {
    return new Promise((resolve, reject) => {
      let content = "";

      const req = http.get(this.url, res => {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
          content += chunk;
        });
        res.on("end", () => {
          this.logger.log(content);
          resolve(content);
        });
      });
      req.end();
    });
  }

  recordFormatter(): RecordFormatter {
    return new NuforcRecordFormatter();
  }

  recordReader(buffer: Buffer): RecordReader {
    return new NuforcRecordReader(buffer, this._logger);
  }
}