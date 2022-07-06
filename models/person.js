const { application } = require('express')
const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url,  { useNewUrlParser: true })
.then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type:String, 
      minLength: 3,
      required: true
  },
    number: {
      type:Number, 
      minLength:8,
      required: true
  }
})

var contentSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  number: { type: String, required: true, minLength: 8 }
});

contentSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Person', personSchema)