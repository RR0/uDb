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
    <record><year/><month/><day/><hour/><location>CHALDEA</location><stateOrProvince>Chaldea</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>EZEKIEL</title><description>FIERY SPHERE LANDS/4 SUPPORTS
    TAKEN FOR A RIDE
    see Bible acct.</description><locale>locale#Pasture</locale><duration>60</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>31</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation>200</elevation><miscellaneousDetailsFlags/><relativeAltitude>0</relativeAltitude><longitude>-46.17</longitude><locationFlags/><ref>2</ref><refIndex>2</refIndex><strangeness>8</strangeness><credibility>4</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    <record><year/><month/><day/><hour/><location>TYRE =SUR,LEBANON</location><stateOrProvince>Tyre</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>SIEGE/ALEXANDER the GREAT</title><description>FLYING SHIELD BEAMS
    WALLS CRUMBLE</description><locale>locale#Military base</locale><duration>3</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>33.27</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation>20</elevation><miscellaneousDetailsFlags/><relativeAltitude>100</relativeAltitude><longitude>-35.22</longitude><locationFlags/><ref>160</ref><refIndex>320</refIndex><strangeness>9</strangeness><credibility>6</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    <record><year/><month/><day/><hour/><location>HADRIA,ROMAN EMP</location><stateOrProvince>Firenze</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>'ALTAR' IN SKY</title><description>MAN IN WHITE
    12 SUCH BETWEEN 222 AND 90 B.C.</description><locale>locale#Pasture</locale><duration>15</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>43.98</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-11.27</longitude><locationFlags/><ref>2</ref><refIndex>4</refIndex><strangeness>8</strangeness><credibility>4</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    <record><year/><month/><day/><hour/><location>LANUPIUM = ALBANO LAZIALE,ITL</location><stateOrProvince>RM</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>SPECTACULAR FLEET OF SHIPS IN AIR</title><description>NFD</description><locale>locale#Road + rails</locale><duration>2</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>41.73</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation>384</elevation><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-12.64</longitude><locationFlags/><ref>114</ref><refIndex>125</refIndex><strangeness>6</strangeness><credibility>6</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    <record><year/><month/><day/><hour/><location>PALESTINE</location><stateOrProvince>UNK</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>MANY OBS</title><description>CHARIOTS+REGIMENTS CIRCLE TOWNS in SKY
    LOUD NOISES LATER</description><locale>locale#Pasture</locale><duration>60</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>31.77</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-35.23</longitude><locationFlags/><ref>114</ref><refIndex>120</refIndex><strangeness>7</strangeness><credibility>4</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    <record><year/><month/><day/><hour/><location>LYON,FRANCE</location><stateOrProvince>Rhône</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>MOB LYNCHES 3 FIGURES FROM 'CLOUDSHIP'</title><description>they admitted flying</description><locale>locale#Town &amp; city</locale><duration>20</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>45.74</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-4.87</longitude><locationFlags/><ref>2</ref><refIndex>7</refIndex><strangeness>10</strangeness><credibility>4</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    <record><year/><month/><day/><hour/><location>VERDUN,FR</location><stateOrProvince>Meuse</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>'FIERY ARMIES' PASS IN SKY HERE +ALL E.FRANCE per Scribe FLODOARD</title><description/><locale>locale#Town &amp; city</locale><duration>15</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>49.14</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-5.36</longitude><locationFlags/><ref>30</ref><refIndex>32</refIndex><strangeness>3</strangeness><credibility>7</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    <record><year/><month/><day/><hour/><location>JAPAN/LOC UNK</location><stateOrProvince>HNS</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>UNUSUALLY BRIGHT SCRS FLY</title><description>THEN JOIN TOGETHER
    TIME UNKNOWN.</description><locale>locale#Mountains</locale><duration>15</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>35.67</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-139.83</longitude><locationFlags/><ref>8</ref><refIndex>0</refIndex><strangeness>6</strangeness><credibility>5</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    <record><year/><month/><day/><hour/><location>JAPAN/LOC UNK</location><stateOrProvince>HNS</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>2 SPHERES HVR</title><description>2 SML OBJs EXIT..1 smokes
    NFD
    /SOBEPS IFS#23 p35</description><locale>locale#Mountains</locale><duration>15</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>35.63</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-139.8</longitude><locationFlags/><ref>2</ref><refIndex>9</refIndex><strangeness>4</strangeness><credibility>6</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    <record><year/><month/><day/><hour/><location>nr VERDUN,FR</location><stateOrProvince>Meuse</stateOrProvince><country>country#undefined</country><continent>continent#undefined</continent><title>FIERY OVOID &gt;&gt;SE TURNS &gt;&gt;W</title><description>/VERDUN MUSEUM /SOBEPS IFS#23 p35</description><locale>locale#Farmlands</locale><duration>15</duration><evidenceAndSpecialEffectsFlags/><typeOfUfoCraftFlags/><latitude>49.08</latitude><apparentUfoOccupantActivitiesFlags/><placesVisitedAndThingsAffectedFlags/><elevation/><miscellaneousDetailsFlags/><relativeAltitude/><longitude>-5.33</longitude><locationFlags/><ref>2</ref><refIndex>9</refIndex><strangeness>6</strangeness><credibility>6</credibility><miscellaneousFlags/><aliensMonstersFlags/></record>
    </udb>
    
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
-  13 (0x0D) : Elevation (1 signed word) in meters (-99 if N/A)
-  15 (0x0F) : Relative altitude (1 signed word) in meters (999 if N/A)
-  17 (0x11) : ?
-  18 (0x12) : Country code (1 byte) (see countries table below)
-  19 (0x13) : Area code (3 chars)
-  23 (0x17) : Location flags
-  24 (0x18) : Miscellaneous flags
-  25 (0x19) : Type of UFO / craft flags
-  26 (0x1A) : Aliens / monsters flags
-  27 (0x1B) : Apparent UFO / occupant activities flags
-  28 (0x1C) : Places visited and things affected flags
-  29 (0x1D) : Evidence and special effects flags
-  30 (0x1E) : Miscellaneous details flags
-  31 (0x6d) : Description (78 chars) as `:`-separated rows.
- 110 (0x6e) : Source code (1 byte) (see `usources.txt` file) 
- 111 (0x6f) : Position in source (1 byte) but [not complete](https://github.com/RR0/uDb/issues/3)
- 112 (0x70) : Strangeness and credibility levels (1 byte), encoded as two hex chars (4 bits:4 bits)

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

### Continents and associated countries

0. North America (Actual Continent including Central America) with countries
    1. Canada
    2. USA
    3. Mexico
    4. Guatemala
    5. Belize
    6. Honduras
    7. El Salvador
    8. Nicaragua
    9. Costa Rica
    10. Panama
1. South America (Actual Continent)
    1. Brazil
    2. Paraguay
    3. Uruguay
    4. Argentina
    5. Chile
    6. Bolivia
    7. Peru
    8. Ecuador
    9. Colombia
    10. Venezuela
    11. Guyanas (all 3 of them)
2. Oceania (AUSTRALIA / NEW ZEALAND  and the great Oceans)
    1. Australia
    2. New Zealand
    3. Atlantic Ocean + islands
    4. Pacific Ocean and non-Asian islands
    5. Caribbean area
    6. Indian Ocean + islands
    7. Arctic above 70 degrees North
    8. Antarctic below 70 degrees South
    9. Iceland
    10. Greenland
3. Western Europe (Actual Continent)
    1. Great Britain and Ireland
    2. Scandanavian and Finland
    3. Germany
    4. Belgium, Netherlands and Luxembourg
    5. France
    6. Spain
    7. Portugal
    8. Austria
    9. Italy
    10. Switzerland
    11. Greece and Island nations
4. Eastern Europe (Includes some former Soviet Republics)
    1. Poland
    2. Czech and Slovak Republics
    3. Hungary
    4. Former Yugoslavia (Province field indicates present republics)
    5. Romania
    6. Bulgaria
    7. Albania
    8. Estonia, Latvia & Lithuania
    9. Belorus
    10. Ukraine
5. Asia Mainland (except Vietnam, Cambodia and Laos)
    1. Red China
    2. Mongolia
    3. India
    4. Pakistan
    5. Afghanistan
    6. imalayan states: Nepal, Bhutan, Shangri-la etc.
    7. Bangladesh
    8. Burma
    9. Korea (both sides)
6. Asia Pacific (except Vietnam, Cambodia and Laos) Small remote islands are under Oceania
    1. Japan
    2. Philippines
    3. Taiwan China
    4. Vietnam
    5. Laos
    6. Cambodia
    7. Thailand
    8. Malaysia
    9. Indonesia
7. Northern and Northwest Africa (North of the Equator)
    1. Egypt
    2. Sudan
    3. Ethiopia
    4. Libya
    5. Tunisia
    6. Algeria
    7. Morocco
    8. Sahara (includes Chad, Niger, Mali, Mauritania and Upper Volta)
    9. Ivory Coast, Ghana, Togo, Benin, Liberia.
    10. Nigeria
8. Southern Africa (Generally on or South of the Equator.)
    1. Rep of South Africa
    2. Zimbabwe & Zambia (Rhodesia)
    3. Angola
    4. Kalahari Desert: Botswana etc.
    5. Mozambique
    6. Tanzania
    7. Uganda
    8. Kenya
    9. Somalia
    10. Congo states (includes Congo, Zaire, Central Afr Rep, Rwanda, Burundi..)
    11. Ivory Coast,Ghana,Togo,Benin,Liberia etc.
    12. Nigeria.
9. Russia and former soviet ()except Baltics, Ukraine & Belorus)
    1. Russia (includes various ethnic Okrugs, all within the former RSFSR)
    2. Georgia
    3. Armenia
    4. Azerbaijan
    5. Kazakh Republic
    6. Turkmen Republic
    7. Uzbek Republic
    8. Tadzhik Republic
10. Middle East (Turkey, Israel, Iran and Arabic speaking lands)
    1. Turkey
    2. Syria
    3. Iraq
    4. Iran
    5. Jordan
    6. Israel
    7. Arabian Peninsula (not Kuwait)
    8. Kuwait
    9. Cyprus
    10. Lebanon
11. Space (Anywhere outside of Earth's Atmosphere)
    1. Earth Orbit.  Space stations, capsules.  Astronauts & Cosmonauts.
    2. The Moon
    3. Venus
    4. Mars
    5. Asteroids
    6. Jupiter
    7. Saturn
    8. Uranus
    9. Neptune
    10. Deep Space
    11. Pluto
    
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
 