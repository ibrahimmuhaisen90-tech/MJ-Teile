(()=>{
  'use strict';
  const STORE_KEY='mj-teilepruefer-db-v2';
  const INSTALL_KEY='mj-teilepruefer-install-hidden';
  const $=id=>document.getElementById(id);
  const emptyDb=()=>({version:2,sources:[]});
  let db=loadDb();

  function normalize(value){return String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');}
  function canonical(value){const part=normalize(value);return /^A\d{10}$/.test(part)?part:'';}
  function extract(text){
    const matches=[...String(text||'').matchAll(/(?:^|[^A-Z0-9])(A(?:[\s._/\-]*\d){10})(?![A-Z0-9])/gi)];
    return [...new Set(matches.map(match=>canonical(match[1])).filter(Boolean))];
  }
  function loadDb(){try{const value=JSON.parse(localStorage.getItem(STORE_KEY));return value&&Array.isArray(value.sources)?value:emptyDb();}catch{return emptyDb();}}
  function saveDb(){localStorage.setItem(STORE_KEY,JSON.stringify(db));renderDatabase();}
  function indexDb(){
    const index=new Map();
    for(const source of db.sources){for(const part of source.parts||[]){if(!index.has(part))index.set(part,[]);index.get(part).push(source.name);}}
    return index;
  }
  function renderDatabase(){
    const index=indexDb();$('database-count').textContent=`${index.size.toLocaleString('de-DE')} Nummern`;
    const box=$('source-list');box.replaceChildren();
    if(!db.sources.length){box.innerHTML='<p class="empty">Noch keine Dateien hinzugefügt.</p>';return;}
    for(const source of db.sources){const row=document.createElement('div');row.className='source-row';const name=document.createElement('span');name.textContent=source.name;const count=document.createElement('small');count.textContent=`${source.parts.length.toLocaleString('de-DE')} Nummern`;row.append(name,count);box.append(row);}
  }
  function setStatus(text){$('app-status').textContent=text;}
  async function addFiles(fileList){
    const files=[...fileList];if(!files.length)return;let added=0,empty=[];
    for(const file of files){const text=await file.text();const parts=extract(text);if(!parts.length){empty.push(file.name);continue;}const existing=db.sources.findIndex(source=>source.name===file.name);const record={name:file.name,size:file.size,updatedAt:new Date().toISOString(),parts};if(existing>=0)db.sources[existing]=record;else db.sources.push(record);added+=parts.length;}
    saveDb();setStatus(`${files.length} Datei(en) verarbeitet · ${added.toLocaleString('de-DE')} erkannte Einträge.`);
    if(empty.length)alert(`Keine A-Artikelnummer gefunden in:\n${empty.join('\n')}`);
  }
  function search(value,focus=true){
    const part=canonical(value);const help=$('search-help');
    if(!part){help.textContent='Bitte A plus zehn Ziffern eingeben, z. B. A6012030075.';help.classList.add('error');$('results').hidden=true;if(focus)$('part').focus();return {ok:false,error:'invalid_part'};}
    help.textContent='A plus zehn Ziffern eingeben.';help.classList.remove('error');$('part').value=part;
    const files=indexDb().get(part)||[];$('result-part').textContent=part;$('results').hidden=false;
    $('database-result').textContent=files.length?'Artikelnummer ist in der lokalen Datenbank vorhanden.':'Artikelnummer wurde in der lokalen Datenbank nicht gefunden.';
    $('database-files').textContent=files.length?files.join(', '):'';
    $('database-status').textContent=files.length?'VORHANDEN':'NICHT GEFUNDEN';$('database-status').className=`source-status ${files.length?'found':'missing'}`;
    $('overall').textContent=files.length?'IN DATENBANK':'SHOP-PRÜFUNG OFFEN';$('overall').className=`status-badge ${files.length?'found':'missing'}`;
    $('ebay-link').href='https://www.ebay.de/sch/i.html?'+new URLSearchParams({_ssn:'mjteile100',_nkw:part,_oac:'1'});
    $('klein-link').dataset.part=part;setStatus(`${part} geprüft · Shop-Ergebnisse in den Original-Shops öffnen.`);
    $('results').scrollIntoView({behavior:'smooth',block:'start'});return {ok:true,part,inDatabase:!!files.length,files};
  }

  $('files').addEventListener('change',async event=>{await addFiles(event.target.files);event.target.value='';});
  $('search-form').addEventListener('submit',event=>{event.preventDefault();search($('part').value);});
  $('part').addEventListener('input',event=>{event.target.value=event.target.value.toUpperCase();});
  $('klein-link').addEventListener('click',async()=>{const part=$('klein-link').dataset.part;if(!part)return;try{await navigator.clipboard.writeText(part);setStatus(`${part} kopiert · im Kleinanzeigen-Profil in „Suchen“ einfügen.`);}catch{setStatus(`Im Kleinanzeigen-Profil nach ${part} suchen.`);}window.open('https://www.kleinanzeigen.de/pro/MJ-Autoteile-und-Zubehoer','_blank','noopener');});
  $('backup').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`MJ-Teiledatenbank-${new Date().toISOString().slice(0,10)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);});
  $('restore').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{const value=JSON.parse(await file.text());if(!value||!Array.isArray(value.sources))throw new Error();db=value;saveDb();setStatus('Datenbank-Sicherung geladen.');}catch{alert('Diese Datei ist keine gültige MJ-Teiledatenbank-Sicherung.');}event.target.value='';});
  $('clear').addEventListener('click',()=>{if(!db.sources.length)return;if(!confirm('Die lokale Datenbank auf diesem Gerät wirklich leeren?'))return;db=emptyDb();saveDb();$('results').hidden=true;setStatus('Lokale Datenbank geleert.');});
  $('hide-install').addEventListener('click',()=>{$('install-card').hidden=true;localStorage.setItem(INSTALL_KEY,'1');});
  if(localStorage.getItem(INSTALL_KEY)==='1'||matchMedia('(display-mode: standalone)').matches)$('install-card').hidden=true;
  function network(){const online=navigator.onLine;$('network').textContent=online?'Online':'Offline';$('network').classList.toggle('offline',!online);}network();addEventListener('online',network);addEventListener('offline',network);
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).catch(()=>setStatus('Offline-Nutzung konnte noch nicht vorbereitet werden.'));
  renderDatabase();

  const context=document.modelContext;
  if(context?.registerTool){
    const register=tool=>Promise.resolve(context.registerTool(tool)).catch(()=>{});
    register({name:'search_part',title:'Teilenummer suchen',description:'Prüft eine Mercedes-A-Artikelnummer in der sichtbaren lokalen Datenbank und bereitet die zwei Shop-Links vor.',inputSchema:{type:'object',properties:{partNumber:{type:'string',description:'Artikelnummer wie A6012030075'}},required:['partNumber'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:input=>{const result=search(input?.partNumber,false);if(!result.ok)throw new Error('Ungültige Artikelnummer: erwartet wird A plus zehn Ziffern.');return result;}});
    register({name:'get_database_summary',title:'Datenbankstatus lesen',description:'Liest die Anzahl lokaler Dateien und eindeutiger Artikelnummern.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({files:db.sources.length,uniqueParts:indexDb().size})});
  }
})();

