(() => {
 const status=document.getElementById('offline-status'),update=document.getElementById('app-update');
 document.getElementById('backup-all').onclick=()=>{
  const slots=JSON.parse(localStorage.getItem('mj-html-slots-v1')||'[]');
  const records=slots.map(fields=>({format:'mj-autoteile',version:1,fields}));
  const link=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(records,null,2)],{type:'application/json'}));
  link.href=url;link.download='MJ-ATP-Sicherung-'+new Date().toISOString().slice(0,10)+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
 };
 if(!('serviceWorker' in navigator)){status.textContent='Offline-Nutzung ist in diesem Browser nicht verfügbar.';return;}
 navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(async registration=>{
  const activateWaiting=()=>registration.waiting?.postMessage('ACTIVATE');
  const offer=()=>{update.hidden=!(registration.waiting&&registration.active);update.onclick=()=>{registration.waiting?.postMessage('ACTIVATE');};};
  offer();activateWaiting();registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){offer();activateWaiting();}});});
  await navigator.serviceWorker.ready;
  const show=()=>{status.textContent=navigator.onLine?'Für Offline-Nutzung bereit · Daten auf diesem Gerät':'Offline · Daten auf diesem Gerät';};
  show();addEventListener('online',show);addEventListener('offline',show);
  let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(update.hidden||refreshing)return;refreshing=true;location.reload();});
 }).catch(()=>{status.textContent='Offline-Vorbereitung fehlgeschlagen. Bitte online erneut öffnen.';});
})();

