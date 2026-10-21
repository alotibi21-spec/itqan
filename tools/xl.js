const {chromium,webkit,devices}=require('playwright');const U='http://localhost:8799/';
const R=[['desk',chromium,{viewport:{width:1366,height:900},acceptDownloads:true}],['Pixel 7',chromium,{...devices['Pixel 7'],acceptDownloads:true}],['iPhone 12',webkit,{...devices['iPhone 12'],acceptDownloads:true}]];
(async()=>{for(const [n,bt,d] of R){const b=await bt.launch(bt===chromium?{channel:'chrome'}:{});const c=await b.newContext(d);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',x=>x.accept());const ev=(f,a)=>p.evaluate(f,a);const o={};
await p.goto(U);await p.waitForTimeout(1500);await ev(()=>needX&&needX());await p.waitForTimeout(800);
const [dl]=await Promise.all([p.waitForEvent('download'),ev(()=>xlsx('skills'))]);const fp='/tmp/xl_'+n.replace(' ','')+'.xlsx';await dl.saveAs(fp);
o.exp=await ev(()=>S.skills.length);
// remove 5 with units, then re-import
o.rm=await ev(()=>{const L=S.skills.filter(s=>s.unit&&s.subject==='الدراسات الاجتماعية').slice(0,5);window._t=L.map(s=>[s.name,s.unit]);const ids=new Set(L.map(s=>s.id));S.skills=S.skills.filter(s=>!ids.has(s.id));return L.length});
const [fc]=await Promise.all([p.waitForEvent('filechooser'),ev(()=>importStart('skills'))]);await fc.setFiles(fp);await p.waitForTimeout(1500);
o.mapUnit=await ev(()=>{try{return IMP.map.unit>=0}catch(e){return e.stack}});o.go=await ev(()=>{try{impGo()}catch(e){return e.stack}});await p.waitForTimeout(500);
o.after=await ev(()=>S.skills.length);o.unitsKept=await ev(()=>_t.every(([nm,u])=>S.skills.some(s=>s.name===nm&&s.unit===u)));
// upgrade from 1.1.0
await ev(async()=>{const st=JSON.parse(JSON.stringify(S));st.settings.skV=1;delete st.settings.skDel;st.skills=[{id:'a1',name:'مهارة مخصصة قديمة',subject:'العلوم',grade:'الخامس الابتدائي'},...S.skills.filter(s=>s.src===NAFS_TAG).slice(0,3).map((s,i)=>({id:'n'+i,name:s.name,subject:s.subject,grade:s.grade,src:s.src})),{id:'a2',name:S.skills.find(s=>s.sid&&s.subject==='الرياضيات').name,subject:'الرياضيات',grade:S.skills.find(s=>s.sid&&s.subject==='الرياضيات').grade}];await DB.put('state',st)});
await p.reload();await p.waitForTimeout(1800);
o.up110=await ev(()=>({n:S.skills.length,seeds:seeds().length,old:S.skills.some(s=>s.id==='a1'),skV:S.settings.skV,dupName:(()=>{const m={};S.skills.forEach(s=>{const k=s.subject+'|'+s.grade+'|'+s.name+'|'+(s.unit||'');m[k]=(m[k]||0)+1});return Object.values(m).filter(x=>x>1).length})(),social:S.skills.filter(s=>s.subject==='الدراسات الاجتماعية').length}));
// upgrade from 1.2.0 with tombstone
await ev(async()=>{const st=JSON.parse(JSON.stringify(S));st.settings.skV=2;const v=st.skills.find(s=>s.sid&&s.subject==='العلوم');st.settings.skDel=[{sid:v.sid,subject:v.subject,grade:v.grade}];st.skills=st.skills.filter(s=>s.sid!==v.sid&&!['اللغة الإنجليزية','الدراسات الاجتماعية','المهارات الرقمية','التفكير الناقد','القرآن الكريم والدراسات الإسلامية'].includes(s.subject));window._sid=v.sid;await DB.put('state',st);localStorage._sid=v.sid});
await p.reload();await p.waitForTimeout(1800);
o.up120=await ev(()=>({n:S.skills.length,tombKept:!S.skills.some(s=>s.sid===localStorage._sid),skV:S.settings.skV,dup:(()=>{const m={};S.skills.forEach(s=>{if(s.sid)m[s.sid]=(m[s.sid]||0)+1});return Object.values(m).filter(x=>x>1).length})(),newSubj:new Set(S.skills.map(s=>s.subject)).size}));
console.log(n,JSON.stringify(o),'ERR',JSON.stringify(errs));await b.close()}})();
