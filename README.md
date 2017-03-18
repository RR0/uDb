# \*U* database reader

This is a [node](https://nodejs.org) application to binary data file of the now-defunct the [\*U* database](http://web.archive.org/web/20060701162044/http://www.larryhatch.net/).

## Setup

You need to have [node](https://nodejs.org) 7.6.0 or later installed on your computer.

## Usage

    node udb.js [<sources file>] [<data file>]

will look for `usources.txt` as a source file, and `U.RND` as a data file in the current directory.

## File structure

The data file is a sequence of 112-bytes records.

A part from the first (#0) and last records which are system ones, 
the structure of a record is:

-   0 (0x00) : Sighting year (1 signed word/2 bytes)
-   2 (0x02) : Location kind code (1 byte) (see locations table below)
-   3 (0x03) : Sighting month (1 byte)
-   4 (0x04) : Sighting day (1 byte)
-   5 (0x05) : Sighting hour (1 byte) encoded as:
  - hour: `value / 6`
  - minutes: remainder/modulo `value % 6` * 10 minutes
-   6 (0x06) : `3333` Flags (1 byte) encoded as 4 * 2 bits (each encoding a value between 0 and 3)
-   7 (0x07) : Sighting duration in minutes (1 byte)
-   8-17 : TODO (lat/long?)
-  18 (0x12) : Country code (1 byte) (see countries table below)
-  19 (0x13) Area code (3 chars)
-  23-30 : TODO (lat/long?)
- 109 (0x6d) Description (78 chars) as `:`-separated rows.
- 110 (0x6e) Source code (1 byte) (see `usources.txt` file) 
- 111 (0x6f) Position in source (1 byte)
- 112 (0x70) `X:Y` flags (1 byte), encoded as two hex chars (4 bits:4 bits)

### Location kinds

0. Metropolis
1. Residential
2. Town & city
3. Farmlands
4. Pasture
5. Oil & coal
6. Tundra
7. Desert
8. Mountains
9. Wetlands
10. Forest
11. Rainforest
12. Coastlands
13. Offshore
14. High seas
15. Islands
16. In-flight
17. Space
18. Military base
19. Unknown
20. Road + rails

### Countries

-   2 : USA
-  20 : Argentina
-  49 : Great Britain
-  51 : Germany
-  53 : France
-  54 : Spain
-  57 : Italy
-  83 : India
-  97 : Japan
- 163 : Irak
- 166 : Israël
- 170 : Lebanon
- 178 : Moon

## TODO

- See [issues](https://github.com/RR0/uDb/issues).
- Add non-regression tests.