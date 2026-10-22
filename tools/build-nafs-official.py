import subprocess,re,html,json,os,glob
from PIL import Image
OUT='/workspace/itqan/nafs-official';os.makedirs(OUT+'/img',exist_ok=True)
D='٠١٢٣٤٥٦٧٨٩';DPI=130;S=DPI/72
SEC={'a-3rd':[('الرياضيات',1,8),('القراءة',9,13)],'b-3rd':[('الرياضيات',1,8),('القراءة',9,13)],
'a-6th':[('الرياضيات',1,10),('العلوم',11,20),('القراءة',21,28)],'b-6th':[('الرياضيات',1,10),('العلوم',11,20),('القراءة',21,27)],
'a-9th':[('الرياضيات',1,10),('العلوم',11,20),('القراءة',21,26)],'b-9th':[('الرياضيات',1,10),('العلوم',11,20),('القراءة',21,27)]}
GR={'3rd':'الثالث الابتدائي','6th':'السادس الابتدائي','9th':'الثالث المتوسط'}
L={'أ':'أ','ب':'ب','ج':'ج','د':'د'}
def box(im):
  w,h=im.size;px=im.load();P=lambda p:p[2]>120 and p[2]-p[1]>35 and p[0]<190
  best=(0,0)
  for x in range(0,int(w*0.2)):
    c=sum(1 for y in range(0,h,2) if P(px[x,y]))
    if c>best[0]:best=(c,x)
  if best[0]*2<120:return []
  x=best[1];R=[y for y in range(h) if any(P(px[xx,y]) for xx in range(max(0,x-2),x+3))]
  return R
def endcut(im):
  w,h=im.size;px=im.load();P=lambda p:p[2]>120 and p[2]-p[1]>35 and p[0]<150
  for y in range(int(h*0.35),h):
    if sum(1 for x in range(0,w,2) if P(px[x,y]))>8: return im.crop((0,0,w,max(10,y-12)))
  return im
def trim(im):
  g0=im.convert('L');w,h=g0.size;p0=g0.load();seen=False;gap=0
  for y in range(h):
    if min(p0[x,y] for x in range(0,w,3))<190: seen=True;gap=0
    elif seen:
      gap+=1
      if gap>int(45*S): im=im.crop((0,0,w,y));break
  g=im.convert('L');w,h=g.size;px=g.load();y=h-1
  while y>40 and min(px[x,y] for x in range(0,w,3))>190: y-=1
  im=im.crop((0,0,w,min(h,y+14)));return htrim(im)
def htrim(im):
  g=im.convert('L');w,h=g.size;px=g.load()
  cols=[x for x in range(w) if min(px[x,y] for y in range(0,h,2))<200]
  # ignore thin full-height separator/border columns
  if not cols:return im
  a=max(0,cols[0]-16);b=min(w,cols[-1]+16)
  return im.crop((a,0,b,h))
qs=[];excl=[];rep={}
for key,secs in SEC.items():
  m,g=key.split('-');f=f'preparation-form-{m}-{g}grade-ar.pdf';code=f'{g}{m}'
  np_=int(re.search(r'Pages:\s+(\d+)',subprocess.run(['pdfinfo',f],capture_output=True,text=True).stdout).group(1))
  kt=subprocess.run(['pdftotext','-layout','-f',str(np_-1),'-l',str(np_),f,'-'],capture_output=True,text=True).stdout
  K={}
  for ln in kt.splitlines():
    t=re.sub(r'[\u202a-\u202e]','',ln).split()
    if len(t)==2 and t[0] in L and t[1].isdigit(): K[int(t[1])]=t[0]
  x=subprocess.run(['pdftotext','-bbox',f,'-'],capture_output=True,text=True).stdout
  pos={};marks=[];ends={}
  for pi,p in enumerate(x.split('<page ')[1:],1):
    if pi>=np_-1: continue
    ws=[]
    for mm in re.finditer(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>',p):
      a,b,c,d=map(float,mm.groups()[:4]);t=re.sub(r'[\u202a-\u202e]','',html.unescape(mm.group(5)))
      if a>505 and t and all(ch in D for ch in t): ws.append((round(b),a,t))
    for mm in re.finditer(r'<word xMin="[\d.]+" yMin="([\d.]+)"[^>]*>[^<]*انتهى',p): ends[pi]=float(mm.group(1))
    grp={}
    for b,a,t in ws: grp.setdefault(min([k for k in grp if abs(k-b)<=2]+[b]),[]).append((a,t))
    for b,v in grp.items():
      digs=''.join(str(D.index(ch)) for a,t in sorted(v) for ch in t);marks.append((pi,b,digs))
  marks.sort();bad=0
  for i,(pi,b,dg) in enumerate(marks,1):
    n=i
    if str(i)[-1]!=dg[-1]:
      n=int(dg);print('PRINTED-ORDER',key,'seq',i,'printed',dg)
    assert n not in pos;pos[n]=(pi,b)
  if len(marks)!=len(K): print('COUNT MISMATCH',key,len(marks),len(K))
  imgs={}
  def page(pi):
    if pi not in imgs:
      subprocess.run(['pdftoppm','-r',str(DPI),'-f',str(pi),'-l',str(pi),'-png','-singlefile',f,'/tmp/pg']);imgs[pi]=Image.open('/tmp/pg.png').convert('RGB')
    return imgs[pi]
  SC={}
  def seps(pi):
    if pi not in SC:
      im=page(pi).convert('L');w,h=im.size;px=im.load();R=[]
      for yy in range(h):
        c=sum(1 for x in range(int(w*.1),int(w*.9),3) if 120<px[x,yy]<225)
        if c>(w*.8/3)*0.85: R.append(yy/S)
      SC[pi]=R
    return SC[pi]
  for sub,a,b in secs:
    psg=None
    if sub=='القراءة' and a in pos:
      pi=pos[a][0];pn=f'{code}-passage.webp';htrim(page(pi).crop((int(15*S),int(55*S),int(580*S),int((pos[a][1]-10)*S)))).save(f'{OUT}/img/{pn}','WEBP',quality=82);psg='nafs-official/img/'+pn
    for n in range(a,b+1):
      if n not in pos or n not in K: excl.append((key,n,'رقم السؤال غير مُكتشف' if n not in pos else 'لا يوجد في المفتاح'));continue
      pi,y=pos[n];nx=[v[1] for k,v in pos.items() if v[0]==pi and v[1]>y]
      y2=min(nx)-6 if nx else ends.get(pi,805)-10
      SP=seps(pi);ya=[t for t in SP if t<y+6];yb=[t for t in SP if t>y+12]
      top=(max(ya)+2) if ya and max(ya)>y-40 else y-4
      if yb: y2=min(yb)-1
      fn=f'{code}-q{n:02d}.webp';im=page(pi).crop((int(15*S),int(top*S),int(580*S),int(y2*S)))
      B=box(im) if g=='3rd' and sub=='القراءة' else []
      if B:
        top,bot=B[0],B[-1];pn=f'{code}-passage.webp';htrim(im.crop((0,max(0,top-6),im.width,bot+6))).save(f'{OUT}/img/{pn}','WEBP',quality=82);psg='nafs-official/img/'+pn
        for q in qs:
          if q['id'].startswith(code+'-') and q['subject']==sub:q['passage']=psg
        im=im.crop((0,0,im.width,top-4))
      if not nx and pi==max(v[0] for v in pos.values()): im=endcut(im)
      im=trim(im);im.save(f'{OUT}/img/{fn}','WEBP',quality=82)
      qs.append({'id':f'{code}-{n}','grade':GR[g],'subject':sub,'model':'','n':n,'img':'nafs-official/img/'+fn,'passage':psg,'ans':K[n],'src':'نموذج التهيئة ٢٠٢٦ – هيئة تقويم التعليم والتدريب'})
      rep.setdefault((GR[g],sub,'أ' if m=='a' else 'ب'),0);rep[(GR[g],sub,'أ' if m=='a' else 'ب')]+=1
  print(key,'key',len(K),'found',sorted(pos))
for q in qs:q['model']='أ' if q['id'][3]=='a' else 'ب'
json.dump(qs,open(OUT+'/questions.json','w'),ensure_ascii=False,indent=0)
for k,v in rep.items():print(k,v)
print('excluded',excl,'total',len(qs))
