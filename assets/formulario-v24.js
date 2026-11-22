/* Portal NEJLON — formulário de deliberação V2.4 (protótipo local) */
(function(){
'use strict';
const validVote=new Set(['Aprova','Aprova com sugestões','Aprova com ressalvas','Reprova','Abstem']);
const needsReason=v=>['Aprova com sugestões','Aprova com ressalvas','Reprova'].includes(v);
const safe=x=>esc(String(x??''));
const oldParticipant=v23Participant;
v23Participant=function(){
 const x=d(),qs=v23Qs(x),existing=login?.role==='conselho'?answer(x.id,login.ej):null;
 if(existing)return oldParticipant()+`<div class="card"><p><b>Voto registrado.</b> Alterações só poderão ser realizadas após autorização expressa da PRESCON.</p></div>`;
 if(!x.published||x.closed||login?.role!=='conselho')return oldParticipant();
 let h=hero('CONSELHO / DELIBERAÇÃO','FORMULÁRIO<br>OFICIAL.','Leia o documento, analise cada cenário e registre o posicionamento de sua EJ.');
 h+=`<div class="formlook"><div class="card" style="border-top:8px solid #f02b34"><h2>${safe(x.title)}</h2><p>${safe(x.desc||'Leia as orientações antes de deliberar.')}</p><p><b>EJ vinculada:</b> ${safe(EJS[login.ej])}</p></div>${v23Rules()}`;
 h+=`<form id="v23Response" class="card"><h3>1. Identificação da pessoa conselheira</h3>
 <div class="field"><label for="v24name">Nome completo *</label><input id="v24name" name="name" required maxlength="160" autocomplete="name"></div>
 <div class="field"><label for="v24email">E-mail *</label><input id="v24email" name="email" type="email" required maxlength="200" autocomplete="email"></div>
 <div class="field"><label>Empresa júnior</label><input value="${safe(EJS[login.ej])}" readonly></div>
 <div class="line"></div><h3>2. Documentação para análise</h3><p>${safe(x.file||'Nenhuma planilha financeira vinculada.')}</p>
 <div class="actions"><button class="btn outline" type="button" onclick="v23OpenPF()">Visualizar dados da planilha</button><button class="btn light" type="button" onclick="v23DownloadPF()">Baixar XLSX, quando disponível</button></div><div id="v23PFViewer"></div>
 <div class="line"></div><h3>3. Votação e justificativas</h3>`;
 qs.forEach((q,i)=>{
  h+=`<fieldset class="editor-q" style="border:1px solid #ddd;border-radius:10px;margin:15px 0;padding:16px"><legend><b>${i+1}. ${safe(q.label)} ${q.required?'*':''}</b></legend>`;
  if(q.type==='vote'){
   h+=`<div style="display:grid;gap:12px">${VOTES.map(v=>`<label style="display:flex;align-items:center;gap:10px"><input type="radio" name="v23q${i}" value="${safe(v)}" ${q.required?'required':''} onchange="v24ToggleReason(${i})"> ${safe(v)}</label>`).join('')}</div>`;
   h+=`<div class="field" id="v24reasonBox${i}" style="display:none"><label for="v24reason${i}">Justificativa, sugestão ou ressalva obrigatória *</label><textarea id="v24reason${i}" name="v24reason${i}" maxlength="5000" placeholder="Descreva os pontos que fundamentam sua decisão."></textarea></div>`;
  }else if(q.type==='scale'){
   h+=`<div style="display:flex;flex-wrap:wrap;gap:15px">${[0,1,2,3,4,5].map(n=>`<label><input type="radio" name="v23q${i}" value="${n}" ${q.required?'required':''}> ${n}</label>`).join('')}</div>`;
  }else{
   h+=`<textarea name="v23q${i}" ${q.required?'required':''} maxlength="2000" style="width:100%;min-height:100px" placeholder="Escreva sua resposta..."></textarea>`;
  }
  h+='</fieldset>';
 });
 h+=`<div class="notice"><b>Atenção:</b> depois do envio, o voto não poderá ser alterado diretamente. Qualquer correção depende de autorização da PRESCON.</div><label style="display:flex;gap:10px;margin:18px 0"><input type="checkbox" name="confirm" required> Confirmo que revisei as respostas e estou enviando o posicionamento da minha EJ. *</label><button class="btn red" type="submit">Enviar deliberação</button></form></div>`;
 return h;
};
window.v24ToggleReason=function(i){
 const choice=document.querySelector('input[name="v23q'+i+'"]:checked')?.value;
 const box=document.getElementById('v24reasonBox'+i),input=document.getElementById('v24reason'+i);
 if(!box||!input)return;
 box.style.display=needsReason(choice)?'grid':'none';
 input.required=needsReason(choice);
 if(!needsReason(choice))input.value='';
};
v23Submit=function(ev){
 ev.preventDefault();
 if(login?.role!=='conselho')return alert('Somente o Conselho pode registrar votos.');
 const x=d();
 if(!x?.published||x.closed)return alert('Esta deliberação não está aberta.');
 if(!login.ej||!EJS[login.ej])return alert('Empresa júnior inválida.');
 if(answer(x.id,login.ej))return alert('Já existe voto para esta EJ. Alterações exigem autorização da PRESCON.');
 const qs=v23Qs(x),fd=new FormData(ev.target),values=qs.map((q,i)=>String(fd.get('v23q'+i)||'').trim());
 if(!ev.target.reportValidity())return;
 if(qs.some((q,i)=>q.required&&!values[i]))return alert('Responda todas as perguntas obrigatórias.');
 if(qs.some((q,i)=>q.type==='vote'&&values[i]&&!validVote.has(values[i])))return alert('Opção de voto inválida.');
 if(qs.some((q,i)=>q.type==='scale'&&values[i]&&!['0','1','2','3','4','5'].includes(values[i])))return alert('Escala inválida.');
 const voteIndexes=qs.flatMap((q,i)=>q.type==='vote'?[i]:[]);
 if(!voteIndexes.length)return alert('O formulário não contém uma pergunta de voto.');
 const votes=[],manif=[];
 for(const [j,i] of voteIndexes.entries()){
  const vote=values[i],reason=String(fd.get('v24reason'+i)||'').trim();
  if(needsReason(vote)&&!reason)return alert('Preencha a justificativa do voto '+(j+1)+'.');
  votes.push(vote);
  if(needsReason(vote))manif.push({id:'m'+Date.now()+'-'+j,q:j,type:vote==='Aprova com sugestões'?'Sugestão':vote==='Aprova com ressalvas'?'Ressalva':'Reprovação',body:reason,status:'pendente',reason:''});
 }
 const scales=qs.flatMap((q,i)=>q.type==='scale'?[values[i]]:[]);
 const texts=qs.flatMap((q,i)=>q.type==='textarea'?[values[i]]:[]);
 const entry={id:'a'+Date.now(),delib:x.id,ej:login.ej,name:String(fd.get('name')||'').trim(),email:String(fd.get('email')||'').trim(),votes,manif,clarity:scales[0]||'',difficulty:scales[1]||'',improve:texts.at(-1)||'',formResponses:values,formSnapshot:JSON.parse(JSON.stringify(qs)),submittedAt:new Date().toISOString()};
 if(!entry.name||!entry.email)return alert('Preencha sua identificação.');
 if(!confirm('Confirmar envio? Após registrar, somente a PRESCON poderá autorizar uma alteração.'))return;
 db.answers.push(entry);
 try{save()}catch(e){db.answers.pop();return alert('Não foi possível salvar o voto neste navegador. Tente novamente.')}
 state.flash='Voto registrado neste navegador de demonstração. Alterações dependem da PRESCON.';
 render();
};
const previousSave=v23Save;
v23Save=function(){
 if(login?.role!=='prescon')return alert('Somente a PRESCON edita formulários.');
 const x=d();
 if(x.published||x.closed)return alert('Formulário publicado ou encerrado: edição bloqueada.');
 if(!v23Questions.length||!v23Questions.some(q=>q.type==='vote'&&q.required))return alert('Inclua ao menos uma votação obrigatória.');
 if(v23Questions.some(q=>!['vote','textarea','scale'].includes(q.type)||!String(q.label||'').trim()))return alert('Revise tipos e enunciados das perguntas.');
 return previousSave();
};
})();