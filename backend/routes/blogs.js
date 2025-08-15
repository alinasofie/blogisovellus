const express = require('express')
const Blog = require('../models/blog')
const router = express.Router()

router.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

router.post('/', async (request, response) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes ||0,
    })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

module.exports = router