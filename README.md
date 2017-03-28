# \*U* UFO database reader

This is a [node](https://nodejs.org) application to read binary data file of the [\*U* UFO database](http://web.archive.org/web/20060701162044/http://www.larryhatch.net/).

As this database software can only run on old MS-DOS platforms and its maintenance has been discontinued, 
it is important to allow users to access its data from modern platforms.

## Setup

You need to have [node](https://nodejs.org) 7.6.0 or later installed on your computer.

## Usage

    node udb [options]
    
      Options:
    
        -h, --help                                     output usage information
        -V, --version                                  output the version number
        -d, --data [dataFile]                          Specify data file. Defaults to ./U.RND
        -s, --sources [sourcesFile]                    Specify sources file. Defaults to ./usources.txt
        -wm, --worldmap [wmFile]                       Specify world map file. Defaults to ./WM.VCE
        -r, --range <fromIndex>..<toIndex>             Specify record range to output. Defaults to 1..end
        -r, --records <recordsIndexes>                 Specify a list of indexes of records to output.
        -c, --count <maxCount>                         Specify the maximim number of records to output.
        -f, --format <default|csv|xml> [csvSeparator]  The format of the output
        -o, --out <outputFile>                         The name of the file to output. Will output as CSV if file extension is .csv
        -v, --verbose                                  Displayed detailed processing information.
        --debug                                        Displays debug info.

If no files are specified, it will look for `usources.txt` as a source file, and `U.RND` as a data file in the current directory.

### Examples

#### Human-readable output in console

    node --count 10 --verbose

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
      Title       : EZEKIEL
      Date        : -593/?/?, ?
      Location    : Pasture, CHALDEA (CHL, Iraq, Middle East), 46º10'00" E 31º00'00" N
                    Elevation 200 m
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
                    - CIV: At least ONE observer was civilian
      Description : FIERY SPHERE LANDS/4 SUPPORTS
                    TAKEN FOR A RIDE
                    see Bible acct.
                    Miscellaneous details and features:
                    - ODD: 1) A very strange event, even if not UFO related. 2) An atypical oddity that occurred during a UFO event. 3) Forteana or paranormal features.
                    Type of UFO / Craft:
                    - FBL: Blazing undistinguished form.  Possible meteors etc.
                    Aliens! Monsters! (sorry, no religious figures):
                    - PSH: 1) Possible clone, robot or worse. 2) "Human" seen working with or for alien figures.
                    - MON: Apparent life form fits no standard category.
                    Apparent UFO/Occupant activities:
                    - MST: Unexplained time-lapse or other time anomaly.
                    Places visited and things affected:
                    - HUM: Injury. burns. marks. psychology. abduction. death.
                    - LND: UFO (or any part thereof) sets down.
                    Evidence and special effects:
                    - HST: Historical account OR sighting makes history.
      Duration    : 60 min
      Strangeness : 8
      Credibility : 4
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #2
    
    Record #2
      Title       : SIEGE/ALEXANDER the GREAT
      Date        : -322/?/?, ?
      Location    : Military base, TYRE =SUR,LEBANON (TYR, Lebanon, Middle East), 35º13'20" E 33º16'00" N
                    Elevation 20 m, relative altitude 100 m
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
                    - CST: Sighting in coastal area, possibly just offshore.
                    - MIL: At least ONE observer was military.
                    - HQO: Observer(s) were scientists, Engineers, well trained individuals. 3 or more people with consistent descriptions.
      Description : FLYING SHIELD BEAMS
                    WALLS CRUMBLE
                    Type of UFO / Craft:
                    - SCR: Classic Saucer, Disk, Ovoid or Sphere.  Not just some light.
                    - DLT: Delta, Vee, boomerang, rectangular UFO.  Sharp corners and edges.
                    Aliens! Monsters! (sorry, no religious figures):
                    - NOC: No entity / occupant seen by observer(s).
                    Apparent UFO/Occupant activities:
                    - OBS: Observation: Surveillance.  Chasing/pacing vehicles.
                    - RAY: Odd light RAY, searchlight or visible beam.  Anything laserlike.
                    Places visited and things affected:
                    - ANI: Panic. Change of behavior. Injuries. Marks.
                    - HUM: Injury. burns. marks. psychology. abduction. death.
                    - BLD: Roads, Bridges, Power lines..
                    Evidence and special effects:
                    - TRC: Physical traces discovered (most any variety)
                    - HST: Historical account OR sighting makes history.
      Duration    : 3 min
      Strangeness : 9
      Credibility : 6
      Reference   : MUFON UFO JOURNAL, Seguin,TX  USA.  Monthly.
                    at index #320
    
    Record #3
      Title       : 'ALTAR' IN SKY
      Date        : -213/?/?, 
      Location    : Pasture, HADRIA,ROMAN EMP (FI., Italy, Western Europe), 11º16'00" E 43º58'40" N
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
      Description : MAN IN WHITE
                    12 SUCH BETWEEN 222 AND 90 B.C.
                    Miscellaneous details and features:
                    - ODD: 1) A very strange event, even if not UFO related. 2) An atypical oddity that occurred during a UFO event. 3) Forteana or paranormal features.
                    - WAV: Wave or cluster of UFO sightings.  Sighting is part of a wave.
                    Type of UFO / Craft:
                    - CIG: Torpedo, cigar, fuselage or cylinder shaped vehicle. (Use SCR for a classic "saucer" seen edge-on.)
                    - DLT: Delta, Vee, boomerang, rectangular UFO.  Sharp corners and edges.
                    Aliens! Monsters! (sorry, no religious figures):
                    - PSH: 1) Possible clone, robot or worse. 2) "Human" seen working with or for alien figures.
                    Evidence and special effects:
                    - HST: Historical account OR sighting makes history.
      Duration    : 15 min
      Strangeness : 8
      Credibility : 4
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #4
    
    Record #4
      Title       : SPECTACULAR FLEET OF SHIPS IN AIR
      Date        : -170/?/?, ?
      Location    : Road + rails, LANUPIUM = ALBANO LAZIALE,ITL (RM., Italy, Western Europe), 12º38'40" E 41º44'00" N
                    Elevation 384 m
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
                    - CIV: At least ONE observer was civilian
      Description : NFD
                    Miscellaneous details and features:
                    - ODD: 1) A very strange event, even if not UFO related. 2) An atypical oddity that occurred during a UFO event. 3) Forteana or paranormal features.
                    - WAV: Wave or cluster of UFO sightings.  Sighting is part of a wave.
                    Type of UFO / Craft:
                    - SCR: Classic Saucer, Disk, Ovoid or Sphere.  Not just some light.
                    - CIG: Torpedo, cigar, fuselage or cylinder shaped vehicle. (Use SCR for a classic "saucer" seen edge-on.)
                    Aliens! Monsters! (sorry, no religious figures):
                    - NOC: No entity / occupant seen by observer(s).
                    Evidence and special effects:
                    - HST: Historical account OR sighting makes history.
      Duration    : 2 min
      Strangeness : 6
      Credibility : 6
      Reference   : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA
                    at index #125
    
    Record #5
      Title       : MANY OBS
      Date        : 70/5/21, ~18:00
      Location    : Pasture, PALESTINE (UNK, Israel, Middle East), 35º14'00" E 31º46'00" N
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
                    - MIL: At least ONE observer was military.
                    - CIV: At least ONE observer was civilian
                    - HQO: Observer(s) were scientists, Engineers, well trained individuals. 3 or more people with consistent descriptions.
      Description : CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
                    LOUD NOISES LATER
                    Miscellaneous details and features:
                    - WAV: Wave or cluster of UFO sightings.  Sighting is part of a wave.
                    Type of UFO / Craft:
                    - SCR: Classic Saucer, Disk, Ovoid or Sphere.  Not just some light.
                    - CIG: Torpedo, cigar, fuselage or cylinder shaped vehicle. (Use SCR for a classic "saucer" seen edge-on.)
                    - DLT: Delta, Vee, boomerang, rectangular UFO.  Sharp corners and edges.
                    - NLT: Points of light with no discernable shape.
                    Aliens! Monsters! (sorry, no religious figures):
                    - FIG: Undefined or poorly seen "figure" or entity.  A shadow.
                    Evidence and special effects:
                    - TCH: NEW Technical details.  Clues to alien technology.
                    - HST: Historical account OR sighting makes history.
                    Miscellaneous details:
                    - SND: UFO sounds heard or recorded.
      Duration    : 60 min
      Strangeness : 7
      Credibility : 4
      Reference   : HAINES,Richard Ph.D: PROJECT DELTA; 1994,   LDA Press, PO Box 880,Los Altos,CA 94023 USA
                    at index #120
    
    Record #6
      Title       : MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'
      Date        : 840/?/?, 
      Location    : Town & city, LYON,FRANCE (RHN, France, Western Europe), 4º52'00" E 45º44'40" N
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
                    - CIV: At least ONE observer was civilian
                    - HQO: Observer(s) were scientists, Engineers, well trained individuals. 3 or more people with consistent descriptions.
      Description : they admitted flying
                    Type of UFO / Craft:
                    - CIG: Torpedo, cigar, fuselage or cylinder shaped vehicle. (Use SCR for a classic "saucer" seen edge-on.)
                    Aliens! Monsters! (sorry, no religious figures):
                    - FIG: Undefined or poorly seen "figure" or entity.  A shadow.
                    Evidence and special effects:
                    - HST: Historical account OR sighting makes history.
      Duration    : 20 min
      Strangeness : 10
      Credibility : 4
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #7
    
    Record #7
      Title       : 'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD
      Date        : 927/~03/?, 
      Location    : Town & city, VERDUN,FR (MSE, France, Western Europe), 5º21'20" E 49º08'40" N
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
                    - CIV: At least ONE observer was civilian
      Description : 
                    Miscellaneous details and features:
                    - NWS: Report from the news media, or else "sighting made the news".
                    - MID: Likely Mis-IDentification of mundane object: (Venus, rocket..)
                    Type of UFO / Craft:
                    - NLT: Points of light with no discernable shape.
                    - FBL: Blazing undistinguished form.  Possible meteors etc.
                    Aliens! Monsters! (sorry, no religious figures):
                    - NOC: No entity / occupant seen by observer(s).
                    Evidence and special effects:
                    - HST: Historical account OR sighting makes history.
      Duration    : 15 min
      Strangeness : 3
      Credibility : 7
      Reference   : FIGEUT,Michel & RUCHON,Jean-Louis: OVNI- Le Premier    Dossier..; Alain LeFeuvre,Paris 1979.
                    at index #32
    
    Record #8
      Title       : UNUSUALLY BRIGHT SCRS FLY
      Date        : 989/8/3, 
      Location    : Mountains, JAPAN/LOC UNK (HNS, Japan, Asia Pacific), 139º50'00" E 35º40'00" N
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
                    - CIV: At least ONE observer was civilian
      Description : THEN JOIN TOGETHER
                    TIME UNKNOWN.   
                    Type of UFO / Craft:
                    - SCR: Classic Saucer, Disk, Ovoid or Sphere.  Not just some light.
                    Aliens! Monsters! (sorry, no religious figures):
                    - NOC: No entity / occupant seen by observer(s).
                    Evidence and special effects:
                    - HST: Historical account OR sighting makes history.
      Duration    : 15 min
      Strangeness : 6
      Credibility : 5
      Reference   : VALLEE,Jacques: PASSPORT TO MAGONIA; H.Regnery,Chicago HC 1969 & Contemporary Books,Chicago 1993. 372pp.
                    at index #0
    
    Record #9
      Title       : 2 SPHERES HVR
      Date        : 1015/8/23, ?
      Location    : Mountains, JAPAN/LOC UNK (HNS, Japan, Asia Pacific), 139º48'00" E 35º38'00" N
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
                    - CIV: At least ONE observer was civilian
      Description : 2 SML OBJs EXIT..1 smokes
                    NFD
                    /SOBEPS IFS#23 p35
                    Type of UFO / Craft:
                    - SCR: Classic Saucer, Disk, Ovoid or Sphere.  Not just some light.
                    - CIG: Torpedo, cigar, fuselage or cylinder shaped vehicle. (Use SCR for a classic "saucer" seen edge-on.)
                    - FBL: Blazing undistinguished form.  Possible meteors etc.
                    Aliens! Monsters! (sorry, no religious figures):
                    - NOC: No entity / occupant seen by observer(s).
                    Evidence and special effects:
                    - TCH: NEW Technical details.  Clues to alien technology.
                    - HST: Historical account OR sighting makes history.
      Duration    : 15 min
      Strangeness : 4
      Credibility : 6
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #9
    
    Record #10
      Title       : FIERY OVOID >>SE TURNS >>W
      Date        : 1034/?/?, ?
      Location    : Farmlands, nr VERDUN,FR (MSE, France, Western Europe), 5º20'00" E 49º04'40" N
                    Observer:
                    - MAP: Coordinates are known.  OK to place event on screen maps.
                    - GND: At least ONE observer (or radar) was on land.
                    - CIV: At least ONE observer was civilian
      Description : /VERDUN MUSEUM /SOBEPS IFS#23 p35
                    Miscellaneous details and features:
                    - ODD: 1) A very strange event, even if not UFO related. 2) An atypical oddity that occurred during a UFO event. 3) Forteana or paranormal features.
                    Type of UFO / Craft:
                    - SCR: Classic Saucer, Disk, Ovoid or Sphere.  Not just some light.
                    - CIG: Torpedo, cigar, fuselage or cylinder shaped vehicle. (Use SCR for a classic "saucer" seen edge-on.)
                    Aliens! Monsters! (sorry, no religious figures):
                    - NOC: No entity / occupant seen by observer(s).
                    Evidence and special effects:
                    - HST: Historical account OR sighting makes history.
      Duration    : 15 min
      Strangeness : 6
      Credibility : 6
      Reference   : VALLEE,Jacques: UFOS IN SPACE- Anatomy of a Phenomenon Henry Regnery 1966 & Ballentine PB 1974 294pp.
                    at index #9
    
    Read 10 reports.

#### CSV output in a file

If you want to output in a [CSV format](https://en.wikipedia.org/wiki/Comma-separated_values) and save the result into a file that could be imported in some spreadsheet software (Microsoft Excel, Google Spreadsheets, Apple Numbers, etc.):

    node udb -f csv --out export.csv --count 10

will create/overwrite an `export.csv` file with the following contents, where the first row list columns names, and each column is separated by a comma:

    "year","month","day","hour","stateOrProvince","country","continent","title","description","locale","duration","evidenceAndSpecialEffectsFlags","miscellaneousFlags","typeOfUfoCraftFlags","elevation","apparentUfoOccupantActivitiesFlags","placesVisitedAndThingsAffectedFlags","latitude","miscellaneousDetailsFlags","relativeAltitude","location","longitude","ref","refIndex","strangeness","credibility","locationFlags","aliensMonstersFlags"
    -593,"?","?","?","Chaldea","Iraq","Middle East","EZEKIEL","FIERY SPHERE LANDS/4 SUPPORTS
    TAKEN FOR A RIDE
    see Bible acct.","Pasture",60,"Historical","Oddity","Fireball",200,"Missing time","Human affected, Apparent Landing",31,"",0,"CHALDEA",-46.17,2,2,8,4,"Map, Ground, Civilian","Pseudo-Human, Monster"
    -322,"?","?","?","Tyre","Lebanon","Middle East","SIEGE/ALEXANDER the GREAT","FLYING SHIELD BEAMS
    WALLS CRUMBLE","Military base",3,"Traces, Historical","","Saucer, Delta",20,"Observation, Ray","Animals affected, Human affected, Building or ANY MANMADE STRUCTURE",33.27,"",100,"TYRE =SUR,LEBANON",-35.22,160,320,9,6,"Map, Ground, Coast, Military, High quality observer(s)","No occupant"
    -213,"?","?","","FI.","Italy","Western Europe","'ALTAR' IN SKY","MAN IN WHITE
    12 SUCH BETWEEN 222 AND 90 B.C.","Pasture",15,"Historical","Oddity, Wave","Cigar, Delta","","","",43.98,"","","HADRIA,ROMAN EMP",-11.27,2,4,8,4,"Map, Ground","Pseudo-Human"
    -170,"?","?","?","RM.","Italy","Western Europe","SPECTACULAR FLEET OF SHIPS IN AIR","NFD","Road + rails",2,"Historical","Oddity, Wave","Saucer, Cigar",384,"","",41.73,"","","LANUPIUM = ALBANO LAZIALE,ITL",-12.64,114,125,6,6,"Map, Ground, Civilian","No occupant"
    70,5,21,"~18:00","UNK","Israel","Middle East","MANY OBS","CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
    LOUD NOISES LATER","Pasture",60,"Technical, Historical","Wave","Saucer, Cigar, Delta, Nightlights","","","",31.77,"Sound","","PALESTINE",-35.23,114,120,7,4,"Map, Ground, Military, Civilian, High quality observer(s)","Figure"
    840,"?","?","","RHN","France","Western Europe","MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'","they admitted flying","Town & city",20,"Historical","","Cigar","","","",45.74,"","","LYON,FRANCE",-4.87,2,7,10,4,"Map, Ground, Civilian, High quality observer(s)","Figure"
    927,"~3","?","","Meuse","France","Western Europe","'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD","","Town & city",15,"Historical","News, Misidentification","Nightlights, Fireball","","","",49.14,"","","VERDUN,FR",-5.36,30,32,3,7,"Map, Ground, Civilian","No occupant"
    989,8,3,"","HNS","Japan","Asia Pacific","UNUSUALLY BRIGHT SCRS FLY","THEN JOIN TOGETHER
    TIME UNKNOWN.   ","Mountains",15,"Historical","","Saucer","","","",35.67,"","","JAPAN/LOC UNK",-139.83,8,0,6,5,"Map, Ground, Civilian","No occupant"
    1015,8,23,"?","HNS","Japan","Asia Pacific","2 SPHERES HVR","2 SML OBJs EXIT..1 smokes
    NFD
    /SOBEPS IFS#23 p35","Mountains",15,"Technical, Historical","","Saucer, Cigar, Fireball","","","",35.63,"","","JAPAN/LOC UNK",-139.8,2,9,4,6,"Map, Ground, Civilian","No occupant"
    1034,"?","?","?","Meuse","France","Western Europe","FIERY OVOID >>SE TURNS >>W","/VERDUN MUSEUM /SOBEPS IFS#23 p35","Farmlands",15,"Historical","Oddity","Saucer, Cigar","","","",49.08,"","","nr VERDUN,FR",-5.33,2,9,6,6,"Map, Ground, Civilian","No occupant"

Note that texts are enclosed in double quotes to preserve line feeds in a cell.

See such a CSV export [imported into Google Spreadsheets](https://docs.google.com/spreadsheets/d/1Uxc0tIOctMQLRzBQU1qWND_xaWsg_-_RsMHzHWS7PXk/edit?usp=sharing).

#### XML output in a file

If you want to output in a [XML format](https://fr.wikipedia.org/wiki/Extensible_Markup_Language) and save the result into a file:

    node udb -f xml --out export.xml --count 10

will create/overwrite an `export.xml` file with the following contents:

    <?xml version="1.0" encoding="UTF-8"?>
    <udb>
    <record><year>-593</year><month/><day/><hour/><location>CHALDEA</location><stateOrProvince>Chaldea</stateOrProvince><country>Iraq</country><continent>Middle East</continent><title>EZEKIEL</title><description>FIERY SPHERE LANDS/4 SUPPORTS
    TAKEN FOR A RIDE
    see Bible acct.</description><locale>Pasture</locale><duration>60</duration><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Fireball</typeOfUfoCraftFlags><latitude>31</latitude><apparentUfoOccupantActivitiesFlags>Missing time</apparentUfoOccupantActivitiesFlags><placesVisitedAndThingsAffectedFlags>Human affected, Apparent Landing</placesVisitedAndThingsAffectedFlags><elevation>200</elevation><miscellaneousDetailsFlags/><relativeAltitude>0</relativeAltitude><longitude>-46.17</longitude><locationFlags>Map, Ground, Civilian</locationFlags><ref>2</ref><refIndex>2</refIndex><strangeness>8</strangeness><credibility>4</credibility><miscellaneousFlags>Oddity</miscellaneousFlags><aliensMonstersFlags>Pseudo-Human, Monster</aliensMonstersFlags></record>
    <record><year>-322</year><month/><day/><hour/><location>TYRE =SUR,LEBANON</location><stateOrProvince>Tyre</stateOrProvince><country>Lebanon</country><continent>Middle East</continent><title>SIEGE/ALEXANDER the GREAT</title><description>FLYING SHIELD BEAMS
    WALLS CRUMBLE</description><locale>Military base</locale><duration>3</duration><evidenceAndSpecialEffectsFlags>Traces, Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Saucer, Delta</typeOfUfoCraftFlags><latitude>33.27</latitude><apparentUfoOccupantActivitiesFlags>Observation, Ray</apparentUfoOccupantActivitiesFlags><placesVisitedAndThingsAffectedFlags>Animals affected, Human affected, Building or ANY MANMADE STRUCTURE</placesVisitedAndThingsAffectedFlags><elevation>20</elevation><miscellaneousDetailsFlags/><relativeAltitude>100</relativeAltitude><longitude>-35.22</longitude><locationFlags>Map, Ground, Coast, Military, High quality observer(s)</locationFlags><ref>160</ref><refIndex>320</refIndex><strangeness>9</strangeness><credibility>6</credibility><miscellaneousFlags/><aliensMonstersFlags>No occupant</aliensMonstersFlags></record>
    <record><year>-213</year><month/><day/><hour/><location>HADRIA,ROMAN EMP</location><stateOrProvince>Firenze</stateOrProvince><country>Italy</country><continent>Western Europe</continent><title>'ALTAR' IN SKY</title><description>MAN IN WHITE
    12 SUCH BETWEEN 222 AND 90 B.C.</description><locale>Pasture</locale><duration>15</duration><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Cigar, Delta</typeOfUfoCraftFlags><latitude>43.98</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-11.27</longitude><locationFlags>Map, Ground</locationFlags><ref>2</ref><refIndex>4</refIndex><strangeness>8</strangeness><credibility>4</credibility><miscellaneousFlags>Oddity, Wave</miscellaneousFlags><aliensMonstersFlags>Pseudo-Human</aliensMonstersFlags></record>
    <record><year>-170</year><month/><day/><hour/><location>LANUPIUM = ALBANO LAZIALE,ITL</location><stateOrProvince>RM</stateOrProvince><country>Italy</country><continent>Western Europe</continent><title>SPECTACULAR FLEET OF SHIPS IN AIR</title><description>NFD</description><locale>Road + rails</locale><duration>2</duration><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Saucer, Cigar</typeOfUfoCraftFlags><latitude>41.73</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation>384</elevation><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-12.64</longitude><locationFlags>Map, Ground, Civilian</locationFlags><ref>114</ref><refIndex>125</refIndex><strangeness>6</strangeness><credibility>6</credibility><miscellaneousFlags>Oddity, Wave</miscellaneousFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags></record>
    <record><year>70</year><month>5</month><day>21</day><hour>~18:00</hour><location>PALESTINE</location><stateOrProvince>UNK</stateOrProvince><country>Israel</country><continent>Middle East</continent><title>MANY OBS</title><description>CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
    LOUD NOISES LATER</description><locale>Pasture</locale><duration>60</duration><evidenceAndSpecialEffectsFlags>Technical, Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Saucer, Cigar, Delta, Nightlights</typeOfUfoCraftFlags><latitude>31.77</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags>Sound</miscellaneousDetailsFlags><relativeAltitude/><longitude>-35.23</longitude><locationFlags>Map, Ground, Military, Civilian, High quality observer(s)</locationFlags><ref>114</ref><refIndex>120</refIndex><strangeness>7</strangeness><credibility>4</credibility><miscellaneousFlags>Wave</miscellaneousFlags><aliensMonstersFlags>Figure</aliensMonstersFlags></record>
    <record><year>840</year><month/><day/><hour/><location>LYON,FRANCE</location><stateOrProvince>Rhône</stateOrProvince><country>France</country><continent>Western Europe</continent><title>MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'</title><description>they admitted flying</description><locale>Town &amp; city</locale><duration>20</duration><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Cigar</typeOfUfoCraftFlags><latitude>45.74</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-4.87</longitude><locationFlags>Map, Ground, Civilian, High quality observer(s)</locationFlags><ref>2</ref><refIndex>7</refIndex><strangeness>10</strangeness><credibility>4</credibility><miscellaneousFlags/><aliensMonstersFlags>Figure</aliensMonstersFlags></record>
    <record><year>927</year><month>~3</month><day/><hour/><location>VERDUN,FR</location><stateOrProvince>Meuse</stateOrProvince><country>France</country><continent>Western Europe</continent><title>'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD</title><description/><locale>Town &amp; city</locale><duration>15</duration><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Nightlights, Fireball</typeOfUfoCraftFlags><latitude>49.14</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-5.36</longitude><locationFlags>Map, Ground, Civilian</locationFlags><ref>30</ref><refIndex>32</refIndex><strangeness>3</strangeness><credibility>7</credibility><miscellaneousFlags>News, Misidentification</miscellaneousFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags></record>
    <record><year>989</year><month>8</month><day>3</day><hour/><location>JAPAN/LOC UNK</location><stateOrProvince>HNS</stateOrProvince><country>Japan</country><continent>Asia Pacific</continent><title>UNUSUALLY BRIGHT SCRS FLY</title><description>THEN JOIN TOGETHER
    TIME UNKNOWN.</description><locale>Mountains</locale><duration>15</duration><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Saucer</typeOfUfoCraftFlags><latitude>35.67</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-139.83</longitude><locationFlags>Map, Ground, Civilian</locationFlags><ref>8</ref><refIndex>0</refIndex><strangeness>6</strangeness><credibility>5</credibility><miscellaneousFlags/><aliensMonstersFlags>No occupant</aliensMonstersFlags></record>
    <record><year>1015</year><month>8</month><day>23</day><hour/><location>JAPAN/LOC UNK</location><stateOrProvince>HNS</stateOrProvince><country>Japan</country><continent>Asia Pacific</continent><title>2 SPHERES HVR</title><description>2 SML OBJs EXIT..1 smokes
    NFD
    /SOBEPS IFS#23 p35</description><locale>Mountains</locale><duration>15</duration><evidenceAndSpecialEffectsFlags>Technical, Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Saucer, Cigar, Fireball</typeOfUfoCraftFlags><latitude>35.63</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-139.8</longitude><locationFlags>Map, Ground, Civilian</locationFlags><ref>2</ref><refIndex>9</refIndex><strangeness>4</strangeness><credibility>6</credibility><miscellaneousFlags/><aliensMonstersFlags>No occupant</aliensMonstersFlags></record>
    <record><year>1034</year><month/><day/><hour/><location>nr VERDUN,FR</location><stateOrProvince>Meuse</stateOrProvince><country>France</country><continent>Western Europe</continent><title>FIERY OVOID &gt;&gt;SE TURNS &gt;&gt;W</title><description>/VERDUN MUSEUM /SOBEPS IFS#23 p35</description><locale>Farmlands</locale><duration>15</duration><evidenceAndSpecialEffectsFlags>Historical</evidenceAndSpecialEffectsFlags><typeOfUfoCraftFlags>Saucer, Cigar</typeOfUfoCraftFlags><latitude>49.08</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-5.33</longitude><locationFlags>Map, Ground, Civilian</locationFlags><ref>2</ref><refIndex>9</refIndex><strangeness>6</strangeness><credibility>6</credibility><miscellaneousFlags>Oddity</miscellaneousFlags><aliensMonstersFlags>No occupant</aliensMonstersFlags></record>
    </udb>
    
For details about input/output formats, please check the [uDb Wiki](https://github.com/RR0/uDb/wiki/uDb-Wiki).
    
## TODO

- See [opened issues](https://github.com/RR0/uDb/issues).
- Add non-regression tests.

## Acknowdlegments

First I would like to thank Larry Hatch for his invaluable work in building this huge quality database.

Also I would like to thank several contributors (_EvillerBob_, _nablator_, _harpysounds_) of an ATS thread for their own analysis of the binary format. 
Notably, they helped [localizing the latitude/longitude bytes](http://www.abovetopsecret.com/forum/thread585935/pg8#pid22029387) and corrected some wrong interpretations I made.

Last but not least, I want to thank [Isaac Koi](http://www.isaackoi.com) for his restless efforts in collecting and sharing UFO data with the permission of their owners.
This work could not have been possible without him, who managed to run the old software, perform an textual export of the data, 
and got the permission from Larry's nephew (the holder of Larry's Power of Attorney) to share Larry's work.
 