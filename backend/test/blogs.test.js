const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  let userId

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    const savedUser = await user.save()
    userId = savedUser.id

    const blogObjects = helper.initialNotes.map(note => {
      return new Blog({ ...note, user: userId })
    })
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

  })
  test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific blog is within the returned notes', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(e => e.title)
    assert(titles.includes('HTML is easy'))
  })
  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.notesInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert.deepStrictEqual(resultBlog.body, blogToView)
    })
    test('fails with statuscode 404 if blog doesnt exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })
    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })
  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Alina',
        url: 'http://example.com',
        likes: 15,
        userId: userId
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtEnd = await helper.notesInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialNotes.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('async/await simplifies making async calls'))
    })
    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {}
      await api.post('/api/blogs').send(newBlog).expect(400)
      const blogsAtEnd = await helper.notesInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialNotes.length)
    })
  })
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.notesInDb()
      const blogToDelete = blogsAtStart[0]
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
      const blogsAtEnd = await helper.notesInDb()
      const titles = blogsAtEnd.map(n => n.title)
      assert(!titles.includes(blogToDelete.title))
      assert.strictEqual(blogsAtEnd.length, helper.initialNotes.length - 1)
    })
  })

  describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })
    test('creation falls with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
