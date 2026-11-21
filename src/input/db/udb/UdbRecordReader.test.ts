import {describe, expect, it} from "vitest"
import {readFileSync} from "node:fs"
import {UdbRecordReader} from "./UdbRecordReader.js"
import {UdbInputRecord} from "./UdbInputRecord.js"
import {Sources} from "./Sources.js"
import {Geo} from "../../../output/db/udb/geo.js"
import {BinaryRecordReader} from "../BinaryRecordReader.js"

const RECORD_SIZE = 112
const data = readFileSync(new URL("../../../../data/udb/input/U.RND", import.meta.url))
const logger: any = {logDebug() {}, logVerbose() {}}

/**
 * Expected values come from Isaac Koi's ASCII export of the original *U* software (data/udb/output/u.ascii).
 */
function read(id: number): UdbInputRecord {
  const buffer = data.subarray(id * RECORD_SIZE, (id + 1) * RECORD_SIZE)
  return new UdbRecordReader(buffer, logger).read(id * RECORD_SIZE, id)
}

describe("UdbRecordReader", () => {

  it("reads coordinates with a 20 seconds resolution", () => {
    const r1 = read(1)  // 46:10:00 E 31:00:00 N
    expect(Geo.ddToDms(r1.latitude, r1.longitude)).toBe(`31º00'00" N 46º10'00" E`)
    const r3 = read(3)  // 11:15:40 E 43:59:00 N
    expect(Geo.ddToDms(r3.latitude, r3.longitude)).toBe(`43º59'00" N 11º15'40" E`)
    const r12 = read(12)  // 0:27:00 W 51:53:00 N
    expect(Geo.ddToDms(r12.latitude, r12.longitude)).toBe(`51º53'00" N 0º27'00" W`)
  })

  it("reads the terrain as a whole byte", () => {
    expect(Geo.getLocale(read(2))).toBe("Military base")
    expect(Geo.getLocale(read(4))).toBe("Road + rails")
    expect(Geo.getLocale(read(40))).toBe("Space")
  })

  it("reads the duration on 2 bytes", () => {
    expect(read(4472).duration).toBe(1080)
    expect(read(4846).duration).toBe(1440)
    expect(read(1).duration).toBe(60)
  })

  it("reads the 11-bits reference index", () => {
    const r2 = read(2)
    expect(r2.ref).toBe(160)
    expect(r2.refIndex).toBe(320)
    expect(Sources.getPinpoint(r2.ref, r2.refIndex)).toBe("Issue No. 320")
  })

  it("decodes text as code page 437", () => {
    expect(read(64).description).toContain("FBL BOUNCES ↑+↓")
    expect(read(67).title + read(67).description).toContain("°")
  })
})

describe("Sources.getPinpoint", () => {

  it("formats per reference", () => {
    expect(Sources.getPinpoint(2, 4)).toBe("Page No. 4")
    expect(Sources.getPinpoint(8, 0)).toBe("Case No. 0")
    expect(Sources.getPinpoint(210, 346)).toBe("Volume 28 Issue 10")
    expect(Sources.getPinpoint(210, 681)).toBe("Year 56 Month 9")
    expect(Sources.getPinpoint(24, 60)).toBe("Volume 4 Issue 12")
    expect(Sources.getPinpoint(24, 939)).toBe("Year 78 Month 3")
    expect(Sources.getPinpoint(240, 120)).toBe("Volume 2 Issue # 16")
    expect(Sources.getPinpoint(170, 936)).toBe("Volume 9 Issue # 36")
    expect(Sources.getPinpoint(229, 821)).toBe("YEAR =82 No.1")
    expect(Sources.getPinpoint(231, 77)).toBe("YEAR =77")
    expect(Sources.getPinpoint(156, 3)).toBe("Supplement # 3")
    expect(Sources.getPinpoint(136, 140)).toBe("Book # 1 Page 40")
    expect(Sources.getPinpoint(136, 85)).toBe("Page No. 85")
    expect(Sources.getPinpoint(136, 999)).toBe("Book # 9 Page 99++")
    expect(Sources.getPinpoint(140, 64)).toBe("Book #10 Page 64")
  })
})

describe("BinaryRecordReader.cp437Char", () => {
  it("decodes MS-DOS characters", () => {
    expect(BinaryRecordReader.cp437Char(0x18)).toBe("↑")
    expect(BinaryRecordReader.cp437Char(0x19)).toBe("↓")
    expect(BinaryRecordReader.cp437Char(0xF8)).toBe("°")
    expect(BinaryRecordReader.cp437Char(0x82)).toBe("é")
    expect(BinaryRecordReader.cp437Char(0x41)).toBe("A")
  })
})
