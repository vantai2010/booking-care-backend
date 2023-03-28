const express = require('express')
require('dotenv').config()

const cors = require('cors')
const PORT = 5000
const router = require('./src/routers/web')
const connectDB = require('./src/config/connectDB')


connectDB()
const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(cors({ origin: true }))

app.use(express.json())



app.use('/api', router)

app.listen(PORT, () => console.log('listening on port', PORT))