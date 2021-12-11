const express = require('express')
const path = require('path')
const router = express.Router()
const options = {
  root: path.join(__dirname,'../views')
}

router.use((req,res,next)=>{
  console.log('Request: '+ req.path, 'Time: ' + Date.now())
  next();
})


router.get('/', (req, res) => {
  res.sendFile('home.html',options)
})
router.get('/add', (req, res) => {
  res.sendFile('add.html',options)
})
router.get('/database', (req, res) => {
  res.sendFile('database.html',options)
})
router.get('/tests', (req, res) => {
  res.sendFile('tests.html',options)
})

module.exports = router ; 