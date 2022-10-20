import {Output} from "./RecordOutput"

export class OutputFactory {

  static async create(out?: string): Promise<Output<any>> {
    let output: Output<any> = process.stdout
    if (out) {
      if (out == "memory") {
        const {Memory} = await import("./Memory")
        output = new Memory()
      } else {
        const {FileOutput} = await import("./FileOutput")
        output = new FileOutput(out)
      }
    }
    return output
  }
}
