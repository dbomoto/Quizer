// Sidebar html elmeents
const testOptions = document.getElementById('testOptions')
const subject = document.getElementById('subject')

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
// All the questions are stored here 
var testPaper;
// Tempoary storage same as testPaper but volatile
var temp;
// Score of the user
var score = 0;
// Current index being used as question
var randomItem

// Retrieve the subjects available and add to options.
fetch('/subjects')
  .then(res => res.json())
  .then(data => data.subjects.forEach((txt)=>{
    let opt = document.createElement('option');
    let txtopt = document.createTextNode(txt);
    opt.appendChild(txtopt);
    opt.setAttribute('value',txt);
    subject.appendChild(opt);
  }))

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
    console.log("current question",temp[randomItem])
    question.innerText = temp[randomItem].question
    answerWrong.value = temp[randomItem].answer
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
    answerWrong.focus();
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
  let status = await checkAnswer()
  if (status) {
    startTest()
  } else {
    await toggleAnswer()
  }
})
answer.addEventListener('keypress',async (e)=>{
  if((e.keyCode || e.which) === 13){
    let status = await checkAnswer()
    if (status) {
      startTest()
    } else {
      await toggleAnswer()
    }    
  }
})
nextQuestion.addEventListener('click',async ()=>{
  await toggleAnswer()
  startTest()
})
answerWrong.addEventListener('keypress',async (e)=>{
  if ((e.keyCode || e.which) === 13){
    await toggleAnswer()
    startTest()    
  }
})
restart.addEventListener('click',(e)=>{
  score = 0;
  temp = [...testPaper.items];
  modal.classList.toggle('hidden')
  testPage.classList.toggle('hidden')
  startTest()
})
newTest.addEventListener('click',(e)=>{
  score = 0;
  temp = [...testPaper.items];
  modal.classList.toggle('hidden')  
})

// Converts specific keyboard combinations to txt.
document.addEventListener('keydown',(e)=>{
  if(e.keyCode === 114){
    e.preventDefault();
    answer.value += "F3";
  }

  if (e.altKey){
    switch(e.keyCode){
      case 38:
        e.preventDefault();
        answer.value = "alt+up";
        break;
      case 40:
        e.preventDefault();
        answer.value = "alt+down";
        break;
    }
  }
  if (e.shiftKey){
    switch(e.keyCode){
      case 114:
        e.preventDefault();
        answer.value = "shift+F3";
        break;
    }
  }
  if (e.ctrlKey) {
    switch(e.keyCode){
      case 73:
        e.preventDefault();
        answer.value = "ctrl+i";
        break;
      case 70:
        e.preventDefault();
        answer.value = "ctrl+f";
        break;
      case 72:
        e.preventDefault();
        answer.value = "ctrl+h";
        break;
      case 68:
        e.preventDefault();
        answer.value = "ctrl+d";
        break;
      case 80:
        e.preventDefault();
        answer.value = "ctrl+p";
        break;
      case 71:
        e.preventDefault();
        answer.value = "ctrl+g";
        break;
      case 219:
        e.preventDefault();
        answer.value = "ctrl+[";
        break;
      case 221:
        e.preventDefault();
        answer.value = "ctrl+]";
        break;
    }
  }
  if (e.altKey && e.shiftKey){
    switch(e.keyCode){
      case 38:
        e.preventDefault();
        answer.value = "shift+alt+up";
        break;
      case 40:
        e.preventDefault();
        answer.value = "shift+alt+down";
        break;
    }
  }
  if (e.ctrlKey && e.shiftKey){
    switch(e.keyCode){
      case 75:
        e.preventDefault();
        answer.value = "ctrl+shift+k";
        break;
      case 13:
        e.preventDefault();
        answer.value = "ctrl+shift+enter";
        break;
    }
  }
  if (e.ctrlKey && e.altKey){
    switch(e.keyCode){
      case 38:
        e.preventDefault();
        answer.value = "ctrl+alt+up";
        break;
      case 40:
        e.preventDefault();
        answer.value = "ctrl+alt+down";
        break;
    }
  }
})

testOptions.onsubmit = (e) => {
  e.preventDefault();
  getQuestions();
}