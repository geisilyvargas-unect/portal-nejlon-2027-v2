/* Lote 02 RN-011..020 — controles demonstrativos, sem backend */
(function(){
'use strict';
const esc2=x=>esc(String(x??''));
const voteOptions=['Aprovo','Aprovo com sugestões','Aprovo com ressalvas','Reprovo','Abstenho'];
VOTES.splice(0,VOTES.length,...voteOptions);
const isAdmin=()=>login?.role==='prescon';
const draft=()=>{const x=d();return isAdmin()&&!x.published&&!x.closed};
const getScenarios=x=>Array.isArray(x.scenarios)?x.scenarios:[];
const getProjection=x=>x.projections||{pessimista:'',realista:'',otimista:''};
const ensure=x=>{if(!Array.isArray(x.scenarios))x.scenarios=[];if(!x.projections)x.projections={pessimista:'',realista:'',otimista:''};};
const pfKey=id=>'nejlon-pf-original-'+id;
const fileBuffer=file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file)});
function candidateSheets(x){const pf=getPF(x);return pf?.sheets?Object.keys(pf.sheets):[]}
function scenarioPanel(x){
 ensure(x);const disabled=!draft()?'disabled':'';
 return `<div class="card" style="border-top:7px solid #f02b34"><h2>Configuração dos cenários financeiros</h2><p class="tiny">Cada cenário é uma decisão a deliberar. Abas do XLSX são sugestões, não cenários automáticos. Até 12 cenários neste protótipo; limite institucional ainda precisa de validação.</p>
 <div class="actions"><button class="btn light" ${disabled} onclick="l2Suggest()">Sugerir a partir das abas</button><button class="btn outline" ${disabled} onclick="l2Add()">+ Cenário manual</button></div>
 ${getScenarios(x).map((s,i)=>`<div class="editor-q"><div class="row"><b>Cenário ${i+1}</b><button class="btn light" ${disabled} onclick="l2Remove(${i})">Remover</button></div>
 <div class="field"><label>Nome do cenário *</label><input ${disabled} value="${esc2(s.name)}" onchange="l2Field(${i},'name',this.value)"></div>
 <div class="field"><label>Descrição</label><textarea ${disabled} onchange="l2Field(${i},'description',this.value)">${esc2(s.description)}</textarea></div>
 <div class="field"><label>Abas de referência (informativo)</label><input ${disabled} value="${esc2(s.sourceSheet||'')}" onchange="l2Field(${i},'sourceSheet',this.value)"></div>
 <div class="field"><label>URL HTTPS do material de consulta</label><input type="url" ${disabled} value="${esc2(s.url||'')}" onchange="l2Field(${i},'url',this.value)"></div></div>`).join('')}
 <h3>Projeções financeiras — apenas comparação</h3><p class="tiny">Pessimista, realista e otimista NÃO são alternativas de voto.</p>
 ${['pessimista','realista','otimista'].map(k=>`<div class="field"><label>${k.toUpperCase()}</label><input ${disabled} value="${esc2(getProjection(x)[k])}" onchange="l2Projection('${k}',this.value)" placeholder="Valor ou observação"></div>`).join('')}
 <div class="field"><label>Prazo de encerramento *</label><input id="l2Deadline" type="datetime-local" ${disabled} value="${esc2(x.deadline||'')}" onchange="l2Deadline(this.value)"></div>
 <div class="field"><label><input id="l2Reviewed" type="checkbox" ${disabled} ${x.reviewed?'checked':''} onchange="l2Review(this.checked)"> Confirmo que conferi perguntas, cenários, materiais e prazo antes de publicar</label></div>
 <p class="tiny">O arquivo XLSX original é preservado no armazenamento local deste navegador, quando possível. Não há sincronização entre usuários ou garantia de recálculo das fórmulas.</p></div>`;
}
window.l2Add=function(){if(!draft())return alert('Somente a PRESCON pode editar rascunhos.');const x=d();ensure(x);if(x.scenarios.length>=12)return alert('Limite demonstrativo de 12 cenários.');x.scenarios.push({name:'',description:'',sourceSheet:'',url:''});x.reviewed=false;save();render()};
window.l2Suggest=function(){if(!draft())return alert('Somente a PRESCON pode editar rascunhos.');const x=d();ensure(x);const names=candidateSheets(x);if(!names.length)return alert('Importe um XLSX antes de sugerir cenários.');const existing=new Set(x.scenarios.map(s=>s.sourceSheet));for(const name of names){if(x.scenarios.length>=12)break;if(!existing.has(name))x.scenarios.push({name,description:'Revisar se esta aba corresponde a um cenário deliberável.',sourceSheet:name,url:''})}x.reviewed=false;save();render()};
window.l2Remove=function(i){if(!draft())return;d().scenarios.splice(i,1);d().reviewed=false;save();render()};
window.l2Field=function(i,k,v){if(!draft())return;const x=d();ensure(x);if(k==='url'&&v&&!/^https:\/\//i.test(v))return alert('Use um endereço HTTPS válido.');x.scenarios[i][k]=String(v).trim();x.reviewed=false;save()};
window.l2Projection=function(k,v){if(!draft())return;const x=d();ensure(x);x.projections[k]=v;x.reviewed=false;save()};
window.l2Deadline=function(v){if(!draft())return;d().deadline=v;d().reviewed=false;save()};
window.l2Review=function(v){if(!draft())return;d().reviewed=Boolean(v);save()};
const previousManage=manage;
manage=function(){const x=d();return previousManage()+ (isAdmin()?scenarioPanel(x):'')};
const previousEditor=v23Editor;
v23Editor=function(){const x=d();return previousEditor()+(isAdmin()?scenarioPanel(x):'')};
const previousRead=readPF;
readPF=async function(file){
 if(!isAdmin()||!draft())return alert('Importação restrita à PRESCON e a rascunhos.');
 if(!file)return;
 if(!/\.xlsx$/i.test(file.name))return alert('Selecione um arquivo .xlsx.');
 if(file.size>15*1024*1024)return alert('Arquivo maior que 15 MB; não foi importado.');
 if(typeof XLSX==='undefined')return alert('Biblioteca XLSX indisponível. Importação cancelada.');
 const x=d(),id=x.id;
 try{
  const bytes=await file.arrayBuffer(),wb=XLSX.read(bytes,{type:'array',cellFormula:true,cellStyles:true,cellDates:true});
  if(!wb.SheetNames.length)throw Error('Arquivo sem abas.');
  const sheets={};let formulaCount=0;
  for(const name of wb.SheetNames){
   const ws=wb.Sheets[name];formulaCount+=Object.values(ws).filter(c=>c&&typeof c==='object'&&c.f).length;
   sheets[name]=XLSX.utils.sheet_to_json(ws,{header:1,defval:''}).slice(0,120);
  }
  const original=await fileBuffer(file);
  try{localStorage.setItem(pfKey(id),original)}catch(e){throw Error('Sem espaço no navegador para preservar o arquivo original. Nenhuma importação foi confirmada.')}
  pfById[id]={name:file.name,sheets,blob:bytes,formulaCount};
  x.file=file.name;x.pfMetadata={sheets:wb.SheetNames,formulaCount,bytes:file.size,originalStored:true,importedAt:new Date().toISOString()};x.reviewed=false;
  save();state.flash='XLSX lido e arquivo original preservado neste navegador. '+formulaCount+' fórmulas detectadas (sem validação de recálculo).';render();
 }catch(e){alert('Importação não concluída: '+e.message)}
};
const previousDownload=downloadPF;
downloadPF=function(){
 const pf=getPF(d());
 if(pf?.blob)return previousDownload();
 const stored=localStorage.getItem(pfKey(d().id));
 if(!stored)return alert('Arquivo original indisponível neste navegador. Peça o XLSX à PRESCON.');
 const a=document.createElement('a');a.href=stored;a.download=d().file||'planejamento.xlsx';document.body.appendChild(a);a.click();a.remove();
};
const previousGetPF=getPF;
getPF=function(x){
 const pf=previousGetPF(x);
 if(pf)return pf;
 const m=x.pfMetadata;
 return m?{name:x.file,sheets:{},formulaCount:m.formulaCount}:null;
};
const previousPublish=publish;
publish=function(id){
 const x=db.delibs.find(y=>y.id===id);
 if(!isAdmin()||!x||x.published||x.closed)return alert('Somente a PRESCON publica rascunhos.');
 const qs=v23Qs(x);
 if(!qs.length||!qs.some(q=>q.type==='vote'&&q.required)||qs.some(q=>!q.label?.trim()||!['vote','textarea','scale'].includes(q.type)))return alert('Revise as perguntas obrigatórias e os tipos.');
 if(!x.deadline||new Date(x.deadline).getTime()<=Date.now())return alert('Defina um prazo futuro antes de publicar.');
 if(!x.reviewed)return alert('A PRESCON deve marcar a conferência de perguntas, materiais e prazo.');
 const sc=getScenarios(x);
 if(sc.some(s=>!s.name?.trim()||(s.url&&!/^https:\/\//i.test(s.url))))return alert('Revise os nomes e links HTTPS dos cenários.');
 if(x.file&&x.pfMetadata&&!x.pfMetadata.originalStored)return alert('O XLSX original não foi preservado.');
 return previousPublish(id);
};
const previousParticipant=v23Participant;
v23Participant=function(){
 let html=previousParticipant();const x=d(),sc=getScenarios(x);
 if(!sc.length)return html;
 const block=`<div class="card"><h3>Cenários financeiros a deliberar</h3><p class="tiny">Analise todos os cenários antes de enviar. As projeções são referências, não votos.</p>
 ${sc.map((s,i)=>`<div class="editor-q"><h3>${i+1}. ${esc2(s.name)}</h3><p>${esc2(s.description)}</p>${s.url?`<p><a target="_blank" rel="noopener noreferrer" href="${esc2(s.url)}">Consultar material do cenário</a></p>`:''}
 ${login?.role==='conselho'&&!answer(x.id,login.ej)&&x.published&&!x.closed?`<fieldset class="vote-position-group"><legend>Sobre o [C${i+1}] CENÁRIO ${i+1}, você... *</legend><div class="vote-position-options" style="display:grid;gap:9px">${voteOptions.map(v=>`<label><input type="radio" name="l2scenario${i}" value="${v}" required onchange="l2VoteChanged(${i})"> ${v}</label>`).join('')}</div></fieldset><p class="tiny" id="l2hint${i}">Selecione a opção que representa o posicionamento da sua EJ.</p><div class="field"><label>Justifique sua decisão e insira seus pontos <span id="l2whylabel${i}">(opcional)</span></label><textarea name="l2reason${i}" maxlength="5000"></textarea></div><div class="field" id="l2suggestionswrap${i}" hidden><label>Sugestões de melhoria *</label><textarea name="l2suggestions${i}" maxlength="5000"></textarea></div><div class="field" id="l2caveatswrap${i}" hidden><label>Ressalvas / condições para aprovação *</label><textarea name="l2caveats${i}" maxlength="5000"></textarea></div>`:''}</div>`).join('')}
 <div class="line"></div><h3>Projeções de referência</h3>${Object.entries(getProjection(x)).map(([k,v])=>`<p><b>${k.toUpperCase()}:</b> ${esc2(v||'Não informado')}</p>`).join('')}</div>`;
 if(html.includes('<form id="v23Response"'))html=html.replace('<form id="v23Response" class="card">','<form id="v23Response" class="card">'+block);
 else html+=block;
 return html;
};
window.l2VoteChanged=function(i){
 const selected=document.querySelector('input[name="l2scenario'+i+'"]:checked')?.value;
 const suggestion=document.getElementById('l2suggestionswrap'+i),caveat=document.getElementById('l2caveatswrap'+i);
 const why=document.querySelector('[name="l2reason'+i+'"]');
 const sw=suggestion?.querySelector('textarea'),cw=caveat?.querySelector('textarea');
 if(suggestion)suggestion.hidden=selected!=='Aprovo com sugestões';
 if(caveat)caveat.hidden=selected!=='Aprovo com ressalvas';
 if(sw){sw.required=selected==='Aprovo com sugestões';if(!sw.required)sw.value='';}
 if(cw){cw.required=selected==='Aprovo com ressalvas';if(!cw.required)cw.value='';}
 if(why)why.required=selected==='Reprovo';
 const label=document.getElementById('l2whylabel'+i);if(label)label.textContent=selected==='Reprovo'?'*':'(opcional)';
 const hint=document.getElementById('l2hint'+i);
 if(hint)hint.textContent=selected==='Aprovo com ressalvas'?'A ressalva dependerá da análise da PRESCON para contar como aprovação ou reprovação.':selected==='Aprovo com sugestões'?'O voto conta como aprovação; a PRESCON analisará as sugestões.':selected==='Abstenho'?'Você optou por não votar neste cenário.':'';
};
const previousSubmit=v23Submit;
v23Submit=function(ev){
 const x=d(),sc=getScenarios(x);
 if(!sc.length)return previousSubmit(ev);
 ev.preventDefault();
 const fd=new FormData(ev.target),scenarioVotes=[],scenarioManif=[];
 for(let i=0;i<sc.length;i++){
  const vote=String(fd.get('l2scenario'+i)||''),reason=String(fd.get('l2reason'+i)||'').trim();
  const suggestions=String(fd.get('l2suggestions'+i)||'').trim(),caveats=String(fd.get('l2caveats'+i)||'').trim();
  if(!voteOptions.includes(vote))return alert('Vote em todos os cenários.');
  if(vote==='Reprovo'&&!reason)return alert('Justifique a reprovação no cenário '+(i+1)+'.');
  if(vote==='Aprovo com sugestões'&&!suggestions)return alert('Preencha as sugestões do cenário '+(i+1)+'.');
  if(vote==='Aprovo com ressalvas'&&!caveats)return alert('Preencha as condições do cenário '+(i+1)+'.');
  scenarioVotes.push(vote);
  const body=vote==='Aprovo com sugestões'?suggestions:vote==='Aprovo com ressalvas'?caveats:vote==='Reprovo'?reason:'';
  if(body)scenarioManif.push({id:'l2m'+Date.now()+'-'+i,q:i,type:vote==='Aprovo com sugestões'?'Sugestão':vote==='Aprovo com ressalvas'?'Ressalva':'Reprovação',body,status:'pendente',reason:'',justification:reason});
 }
 const before=db.answers.length;
 previousSubmit(ev);
 if(db.answers.length>before){
  const entry=db.answers[db.answers.length-1];
  entry.scenarioVotes=scenarioVotes;entry.scenarioManif=scenarioManif;entry.scenarioSnapshot=JSON.parse(JSON.stringify(sc));
  try{save()}catch(e){alert('Falha ao registrar os cenários.');}
 }
};
const previousV23Submit=v23Submit;
const previousRender=render;
function l2RefreshProgress(){
 const form=document.getElementById('v23Response');if(!form)return;
 const x=d(),sc=getScenarios(x);
 if(!sc.length)return;
 let completed=0;
 for(let i=0;i<sc.length;i++){
  const vote=form.querySelector('input[name="l2scenario'+i+'"]:checked')?.value;
  const reason=form.querySelector('[name="l2reason'+i+'"]')?.value.trim();
  const suggestions=form.querySelector('[name="l2suggestions'+i+'"]')?.value.trim();
  const caveats=form.querySelector('[name="l2caveats'+i+'"]')?.value.trim();
  if(vote&&(!(vote==='Reprovo')||reason)&&(!(vote==='Aprovo com sugestões')||suggestions)&&(!(vote==='Aprovo com ressalvas')||caveats))completed++;
 }
 const label=document.getElementById('l2ProgressText'),bar=document.getElementById('l2ProgressBar');
 if(label)label.textContent=completed+' / '+sc.length+' cenários concluídos';
 if(bar){bar.value=completed;bar.max=sc.length;}
}
function l2AttachProgress(){
 const form=document.getElementById('v23Response');if(!form||form.dataset.l2Progress)return;
 const x=d(),sc=getScenarios(x);if(!sc.length)return;
 form.dataset.l2Progress='1';
 const block=document.createElement('div');block.className='card';block.style.marginBottom='15px';
 block.innerHTML='<h3>Seu voto, passo a passo</h3><strong id="l2ProgressText">0 / '+sc.length+' cenários concluídos</strong><div><progress id="l2ProgressBar" max="'+sc.length+'" value="0" style="width:100%;height:16px"></progress></div><p class="tiny">O envio só será concluído depois de todos os cenários e perguntas finais obrigatórias.</p>';
 form.prepend(block);
 form.addEventListener('input',l2RefreshProgress);
 form.addEventListener('change',l2RefreshProgress);
 l2RefreshProgress();
}
render=function(){
 previousRender();
 if(!login)return;
 l2AttachProgress();
 const x=d(),path=location.hash.slice(1);
 if(login.role==='prescon'&&path.startsWith('/prescon/editor/')){
  const root=document.getElementById('root');
  if(root&&!root.querySelector('[data-l2-scenarios]'))root.insertAdjacentHTML('beforeend','<div data-l2-scenarios>'+scenarioPanel(x)+'</div>');
 }
 if(login.role==='conselho'&&path.startsWith('/deliberar/')&&x.deadline&&new Date(x.deadline).getTime()<Date.now()){
  const form=document.getElementById('v23Response');
  if(form)form.outerHTML='<div class="notice">Prazo encerrado. Não é possível enviar nova resposta.</div>';
 }
};
})();