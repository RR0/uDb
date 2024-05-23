import { Database } from "./Database"
import { UdbDatabase } from "./udb"
import { NuforcDatabase } from "./nuforc"
import { Logger } from "../../Logger"

export class DatabaseFactory {

  static create(name: string, logger: Logger, program: any): Database {
    switch (name) {
      case "udb":
        return new UdbDatabase(name, logger, program)
      case "nuforc":
        return new NuforcDatabase(name, logger, program)
      default:
        throw new Error("Unsupported database name: " + name)
    }
  }
}
