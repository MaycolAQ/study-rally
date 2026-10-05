// adaptive_ai.js - Row 3: Adaptive AI Trainer
// Esta fila aprende de tus fallos y crea problemas personalizados

const AdaptiveAI = {
  profile: {}, // Guarda cuantos fallos por tema

  // 1. Aprende donde fallaste
  learn(problem){
    let tema = problem.tema;
    if(!this.profile[tema]) this.profile[tema] = 0;
    this.profile[tema]++;
    console.log(`🧠 IA aprendió: fallaste en ${tema} - ${this.profile[tema]} veces`);
  },

  // 2. Crea problema nuevo con IA en el tema que fallaste
  async createNewProblem(failedTopic, LANG="es"){
    let baseProblems = {
      sinonimo: { word: ["VELOZ","OSCURO","GRANDE","FELIZ","CLARO"], correct: ["Rápido","Tenebroso","Enorme","Contento","Nítido"] },
      regla: { a: [2,3,4,5], b: [6,9,12,15] },
      porcentajes: { num: [20,30,40,50], porc: [10,20,25,50] },
      series: { seq: ["3,6,12,24","5,10,20,40","2,6,18,54"] }
    };

    let topicData = baseProblems[failedTopic] || baseProblems["sinonimo"];
    let newProb = {};

    if(failedTopic==="sinonimo"){
      let idx = Math.floor(Math.random()*topicData.word.length);
      let w = topicData.word[idx];
      let correct = topicData.correct[idx];
      newProb = {
        q0: `Sinónimo de ${w} (IA para ti)`,
        ops0: [correct, "Lento", "Triste", "Pequeño", "Confuso"].sort(()=>Math.random()-0.5),
        c: 0, tema: failedTopic, id: "ai-"+Math.random().toString(36).slice(2,6), g: `🤖 IA creada porque fallaste en ${failedTopic}`
      };
      // Corrige índice del correcto después de mezclar
      newProb.c = newProb.ops0.indexOf(correct);
    } else if(failedTopic==="regla" || failedTopic==="porcentajes"){
      let a = topicData.a[Math.floor(Math.random()*topicData.a.length)];
      let b = topicData.b[Math.floor(Math.random()*topicData.b.length)];
      let correctVal = (b/a)*(a*2);
      newProb = {
        q0: `Si ${a} cuadernos cuestan S/${b}, ¿${a*2} cuánto? (Entrenamiento IA)`,
        ops0: [`S/${correctVal}`,`S/${correctVal+3}`,`S/${correctVal-2}`,`S/${correctVal+5}`,`S/${correctVal-5}`],
        c: 0, tema: failedTopic, id: "ai-"+Math.random().toString(36).slice(2,6), g: `🤖 IA - Practica ${failedTopic}`
      };
    } else {
      newProb = {
        q0: `Nuevo reto de ${failedTopic} creado por IA para ti`,
        ops0: ["Opción A","Opción B","Opción C","Opción D","Opción E"],
        c: 0, tema: failedTopic, id: "ai-"+Math.random().toString(36).slice(2,6), g: `🤖 IA entrenando ${failedTopic}`
      };
    }

    // Traduce con Fila 1
    newProb.q = newProb.q0;
    newProb.ops = [...newProb.ops0];
    if(LANG!=="es"){
      newProb.q = await TranslationEngine.translate(newProb.q0, LANG);
      for(let i=0;i<newProb.ops0.length;i++){
        newProb.ops[i] = await TranslationEngine.translate(newProb.ops0[i], LANG);
      }
    }
    return newProb;
  },

  // 3. Construye entrenamiento especializado
  async buildTraining(failedList, LANG="es"){
    let trainingQueue = [];
    let topics = [...new Set(failedList.map(f=>f.tema))];

    for(let topic of topics){
      // Por cada tema fallado, crea 2 nuevos + 1 de internet
      let p1 = await this.createNewProblem(topic, LANG);
      let p2 = await this.createNewProblem(topic, LANG);
      trainingQueue.push(p1,p2);

      // + 1 de internet (Fila 2)
      if(typeof ProblemBank!== "undefined"){
        let web = await ProblemBank.fetchFromInternet(topic, 1);
        if(web.length>0) trainingQueue.push(web[0]);
      }
    }
    // Agrega también los que fallaste para repasar
    trainingQueue.push(...failedList);
    return trainingQueue.sort(()=>Math.random()-0.5);
  },

  // 4. Sigue mejorando - más fallas = más difícil
  getLevel(tema){
    let fails = this.profile[tema]||0;
    if(fails>=3) return "hard";
    if(fails>=2) return "medium";
    return "easy";
  }
};
