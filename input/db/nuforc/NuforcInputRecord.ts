import { Record } from '../RecordReader';

export interface NuforcInputRecord extends Record {
  desc: string;
  header: string;
}
