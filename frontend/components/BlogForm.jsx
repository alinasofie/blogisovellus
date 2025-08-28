import { useState } from 'react'
import blogService from '../services/blogservice'


const BlogForm = ({ setBlogs, blogs, setErrorMessage, setErrorMessageType, toggleVisibility }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = async (event) => {
        event.preventDefault()
        const blogObject = { title, author, url }
        try {
            const returnedBlog = await blogService.create(blogObject)
            setBlogs(blogs.concat(returnedBlog))
            setTitle('')
            setAuthor('')
            setUrl('')
            toggleVisibility()
            setErrorMessage(`Uusi blogi lisätty: ${returnedBlog.title}, kirjoittaja: ${returnedBlog.author}`)
            setErrorMessageType('success')
            setTimeout(() => {
                setErrorMessage(null)
                setErrorMessageType(null)
            }, 5000)
        } catch {
            setErrorMessage('Blogin lisäys ei onnistunut')
            setErrorMessageType("error")
            setTimeout(() => {
                setErrorMessage(null)
                setErrorMessageType(null)
            }, 5000)
        }
    }

    return (
        <div>
            <h2>Create a new blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    <label>
                        title
                        <input
                            type="text"
                            value={title}
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
                            onChange={({ target }) => setUrl(target.value)}
                        />
                    </label>
                    <button type="submit">create</button>
                </div>
            </form>
        </div>
    )}

export default BlogForm