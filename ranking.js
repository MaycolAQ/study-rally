const Ranking = {
  save(nombre, pts, tiempo, lang){
    if(!nombre || nombre.trim()==="") return;
    let r = JSON.parse(localStorage.getItem("study_ranking")||"[]");
    r.push({nombre: nombre.trim(), pts, tiempo, fecha: new Date().toLocaleString()});
    r.sort((a,b)=> b.pts - a.pts || a.tiempo - b.tiempo);
    localStorage.setItem("study_ranking", JSON.stringify(r.slice(0,20)));
  },
  getHTML(){
    let r = JSON.parse(localStorage.getItem("study_ranking")||"[]");
    if(r.length===0) return `<h3>🏆 Ranking</h3><p>Aún no hay jugadores</p><button onclick="location.reload()" style="text-align:center;background:#0f172a;color:white">🔄 Jugar de nuevo</button>`;
    let html = `
