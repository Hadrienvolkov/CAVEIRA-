let questoes = [];
let questoesSelecionadas = [];
let indice = 0;
let respostas = {};

const modo = localStorage.getItem("modo");
const materiaEscolhida = localStorage.getItem("materia");

fetch("./data/questoes.json")
  .then(res => res.json())
  .then(data => {
    questoes = data;
    prepararSimulado();
    mostrarQuestao();
  });

function prepararSimulado() {
  if (modo === "treino" && materiaEscolhida) {
    questoesSelecionadas = questoes.filter(q => q.materia === materiaEscolhida);
  } 
  else if (modo === "inteligente") {
    const erros = JSON.parse(localStorage.getItem("erros") || "{}");
    questoesSelecionadas = questoes.sort((a, b) =>
      (erros[b.materia] || 0) - (erros[a.materia] || 0)
    );
  } 
  else {
    questoesSelecionadas = [...questoes];
  }

  embaralhar(questoesSelecionadas);
  questoesSelecionadas = questoesSelecionadas.slice(0, 80);
}

function mostrarQuestao() {
  const q = questoesSelecionadas[indice];
  const area = document.getElementById("questao");
  const contador = document.getElementById("contador");

  contador.innerText = `Questão ${indice + 1} de ${questoesSelecionadas.length}`;

  area.innerHTML = `
    <div class="card">
      <p class="materia">${q.materia}</p>
      <p class="enunciado">${q.enunciado}</p>

      ${Object.entries(q.alternativas).map(([k, v]) => `
        <label class="alternativa">
          <input type="radio" name="alt" 
            ${respostas[q.id] === k ? "checked" : ""}
            onchange="responder('${q.id}', '${k}')">
          <span>${k}) ${v}</span>
        </label>
      `).join("")}

      ${modo !== "simulado" ? `<div class="comentario">
        <strong>Comentário:</strong><br>${q.comentario}
      </div>` : ""}
    </div>
  `;
}

function responder(id, alternativa) {
  respostas[id] = alternativa;
}

function proxima() {
  if (indice < questoesSelecionadas.length - 1) {
    indice++;
    mostrarQuestao();
  }
}

function anterior() {
  if (indice > 0) {
    indice--;
    mostrarQuestao();
  }
}

function finalizar() {
  let acertos = 0;
  let errosMateria = {};

  questoesSelecionadas.forEach(q => {
    if (respostas[q.id] === q.gabarito) {
      acertos++;
    } else {
      errosMateria[q.materia] = (errosMateria[q.materia] || 0) + 1;
    }
  });

  localStorage.setItem("erros", JSON.stringify(errosMateria));

  alert(
    `Simulado finalizado!\n\n` +
    `Acertos: ${acertos}\n` +
    `Erros: ${questoesSelecionadas.length - acertos}\n`
  );

  window.location.href = "diagnostico.html";
}

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
