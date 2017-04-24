# \*U* UFO database reader

This is a [node](https://nodejs.org) application to read binary data file of the [\*U* UFO database](http://web.archive.org/web/20060701162044/http://www.larryhatch.net/).

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

    node udb [options]
    
    Options:
    
        -h, --help                                     output usage information
        -V, --version                                  output the version number
        -d, --data [dataFile]                          Data file to read. Defaults to ./input/data/U.RND
        -s, --sources [sourcesFile]                    Sources file to read. Defaults to ./input/data/usources.txt
        -wm, --worldmap [wmFile]                       World map file to read. Defaults to ./input/data/WM.VCE
        -c, --count <maxCount>                         Maximum number of records to output.
        -m, --match <criterion>[&otherCriterion...]    Output records that match the criteria.
        -f, --format <default|csv|xml> [csvSeparator]  Format of the output
        -o, --out <outputFile|memory>                  Name of the file to output. "memory" will enter interactive mode.
        -v, --verbose                                  Displays detailed processing information.
        --debug                                        Displays debug info.

If no files are specified, it will look for `input/usources.txt` as a source file, and `input/U.RND` as a data file in the current directory.

### Examples

#### Human-readable output in console

    node udb --count 10 --verbose

will display the 10 first decoded records in the default format:

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
    	Title		: EZEKIEL
    	Date		: -593
    	Location	:
    		Pasture, CHALDEA (Chaldea, Iraq, Middle East), 46º10'12" E 31º00'00" N
    		Elevation 200 m
    		Observer: Map, Ground, Civilian
    	Description :
    		FIERY SPHERE LANDS/4 SUPPORTS
    		TAKEN FOR A RIDE
    		see Bible acct.
    	Miscellaneous details and features          : Oddity
    	Type of UFO / Craft                         : Fireball
    	Aliens! Monsters! (no religious figures)    : Pseudo-Human, Monster
    	Apparent UFO/Occupant activities            : Missing time
    	Places visited and things affected          : Human affected, Apparent Landing
    	Evidence and special effects                : Historical
    	Duration                                    : 60 min
    	Strangeness                                 : 8
    	Credibility                                 : 4
    	Reference                                   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
    												  at index #2
    
    Record #2
    	Title		: SIEGE/ALEXANDER the GREAT
    	Date		: -322
    	Location	:
    		Military base, TYRE =SUR,LEBANON (Tyre, Lebanon, Middle East), 35º13'12" E 33º16'12" N
    		Elevation 20 m, relative altitude 100 m
    		Observer: Map, Ground, Coast, Military, High quality observer(s)
    	Description :
    		FLYING SHIELD BEAMS 
    		WALLS CRUMBLE
    	Type of UFO / Craft                         : Saucer, Delta
    	Aliens! Monsters! (no religious figures)    : No occupant
    	Apparent UFO/Occupant activities            : Observation, Ray
    	Places visited and things affected          : Animals affected, Human affected, Building or ANY MANMADE STRUCTURE
    	Evidence and special effects                : Traces, Historical
    	Duration                                    : 3 min
    	Strangeness                                 : 9
    	Credibility                                 : 6
    	Reference                                   : MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly.
    												  at index #320
    
    Record #3
    	Title		: 'ALTAR' IN SKY
    	Date		: -213
    	Location	:
    		Pasture, HADRIA,ROMAN EMP (Firenze, Italy, Western Europe), 11º16'12" E 43º58'48" N
    		Observer: Map, Ground
    	Description :
    		MAN IN WHITE
    		12 SUCH BETWEEN 222 AND 90 B.C.
    	Miscellaneous details and features          : Oddity, Wave
    	Type of UFO / Craft                         : Cigar, Delta
    	Aliens! Monsters! (no religious figures)    : Pseudo-Human
    	Evidence and special effects                : Historical
    	Duration                                    : 15 min
    	Strangeness                                 : 8
    	Credibility                                 : 4
    	Reference                                   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
    												  at index #4
    
    Record #4
    	Title		: SPECTACULAR FLEET OF SHIPS IN AIR
    	Date		: -170
    	Location	:
    		Road + rails, LANUPIUM = ALBANO LAZIALE,ITL (RM, Italy, Western Europe), 12º38'24" E 41º43'48" N
    		Elevation 384 m
    		Observer: Map, Ground, Civilian
    	Description :
    		NFD
    	Miscellaneous details and features          : Oddity, Wave
    	Type of UFO / Craft                         : Saucer, Cigar
    	Aliens! Monsters! (no religious figures)    : No occupant
    	Evidence and special effects                : Historical
    	Duration                                    : 2 min
    	Strangeness                                 : 6
    	Credibility                                 : 6
    	Reference                                   : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA
    												  at index #125
    
    Record #5
    	Title		: MANY OBS
    	Date		: 70/5/21
    	Location	:
    		Pasture, PALESTINE (UNK, Israel, Middle East), 35º13'48" E 31º46'12" N
    		Observer: Map, Ground, Military, Civilian, High quality observer(s)
    	Description :
    		CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
    		LOUD NOISES LATER
    	Miscellaneous details and features          : Wave
    	Type of UFO / Craft                         : Saucer, Cigar, Delta, Nightlights
    	Aliens! Monsters! (no religious figures)    : Figure
    	Evidence and special effects                : Technical, Historical
    	Miscellaneous details                       : Sound
    	Duration                                    : 60 min
    	Strangeness                                 : 7
    	Credibility                                 : 4
    	Reference                                   : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA
    												  at index #120
    
    Record #6
    	Title		: MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'
    	Date		: 840
    	Location	:
    		Town & city, LYON,FRANCE (Rhône, France, Western Europe), 4º52'12" E 45º44'24" N
    		Observer: Map, Ground, Civilian, High quality observer(s)
    	Description :
    		they admitted flying
    	Type of UFO / Craft                         : Cigar
    	Aliens! Monsters! (no religious figures)    : Figure
    	Evidence and special effects                : Historical
    	Duration                                    : 20 min
    	Strangeness                                 : 10
    	Credibility                                 : 4
    	Reference                                   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
    												  at index #7
    
    Record #7
    	Title		: 'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD
    	Date		: 927/~3
    	Location	:
    		Town & city, VERDUN,FR (Meuse, France, Western Europe), 5º21'36" E 49º08'24" N
    		Observer: Map, Ground, Civilian
    	Description :
    	
    	Miscellaneous details and features          : News, Misidentification
    	Type of UFO / Craft                         : Nightlights, Fireball
    	Aliens! Monsters! (no religious figures)    : No occupant
    	Evidence and special effects                : Historical
    	Duration                                    : 15 min
    	Strangeness                                 : 3
    	Credibility                                 : 7
    	Reference                                   : FIGEUT,Michel & RUCHON,Jean-Louis: OVNI- Le Premier    Dossier..; Alain LeFeuvre,Paris 1979.
    												  at index #32
    
    Record #8
    	Title		: UNUSUALLY BRIGHT SCRS FLY
    	Date		: 989/8/3
    	Location	:
    		Mountains, JAPAN/LOC UNK (HNS, Japan, Asia Pacific), 139º49'48" E 35º40'12" N
    		Observer: Map, Ground, Civilian
    	Description :
    		THEN JOIN TOGETHER
    		TIME UNKNOWN.
    	Type of UFO / Craft                         : Saucer
    	Aliens! Monsters! (no religious figures)    : No occupant
    	Evidence and special effects                : Historical
    	Duration                                    : 15 min
    	Strangeness                                 : 6
    	Credibility                                 : 5
    	Reference                                   : VALLEE,Jacques: PASSPORT TO MAGONIA; H.Regnery,Chicago HC 1969 & Contemporary Books,Chicago 1993. 372pp.
    												  at index #0
    
    Record #9
    	Title		: 2 SPHERES HVR
    	Date		: 1015/8/23
    	Location	:
    		Mountains, JAPAN/LOC UNK (HNS, Japan, Asia Pacific), 139º48'00" E 35º37'48" N
    		Observer: Map, Ground, Civilian
    	Description :
    		2 SML OBJs EXIT..1 smokes
    		NFD
    		/SOBEPS IFS#23 p35
    	Type of UFO / Craft                         : Saucer, Cigar, Fireball
    	Aliens! Monsters! (no religious figures)    : No occupant
    	Evidence and special effects                : Technical, Historical
    	Duration                                    : 15 min
    	Strangeness                                 : 4
    	Credibility                                 : 6
    	Reference                                   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
    												  at index #9
    
    Record #10
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

    node udb -f csv --out export.csv --count 10

will create/overwrite an `export.csv` file with the following contents, where the first row list columns names, and each column is separated by a comma:

    "id","year","month","day","time","location","stateOrProvince","title","description","locale","duration","relativeAltitude","miscellaneousFlags","locationFlags","unknownLocale","unknownMonth","aliensMonstersFlags","apparentUfoOccupantActivitiesFlags","placesVisitedAndThingsAffectedFlags","evidenceAndSpecialEffectsFlags","miscellaneousDetailsFlags","longitude","latitude","elevation","ref","refIndex","strangeness","credibility","typeOfUfoCraftFlags","continent","country"
    1,-593,"","","","CHALDEA","Chaldea","EZEKIEL","FIERY SPHERE LANDS/4 SUPPORTS
    TAKEN FOR A RIDE
    see Bible acct.","Pasture",60,0,"Oddity","Map, Ground, Civilian",0,0,"Pseudo-Human, Monster","Missing time","Human affected, Apparent Landing","Historical","",-46.17,31,200,2,2,8,4,"Fireball","Middle East","Iraq"
    2,-322,"","","","TYRE =SUR,LEBANON","Tyre","SIEGE/ALEXANDER the GREAT","FLYING SHIELD BEAMS 
    WALLS CRUMBLE","Town & city",3,100,"","Map, Ground, Coast, Military, High quality observer(s)",1,0,"No occupant","Observation, Ray","Animals affected, Human affected, Building or ANY MANMADE STRUCTURE","Traces, Historical","",-35.22,33.27,20,160,320,9,6,"Saucer, Delta","Middle East","Lebanon"
    3,-213,"","","","HADRIA,ROMAN EMP","Firenze","'ALTAR' IN SKY","MAN IN WHITE
    12 SUCH BETWEEN 222 AND 90 B.C.","Pasture",15,"","Oddity, Wave","Map, Ground",0,0,"Pseudo-Human","","","Historical","",-11.27,43.98,"",2,4,8,4,"Cigar, Delta","Western Europe","Italy"
    4,-170,"","","","LANUPIUM = ALBANO LAZIALE,ITL","RM","SPECTACULAR FLEET OF SHIPS IN AIR","NFD","Pasture",2,"","Oddity, Wave","Map, Ground, Civilian",1,0,"No occupant","","","Historical","",-12.64,41.73,384,114,125,6,6,"Saucer, Cigar","Western Europe","Italy"
    5,70,5,21,"~18:00","PALESTINE","UNK","MANY OBS","CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
    LOUD NOISES LATER","Pasture",60,"","Wave","Map, Ground, Military, Civilian, High quality observer(s)",0,0,"Figure","","","Technical, Historical","Sound",-35.23,31.77,"",114,120,7,4,"Saucer, Cigar, Delta, Nightlights","Middle East","Israel"
    6,840,"","","","LYON,FRANCE","Rhône","MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'","they admitted flying","Town & city",20,"","","Map, Ground, Civilian, High quality observer(s)",0,0,"Figure","","","Historical","",-4.87,45.74,"",2,7,10,4,"Cigar","Western Europe","France"
    7,927,"~3","","","VERDUN,FR","Meuse","'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD",undefined,"Town & city",15,"","News, Misidentification","Map, Ground, Civilian",0,0,"No occupant","","","Historical","",-5.36,49.14,"",30,32,3,7,"Nightlights, Fireball","Western Europe","France"
    8,989,8,3,"","JAPAN/LOC UNK","HNS","UNUSUALLY BRIGHT SCRS FLY","THEN JOIN TOGETHER
    TIME UNKNOWN.","Mountains",15,"","","Map, Ground, Civilian",0,0,"No occupant","","","Historical","",-139.83,35.67,"",8,0,6,5,"Saucer","Asia Pacific","Japan"
    9,1015,8,23,"","JAPAN/LOC UNK","HNS","2 SPHERES HVR","2 SML OBJs EXIT..1 smokes
    NFD
    /SOBEPS IFS#23 p35","Mountains",15,"","","Map, Ground, Civilian",0,0,"No occupant","","","Technical, Historical","",-139.8,35.63,"",2,9,4,6,"Saucer, Cigar, Fireball","Asia Pacific","Japan"
    10,1034,"","","","nr VERDUN,FR","Meuse","FIERY OVOID >>SE TURNS >>W","/VERDUN MUSEUM /SOBEPS IFS#23 p35","Farmlands",15,"","Oddity","Map, Ground, Civilian",0,0,"No occupant","","","Historical","",-5.33,49.08,"",2,9,6,6,"Saucer, Cigar","Western Europe","France"(node:33498) DeprecationWarning: Calling an asynchronous function without callback is deprecated.

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
    see Bible acct.</description><locale>Pasture</locale><duration>60</duration><relativeAltitude>0</relativeAltitude><miscellaneousFlags>Oddity</miscellaneousFlags><locationFlags>Map, Ground, Civilian</locationFlags><unknownLocale>0</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>Pseudo-Human, Monster</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags>Missing time</apparentUfoOccupantActivitiesFlags><placesVisitedAndThingsAffectedFlags>Human affected, Apparent Landing</placesVisitedAndThingsAffectedFlags><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><longitude>-46.17</longitude><latitude>31</latitude><elevation>200</elevation><ref>2</ref><refIndex>2</refIndex><strangeness>8</strangeness><credibility>4</credibility><typeOfUfoCraftFlags>Fireball</typeOfUfoCraftFlags><continent>Middle East</continent><country>Iraq</country></record>
    <record><id>2</id><year>-322</year><month/><day/><time/><location>TYRE =SUR,LEBANON</location><stateOrProvince>Tyre</stateOrProvince><title>SIEGE/ALEXANDER the GREAT</title><description>FLYING SHIELD BEAMS 
    WALLS CRUMBLE</description><locale>Town &amp; city</locale><duration>3</duration><relativeAltitude>100</relativeAltitude><miscellaneousFlags/><locationFlags>Map, Ground, Coast, Military, High quality observer(s)</locationFlags><unknownLocale>1</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags>Observation, Ray</apparentUfoOccupantActivitiesFlags><placesVisitedAndThingsAffectedFlags>Animals affected, Human affected, Building or ANY MANMADE STRUCTURE</placesVisitedAndThingsAffectedFlags><evidenceAndSpecialEffectsFlags>Traces, Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><longitude>-35.22</longitude><latitude>33.27</latitude><elevation>20</elevation><ref>160</ref><refIndex>320</refIndex><strangeness>9</strangeness><credibility>6</credibility><typeOfUfoCraftFlags>Saucer, Delta</typeOfUfoCraftFlags><continent>Middle East</continent><country>Lebanon</country></record>
    <record><id>3</id><year>-213</year><month/><day/><time/><location>HADRIA,ROMAN EMP</location><stateOrProvince>Firenze</stateOrProvince><title>'ALTAR' IN SKY</title><description>MAN IN WHITE
    12 SUCH BETWEEN 222 AND 90 B.C.</description><locale>Pasture</locale><duration>15</duration><relativeAltitude/><miscellaneousFlags>Oddity, Wave</miscellaneousFlags><locationFlags>Map, Ground</locationFlags><unknownLocale>0</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>Pseudo-Human</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><longitude>-11.27</longitude><latitude>43.98</latitude><elevation/><ref>2</ref><refIndex>4</refIndex><strangeness>8</strangeness><credibility>4</credibility><typeOfUfoCraftFlags>Cigar, Delta</typeOfUfoCraftFlags><continent>Western Europe</continent><country>Italy</country></record>
    <record><id>4</id><year>-170</year><month/><day/><time/><location>LANUPIUM = ALBANO LAZIALE,ITL</location><stateOrProvince>RM</stateOrProvince><title>SPECTACULAR FLEET OF SHIPS IN AIR</title><description>NFD</description><locale>Pasture</locale><duration>2</duration><relativeAltitude/><miscellaneousFlags>Oddity, Wave</miscellaneousFlags><locationFlags>Map, Ground, Civilian</locationFlags><unknownLocale>1</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><longitude>-12.64</longitude><latitude>41.73</latitude><elevation>384</elevation><ref>114</ref><refIndex>125</refIndex><strangeness>6</strangeness><credibility>6</credibility><typeOfUfoCraftFlags>Saucer, Cigar</typeOfUfoCraftFlags><continent>Western Europe</continent><country>Italy</country></record>
    <record><id>5</id><year>70</year><month>5</month><day>21</day><time>~18:00</time><location>PALESTINE</location><stateOrProvince>UNK</stateOrProvince><title>MANY OBS</title><description>CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
    LOUD NOISES LATER</description><locale>Pasture</locale><duration>60</duration><relativeAltitude/><miscellaneousFlags>Wave</miscellaneousFlags><locationFlags>Map, Ground, Military, Civilian, High quality observer(s)</locationFlags><unknownLocale>0</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>Figure</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Technical, Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags>Sound</miscellaneousDetailsFlags><longitude>-35.23</longitude><latitude>31.77</latitude><elevation/><ref>114</ref><refIndex>120</refIndex><strangeness>7</strangeness><credibility>4</credibility><typeOfUfoCraftFlags>Saucer, Cigar, Delta, Nightlights</typeOfUfoCraftFlags><continent>Middle East</continent><country>Israel</country></record>
    <record><id>6</id><year>840</year><month/><day/><time/><location>LYON,FRANCE</location><stateOrProvince>Rhône</stateOrProvince><title>MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'</title><description>they admitted flying</description><locale>Town &amp; city</locale><duration>20</duration><relativeAltitude/><miscellaneousFlags/><locationFlags>Map, Ground, Civilian, High quality observer(s)</locationFlags><unknownLocale>0</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>Figure</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><longitude>-4.87</longitude><latitude>45.74</latitude><elevation/><ref>2</ref><refIndex>7</refIndex><strangeness>10</strangeness><credibility>4</credibility><typeOfUfoCraftFlags>Cigar</typeOfUfoCraftFlags><continent>Western Europe</continent><country>France</country></record>
    <record><id>7</id><year>927</year><month>~3</month><day/><time/><location>VERDUN,FR</location><stateOrProvince>Meuse</stateOrProvince><title>'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD</title><description/><locale>Town &amp; city</locale><duration>15</duration><relativeAltitude/><miscellaneousFlags>News, Misidentification</miscellaneousFlags><locationFlags>Map, Ground, Civilian</locationFlags><unknownLocale>0</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><longitude>-5.36</longitude><latitude>49.14</latitude><elevation/><ref>30</ref><refIndex>32</refIndex><strangeness>3</strangeness><credibility>7</credibility><typeOfUfoCraftFlags>Nightlights, Fireball</typeOfUfoCraftFlags><continent>Western Europe</continent><country>France</country></record>
    <record><id>8</id><year>989</year><month>8</month><day>3</day><time/><location>JAPAN/LOC UNK</location><stateOrProvince>HNS</stateOrProvince><title>UNUSUALLY BRIGHT SCRS FLY</title><description>THEN JOIN TOGETHER
    TIME UNKNOWN.</description><locale>Mountains</locale><duration>15</duration><relativeAltitude/><miscellaneousFlags/><locationFlags>Map, Ground, Civilian</locationFlags><unknownLocale>0</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><longitude>-139.83</longitude><latitude>35.67</latitude><elevation/><ref>8</ref><refIndex>0</refIndex><strangeness>6</strangeness><credibility>5</credibility><typeOfUfoCraftFlags>Saucer</typeOfUfoCraftFlags><continent>Asia Pacific</continent><country>Japan</country></record>
    <record><id>9</id><year>1015</year><month>8</month><day>23</day><time/><location>JAPAN/LOC UNK</location><stateOrProvince>HNS</stateOrProvince><title>2 SPHERES HVR</title><description>2 SML OBJs EXIT..1 smokes
    NFD
    /SOBEPS IFS#23 p35</description><locale>Mountains</locale><duration>15</duration><relativeAltitude/><miscellaneousFlags/><locationFlags>Map, Ground, Civilian</locationFlags><unknownLocale>0</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Technical, Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><longitude>-139.8</longitude><latitude>35.63</latitude><elevation/><ref>2</ref><refIndex>9</refIndex><strangeness>4</strangeness><credibility>6</credibility><typeOfUfoCraftFlags>Saucer, Cigar, Fireball</typeOfUfoCraftFlags><continent>Asia Pacific</continent><country>Japan</country></record>
    <record><id>10</id><year>1034</year><month/><day/><time/><location>nr VERDUN,FR</location><stateOrProvince>Meuse</stateOrProvince><title>FIERY OVOID &gt;&gt;SE TURNS &gt;&gt;W</title><description>/VERDUN MUSEUM /SOBEPS IFS#23 p35</description><locale>Farmlands</locale><duration>15</duration><relativeAltitude/><miscellaneousFlags>Oddity</miscellaneousFlags><locationFlags>Map, Ground, Civilian</locationFlags><unknownLocale>0</unknownLocale><unknownMonth>0</unknownMonth><aliensMonstersFlags>No occupant</aliensMonstersFlags><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><miscellaneousDetailsFlags/><longitude>-5.33</longitude><latitude>49.08</latitude><elevation/><ref>2</ref><refIndex>9</refIndex><strangeness>6</strangeness><credibility>6</credibility><typeOfUfoCraftFlags>Saucer, Cigar</typeOfUfoCraftFlags><continent>Western Europe</continent><country>France</country></record>
    </udb>.
    
For details about input/output formats, please check the [uDb Wiki](https://github.com/RR0/uDb/wiki).
    
#### Record for record that match some criteria

    node udb --match year=1972&month=8&day=12

will output records about cases that occurred on August 12th, 1972.

    node udb --match id=256|id=12

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
 