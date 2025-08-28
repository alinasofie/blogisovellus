import { useState } from 'react'

const Blog = ({ blog }) => {
    const [visible, setVisible] = useState(false)

    return (
        <div className="blog">
            <h3>{blog.title}</h3>
            <p><strong>Kirjoittaja:</strong>{blog.author}</p>
            <button onClick={() => setVisible(!visible)}>
                {visible ? 'Piilota tiedot' : 'Näytä tiedot'}
            </button>
            {visible && (
                <div className="blogDetails">
                    {blog.url && <p><strong>URL:</strong>{blog.url}</p>}
                    <p><strong>Tykkäykset:</strong>{blog.likes ?? 0}</p>
                    <p><strong>Lisännyt:</strong>{blog.user?.name ?? 'Tuntematon käyttäjä'}</p>
                </div>
            )}
        </div>
    )
}

export default Blog
