"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diagnoses_1 = __importDefault(require("../../data/diagnoses"));
const patients_full_1 = __importDefault(require("../../data/patients-full"));
const uuid_1 = require("uuid");
const getDiagnoses = () => {
    return diagnoses_1.default;
};
const getPatients = () => {
    return patients_full_1.default;
};
const getSecurePatients = () => {
    return patients_full_1.default.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({ id, name, dateOfBirth, gender, occupation, entries }));
};
const addPatient = (entry) => {
    const newPatient = Object.assign({ id: (0, uuid_1.v1)() }, entry);
    patients_full_1.default.push(newPatient);
    return newPatient;
};
const addPatientEntries = (patient, newEntry) => {
    console.log(`adding entry for patient ${JSON.stringify(patient.name)}\n`);
    const entriesWithId = Object.assign(Object.assign({}, newEntry), { id: (0, uuid_1.v1)() });
    const currentPatientId = patient.id;
    const patientEntries = patient.entries;
    const modifiedEntries = patientEntries.concat(entriesWithId);
    const updatedPatient = Object.assign(Object.assign({}, patient), { entries: modifiedEntries });
    // now replace patient in database with updatedPatient
    patients_full_1.default.map(p => p.id !== currentPatientId
        ? p
        : p.entries.push(entriesWithId));
    return updatedPatient;
};
const findSecurePatient = (id) => {
    console.log(`patient lookup for ${id}`);
    const entry = patients_full_1.default.find(p => p.id === id);
    return entry;
};
const findPatient = (id) => {
    console.log(`patient lookup for ${id}`);
    const entry = patients_full_1.default.find(p => p.id === id);
    return entry;
};
exports.default = {
    getDiagnoses,
    getPatients,
    getSecurePatients,
    addPatient,
    findSecurePatient,
    addPatientEntries,
    findPatient
};
