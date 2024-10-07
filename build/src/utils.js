"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntries = exports.toNewPatient = void 0;
const types_1 = require("./types");
const isString = (data) => {
    return typeof data === 'string' || data instanceof String;
};
const isNumber = (data) => {
    return typeof data === 'number' || data instanceof Number;
};
const isGender = (data) => {
    return Object.values(types_1.Gender).map(g => g.toString()).includes(data);
};
const isEntriesType = (data) => {
    return Object.values(types_1.EntriesType).map(e => e.toString()).includes(data);
};
const isHealthCheckRating = (data) => {
    return Object.values(types_1.HealthCheckRating).map(g => g.toString()).includes(data.toString());
};
const isSickLeave = (obj) => {
    return (obj !== null
        && typeof obj === 'object'
        && Object.keys(types_1.dummySickLeave).every(k => Object.keys(obj).includes(k)));
};
const isEntriesArray = (data) => {
    return Array.isArray(data);
};
const isEntriesObject = (obj) => {
    return typeof obj === 'object';
};
const isDischarge = (obj) => {
    return (!(obj === null)
        && (typeof obj === 'object')
        && Object.keys(types_1.dummyDischarge).every(k => Object.keys(obj).includes(k)));
};
const isEmployerName = (data) => {
    return typeof data === 'string' || data instanceof String;
};
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        // we will just trust the data to be in correct form
        return object;
    }
    return object.diagnosisCodes;
};
const parseEntries = (data) => {
    if (!data || !isEntriesArray(data)) {
        throw new Error('Incorrect or missing entries.');
    }
    // We know that entries is an array, so now we can iterate through it
    // Lets check if it has a type property, and, if it does, let us make
    // sure it is one of the values we need rather than garbage.
    data.map(e => {
        if (isEntriesObject(e)) {
            // It is an object. Now we can make sure that the value in type
            // is acceptable.
            if ((e.type !== types_1.EntriesType.OccupationalHealthcare)
                && (e.type !== types_1.EntriesType.HealthCheck)
                && (e.type !== types_1.EntriesType.Hospital)) {
                throw new Error('Incorrect type. Check your syntax.');
            }
        }
    });
    return data;
};
const parseType = (data) => {
    if (!data || !isString(data) || !isEntriesType(data)) {
        throw new Error(`Incorrect or missing entries type.`);
    }
    return data;
};
const parseGender = (data) => {
    if (!data || !isString(data) || !isGender(data)) {
        throw new Error('Incorrect or missing gender identity.');
    }
    return data;
};
const parseName = (data) => {
    if (!data || !isString(data)) {
        throw new Error('Incorrect or missing name.');
    }
    return data;
};
const parseCriteria = (data) => {
    if (!data || !isString(data)) {
        throw new Error('Incorrect criteria.');
    }
    return data;
};
const parseDescription = (data) => {
    if (!data || !isString(data)) {
        throw new Error('Incorrect or missing description.');
    }
    return data;
};
const parseSpecialist = (data) => {
    if (!data || !isString(data)) {
        throw new Error('Incorrect or missing specialist.');
    }
    return data;
};
const parseDate = (data) => {
    if (!data || !isString(data)) {
        throw new Error('Incorrect or missing date.');
    }
    return data;
};
const parseSSN = (data) => {
    if (!data || !isString(data)) {
        throw new Error('Incorrect or missing ssn.');
    }
    return data;
};
const parseEmployerName = (data) => {
    if (!data || !isEmployerName(data)) {
        throw new Error('Incorrect or missing employer name');
    }
    return data;
};
const parseSickLeave = (data) => {
    if (!data || !isSickLeave(data)) {
        throw new Error('Incorrect or missing sick leave');
    }
    return data;
};
const parseHealthCheckRating = (data) => {
    if (typeof data === 'undefined' || !isNumber(data) || !isHealthCheckRating(data)) {
        throw new Error(`Incorrect or missing HealthCheckRating. Error: ${data} problem: ${typeof data}`);
    }
    return data;
};
const parseOccupation = (data) => {
    if (!data || !isString(data)) {
        throw new Error('Incorrect or missing occupation.');
    }
    return data;
};
const toNewPatient = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data.');
    }
    const objectBuild = 'entries' in object
        ? Object.assign({}, object) : Object.assign(Object.assign({}, object), { entries: [] });
    if ('name' in objectBuild
        && 'dateOfBirth' in objectBuild
        && 'ssn' in objectBuild
        && 'gender' in objectBuild
        && 'occupation' in objectBuild
        && 'entries' in objectBuild) {
        const newEntry = {
            name: parseName(objectBuild.name),
            dateOfBirth: parseDate(objectBuild.dateOfBirth),
            ssn: parseSSN(objectBuild.ssn),
            gender: parseGender(objectBuild.gender),
            occupation: parseOccupation(objectBuild.occupation),
            entries: parseEntries(objectBuild.entries)
        };
        return newEntry;
    }
    throw new Error('Incorrect data: a field is missing.');
};
exports.toNewPatient = toNewPatient;
const toNewEntries = (obj) => {
    if (!obj || typeof obj !== 'object') {
        throw new Error('Incorrect or missing data.');
    }
    if ('type' in obj
        && 'description' in obj
        && 'date' in obj
        && 'specialist' in obj) {
        const requiredObj = {
            description: parseDescription(obj.description),
            date: parseDate(obj.date),
            specialist: parseSpecialist(obj.specialist),
            type: parseType(obj.type)
        };
        const initialObj = ('diagnosisCodes' in obj)
            ? Object.assign(Object.assign({}, requiredObj), { diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes) }) : Object.assign({}, requiredObj);
        switch (obj.type) {
            case "Hospital":
                if (('discharge' in obj) && (isDischarge(obj.discharge))) {
                    const buildDischarge = ('criteria' in obj.discharge)
                        ? {
                            date: parseDate(obj.discharge.date),
                            criteria: parseCriteria(obj.discharge.criteria)
                        }
                        : {
                            date: parseDate(obj.discharge.date)
                        };
                    const buildFinal = Object.assign(Object.assign({}, initialObj), { type: types_1.EntriesType.Hospital, discharge: Object.assign({}, buildDischarge) });
                    return buildFinal;
                }
                throw new Error('Missing discharge information.');
                break;
            case "OccupationalHealthcare":
                if ('employerName' in obj) {
                    const buildFinal = 'sickLeave' in obj
                        ? Object.assign(Object.assign({}, initialObj), { type: types_1.EntriesType.OccupationalHealthcare, employerName: parseEmployerName(obj.employerName), sickLeave: parseSickLeave(obj.sickLeave) }) : Object.assign(Object.assign({}, initialObj), { type: types_1.EntriesType.OccupationalHealthcare, employerName: parseEmployerName(obj.employerName) });
                    return buildFinal;
                }
                throw new Error('Incorrect or malformed data.');
                break;
            case "HealthCheck":
                if ('healthCheckRating' in obj) {
                    const buildFinal = Object.assign(Object.assign({}, initialObj), { type: types_1.EntriesType.HealthCheck, healthCheckRating: parseHealthCheckRating(obj.healthCheckRating) });
                    return buildFinal;
                }
                throw new Error('Incorrect or malformed data.');
                break;
            default:
                // do stuff
                throw new Error('Incorrect or malformed data.');
                break;
        }
        return obj;
    }
    throw new Error('Incorrect data: a field is missing.');
};
exports.toNewEntries = toNewEntries;
