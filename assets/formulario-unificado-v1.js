/* Fluxo unificado de deliberação — formulário completo inspirado na V1 */
(function(){
'use strict';
const E=x=>esc(String(x??''));
const choices=['Aprovo','Aprovo com sugestões','Aprovo com ressalvas','Reprovo','Abstenho'];
const scenarios=x=>Array.isArray(x.scenarios)?x.scenarios:[];
const mandatory=v=>v==='Aprovo com sugestões'?'suggestions':v==='Aprovo com ressalvas'?'caveats':v==='Reprovo'?'justification':null;
const field=(name)=>document.querySelector('[name="'+name+'"]');
const oldParticipant=v23Participant;
v23Participant=function(){
 const x=d(),sc=scenarios(x),ej=login?.ej;
 if(!sc.length||login?.role!=='conselho'||!x.published||x.closed||answer(x.id,ej))return oldParticipant();
 const qs=v23Qs(x).filter(q=>q.type!=='vote');
 let html=hero('CONSELHO / DELIBERAÇÃO','SUA VOZ<br>DECIDE.','Formulário completo · planejamento financeiro, cenários e considerações finais.');
 html+='<div class="formlook"><div class="card"><h2>'+E(x.title)+'</h2><p>Falaaaa, conselheiro pé vermelho! ❤️</p><p>'+E(x.desc)+'</p><p><b>EJ:</b> '+E(EJS[ej])+'</p></div>'+v23Rules();
 html+='<form id="v23Response" class="card"><h3>01 · Identificação</h3><div class="field"><label>Nome completo *</label><input name="name" required maxlength="160"></div><div class="field"><label>E-mail *</label><input type="email" name="email" required maxlength="200"></div><div class="field"><label>Empresa júnior</label><input readonly value="'+E(EJS[ej])+'"></div>';
 html+='<div class="line"></div><h3>02 · Planejamento financeiro</h3><p>'+E(x.file||'Nenhum XLSX vinculado')+'</p><div class="actions"><button type="button" class="btn outline" onclick="v23OpenPF()">Visualizar XLSX no portal</button><button type="button" class="btn light" onclick="v23DownloadPF()">Baixar arquivo original</button></div><div id="v23PFViewer"></div>';
 html+='<div class="line"></div><h3>03 · Cenários para deliberação</h3><p>Analise cada cenário e registre seu posicionamento. Projeções pessimista, realista e otimista não são alternativas de voto.</p><div class="card"><strong id="l4Progress">0 / '+sc.length+' cenários concluídos</strong><progress id="l4Bar" value="0" max="'+sc.length+'" style="width:100%"></progress></div>';
 sc.forEach((s,i)=>{html+='<fieldset class="editor-q"><legend><b>[C'+(i+1)+'] '+E(s.name)+'</b></legend><p>'+E(s.description)+'</p>'+(s.url?'<p><a target="_blank" rel="noopener noreferrer" href="'+E(s.url)+'">Consultar material deste cenário</a></p>':'')+'<div class="field"><label>Sobre este cenário, você... *</label>'+choices.map(v=>'<label style="display:flex;gap:9px;align-items:center;margin:8px 0"><input type="radio" required name="l4vote'+i+'" value="'+E(v)+'"> '+E(v)+'</label>').join('')+'</div><p id="l4hint'+i+'" class="tiny"></p><div class="field"><label>Justifique sua decisão e insira seus pontos <span id="l4whylabel'+i+'">(opcional)</span></label><textarea name="l4why'+i+'" maxlength="5000"></textarea></div><div class="field" id="l4suggestbox'+i+'" hidden><label>Sugestões de melhoria *</label><textarea name="l4suggest'+i+'" maxlength="5000"></textarea></div><div class="field" id="l4caveatbox'+i+'" hidden><label>Ressalvas / condições para aprovação *</label><textarea name="l4caveat'+i+'" maxlength="5000"></textarea></div></fieldset>'});
 html+='<div class="line"></div><h3>04 · Considerações finais</h3>';
 qs.forEach((q,i)=>{html+='<fieldset class="editor-q"><legend>'+E(q.label)+(q.required?' *':'')+'</legend>';if(q.type==='scale')html+='<div style="display:flex;flex-wrap:wrap;gap:14px">'+[0,1,2,3,4,5].map(n=>'<label><input type="radio" name="l4final'+i+'" value="'+n+'" '+(q.required?'required':'')+'> '+n+'</label>').join('')+'</div>';else html+='<textarea name="l4final'+i+'" maxlength="2000" '+(q.required?'required':'')+'></textarea>';html+='</fieldset>'});
 html+='<div class="notice">A resposta será registrada uma única vez por EJ neste navegador. Alterações dependem de autorização da PRESCON.</div><label><input type="checkbox" name="confirm" required> Revisei todos os cenários e confirmo o posicionamento da minha EJ. *</label><div class="actions"><button class="btn red" type="submit">Enviar deliberação completa</button></div></form></div>';
 return html;
};
function refresh(){
 const x=d(),sc=scenarios(x),form=document.getElementById('v23Response');if(!form)return;
 let done=0;
 sc.forEach((s,i)=>{
  const vote=form.querySelector('[name="l4vote'+i+'"]:checked')?.value;
  const why=form.querySelector('[name="l4why'+i+'"]'),sug=form.querySelector('[name="l4suggest'+i+'"]'),cav=form.querySelector('[name="l4caveat'+i+'"]');
  const sb=document.getElementById('l4suggestbox'+i),cb=document.getElementById('l4caveatbox'+i);
  if(sb)sb.hidden=vote!=='Aprovo com sugestões';if(cb)cb.hidden=vote!=='Aprovo com ressalvas';
  if(sug)sug.required=vote==='Aprovo com sugestões';if(cav)cav.required=vote==='Aprovo com ressalvas';if(why)why.required=vote==='Reprovo';
  const label=document.getElementById('l4whylabel'+i);if(label)label.textContent=vote==='Reprovo'?'*':'(opcional)';
  const hint=document.getElementById('l4hint'+i);if(hint)hint.textContent=vote==='Aprovo com ressalvas'?'A PRESCON avaliará as condições antes da apuração efetiva.':vote==='Aprovo com sugestões'?'Conta como aprovação; sugestões seguem para análise.':'';
  if(vote&&(!mandatory(vote)||(vote==='Reprovo'?why:vote==='Aprovo com sugestões'?sug:cav)?.value.trim()))done++;
 });
 const label=document.getElementById('l4Progress'),bar=document.getElementById('l4Bar');if(label)label.textContent=done+' / '+sc.length+' cenários concluídos';if(bar)bar.value=done;
}
v23Submit=function(ev){
 const form=ev.target,x=d(),sc=scenarios(x);
 if(!sc.length||!form.querySelector('[name="l4vote0"]'))return window.alert('O formulário não está disponível para envio nesta tela.');
 ev.preventDefault();
 if(login?.role!=='conselho'||!login.ej||!EJS[login.ej])return alert('Acesso do Conselho inválido.');
 if(!x.published||x.closed||(x.deadline&&Date.now()>new Date(x.deadline).getTime()))return alert('A deliberação não está aberta para respostas.');
 if(answer(x.id,login.ej))return alert('Esta EJ já respondeu. Solicite autorização à PRESCON para alterar.');
 if(!form.reportValidity())return;
 const fd=new FormData(form),votes=[],manif=[],scenarioAnswers=[];
 for(let i=0;i<sc.length;i++){
  const position=String(fd.get('l4vote'+i)||''),justification=String(fd.get('l4why'+i)||'').trim(),suggestions=String(fd.get('l4suggest'+i)||'').trim(),caveats=String(fd.get('l4caveat'+i)||'').trim();
  if(!choices.includes(position))return alert('Responda o cenário '+(i+1));
  if(position==='Reprovo'&&!justification||position==='Aprovo com sugestões'&&!suggestions||position==='Aprovo com ressalvas'&&!caveats)return alert('Complete a justificativa, sugestão ou ressalva do cenário '+(i+1));
  votes.push(position);scenarioAnswers.push({scenario:sc[i].name,position,justification,suggestions:position==='Aprovo com sugestões'?suggestions:'',caveats:position==='Aprovo com ressalvas'?caveats:''});
  const body=position==='Reprovo'?justification:position==='Aprovo com sugestões'?suggestions:position==='Aprovo com ressalvas'?caveats:'';
  if(body)manif.push({id:'m'+Date.now()+'-'+i,q:i,type:position==='Reprovo'?'Reprovação':position==='Aprovo com sugestões'?'Sugestão':'Ressalva',body,status:'pendente',reason:'',justification});
 }
 const qs=v23Qs(x).filter(q=>q.type!=='vote'),finalResponses=qs.map((q,i)=>String(fd.get('l4final'+i)||'').trim());
 if(qs.some((q,i)=>q.required&&!finalResponses[i]))return alert('Responda todas as considerações finais obrigatórias.');
 const scales=qs.flatMap((q,i)=>q.type==='scale'?[finalResponses[i]]:[]);
 if(scales.some(v=>!['0','1','2','3','4','5'].includes(v)))return alert('Escala inválida.');
 if(!confirm('Confirmar envio de todos os cenários? A alteração posterior exige autorização da PRESCON.'))return;
 const entry={id:'a'+Date.now(),delib:x.id,ej:login.ej,name:String(fd.get('name')).trim(),email:String(fd.get('email')).trim(),votes,manif,scenarioVotes:votes,scenarioManif:manif,scenarioAnswers,scenarioSnapshot:JSON.parse(JSON.stringify(sc)),formResponses:finalResponses,formSnapshot:JSON.parse(JSON.stringify(qs)),clarity:scales[0]||'',difficulty:scales[1]||'',improve:qs.flatMap((q,i)=>q.type==='textarea'?[finalResponses[i]]:[]).at(-1)||'',submittedAt:new Date().toISOString()};
 db.answers.push(entry);
 try{save()}catch(e){db.answers.pop();return alert('Não foi possível salvar. Tente novamente sem reenviar se houver dúvida.')}
 state.flash='Deliberação completa registrada neste navegador de demonstração.';render();
};
const oldRender=render;
render=function(){
 oldRender();
 const form=document.getElementById('v23Response');if(!form||!form.querySelector('[name="l4vote0"]'))return;
 form.addEventListener('change',ev=>{const t=ev.target;if(t.matches('input[type="radio"][name^="l4vote"]')){const i=Number(t.name.replace('l4vote',''));for(const name of ['l4suggest','l4caveat']){const a=form.querySelector('[name="'+name+i+'"]');if(a)a.value='';}}refresh()});
 form.addEventListener('input',refresh);refresh();
};
})();