require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')

const uri = process.env.TEST_MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(uri)
    .then(() => {
        console.log('Yhdistetty MongoDB-tietokantaan')

    })
    .catch((err) => console.error('Virhe yhdistettäessä:', err))


const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})


const Blog = mongoose.model('Blog', blogSchema)
const blog1 = new Blog({
    title: 'Ensimmäinen blogi',
    author: 'Alina',
    url: 'http://example.com/eka',
    likes: 5
})

const blog2 = new Blog({
    title: 'Toinen blogi',
    author: 'Alina',
    url: 'http://example.com/toka',
    likes: 7
})

Blog.insertMany([blog1, blog2])
    .then(() => {
        console.log('Blogipostaukset lisätty')
        mongoose.connection.close()
    })
    .catch((err) => {
        console.error('Vire tallennuksessa:', err)
        mongoose.connection.close()
    })




