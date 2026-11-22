/* Visualizador XLSX restaurado da lógica V1: abas, grade, download original. */
(function(){
'use strict';
const escape=x=>esc(String(x??''));
const storageKey=id=>'nejlon-pf-original-'+id;
function safeSheetHtml(sheet){
 const html=XLSX.utils.sheet_to_html(sheet,{header:'',footer:'',id:'nejlon-pf-visual'});
 const doc=new DOMParser().parseFromString(html,'text/html');
 doc.querySelectorAll('script,iframe,object,embed,form,style,link,svg').forEach(e=>e.remove());
 doc.querySelectorAll('*').forEach(e=>{for(const a of [...e.attributes])if(/^on/i.test(a.name)||['href','src','srcdoc','style'].includes(a.name))e.removeAttribute(a.name)});
 return doc.body.innerHTML;
}
function grid(rows){
 const max=Math.min(100,Math.max(1,...rows.map(r=>r.length)));
 const col=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
 return '<table class="l3sheet"><thead><tr><th></th>'+Array.from({length:max},(_,i)=>'<th>'+col(i)+'</th>').join('')+'</tr></thead><tbody>'+rows.map((r,i)=>'<tr><th>'+(i+1)+'</th>'+Array.from({length:max},(_,j)=>'<td>'+escape(r[j]??'')+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
}
const previousOpen=v23OpenPF;
v23OpenPF=function(){
 const x=d(),host=document.getElementById('v23PFViewer');
 if(!host)return previousOpen();
 const stored=localStorage.getItem(storageKey(x.id)),pf=getPF(x);
 if(!stored&&!pf?.blob&&!pf?.sheets)return previousOpen();
 host.innerHTML='<div class="l3viewer"><div class="row"><strong>PLANILHA · '+escape(x.file||pf?.name||'XLSX')+'</strong><button class="btn outline" type="button" onclick="v23DownloadPF()">Baixar original</button></div><p class="tiny">Consulta somente leitura. A prévia não reproduz necessariamente gráficos, imagens, fontes ou todas as fórmulas; o XLSX original é a referência.</p><div class="l3tabs" role="tablist"></div><div class="l3scroll" tabindex="0" role="region" aria-label="Planilha financeira"></div><p class="tiny l3status" role="status"></p></div>';
 const tabs=host.querySelector('.l3tabs'),view=host.querySelector('.l3scroll'),status=host.querySelector('.l3status');
 try{
  let workbook=null;
  if(typeof XLSX!=='undefined'&&(stored||pf?.blob)){
   let bytes;
   if(pf?.blob)bytes=pf.blob;
   else{const base64=stored.split(',')[1];const bin=atob(base64);bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));}
   workbook=XLSX.read(bytes,{type:'array',cellStyles:true,cellDates:true,cellFormula:true});
  }
  const names=workbook?.SheetNames||Object.keys(pf?.sheets||{});
  if(!names.length)throw Error('Não há abas disponíveis neste navegador.');
  function show(i){
   const name=names[i];
   tabs.querySelectorAll('button').forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-selected',String(j===i))});
   if(workbook)view.innerHTML=safeSheetHtml(workbook.Sheets[name]);
   else view.innerHTML=grid(pf.sheets[name]||[]);
   status.textContent='Aba '+(i+1)+' de '+names.length+': '+name+' · prévia somente leitura';
  }
  names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.setAttribute('role','tab');b.onclick=()=>show(i);tabs.append(b)});
  show(0);
 }catch(e){status.textContent='Não foi possível abrir a planilha: '+e.message;}
};
const style=document.createElement('style');
style.textContent='.l3viewer{margin:16px 0;border:2px solid #171717;border-radius:12px;padding:16px;background:#fff;color:#111}.l3tabs{display:flex;overflow-x:auto;gap:6px;padding:10px 0}.l3tabs button{white-space:nowrap;padding:9px 12px;background:#151515;color:#fff;border:1px solid #555;border-radius:6px;cursor:pointer}.l3tabs button.active{background:#ef202a;color:white;border-color:#ef202a}.l3scroll{max-height:580px;overflow:auto;border:1px solid #bbb;background:#fff}.l3scroll table{border-collapse:collapse;width:max-content;min-width:100%;font-size:12px;color:#111}.l3scroll td,.l3scroll th{border:1px solid #ddd;padding:5px 8px;min-width:68px;white-space:pre-wrap;vertical-align:top}.l3scroll th{background:#eee;position:sticky;top:0;z-index:1}.l3scroll tr:nth-child(even){background:#fafafa}.l3status{margin-top:8px}';
 document.head.appendChild(style);
})();
