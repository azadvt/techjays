const express = require('express')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middlewares/errorMiddleware')
const connectDB = require('./config/connect-db')
const port = process.env.PORT || 5000
connectDB()
const app = express()

app.use(express.json())

app.use(express.urlencoded({extended:false}))

var cors = require('cors')

app.use(cors())

app.use('/api/auth',require('./routes/auth'))


app.use(errorHandler)


app.listen(port,()=>{
    console.log(`server started in ${port}`)
})