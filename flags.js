/**
 * Location of the OBSERVER.
 * @type {{MAP: string, GND: string, CST: string, SEA: string, AIR: string, MIL: string, CIV: string, HQO: string}}
 */
exports.locationFlagsLabels = {
  MAP: {
    name: 'Map',
    description: 'Coordinates are known.  OK to place event on screen maps.'
  },
  GND: {
    name: 'Ground',
    description: 'At least ONE observer (or radar) was on land.'
  },
  CST: {
    name: 'Coast',
    description: 'Sighting in coastal area, possibly just offshore.'
  },
  SEA: {
    name: 'Sea',
    description: 'Sighting was at sea, typically from some marine craft.'
  },
  AIR: {
    name: 'Airborne',
    description: 'Airborne observer.  Observer aboard aircraft.'
  },
  MIL: {
    name: 'Military',
    description: 'At least ONE observer was military.'
  },
  CIV: {
    name: 'Civilian',
    description: 'At least ONE observer was civilian'
  },
  HQO: {
    name: 'High quality observer(s)',
    description: 'Observer(s) were scientists, Engineers, well trained individuals. 3 or more people with consistent descriptions.'
  },
};

/**
 * Miscellaneous details and features.
 * @type {{SCI: string, TLP: string, NWS: string, MID: string, HOX: string, CNT: string, ODD: string, WAV: string}}
 */
exports.miscellaneousFlagsLabels = {
  SCI: {
    name: 'Scientist',
    description: 'A scientist was involved, as an observer or investigator. Also, Scientific testing of traces or effects of sighting.'
  },
  TLP: {
    name: 'Telepathy',
    description: 'Silent or voiceless communication.'
  },
  NWS: {
    name: 'News',
    description: 'Report from the news media, or else "sighting made the news".'
  },
  MID: {
    name: 'Misidentification',
    description: 'Likely Mis-IDentification of mundane object: (Venus, rocket..)'
  },
  HOX: {
    name: 'Hoax',
    description: 'Suspicion or indications of a HOAX, journalistic prank etc.'
  },
  CNT: {
    name: 'Contactee',
    description: 'Reports from would-be cult leaders -or- repeat "witnesses" with trite and predictable "messages for mankind".'
  },
  ODD: {
    name: 'Oddity',
    description: '1) A very strange event, even if not UFO related. 2) An atypical oddity that occurred during a UFO event. 3) Forteana or paranormal features.'
  },
  WAV: {
    name: 'Wave',
    description: 'Wave or cluster of UFO sightings.  Sighting is part of a wave.'
  }
};

/**
 * Type of UFO / Craft
 * @type {{SCR: string, CIG: string, DLT: string, NLT: string, PRB: string, FBL: string, SUB: string, NFO: string}}
 */
exports.typeOfUfoCraftFlagsLabels = {
  SCR: {
    name: 'Saucer',
    description: 'Classic Saucer, Disk, Ovoid or Sphere.  Not just some light.'
  },
  CIG: {
    name: 'Cigar',
    description: 'Torpedo, cigar, fuselage or cylinder shaped vehicle. (Use SCR for a classic "saucer" seen edge-on.)'
  },
  DLT: {
    name: 'Delta',
    description: 'Delta, Vee, boomerang, rectangular UFO.  Sharp corners and edges.'
  },
  NLT: {
    name: 'Nightlights',
    description: 'Points of light with no discernable shape.'
  },
  PRB: {
    name: 'Probe',
    description: 'Small weird object maneuvers.  Remote controlled craft?'
  },
  FBL: {
    name: 'Fireball',
    description: 'Blazing undistinguished form.  Possible meteors etc.'
  },
  SUB: {
    name: 'Submersible',
    description: 'UFO rises from, or submerges into a body of water.'
  },
  NFO: {
    name: 'No UFO',
    description: 'No UFO Craft actually SEEN.  (Not necessarily absent..)'
  }
};

/**
 * Aliens!  Monsters! ( sorry, no religious figures. )
 * @type {{OID: string, RBT: string, PSH: string, MIB: string, MON: string, GNT: string, FIG: string, NOC: string}}
 */
exports.aliensMonstersLabels = {
  OID: {
    name: 'Humanoid',
    description: 'Smallish alien figure, often "grey".'
  },
  RBT: {
    name: 'Robot',
    description: 'May resemble "Grey".  Mechanical motions.'
  },
  PSH: {
    name: 'Pseudo-Human',
    description: '1) Possible clone, robot or worse. 2) "Human" seen working with or for alien figures.'
  },
  MIB: {
    name: 'Man-in-Black',
    description: '1) PSH impersonating humans. 2) Mysterious man who tries to suppress UFO reports.'
  },
  MON: {
    name: 'Monster',
    description: 'Apparent life form fits no standard category.'
  },
  GNT: {
    name: 'Giant',
    description: 'Apparent alien larger than most humans.'
  },
  FIG: {
    name: 'Figure',
    description: 'Undefined or poorly seen "figure" or entity.  A shadow.'
  },
  NOC: {
    name: 'No occupant',
    description: 'No entity / occupant seen by observer(s).'
  }
};

/**
 * Apparent UFO/Occupant activities.
 * @type {{OBS: string, RAY: string, SMP: string, MST: string, ABD: string, OPR: string, SIG: string, CVS: string}}
 */
exports.apparentUfoOccupantActivitiesLabels = {
  OBS: {
    name: 'Observation',
    description: 'Observation: Surveillance.  Chasing/pacing vehicles.'
  },
  RAY: {
    name: 'Ray',
    description: 'Odd light RAY, searchlight or visible beam.  Anything laserlike.'
  },
  SMP: {
    name: 'Sampling',
    description: 'Plant, animal, soil, rock, tissue or other specimens.'
  },
  MST: {
    name: 'Missing time',
    description: 'Unexplained time-lapse or other time anomaly.'
  },
  ABD: {
    name: 'Abduction',
    description: 'Known/suspected human abduction.  Animals also if taken whole.'
  },
  OPR: {
    name: 'Operations',
    description: 'on humans.  Animal Mutilation.  Any invasive surgery.'
  },
  SIG: {
    name: 'Signal',
    description: 'ANY indication of possible signals to, from, between UFOs or their occupants;  -or- responses to human signals.'
  },
  CVS: {
    name: 'Conversation',
    description: 'ANY communication between "us" and "them"'
  }
};

/**
 * Places visited and things affected.
 * @type {{NUC: string, DRT: string, VEG: string, ANI: string, HUM: string, VEH: string, BLD: string, LND: string}}
 */
exports.placesVisitedAndThingsAffectedLabels = {
  NUC: {
    name: 'Nuclear',
    description: 'Any nuclear facility: Power plant.  Military.  Research facility.'
  },
  DRT: {
    name: 'Dirt',
    description: 'affected: Traces in soil: landing marks, footprints etc.'
  },
  VEG: {
    name: 'Plants affected or sampled',
    description: 'Broken tree limbs.  Crop circles.'
  },
  ANI: {
    name: 'Animals affected',
    description: 'Panic. Change of behavior. Injuries. Marks.'
  },
  HUM: {
    name: 'Human affected',
    description: 'Injury. burns. marks. psychology. abduction. death.'
  },
  VEH: {
    name: 'Vehicle affected',
    description: 'Marks, burns, electro-magnetic (EME) effects.'
  },
  BLD: {
    name: 'Building or ANY MANMADE STRUCTURE',
    description: 'Roads, Bridges, Power lines..'
  },
  LND: {
    name: 'Apparent Landing',
    description: 'UFO (or any part thereof) sets down.'
  }
};

/**
 * Evidence and special effects
 * @type {{PHT: string, RDR: string, RDA: string, EME: string, TRC: string, TCH: string, HST: string, INJ: string}}
 */
exports.evidenceAndSpecialEffectsLabels = {
  PHT: {
    name: 'Photos',
    description: 'Photos, movies or videos taken of UFO and related phenomena.'
  },
  RDR: {
    name: 'Radar',
    description: 'Anomalous Radar traces/blips corresponding to UFO sightings.'
  },
  RDA: {
    name: 'Radiation',
    description: 'Radiation or high energy fields detected during or after sighting.'
  },
  EME: {
    name: 'Electro-Magnetic Effect',
    description: 'on Car, radio, lights, instruments.'
  },
  TRC: {
    name: 'Traces',
    description: 'Physical traces discovered (most any variety)'
  },
  TCH: {
    name: 'Technical',
    description: 'NEW Technical details.  Clues to alien technology.'
  },
  HST: {
    name: 'Historical',
    description: 'Historical account OR sighting makes history.'
  },
  INJ: {
    name: 'Injuries',
    description: 'Wounds, scars, burns etc. as apparent result of close encounter. Resulting illness or death. Mutilations.'
  }
};

/**
 * Miscellaneous details
 * @type {{MIL: string, BBK: string, GSA: string, OGA: string, SND: string, ODR: string, COV: string, CMF: string}}
 */
exports.miscellaneousDetailsLabels = {
  MIL: {
    name: 'Military investigation',
    description: 'Covert or open, foreign or domestic.'
  },
  BBK: {
    name: 'Blue Book',
    description: 'US Air Force BLUEBOOK case, regardless of finding.'
  },
  GSA: {
    name: 'Government Security Agency involvement',
    description: 'FBI, CIA, NSA, NRO, covert security arms of other agencies, foreign & domestic.'
  },
  OGA: {
    name: 'Other government agencies',
    description: 'Police, FAA, NASA, non-covert agency involvement in any way.'
  },
  SND: {
    name: 'Sound',
    description: 'UFO sounds heard or recorded.'
  },
  ODR: {
    name: 'Odors',
    description: 'ODORS associated with UFOs, or given off by them.'
  },
  COV: {
    name: 'Coverup',
    description: 'Any indication of official Coverup.  Not simple incompetence.'
  },
  CMF: {
    name: 'Camouflage',
    description: 'Apparent attempt of UFO or alien to hide or disguise itself or its operations in any way: Cloud cigars, flying buses or haystacks, false scenery or settings..'
  }
};
