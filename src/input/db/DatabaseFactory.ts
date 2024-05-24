import { Database } from "./Database"
import { UdbDatabase, UdbDatabaseConfig } from "./udb"
import { NuforcDatabase, NuforcDatabaseConfig } from "./nuforc"
import { Logger } from "../../Logger"
import { FileUtil } from "../../FileUtil"

export class DatabaseFactory {

  static readonly UDB_DATA_FILE_DEFAULT = "../data/udb/input/U.RND"

  static create(name: string, logger: Logger, program: any): Database {
    switch (name) {
      case "udb":
        const udbConfig: UdbDatabaseConfig = {
          sourcesFile: FileUtil.getPath(program.sourcesFile || "../data/udb/input/usources.txt"),
          dataFile: FileUtil.getPath(program.source || DatabaseFactory.UDB_DATA_FILE_DEFAULT),
          worldMap: FileUtil.getPath(program.wmFile || "../data/udb/input/WM.VCE")
        }
        return new UdbDatabase(name, logger, udbConfig)
      case "nuforc":
        const config: NuforcDatabaseConfig = {
          baseUrl: FileUtil.getPath(program.source || "http://www.nuforc.org/webreports"),
          count: parseInt(program.count, 10)
        }
        return new NuforcDatabase(name, logger, config)
      default:
        throw new Error("Unsupported database name: " + name)
    }
  }
}
