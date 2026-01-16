let t=4*60*60;
setInterval(()=>{
  t--;
  document.getElementById('timer').innerText =
    Math.floor(t/3600)+'h '+Math.floor(t%3600/60)+'m '+(t%60)+'s';
},1000);
