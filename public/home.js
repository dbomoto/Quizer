// Sidebar html elmeents
const testOptions = document.getElementById('testOptions')

// Test content html elmenets
const testPage = document.getElementById('testPage')
const question = document.getElementById('question')
const answer = document.getElementById('answer')
const answerWrong = document.getElementById('answerWrong')

// Modal after finishing test
const modal = document.getElementById('modal')
const message = document.getElementById('message')
const results = document.getElementById('results')
const restart = document.getElementById('restart')
const newTest = document.getElementById('newTest')


// Global variable
var testPaper;

// Retrieve test questions and answer key from database
async function getQuestions() {
  const questions = await fetch('/tests', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    // Let the user agent handle the content type
    // 'Content-Type': 'multipart/form-data; boundary=???'
  },
  body: new FormData(testOptions)
  })

  testPaper = await questions.json();
  startTest();
}

// Starts the test of the chosen subject
function startTest() {
  // temporary container for questions and aswer key
  // ***
  // get how many questions there are on temp container
  // random pick 1 question
  // display question to 'question'
  // ready correct answer on 'answerWrong'
  // wait for user input of answer and 'submit'
  // if correct procceed to next question
  // if wrong display 'answerWrong' and hide 'answer'
  // 'submit' button will be hidden and 'next' button will appear
  // go back to *** until all questions are finished
  // call 'testResults' to display resuslts
}

// Displays the results
function testResults() {
  // hide the 'test page' and display the 'modal'
  // display the message and results
  // await user input 'restart' or 'new test'
  // if restart repeat 'startTest' 
  // if 'new test' display default 'test page'
  // wait for user to pick a new subject
  // repeat entire process of the test
}

testOptions.onsubmit = (e) => {
  e.preventDefault();
  getQuestions();
}