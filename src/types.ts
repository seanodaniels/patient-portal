export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation?: string;
  entries: Entry[]
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export interface Discharge {
  date: string;
  criteria?: string;
}
export const dummyDischarge = {
  date: ''
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}
export const dummySickLeave: SickLeave = {
  startDate: '',
  endDate: ''
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum EntriesType {
  Hospital = "Hospital",
  OccupationalHealthcare = "OccupationalHealthcare",
  HealthCheck = "HealthCheck"
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntriesType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: SickLeave;
}

interface HealthCheckEntry extends BaseEntry {
  type: EntriesType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

interface HospitalEntry extends BaseEntry {
  type: EntriesType.Hospital;
  discharge: Discharge;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;


export type EntryWithoutId = UnionOmit<Entry, 'id'>

export type NewEntries = UnionOmit<Entry, 'id'>
export type NewPatient = Omit<Patient, 'id'>
export type SecurePatientData = Omit<Patient, 'ssn'>
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>