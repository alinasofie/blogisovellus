const Blog = require('../models/blog')
const User = require('../models/user')

const initialNotes = [
  {
    title: 'HTML is easy',
    author: 'Alina',
    url: 'http://example.com',
    likes: 12
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Alina',
    url: 'http://example.com',
    likes: 15
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const notesInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => {
    const obj = blog.toJSON()
    obj.user = obj.user.toString()
    return obj
  })
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb, usersInDb
}