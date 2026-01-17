let questoes = [];
let questoesSelecionadas = [];
let indice = 0;
let respostas = [];

const modo = localStorage.getItem("modo") || "simulado";
const materiaEscolhida = localStorage.getItem("materia") || "";

fetch("./data/questoes.json")
  .then(r => r.json())
  .then(dados => {
    questoes = dados;

    if (modo === "treino" && materiaEscolhida) {
      questoesSelecionadas = questoes.filter(q => q.materia === materiaEscolhida);
    } 
    else if (modo === "inteligente") {
      const erros = JSON.parse(localStorage.getItem("erros") || "{}");
      questoesSelecionadas = questoes.sort((a, b) => 
        (erros[b.materia] || 0) - (erros[a.materia] || 0)
      ).slice(0, 80);
    } 
    else {
      questoesSelecionadas = [...questoes];
    }

    questoesSelecionadas = questoesSelecionadas
      .sort(() => Math.random() - 0.5)
      .slice(0, 80);

    mostrarQuestao();
  });

function mostrarQuestao() {
  const q = questoesSelecionadas[indice];
  if (!q) return;

  document.getElementById("contador").innerText =
    `Questão ${indice + 1} de ${questoesSelecionadas.length}`;

  const area = document.getElementById("questao");
  area.innerHTML = `
    <div class="card">
      <p><strong>${q.enunciado}</strong></p>
      ${Object.entries(q.alternativas).map(([k, v]) => `
        <label>
          <input type="radio" name="alt" value="${k}"
          ${respostas[indice] === k ? "checked" : ""}
          onclick="responder('${k}')">
          ${k}) ${v}
        </label><br>
      `).join("")}
      ${modo !== "simulado" ? `<hr><p><strong>Comentário:</strong> ${q.comentario}</p>` : ""}
    </div>
  `;
}

function responder(opcao) {
  respostas[indice] = opcao;
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
  let erros = JSON.parse(localStorage.getItem("erros") || "{}");

  questoesSelecionadas.forEach((q, i) => {
    if (respostas[i] === q.gabarito) acertos++;
    else erros[q.materia] = (erros[q.materia] || 0) + 1;
  });

  localStorage.setItem("erros", JSON.stringify(erros));

  document.body.innerHTML = `
    <header>
      <h2>Resultado Final</h2>
    </header>
    <main class="card">
      <p>Acertos: ${acertos}</p>
      <p>Total: ${questoesSelecionadas.length}</p>
      <p>Aproveitamento: ${Math.round((acertos / questoesSelecionadas.length) * 100)}%</p>
      <br>
      <button onclick="window.location.href='modo.html'">⬅ Voltar ao início</button>
      <button onclick="window.location.href='materiais.html'">📚 Estudar meus erros</button>
    </main>
  `;
}
