import json,collections
out=[];cov=collections.OrderedDict()
for f in ['ar.txt','math.txt','sci.txt','en.txt','isl.txt','soc.txt','dig.txt','ct.txt','sec.txt']:
  hdr=None;unit=None
  for ln in open(f,encoding='utf-8'):
    ln=ln.rstrip('\n').strip()
    if not ln:continue
    if ln[0]=='@':hdr=ln[1:].split('|');unit=None
    elif ln[0]=='#':unit=ln[1:].strip();out.append([*hdr,unit,[]])
    elif ln.startswith('- '):out[-1][5].append(ln[2:].strip())
import re
def nz(x):return re.sub(r'[\u064B-\u0652\u0640\s]','',x)
skipped=[]
def yr(sem):
  m=re.search(r'ط(\d{4})',sem);return int(m.group(1)) if m else 0
bykey={}
for r in out:bykey.setdefault((r[0],r[1]),[]).append(r)
for k,L in bykey.items():
  if k[0]=='الرياضيات':continue  # أسماء دروس الرياضيات تتكرر بمحتوى مختلف (نطاق أعداد آخر)
  for r in L:
    newer=set(nz(x) for q in L if yr(q[2])>yr(r[2]) for x in q[5])
    keep=[]
    for x in r[5]:
      if nz(x) in newer:skipped.append((r[0],r[1],r[2],x))
      else:keep.append(x)
    r[5]=keep
out=[r for r in out if r[5]]
open('/tmp/skipped.txt','w').write('\n'.join('|'.join(x) for x in skipped))
for sub,g,sem,book,u,L in out:
  k=(sub,g);c=cov.setdefault(k,{'sems':collections.OrderedDict(),'n':0,'u':0});c['sems'].setdefault(sem,book);c['n']+=len(L);c['u']+=1
open('../itqan/skills-data.js','w',encoding='utf-8').write('/*! منصة إتقان — © 1448هـ عبدالله خالد العتيبي. جميع الحقوق محفوظة. */\n/* مهارات مستخرجة حرفيًا من فهارس كتب الطالب الرسمية (وزارة التعليم) — انظر SKILLS_COVERAGE.md */\nwindow.SKD='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\nwindow.SKCOV='+json.dumps([[k[0],k[1],list(v['sems'].keys()),v['u'],v['n']] for k,v in cov.items()],ensure_ascii=False,separators=(',',':'))+';\n')
print(len(out),sum(len(x[5]) for x in out))
for k,v in cov.items():print(k,list(v['sems']),v['u'],v['n'])
