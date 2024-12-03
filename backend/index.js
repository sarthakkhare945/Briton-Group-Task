const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const contactRoutes = require("./routes/contactRoutes");
const taskRoutes = require('./routes/taskRoutes')
const multer = require('multer');
const connectDb = require('./db/db');
const upload = multer();

const app = express()
const PORT = process.env.PORT || 8080
console.log('port',PORT)

app.use(cors())
app.use(bodyParser.json())
// using multer for formdata requests
app.use(upload.none());

connectDb()
app.use('/api',contactRoutes)
app.use('/api/task',taskRoutes)

app.get('/',(req,res)=>{
    res.send('Hello from server')
})

app.listen(PORT,()=>{
    console.log(`Sserver is running on port ${PORT}`)
})