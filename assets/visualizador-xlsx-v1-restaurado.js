/* Visualizador de PF recuperado do commit V1 3e1949b.
   Todas as abas e células em grade, original preservado para download.
   A prévia HTML não substitui o Excel para estilos, gráficos e fórmulas. */
(function(){
'use strict';
const escText=x=>esc(String(x??''));
const key=id=>'nejlon-pf-original-'+id;
const letter=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
function renderGrid(rows){
 const width=Math.max(1,...rows.map(r=>r.length));
 const cols=Array.from({length:width},(_,i)=>'<th scope="col">'+letter(i)+'</th>').join('');
 const body=rows.map((r,i)=>'<tr><th scope="row">'+(i+1)+'</th>'+Array.from({length:width},(_,j)=>'<td>'+escText(r[j]??'')+'</td>').join('')+'</tr>').join('');
 return '<table class="pf-v1-grid"><thead><tr><th aria-label="Linha e coluna"></th>'+cols+'</tr></thead><tbody>'+body+'</tbody></table>';
}
async function readOriginal(x){
 const pf=getPF(x),saved=localStorage.getItem(key(x.id));
 if(pf?.blob)return XLSX.read(pf.blob,{type:'array',cellDates:true,cellFormula:true});
 if(saved){
  const base64=saved.split(',')[1];if(!base64)throw Error('Arquivo armazenado inválido.');
  const raw=atob(base64),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
  return XLSX.read(bytes,{type:'array',cellDates:true,cellFormula:true});
 }
 if(pf?.sheets&&Object.keys(pf.sheets).length)return {SheetNames:Object.keys(pf.sheets),legacySheets:pf.sheets};
 return null;
}
const originalOpen=v23OpenPF;
v23OpenPF=async function(){
 const x=d(),host=document.getElementById('v23PFViewer');
 if(!host)return originalOpen();
 if(typeof XLSX==='undefined')return host.textContent='A biblioteca de planilhas não carregou. Recarregue a página para tentar novamente.';
 host.innerHTML='<div class="pf-v1-viewer"><div class="row"><strong>VISUALIZAÇÃO DA PLANILHA ORIGINAL · '+escText(x.file||'PF')+'</strong><button class="btn outline" type="button" onclick="v23DownloadPF()">BAIXAR XLSX ORIGINAL</button></div><p class="tiny">Abas, linhas e colunas para consulta. Valores exibidos são preservados quando presentes no XLSX; cores, gráficos, mesclagens e recálculo podem diferir do Excel.</p><div class="pf-v1-tabs" role="tablist" aria-label="Abas do PF"></div><div class="pf-v1-scroll" role="region" tabindex="0" aria-label="Grade da planilha"></div><p class="tiny pf-v1-status" role="status">Carregando planilha…</p></div>';
 const tabs=host.querySelector('.pf-v1-tabs'),view=host.querySelector('.pf-v1-scroll'),status=host.querySelector('.pf-v1-status');
 try{
  const workbook=await readOriginal(x);
  if(!workbook?.SheetNames?.length)throw Error('O arquivo original não está disponível neste navegador. Reimporte o XLSX na PRESCON.');
  const sheets=workbook.SheetNames.map(name=>({name,rows:workbook.legacySheets?workbook.legacySheets[name]:XLSX.utils.sheet_to_json(workbook.Sheets[name],{header:1,defval:'',raw:false,blankrows:true})}));
  const show=i=>{
   const sh=sheets[i];view.innerHTML=renderGrid(sh.rows);
   tabs.querySelectorAll('button').forEach((b,j)=>{b.classList.toggle('active',i===j);b.setAttribute('aria-selected',String(i===j))});
   const width=Math.max(1,...sh.rows.map(r=>r.length));
   status.textContent=sh.name+' · '+sh.rows.length+' linhas · '+width+' colunas · somente leitura';
  };
  sheets.forEach((sh,i)=>{const button=document.createElement('button');button.type='button';button.textContent=sh.name;button.setAttribute('role','tab');button.setAttribute('aria-selected','false');button.addEventListener('click',()=>show(i));tabs.append(button)});
  show(0);
 }catch(error){status.textContent='Não foi possível visualizar: '+String(error.message||error)}
};
const style=document.createElement('style');
style.textContent='.pf-v1-viewer{margin:16px 0;border:2px solid #111;background:#fff;color:#111;padding:16px}.pf-v1-tabs{display:flex;gap:6px;overflow-x:auto;padding:12px 0}.pf-v1-tabs button{white-space:nowrap;padding:10px 14px;background:#111;color:#fff;border:1px solid #111;cursor:pointer;font-weight:800}.pf-v1-tabs button.active{background:#f00;color:#fff}.pf-v1-scroll{max-height:620px;overflow:auto;border:1px solid #999;background:#fff}.pf-v1-grid{border-collapse:collapse;width:max-content;min-width:100%;font:12px Arial,sans-serif;color:#111}.pf-v1-grid td,.pf-v1-grid th{border:1px solid #ccc;padding:6px 8px;min-width:70px;white-space:pre-wrap;vertical-align:top}.pf-v1-grid th{background:#eee;position:sticky;top:0;z-index:1}.pf-v1-grid tbody th{position:sticky;left:0;z-index:1}.pf-v1-status{margin-top:10px}';
document.head.appendChild(style);
})();