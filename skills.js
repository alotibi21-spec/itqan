/*! منصة إتقان — © 1448هـ عبدالله خالد العتيبي. جميع الحقوق محفوظة — All Rights Reserved. */
/* المهارات: بذور رسمية (نافس + كتب الطالب)، شواهد الحذف، الوحدات، الترتيب، التحديد الجماعي */
const NAFS_TAG='نافس 2026 (هيئة تقويم التعليم والتدريب)',NAFS_UNIT='نواتج نافس 2026';
function sidOf(sub,g,u,n){return[sub,g,u,n].map(N).join('|')}
let SEEDS=null;
function seeds(){if(SEEDS)return SEEDS;SEEDS=[];
 for(const[sub,G]of Object.entries(SK0))for(const[g,L]of Object.entries(G))L.forEach(n=>SEEDS.push({name:n,subject:sub,grade:g,unit:NAFS_UNIT,src:NAFS_TAG}));
 (window.SKD||[]).forEach(([sub,g,sem,book,unit,L])=>L.forEach(n=>SEEDS.push({name:n,subject:sub,grade:g,unit,src:`${book} – ${g} – ${sem} – ${unit}`})));
 SEEDS.forEach((x,i)=>{x.sid=sidOf(x.subject,x.grade,x.unit,x.name);x.ord=i});return SEEDS}
function tomb(list){const st=S.settings;st.skDel=st.skDel||[];list.forEach(s=>{if(s.sid&&!st.skDel.some(t=>t.sid===s.sid))st.skDel.push({sid:s.sid,subject:s.subject,grade:s.grade})})}
function skMerge(force){const st=S.settings;if(!force&&(st.skV||0)>=SKV)return;st.skDel=st.skDel||[];
 /* ربط مهارات نافس المضافة في 1.1.0 (بلا معرّف) بمعرّفها */
 S.skills.forEach(s=>{if(!s.sid&&s.src===NAFS_TAG){s.sid=sidOf(s.subject,s.grade,NAFS_UNIT,s.name);if(!s.unit)s.unit=NAFS_UNIT}});
 const have=new Set(S.skills.map(s=>s.sid).filter(Boolean)),dead=new Set(st.skDel.map(t=>t.sid));
 seeds().forEach(x=>{if(!have.has(x.sid)&&!dead.has(x.sid))S.skills.push({id:uid(),...x,hide:''})});
 /* 1.6.0: إزالة المهارات الأصلية المتقاعدة (المكررة بين الطبعات) إن لم تُعدَّل ولم تُسجَّل لها نتائج */
 if((st.skV||0)<6){const cur=new Set(seeds().map(x=>x.sid)),used=new Set([...(S.results||[]).map(r=>r.skill),...(S.attempts||[]).map(a=>a.skill)].filter(Boolean));
  S.skills=S.skills.filter(s=>!(s.sid&&!cur.has(s.sid)&&s.src!==NAFS_TAG&&!s.hide&&s.sid===sidOf(s.subject,s.grade,s.unit,s.name)&&!used.has(s.name)))}
 st.skV=SKV}
function unitKey(sub,g){return sub+'||'+g}
function unitsOf(sub,g){const st=S.settings;const L=[];const add=u=>{if(u&&!L.includes(u))L.push(u)};
 skSorted(S.skills.filter(s=>s.subject===sub&&(s.grade||'')===(g||''))).forEach(s=>add(s.unit));((st.units||{})[unitKey(sub,g)]||[]).forEach(add);return L}
function unitOpts(){const c=S.settings.ctx||{};const subs=subjOpts();const L=[];subs.forEach(sb=>unitsOf(sb,c.grade||'').forEach(u=>{if(!L.includes(u))L.push(u)}));return L}
function skSorted(L){return L.slice().sort((a,b)=>(a.ord??1e9)-(b.ord??1e9))}
const SKSEL=new Set(),SKOPEN=new Set();
function skBooks(L){const m=new Set();L.forEach(s=>{if(!s.src)return;m.add(s.src===NAFS_TAG?NAFS_TAG:s.src.split(' – ').slice(0,3).join(' – '))});return[...m]}
V.skills=()=>{const c=S.settings.ctx||{};const subs=subjOpts();const g=c.grade||'';
 const intro=head('🎯 المهارات ونواتج التعلم','مهارات جاهزة من مصادر رسمية فقط (نافس وكتب الطالب)، مرتبة حسب الوحدة. يمكنك التعديل والحذف والإخفاء وإعادة الترتيب والنقل بين الوحدات، وإضافة مهاراتك، والاستيراد والتصدير عبر Excel.');
 const ctxRows=S.skills.filter(s=>(!c.stage||!s.subject||subs.includes(s.subject))&&(!g||!s.grade||s.grade===g));
 const table=`<details class="card" ${g?'':'open'}><summary><b>📋 جدول المهارات — استيراد وتصدير Excel</b> <span class="tag">${AR(ctxRows.length)}</span></summary>${tbl('skills',{rows:ctxRows,hide:['src']})}</details>`;
 if(!g)return intro+`<div class="card"><h3>اختر المرحلة والصف لعرض المهارات حسب الوحدات</h3>${ctxPicker('sk')}</div>`+table;
 const cards=subs.map(sb=>{const L=skSorted(S.skills.filter(s=>s.subject===sb&&(s.grade||'')===g));const U=unitsOf(sb,g);const noU=L.filter(s=>!s.unit);
  const dead=(S.settings.skDel||[]).filter(t=>t.subject===sb&&t.grade===g).length+seeds().filter(x=>x.subject===sb&&x.grade===g&&!S.skills.some(s=>s.sid===x.sid)&&!(S.settings.skDel||[]).some(t=>t.sid===x.sid)).length;
  const books=skBooks(L);const sbE=esc(sb);
  const unitHtml=(u,arr)=>{const k=sb+'|'+g+'|'+u;const open=SKOPEN.has(k);return`<details class="sku" data-uk="${esc(k)}" ${open?'open':''}><summary><input type="checkbox" class="skc" data-sku="${esc(k)}" aria-label="تحديد كل مهارات الوحدة"> <b>${esc(u||'بدون وحدة')}</b> <span class="tag">${AR(arr.length)}</span>${u?` <span class="no-print skua"><button class="btn ghost sm" data-act="skUnitRen" data-s="${sbE}" data-u="${esc(u)}" aria-label="إعادة تسمية الوحدة">✏️</button><button class="btn ghost sm" data-act="skUnitDel" data-s="${sbE}" data-u="${esc(u)}" aria-label="حذف الوحدة">🗑️</button></span>`:''}</summary>
   <ul class="skl">${arr.map((s,i)=>`<li class="${s.hide==='نعم'?'skh':''}"><input type="checkbox" class="skc" data-skid="${s.id}" ${SKSEL.has(s.id)?'checked':''} aria-label="تحديد"><span class="skn">${esc(s.name)}${s.hide==='نعم'?' <span class="tag">مخفية</span>':''}${s.src?'':' <span class="tag">مُضافة</span>'}</span><span class="ska no-print"><button class="btn ghost sm" data-act="skMv" data-id="${s.id}" data-d="-1" ${i?'':'disabled'} aria-label="لأعلى">⬆️</button><button class="btn ghost sm" data-act="skMv" data-id="${s.id}" data-d="1" ${i<arr.length-1?'':'disabled'} aria-label="لأسفل">⬇️</button><button class="btn ghost sm" data-act="skHide" data-id="${s.id}" aria-label="إخفاء/إظهار">${s.hide==='نعم'?'👁️':'🙈'}</button><button class="btn ghost sm" data-act="edit" data-k="skills" data-id="${s.id}" aria-label="تعديل">✏️</button><button class="btn ghost sm" data-act="skDel1" data-id="${s.id}" aria-label="حذف">🗑️</button></span></li>`).join('')}</ul>
   <button class="btn ghost sm no-print" data-act="skAddIn" data-s="${sbE}" data-u="${esc(u)}">＋ مهارة في هذه الوحدة</button></details>`};
  return`<div class="card skcard"><h3>📘 ${sbE} <span class="tag">${AR(L.length)}</span></h3>
  <p class="small muted">📖 المصدر: ${books.length?books.map(esc).join('؛ '):'—'}</p>
  ${L.length?'':`<p class="small">⚠️ لم يُعثر بعد على مصدر رسمي مُتاح لمهارات هذه المادة لهذا الصف — أضِف مهاراتك أو استوردها من Excel.</p>`}
  <div class="tools no-print"><button class="btn sm" data-act="skAddIn" data-s="${sbE}" data-u="">＋ مهارة</button><button class="btn ghost sm" data-act="skUnitAdd" data-s="${sbE}">＋ وحدة</button>${dead?`<button class="btn ghost sm" data-act="skRestore" data-s="${sbE}">♻️ استعادة المهارات الأصلية (${AR(dead)})</button>`:''}${U.length>1?`<button class="btn ghost sm" data-act="skOpenAll" data-s="${sbE}">↕️ فتح/طي الكل</button>`:''}</div>
  ${U.map(u=>unitHtml(u,L.filter(s=>s.unit===u))).join('')}${noU.length?unitHtml('',noU):''}</div>`}).join('');
 return intro+`<div class="card"><p class="small">الصف المعروض: <b>${esc(ctxLabel())}</b> — <a href="#settings">تغيير</a>. اضغط اسم الوحدة لفتحها. حدّد عدة مهارات لحذفها أو إخفائها أو نقلها معًا.</p></div>`+cards+
 `<div id="skBar" class="skbar no-print" ${SKSEL.size?'':'hidden'}><b id="skN">${AR(SKSEL.size)}</b> محددة <button class="btn red sm" data-act="skBulkDel">🗑️ حذف</button><button class="btn ghost sm" data-act="skBulkHide">🙈 إخفاء/إظهار</button><button class="btn ghost sm" data-act="skBulkMove">📂 نقل إلى وحدة</button><button class="btn ghost sm" data-act="skBulkClr">✖ إلغاء</button></div>`+table};
function skBarUpd(){const b=$('#skBar');if(!b)return;b.hidden=!SKSEL.size;$('#skN').textContent=AR(SKSEL.size)}
function skReorder(sub,g,u){skSorted(S.skills.filter(s=>s.subject===sub&&(s.grade||'')===g&&(s.unit||'')===u)).forEach((s,i,a)=>{})}
function skRenumber(){skSorted(S.skills).forEach((s,i)=>s.ord=i)}
function askText(title,val,cb){dlg(`<h3>${esc(title)}</h3><div class="fgrid"><label>الاسم<input id="askT" value="${esc(val||'')}"></label></div><div class="dlg-acts"><button class="btn" value="ok">حفظ</button><button class="btn ghost" value="c">إلغاء</button></div>`,v=>{if(v==='ok'){const t=($('#askT')?.value||'').trim();if(t)cb(t)}});setTimeout(()=>$('#askT')?.focus(),50)}
Object.assign(ACT,{
 skDel1:e=>{const s=S.skills.find(x=>x.id===e.dataset.id);if(s&&confirm('حذف المهارة «'+s.name.slice(0,60)+'»؟'))delRec('skills',s.id)},
 skHide:e=>mut(()=>{const s=S.skills.find(x=>x.id===e.dataset.id);s.hide=s.hide==='نعم'?'':'نعم'},'✓ تم'),
 skMv:e=>mut(()=>{skRenumber();const s=S.skills.find(x=>x.id===e.dataset.id);const arr=skSorted(S.skills.filter(x=>x.subject===s.subject&&(x.grade||'')===(s.grade||'')&&(x.unit||'')===(s.unit||'')));const i=arr.indexOf(s),j=i+(+e.dataset.d);if(j<0||j>=arr.length)return;const t=arr[j].ord;arr[j].ord=s.ord;s.ord=t},'✓ تم تغيير الترتيب'),
 skAddIn:e=>{const g=S.settings.ctx.grade||'';SKOPEN.add(e.dataset.s+'|'+g+'|'+e.dataset.u);editRec('skills',null,{subject:e.dataset.s,grade:g,unit:e.dataset.u})},
 skUnitAdd:e=>askText('وحدة جديدة — '+e.dataset.s,'',t=>mut(()=>{const st=S.settings;st.units=st.units||{};const k=unitKey(e.dataset.s,st.ctx.grade||'');(st.units[k]=st.units[k]||[]).includes(t)||st.units[k].push(t);SKOPEN.add(e.dataset.s+'|'+(st.ctx.grade||'')+'|'+t)},'✓ أُضيفت الوحدة')),
 skUnitRen:e=>{const sb=e.dataset.s,u=e.dataset.u,g=S.settings.ctx.grade||'';askText('إعادة تسمية الوحدة',u,t=>mut(()=>{S.skills.forEach(s=>{if(s.subject===sb&&(s.grade||'')===g&&s.unit===u)s.unit=t});const st=S.settings;st.units=st.units||{};const k=unitKey(sb,g);st.units[k]=(st.units[k]||[]).map(x=>x===u?t:x);SKOPEN.add(sb+'|'+g+'|'+t)},'✓ تمت إعادة التسمية'))},
 skUnitDel:e=>{const sb=e.dataset.s,u=e.dataset.u,g=S.settings.ctx.grade||'';const L=S.skills.filter(s=>s.subject===sb&&(s.grade||'')===g&&s.unit===u);if(!confirm(`حذف الوحدة «${u}»${L.length?` ومهاراتها (${L.length})`:''}؟ يمكنك التراجع فورًا.`))return;mut(()=>{tomb(L);const ids=new Set(L.map(s=>s.id));S.skills=S.skills.filter(s=>!ids.has(s.id));const st=S.settings;const k=unitKey(sb,g);if(st.units&&st.units[k])st.units[k]=st.units[k].filter(x=>x!==u)},'🗑️ حُذفت الوحدة')},
 skRestore:e=>{const sb=e.dataset.s,g=S.settings.ctx.grade||'';if(!confirm('استعادة المهارات الأصلية المحذوفة لـ«'+sb+'» — '+g+'؟ لن تتغير مهاراتك المضافة أو المعدلة.'))return;mut(()=>{const st=S.settings;st.skDel=(st.skDel||[]).filter(t=>!(t.subject===sb&&t.grade===g));const have=new Set(S.skills.map(s=>s.sid).filter(Boolean));seeds().forEach(x=>{if(x.subject===sb&&x.grade===g&&!have.has(x.sid))S.skills.push({id:uid(),...x,hide:''})})},'♻️ تمت الاستعادة')},
 skOpenAll:e=>{const sb=e.dataset.s,g=S.settings.ctx.grade||'';const ks=unitsOf(sb,g).map(u=>sb+'|'+g+'|'+u);const all=ks.every(k=>SKOPEN.has(k));ks.forEach(k=>all?SKOPEN.delete(k):SKOPEN.add(k));render()},
 skBulkClr:()=>{SKSEL.clear();render()},
 skBulkDel:()=>{if(!confirm(`حذف ${SKSEL.size} مهارة محددة؟ يمكنك التراجع فورًا.`))return;mut(()=>{const L=S.skills.filter(s=>SKSEL.has(s.id));tomb(L);S.skills=S.skills.filter(s=>!SKSEL.has(s.id));SKSEL.clear()},'🗑️ تم حذف المحدد')},
 skBulkHide:()=>mut(()=>{const L=S.skills.filter(s=>SKSEL.has(s.id));const h=L.some(s=>s.hide!=='نعم')?'نعم':'';L.forEach(s=>s.hide=h);SKSEL.clear()},'✓ تم'),
 skBulkMove:()=>{const g=S.settings.ctx.grade||'';const L=S.skills.filter(s=>SKSEL.has(s.id));const sb=L[0]&&L[0].subject;const U=unitsOf(sb,g);
  dlg(`<h3>📂 نقل ${AR(L.length)} مهارة إلى وحدة</h3><div class="fgrid"><label>الوحدة<input id="mvU" list="mvUl" placeholder="اختر أو اكتب اسم وحدة جديدة"><datalist id="mvUl">${U.map(u=>`<option value="${esc(u)}">`).join('')}</datalist></label></div><div class="dlg-acts"><button class="btn" value="ok">نقل</button><button class="btn ghost" value="c">إلغاء</button></div>`,v=>{if(v!=='ok')return;const t=($('#mvU').value||'').trim();mut(()=>{L.forEach(s=>s.unit=t);SKSEL.clear();SKOPEN.add(sb+'|'+g+'|'+t)},'✓ تم النقل')})}
});
document.addEventListener('change',e=>{const t=e.target;if(!t.classList||!t.classList.contains('skc'))return;
 if(t.dataset.skid){t.checked?SKSEL.add(t.dataset.skid):SKSEL.delete(t.dataset.skid)}
 else if(t.dataset.sku){const d=t.closest('details');d.querySelectorAll('[data-skid]').forEach(x=>{x.checked=t.checked;t.checked?SKSEL.add(x.dataset.skid):SKSEL.delete(x.dataset.skid)})}skBarUpd()});
document.addEventListener('click',e=>{if(e.target.classList&&e.target.classList.contains('skc')&&e.target.closest('summary'))e.stopPropagation()},true);
document.addEventListener('toggle',e=>{const d=e.target;if(d.dataset&&d.dataset.uk){d.open?SKOPEN.add(d.dataset.uk):SKOPEN.delete(d.dataset.uk)}},true);
/* جدول التغطية */
const SKGAPS=[['اللغة العربية','الخامس الابتدائي','ف1: أُضيفت من ط1448 (منصة عين) لعدم توفر ط1447'],['اللغة العربية','الثالث المتوسط','الوحدتان 5 و6: أُضيفتا من ط1448 – الجزء الثاني (منصة عين)'],['جميع المواد عدا الرياضيات','جميع الصفوف','إزالة التكرار بين الطبعات: عند تطابق اسم الدرس يُبقى على الطبعة الأحدث فقط (115 مهارة مكررة حُذفت)'],['القرآن الكريم والدراسات الإسلامية / الاجتماعية / الرقمية','الابتدائي والمتوسط','ف2 من ط1446 (لا تتوفر ط1447)'],['الدراسات الاجتماعية','الثالث المتوسط','ف1 غير متاح'],['الأول الثانوي','السنة الأولى المشتركة','ف2 مضاف للإنجليزية والتقنية الرقمية (ط1448)؛ بقية المواد كتاب ف1 ط1448 يغطي المقرر كاملًا أو لم يتوفر جزء ف2 بطبعة 1448'],['التربية الصحية والبدنية','الأول الثانوي','من دليل المقرر ط1447 (نسخة wajibi.net)'],['الثاني والثالث الثانوي','المسارات','مضاف: الرياضيات، الكيمياء، الأحياء، الفيزياء، الإنجليزية، التوحيد، الكفايات اللغوية (ق1)، الفقه، الدراسات الأدبية، علوم الأرض والفضاء (ط1448). غير مضاف بعد: مواد المسارات التخصصية (علوم الحاسب والهندسة، الصحة والحياة، إدارة الأعمال، الشرعي) والمواد المشتركة الأخرى، والكفايات اللغوية ق2'],['التربية الفنية / البدنية / المهارات الحياتية','الابتدائي والمتوسط','لم تُضف بعد']];
function skCov(){const c=S.settings.ctx||{};const R=(window.SKCOV||[]).filter(r=>!c.grade||r[1]===c.grade);
 return`<details class="card"><summary><b>📊 تغطية المهارات الرسمية</b> <span class="tag">${AR(R.length)}</span></summary><div class="tw"><table><thead><tr><th>المادة</th><th>الصف</th><th>المصدر</th><th>الوحدات/الفصول</th><th>المهارات</th></tr></thead><tbody>${R.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${r[2].map(esc).join('، ')}</td><td>${AR(r[3])}</td><td>${AR(r[4])}</td></tr>`).join('')}</tbody></table></div>
 <p class="small"><b>غير متوفر (لا مصدر رسمي متاح بعد):</b></p><ul class="small">${SKGAPS.map(g=>`<li>${esc(g[0])} — ${esc(g[1])}: ${esc(g[2])}</li>`).join('')}</ul>
 <p class="small muted">«ط1447» = كتاب الطالب طبعة 1447هـ. «فهرس ط1446» = دروس الفصل الثاني مأخوذة من فهرس طبعة 1446هـ لتعذّر الوصول إلى ملف ف2 لطبعة 1447هـ. المصدر: كتب الطالب الرسمية — وزارة التعليم.</p></details>`}
{const _sk=V.skills;V.skills=()=>_sk()+skCov()}
