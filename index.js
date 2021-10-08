// npm install nodemon -D  // installa nodemon como dependencia de desarollo
// npm install express  // se installa express como dependencia obligatoria

// npm install eslint -D  // instala eslint
// ./node_modules/.bin/eslint --init  // crea el archivo de configuracion de eslint

// npm install cors  // Dependencia para permitir que se hagan peticiones a esta API desde otro origen.

// Utilizando commonJS de Node
const express = require('express')
const cors = require('cors')
const requestLogger = require('./middleware/loggerMiddleware')
const app = express()

app.use(cors())
app.use(express.json())


const PORT = process.env.PORT || 3001

app.use(requestLogger)

let notes = [
  {
    id: 1,
    content: 'Tarjeta uno',
    date: '2019-05-03T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Tarjeta dos',
    date: '2019-05-03T17:39:41.080Z',
    important: false
  },
  {
    id: 3,
    content: 'Tarjeta tres',
    date: '2019-05-03T19:00:14.297Z',
    important: true
  }
]

/* Sin express
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
*/

app.get('/', (request, response) => {
  response.send('<h1> Welcome !! </h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  console.log('id received:', request.params.id)
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  console.log('id to delete:', request.params.id)
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }
  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  notes = [...notes, newNote]
  response.status(200).json(newNote).end()
})

app.use((request, response) => {
  console.log('Path not found: ', request.path)
  response.status(404).json({
    error: 'Not found'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
  // console.log('Server running on port: ', PORT);
})
