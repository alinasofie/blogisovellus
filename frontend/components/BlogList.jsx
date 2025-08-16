import { useEffect, useState } from 'react'

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
            {blogs.map(blog => (
                <div key={blog.id || blog._id}>
                    <h3>{blog.title}</h3>
                    <p><strong>Kirjoittaja:</strong> {blog.author}</p>
                    <p><strong>Tykkäykset:</strong>{blog.likes}</p>
                    <hr />
                </div>
            ))}
        </div>
    )
}

export default BlogList
