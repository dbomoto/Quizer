const express = require('express')
const path = require('path')
const router = express.Router()
const bodyParser = require('body-parser')
const urlencoded = bodyParser.urlencoded({extended:false})
const multer = require('multer')
const formInput = multer()
const fs = require('fs')
const ejs = require('ejs')
const mongoose = require('mongoose')
const options = {
  root: path.join(__dirname,'../views')
}


router.use((req,res,next)=>{
  console.log('Request: '+ req.path, 'Time: ' + Date.now())
  next();
})

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
const quizerDB = mongoose.model('quizer', quizerSchema, 'quizer');


router.get('/', (req, res) => {
  res.sendFile('home.html',options)
})
router.route('/add')
  .get((req,res) => {
    res.sendFile('add.html',options)
  })
  .post(formInput.none(),(req,res) => {
    // res.json({status:true})
    quizerDB.findOne({subject:req.body.tests},async (err,doc)=>{
      if (err) {
        res.send({status:"Update failed."})
      }
      doc.items.push({question:req.body.question, answer:req.body.answer})
      await doc.save();
      res.send({status:"Update successfull."})
    })      
  })
router.get('/database', (req, res) => {
  res.sendFile('database.html',options)
})
router.route('/tests')
  .get((req, res) => {
    res.sendFile('tests.html',options)
  })
  .post(formInput.none(),(req,res) => {
    quizerDB.findOne({subject:req.body.subject},'-_id -items._id', (err,doc)=>{

      var objDoc = doc.toJSON();
      res.json(objDoc)

    })   
  })

module.exports = router ; 