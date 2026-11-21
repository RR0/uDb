# \*U* UFO database reader
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/RR0/uDb/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/RR0/uDb/tree/master)

This is a [node](https://nodejs.org) application to read binary data file of the [\*U* UFO database](http://web.archive.org/web/20060701162044/http://www.larryhatch.net/).

As this database software can only run on old MS-DOS platforms and its maintenance has been discontinued, 
it is important to allow users to access its data from modern platforms.

The binary format is [documented in the wiki](https://github.com/RR0/uDb/wiki/uDb-input).

## Demo

A simple [form is available online](https://rr0.org/udb) to query the database using uDb.

## Setup

1. Make sure to have [node](https://nodejs.org) 24 or later installed on your computer.
1. Install uDb: `npm install -g @rr0/udb`
1. Run the software: `udb --help`

## Usage

### Command Line Interface

    udb [options]
    
    Options:
      -V, --version                                                output the version number
      -d, --database <udb|nuforc>                                  Database to read (defaults to udb).
      --source <file|url>                                          Database source. Defaults to ../data/udb/input/U.RND for udb, http://www.nuforc.org/webreports for nuforc.
      -s, --sources <sourcesFile>                                  Sources file to read. Defaults to ../data/udb/input/usources.txt
      -w, --worldmap <wmFile>                                      World map file to read. Defaults to ../data/udb/input/WM.VCE
      -c, --count <maxCount>                                       Maximum number of records to output.
      -m, --match <field=value>[&field=value...][|field=value...]  Output records that match the criteria.
      -f, --format <default|csv|xml>[?params]                      Format of the output. default params are latLng=dms|dd, csv params are separator
      -o, --out <outputFile|memory>                                Name of the file to output. "memory" will enter interactive mode.
      -v, --verbose                                                Displays detailed processing information.
      --debug                                                      Displays debug info.
      -h, --help                                                   display help for command

Default files are relative to the installed package, which includes the *U* data files.
Files you provide are relative to the current directory.

From a clone of this repository, run `npm run build` first, then `npm run cli -- [options]`.

### Examples

#### Human-readable output in console

    udb -c 3

will display the 3 first decoded records in the default format:


    Record #1
    	Title		: EZEKIEL
    	Date		: -593
    	Location	:
    		Pasture, CHALDEA (Chaldea, Iraq, Middle East), 31º00'00" N 46º10'00" E
    		Elevation 200 m
    		Observer: Map, Ground, Civilian
    	Description :
    		FIERY SPHERE LANDS/4 SUPPORTS
    		TAKEN FOR A RIDE
    		see Bible acct.
    	Miscellaneous details and features				: Oddity
    	Type of UFO / Craft							: Fireball
    	Aliens! Monsters! (no religious figures)	: Pseudo-Human, Monster
    	Apparent UFO/Occupant activities			: Missing time
    	Places visited and things affected			: Human affected, Apparent Landing
    	Evidence and special effects				: Historical
    	Duration									: 60 min
    	Strangeness									: 8
    	Credibility									: 4
    	Reference									: VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., Page No. 2


    Record #2
    	Title		: SIEGE/ALEXANDER the GREAT
    	Date		: -322
    	Location	:
    		Military base, TYRE =SUR,LEBANON (Tyre, Lebanon, Middle East), 33º16'00" N 35º13'00" E
    		Elevation 20 m, relative altitude 100 m
    		Observer: Map, Ground, Coast, Military, High quality observer(s)
    	Description :
    		FLYING SHIELD BEAMS↓
    		WALLS CRUMBLE
    	Type of UFO / Craft							: Saucer, Delta
    	Aliens! Monsters! (no religious figures)	: No occupant
    	Apparent UFO/Occupant activities			: Observation, Ray
    	Places visited and things affected			: Animals affected, Human affected, Building or ANY MANMADE STRUCTURE
    	Evidence and special effects				: Traces, Historical
    	Duration									: 3 min
    	Strangeness									: 9
    	Credibility									: 6
    	Reference									: MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly., Issue No. 320


    Record #3
    	Title		: 'ALTAR' IN SKY
    	Date		: -213
    	Location	:
    		Pasture, HADRIA,ROMAN EMP (Firenze, Italy, Western Europe), 43º59'00" N 11º15'40" E
    		Observer: Map, Ground
    	Description :
    		MAN IN WHITE
    		12 SUCH BETWEEN 222 AND 90 B.C.
    	Miscellaneous details and features				: Oddity, Wave
    	Type of UFO / Craft							: Cigar, Delta
    	Aliens! Monsters! (no religious figures)	: Pseudo-Human
    	Evidence and special effects				: Historical
    	Duration									: 15 min
    	Strangeness									: 8
    	Credibility									: 4
    	Reference									: VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., Page No. 4

#### CSV output in a file

If you want to output in a [CSV format](https://en.wikipedia.org/wiki/Comma-separated_values) and save the result into a file that could be imported in some spreadsheet software (Microsoft Excel, Google Spreadsheets, Apple Numbers, etc.):

    udb -f csv --out export.csv --count 3

will create/overwrite an `export.csv` file with the following contents, where the first row list columns names, and each column is separated by a comma:

    "id","year","month","day","time","location","stateOrProvince","title","description","locale","duration","longitude","latitude","elevation","relativeAltitude","locationFlags","miscellaneousFlags","typeOfUfoCraftFlags","aliensMonstersFlags","apparentUfoOccupantActivitiesFlags","placesVisitedAndThingsAffectedFlags","evidenceAndSpecialEffectsFlags","miscellaneousDetailsFlags","ref","strangeness","credibility","continent","country"
    1,-593,"","","","CHALDEA","Chaldea","EZEKIEL","FIERY SPHERE LANDS/4 SUPPORTS
    TAKEN FOR A RIDE
    see Bible acct.","Pasture",60,46.166667,31,200,0,"Map, Ground, Civilian","Oddity","Fireball","Pseudo-Human, Monster","Missing time","Human affected, Apparent Landing","Historical","","VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., Page No. 2",8,4,"Middle East","Iraq"
    2,-322,"","","","TYRE =SUR,LEBANON","Tyre","SIEGE/ALEXANDER the GREAT","FLYING SHIELD BEAMS↓
    WALLS CRUMBLE","Military base",3,35.216667,33.266667,20,100,"Map, Ground, Coast, Military, High quality observer(s)","","Saucer, Delta","No occupant","Observation, Ray","Animals affected, Human affected, Building or ANY MANMADE STRUCTURE","Traces, Historical","","MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly., Issue No. 320",9,6,"Middle East","Lebanon"
    3,-213,"","","","HADRIA,ROMAN EMP","Firenze","'ALTAR' IN SKY","MAN IN WHITE
    12 SUCH BETWEEN 222 AND 90 B.C.","Pasture",15,11.261111,43.983333,"","","Map, Ground","Oddity, Wave","Cigar, Delta","Pseudo-Human","","","Historical","","VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., Page No. 4",8,4,"Western Europe","Italy"

Note that texts are enclosed in double quotes to preserve line feeds in a cell.

The whole database is available as [CSV](data/udb/output/u.csv) and [XML](data/udb/output/u.xml) files.

#### XML output in a file

If you want to output in a [XML format](https://fr.wikipedia.org/wiki/Extensible_Markup_Language) and save the result into a file:

    udb -f xml --out export.xml --count 3

will create/overwrite an `export.xml` file with the following contents:

    <?xml version="1.0" encoding="UTF-8"?>
    <udb>
    <record><id>1</id><year>-593</year><month/><day/><time/><location>CHALDEA</location><stateOrProvince>Chaldea</stateOrProvince><title>EZEKIEL</title><description>FIERY SPHERE LANDS/4 SUPPORTS
    TAKEN FOR A RIDE
    see Bible acct.</description><locale>Pasture</locale><duration>60</duration><longitude>46.166667</longitude><latitude>31</latitude><elevation>200</elevation><relativeAltitude>0</relativeAltitude><locationFlags>Map, Ground, Civilian</locationFlags><miscellaneousFlags>Oddity</miscellaneousFlags><typeOfUfoCraftFlags>Fireball</typeOfUfoCraftFlags><aliensMonstersFlags>Pseudo-Human, Monster</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags>Missing time</apparentUfoOccupantActivitiesFlags><placesVisitedAndThingsAffectedFlags>Human affected, Apparent Landing</placesVisitedAndThingsAffectedFlags><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><ref>VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 &amp; Ballentine PB 1974 294pp., Page No. 2</ref><strangeness>8</strangeness><credibility>4</credibility><continent>Middle East</continent><country>Iraq</country></record>
    <record><id>2</id><year>-322</year><month/><day/><time/><location>TYRE =SUR,LEBANON</location><stateOrProvince>Tyre</stateOrProvince><title>SIEGE/ALEXANDER the GREAT</title><description>FLYING SHIELD BEAMS↓
    WALLS CRUMBLE</description><locale>Military base</locale><duration>3</duration><longitude>35.216667</longitude><latitude>33.266667</latitude><elevation>20</elevation><relativeAltitude>100</relativeAltitude><locationFlags>Map, Ground, Coast, Military, High quality observer(s)</locationFlags><miscellaneousFlags/><typeOfUfoCraftFlags>Saucer, Delta</typeOfUfoCraftFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags>Observation, Ray</apparentUfoOccupantActivitiesFlags><placesVisitedAndThingsAffectedFlags>Animals affected, Human affected, Building or ANY MANMADE STRUCTURE</placesVisitedAndThingsAffectedFlags><evidenceAndSpecialEffectsFlags>Traces, Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><ref>MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly., Issue No. 320</ref><strangeness>9</strangeness><credibility>6</credibility><continent>Middle East</continent><country>Lebanon</country></record>
    <record><id>3</id><year>-213</year><month/><day/><time/><location>HADRIA,ROMAN EMP</location><stateOrProvince>Firenze</stateOrProvince><title>'ALTAR' IN SKY</title><description>MAN IN WHITE
    12 SUCH BETWEEN 222 AND 90 B.C.</description><locale>Pasture</locale><duration>15</duration><longitude>11.261111</longitude><latitude>43.983333</latitude><elevation/><relativeAltitude/><locationFlags>Map, Ground</locationFlags><miscellaneousFlags>Oddity, Wave</miscellaneousFlags><typeOfUfoCraftFlags>Cigar, Delta</typeOfUfoCraftFlags><aliensMonstersFlags>Pseudo-Human</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><ref>VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 &amp; Ballentine PB 1974 294pp., Page No. 4</ref><strangeness>8</strangeness><credibility>4</credibility><continent>Western Europe</continent><country>Italy</country></record>
    </udb>
    
For details about input/output formats, please check the [uDb Wiki](https://github.com/RR0/uDb/wiki).
    
#### Records that match some criteria

    udb --match "year=1972&month=8&day=12"

will output records about cases that occurred on August 12th, 1972.

    udb --match "id=256|id=12"

will output records #12 and #256.

You can use any [UdbInputRecord](https://github.com/RR0/uDb/blob/master/src/input/db/udb/UdbInputRecord.ts) property in a matching criteria.

## Web integration

For convenience, a [WebUdb](https://github.com/RR0/uDb/blob/master/src/web/WebUdb.ts) instance is provided to fetch data from a browser.
See an [example integration](https://github.com/RR0/rr0.org/tree/master/udb) into the [RR0.org](https://rr0.org/udb/index.html) 

## To do

See [opened issues](https://github.com/RR0/uDb/issues).

## Acknowledgments

First I would like to thank Larry Hatch for his invaluable work in building this huge quality database.

Also I would like to thank several contributors (_nablator_, _harpsounds_, _EvillerBob_) of the Above Top Secret thread
"[Huge UFO Database in DOS - Someone's labour of love, can it be saved?](https://web.archive.org/web/2019/http://www.abovetopsecret.com/forum/thread585935/pg1)"
([original URL](http://www.abovetopsecret.com/forum/thread585935/pg1)) where the binary format was reverse-engineered in 2017.
Notably, they helped 
[localizing the latitude/longitude bytes](https://web.archive.org/web/2019/http://www.abovetopsecret.com/forum/thread585935/pg8)
and corrected some wrong interpretations I made. The mysteries that remained at the end of the thread have been solved since,
using Isaac Koi's ASCII export as a reference (see the [wiki history](https://github.com/RR0/uDb/wiki/History)).
Thanks also goes to [Adam](http://www.insidetruth.net) who notified a longitude inversion error.

Last but not least, I want to thank [Isaac Koi](http://www.isaackoi.com) for his restless efforts in collecting and sharing UFO data with the permission of their owners.
This work could not have been possible without him, who managed to run the old software, perform an textual export of the data, 
and got the permission from Larry's nephew (the holder of Larry's Power of Attorney) to share Larry's work.

Since then, this project has been credited by Adam Kehoe's paper "[Analyzing The Nearly Lost Hatch Database: 18,123
 case files](https://blog.adamkehoe.com/hatch-udatabase)".

## Errata

Please note that some data from this database are incorrect:

* The Jaboticatubas case year is [1976](https://rr0.org/time/1/9/7/6/08/), not 1968. 
  This is particularly to note important to note, as Hatch ranked this case highly in both credibility and
   strangeness. 
* The "Pinheiro" case ([Colares sightings](https://rr0.org/science/crypto/ufo/enquete/dossier/Colares/)) month is July
 (7) 1977, not March (3). This is particularly to note important to note, as Hatch ranked this case highly in both credibility and
   strangeness. 
