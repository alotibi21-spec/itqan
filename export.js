/*! منصة إتقان — © 1448هـ عبدالله خالد العتيبي. جميع الحقوق محفوظة — All Rights Reserved. */
/* 📤 تصدير للمدير: ملف JSON صغير بملخص بيانات المعلم (دون أسماء أولياء الأمور أو جوالاتهم) يُرسل لمدير المدرسة ليستورده في «لوحة قيادة المدرسة». */
const EXP_FMT='itqan-export',EXP_V=1;
function expSummary(S){const st=S.settings||{};const P=+st.pass||50,E=+st.exc||90,M=+st.master||80;
 const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
 const prac=[...(S.offPrac||[]),...(S.schoolPrac||[])].filter(r=>r&&r.n);
 const tracks={};['calc','think','master'].forEach(k=>{const L=prac.filter(r=>r.tr&&r.tr[k]&&r.tr[k][1]).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||((a.t||0)-(b.t||0)));
  const n=L.reduce((s,r)=>s+r.tr[k][1],0),ok=L.reduce((s,r)=>s+r.tr[k][0],0);const by={};L.forEach(r=>{const s=r.student||'—';(by[s]=by[s]||[]).push(r)});
  let bn=0,bo=0,an=0,ao=0,pairs=0;Object.values(by).forEach(a=>{if(a.length<2)return;pairs++;const f=a[0].tr[k],l=a[a.length-1].tr[k];bn+=f[1];bo+=f[0];an+=l[1];ao+=l[0]});
  tracks[k]={n,ok,acc:n?100*ok/n:null,sessions:L.length,before:bn?100*bo/bn:null,after:an?100*ao/an:null,pairs,bn,bo,an,ao}});
 const marks=Array.isArray(S.marks)?S.marks:[],res=Array.isArray(S.results)?S.results:[],att=Array.isArray(S.attempts)?S.attempts:[];
 let src=marks;if(!marks.length){const by={};res.forEach(r=>{if(r&&r.student!=null&&r.score!=null)(by[r.student]=by[r.student]||[]).push(+r.score)});src=Object.entries(by).map(([s,a])=>({student:s,subject:'متوسط الاختبارات القصيرة',grade:avg(a)}))}
 const edge=[];src.forEach(m=>{if(!m||m.grade==null)return;const ab=+m.absence||0,pt=m.part??70;const pred=Math.max(0,Math.min(100,m.grade-ab*0.8+(pt-70)*0.08));if(pred<P+10&&pred>=P-15)edge.push({st:String(m.student||''),subject:String(m.subject||''),grade:Math.round(+m.grade),pred:Math.round(pred),risk:ab>5||pt<50})});
 edge.sort((a,b)=>a.pred-b.pred);
 const key={};res.forEach(r=>{if(r&&r.student&&r.skill)(key[r.student+'\u0001'+r.skill]=key[r.student+'\u0001'+r.skill]||{r:[],a:[]}).r.push(+r.score)});
 att.forEach(a=>{if(a&&a.student&&a.skill)(key[a.student+'\u0001'+a.skill]=key[a.student+'\u0001'+a.skill]||{r:[],a:[]}).a.push(!!a.ok)});
 const lv={ok:0,dev:0,low:0};const stu=new Set();Object.entries(key).forEach(([k,v])=>{const parts=[];if(v.r.length)parts.push(avg(v.r));if(v.a.length>=2)parts.push(100*v.a.filter(Boolean).length/v.a.length);const m=avg(parts);if(m==null)return;stu.add(k.split('\u0001')[0]);lv[m>=M?'ok':m>=P?'dev':'low']++});
 const pn=prac.reduce((s,r)=>s+(+r.n||0),0),po=prac.reduce((s,r)=>s+(+r.ok||0),0);const dates=prac.map(r=>r.date).filter(Boolean).sort();
 return{t:Date.now(),school:st.school||'',students:(S.students||[]).length,prac:{sessions:prac.length,n:pn,ok:po,acc:pn?100*po/pn:null,learners:new Set(prac.map(r=>r.student).filter(Boolean)).size,last:dates[dates.length-1]||''},tracks,edge:edge.slice(0,200),edgeN:edge.length,pass:{...lv,students:stu.size},th:{P,E,M}}}
function expTeacherId(){const st=S.settings;if(!st.tid){st.tid='t-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);save()}return st.tid}
function expSubjects(){const st=S.settings;const s=new Set();(S.marks||[]).forEach(m=>m.subject&&s.add(m.subject));(S.skills||[]).forEach(m=>m.subject&&s.add(m.subject));if(!s.size)(st.lists.subjects||[]).forEach(x=>s.add(x));return[...s].filter(x=>x!=='متوسط الاختبارات القصيرة').slice(0,3)}
function expSafe(x){return String(x||'').trim().replace(/[\\/:*?"<>|\s]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40)||'teacher'}
async function exportForPrincipal(){const st=S.settings;let name=(st.user&&st.user.name||'').trim();
 if(!name){name=(prompt('اكتب اسمك كما سيظهر لمدير المدرسة:')||'').trim();if(!name){toast('أدخل اسم المعلم أولاً (الإعدادات ← المدرسة والمستخدم)');return}st.user.name=name;save()}
 const now=new Date();const out={format:EXP_FMT,formatVersion:EXP_V,app:'itqan',appVersion:VER,exportedAt:now.toISOString(),
  teacher:{id:expTeacherId(),name,subject:expSubjects().join('، '),classes:(st.lists.classes||[]).slice(0,20),school:st.school||'',gender:st.gender||'',job:st.user.job||''},summary:expSummary(S)};
 const fn=`itqan-export-${expSafe(name)}-${today()}.json`;const blob=new Blob([JSON.stringify(out)],{type:'application/json'});
 try{const file=new File([blob],fn,{type:'application/json'});if(navigator.canShare&&navigator.share&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'بيانات إتقان لمدير المدرسة',text:'ملف بيانات منصة إتقان — '+name});toast('✓ أُرسل الملف — أرسل الملف لمدير المدرسة');return}}catch(e){if(e&&e.name==='AbortError')return}
 download(fn,blob);toast('✓ نُزِّل الملف '+fn+' — أرسل الملف لمدير المدرسة')}
function expCard(){return`<div class="card expmgr"><h3>📤 تصدير للمدير</h3><p class="small">ملف صغير بملخص نتائج نافس والمسارات (احسب/فكّر/أتقن) و«حافة التعثّر» وجواز المهارات. <b>أرسل الملف لمدير المدرسة</b> (واتساب مثلاً) ليستورده في لوحة قيادة المدرسة.</p><div class="acts"><button class="btn gold" data-act="expMgr">📤 تصدير للمدير</button></div><p class="small muted">لا يُرفع شيء لأي خادم — الملف يُنشأ على جهازك وأنت من يرسله.</p></div>`}
ACT.expMgr=()=>exportForPrincipal();
