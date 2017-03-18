# \*U* database reader

This is a [node](https://nodejs.org) application to binary data file of the now-defunct the [\*U* UFO database](http://web.archive.org/web/20060701162044/http://www.larryhatch.net/).

## Setup

You need to have [node](https://nodejs.org) 7.6.0 or later installed on your computer.

## Usage

    node udb.js [<sources file>] [<data file>]

If no files are specified, it will look for `usources.txt` as a source file, and `U.RND` as a data file in the current directory.

This will display the decoded records, like below (just 10 first records listed here):

    Reading sources:
    - 253 primary references
    - 43 newspapers and footnotes
    - 67 newspapers and footnotes
    - 40 other periodicals
    - 63 misc. books, reports, files & correspondance
    - 93 discredited reports
    
    Reading cases:
    
    Record #1
    - Title       : EZEKIEL
      Date        : -593/01/01 00:10
      Location    : Pasture, CHALDEA (CHL, Irak)
      Description : FIERY SPHERE LANDS/4 SUPPORTS
                    TAKEN FOR A RIDE
                    see Bible acct.
      Duration    : 60 mn
      Flags       : 3111
      Other flags : 8:4
      Source      : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #2
    
    Record #2
    - Title       : SIEGE/ALEXANDER the GREAT
      Date        : -322/01/-- 00:00
      Location    : Military base, TYRE =SUR,LEBANON (TYR, Lebanon)
      Description : FLYING SHIELD BEAMS
                    WALLS CRUMBLE
      Duration    : 3 mn
      Flags       : 3111
      Other flags : 9:6
      Source      : MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly.
                    at index #64
    
    Record #3
    - Title       : 'ALTAR' IN SKY
      Date        : -213/06/01 00:00
      Location    : Pasture, HADRIA,ROMAN EMP (FI., Italy)
      Description : MAN IN WHITE
                    12 SUCH BETWEEN 222 AND 90 B.C.
      Duration    : 15 mn
      Flags       : 3110
      Other flags : 8:4
      Source      : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #4
    
    Record #4
    - Title       : SPECTACULAR FLEET OF SHIPS IN AIR
      Date        : -170/01/00 12:00
      Location    : Road + rails, LANUPIUM = ALBANO LAZIALE,ITL (RM., Italy)
      Description : NFD
      Duration    : 2 mn
      Flags       : 3111
      Other flags : 6:6
      Source      : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA
                    at index #125
    
    Record #5
    - Title       : MANY OBS
      Date        : 70/05/21 18:00
      Location    : Pasture, PALESTINE (UNK, Israël)
      Description : CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
                    LOUD NOISES LATER
      Duration    : 60 mn
      Flags       : 3332
      Other flags : 7:4
      Source      : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA
                    at index #120
    
    Record #6
    - Title       : MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'
      Date        : 840/01/00 00:00
      Location    : Town & city, LYON,FRANCE (RHN, France)
      Description : they admitted flying
      Duration    : 20 mn
      Flags       : 3110
      Other flags : a:4
      Source      : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #7
    
    Record #7
    - Title       : 'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD
      Date        : 927/03/00 07:00
      Location    : Town & city, VERDUN,FR (MSE, France)
      Description : 
      Duration    : 15 mn
      Flags       : 3210
      Other flags : 3:7
      Source      : FIGEUT,Michel & RUCHON,Jean-Louis: OVNI- Le Premier    Dossier..; Alain LeFeuvre,Paris 1979.
                    at index #32
    
    Record #8
    - Title       : UNUSUALLY BRIGHT SCRS FLY
      Date        : 989/08/03 00:00
      Location    : Mountains, JAPAN/LOC UNK (HNS, Japan)
      Description : THEN JOIN TOGETHER
                    TIME UNKNOWN.   
      Duration    : 15 mn
      Flags       : 3330
      Other flags : 6:5
      Source      : VALLEE,Jacques: PASSPORT TO MAGONIA; H.Regnery,Chicago HC 1969 & Contemporary Books,Chicago 1993. 372pp.
                    at index #0
    
    Record #9
    - Title       : 2 SPHERES HVR
      Date        : 1015/08/23 00:00
      Location    : Mountains, JAPAN/LOC UNK (HNS, Japan)
      Description : 2 SML OBJs EXIT..1 smokes
                    NFD
                    /SOBEPS IFS#23 p35
      Duration    : 15 mn
      Flags       : 3331
      Other flags : 4:6
      Source      : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #9
    
    Record #10
    - Title       : FIERY OVOID >>SE TURNS >>W
      Date        : 1034/01/00 00:00
      Location    : Farmlands, nr VERDUN,FR (MSE, France)
      Description : /VERDUN MUSEUM /SOBEPS IFS#23 p35
      Duration    : 15 mn
      Flags       : 3111
      Other flags : 6:6
      Source      : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #9
    
    Read 10 reports.

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
-   8-17 : TODO ([lat/long](https://github.com/RR0/uDb/issues/2)?)
-  18 (0x12) : Country code (1 byte) (see countries table below)
-  19 (0x13) Area code (3 chars)
-  23-30 : TODO ([lat/long](https://github.com/RR0/uDb/issues/2)?)
- 109 (0x6d) Description (78 chars) as `:`-separated rows.
- 110 (0x6e) Source code (1 byte) (see `usources.txt` file) 
- 111 (0x6f) Position in source (1 byte) but [not complete](https://github.com/RR0/uDb/issues/3)
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

Still [to be completed](https://github.com/RR0/uDb/issues/1):

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