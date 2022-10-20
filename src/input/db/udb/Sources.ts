import {ReadInterface} from "../ReadInterface"

export class Sources {
  primaryReferences = {}
  newspapersAndFootnotes = {}
  otherDatabasesAndWebsites = {}
  otherPeriodicals = {}
  misc = {}
  discredited = []

  addDiscredited(line: string) {
    this.discredited.push(line.substring(2))
  }

  addSource(arr, line: string) {
    const ref = parseInt(line.substring(1, 4), 0)
    arr[ref] = line.substring(5)
  }

  open(sourcesReader: ReadInterface): Promise<void> {
    return new Promise((resolve, reject) => {
      sourcesReader
        .on("line", line => {
          switch (line.charAt(0)) {
            case "/":
              this.addSource(this.primaryReferences, line)
              break
            case "$":
              this.addSource(this.newspapersAndFootnotes, line)
              break
            case "+":
              this.addSource(this.otherDatabasesAndWebsites, line)
              break
            case "%":
              this.addSource(this.otherPeriodicals, line)
              break
            case "#":
              this.addSource(this.misc, line)
              break
            case "!":
              this.addDiscredited(line)
              break
          }
        })
        .on("close", resolve)
        .on("error", err => reject(err))
    })
  }

  getReference(ref: number, refIndex: number): string {
    let reference: string
    switch (ref) {
      case 93:
        reference = this.newspapersAndFootnotes[refIndex]
        break
      case 96:
        reference = this.otherDatabasesAndWebsites[refIndex]
        break;
      case 97:
        reference = this.otherPeriodicals[refIndex];
        break;
      case 98:
        reference = this.misc[refIndex];
        break;
      default:
        reference = `${this.primaryReferences[ref]}, page n°${refIndex}`;
    }
    return reference;
  }
}

