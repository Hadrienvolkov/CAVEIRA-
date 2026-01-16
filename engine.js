fetch('data/questoes.json')
.then(r=>r.json())
.then(qs=>{
  qs.sort(()=>Math.random()-0.5);
  const q = qs[0];
  const div = document.getElementById('questao');
  if(!div) return;
  div.innerHTML = '<p>'+q.enunciado+'</p>' +
    Object.entries(q.alternativas).map(
      ([k,v])=>'<label><input type=radio name=alt>'+k+') '+v+'</label><br>'
    ).join('');
});
