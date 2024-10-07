import diagnosesData from '../../data/diagnoses'
import patientData from '../../data/patients-full'
import { v1 as uuid } from 'uuid'

import {
  Diagnosis,
  NewEntries,
  Patient,
  NewPatient,
  SecurePatientData,
  NonSensitivePatient
} from '../types'

const getDiagnoses = (): Diagnosis[] => {
  return diagnosesData
}

const getPatients = (): Patient[] => {
  return patientData
}

const getSecurePatients = (): SecurePatientData[] => {
  return patientData.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) =>
      ({ id, name, dateOfBirth, gender, occupation, entries })
  )
}

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  }
  patientData.push(newPatient)
  return newPatient
}

const addPatientEntries = (patient: Patient, newEntry: NewEntries): Patient => {
  console.log(`adding entry for patient ${JSON.stringify(patient.name)}\n`)

  const entriesWithId = {
    ...newEntry,
    id: uuid()
  }

  const currentPatientId = patient.id
  const patientEntries = patient.entries

  const modifiedEntries = patientEntries.concat(entriesWithId)
  const updatedPatient = {
    ...patient,
    entries: modifiedEntries,
  }

  // now replace patient in database with updatedPatient
  patientData.map(p => p.id !== currentPatientId
    ? p
    : p.entries.push(entriesWithId)
  )

  return updatedPatient
}

const findSecurePatient = (id: string): NonSensitivePatient | undefined => {
  console.log(`patient lookup for ${id}`)
  const entry = patientData.find(p => p.id === id)
  return entry
}

const findPatient = (id: string): Patient | undefined => {
  console.log(`patient lookup for ${id}`)
  const entry = patientData.find(p => p.id === id)
  return entry
}

export default {
  getDiagnoses,
  getPatients,
  getSecurePatients,
  addPatient,
  findSecurePatient,
  addPatientEntries,
  findPatient
}