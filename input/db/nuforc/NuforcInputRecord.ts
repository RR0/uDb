import { Record } from '../RecordReader';

export interface NuforcInputRecord extends Record {
  duration: string;
  shape: string;
  location: string;
  posted: string;
  occurred: string;
  entered: string;
  reported: string;
  desc: string;
}
