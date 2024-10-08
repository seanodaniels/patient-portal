import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import patientorRouter from './routes/patientor'

const app = express()

import cors from 'cors'
app.use(express.json())

app.use(cors())

// const PORT = 3001
console.log(`process.env.PORT is ${process.env.PORT}`)
const PORT = process.env.PORT || 3001

app.get('/api/ping', (_req, res) => {
    console.log('ping received')
    res.send('pong')
})

// app.use('/api/diagnoses', patientorRouter)
app.use('/api', patientorRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})