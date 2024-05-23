import * as readline from "readline"
import { Logger } from "./Logger"
import { Format, Query } from "./Query"
import { Memory, Output, OutputFactory } from "./output"

export class Interactive {
  private firstIndex: number = 1
  private maxCount: number = 1000000
  private output: Output<any>

  constructor(private memory: Memory, private logger: Logger) {
    OutputFactory.create().then(output => {
      this.output = output
    })
  }

  match(matchCriteria) {
    new Query(this.memory, this.output, this.logger, null, Format.default)
      .execute(matchCriteria, this.firstIndex, this.maxCount, false)
  }

  start() {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout})
    rl.setPrompt("udb> ")
    rl.prompt()

    rl.on("line", (line) => {
      let s = line.trim()
      let commandEnd = s.indexOf(" ")
      const command = line.substring(0, commandEnd < 0 ? s.length : commandEnd)
      switch (command) {
        case "exit":
          rl.close();
          (<any>process.stdin).destroy()
          return
        case "match":
          let params = s.substring(commandEnd + 1)
          this.match(params)
          break
        default:
          console.log(`Unknown command '${command}'.
Possible commands are:
- match <field=value>[&field=value][|field=value]
- exit`)
          break
      }
      rl.prompt()
    }).on("close", () => {
      this.logger.logVerbose("Exiting")
      rl.close()
    })
  }
}
