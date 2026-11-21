import { Database } from "./Database.js"
import { UdbDatabase, UdbDatabaseConfig } from "./udb/index.js"
import { NuforcDatabase, NuforcDatabaseConfig } from "./nuforc/index.js"
import { Logger } from "../../Logger.js"
import { FileUtil } from "../../FileUtil.js"
import path from "node:path"

/**
 * Command-line options that select a database.
 */
export interface DatabaseOptions {
  /**
   * The database file or URL.
   */
  source?: string
  /**
   * The *U* sources file.
   */
  sources?: string
  /**
   * The *U* world map file.
   */
  worldmap?: string
  count?: string
}

export class DatabaseFactory {

  static readonly UDB_DATA_FILE_DEFAULT = "../data/udb/input/U.RND"
  static readonly UDB_SOURCES_FILE_DEFAULT = "../data/udb/input/usources.txt"
  static readonly UDB_WORLD_MAP_FILE_DEFAULT = "../data/udb/input/WM.VCE"
  static readonly NUFORC_URL_DEFAULT = "http://www.nuforc.org/webreports"

  /**
   * @param name The database type ("udb" or "nuforc").
   * @param logger
   * @param options User-provided paths are relative to the current directory, defaults are relative to the package.
   */
  static create(name: string, logger: Logger, options: DatabaseOptions = {}): Database {
    const userPath = (p: string | undefined, defaultPath: string) => p ? path.resolve(p) : FileUtil.getPath(defaultPath)
    switch (name) {
      case "udb":
        const udbConfig: UdbDatabaseConfig = {
          sourcesFile: userPath(options.sources, DatabaseFactory.UDB_SOURCES_FILE_DEFAULT),
          dataFile: userPath(options.source, DatabaseFactory.UDB_DATA_FILE_DEFAULT),
          worldMap: userPath(options.worldmap, DatabaseFactory.UDB_WORLD_MAP_FILE_DEFAULT)
        }
        return new UdbDatabase(name, logger, udbConfig)
      case "nuforc":
        const config: NuforcDatabaseConfig = {
          baseUrl: options.source || DatabaseFactory.NUFORC_URL_DEFAULT,
          count: parseInt(options.count, 10)
        }
        return new NuforcDatabase(name, logger, config)
      default:
        throw new Error("Unsupported database name: " + name)
    }
  }
}
