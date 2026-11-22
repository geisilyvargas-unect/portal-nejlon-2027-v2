/* Governança ampliada: revisão, apuração, relatório e snapshot demonstrativos. */
(function(){
'use strict';
const E=x=>esc(String(x??''));
const roles=()=>login?.role;
const normalize=v=>({'Aprova':'Aprovo','Aprova com sugestões':'Aprovo com sugestões','Aprova com ressalvas':'Aprovo com ressalvas','Reprova':'Reprovo','Abstem':'Abstenho','Favorável':'Aprovo','Favorável com ressalvas':'Aprovo com ressalvas','Contrário':'Reprovo','Abstenção':'Abstenho'}[v]||v);
const official=['Aprovo','Aprovo com sugestões','Aprovo com ressalvas','Reprovo','Abstenho'];
const scenarios=x=>x.scenarios?.length?x.scenarios.map(s=>s.name):x.questions||[];
const reviews=x=>db.answers.filter(a=>a.delib===x.id);
const audit=(action,detail)=>{db.auditLog??=[];db.auditLog.push({action,detail,at:new Date().toISOString(),actor:roles(),ej:login?.ej||null});};
const effective=(vote,manifests=[])=>{
 const v=normalize(vote);
 if(v==='Aprovo'||v==='Aprovo com sugestões')return 'Aprovação confirmada';
 if(v==='Reprovo')return 'Reprovação confirmada';
 if(v==='Abstenho')return 'Abstenção';
 if(v==='Aprovo com ressalvas'){
  const caveats=manifests.filter(m=>m.type==='Ressalva');
  if(!caveats.length||caveats.some(m=>!['aceita','recusada'].includes(m.status)))return 'Ressalva pendente';
  return caveats.every(m=>m.status==='aceita')?'Aprovação confirmada':'Reprovação confirmada';
 }
 return 'Não classificado';
};
function rows(x){return reviews(x).map(a=>({a,i:0,vote:a.institutionalVote||a.votes?.[0]||'',scenario:'Deliberação integral',justification:'',suggestions:(a.manif||[]).filter(m=>m.type==='Sugestão').map(m=>m.body).join('; '),caveats:(a.manif||[]).filter(m=>m.type==='Ressalva').map(m=>m.body).join('; ')}));}
function csvDownload(name,records){const csv='\ufeff'+records.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
window.l5Export=function(){if(roles()!=='prescon')return alert('Exportação administrativa restrita à PRESCON.');const x=d(),r=[['Deliberação','EJ','Cenário','Voto original','Resultado efetivo','Justificativa','Sugestões','Ressalvas','Parecer PRESCON','Data']];for(const y of rows(x)){const m=(y.a.manif||[]).filter(m=>m.type==='Ressalva');r.push([x.title,EJS[y.a.ej],y.scenario,normalize(y.vote),effective(y.vote,m),y.justification,y.suggestions,y.caveats,m.map(v=>v.reason||'').join('; '),y.a.submittedAt||''])}csvDownload('deliberacao-completa-'+x.id+'.csv',r)};
const previousReview=review;
review=function(aid,mid,result){if(roles()!=='prescon')return alert('Somente a PRESCON pode analisar manifestações.');const a=db.answers.find(v=>v.id===aid),m=a?.manif?.find(v=>v.id===mid);if(!m||m.status!=='pendente')return alert('Manifestação não está pendente.');if(!d().closed)return alert('A auditoria só começa após o encerramento.');if(d().auditFinalizedAt)return alert('A auditoria já foi finalizada.');const reason=document.getElementById('reason-'+mid)?.value.trim()||'';m.status=result;m.reason=reason;m.reviewedAt=new Date().toISOString();audit('review',{aid,mid,result,reason});save();render()};
const previousAnalyses=analyses;
analyses=function(){if(roles()!=='prescon')return '<div class="notice">Acesso restrito à PRESCON.</div>';return previousAnalyses()+`<div class="card"><h3>Solicitações de alteração de voto</h3>${(db.voteChangeRequests||[]).filter(r=>r.delib===d().id).map(r=>`<div class="editor-q"><p><b>${E(EJS[r.ej])}</b> · ${E(r.reason)} · ${E(r.status)}</p>${r.status==='pending'?`<button class="btn" onclick="l5DecideRequest('${E(r.id)}','approved')">Autorizar</button> <button class="btn outline" onclick="l5DecideRequest('${E(r.id)}','rejected')">Recusar</button>`:''}</div>`).join('')||'<p>Nenhuma solicitação.</p>'}</div>`};
window.l5RequestChange=function(){if(roles()!=='conselho')return;const x=d(),ej=login.ej;if(!answer(x.id,ej))return alert('Ainda não há resposta registrada.');db.voteChangeRequests??=[];if(db.voteChangeRequests.some(r=>r.delib===x.id&&r.ej===ej&&r.status==='pending'))return alert('Já existe uma solicitação pendente.');const reason=prompt('Explique por que deseja alterar o voto:')?.trim();if(!reason)return;db.voteChangeRequests.push({id:'vr-'+Date.now(),delib:x.id,ej,reason,status:'pending',at:new Date().toISOString()});audit('vote-change-request',{delib:x.id,ej,reason});save();render()};
window.l5DecideRequest=function(id,status){if(roles()!=='prescon')return;const r=(db.voteChangeRequests||[]).find(r=>r.id===id);if(!r||r.status!=='pending')return;const reason=prompt('Parecer obrigatório da PRESCON:')?.trim();if(!reason)return;r.status=status;r.reviewReason=reason;r.reviewedAt=new Date().toISOString();audit('vote-change-decision',{id,status,reason});save();render()};
const oldParticipant=v23Participant;
v23Participant=function(){const html=oldParticipant(),x=d();if(roles()==='conselho'&&answer(x.id,login.ej))return html+`<div class="card"><h3>Solicitar alteração do voto</h3><p>Uma nova resposta só poderá ser registrada mediante autorização da PRESCON. Esta demonstração registra o pedido, mas ainda não executa a substituição.</p><button class="btn outline" onclick="l5RequestChange()">Solicitar autorização</button></div>`;return html};
function summary(x,anonymous){
 const entries=rows(x),n=Object.keys(EJS).length;
 const counts=official.map(v=>entries.filter(r=>normalize(r.vote)===v).length);
 const effectiveCounts=['Aprovação confirmada','Reprovação confirmada','Ressalva pendente','Abstenção'].map(status=>entries.filter(r=>effective(r.vote,r.a.manif||[])===status).length);
 const valid=effectiveCounts[0]+effectiveCounts[1];
 const outcome=effectiveCounts[2]?'EM AUDITORIA':!valid?'SEM VOTOS VÁLIDOS':effectiveCounts[0]>effectiveCounts[1]?'APROVADO':effectiveCounts[1]>effectiveCounts[0]?'REPROVADO':'EMPATE';
 let html=hero('RELATÓRIO / '+(anonymous?'CONSELHO':'PRESCON'),'RESULTADO<br>INSTITUCIONAL.','Uma decisão por EJ para toda a deliberação.');
 html+='<div class="grid">'+metric(entries.length,'EJs participantes')+metric(Math.max(0,n-entries.length),'EJs pendentes')+metric(n?(100*entries.length/n).toFixed(1)+'%':'0%','Participação')+metric(outcome,'Resultado')+'</div>';
 html+='<div class="card"><h3>Votos institucionais</h3>'+official.map((v,j)=>'<div class="report-row"><span class="name">'+E(v)+'</span><div class="bar"><div style="width:'+(entries.length?counts[j]/entries.length*100:0)+'%"></div></div><b>'+counts[j]+'</b></div>').join('')+'<p>'+['Favoráveis','Contrários','Ressalvas pendentes','Abstenções'].map((label,i)=>label+': '+effectiveCounts[i]).join(' · ')+'</p></div>';
 if(!anonymous){
  html+='<div class="card"><h3>Manifestações e pareceres</h3>'+entries.flatMap(y=>(y.a.manif||[]).map(m=>'<p><b>'+E(EJS[y.a.ej])+' · '+E(m.type)+':</b> '+E(m.body)+'<br>Decisão: '+E(m.status||'Pendente')+(m.reason?'<br>Parecer: '+E(m.reason):'')+'</p>')).join('')+'</div>';
  html+='<div class="actions"><button class="btn outline" onclick="window.print()">Imprimir relatório</button><button class="btn red" onclick="l5Publish()" '+(!x.auditFinalizedAt?'disabled':'')+'>PUBLICAR RELATÓRIO FINAL</button></div>';
 }else{
  html+='<div class="card"><h3>Manifestações</h3>'+entries.flatMap(y=>(y.a.manif||[]).map(m=>'<p><b>'+E(m.type)+':</b> '+E(m.body)+'<br>Decisão: '+E(m.status||'Pendente')+'</p>')).join('')+'</div>';
 }
 return html;
}
window.l5Publish=function(){if(roles()!=='prescon')return alert('Acesso restrito.');const x=d();if(!x.closed)return alert('Encerre a deliberação antes de publicar o relatório.');if(!x.auditFinalizedAt)return alert('Finalize a auditoria antes de publicar o relatório.');x.publicReports??=[];const version=x.publicReports.length+1;const snapshot=summary(x,true);x.publicReports.push({version,html:snapshot,at:new Date().toISOString()});audit('publish-anonymous-report',{id:x.id,version});save();render()};
const oldReport=report;
report=function(){const x=d();if(roles()==='prescon')return summary(x,false);const latest=x.publicReports?.at(-1);return latest?latest.html+'<p class="tiny">Versão '+latest.version+' · '+E(latest.at)+'</p>':'<div class="card"><h2>Relatório ainda não publicado</h2><p>A versão anonimizada será disponibilizada após o encerramento e publicação pela PRESCON.</p></div>'};

/* Fluxo de auditoria V2.0: encerramento -> análise -> finalização -> publicação.
   Controles locais de demonstração; não substituem validação no servidor. */
const auditPending=x=>reviews(x).flatMap(a=>(a.manif||[]).filter(m=>m.type==='Ressalva'&&m.status!=='aceita'&&m.status!=='recusada'));
window.l5FinalizeAudit=function(){
 if(roles()!=='prescon')return alert('Ação exclusiva da PRESCON.');
 const x=d();
 if(!x.closed)return alert('A deliberação precisa estar encerrada.');
 if(x.auditFinalizedAt)return alert('Auditoria já finalizada.');
 const pending=auditPending(x);
 if(pending.length)return alert('Ainda existem '+pending.length+' ressalva(s) pendente(s).');
 if(!confirm('Finalizar a auditoria? Os pareceres ficarão bloqueados.'))return;
 x.auditFinalizedAt=new Date().toISOString();
 audit('finalize-audit',{delib:x.id,at:x.auditFinalizedAt});
 save();render();
};
const previousReportV20=report;
report=function(){
 const html=previousReportV20();
 if(roles()!=='prescon')return html;
 const x=d(),pending=auditPending(x).length;
 const status=!x.closed?'Aguardando encerramento':x.auditFinalizedAt?'Auditoria finalizada':'Em auditoria';
 const action=x.closed&&!x.auditFinalizedAt?
 '<button class="btn red" onclick="l5FinalizeAudit()" '+(pending?'disabled':'')+'>FINALIZAR AUDITORIA</button>':'';
 return '<section class="card" aria-label="Etapa de auditoria"><h3>FLUXO INSTITUCIONAL · V2.0</h3><p><b>Estado:</b> '+E(status)+' · <b>Ressalvas pendentes:</b> '+pending+'</p><p class="tiny">A publicação do relatório exige a finalização prévia da auditoria. Dados ainda locais neste protótipo.</p>'+action+'</section>'+html;
};

/* Painel de acompanhamento V2.0 — somente visual, sem simular backend. */
const previousRenderV20=render;
render=function(){
  previousRenderV20();
  if(login?.role!=='prescon')return;
  const root=document.getElementById('root');
  if(!root||document.getElementById('v20-roadmap'))return;
  const panel=document.createElement('section');
  panel.id='v20-roadmap';
  panel.setAttribute('aria-label','Estado da versão 2.0');
  panel.innerHTML='<div class="v20-eyebrow">PORTAL NEJLON 2027 · EVOLUÇÃO V2.0</div><h2>DO PROTÓTIPO À DELIBERAÇÃO REAL.</h2><p>Esta versão ainda é demonstrativa: os votos e cadastros são armazenados neste navegador. Não utilize para deliberações oficiais.</p><div class="v20-grid"><div><b>01 · ESTRUTURA</b><span>Interface e visualização financeira existentes</span></div><div><b>02 · SEGURANÇA</b><span>Autenticação e banco compartilhado pendentes</span></div><div><b>03 · VOTAÇÃO</b><span>Voto único por EJ em desenvolvimento</span></div><div><b>04 · RESULTADOS</b><span>Auditoria e relatório PDF pendentes</span></div></div><small>Prévia visual de acompanhamento — não representa funcionalidades concluídas.</small>';
  const main=root.querySelector('.content')||root;
  main.prepend(panel);
};
const roadmapStyle=document.createElement('style');
roadmapStyle.textContent=`
:root{--red:#ff0000}
#v20-roadmap{background:#ff0000;color:#fff;padding:25px 27px;margin:0 0 22px;border:3px solid #111;box-shadow:8px 8px 0 #111;border-radius:0}
#v20-roadmap .v20-eyebrow{font-size:11px;font-weight:900;letter-spacing:1.7px;color:#111}
#v20-roadmap h2{font-family:'CY Grotesk V3 Key','Arial Black',sans-serif;font-weight:900;font-size:clamp(25px,3.4vw,45px);line-height:1.04;letter-spacing:-1px;text-transform:uppercase;-webkit-text-stroke:1px #111;text-shadow:3px 3px 0 #111;margin:12px 0}
#v20-roadmap p{max-width:760px;font-size:13px;line-height:1.6;color:#fff}
#v20-roadmap .v20-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:20px 0}
#v20-roadmap .v20-grid>div{background:#111;color:#fff;padding:14px 16px;display:grid;gap:7px;border:1px solid #fff}
#v20-roadmap .v20-grid b{color:#ff3b3b;font-size:12px;letter-spacing:.5px}
#v20-roadmap .v20-grid span{font-size:12px;line-height:1.5}
#v20-roadmap small{color:#111;font-size:10px;font-weight:800}
@media(max-width:720px){#v20-roadmap{padding:18px;box-shadow:4px 4px 0 #111}#v20-roadmap .v20-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(roadmapStyle);

render();
})();
