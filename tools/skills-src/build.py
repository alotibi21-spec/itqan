import json,collections
out=[];cov=collections.OrderedDict()
for f in ['ar.txt','math.txt','sci.txt']:
  hdr=None;unit=None
  for ln in open(f,encoding='utf-8'):
    ln=ln.rstrip('\n').strip()
    if not ln:continue
    if ln[0]=='@':hdr=ln[1:].split('|');unit=None
    elif ln[0]=='#':unit=ln[1:].strip();out.append([*hdr,unit,[]])
    elif ln.startswith('- '):out[-1][5].append(ln[2:].strip())
for sub,g,sem,book,u,L in out:
  k=(sub,g);c=cov.setdefault(k,{'sems':collections.OrderedDict(),'n':0,'u':0});c['sems'].setdefault(sem,book);c['n']+=len(L);c['u']+=1
open('../itqan/skills-data.js','w',encoding='utf-8').write('/*! منصة إتقان — © 1448هـ عبدالله خالد العتيبي. جميع الحقوق محفوظة. */\n/* مهارات مستخرجة حرفيًا من فهارس كتب الطالب الرسمية (وزارة التعليم) — انظر SKILLS_COVERAGE.md */\nwindow.SKD='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\nwindow.SKCOV='+json.dumps([[k[0],k[1],list(v['sems'].keys()),v['u'],v['n']] for k,v in cov.items()],ensure_ascii=False,separators=(',',':'))+';\n')
print(len(out),sum(len(x[5]) for x in out))
for k,v in cov.items():print(k,list(v['sems']),v['u'],v['n'])
