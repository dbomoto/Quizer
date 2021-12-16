// Sidebar html elmeents
const testOptions = document.getElementById('testOptions')

// Test content html elmenets
const testPage = document.getElementById('testPage')
const question = document.getElementById('question')
const answer = document.getElementById('answer')
const answerWrong = document.getElementById('answerWrong')
const submitAnswer = document.getElementById('submitAnswer')
const nextQuestion = document.getElementById('nextQuestion')

// Modal after finishing test
const modal = document.getElementById('modal')
const message = document.getElementById('message')
const results = document.getElementById('results')
const restart = document.getElementById('restart')
const newTest = document.getElementById('newTest')

// Global variables
// all the questions are stored here
var testPaper;
// tempoary storage same as testPaper but volatile
var temp;
// score of the user
var score = 0;
// current index being used as question
var randomItem

/*** Retrieve test questions and answer key from database */
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

  // Store all questions and answers here
  testPaper = await questions.json();
  // volatile storage for all questions and answers
  temp = [...testPaper.items];
  testPage.classList.toggle('hidden')
  startTest();
}

/*** Starts the test of the chosen subject */
function startTest() {
  if (temp.length){
    let totalItems = temp.length
    console.log("totalItems:",totalItems)
    randomItem = _.random(0,totalItems-1,false)
    question.innerText = temp[randomItem].question
    answerWrong.innerText = temp[randomItem].answer
    answer.focus()
    return
  } else {
    testResults()
  }
}

/*** Checks the answer of the user */
function checkAnswer() {
  // if answer is correct proceed to next question and remove that object from the array 'temp'
  // accumulate score
  console.log("User answer:",(answer.value).toString())
  if ((answer.value).toString() == temp[randomItem].answer) {
    console.log("Answer is correct")
    temp.splice(randomItem,1)
    score++
    answer.value = ""
    return true
  }
  console.log("Answer is wrong")
  temp.splice(randomItem,1)
  answer.value = ""
  return false
  // wait for user to press 'next button' and call 'startTest'
}

/*** Hide and show elements depending on the answer of the user. */
function toggleAnswer(){
    answer.classList.toggle('hidden')
    answerWrong.classList.toggle('hidden')
    submitAnswer.classList.toggle('hidden')
    if (submitAnswer.disabled){
      submitAnswer.disabled = false
    } else {
      submitAnswer.disabled = true
    }
    nextQuestion.classList.toggle('hidden')
    nextQuestion.focus();
    return
}

/*** Displays the results */
function testResults() {
  testPage.classList.toggle('hidden');
  modal.classList.toggle('hidden');
  results.innerText = `Score: ${score} out of ${testPaper.items.length}`
}

// Event listeners
submitAnswer.addEventListener('click',async ()=>{
  // check the answer
  let status = await checkAnswer()
  if (status) {
  // procceed to next question immediately and add 1 to score
    startTest()
  } else {
  // display correct answer, hide 'submit', and show 'next' button
    await toggleAnswer()
  }
  // if the test is done, hide 'testpage' and show 'modal'
})
nextQuestion.addEventListener('click',async ()=>{
  // after clicking 'next' show empty input box, hide correct answer and 'next' and show 'submit' button.
  await toggleAnswer()
  startTest()
  // if the test is done, hide 'testpage' and show 'modal'
})

restart.addEventListener('click',(e)=>{

})
newTest.addEventListener('click',(e)=>{

})
testOptions.onsubmit = (e) => {
  e.preventDefault();
  getQuestions();
}