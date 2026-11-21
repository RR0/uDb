import {Output} from "./RecordOutput.js"

export class OutputFactory {

  static async create(out?: string): Promise<Output<any>> {
    let output: Output<any> = process.stdout
    if (out) {
      if (out == "memory") {
        const {Memory} = await import("./Memory.js")
        output = new Memory()
      } else {
        const {FileOutput} = await import("./FileOutput.js")
        output = new FileOutput(out)
      }
    }
    return output
  }
}
