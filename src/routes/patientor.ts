import express from 'express'
import patientorService from '../services/patientorService'
import { toNewPatient, toNewEntries } from '../utils'

const router = express.Router()

// Get diagnoses
router.get('/diagnoses', (_req, res) => {
  console.log('req for diagnoses')
  res.send(patientorService.getDiagnoses())
})

// Get all patient
router.get('/patients', (_req, res) => {
  console.log('req for patients get')
  res.send(patientorService.getSecurePatients())
})

// Get specific patient
router.get('/patients/:id', (req, res) => {
  console.log('req for specific patient')
  const patient = patientorService.findSecurePatient(req.params.id)
  if (patient) {
    res.send(patient)
  } else {
    res.sendStatus(404)
  }
})

// Add a new patient
router.post('/patients', (req, res) => {
  console.log('request for adding a patient')
  try {
    const newPatient = toNewPatient(req.body)
    const addedEntry = patientorService.addPatient(newPatient)
    res.json(addedEntry)
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message
    }
    res.status(404).send(errorMessage)
  }
})

// Add a new entry for an existing patient
router.post('/patients/:id/entries', (req, res) => {
  console.log('attempting to add a patient entry')

  const patient = patientorService.findPatient(req.params.id)

  if (patient) {
    try {
      const newEntry = toNewEntries(req.body)
      res.send(patientorService.addPatientEntries(patient, newEntry))
    } catch (error) {
      let errorMessage = 'Something went wrong.'
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message
      }
      res.status(404).send(errorMessage)
    }

  } else {
    res.sendStatus(404)
  }
})

export default router