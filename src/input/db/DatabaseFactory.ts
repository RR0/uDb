import {Database} from "./Database"
import {UdbDatabase} from "./udb/UdbDatabase"
import {NuforcDatabase} from "./nuforc/NuforcDatabase"
import {Logger} from "../../Logger"

export class DatabaseFactory {
  private static dbs = {
    "udb": UdbDatabase.prototype,
    "nuforc": NuforcDatabase.prototype
  }

  static create(name: string, logger: Logger, program: any): Database {
    let db = <Database>Object.create(DatabaseFactory.dbs[name])
    db.constructor.apply(db, [name, logger, program])
    return db;
  }
}
