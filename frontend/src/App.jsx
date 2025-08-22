import React from 'react'
import { useState, useEffect } from 'react'
import BlogList from '../components/BlogList'
import blogService from '../services/blogservice'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    blogService
      .getAll().then(initialNotes => {
        setBlogs(initialNotes)
      })
  }, [])
  const addBlog = (event) => {  
    event.preventDefault()
    const blogObject = {
      content: newBlog,
      important: Math.random() > 0.5,
    }
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog('')
      })
  }
  const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
  }
  
  return (
    <>
      <div>
          <h1>Blogisovellus</h1>
          <Notification message={errorMessage} />
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>
                username
                <input
                  type="text"
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                  />
              </label>
            </div>
            <div>
              <label>
                password
                <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                />
              </label>
            </div>
            <button type="submit">login</button>
          </form>
          <BlogList />
          <button type="submit" name="postblog" onSubmit={addBlog}>Save</button>
      </div>
    </>
  )
}

export default App
