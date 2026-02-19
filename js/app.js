const DB_VERSION = "2.0.0";

let db = {
  version: DB_VERSION,
  perfil: {
    streakAtual: 0,
    recorde: 0,
    horasTotais: 0,
    nivel: 1,
    ultimaData: null
  },
  config: {
    modoBaixaEnergia: false
  }
};

let timer;
let tempoRestante = 0;
let tempoEstudadoHoje = 0;

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

  document.getElementById("fraseStatus").textContent = gerarMissao();
}

function gerarMissao() {
  const dia = new Date().getDay();

  if (dia === 0) {
    return "Domingo Leve: Revisão estratégica + leitura leve.";
  }

  if (db.config.modoBaixaEnergia) {
    return "Modo Baixa Energia: 1 Pomodoro mínimo para proteger a sequência.";
  }

  return "Missão Padrão: 3 Pomodoros focados (Português + Direito).";
}

function alternarModoEnergia() {
  db.config.modoBaixaEnergia = !db.config.modoBaixaEnergia;
  salvar();
  atualizarTela();
}

function iniciarPomodoro() {
  if (timer) return;

  tempoRestante = db.config.modoBaixaEnergia ? 15 * 60 : 25 * 60;

  timer = setInterval(() => {
    tempoRestante--;

    if (tempoRestante <= 0) {
      clearInterval(timer);
      timer = null;
      registrarEstudoReal();
      alert("Pomodoro concluído. Missão avançando.");
    }

    atualizarTimerTela();
  }, 1000);
}

function pausarPomodoro() {
  clearInterval(timer);
  timer = null;
}

function atualizarTimerTela() {
  const minutos = Math.floor(tempoRestante / 60);
  const segundos = tempoRestante % 60;
  document.getElementById("timer").textContent =
    `${String(minutos).padStart(2,"0")}:${String(segundos).padStart(2,"0")}`;
}

function registrarEstudoReal() {
  const hoje = new Date().toDateString();

  tempoEstudadoHoje++;

  if (db.perfil.ultimaData !== hoje) {
    db.perfil.streakAtual += 1;
    db.perfil.ultimaData = hoje;
  }

  if (db.perfil.streakAtual > db.perfil.recorde) {
    db.perfil.recorde = db.perfil.streakAtual;
  }

  db.perfil.horasTotais += db.config.modoBaixaEnergia ? 0.5 : 1;
  db.perfil.nivel = Math.floor(db.perfil.horasTotais / 10) + 1;

  salvar();
  atualizarTela();
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