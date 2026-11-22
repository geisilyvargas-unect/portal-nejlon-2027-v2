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
 if(login?.role!=='conselho'||!x.published||x.closed||answer(x.id,ej))return oldParticipant();
 const qs=v23Qs(x).filter(q=>q.type!=='vote');
 let html=hero('CONSELHO / DELIBERAÇÃO','SUA VOZ<br>DECIDE.','Formulário completo · planejamento financeiro, cenários e considerações finais.');
 html+='<div class="formlook"><div class="card"><h2>'+E(x.title)+'</h2><p>Falaaaa, conselheiro pé vermelho! ❤️</p><p>'+E(x.desc)+'</p><p><b>EJ:</b> '+E(EJS[ej])+'</p></div>'+v23Rules();
 html+='<form id="v23Response" class="card"><h3>01 · Identificação</h3><div class="field"><label>Nome completo *</label><input name="name" required maxlength="160"></div><div class="field"><label>E-mail *</label><input type="email" name="email" required maxlength="200"></div><div class="field"><label>Empresa júnior</label><input readonly value="'+E(EJS[ej])+'"></div>';
 html+='<div class="line"></div><h3>02 · Planejamento financeiro</h3><p>'+E(x.file||'Nenhum XLSX vinculado')+'</p><div class="actions"><button type="button" class="btn outline" onclick="v23OpenPF()">Visualizar XLSX no portal</button><button type="button" class="btn light" onclick="v23DownloadPF()">Baixar arquivo original</button></div><div id="v23PFViewer"></div>';
 html+='<div class="line"></div><h3>03 · Cenários financeiros para consulta</h3><p>Os cenários são materiais de análise. A EJ registra apenas um voto institucional para toda a deliberação.</p>';
 sc.forEach((scenario,i)=>{html+='<div class="editor-q"><b>[C'+(i+1)+'] '+E(scenario.name)+'</b><p>'+E(scenario.description||'')+'</p>'+(scenario.url?'<a target="_blank" rel="noopener noreferrer" href="'+E(scenario.url)+'">Consultar material do cenário</a>':'')+'</div>'});
 html+='<div class="line"></div><h3>Voto institucional único da EJ *</h3><div class="field"><label>Sobre a deliberação como um todo, você...</label>'+choices.map(v=>'<label class="choice"><input type="radio" required name="l4vote0" value="'+E(v)+'"> '+E(v)+'</label>').join('')+'</div><div class="field"><label>Justificativa (opcional)</label><textarea name="l4why0" maxlength="5000"></textarea></div><div class="field" id="l4suggestbox0" hidden><label>Sugestões *</label><textarea name="l4suggest0" maxlength="5000"></textarea></div><div class="field" id="l4caveatbox0" hidden><label>Ressalvas * (uma por linha)</label><textarea name="l4caveat0" maxlength="5000"></textarea></div>';
 html+='<div class="line"></div><h3>04 · Considerações finais</h3>';
 qs.forEach((q,i)=>{html+='<fieldset class="editor-q"><legend>'+E(q.label)+(q.required?' *':'')+'</legend>';if(q.type==='scale')html+='<div style="display:flex;flex-wrap:wrap;gap:14px">'+[0,1,2,3,4,5].map(n=>'<label><input type="radio" name="l4final'+i+'" value="'+n+'" '+(q.required?'required':'')+'> '+n+'</label>').join('')+'</div>';else html+='<textarea name="l4final'+i+'" maxlength="2000" '+(q.required?'required':'')+'></textarea>';html+='</fieldset>'});
 html+='<div class="notice">O voto institucional será registrado uma única vez por EJ neste navegador. Alterações dependem de autorização da PRESCON.</div><label><input type="checkbox" name="confirm" required> Revisei os dados financeiros e confirmo o voto institucional da minha EJ. *</label><div class="actions"><button class="btn red" type="submit">Enviar voto institucional</button></div></form></div>';
 return html;
};
function refresh(){
 const form=document.getElementById('v23Response');if(!form)return;
 const vote=form.querySelector('[name="l4vote0"]:checked')?.value;
 const sug=form.querySelector('[name="l4suggest0"]'),cav=form.querySelector('[name="l4caveat0"]');
 const sb=document.getElementById('l4suggestbox0'),cb=document.getElementById('l4caveatbox0');
 if(sb)sb.hidden=vote!=='Aprovo com sugestões';
 if(cb)cb.hidden=vote!=='Aprovo com ressalvas';
 if(sug)sug.required=vote==='Aprovo com sugestões';
 if(cav)cav.required=vote==='Aprovo com ressalvas';
}
v23Submit=function(ev){
 const form=ev.target,x=d(),sc=scenarios(x);
 if(!form.querySelector('[name="l4vote0"]'))return window.alert('O formulário não está disponível para envio nesta tela.');
 ev.preventDefault();
 if(login?.role!=='conselho'||!login.ej||!EJS[login.ej])return alert('Acesso do Conselho inválido.');
 if(!x.published||x.closed||(x.deadline&&Date.now()>new Date(x.deadline).getTime()))return alert('A deliberação não está aberta para respostas.');
 if(answer(x.id,login.ej))return alert('Esta EJ já respondeu. Solicite autorização à PRESCON para alterar.');
 if(!form.reportValidity())return;
 const fd=new FormData(form);
 const position=String(fd.get('l4vote0')||'');
 const justification=String(fd.get('l4why0')||'').trim();
 const suggestions=String(fd.get('l4suggest0')||'').trim();
 const caveats=String(fd.get('l4caveat0')||'').trim();
 if(!choices.includes(position))return alert('Selecione o voto institucional.');
 if(position==='Aprovo com sugestões'&&!suggestions)return alert('Informe as sugestões.');
 if(position==='Aprovo com ressalvas'&&!caveats)return alert('Informe as ressalvas.');
 const votes=[position],manif=[],scenarioAnswers=[];
 if(position==='Aprovo com sugestões')manif.push({id:'m'+Date.now()+'-s',q:0,type:'Sugestão',body:suggestions,status:'pendente',reason:''});
 if(position==='Aprovo com ressalvas')caveats.split(/\r?\n/).map(v=>v.trim()).filter(Boolean).forEach((body,i)=>manif.push({id:'m'+Date.now()+'-r'+i,q:0,type:'Ressalva',body,status:'pendente',reason:''}));
 if(position==='Reprovo'&&justification)manif.push({id:'m'+Date.now()+'-j',q:0,type:'Reprovação',body:justification,status:'pendente',reason:''});
 const qs=v23Qs(x).filter(q=>q.type!=='vote'),finalResponses=qs.map((q,i)=>String(fd.get('l4final'+i)||'').trim());
 if(qs.some((q,i)=>q.required&&!finalResponses[i]))return alert('Responda todas as considerações finais obrigatórias.');
 const scales=qs.flatMap((q,i)=>q.type==='scale'?[finalResponses[i]]:[]);
 if(scales.some(v=>!['0','1','2','3','4','5'].includes(v)))return alert('Escala inválida.');
 if(!confirm('Confirmar o voto único da EJ nesta deliberação? Alterações exigem autorização da PRESCON.'))return;
 const entry={id:'a'+Date.now(),delib:x.id,ej:login.ej,name:String(fd.get('name')).trim(),email:String(fd.get('email')).trim(),votes,manif,institutionalVote:position,scenarioVotes:[],scenarioManif:[],scenarioAnswers,scenarioSnapshot:JSON.parse(JSON.stringify(sc)),formResponses:finalResponses,formSnapshot:JSON.parse(JSON.stringify(qs)),clarity:scales[0]||'',difficulty:scales[1]||'',improve:qs.flatMap((q,i)=>q.type==='textarea'?[finalResponses[i]]:[]).at(-1)||'',submittedAt:new Date().toISOString()};
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