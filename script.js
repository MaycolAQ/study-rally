let lvl=1,xp=0,lives=3,data=[]
fetch('data/questions.json').then(r=>r.json()).then(j=>data=j)
function startGame(topic){
 const q=data.filter(d=>d.topic==topic)[0]
 document.getElementById('questionBox').innerHTML=`<h3>${q.question}</h3>`+q.options.map(o=>`<button onclick="check('${o}','${q.answer}')">${o}</button>`).join('')
}
function check(opt,ans){
 if(opt==ans){xp+=20; alert('¡Correcto! +20 XP')} else{lives--; alert('Fallaste')}
 document.getElementById('xp').innerText=xp
 document.getElementById('lives').innerText=lives
 document.getElementById('lvl').innerText=Math.floor(xp/100)+1
 if(lives==0) alert('Game Over')
}
