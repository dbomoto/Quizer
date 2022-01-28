// Page Initialization
const subject = document.getElementById('subject');
const lastSubReq = {subject:'none'};
// Main UI section
const getQuestions = document.getElementById('getQuestions');
// Modal section
const modalEdit  = document.getElementById('modalEdit');
const editID = document.getElementById('editID');
const editQuestion = document.getElementById('editQuestion');
const editAnswer = document.getElementById('editAnswer');
const editData = document.getElementById('editData');

// Loader section
const loader = document.getElementById('loader');

// Initializes gridjs.
const gridTable = new gridjs.Grid({
    columns: [{name:'ID',hidden:true},'Question','Answer', 
    {
      name: 'Commands',
      formatter: (cell,row) => {
        return gridjs.h('button',{
          className: 'bg-green-400 hover:bg-green-300 active:bg-green-600 rounded-md py-1 px-2 transition-all font-bold',
          onClick: ()=>showModal(row.cells[0].data,row.cells[1].data,row.cells[2].data)
        },'Edit')
      }
    }],
    data:[],
    pagination: {
      enabled:true,
      limit:5
    },
    search: {
      enabled:true
    },
    style: { 
      table: { 
        'white-space': 'nowrap'
      }
    }   
    }).render(document.getElementById("gridjsDisplay"));

// Updates the chosen gridjs instance.
async function showDB(sub) {
  lastSubReq.subject = sub;
  let req = await fetch(`/questions?reqSub=${sub}`)
  let res = await req.json();
  let database = res.map(item => {return [item._id,item.question,item.answer]})

  gridTable.updateConfig({
    data:database,
  }).forceRender();
}

// Passes data from table to Modal ready for editing.
function showModal(id,question,answer) {
  editID.value = id;
  editQuestion.value = question;
  editAnswer.value = answer;
  modalEdit.classList.toggle('hidden');
}

// Forcefully close the modal
function modalClose(){
  editID.value = '';
  editQuestion.value = '';
  editAnswer.value = '';
  modalEdit.classList.toggle('hidden',true);  
}


async function userReq(el){
  let options = {}
  let forBody = new FormData(editData);
  forBody.append('subject',lastSubReq.subject)
  if (el === 'update') {
    options = {
      method:'PUT',
      headers:{
        'Accept':'application/json',
      },
      body: forBody
    }
  } else if (el === 'delete') {
    options = {
      method:'DELETE',
      headers:{
        'Accept':'text/html',
      },
      body: forBody
    }    
  }
  loader.classList.toggle('hidden')
  let req = await fetch('/edit', options)
  if(req.ok && req.status === 200){
    await showDB(lastSubReq.subject);
    modalClose();
    loader.classList.toggle('hidden')
  } else {
    alert('Error updating record')
    location.reload()
  }
}

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

getQuestions.onsubmit = (event) => {
  event.preventDefault();
  showDB(subject.value)
}

// Detects if user clicks outside the modal and then closes it.
document.addEventListener('click', function (e) {
  if(e.target.id === 'modalEdit'){
    modalClose();
  }
}, false);

editData.onsubmit = (e)=>{
  e.preventDefault();
  let temp = document.activeElement.id
  console.log(temp)
  userReq(temp)
}
