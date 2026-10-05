const Ranking = {
  save(nombre,puntos,tiempo,idioma){
    let data=JSON.parse(localStorage.getItem("rally_ranking")||"[]");
    data.push({nombre,puntos,tiempo,idioma,fecha:new Date().toLocaleDateString(),semana:this.getSemana()});
    data.sort((a,b)=>b.puntos-a.puntos||a.tiempo-b.tiempo);
    localStorage.setItem("rally_ranking",JSON.stringify(data.slice(0,50)));
  },
  getSemana(){ let d=new Date(), o=new Date(d.getFullYear(),0,1); return Math.ceil((((d-o)/86400000)+o.getDay()+1)/7); },
  getHTML(){
    let data=JSON.parse(localStorage.getItem("rally_ranking")||"[]").filter(r=>r.semana===this.getSemana()).slice(0,10);
    let h=`<h2>🏆 Ranking Concurso Lunes</h2><table style="width:100%;font-size:14px"><tr><th>#</th><th>Nombre</th><th>Pts</th><th>Tiempo</th></tr>`;
    data.forEach((r,i)=>{ h+=`<tr><td>${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</td><td>${r.nombre}</td><td>${r.puntos}</td><td>${r.tiempo}s</td></tr>`; });
    h+=`</table><br><button onclick="location.reload()" style="background:#0f172a;color:white">Jugar</button>`;
    return h;
  }
}
