import {
  Entry,
  NewPatient,
  Gender,
  NewEntries,
  Diagnosis,
  Discharge,
  SickLeave,
  dummySickLeave,
  dummyDischarge,
  HealthCheckRating,
  EntriesType
} from './types'

const isString = (data: unknown): data is string => {
  return typeof data === 'string' || data instanceof String
}

const isNumber = (data: unknown): data is number => {
  return typeof data === 'number' || data instanceof Number
}

const isGender = (data: string): data is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(data)
}

const isEntriesType = (data: string): data is EntriesType => {
  return Object.values(EntriesType).map(e => e.toString()).includes(data)
}

const isHealthCheckRating = (data: number): data is HealthCheckRating => {
  return Object.values(HealthCheckRating).map(g => g.toString()).includes(data.toString())
}

const isSickLeave = (obj: unknown): obj is SickLeave => {
  return (
    obj !== null
    && typeof obj === 'object'
    && Object.keys(dummySickLeave).every(k => Object.keys(obj).includes(k))
  )
}

const isEntriesArray = (data: unknown): data is Array<Entry> => {
  return Array.isArray(data)
}

const isEntriesObject = (obj: unknown): obj is object => {
  return typeof obj === 'object'
}

const isDischarge = (obj: unknown): obj is Discharge => {
  return (
    !(obj === null)
    && (typeof obj === 'object')
    && Object.keys(dummyDischarge).every(k => Object.keys(obj).includes(k))
  )
}

const isEmployerName = (data: unknown): data is string => {
  return typeof data === 'string' || data instanceof String
}

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return object as Array<Diagnosis['code']>
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>
}

const parseEntries = (data: unknown): Array<Entry> => {
  if (!data || !isEntriesArray(data)) {
    throw new Error('Incorrect or missing entries.')
  }

  // We know that entries is an array, so now we can iterate through it
  // Lets check if it has a type property, and, if it does, let us make
  // sure it is one of the values we need rather than garbage.
  data.map(e => {
    if (isEntriesObject(e)) {
      // It is an object. Now we can make sure that the value in type
      // is acceptable.
      if (
        (e.type !== EntriesType.OccupationalHealthcare)
        && (e.type !== EntriesType.HealthCheck)
        && (e.type !== EntriesType.Hospital)
      ) {
        throw new Error('Incorrect type. Check your syntax.')
      }
    }
  })
  return data
}

const parseType = (data: unknown): EntriesType => {
  if (!data || !isString(data) || !isEntriesType(data)) {
    throw new Error(`Incorrect or missing entries type.`)
  }
  return data
}

const parseGender = (data: unknown): Gender => {
  if (!data || !isString(data) || !isGender(data)) {
    throw new Error('Incorrect or missing gender identity.')
  }
  return data
}

const parseName = (data: unknown): string => {
  if (!data || !isString(data)) {
    throw new Error('Incorrect or missing name.')
  }
  return data
}

const parseCriteria = (data: unknown): string => {
  if (!data || !isString(data)) {
    throw new Error('Incorrect criteria.')
  }
  return data
}

const parseDescription = (data: unknown): string => {
  if (!data || !isString(data)) {
    throw new Error('Incorrect or missing description.')
  }
  return data
}

const parseSpecialist = (data: unknown): string => {
  if (!data || !isString(data)) {
    throw new Error('Incorrect or missing specialist.')
  }
  return data
}

const parseDate = (data: unknown): string => {
  if (!data || !isString(data)) {
    throw new Error('Incorrect or missing date.')
  }
  return data
}

const parseSSN = (data: unknown): string => {
  if (!data || !isString(data)) {
    throw new Error('Incorrect or missing ssn.')
  }
  return data
}

const parseEmployerName = (data: unknown): string => {
  if (!data || !isEmployerName(data)) {
    throw new Error('Incorrect or missing employer name')
  }
  return data
}

const parseSickLeave = (data: unknown): SickLeave => {
  if (!data || !isSickLeave(data)) {
    throw new Error('Incorrect or missing sick leave')
  }
  return data
}

const parseHealthCheckRating = (data: unknown): HealthCheckRating => {
  if (typeof data === 'undefined' || !isNumber(data) || !isHealthCheckRating(data)) {
    throw new Error(`Incorrect or missing HealthCheckRating. Error: ${data} problem: ${typeof data}`)
  }
  return data
}

const parseOccupation = (data: unknown): string => {
  if (!data || !isString(data)) {
    throw new Error('Incorrect or missing occupation.')
  }
  return data
}

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data.')
  }

  const objectBuild = 'entries' in object
    ? {
      ...object
    }
    : {
      ...object,
      entries: []
    }

  if (
    'name' in objectBuild
    && 'dateOfBirth' in objectBuild
    && 'ssn' in objectBuild
    && 'gender' in objectBuild
    && 'occupation' in objectBuild
    && 'entries' in objectBuild
  ) {
    const newEntry: NewPatient = {
      name: parseName(objectBuild.name),
      dateOfBirth: parseDate(objectBuild.dateOfBirth),
      ssn: parseSSN(objectBuild.ssn),
      gender: parseGender(objectBuild.gender),
      occupation: parseOccupation(objectBuild.occupation),
      entries: parseEntries(objectBuild.entries)
    }
    return newEntry
  }

  throw new Error('Incorrect data: a field is missing.')
}

export const toNewEntries = (obj: unknown): NewEntries => {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Incorrect or missing data.')
  }

  if (
    'type' in obj
    && 'description' in obj
    && 'date' in obj
    && 'specialist' in obj
  ) {

    const requiredObj = {
      description: parseDescription(obj.description),
      date: parseDate(obj.date),
      specialist: parseSpecialist(obj.specialist),
      type: parseType(obj.type)
    }

    const initialObj = ('diagnosisCodes' in obj)
      ? {
        ...requiredObj,
        diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes)
      }
      : {
        ...requiredObj
      }

    switch (obj.type) {
      case "Hospital":

        if (
          ('discharge' in obj) && (isDischarge(obj.discharge))
        ) {
          const buildDischarge: Discharge = ('criteria' in obj.discharge)
            ? {
              date: parseDate(obj.discharge.date),
              criteria: parseCriteria(obj.discharge.criteria)
            }
            : {
              date: parseDate(obj.discharge.date)
            }
          const buildFinal: NewEntries = {
            ...initialObj,
            type: EntriesType.Hospital,
            discharge: {
              ...buildDischarge
            }
          }
          return buildFinal
        }
        throw new Error('Missing discharge information.')
        break

      case "OccupationalHealthcare":
        if ('employerName' in obj) {

          const buildFinal: NewEntries = 'sickLeave' in obj
            ? {
              ...initialObj,
              type: EntriesType.OccupationalHealthcare,
              employerName: parseEmployerName(obj.employerName),
              sickLeave: parseSickLeave(obj.sickLeave)
            }
            : {
              ...initialObj,
              type: EntriesType.OccupationalHealthcare,
              employerName: parseEmployerName(obj.employerName)
            }
          return buildFinal
        }
        throw new Error('Incorrect or malformed data.')
        break

      case "HealthCheck":
        if ('healthCheckRating' in obj) {
          const buildFinal: NewEntries = {
            ...initialObj,
            type: EntriesType.HealthCheck,
            healthCheckRating: parseHealthCheckRating(obj.healthCheckRating)
          }
          return buildFinal
        }
        throw new Error('Incorrect or malformed data.')
        break

      default:
        // do stuff
        throw new Error('Incorrect or malformed data.')
        break

    }
    return obj as NewEntries
  }


  throw new Error('Incorrect data: a field is missing.')
}