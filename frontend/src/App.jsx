import { useState, useEffect, useRef } from 'react'
import BlogList from '../components/BlogList'
import blogService from '../services/blogservice'
import loginService from '../services/loginService'
import './App.css'
import Notification from '../components/Notification'
import LoginForm from '../components/LoginForm'
import Togglable from '../components/togglable'
import BlogForm from '../components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorMessageType, setErrorMessageType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

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
      setLoginVisible(false)

    } catch {
      setErrorMessage('wrong credentials')
      setErrorMessageType("error")
      setTimeout(() => {
        setErrorMessage(null)
        setErrorMessageType(null)
      }, 5000)
    }
    
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} type={errorMessageType} />
        <h2>Log in to the blog site</h2>
        {!loginVisible && (
          <button onClick={() => setLoginVisible(true)}>log in</button>
        )}
        {loginVisible && (
          <div>
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin} 
            />
            <button onClick={() => setLoginVisible(false)}>cancel</button>
          </div>
        )}
      </div>
    )
  }
  return (
    <div>
      <h1>Blog app</h1>
      <Notification message={errorMessage} type={errorMessageType}/>
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              blogs={blogs}
              setBlogs={setBlogs}
              setErrorMessage={setErrorMessage}
              setErrorMessageType={setErrorMessageType}
              toggleVisibility={() => blogFormRef.current.toggleVisibility()}
            />
          </Togglable>
          <BlogList blogs={blogs} />
          <button onClick={handleLogout}>Log out</button>
        </div>
    </div>
  )
}

export default App
