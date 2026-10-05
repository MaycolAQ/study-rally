// --- CEREBRO ADAPTATIVO STUDY RALLY ---
let weakTopics = JSON.parse(localStorage.getItem('weak') || '{}');
let currentTopic = '';

async function getNewQuestion(topic, failed){
  currentTopic = topic;

  // 1. Si falló, la IA crea uno más fácil del mismo tema
  if(failed){
    weakTopics[topic] = (weakTopics[topic]||0)+1;
    localStorage.setItem('weak', JSON.stringify(weakTopics));
    return await generateAIQuestion(topic, true); // true = más fácil
  }

  // 2. Si no, saca uno de internet o del banco
  try {
    const res = await fetch(`https://api.example.com/preguntas?tema=${topic}`);
    return await res.json();
  } catch {
    return await generateAIQuestion(topic, false);
  }
}

async function generateAIQuestion(topic, isEasier){
  // Aquí conectamos a la IA - por ahora generador local inteligente
  // Luego lo conectamos a Llama / Meta AI gratis

  const prompts = {
    "analogias": {
      prompt: `Crea una analogía tipo examen UNSA Perú. Formato: A es a B como C es a?`,
      ejemplo: { q: "MÉDICO es a HOSPITAL como PROFESOR es a?", ops: ["Colegio","Avión","Libro","Cocina"], correcta: 0 }
    },
    "comprension": {
      prompt: `Crea un texto de 4 líneas y una pregunta de idea principal tipo San Marcos`,
      ejemplo: { q: "Texto: El Misti vigila Arequipa...", ops: ["..."], correcta: 0 }
    },
    "operadores": {
      prompt: `Crea problema de operador matemático: si a # b = a² + b`,
      ejemplo: { q: "Si a # b = a² + b, calcula 3 # 4", ops: ["13","12","10","9"], correcta: 0 }
    }
  };

  // Por ahora devuelve ejemplo, pero aquí va la llamada real a IA:
  // const response = await fetch('https://api.meta.ai/generate', { prompt: prompts[topic].prompt })

  console.log(`🤖 IA Generando problema ${isEasier? 'MÁS FÁCIL' : 'NUEVO'} de ${topic}`);

  // Simulación de IA creando problema nuevo
  if(topic === 'analogias'){
    const pares = [["Lápiz","Escribir"],["Cuchillo","Cortar"],["Arequipa","Misti"],["Libro","Leer"]];
    const par = pares[Math.floor(Math.random()*pares.length)];
    return {
      pregunta: `${par[0]} es a ${par[1]} como Pincel es a?`,
      opciones: ["Pintar","Borrar","Cocinar","Correr"],
      correcta: 0,
      explicacion: `IA generada: ${par[0]} sirve para ${par[1]}, igual que Pincel para Pintar`,
      origen: "IA-Adaptativa"
    };
  }

  return prompts[topic].ejemplo;
}

// Cuando responde:
function answer(selected, correct, topic){
  if(selected === correct){
    xp += 30;
    showMsg("¡Correcto! +30 XP", "green");
    setTimeout(()=> nextQuestion(topic, false), 1000);
  } else {
    showMsg(`Era ${correct}. La IA te preparará uno similar más fácil`, "red");
    setTimeout(()=> nextQuestion(topic, true), 2000); // true = falló, genera más fácil
  }
}

async function nextQuestion(topic, failed){
  const q = await getNewQuestion(topic, failed);
  renderQuestion(q);
}
