const addTest = document.getElementById('addTest');
const status = document.getElementById('status');
const modal = document.getElementById('modal');
const wrapper = document.getElementById('wrapper');

async function submitQuestions() {
  const questions = await fetch('/add', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
  },
  body: new FormData(addTest)
  })

  let dbState = await questions.json();
  status.innerText = dbState.status
  modal.classList.toggle('hidden');
  wrapper.classList.toggle('hidden');
  setTimeout(()=>{
    addTest.reset();
    status.innerText= "default";
    modal.classList.toggle('hidden');
    wrapper.classList.toggle('hidden');}, 2000);

}

addTest.onsubmit = (e) => {
  e.preventDefault();
  submitQuestions();
}