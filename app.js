let entries=[];
let current=null;
let score=Number(localStorage.getItem("psalmSourceScore")||0);

const $=s=>document.querySelector(s);
const fromEl=$("#fromPsalm"),toEl=$("#toPsalm"),textEl=$("#psalmText");
const answerEl=$("#answer"),statusEl=$("#status"),resultEl=$("#result"),nextBtn=$("#nextBtn");

for(let i=1;i<=150;i++){fromEl.add(new Option(i,i));toEl.add(new Option(i,i));}
fromEl.value=1;toEl.value=150;

function updateScore(){$("#score").textContent=`${score} correct`;}
function normalise(s){
  return s.toLowerCase()
    .replace(/[’‘]/g,"'")
    .replace(/\bthe\s+/g,"")
    .replace(/[^a-z0-9]+/g,"")
    .replace(/^psalm/,"");
}
function answerMatches(given, expected){
  const a=normalise(given), e=normalise(expected);
  if(!a) return false;
  if(a===e) return true;
  if(/^119\d+$/.test(a)) return a==="119"+String(current.section||"");
  return a===String(current.psalm);
}
function eligible(){
  let a=+fromEl.value,b=+toEl.value;
  if(a>b){[a,b]=[b,a];fromEl.value=a;toEl.value=b;}
  return entries.filter(e=>e.psalm>=a&&e.psalm<=b);
}
function renderText(text){
  textEl.innerHTML="";
  const stanzas=text.split(/\n\s*\n/).filter(Boolean);
  if(stanzas.length<=1){
    const lines=text.split("\n").filter(Boolean);
    for(let i=0;i<lines.length;i+=4){
      const p=document.createElement("p");p.className="stanza";
      p.textContent=lines.slice(i,i+4).join("\n");textEl.appendChild(p);
    }
  }else{
    for(const s of stanzas){
      const p=document.createElement("p");p.className="stanza";p.textContent=s;textEl.appendChild(p);
    }
  }
}
function newPsalm(){
  const list=eligible();
  if(!list.length){statusEl.textContent="No entries in this range";return;}
  current=list[Math.floor(Math.random()*list.length)];
  renderText(current.text);
  statusEl.textContent="What is the source?";
  resultEl.hidden=true;resultEl.className="result";
  nextBtn.hidden=true;answerEl.value="";answerEl.focus();
}
function showResult(ok,msg){
  resultEl.textContent=msg;resultEl.hidden=false;
  resultEl.className="result "+(ok?"good":"bad");
  nextBtn.hidden=false;
}
$("#startBtn").onclick=newPsalm;
nextBtn.onclick=newPsalm;
$("#checkBtn").onclick=()=>{
  if(!current)return;
  const ok=answerMatches(answerEl.value,current.label);
  if(ok){score++;localStorage.setItem("psalmSourceScore",score);updateScore();}
  showResult(ok,ok?"✓ Correct — "+current.label:"✗ Not quite — "+current.label);
};
$("#revealBtn").onclick=()=>{if(current)showResult(false,"The answer is "+current.label);};
answerEl.addEventListener("keydown",e=>{if(e.key==="Enter")$("#checkBtn").click();});
$("#resetScore").onclick=()=>{score=0;localStorage.setItem("psalmSourceScore",0);updateScore();};
$("#settingsBtn").onclick=()=>{$("#settings").hidden=!$("#settings").hidden;};
document.querySelectorAll("[data-range]").forEach(b=>b.onclick=()=>{
  const [a,c]=b.dataset.range.split("-");fromEl.value=a;toEl.value=c;newPsalm();
});

fetch("data/psalms.json").then(r=>r.json()).then(d=>{
  entries=d.entries;
  updateScore();
  newPsalm();
}).catch(()=>{statusEl.textContent="Could not load the Psalm database.";});
