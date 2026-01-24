function analisarIA(lista,respostas){
  let erros={};

  lista.forEach(q=>{
    if(respostas[q.id]!==q.gabarito){
      erros[q.materia]=(erros[q.materia]||0)+1;
    }
  });

  localStorage.setItem("erros", JSON.stringify(erros));
}

function treinoInteligente(questoes){
  const erros = JSON.parse(localStorage.getItem("erros")||"{}");
  return questoes.sort((a,b)=>(erros[b.materia]||0)-(erros[a.materia]||0)).slice(0,20);
}
