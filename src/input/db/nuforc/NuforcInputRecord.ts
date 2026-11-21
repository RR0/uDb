import {UdbRecord} from "../UdbRecord.js"

export interface NuforcInputRecord extends UdbRecord {
  source: string;
  duration: string;
  shape: string;
  location: string;
  posted: string;
  occurred: string;
  entered: string;
  reported: string;
  desc: string;
}
