import express from 'express'
import patientorRouter from './routes/patientor'
const app = express()
const cors = require('cors')
app.use(express.json())

const PORT = 3001

app.use(cors())

app.get('/api/ping', (_req, res) => {
    console.log('ping received')
    res.send('pong')
})

// app.use('/api/diagnoses', patientorRouter)
app.use('/api', patientorRouter)

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})