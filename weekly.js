/*! منصة إتقان — © 1448هـ عبدالله خالد العتيبي. جميع الحقوق محفوظة — All Rights Reserved. */
/* 📝 الاختبار التشخيصي الأسبوعي: يعدّه المعلم نهاية كل أسبوع دراسي، ويرصد درجات الطلاب، وتُغذّي النتائج الإتقان (الرادار وجواز المهارات) والتصنيف. البيانات محلية فقط (S.wtests). */
VS.wk={id:''};
const wkTests=()=>(S.wtests=Array.isArray(S.wtests)?S.wtests:[]);
const wkMax=t=>(t.items||[]).reduce((s,i)=>s+(+i.max||0),0);
function wkPct(t,st){const a=(t.scores||{})[st];if(!a||!a.some(v=>v!==''&&v!=null))return null;const mx=wkMax(t);if(!mx)return null;return Math.max(0,Math.min(100,100*a.reduce((s,v)=>s+(+v||0),0)/mx))}
function wkStudents(t){const L=studentNames(t.cls||'');Object.keys(t.scores||{}).forEach(s=>{if(!L.includes(s))L.push(s)});return L}
function wkLvl(p){if(p==null)return null;const T=TH();return p>=T.m?'ok':p>=T.p?'dev':'low'}
const WKN={ok:['متقن','ok'],dev:['قيد الإتقان','info'],low:['معرّض للتعثر الدراسي','bad']};
/* يُدمج مع الإتقان: متوسط نسب الاختبارات الأسبوعية للمهارة */
function wkMastery(st,sk){const v=wkTests().filter(t=>t.skill===sk).map(t=>wkPct(t,st)).filter(x=>x!=null);return v.length?avg(v):null}
function wkSummary(){return wkTests().map(t=>{const P=wkStudents(t).map(s=>wkPct(t,s)).filter(x=>x!=null);const lv={ok:0,dev:0,low:0};P.forEach(p=>lv[wkLvl(p)]++);
 return{week:+t.week||null,title:t.title||'',subject:t.subject||'',skill:t.skill||'',cls:t.cls||'',date:t.date||'',items:(t.items||[]).length,max:wkMax(t),n:P.length,avg:avg(P),...lv}}).sort((a,b)=>(a.week||0)-(b.week||0))}

V.weekly=()=>{const L=wkTests().slice().sort((a,b)=>(+b.week||0)-(+a.week||0)||String(b.date).localeCompare(String(a.date)));let t=L.find(x=>x.id===VS.wk.id)||L[0]||null;
 const acts=`<button class="btn gold sm" data-act="wkNew">➕ اختبار أسبوعي جديد</button>`;
 let h=head('📝 الاختبار التشخيصي الأسبوعي','اختبار قصير يُعدّه المعلم نهاية كل أسبوع دراسي لتشخيص إتقان مهارات الأسبوع وتصنيف الطلاب مبكراً.',acts)
  +tip('أنشئ اختباراً لكل أسبوع (العنوان، رقم الأسبوع، المادة، المهارة، البنود ودرجاتها)، ثم ارصد درجات الطلاب. تُحتسب النسبة تلقائياً وتدخل في <b>الإتقان</b> (رادار الفاقد وجواز المهارات) ويُصنَّف الطلاب: متقن / قيد الإتقان / المعرضون للتعثر الدراسي.');
 if(!L.length)return h+`<div class="card wkempty"><h3>لا توجد اختبارات أسبوعية بعد</h3><p class="muted">ابدأ بإنشاء اختبار الأسبوع الحالي.</p><div class="acts"><button class="btn gold" data-act="wkNew">➕ إنشاء اختبار الأسبوع</button></div></div>`;
 const sm=wkSummary();
 h+=`<div class="grid g2"><div class="card"><h3>📈 متوسط النتائج حسب الأسبوع</h3>${barChart(sm.filter(x=>x.avg!=null).map(x=>['أ'+AR(x.week)+' · '+x.title,x.avg]),{col:heatCol,label:'الاختبارات الأسبوعية'})}</div>
 <div class="card"><h3>🗂️ الاختبارات (${AR(L.length)})</h3><div class="wklist">${L.map(x=>{const P=wkStudents(x).map(s=>wkPct(x,s)).filter(v=>v!=null);const a=avg(P);
  return`<button class="wkitem ${t&&t.id===x.id?'on':''}" data-act="wkOpen" data-id="${x.id}"><b>الأسبوع ${AR(x.week)}</b><span>${esc(x.title)}</span><small class="muted">${esc([x.subject,x.skill,x.cls].filter(Boolean).join(' · '))}</small><span class="tag" style="background:${heatCol(a)};color:#111">${a==null?'لم تُرصد':PC(a)}</span></button>`}).join('')}</div></div></div>`;
 if(!t)return h+'<p class="muted">اختر اختباراً لرصد الدرجات وعرض التصنيف.</p>';
 const sts=wkStudents(t),mx=wkMax(t),I=t.items||[];const P=sts.map(s=>[s,wkPct(t,s)]);const lv={ok:[],dev:[],low:[]};P.forEach(([s,p])=>{const l=wkLvl(p);if(l)lv[l].push([s,p])});
 const done=P.filter(x=>x[1]!=null).map(x=>x[1]);
 h+=`<div class="card wkcard"><div class="head" style="margin:0 0 8px"><div><h3>📝 ${esc(t.title)} — الأسبوع ${AR(t.week)}</h3><p class="small muted">${esc([t.subject,t.skill&&'المهارة: '+t.skill,t.cls&&'الفصل: '+t.cls,t.date&&hij(t.date)].filter(Boolean).join(' · '))} · ${AR(I.length)} بند · الدرجة الكلية ${AR(mx)}</p></div>
 <div class="acts no-print"><button class="btn ghost sm" data-act="wkEdit" data-id="${t.id}">✏️ تعديل</button><button class="btn ghost sm" data-act="wkDel" data-id="${t.id}">🗑️ حذف</button></div></div>
 <div class="grid g4">${[['المتوسط',PC(avg(done))],['رُصدت درجاتهم',AR(done.length)+' / '+AR(sts.length)],['متقن',AR(lv.ok.length)],['المعرضون للتعثر الدراسي',AR(lv.low.length)]].map(k=>`<div class="kpi"><b>${k[1]}</b><span>${k[0]}</span></div>`).join('')}</div>
 ${sts.length?`<div class="tw" style="margin-top:12px"><table class="wktbl"><tr><th>الطالب</th>${I.map((i,n)=>`<th title="${esc(i.q)}">${AR(n+1)}. ${esc(String(i.q).slice(0,24))}<br><small>من ${AR(i.max)}</small></th>`).join('')}<th>المجموع</th><th>النسبة</th><th>المستوى</th></tr>
 ${sts.map(s=>{const a=(t.scores||{})[s]||[];const p=wkPct(t,s),l=wkLvl(p);return`<tr><td>${esc(s)}</td>${I.map((i,n)=>`<td><input class="wkin" inputmode="decimal" data-st="${esc(s)}" data-i="${n}" data-max="${+i.max||0}" value="${a[n]==null?'':esc(a[n])}" aria-label="${esc(s)} — بند ${n+1}"></td>`).join('')}<td>${p==null?'—':AR(a.reduce((x,v)=>x+(+v||0),0),1)}</td><td><b>${PC(p)}</b></td><td>${l?`<span class="tag ${WKN[l][1]}">${WKN[l][0]}</span>`:'—'}</td></tr>`}).join('')}</table></div>
 <div class="acts no-print" style="margin-top:10px"><button class="btn gold" data-act="wkSave" data-id="${t.id}">💾 حفظ الدرجات</button><span class="muted small">اكتب درجة كل بند (من الدرجة القصوى). اترك الخانات فارغة لمن لم يختبر.</span></div>`
 :'<p class="muted">لا يوجد طلاب في هذا الفصل — أضف الطلاب أولاً من «الطلاب وأولياء الأمور».</p>'}</div>
 <div class="grid g3">${['low','dev','ok'].map(k=>`<div class="card"><h3><span class="tag ${WKN[k][1]}">${k==='low'?'🟠 المعرضون للتعثر الدراسي':k==='dev'?'🔵 قيد الإتقان':'🟢 متقنون'} · ${AR(lv[k].length)}</span></h3><p class="small">${lv[k].length?lv[k].sort((a,b)=>a[1]-b[1]).map(x=>esc(x[0])+' ('+PC(x[1])+')').join('، '):'<span class="muted">—</span>'}</p></div>`).join('')}</div>`;
 return h};

function wkDlg(id){const t=id?wkTests().find(x=>x.id===id):null;const v=t||{title:'اختبار تشخيصي — نهاية الأسبوع',week:(Math.max(0,...wkTests().map(x=>+x.week||0))+1),date:today(),items:[{q:'السؤال الأول',max:5},{q:'السؤال الثاني',max:5}]};
 const subs=S.settings.lists.subjects||[],sks=skillNames();
 dlg(`<h3>📝 ${t?'تعديل':'إنشاء'} اختبار تشخيصي أسبوعي</h3><div class="fgrid">
 <label class="f">عنوان الاختبار <span class="red">*</span><input id="wk_title" value="${esc(v.title)}" autocomplete="off"></label>
 <label class="f">رقم الأسبوع الدراسي <span class="red">*</span><input id="wk_week" inputmode="numeric" value="${esc(v.week)}"></label>
 <label class="f">المادة<input id="wk_subject" list="wk_dls" value="${esc(v.subject||'')}" autocomplete="off"><datalist id="wk_dls">${subs.map(o=>`<option value="${esc(o)}">`).join('')}</datalist></label>
 <label class="f">المهارة / ناتج التعلم<input id="wk_skill" list="wk_dlk" value="${esc(v.skill||'')}" autocomplete="off"><datalist id="wk_dlk">${sks.map(o=>`<option value="${esc(o)}">`).join('')}</datalist></label>
 <label class="f">الفصل${clsSel('wk_cls',v.cls||'')}</label>
 <label class="f">تاريخ الاختبار<input id="wk_date" type="date" value="${esc(v.date||'')}"></label>
 <label class="f" style="grid-column:1/-1">البنود / الأسئلة — سطر لكل بند بالصيغة: <b>نص البند | الدرجة القصوى</b><textarea id="wk_items" rows="6">${esc((v.items||[]).map(i=>i.q+' | '+i.max).join('\n'))}</textarea></label></div>
 <div class="dlg-acts"><button class="btn" type="button" data-act="wkSaveDef" data-id="${id||''}">💾 حفظ</button><button class="btn ghost" value="cancel" formnovalidate>إلغاء</button></div>`)}
function wkParseItems(s){return String(s||'').split(/\n+/).map(l=>l.trim()).filter(Boolean).map(l=>{const m=l.split(/[|｜]/);const mx=m.length>1?toNum(m[m.length-1]):null;return{q:(m.length>1?m.slice(0,-1).join('|'):l).trim(),max:mx>0?mx:1}})}
ACT.wkNew=()=>wkDlg('');ACT.wkEdit=e=>wkDlg(e.dataset.id);
ACT.wkOpen=e=>{VS.wk.id=e.dataset.id;render();setTimeout(()=>{const c=$('.wkcard');c&&c.scrollIntoView({behavior:'smooth',block:'start'})},50)};
ACT.wkSaveDef=e=>{const g=k=>($('#wk_'+k)||{}).value||'';const title=g('title').trim(),week=toNum(g('week'));const items=wkParseItems(g('items'));
 if(!title||!week){toast('أكمل: العنوان ورقم الأسبوع');return}if(!items.length){toast('أضف بنداً واحداً على الأقل');return}
 const id=e.dataset.id;closeDlg();mut(()=>{const L=wkTests();const o={title,week,subject:g('subject').trim(),skill:g('skill').trim(),cls:g('cls'),date:g('date'),items};
  if(id){const t=L.find(x=>x.id===id);Object.assign(t,o)}else{const n={id:uid(),scores:{},...o};L.push(n);VS.wk.id=n.id}})};
ACT.wkSave=e=>{const t=wkTests().find(x=>x.id===e.dataset.id);if(!t)return;const sc={};let bad=0;
 $$('.wkin').forEach(i=>{const s=i.dataset.st,n=+i.dataset.i,mx=+i.dataset.max;let v=i.value.trim();if(v===''){v=null}else{v=toNum(v);if(v==null||v<0||v>mx){bad++;v=v==null?null:Math.max(0,Math.min(mx,v))}}(sc[s]=sc[s]||[])[n]=v});
 Object.keys(sc).forEach(s=>{if(!sc[s].some(v=>v!=null))delete sc[s]});mut(()=>{t.scores=sc},bad?'✓ حُفظت الدرجات (عُدّلت '+AR(bad)+' قيمة خارج المدى)':'✓ حُفظت الدرجات')};
ACT.wkDel=async e=>{if(await confirmDlg('حذف هذا الاختبار الأسبوعي ودرجاته؟ (يمكنك التراجع)'))mut(()=>{S.wtests=wkTests().filter(x=>x.id!==e.dataset.id);VS.wk.id=''},'تم الحذف')};
