# \*U* UFO database reader

This is a [node](https://nodejs.org) application to read binary data file of the [\*U* UFO database](http://web.archive.org/web/20060701162044/http://www.larryhatch.net/).

As this database software can only run on old MS-DOS platforms and its maintenance has been discontinued, 
it is important to allow users to access its data from modern platforms.

## Setup

You need to have [node](https://nodejs.org) 7.6.0 or later installed on your computer.

## Usage

    node udb.js [<sources file>] [<data file>]

If no files are specified, it will look for `usources.txt` as a source file, and `U.RND` as a data file in the current directory.

This will display the decoded records, like below (just 10 first records listed here):

    Reading world map:
    Read 12127 WM records.

    Reading sources:
    - 253 primary references
    - 43 newspapers and footnotes
    - 67 newspapers and footnotes
    - 40 other periodicals
    - 63 misc. books, reports, files & correspondance
    - 93 discredited reports
    
    Reading cases:
    
    Record #1
      Title       : EZEKIEL
      Date        : -593/?/?, ?
      Location    : Pasture, CHALDEA (CHL, Irak), 46º10'00" E 31º00'00" N
                    Elevation 200 m
      Description : FIERY SPHERE LANDS/4 SUPPORTS
                    TAKEN FOR A RIDE
                    see Bible acct.
      Duration    : 60 min
      Strangeness : 8
      Credibility : 4
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #2
    
    Record #2
      Title       : SIEGE/ALEXANDER the GREAT
      Date        : -322/?/?, ?
      Location    : Military base, TYRE =SUR,LEBANON (TYR, Lebanon), 35º13'20" E 33º16'00" N
                    Elevation 20 m, relative altitude 100 m
      Description : FLYING SHIELD BEAMS
                    WALLS CRUMBLE
      Duration    : 3 min
      Strangeness : 9
      Credibility : 6
      Reference   : MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly.
                    at index #64
    
    Record #3
      Title       : 'ALTAR' IN SKY
      Date        : -213/?/?, 
      Location    : Pasture, HADRIA,ROMAN EMP (FI., Italy), 11º16'00" E 43º58'40" N
                    12 SUCH BETWEEN 222 AND 90 B.C.
      Duration    : 15 min
      Strangeness : 8
      Credibility : 4
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #4
    
    Record #4
      Title       : SPECTACULAR FLEET OF SHIPS IN AIR
      Date        : -170/?/?, ?
      Location    : Road + rails, LANUPIUM = ALBANO LAZIALE,ITL (RM., Italy), 12º38'40" E 41º44'00" N
                    Elevation 384 m
      Description : NFD
      Duration    : 2 min
      Strangeness : 6
      Credibility : 6
      Reference   : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA
                    at index #125
    
    Record #5
      Title       : MANY OBS
      Date        : 70/05/21, ~18:00
      Location    : Pasture, PALESTINE (UNK, Israël), 35º14'00" E 31º46'00" N
                    LOUD NOISES LATER
      Duration    : 60 min
      Strangeness : 7
      Credibility : 4
      Reference   : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA
                    at index #120
    
    Record #6
      Title       : MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'
      Date        : 840/?/?, 
      Location    : Town & city, LYON,FRANCE (RHN, France), 4º52'00" E 45º44'40" N
      Duration    : 20 min
      Strangeness : 10
      Credibility : 4
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #7
    
    Record #7
      Title       : 'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD
      Date        : 927/~03/?, 
      Location    : Town & city, VERDUN,FR (MSE, France), 5º21'20" E 49º08'40" N
      Duration    : 15 min
      Strangeness : 3
      Credibility : 7
      Reference   : FIGEUT,Michel & RUCHON,Jean-Louis: OVNI- Le Premier    Dossier..; Alain LeFeuvre,Paris 1979.
                    at index #32
    
    Record #8
      Title       : UNUSUALLY BRIGHT SCRS FLY
      Date        : 989/08/03, 
      Location    : Mountains, JAPAN/LOC UNK (HNS, Japan), 139º50'00" E 35º40'00" N
                    TIME UNKNOWN.   
      Duration    : 15 min
      Strangeness : 6
      Credibility : 5
      Reference   : VALLEE,Jacques: PASSPORT TO MAGONIA; H.Regnery,Chicago HC 1969 & Contemporary Books,Chicago 1993. 372pp.
                    at index #0
    
    Record #9
      Title       : 2 SPHERES HVR
      Date        : 1015/08/23, ?
      Location    : Mountains, JAPAN/LOC UNK (HNS, Japan), 139º48'00" E 35º38'00" N
                    NFD
                    /SOBEPS IFS#23 p35
      Duration    : 15 min
      Strangeness : 4
      Credibility : 6
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #9
    
    Record #10
      Title       : FIERY OVOID >>SE TURNS >>W
      Date        : 1034/?/?, ?
      Location    : Farmlands, nr VERDUN,FR (MSE, France), 5º20'00" E 49º04'40" N
      Duration    : 15 min
      Strangeness : 6
      Credibility : 6
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #9
    
    Read 10 reports.

## File structure

The data file is a sequence of 112-bytes records.

A part from the first (#0) and last records which are system ones, 
the structure of a record is:

-   0 (0x00) : Sighting year (1 signed word)
-   2 (0x02) : Locale code (1 byte) (see locales table below)
-   3 (0x03) : ? (4 higher bits) 
-   3 (0x03) : Sighting month (4 lower bits to encode up to 12)
-   4 (0x04) : Sighting day (1 byte)
-   5 (0x05) : Sighting hour (1 byte) encoded as:
    - hour: `value / 6`
    - minutes: remainder/modulo `value % 6` * 10 minutes
-   6 (0x06) : Year, Month, Day and Time (YMDT) accuracies (1 byte) encoded as 4 * 2 bits each encoding an accuracy level as:
    - 0 : DOES NOT APPLY/irrelevant (so not displayed).
    - 1 : Unknown/unspecified (displayed `?`).    
    - 2 : Approximative (displayed `~`): within 1 or 2 Years or Months; within 3-4 Days, Hours.    
    - 3 : Known: Exact year, month, day: Time within one hour.
-   7 (0x07) : Sighting duration in minutes (1 byte)
-   8 (0x08) : ?
-   9 : Longitude (15 lower bits of signed word / 1.11111)
-  11 : Latitude (15 lower bits of signed word / 1.11111) 
-  13 (0x  ) : Elevation (1 signed word) in meters (-99 if N/A)
-  15 (0x  ) : Relative altitude (1 signed word) in meters (999 if N/A)
-  17 (0x  ) : ?
-  18 (0x12) : Country code (1 byte) (see countries table below)
-  19 (0x13) Area code (3 chars)
-  23-30 : ?
- 109 (0x6d) Description (78 chars) as `:`-separated rows.
- 110 (0x6e) Source code (1 byte) (see `usources.txt` file) 
- 111 (0x6f) Position in source (1 byte) but [not complete](https://github.com/RR0/uDb/issues/3)
- 112 (0x70) `X:Y` flags (1 byte), encoded as two hex chars (4 bits:4 bits)

### Locales

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

- See [opened issues](https://github.com/RR0/uDb/issues).
- Add non-regression tests.

## Acknowdlegments

First I would like to thank Larry Hatch for his invaluable work in building this huge quality database.

Also I would like to thank _EvillerBob_ for his own work on decoding the database. 
Notably he helped me [localizing the latitude/longitude bytes](http://www.abovetopsecret.com/forum/thread585935/pg8#pid22029387) and corrected some wrong interpretations I made.

Last but not least, I want to thank [Isaac Koi](http://www.isaackoi.com) for his restless efforts in collecting and sharing UFO data with the permission of their owners.
This work could not have been possible without him, who managed to run the old software, perform an textual export of the data, 
and got the permission from Larry's nephew (the holder of Larry's Power of Attorney) to share Larry's work.
 