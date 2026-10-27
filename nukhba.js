/*! منصة إتقان — © 1448هـ عبدالله خالد العتيبي. جميع الحقوق محفوظة — All Rights Reserved. */
/* نُخبة نافس 🏆 — اختبار تفاعلي + ورقة عمل قابلة للطباعة */
const NKS={g:'g3',s:'القراءة',mode:'quiz',i:0,ans:[],done:false};
const nkG=()=>NK.find(x=>x.id===NKS.g),nkL=()=>nkG().subs[NKS.s];
const NKL=['أ','ب','ج','د'];
function nkPass(q){return q.startsWith('[نص]')}
function nkQ(q){return esc(q.replace(/^\[نص\]\s*/,''))}
function nkPsg(){return NK_P[NKS.g+'r']}
function nkHead(){const g=nkG();return`<div class="nk-hero"><h3>🏆 نُخبة نافس</h3><p>أسئلة تدريبية أصيلة بأسلوب اختبارات نافس، موزعة على مهارات نواتج التعلم — لنقل الطلبة من «قيد الإتقان» إلى الإتقان ودعم الطلبة المعرضين للتعثر الدراسي.</p></div>
<div class="nk-tabs no-print" role="tablist">${NK.map(x=>`<button role="tab" aria-selected="${x.id===NKS.g}" class="nk-lv ${x.id===NKS.g?'on':''}" data-act="nkG" data-g="${x.id}"><b>${x.ic} ${x.code}</b><small>${x.grade}</small></button>`).join('')}</div>
<div class="nk-sub no-print">${Object.keys(g.subs).map(s=>`<button class="chip ${s===NKS.s?'on':''}" data-act="nkS" data-s="${s}">${s} <span>${AR(g.subs[s].length)}</span></button>`).join('')}<span style="flex:1"></span><button class="btn ${NKS.mode==='quiz'?'':'ghost'} sm" data-act="nkM" data-m="quiz">🎯 اختبار تفاعلي</button><button class="btn ${NKS.mode==='ws'?'':'ghost'} sm" data-act="nkM" data-m="ws">🖨️ ورقة عمل</button></div>`}
function nkQuiz(){const L=nkL(),n=L.length;if(NKS.done){const ok=NKS.ans.filter((a,i)=>a===L[i][2]).length,p=Math.round(100*ok/n);const st=p>=80?['🌟','متقن'] :p>=50?['📈','قيد الإتقان']:['🤝','يحتاج دعمًا علاجيًا'];
 const weak=[...new Set(L.filter((q,i)=>NKS.ans[i]!==q[2]).map(q=>q[4]))];
 return`<div class="card nk-card nk-res"><div class="nk-score">${st[0]} ${AR(ok)} / ${AR(n)}</div><p class="nk-pc">${AR(p)}٪ — <b>${st[1]}</b></p>${weak.length?`<p class="muted">مهارات تحتاج مراجعة:</p><div class="nk-tags">${weak.map(w=>`<span class="tag">${esc(w)}</span>`).join('')}</div>`:'<p>أداء ممتاز في جميع المهارات! 🎉</p>'}<p><button class="btn gold" data-act="nkR">🔁 إعادة المحاولة</button></p></div>`}
 const q=L[NKS.i],a=NKS.ans[NKS.i],has=a!=null;
 return`<div class="card nk-card"><div class="nk-prog"><span>السؤال ${AR(NKS.i+1)} من ${AR(n)}</span><span class="tag">${esc(q[4])}</span></div><div class="nk-bar"><i style="width:${100*(NKS.i+(has?1:0))/n}%"></i></div>
 ${nkPass(q[0])?`<div class="nk-psg"><b>📖 اقرأ النص ثم أجب:</b><p>${esc(nkPsg())}</p></div>`:''}<div class="nk-q">${nkQ(q[0])}</div>
 <div class="nk-opts">${q[1].map((o,j)=>`<button data-act="nkA" data-a="${j}" ${has?'disabled':''} class="${has?(j===q[2]?'ok':j===a?'no':''):''}"><b>${NKL[j]}</b> ${esc(o)}</button>`).join('')}</div>
 ${has?`<div class="nk-fb ${a===q[2]?'ok':'no'}">${a===q[2]?'✅ إجابة صحيحة!':'❌ الإجابة الصحيحة: ('+NKL[q[2]]+') '+esc(q[1][q[2]])}<br><span>💡 ${esc(q[3])}</span></div><p><button class="btn" data-act="nkN">${NKS.i+1<n?'التالي ⬅️':'🏁 عرض النتيجة'}</button></p>`:''}</div>`}
function nkWS(){const g=nkG(),L=nkL();const hp=L.some(q=>nkPass(q[0]));
 return`<div class="no-print acts" style="margin:.5rem 0"><button class="btn" data-act="print">🖨️ طباعة ورقة العمل</button><label class="small"><input type="checkbox" id="nkKey" ${NKS.key?'checked':''} data-act="nkK"> إظهار مفتاح الإجابة</label></div>
 <div class="card nk-ws" id="nkWS"><div class="nk-wsh"><h2>🏆 نُخبة نافس — ${g.code}</h2><p>${g.grade} · ${NKS.s}</p><div class="nk-fields"><span>اسم الطالب/ـة: ....................................</span><span>الفصل: ..........</span><span>الدرجة: ...... / ${AR(L.length)}</span></div></div>
 ${hp?`<div class="nk-psg"><b>📖 النص:</b><p>${esc(nkPsg())}</p></div>`:''}
 <ol class="nk-wsl">${L.map(q=>`<li><p class="nk-q">${nkQ(q[0])}</p><div class="nk-wso">${q[1].map((o,j)=>`<span class="${NKS.key&&j===q[2]?'k':''}">(${NKL[j]}) ${esc(o)}</span>`).join('')}</div>${NKS.key?`<p class="small muted">💡 ${esc(q[3])} — <i>${esc(q[4])}</i></p>`:''}</li>`).join('')}</ol>
 <p class="small muted">أسئلة تدريبية أصيلة بأسلوب نافس — ليست أسئلة رسمية صادرة عن هيئة تقويم التعليم والتدريب.</p></div>`}
function nkView(){return nkHead()+(NKS.mode==='ws'?nkWS():nkQuiz())+`<div class="card no-print nk-src"><h4>📌 مصدر الفكرة</h4><p class="small muted">مستوحاة من «مبادرة نافس — سباق نجوم نافس» المنشورة في حساب <a href="https://x.com/FreeEduPlatform" target="_blank" rel="noopener noreferrer">@FreeEduPlatform</a>. الأسئلة هنا مكتوبة من جديد وليست منسوخة؛ وللمواد الأصلية:</p><div class="acts" style="flex-wrap:wrap">${NK_SRC.map(s=>`<a class="btn ghost sm" href="${s[1]}" target="_blank" rel="noopener noreferrer">𝕏 ${s[0]}</a><a class="btn ghost sm" href="${s[2]}" target="_blank" rel="noopener noreferrer">🔗 المبادرة: ${s[0]}</a>`).join('')}</div><p class="small muted">⚠️ ليست أسئلة رسمية؛ للنماذج الرسمية راجع تبويب «نماذج التهيئة الرسمية».</p></div>`}
const nkReset=()=>{NKS.i=0;NKS.ans=[];NKS.done=false};
Object.assign(ACT,{nkG:e=>{NKS.g=e.dataset.g;if(!nkG().subs[NKS.s])NKS.s='القراءة';nkReset();render()},nkS:e=>{NKS.s=e.dataset.s;nkReset();render()},nkM:e=>{NKS.mode=e.dataset.m;render()},
 nkA:e=>{NKS.ans[NKS.i]=+e.dataset.a;render()},nkN:()=>{if(NKS.i+1<nkL().length)NKS.i++;else NKS.done=true;render()},nkR:()=>{nkReset();render()},nkK:e=>{NKS.key=e.checked;render();return true}});
(function(){const h=location.hash;if(/^#nafs\/nk/.test(h)){VS.nafs.tab='nk';const g=h.split('/')[2];if(g&&NK.some(x=>x.id===g))NKS.g=g;setTimeout(()=>{try{render()}catch(_){}} ,0)}})();
