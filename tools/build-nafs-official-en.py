# Builds English official NAFS 2026 preparation-form items (ETEC) into nafs-official/questions.json
# Source PDFs: https://etec.gov.sa/en/programs/nafs (media.etec.gov.sa). Answers ONLY from the official answer key page.
import subprocess,re,json,os,glob,sys
from PIL import Image
SRC=sys.argv[1] if len(sys.argv)>1 else '/tmp/en'
OUT='/workspace/itqan/nafs-official';DPI=130;S=DPI/72
GR={'3rd':'الثالث الابتدائي','6th':'السادس الابتدائي','9th':'الثالث المتوسط'}
MD={'a':'أ','b':'ب'}
# passage page and box (pixel rows at 130dpi) – detected from the long border rows, verified visually
PAS={'a-3rd':(7,542,1214),'b-3rd':(7,551,1072),'a-6th':(9,153,974),'b-6th':(9,153,898),'a-9th':(9,158,1131),'b-9th':(9,151,1189)}
def pu(p):return p[2]>120 and p[2]-p[0]>55 and p[2]-p[1]>55
def markers(im):
  w,h=im.size;px=im.load()
  tot=sum(1 for x in range(0,w,8) for y in range(0,h,8) if pu(px[x,y]))/((w//8)*(h//8))
  if tot>0.25:return None
  rows=[y for y in range(150,h-120) if sum(1 for x in range(int(.07*w),int(.16*w)) if pu(px[x,y]))>25]
  runs=[]
  for y in rows:
    if runs and y-runs[-1][1]<=2: runs[-1][1]=y
    else: runs.append([y,y])
  return [r[0] for r in runs if 3<=r[1]-r[0]<=20]
def longrow(px,w,y):return sum(1 for x in range(0,w,2) if px[x,y]<235)>0.30*w
def clean(im):
  g=im.convert('L');w,h=g.size;px=g.load();y=h-1
  while y>40 and (min(px[x,y] for x in range(0,w,3))>200 or longrow(px,w,y)): y-=1
  im=im.crop((0,0,w,min(h,y+14)));g=im.convert('L');px=g.load();w,h=g.size
  cols=[x for x in range(w) if min(px[x,yy] for yy in range(0,h,2))<200]
  return im.crop((max(0,cols[0]-16),0,min(w,cols[-1]+16),h)) if cols else im
def save(im,p):
  if im.width>900: im=im.resize((900,round(im.height*900/im.width)),Image.LANCZOS)
  im.save(OUT+'/img/'+p,'WEBP',quality=80)
d=[q for q in json.load(open(OUT+'/questions.json')) if q.get('lang')!='en']
add=[]
for m in 'ab':
  for g in ['3rd','6th','9th']:
    f=f'{SRC}/preparation-form-{m}-{g}grade-en.pdf';key=f'{m}-{g}';code=f'{g}{m}-en'
    np_=int(re.search(r'Pages:\s+(\d+)',subprocess.run(['pdfinfo',f],capture_output=True,text=True).stdout).group(1))
    K={}
    for ln in subprocess.run(['pdftotext','-layout','-f',str(np_-1),'-l',str(np_),f,'-'],capture_output=True,text=True).stdout.splitlines():
      t=ln.split()
      if len(t)==2 and t[0].isdigit() and t[1] in 'ABCD': K[int(t[0])]=t[1]
    bb=subprocess.run(['pdftotext','-bbox',f,'-'],capture_output=True,text=True).stdout.split('<page ')[1:]
    pre=f'/tmp/bn_{key}';subprocess.run(['pdftoppm','-r',str(DPI),'-png',f,pre],stderr=subprocess.DEVNULL)
    pages=sorted(glob.glob(pre+'-*.png'));items=[]
    pp,pt,pb=PAS[key]
    for pi,pf in enumerate(pages,1):
      if pi>=np_-1:continue
      im=Image.open(pf).convert('RGB');mk=markers(im)
      if not mk:continue
      endm=re.search(r'yMin="([\d.]+)"[^>]*>End</word>',bb[pi-1]);lim=int(float(endm.group(1))*S)-4 if endm else im.height-110
      for i,y in enumerate(mk):
        a=y-42;b=mk[i+1]-42 if i+1<len(mk) else lim
        if pi==pp and a<pt<b: b=pt-4
        if pi==pp and pt<=y<pb: raise SystemExit('marker inside passage '+key)
        if pi==pp and pt<=a<=pb: a=pb+6
        items.append(clean(im.crop((0,a,im.width,b))))
      if pi==pp:
        pim=clean(im.crop((0,pt-6,im.width,pb+8)));save(pim,f'{code}-passage.webp')
    secs=[('Mathematics','الرياضيات',1,8),('Reading','القراءة',9,13)] if g=='3rd' else [('Mathematics','الرياضيات',1,10),('Science','العلوم',11,20),('Reading','القراءة',21,25)]
    assert len(items)==len(K)==secs[-1][3],(key,len(items),len(K))
    for n,im in enumerate(items,1):
      sub=[s for s in secs if s[2]<=n<=s[3]][0][1];p=f'{code}-q{n:02d}.webp';save(im,p)
      add.append({'id':f'{code}-{n}','grade':GR[g],'subject':sub,'model':MD[m],'n':n,'img':'nafs-official/img/'+p,
        'passage':('nafs-official/img/'+code+'-passage.webp') if sub=='القراءة' else None,'ans':K[n],'lang':'en',
        'src':'Preparation Form 2026 (English) – ETEC هيئة تقويم التعليم والتدريب'})
    print(key,len(items),'ok')
json.dump(d+add,open(OUT+'/questions.json','w'),ensure_ascii=False,indent=0)
print('total',len(d+add),'new en',len(add))
