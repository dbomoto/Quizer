const addTest = document.getElementById('addTest');
const status = document.getElementById('status');
const modal = document.getElementById('modal');
const wrapper = document.getElementById('wrapper');
const tests = document.getElementById('tests')

// Retrieve the subjects available and add to options.
fetch('/subjects')
  .then(res => res.json())
  .then(data => data.subjects.forEach((txt)=>{
    let opt = document.createElement('option');
    let txtopt = document.createTextNode(txt);
    opt.appendChild(txtopt);
    opt.setAttribute('value',txt);
    tests.appendChild(opt);
  }))

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