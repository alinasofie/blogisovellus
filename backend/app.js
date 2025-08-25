const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const router = require('./routes/blogs')
const userRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const path = require('path')
const app = express()


mongoose
    .connect(config.MONGO_URI)
    .then(() => {
        logger.info('connected to MONGODB')
    })
    .catch((error) => {
        logger.error('error while connecting to MONGODB:', error.message)
    })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', router)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app