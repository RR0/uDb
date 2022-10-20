import * as fs from "fs"
import {Logger} from "../../../Logger"

export class WorldMap {

  constructor(private logger: Logger) {
  }

  async open(worldMap: string): Promise<number> {
    this.logger.logVerbose("Reading world map " + worldMap)
    try {
      const fd = fs.openSync(worldMap, "r")
      const stats = fs.fstatSync(fd)
      const fileSize = stats.size
      let position = 0
      let recordSize = 6
      let count = 0
      const buffer = Buffer.alloc(recordSize)
      while (position < fileSize) {
        if ((position + recordSize) > fileSize) {
          let recordSize = fileSize - position
          this.logger.logDebug(`last recordSize=${recordSize}`)
        }
        fs.readSync(fd, buffer, 0, recordSize, position)
        count++
        position += recordSize
      }
      return count
    } catch (err) {
      this.logger.error(`Could not read world map: ${err.errno}`)
    }
  }
}
