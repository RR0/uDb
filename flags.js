/**
 * Location of the OBSERVER.
 * @type {{MAP: string, GND: string, CST: string, SEA: string, AIR: string, MIL: string, CIV: string, HQO: string}}
 */
exports.locationFlagsLabels = {
  MAP: 'Coordinates are known.  OK to place event on screen maps.',
  GND: 'At least ONE observer (or radar) was on land.',
  CST: 'Sighting in coastal area, possibly just offshore.',
  SEA: 'Sighting was at sea, typically from some marine craft.',
  AIR: 'Airborne observer.  Observer aboard aircraft.',
  MIL: 'At least ONE observer was military.',
  CIV: 'At least ONE observer was civilian',
  HQO: 'High Quality Observer(s): Scientists, Engineers, well trained individuals. 3 or more people with consistent descriptions.',
};

/**
 * Miscellaneous details and features.
 * @type {{SCI: string, TLP: string, NWS: string, MID: string, HOX: string, CNT: string, ODD: string, WAV: string}}
 */
exports.miscellaneousFlagsLabels = {
  SCI: 'A scientist was involved, as an observer or investigator. Also, Scientific testing of traces or effects of sighting.',
  TLP: '"Telepathy":  Silent or voiceless communication.',
  NWS: 'Report from the news media, or else "sighting made the news".',
  MID: 'Likely Mis-IDentification of mundane object: (Venus, rocket..)',
  HOX: 'Suspicion or indications of a HOAX, journalistic prank etc.',
  CNT: 'Contactee:  Reports from would-be cult leaders -or- repeat "witnesses" with trite and predictable "messages for mankind".',
  ODD: 'Oddity:  1) A very strange event, even if not UFO related. 2) An atypical oddity that occurred during a UFO event. 3) Forteana or paranormal features.',
  WAV: 'Wave or Cluster of UFO sightings.  Sighting is part of a wave.'
};

/**
 * Type of UFO / Craft
 * @type {{SCR: string, CIG: string, DLT: string, NLT: string, PRB: string, FBL: string, SUB: string, NFO: string}}
 */
exports.typeOfUfoCraftFlagsLabels = {
  SCR: 'Classic Saucer, Disk, Ovoid or Sphere.  Not just some light.',
  CIG: 'Torpedo, cigar, fuselage or cylinder shaped vehicle. (Use SCR for a classic "saucer" seen edge-on.)',
  DLT: 'Delta, Vee, boomerang, rectangular UFO.  Sharp corners and edges.',
  NLT: 'Nightlights:  Points of light with no discernable shape.',
  PRB: 'Probe:  Small weird object maneuvers.  Remote controlled craft?',
  FBL: 'Fireball:  Blazing undistinguished form.  Possible meteors etc.',
  SUB: 'Submersible: UFO rises from, or submerges into a body of water.',
  NFO: 'No UFO Craft actually SEEN.  (Not necessarily absent..)'
};

/**
 * Aliens!  Monsters! ( sorry, no religious figures. )
 * @type {{OID: string, RBT: string, PSH: string, MIB: string, MON: string, GNT: string, FIG: string, NOC: string}}
 */
exports.aliensMonstersLabels = {
  OID: 'Humanoid: Smallish alien figure, often "grey".',
  RBT: 'Possible Robot:  May resemble "Grey".  Mechanical motions.',
  PSH: '1) Pseudo-Human: Possible clone, robot or worse. 2) "Human" seen working with or for alien figures.',
  MIB: 'Man-in-Black: 1) PSH impersonating humans. 2) Mysterious man who tries to suppress UFO reports.',
  MON: 'Monster:  Apparent life form fits no standard category.',
  GNT: 'Giant:    Apparent alien larger than most humans.',
  FIG: 'Undefined or poorly seen "figure" or entity.  A shadow.',
  NOC: 'No entity / occupant seen by observer(s).'
};

/**
 * Apparent UFO/Occupant activities.
 * @type {{OBS: string, RAY: string, SMP: string, MST: string, ABD: string, OPR: string, SIG: string, CVS: string}}
 */
exports.apparentUfoOccupantActivitiesLabels = {
  OBS: 'Observation: Surveillance.  Chasing/pacing vehicles.',
  RAY: 'Odd light RAY, searchlight or visible beam.  Anything laserlike.',
  SMP: 'Sampling: Plant, animal, soil, rock, tissue or other specimens.',
  MST: 'Missing Time: Unexplained time-lapse or other time anomaly.',
  ABD: 'Known/suspected human abduction.  Animals also if taken whole.',
  OPR: 'Operations on humans.  Animal Mutilation.  Any invasive surgery.',
  SIG: 'ANY indication of possible signals to, from, between UFOs or their occupants;  -or- responses to human signals.',
  CVS: 'Conversation: ANY communication between "us" and "them"'
};

/**
 * Places visited and things affected.
 * @type {{NUC: string, DRT: string, VEG: string, ANI: string, HUM: string, VEH: string, BLD: string, LND: string}}
 */
exports.placesVisitedAndThingsAffectedLabels = {
  NUC: 'Any nuclear facility: Power plant.  Military.  Research facility.',
  DRT: 'Dirt affected: Traces in soil: landing marks, footprints etc.',
  VEG: 'Plants affected or sampled.  Broken tree limbs.  Crop circles.',
  ANI: 'Animals affected: Panic. Change of behavior. Injuries. Marks.',
  HUM: 'Human affected: Injury. burns. marks. psychology. abduction. death.',
  VEH: 'Vehicle affected: Marks, burns, electro-magnetic (EME) effects.',
  BLD: 'Building or ANY MANMADE STRUCTURE: Roads, Bridges, Power lines..',
  LND: 'Apparent Landing.  UFO (or any part thereof) sets down.'
};

/**
 * Evidence and special effects
 * @type {{PHT: string, RDR: string, RDA: string, EME: string, TRC: string, TCH: string, HST: string, INJ: string}}
 */
exports.evidenceAndSpecialEffectsLabels = {
  PHT: 'Photos, movies or videos taken of UFO and related phenomena.',
  RDR: 'Anomalous Radar traces/blips corresponding to UFO sightings.',
  RDA: 'Radiation or high energy fields detected during or after sighting.',
  EME: 'Electro-Magnetic Effect: Car, radio, lights, instruments.',
  TRC: 'Physical traces discovered ( most any variety. )',
  TCH: 'NEW Technical details.  Clues to alien technology.',
  HST: 'Historical account OR sighting makes history.',
  INJ: 'Wounds, scars, burns etc. as apparent result of close encounter. Resulting illness or death. Mutilations.'
};

/**
 * Miscellaneous details
 * @type {{MIL: string, BBK: string, GSA: string, OGA: string, SND: string, ODR: string, COV: string, CMF: string}}
 */
exports.miscellaneousDetailsLabels = {
  MIL: 'Military investigation: Covert or open, foreign or domestic.',
  BBK: 'US Air Force BLUEBOOK case, regardless of finding.',
  GSA: 'Government Security Agency involvement: FBI, CIA, NSA, NRO, covert security arms of other agencies, foreign & domestic.',
  OGA: 'Other Government Agencies: Police, FAA, NASA, non-covert agency involvement in any way.',
  SND: 'UFO sounds heard or recorded.',
  ODR: 'ODORS associated with UFOs, or given off by them.',
  COV: 'Any indication of official Coverup.  Not simple incompetence.',
  CMF: 'Camouflage:  Apparent attempt of UFO or alien to hide or disguise itself or its operations in any way:  Cloud cigars, flying buses or haystacks,  false scenery or settings..'
};
