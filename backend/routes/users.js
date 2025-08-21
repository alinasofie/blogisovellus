const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

const User = require('../models/user')
const logger = require('../utils/logger')

userRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { title: 1, author: 1 })
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await user.save()
    const userId = savedUser.id

    response.status(201).json(savedUser)
})

module.exports = userRouter
