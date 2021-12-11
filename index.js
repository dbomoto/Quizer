const express = require('express')
const path = require('path')
const app = express()
const quizer = require('./routes/quizer.js')
const mongoose = require('mongoose')


// Connect to database first before initializing the app.
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useFindAndModify: false,
    // useCreateIndex: true,
}).then(()=>{
    console.log('Sataus: Database connected.', "Time: "+ Date.now());

    app.use(express.static(path.join(__dirname,'public')))
    // Api routes
    app.use('/',quizer);
    //404 Not Found Middleware
    app.use(function(req, res, next) {
        res.status(404)
          .type('text')
          .send('Not Found, but app is running');
      });  

    //Schema Setting
    const Schema = mongoose.Schema;
    const quizerSchema = new Schema({
      subject: String,
      items: [{
        question: String,
        answer: String
      }]
    })
    // Mongoose#model(name, [schema], [collection], [skipInit])
    const userData = mongoose.model('quizer', quizerSchema, 'quizer');

    app.listen(process.env.PORT, () => {
      console.log(`Quizer listening at http://localhost:${process.env.PORT}`)
    })


}).catch((err) => console.log(err.message))






