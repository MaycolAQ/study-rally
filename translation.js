// translation.js - Row 1: Auto Translation
const TranslationEngine = {
  cache: {},
  T: {
    es:{preg:"Pregunta",trad:"Traducido por IA"},
    en:{preg:"Question",trad:"Translated by AI"},
    pt:{preg:"Pergunta",trad:"Traduzido por IA"},
    fr:{preg:"Question",trad:"Traduit par IA"}
  },
  async translate(text, lang){
    if(lang==="es"||!text) return text;
    let key=lang+"|"+text;
    if(this.cache[key]) return this.cache[key];
    try{
      let r=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${lang}`);
      let j=await r.json();
      let t=j.responseData.translatedText||text;
      this.cache[key]=t;
      return t;
    }catch(e){ return text; }
  }
};
