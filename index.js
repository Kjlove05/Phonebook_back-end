const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')


app.use(cors())
app.use(express.static('build'))
app.use(express.json())



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


morgan.token('body', function (req, res) { 
    return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



 
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
    const date = new Date();
    const length = persons.length
    response.send(`<p>Phonebook has info for ${length} people</p> <p>${date}</p>`)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
  
    if (!id.content) {
      return response.status(400).json({ 
      })
    }
    const person = persons.find(person => {
      console.log(person.id, typeof person.id, id, typeof id, person.id === id)
      return person.id === id
    })
    console.log(person)
    response.json(person)
  })
 
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
app.post('/api/persons', (request, response) => {
    const content = request.body
    console.log(content)
    if (!content.name) {
        return response.status(400).json({ 
          error: 'name is missing' 
        })
      }
    if (!content.number) {
        return response.status(400).json({ 
          error: 'number is missing' 
        })
      }
      const existingPerson = persons.find(
        (person) => person.name.toLowerCase() === content.name.toLowerCase())
        
    if (existingPerson && existingPerson.number === content.number) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
    
    content.id = Math.floor(Math.random() * 1000);
    persons = persons.concat(content)
    response.json(content)

  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})