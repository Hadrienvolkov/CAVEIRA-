const DB_VERSION = "1.0.0";

let db = {
  version: DB_VERSION,
  perfil: {
    streakAtual: 0,
    recorde: 0,
    horasTotais: 0,
    nivel: 1,
    ultimaData: null
  }
};

function salvar() {
  localStorage.setItem("caveiraDB", JSON.stringify(db));
}

function carregar() {
  const dados = localStorage.getItem("caveiraDB");
  if (dados) {
    db = JSON.parse(dados);
  }
  atualizarTela();
}

function atualizarTela() {
  document.getElementById("streak").textContent = db.perfil.streakAtual;
  document.getElementById("recorde").textContent = db.perfil.recorde;
  document.getElementById("horas").textContent = db.perfil.horasTotais;
  document.getElementById("nivel").textContent = db.perfil.nivel;

  document.getElementById("fraseStatus").textContent =
    db.perfil.streakAtual > 0
      ? "Operador em execução. Missão ativa."
      : "Aguardando início da missão.";
}

function registrarEstudo() {
  const hoje = new Date().toDateString();

  if (db.perfil.ultimaData !== hoje) {
    db.perfil.streakAtual += 1;
    db.perfil.horasTotais += 1;

    if (db.perfil.streakAtual > db.perfil.recorde) {
      db.perfil.recorde = db.perfil.streakAtual;
    }

    db.perfil.nivel = Math.floor(db.perfil.horasTotais / 10) + 1;
    db.perfil.ultimaData = hoje;

    salvar();
    atualizarTela();
  }
}

function exportarDados() {
  const blob = new Blob([JSON.stringify(db)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "backup.caveira";
  link.click();
}

document.getElementById("importarArquivo").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    db = JSON.parse(e.target.result);
    salvar();
    atualizarTela();
  };

  reader.readAsText(file);
});

carregar();