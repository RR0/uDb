import {ReadInterface} from "../ReadInterface.js"

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

  /**
   * References whose index is an issue number.
   */
  static readonly ISSUE_REFS = [60, 146, 157, 159, 160, 186, 191, 193, 194, 205, 209, 226, 236, 239, 244]

  /**
   * References whose index is a case number.
   */
  static readonly CASE_REFS = [8, 187, 190]

  /**
   * Monthly periodicals whose index is (volume - 1) * 12 + issue, or (year - 1) * 12 + month for years >= 50.
   */
  static readonly VOLUME_ISSUE_REFS = [24, 95, 118, 195, 196, 200, 210, 220, 230]

  /**
   * References whose index is a year (2 digits).
   */
  static readonly YEAR_REFS = [147, 231, 232]

  /**
   * Loren Gross' "UFOs a history" volumes, whose index is book * 100 + page.
   */
  static readonly GROSS_REFS = [131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143]

  /**
   * Formats a reference index ("pinpoint") the way the *U* software displays it.
   *
   * The data doesn't tell if the 11-bits index is a page, an issue, a volume and issue, etc. :
   * this is hardcoded in *U* for each reference number, as reconstructed here from Isaac Koi's ASCII export.
   *
   * @param ref The reference number (0-255).
   * @param index The 11-bits reference index (0-2047).
   */
  static getPinpoint(ref: number, index: number): string {
    const split = (base: number) => index > 0 ? {major: Math.floor((index - 1) / base), minor: (index - 1) % base + 1} : {major: 0, minor: 0}
    if (Sources.ISSUE_REFS.includes(ref)) {
      return `Issue No. ${index}`
    }
    if (Sources.CASE_REFS.includes(ref)) {
      return `Case No. ${index}`
    }
    if (Sources.VOLUME_ISSUE_REFS.includes(ref)) {
      const {major, minor} = split(12)
      return major >= 50 ? `Year ${major} Month ${minor}` : `Volume ${major} Issue ${minor}`
    }
    if (Sources.YEAR_REFS.includes(ref)) {
      return `YEAR =${index}`
    }
    if (Sources.GROSS_REFS.includes(ref)) {
      if (index <= 100) {
        return ref === 140 || ref === 141 ? `Book #10 Page ${index}` : `Page No. ${index}`
      }
      const page = index % 100
      return `Book # ${Math.floor(index / 100)} Page ${page}${page === 99 ? "++" : ""}`  // 99++ = page 99 or more
    }
    switch (ref) {
      case 156:
        return `Supplement # ${index}`
      case 170: {
        const {major, minor} = split(100)
        return `Volume ${major} Issue # ${minor}`
      }
      case 229: {
        const {major, minor} = split(10)
        return `YEAR =${major} No.${minor}`
      }
      case 240: {
        const {major, minor} = split(52)
        return `Volume ${major} Issue # ${minor}`
      }
      default:
        return `Page No. ${index}`
    }
  }

  getReference(ref: number, refIndex: number): string {
    let reference: string
    switch (ref) {
      case 93:
        reference = this.newspapersAndFootnotes[refIndex]
        break
      case 96:
        reference = this.otherDatabasesAndWebsites[refIndex]
        break
      case 97:
        reference = this.otherPeriodicals[refIndex]
        break
      case 98:
        reference = this.misc[refIndex]
        break
      default:
        reference = `${this.primaryReferences[ref]}, ${Sources.getPinpoint(ref, refIndex)}`
    }
    return reference
  }
}
