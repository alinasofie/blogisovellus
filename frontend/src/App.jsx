import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom'
import { useState, useEffect } from 'react'
import BlogList from '../components/BlogList'
import blogService from '../services/blogservice'
import loginService from '../services/loginService'
import './App.css'
import Notification from '../components/Notification'
const MainContent = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

    }
    blogService.getAll().then(initialNotes => {
      setBlogs(initialNotes)
    })
  }, [])
  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/blogs')

    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
  }
  
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }
  
  const loginForm = () => (
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
      <button type="submit">log in</button>
    </form>
  )

  const blogForm = (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title
          <input
            type="text"
            value={title}
            placeholder="otsikko"
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type="text"
            value={author}
            placeholder="kirjoittaja"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            type="text"
            value={url}
            placeholder="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
  
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
    } catch {
      setErrorMessage('Blogin lisäys ei onnistunut')
    }

  }

  return (
    <div>
      <h1>Blogisivusto</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        <>
        <h2>Kirjaudu sisään</h2>
        {loginForm()}
        </>
      ) : (
        <>
        <p>{user.name} kirjautunut sisään</p>
        {blogForm}
        <BlogList blogs={blogs} />
        <button onClick={handleLogout}>kirjaudu ulos</button>
        </>
      )}
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/blogs" element={<MainContent />} />
        <Route path="/login" element={<MainContent />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
