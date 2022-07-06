const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = 'mongodb+srv://kj:fullstack@cluster0.zqeex.mongodb.net/phonebookApp?retryWrites=true&w=majority'
mongoose.connect(url, { useNewUrlParser: true })
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    Person
      .find({})
      .then(results => {
        results.forEach(persons => {
          console.log(persons)
          mongoose.connection.close()
        })})
    if (process.argv.length > 3) {
      const person = new Person({
        name: name,
        number: number,
      })
      person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        return mongoose.connection.close()
      })}
  })
  .catch((err) => console.log(err))
