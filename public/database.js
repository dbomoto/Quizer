const subject = document.getElementById('subject');
const getQuestions = document.getElementById('getQuestions');
// Initializes gridjs.
const gridTable = new gridjs.Grid({
    columns: [{name:'ID',hidden:true},'Question','Answer'],
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
async function showDB() {
  let req = await fetch(`/questions?reqSub=${subject.value}`)
  let res = await req.json();
  let database = res.map(item => {return [item._id,item.question,item.answer]})

  gridTable.updateConfig({
    data:database,
  }).forceRender();
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
  showDB()
}