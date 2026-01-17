fetch("./data/questoes.json")
  .then(r => r.json())
  .then(questoes => {
    questoes.sort(() => Math.random() - 0.5);

    const q = questoes[0];
    const area = document.getElementById("questao");
    if (!area) return;

    area.innerHTML = `
      <div class="card">
        <p><strong>${q.enunciado}</strong></p>
        ${Object.entries(q.alternativas).map(([k,v]) =>
          `<label>
            <input type="radio" name="alt" onclick="registrarErro('${q.materia}')">
            ${k}) ${v}
          </label><br>`
        ).join("")}
        <hr>
        <p><strong>Comentário:</strong><br>${q.comentario}</p>
      </div>
    `;
  });

function registrarErro(materia) {
  let erros = JSON.parse(localStorage.getItem("erros") || "{}");
  erros[materia] = (erros[materia] || 0) + 1;
  localStorage.setItem("erros", JSON.stringify(erros));
}
