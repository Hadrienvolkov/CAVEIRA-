let tempo = 4 * 60 * 60;

setInterval(() => {
  tempo--;
  const h = Math.floor(tempo / 3600);
  const m = Math.floor((tempo % 3600) / 60);
  const s = tempo % 60;
  document.getElementById("timer").innerText =
    `${h}h ${m}m ${s}s`;
}, 1000);
