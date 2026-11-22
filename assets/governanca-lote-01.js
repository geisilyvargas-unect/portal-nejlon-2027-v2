/* Lote 01 — RN-001 a RN-010. Apenas permissões de interface DEMONSTRATIVAS. */
(function(){
'use strict';
const role=()=>typeof login!=='undefined'&&login?login.role:null;
const isPrescon=()=>role()==='prescon';
const deny=()=>{alert('Ação restrita à PRESCON do Núcleo (controle demonstrativo).');return false};
const allowedPath=(path)=>{
 if(!role())return true;
 if(path.startsWith('/prescon')||path.startsWith('/relatorios'))return isPrescon();
 if(path.startsWith('/deliberar'))return role()==='conselho'||isPrescon();
 if(path.startsWith('/direx'))return role()==='direx'||isPrescon();
 return true;
};
const previousRender=render;
render=function(){
 previousRender();
 if(!login)return;
 const path=decodeURIComponent(location.hash.slice(1)||'/prescon');
 const root=document.getElementById('root');
 if(!root)return;
 if(!allowedPath(path)){
   root.innerHTML='<div class="card" role="alert"><h2>Acesso restrito</h2><p>Este perfil não pode visualizar esta área. A seleção de perfis é apenas uma simulação, sem autenticação real.</p><button class="btn" onclick="logout()">Trocar perfil</button></div>';
 }
 const top=document.querySelector('.top');
 if(top&&!document.getElementById('demo-governance-notice')){
   const tag=document.createElement('span');tag.id='demo-governance-notice';
   tag.textContent='DEMONSTRAÇÃO · SEM AUTENTICAÇÃO REAL';
   tag.style.cssText='font-size:10px;font-weight:900;color:#a21722;letter-spacing:.4px';
   top.appendChild(tag);
 }
};
const previousCreate=create;
create=function(event){if(!isPrescon()){event?.preventDefault();return deny()}return previousCreate(event)};
const previousPublish=publish;
publish=function(id){
 if(!isPrescon())return deny();
 const x=db.delibs.find(v=>v.id===id);
 if(!x||x.published||x.closed){alert('Somente rascunhos podem ser publicados.');return false}
 if(!x.title?.trim()||!Array.isArray(x.questions)||!x.questions.length){alert('Título e perguntas são obrigatórios.');return false}
 return previousPublish(id);
};
const previousClose=closeDelib;
closeDelib=function(id){
 if(!isPrescon())return deny();
 const x=db.delibs.find(v=>v.id===id);
 if(!x||!x.published||x.closed){alert('Somente deliberações abertas podem ser encerradas.');return false}
 return previousClose(id);
};
const previousV23Save=v23Save;
v23Save=function(){
 if(!isPrescon())return deny();
 const x=d();
 if(x.published||x.closed){alert('O formulário publicado está bloqueado. Crie uma nova deliberação para alterar perguntas.');return false}
 return previousV23Save();
};
const previousV23Add=v23Add,previousV23Remove=v23Remove;
v23Add=function(){if(!isPrescon()||d().published)return deny();return previousV23Add()};
v23Remove=function(i){if(!isPrescon()||d().published)return deny();return previousV23Remove(i)};
const previousV23Editor=v23Editor;
v23Editor=function(){
 const html=previousV23Editor();
 if(!d().published)return html;
 return '<div class="notice"><b>Formulário publicado — edição bloqueada.</b> A estrutura das perguntas não pode ser alterada após a publicação.</div>'+html;
};
render();
})();