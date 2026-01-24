let questoes=[], lista=[], i=0, respostas={};

const modo = localStorage.getItem("modo");
const materia = localStorage.getItem("materia");

fetch("data/questoes.json")
.then(r=>r.json())
.then(d=>{
  questoes=d;

  if(modo==="treino"){
    lista = questoes.filter(q=>q.materia===materia);
  } else if(modo==="inteligente"){
    lista = treinoInteligente(questoes);
  } else {
    lista = [...questoes];
  }

  lista = lista.sort(()=>Math.random()-0.5);
  mostrar();
});

function mostrar(){
  if(!lista.length){
    document.getElementById("questao").innerHTML="<p>Sem questões disponíveis.</p>";
    return;
  }
  const q = lista[i];
  document.getElementById("contador").innerText=`Questão ${i+1} de ${lista.length}`;

  document.getElementById("questao").innerHTML=`
    <div class="card">
      <p><strong>${q.enunciado}</strong></p>
      ${Object.entries(q.alternativas).map(([k,v])=>`
        <label>
          <input type="radio" name="alt" onclick="responder('${k}')"
          ${respostas[q.id]===k?'checked':''}>
          ${k}) ${v}
        </label>`).join("")}
    </div>`;
}

function responder(op){
  respostas[lista[i].id]=op;
}

function proxima(){ if(i<lista.length-1){i++;mostrar();}}
function anterior(){ if(i>0){i--;mostrar();}}

function finalizar(){
  analisarIA(lista,respostas);
  document.body.innerHTML=`
    <header><h2>Simulado Finalizado</h2></header>
    <main class="card">
      <p>Confira seu desempenho e treine suas fraquezas.</p>
      <button onclick="location.href='modo.html'">⬅ Voltar ao início</button>
    </main>`;
}
