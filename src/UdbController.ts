import {Logger} from "./Logger"
import {UdbService} from "./UdbService"
import {UdbRecord} from "./input/db/UdbRecord"

export class UdbController {

  private logs = "Loading..."

  constructor(private udbService: UdbService, readonly logger: Logger, dir = "./") {
    udbService.load(dir + "usources.txt", dir + "U.RND").then(() => logger.log("loaded"))
  }

  timeLink(year) {
    const millennium = Math.floor(year / 1000)
    const centuries = year % 1000
    const century = Math.floor(centuries / 100)
    const decades = centuries % 100
    const decade = Math.floor(decades / 10)
    const y = decades % 10
    return `/time/${millennium}/${century}/${decade}/${y}`
  }

  async search(matchCriteria: string): Promise<UdbRecord[]> {
    const memory = await this.udbService.match(matchCriteria)
    return memory.records
  }
}
