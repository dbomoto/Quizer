const express = require('express')
const path = require('path')
const router = express.Router()
const bodyParser = require('body-parser')
const bodyURL = bodyParser.urlencoded({extended:false});
const bodyJSON = bodyParser.json();
const multer = require('multer')
const formInput = multer()
const fs = require('fs')
const ejs = require('ejs')
const mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId;
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
router.route('/edit')
  .put(formInput.none(),async (req,res) => {

    await quizerDB.findOneAndUpdate({subject:req.body.subject,'items._id':ObjectId(req.body.editID)},{'items.$.question':req.body.editQuestion,'items.$.answer':req.body.editAnswer},{returnOriginal:false})

    res.status(200).send('Updated')

  })
  .delete(formInput.none(), async(req,res) => {

    await quizerDB.findOneAndUpdate({
      subject: req.body.subject
    },{
      '$pull':{
        'items':{
          '_id':ObjectId(req.body.editID)
        }
      }
    },{
      multi:true,
      returnOriginal:false
    })

    res.status(200).send('Deleted')

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
router.route('/addSubject')
  .post(bodyJSON,async (req,res)=>{
    try{
      await quizerDB.create({
        subject: req.body.subject,
        items:[]
      })
    }
    catch(err){
      res.json({updated:false})
    }
    res.json({updated:true})

  })
router.get('/database', (req, res) => {
  res.sendFile('database.html',options)
})
router.route('/questions')
  .get(bodyURL, (req,res)=>{
    // console.log(req)

    quizerDB.findOne({subject:req.query.reqSub},'-_id -subject', (err,doc)=>{
      
      let questions = [...doc.items]
      // console.log(doc.items)
      var objDoc = JSON.stringify(questions)
      res.send(objDoc)

    })    
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
router.route('/subjects')
  .get((req,res)=>{
    // retrieve all subject available on the database.
    quizerDB.find({},'subject',(err,docs)=>{
      let availableSubject = [];
      docs.forEach((item)=>{
        availableSubject.push(item.subject);
      })
      res.json({subjects:availableSubject});
    })
  })

module.exports = router ; 