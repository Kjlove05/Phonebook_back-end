
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const mongoose = require('mongoose')
const Person = require('./models/person')
const { response } = require('express')
app.use(cors())
app.use(express.static('build'))
app.use(express.json())


// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = 'mongodb+srv://kj:fullstack@cluster0.zqeex.mongodb.net/phonebookApp?retryWrites=true&w=majority'

mongoose.connect(url)





// const Person = mongoose.model('Person', personSchema)



morgan.token('body', function (req, res) {
  return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))




// app.get('/api/persons', (request, response) => {
//     response.json(persons)
//   })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  const length = persons.length
  response.send(`<p>Phonebook has info for ${length} people</p> <p>${date}</p>`)
})

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)

//     if (!id.content) {
//       return response.status(400).json({
//       })
//     }
//     const person = persons.find(person => {
//       console.log(person.id, typeof person.id, id, typeof id, person.id === id)
//       return person.id === id
//     })
//     console.log(person)
//     response.json(person)
//   })

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(req.params.id).then(person => {
    if(person){
      res.json(person)
    }
    else{
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(person => person.id !== id)

//   response.status(204).end()
// })
app.post('/api/persons', (request, response, next) => {
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
  //   const existingPerson = persons.find(
  //     (person) => person.name.toLowerCase() === content.name.toLowerCase())

  // if (existingPerson && existingPerson.number === content.number) {
  //     return response.status(400).json({
  //         error: 'name must be unique'
  //     })
  // }

  // content.id = Math.floor(Math.random() * 1000);
  // persons = persons.concat(content)
  // response.json(content)

  const person = new Person({
    name: content.name,
    number: content.number,

  })

  person.save().then(Person => {
    response.json(Person)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const content = request.body

  const person = {
    number: content.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})