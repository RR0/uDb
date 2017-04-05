import * as fs from "fs";
import {Logger} from "../log";

export class WorldMap {

  constructor(private logger: Logger) {
  }

  open(worldMap, cb) {
    fs.open(worldMap, 'r', (err: NodeJS.ErrnoException, fd: number) => {
      this.logger.logVerbose('Reading world map:');
      if (err) {
        this.logger.error(`Could not read world map: ${err.errno}`);
        return;
      }
      fs.fstat(fd, (err, stats) => {
        const fileSize = stats.size;
        let position = 0;
        let recordSize = 6;
        let count = 0;
        const buffer = new Buffer(recordSize);
        while (position < fileSize) {
          if ((position + recordSize) > fileSize) {
            let recordSize = fileSize - position;
            this.logger.logDebug(`last recordSize=${recordSize}`);
          }
          fs.readSync(fd, buffer, 0, recordSize, position);
          count++;
          position += recordSize;
        }
        cb(count);
      });
    });
  }
}
