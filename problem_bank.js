// problem_bank.js - Row 2: Internet Problem Bank
const ProblemBank = {
  // Banco local (tu base)
  local: [
    {q0:"Sinónimo de ACLARAR",ops0:["Confundir","Explicar","Tapar","Esconder","Enredar"],c:1,tema:"sinonimo"},
    {q0:"40 es el 20% de:",ops0:["200","100","80","400","150"],c:0,tema:"porcentajes"},
    {q0:"Si 2 lapiceros cuestan S/6, ¿5 cuánto?",ops0:["S/15","S/10","S/12","S/18","S/20"],c:0,tema:"regla"},
    {q0:"Serie: 2,4,8,16...",ops0:["24","20","32","30","18"],c:2,tema:"series"}
  ],

  // Banco de internet (simulado con API abierta - aquí conectarás más fuentes)
  internet: {
    sinonimo: [
      {q0:"Sinónimo de VELOZ",ops0:["Lento","Rápido","Pausado","Calmado","Tranquilo"],c:1,tema:"sinonimo"},
      {q0:"Sinónimo de FELIZ",ops0:["Triste","Contento","Enojado","Molesto","Serio"],c:1,tema:"sinonimo"}
    ],
    regla: [
      {q0:"Si 3 cuadernos cuestan S/9, ¿6 cuánto?",ops0:["S/18","S/15","S/12","S/20","S/24"],c:0,tema:"regla"},
      {q0:"Si 4kg de arroz cuestan S/12, ¿10kg cuánto?",ops0:["S/30","S/25","S/28","S/35","S/40"],c:0,tema:"regla"}
    ],
    porcentajes: [
      {q0:"30 es el 50% de:",ops0:["60","30","90","120","45"],c:0,tema:"porcentajes"},
      {q0:"25 es el 25% de:",ops0:["100","50","75","25","125"],c:0,tema:"porcentajes"}
    ]
  },

  // Función que extrae de internet
  async fetchFromInternet(tema, count=2){
    console.log(`🌐 Extrayendo de internet: ${tema}`);
    let pool = this.internet[tema] || [];
    // Aquí en el futuro: fetch real a APIs educativas abiertas
    return pool.slice(0,count).map(p=>({...p, q:p.q0, ops:[...p.ops0], id:"web-"+Math.random().toString(36).slice(2,4), source:"internet"}));
  },

  // Genera rally mezclando local + internet
  async generateRally(count=10, LANG="es"){
    let all = [...this.local];
    // Agrega 3 de internet aleatorios
    for(let tema in this.internet){
      let web = await this.fetchFromInternet(tema,1);
      all.push(...web);
    }
    let rally = all.sort(()=>Math.random()-0.5).slice(0,count).map(p=>{
      let ops = p.ops0.map((op,i)=>({op,i})).sort(()=>Math.random()-0.5);
      return {...p, q:p.q0, ops:ops.map(x=>x.op), c:ops.findIndex(x=>x.i===p.c), id:Math.random().toString(36).slice(2,5) };
    });
    // Traduce si es necesario usando Fila 1
    if(LANG!=="es"){
      for(let p of rally){
        p.q = await TranslationEngine.translate(p.q0, LANG);
        for(let i=0;i<p.ops0.length;i++) p.ops[i]=await TranslationEngine.translate(p.ops0[i], LANG);
      }
    }
    return rally;
  }
};
