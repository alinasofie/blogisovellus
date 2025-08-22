import React from 'react'
import { useState, useEffect } from 'react'
import BlogList from '../components/BlogList'
import blogService from '../services/blogservice'
import loginService from '../services/loginService'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService
      .getAll().then(initialNotes => {
        setBlogs(initialNotes)
      })
  }, [])

  const addBlog = async (event) => {  
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url
    }
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage('Blogin lisäys ei onnistunut', error)
    }

  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      console.log('logging in as user: ', user)
    } catch (error) {
      setErrorMessage('Kirjautuminen epäonnistui', error)
    }
    
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
          <h2>Uusi blogi</h2>
          <form onSubmit={addBlog}>
            <div>
              <input
                type="text"
                value={title}
                placeholder="Otsikko"
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                value={author}
                placeholder="kirjoittaja"
                onChange={({ target }) => setAuthor(target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                value={url}
                placeholder="url"
                onChange={({ target }) => setUrl(target.value)}
              />
            </div>
            <button type="submit">tallenna</button>
          </form>
          <BlogList />
      </div>
    </>
  )
}

export default App
