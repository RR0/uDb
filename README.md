# \*U* UFO database reader
[![Maintainability](https://api.codeclimate.com/v1/badges/d48d9f57750c19176c54/maintainability)](https://codeclimate.com/github/RR0/uDb/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d48d9f57750c19176c54/test_coverage)](https://codeclimate.com/github/RR0/uDb/test_coverage)

This is a [node](https://nodejs.org) application to read binary data file of the [\*U* UFO database](http://web.archive.orsg/web/20060701162044/http://www.larryhatch.net/).

As this database software can only run on old MS-DOS platforms and its maintenance has been discontinued, 
it is important to allow users to access its data from modern platforms.

## Demo

A simple [form is available online](http://rr0.org/udb) to query the database using uDb.

## Setup

1. Install [node](https://nodejs.org) 7.6.0 or later on your computer.
1. Install the dependencies: `npm install`
1. Install node typings: `node node_modules/typings/dist/bin.js install dt~node --global --save-dev`
1. Build the software: `npm run build`
1. Run the software: `npm run run`

## Usage

### Command Line Interface

    npm run cli -- [options]
    
    Options:
    
        -h, --help                                                   output usage information
        -V, --version                                                output the version number
        -db, --database <udb|nuforc> [source]                        Database to read (defaults to udb).
            Optional source, depending on database, can default to input/db/udb/data/U.RND or http://www.nuforc.org/webreports)
        -s, --sources [sourcesFile]                                  Sources file to read. Defaults to ./input/db/udb/data/usources.txt
        -wm, --worldmap [wmFile]                                     World map file to read. Defaults to ./input/db/udb/data/WM.VCE
        -c, --count <maxCount>                                       Maximum number of records to output.
        -m, --match <field=value>[&field=value...][|field=value...]  Output records that match the criteria.
        -f, --format <default|csv|xml>[?params]                      Format of the output. default params are latLng=dms|dd, csv params are separator
        -o, --out <outputFile|memory>                                Name of the file to output. "memory" will enter interactive mode.
        -v, --verbose                                                Displays detailed processing information.
        --debug                                                      Displays debug info.
        

If no files are specified, it will look for `input/usources.txt` as a source file, and `input/U.RND` as a data file in the current directory.

### Examples

#### Human-readable output in console

    npm run cli -- -c 10 --verbose

will display the 10 first decoded records in the default format:

    Using ts-node version 8.1.0, typescript version 3.4.5
    
    Record #1
            Title           : EZEKIEL
            Date            : -593
            Location        :
                    Pasture, CHALDEA (Chaldea, Iraq, Middle East), 31º00'00" N 46º10'12" E
                    Elevation 200 m
                    Observer: Map, Ground, Civilian
            Description :
                    FIERY SPHERE LANDS/4 SUPPORTS
                    TAKEN FOR A RIDE
                    see Bible acct.
            Miscellaneous details and features                              : Oddity
            Type of UFO / Craft                                                     : Fireball
            Aliens! Monsters! (no religious figures)        : Pseudo-Human, Monster
            Apparent UFO/Occupant activities                        : Missing time
            Places visited and things affected                      : Human affected, Apparent Landing
            Evidence and special effects                            : Historical
            Duration                                                                        : 60 min
            Strangeness                                                                     : 8
            Credibility                                                                     : 4
            Reference                                                                       : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°2
    
    udb: Reading world map:
    udb: Read 12127 WM records.
    
    udb: Reading sources:
    udb: - 253 primary references
    udb: - 43 newspapers and footnotes
    udb: - 67 newspapers and footnotes
    udb: - 40 other periodicals
    udb: - 63 misc. books, reports, files & correspondance
    udb: - 93 discredited reports
    
    udb: Opening file input/db/udb/data/U.RND
    
    udb: Reading cases from #1:
    udb: Querying...
    udb: Writing console
    
    Record #2
            Title           : SIEGE/ALEXANDER the GREAT
            Date            : -322
            Location        :
                    Town & city, TYRE =SUR,LEBANON (Tyre, Lebanon, Middle East), 33º16'12" N 35º13'12" E
                    Elevation 20 m, relative altitude 100 m
                    Observer: Map, Ground, Coast, Military, High quality observer(s)
            Description :
                    FLYING SHIELD BEAMS 
                    WALLS CRUMBLE
            Type of UFO / Craft                                                     : Saucer, Delta
            Aliens! Monsters! (no religious figures)        : No occupant
            Apparent UFO/Occupant activities                        : Observation, Ray
            Places visited and things affected                      : Animals affected, Human affected, Building or ANY MANMADE STRUCTURE
            Evidence and special effects                            : Traces, Historical
            Duration                                                                        : 3 min
            Strangeness                                                                     : 9
            Credibility                                                                     : 6
            Reference                                                                       : MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly., page n°320
    
    
    Record #3
            Title           : 'ALTAR' IN SKY
            Date            : -213
            Location        :
                    Pasture, HADRIA,ROMAN EMP (Firenze, Italy, Western Europe), 43º58'48" N 11º16'12" E
                    Observer: Map, Ground
            Description :
                    MAN IN WHITE
                    12 SUCH BETWEEN 222 AND 90 B.C.
            Miscellaneous details and features                              : Oddity, Wave
            Type of UFO / Craft                                                     : Cigar, Delta
            Aliens! Monsters! (no religious figures)        : Pseudo-Human
            Evidence and special effects                            : Historical
            Duration                                                                        : 15 min
            Strangeness                                                                     : 8
            Credibility                                                                     : 4
            Reference                                                                       : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°4
    
    
    Record #4
            Title           : SPECTACULAR FLEET OF SHIPS IN AIR
            Date            : -170
            Location        :
                    Pasture, LANUPIUM = ALBANO LAZIALE,ITL (RM, Italy, Western Europe), 41º43'48" N 12º38'24" E
                    Elevation 384 m
                    Observer: Map, Ground, Civilian
            Description :
                    NFD
            Miscellaneous details and features                              : Oddity, Wave
            Type of UFO / Craft                                                     : Saucer, Cigar
            Aliens! Monsters! (no religious figures)        : No occupant
            Evidence and special effects                            : Historical
            Duration                                                                        : 2 min
            Strangeness                                                                     : 6
            Credibility                                                                     : 6
            Reference                                                                       : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA, page n°125
    
    
    Record #5
            Title           : MANY OBS
            Date            : 70/5/21, ~18:00
            Location        :
                    Pasture, PALESTINE (UNK, Israel, Middle East), 31º46'12" N 35º13'48" E
                    Observer: Map, Ground, Military, Civilian, High quality observer(s)
            Description :
                    CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
                    LOUD NOISES LATER
            Miscellaneous details and features                              : Wave
            Type of UFO / Craft                                                     : Saucer, Cigar, Delta, Nightlights
            Aliens! Monsters! (no religious figures)        : Figure
            Evidence and special effects                            : Technical, Historical
            Miscellaneous details                                   : Sound
            Duration                                                                        : 60 min
            Strangeness                                                                     : 7
            Credibility                                                                     : 4
            Reference                                                                       : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA, page n°120
    
    
    Record #6
            Title           : MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'
            Date            : 840
            Location        :
                    Town & city, LYON,FRANCE (Rhône, France, Western Europe), 45º44'24" N 4º52'12" E
                    Observer: Map, Ground, Civilian, High quality observer(s)
            Description :
                    they admitted flying
            Type of UFO / Craft                                                     : Cigar
            Aliens! Monsters! (no religious figures)        : Figure
            Evidence and special effects                            : Historical
            Duration                                                                        : 20 min
            Strangeness                                                                     : 10
            Credibility                                                                     : 4
            Reference                                                                       : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°7
    
    
    Record #7
            Title           : 'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD
            Date            : 927/~3
            Location        :
                    Town & city, VERDUN,FR (Meuse, France, Western Europe), 49º08'24" N 5º21'36" E
                    Observer: Map, Ground, Civilian
            Description :
            
            Miscellaneous details and features                              : News, Misidentification
            Type of UFO / Craft                                                     : Nightlights, Fireball
            Aliens! Monsters! (no religious figures)        : No occupant
            Evidence and special effects                            : Historical
            Duration                                                                        : 15 min
            Strangeness                                                                     : 3
            Credibility                                                                     : 7
            Reference                                                                       : FIGEUT,Michel & RUCHON,Jean-Louis: OVNI- Le Premier    Dossier..; Alain LeFeuvre,Paris 1979., page n°32
    
    
    Record #8
            Title           : UNUSUALLY BRIGHT SCRS FLY
            Date            : 989/8/3
            Location        :
                    Mountains, JAPAN/LOC UNK (HNS, Japan, Asia Pacific), 35º40'12" N 139º49'48" E
                    Observer: Map, Ground, Civilian
            Description :
                    THEN JOIN TOGETHER
                    TIME UNKNOWN.
            Type of UFO / Craft                                                     : Saucer
            Aliens! Monsters! (no religious figures)        : No occupant
            Evidence and special effects                            : Historical
            Duration                                                                        : 15 min
            Strangeness                                                                     : 6
            Credibility                                                                     : 5
            Reference                                                                       : VALLEE,Jacques: PASSPORT TO MAGONIA; H.Regnery,Chicago HC 1969 & Contemporary Books,Chicago 1993. 372pp., page n°0
    
    
    Record #9
            Title           : 2 SPHERES HVR
            Date            : 1015/8/23
            Location        :
                    Mountains, JAPAN/LOC UNK (HNS, Japan, Asia Pacific), 35º37'48" N 139º48'00" E
                    Observer: Map, Ground, Civilian
            Description :
                    2 SML OBJs EXIT..1 smokes
                    NFD
                    /SOBEPS IFS#23 p35
            Type of UFO / Craft                                                     : Saucer, Cigar, Fireball
            Aliens! Monsters! (no religious figures)        : No occupant
            Evidence and special effects                            : Technical, Historical
            Duration                                                                        : 15 min
            Strangeness                                                                     : 4
            Credibility                                                                     : 6
            Reference                                                                       : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°9
    
    
    Record #10
            Title           : FIERY OVOID >>SE TURNS >>W
            Date            : 1034
            Location        :
                    Farmlands, nr VERDUN,FR (Meuse, France, Western Europe), 49º04'48" N 5º19'48" E
                    Observer: Map, Ground, Civilian
            Description :
                    /VERDUN MUSEUM /SOBEPS IFS#23 p35
            Miscellaneous details and features                              : Oddity
            Type of UFO / Craft                                                     : Saucer, Cigar
            Aliens! Monsters! (no religious figures)        : No occupant
            Evidence and special effects                            : Historical
            Duration                                                                        : 15 min
            Strangeness                                                                     : 6
            Credibility                                                                     : 6
            Reference                                                                       : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°9
    
    udb: Found 10 records in 0.01 seconds.
    
    	Title		: FIERY OVOID >>SE TURNS >>W
    	Date		: 1034
    	Location	:
    		Farmlands, nr VERDUN,FR (Meuse, France, Western Europe), 5º19'48" E 49º04'48" N
    		Observer: Map, Ground, Civilian
    	Description :
    		/VERDUN MUSEUM /SOBEPS IFS#23 p35
    	Miscellaneous details and features          : Oddity
    	Type of UFO / Craft                         : Saucer, Cigar
    	Aliens! Monsters! (no religious figures)    : No occupant
    	Evidence and special effects                : Historical
    	Duration                                    : 15 min
    	Strangeness                                 : 6
    	Credibility                                 : 6
    	Reference                                   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
    												  at index #9
    
    Read 10 reports.

#### CSV output in a file

If you want to output in a [CSV format](https://en.wikipedia.org/wiki/Comma-separated_values) and save the result into a file that could be imported in some spreadsheet software (Microsoft Excel, Google Spreadsheets, Apple Numbers, etc.):

    npm run cli -- -f csv --out export.csv --count 10

will create/overwrite an `export.csv` file with the following contents, where the first row list columns names, and each column is separated by a comma:

    "id","year","month","day","time","location","stateOrProvince","title","description","locale","duration","credibility","locationFlags","longitude","typeOfUfoCraftFlags","aliensMonstersFlags","apparentUfoOccupantActivitiesFlags","placesVisitedAndThingsAffectedFlags","evidenceAndSpecialEffectsFlags","miscellaneousDetailsFlags","latitude","elevation","relativeAltitude","ref","strangeness","miscellaneousFlags","continent","country"
    1,-593,"","","","CHALDEA","Chaldea","EZEKIEL","FIERY SPHERE LANDS/4 SUPPORTS
    TAKEN FOR A RIDE
    see Bible acct.","Pasture",60,4,"Map, Ground, Civilian",46.17,"Fireball","Pseudo-Human, Monster","Missing time","Human affected, Apparent Landing","Historical","",31,200,0,"VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°2",8,"Oddity","Middle East","Iraq"
    2,-322,"","","","TYRE =SUR,LEBANON","Tyre","SIEGE/ALEXANDER the GREAT","FLYING SHIELD BEAMS 
    WALLS CRUMBLE","Town & city",3,6,"Map, Ground, Coast, Military, High quality observer(s)",35.22,"Saucer, Delta","No occupant","Observation, Ray","Animals affected, Human affected, Building or ANY MANMADE STRUCTURE","Traces, Historical","",33.27,20,100,"MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly., page n°320",9,"","Middle East","Lebanon"
    3,-213,"","","","HADRIA,ROMAN EMP","Firenze","'ALTAR' IN SKY","MAN IN WHITE
    12 SUCH BETWEEN 222 AND 90 B.C.","Pasture",15,4,"Map, Ground",11.27,"Cigar, Delta","Pseudo-Human","","","Historical","",43.98,"","","VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°4",8,"Oddity, Wave","Western Europe","Italy"
    4,-170,"","","","LANUPIUM = ALBANO LAZIALE,ITL","RM","SPECTACULAR FLEET OF SHIPS IN AIR","NFD","Pasture",2,6,"Map, Ground, Civilian",12.64,"Saucer, Cigar","No occupant","","","Historical","",41.73,384,"","HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA, page n°125",6,"Oddity, Wave","Western Europe","Italy"
    5,70,5,21,"~18:00","PALESTINE","UNK","MANY OBS","CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
    LOUD NOISES LATER","Pasture",60,4,"Map, Ground, Military, Civilian, High quality observer(s)",35.23,"Saucer, Cigar, Delta, Nightlights","Figure","","","Technical, Historical","Sound",31.77,"","","HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA, page n°120",7,"Wave","Middle East","Israel"
    6,840,"","","","LYON,FRANCE","Rhône","MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'","they admitted flying","Town & city",20,4,"Map, Ground, Civilian, High quality observer(s)",4.87,"Cigar","Figure","","","Historical","",45.74,"","","VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°7",10,"","Western Europe","France"
    7,927,"~3","","","VERDUN,FR","Meuse","'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD",undefined,"Town & city",15,7,"Map, Ground, Civilian",5.36,"Nightlights, Fireball","No occupant","","","Historical","",49.14,"","","FIGEUT,Michel & RUCHON,Jean-Louis: OVNI- Le Premier    Dossier..; Alain LeFeuvre,Paris 1979., page n°32",3,"News, Misidentification","Western Europe","France"
    8,989,8,3,"","JAPAN/LOC UNK","HNS","UNUSUALLY BRIGHT SCRS FLY","THEN JOIN TOGETHER
    TIME UNKNOWN.","Mountains",15,5,"Map, Ground, Civilian",139.83,"Saucer","No occupant","","","Historical","",35.67,"","","VALLEE,Jacques: PASSPORT TO MAGONIA; H.Regnery,Chicago HC 1969 & Contemporary Books,Chicago 1993. 372pp., page n°0",6,"","Asia Pacific","Japan"
    9,1015,8,23,"","JAPAN/LOC UNK","HNS","2 SPHERES HVR","2 SML OBJs EXIT..1 smokes
    NFD
    /SOBEPS IFS#23 p35","Mountains",15,6,"Map, Ground, Civilian",139.8,"Saucer, Cigar, Fireball","No occupant","","","Technical, Historical","",35.63,"","","VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°9",4,"","Asia Pacific","Japan"
    10,1034,"","","","nr VERDUN,FR","Meuse","FIERY OVOID >>SE TURNS >>W","/VERDUN MUSEUM /SOBEPS IFS#23 p35","Farmlands",15,6,"Map, Ground, Civilian",5.33,"Saucer, Cigar","No occupant","","","Historical","",49.08,"","","VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp., page n°9",6,"Oddity","Western Europe","France"

Note that texts are enclosed in double quotes to preserve line feeds in a cell.

See such a CSV export [imported into Google Spreadsheets](https://docs.google.com/spreadsheets/d/1Uxc0tIOctMQLRzBQU1qWND_xaWsg_-_RsMHzHWS7PXk/edit?usp=sharing).

#### XML output in a file

If you want to output in a [XML format](https://fr.wikipedia.org/wiki/Extensible_Markup_Language) and save the result into a file:

    node udb -f xml --out export.xml --count 10

will create/overwrite an `export.xml` file with the following contents:

    <?xml version="1.0" encoding="UTF-8"?>
    <udb>
    <record><id>1</id><year>-593</year><month/><day/><time/><location>CHALDEA</location><stateOrProvince>Chaldea</stateOrProvince><title>EZEKIEL</title><description>FIERY SPHERE LANDS/4 SUPPORTS
    TAKEN FOR A RIDE
    see Bible acct.</description><locale>Pasture</locale><duration>60</duration><credibility>4</credibility><locationFlags>Map, Ground, Civilian</locationFlags><longitude>46.17</longitude><typeOfUfoCraftFlags>Fireball</typeOfUfoCraftFlags><aliensMonstersFlags>Pseudo-Human, Monster</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags>Missing time</apparentUfoOccupantActivitiesFlags><placesVisitedAndThingsAffectedFlags>Human affected, Apparent Landing</placesVisitedAndThingsAffectedFlags><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><latitude>31</latitude><elevation>200</elevation><relativeAltitude>0</relativeAltitude><ref>VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 &amp; Ballentine PB 1974 294pp., page n°2</ref><strangeness>8</strangeness><miscellaneousFlags>Oddity</miscellaneousFlags><continent>Middle East</continent><country>Iraq</country></record>
    <record><id>2</id><year>-322</year><month/><day/><time/><location>TYRE =SUR,LEBANON</location><stateOrProvince>Tyre</stateOrProvince><title>SIEGE/ALEXANDER the GREAT</title><description>FLYING SHIELD BEAMS 
    WALLS CRUMBLE</description><locale>Town &amp; city</locale><duration>3</duration><credibility>6</credibility><locationFlags>Map, Ground, Coast, Military, High quality observer(s)</locationFlags><longitude>35.22</longitude><typeOfUfoCraftFlags>Saucer, Delta</typeOfUfoCraftFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags>Observation, Ray</apparentUfoOccupantActivitiesFlags><placesVisitedAndThingsAffectedFlags>Animals affected, Human affected, Building or ANY MANMADE STRUCTURE</placesVisitedAndThingsAffectedFlags><evidenceAndSpecialEffectsFlags>Traces, Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><latitude>33.27</latitude><elevation>20</elevation><relativeAltitude>100</relativeAltitude><ref>MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly., page n°320</ref><strangeness>9</strangeness><miscellaneousFlags/><continent>Middle East</continent><country>Lebanon</country></record>
    <record><id>3</id><year>-213</year><month/><day/><time/><location>HADRIA,ROMAN EMP</location><stateOrProvince>Firenze</stateOrProvince><title>'ALTAR' IN SKY</title><description>MAN IN WHITE
    12 SUCH BETWEEN 222 AND 90 B.C.</description><locale>Pasture</locale><duration>15</duration><credibility>4</credibility><locationFlags>Map, Ground</locationFlags><longitude>11.27</longitude><typeOfUfoCraftFlags>Cigar, Delta</typeOfUfoCraftFlags><aliensMonstersFlags>Pseudo-Human</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><latitude>43.98</latitude><elevation/><relativeAltitude/><ref>VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 &amp; Ballentine PB 1974 294pp., page n°4</ref><strangeness>8</strangeness><miscellaneousFlags>Oddity, Wave</miscellaneousFlags><continent>Western Europe</continent><country>Italy</country></record>
    <record><id>4</id><year>-170</year><month/><day/><time/><location>LANUPIUM = ALBANO LAZIALE,ITL</location><stateOrProvince>RM</stateOrProvince><title>SPECTACULAR FLEET OF SHIPS IN AIR</title><description>NFD</description><locale>Pasture</locale><duration>2</duration><credibility>6</credibility><locationFlags>Map, Ground, Civilian</locationFlags><longitude>12.64</longitude><typeOfUfoCraftFlags>Saucer, Cigar</typeOfUfoCraftFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><latitude>41.73</latitude><elevation>384</elevation><relativeAltitude/><ref>HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA, page n°125</ref><strangeness>6</strangeness><miscellaneousFlags>Oddity, Wave</miscellaneousFlags><continent>Western Europe</continent><country>Italy</country></record>
    <record><id>5</id><year>70</year><month>5</month><day>21</day><time>~18:00</time><location>PALESTINE</location><stateOrProvince>UNK</stateOrProvince><title>MANY OBS</title><description>CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
    LOUD NOISES LATER</description><locale>Pasture</locale><duration>60</duration><credibility>4</credibility><locationFlags>Map, Ground, Military, Civilian, High quality observer(s)</locationFlags><longitude>35.23</longitude><typeOfUfoCraftFlags>Saucer, Cigar, Delta, Nightlights</typeOfUfoCraftFlags><aliensMonstersFlags>Figure</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Technical, Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags>Sound</miscellaneousDetailsFlags><latitude>31.77</latitude><elevation/><relativeAltitude/><ref>HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA, page n°120</ref><strangeness>7</strangeness><miscellaneousFlags>Wave</miscellaneousFlags><continent>Middle East</continent><country>Israel</country></record>
    <record><id>6</id><year>840</year><month/><day/><time/><location>LYON,FRANCE</location><stateOrProvince>Rhône</stateOrProvince><title>MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'</title><description>they admitted flying</description><locale>Town &amp; city</locale><duration>20</duration><credibility>4</credibility><locationFlags>Map, Ground, Civilian, High quality observer(s)</locationFlags><longitude>4.87</longitude><typeOfUfoCraftFlags>Cigar</typeOfUfoCraftFlags><aliensMonstersFlags>Figure</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><latitude>45.74</latitude><elevation/><relativeAltitude/><ref>VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 &amp; Ballentine PB 1974 294pp., page n°7</ref><strangeness>10</strangeness><miscellaneousFlags/><continent>Western Europe</continent><country>France</country></record>
    <record><id>7</id><year>927</year><month>~3</month><day/><time/><location>VERDUN,FR</location><stateOrProvince>Meuse</stateOrProvince><title>'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD</title><description/><locale>Town &amp; city</locale><duration>15</duration><credibility>7</credibility><locationFlags>Map, Ground, Civilian</locationFlags><longitude>5.36</longitude><typeOfUfoCraftFlags>Nightlights, Fireball</typeOfUfoCraftFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><latitude>49.14</latitude><elevation/><relativeAltitude/><ref>FIGEUT,Michel &amp; RUCHON,Jean-Louis: OVNI- Le Premier    Dossier..; Alain LeFeuvre,Paris 1979., page n°32</ref><strangeness>3</strangeness><miscellaneousFlags>News, Misidentification</miscellaneousFlags><continent>Western Europe</continent><country>France</country></record>
    <record><id>8</id><year>989</year><month>8</month><day>3</day><time/><location>JAPAN/LOC UNK</location><stateOrProvince>HNS</stateOrProvince><title>UNUSUALLY BRIGHT SCRS FLY</title><description>THEN JOIN TOGETHER
    TIME UNKNOWN.</description><locale>Mountains</locale><duration>15</duration><credibility>5</credibility><locationFlags>Map, Ground, Civilian</locationFlags><longitude>139.83</longitude><typeOfUfoCraftFlags>Saucer</typeOfUfoCraftFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><latitude>35.67</latitude><elevation/><relativeAltitude/><ref>VALLEE,Jacques: PASSPORT TO MAGONIA; H.Regnery,Chicago HC 1969 &amp; Contemporary Books,Chicago 1993. 372pp., page n°0</ref><strangeness>6</strangeness><miscellaneousFlags/><continent>Asia Pacific</continent><country>Japan</country></record>
    <record><id>9</id><year>1015</year><month>8</month><day>23</day><time/><location>JAPAN/LOC UNK</location><stateOrProvince>HNS</stateOrProvince><title>2 SPHERES HVR</title><description>2 SML OBJs EXIT..1 smokes
    NFD
    /SOBEPS IFS#23 p35</description><locale>Mountains</locale><duration>15</duration><credibility>6</credibility><locationFlags>Map, Ground, Civilian</locationFlags><longitude>139.8</longitude><typeOfUfoCraftFlags>Saucer, Cigar, Fireball</typeOfUfoCraftFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Technical, Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><latitude>35.63</latitude><elevation/><relativeAltitude/><ref>VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 &amp; Ballentine PB 1974 294pp., page n°9</ref><strangeness>4</strangeness><miscellaneousFlags/><continent>Asia Pacific</continent><country>Japan</country></record>
    <record><id>10</id><year>1034</year><month/><day/><time/><location>nr VERDUN,FR</location><stateOrProvince>Meuse</stateOrProvince><title>FIERY OVOID &gt;&gt;SE TURNS &gt;&gt;W</title><description>/VERDUN MUSEUM /SOBEPS IFS#23 p35</description><locale>Farmlands</locale><duration>15</duration><credibility>6</credibility><locationFlags>Map, Ground, Civilian</locationFlags><longitude>5.33</longitude><typeOfUfoCraftFlags>Saucer, Cigar</typeOfUfoCraftFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><latitude>49.08</latitude><elevation/><relativeAltitude/><ref>VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 &amp; Ballentine PB 1974 294pp., page n°9</ref><strangeness>6</strangeness><miscellaneousFlags>Oddity</miscellaneousFlags><continent>Western Europe</continent><country>France</country></record>
    </udb>
    
For details about input/output formats, please check the [uDb Wiki](https://github.com/RR0/uDb/wiki).
    
#### Record for record that match some criteria

    npm run cli -- --match year=1972&month=8&day=12

will output records about cases that occurred on August 12th, 1972.

    npm run cli -- --match id=256|id=12

will output records #12 and #256.

You can use any [InputRecord](https://github.com/RR0/uDb/blob/master/input/InputRecord.ts) property in a matching criteria.

## To do

See [opened issues](https://github.com/RR0/uDb/issues).

## Acknowdlegments

First I would like to thank Larry Hatch for his invaluable work in building this huge quality database.

Also I would like to thank several contributors (_EvillerBob_, _nablator_, _harpysounds_) of an ATS thread for their own analysis of the binary format. 
Notably, they helped [localizing the latitude/longitude bytes](http://www.abovetopsecret.com/forum/thread585935/pg8#pid22029387) and corrected some wrong interpretations I made.

Last but not least, I want to thank [Isaac Koi](http://www.isaackoi.com) for his restless efforts in collecting and sharing UFO data with the permission of their owners.
This work could not have been possible without him, who managed to run the old software, perform an textual export of the data, 
and got the permission from Larry's nephew (the holder of Larry's Power of Attorney) to share Larry's work.
