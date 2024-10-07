"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientorService_1 = __importDefault(require("../services/patientorService"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
// Get diagnoses
router.get('/diagnoses', (_req, res) => {
    console.log('req for diagnoses');
    res.send(patientorService_1.default.getDiagnoses());
});
// Get all patient
router.get('/patients', (_req, res) => {
    console.log('req for patients get');
    res.send(patientorService_1.default.getSecurePatients());
});
// Get specific patient
router.get('/patients/:id', (req, res) => {
    console.log('req for specific patient');
    const patient = patientorService_1.default.findSecurePatient(req.params.id);
    if (patient) {
        res.send(patient);
    }
    else {
        res.sendStatus(404);
    }
});
// Add a new patient
router.post('/patients', (req, res) => {
    console.log('request for adding a patient');
    try {
        const newPatient = (0, utils_1.toNewPatient)(req.body);
        const addedEntry = patientorService_1.default.addPatient(newPatient);
        res.json(addedEntry);
    }
    catch (error) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(404).send(errorMessage);
    }
});
// Add a new entry for an existing patient
router.post('/patients/:id/entries', (req, res) => {
    console.log('attempting to add a patient entry');
    const patient = patientorService_1.default.findPatient(req.params.id);
    if (patient) {
        try {
            const newEntry = (0, utils_1.toNewEntries)(req.body);
            res.send(patientorService_1.default.addPatientEntries(patient, newEntry));
        }
        catch (error) {
            let errorMessage = 'Something went wrong.';
            if (error instanceof Error) {
                errorMessage += ' Error: ' + error.message;
            }
            res.status(404).send(errorMessage);
        }
    }
    else {
        res.sendStatus(404);
    }
});
exports.default = router;
