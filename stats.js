const area = document.getElementById("diagnostico");
const erros = JSON.parse(localStorage.getItem("erros") || "{}");

if (Object.keys(erros).length === 0) {
  area.innerHTML = "<p>Sem dados ainda. Faça simulados para gerar diagnóstico.</p>";
} else {
  area.innerHTML = Object.entries(erros).map(([mat, qtd]) =>
    `<div class="card">
      <strong>${mat}</strong><br>
      Erros acumulados: ${qtd}
    </div>`
  ).join("");
}
