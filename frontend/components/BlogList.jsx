import { useEffect, useState } from 'react'
import Blog from './Blog'

const BlogList = () => {
    const [blogs, setBlogs] = useState([])
    useEffect(() => {
        fetch('/api/blogs')
            .then(response => response.json())
            .then(data => setBlogs(data))
            .catch(err => console.error('Virhe blogien haussa:', err))
    }, [])

    return (
        <div>
            <h2>Blogipäivitykset</h2>
            {blogs
                .filter(blog => blog.title && blog.author)
                .map(blog => (
                <Blog key={blog.id || blog._id} blog={blog} />
            ))}
        </div>
    )
}

export default BlogList
