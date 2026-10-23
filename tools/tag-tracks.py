# Conservative track tagging of official items via OCR keywords. calc=احسب (pure computation), think=فكّر (reasoning/problem solving). Others untagged.
import json,subprocess,re,os
P='nafs-official/questions.json';d=json.load(open(P));cache='/tmp/ocr.json'
C=json.load(open(cache)) if os.path.exists(cache) else {}
CALC_AR=r'ما ناتج|ما قيمة|أوجد|اوجد|كم عدد|ما مساحة|ما محيط|ما حجم|بسّط|أبسط صورة|ما الوسيط|ما المتوسط|ما احتمال|ما النسبة المئوية|كم يساوي'
CALC_EN=r'What is the value|Find |How many|What is the area|What is the perimeter|What is the volume|simplest form|Simplify|What is the median|What is the mean|probability|What is the sum|What is the product|percent'
THINK_AR=r'أي مما يلي يفسر|ما سبب|استنتج|يستنتج|أفضل تفسير|لماذا|ماذا يحدث|أي العبارات|خطة|يدل على'
THINK_EN=r'Which statement|best explains|Why |What would happen|conclude|which conclusion|reason|What happens'
for q in d:
  q.pop('track',None)
  if q['subject']=='القراءة':continue
  if q['img'] not in C:
    C[q['img']]=subprocess.run(['tesseract',q['img'],'-','-l','eng' if q.get('lang')=='en' else 'ara','--psm','6'],capture_output=True,text=True).stdout
  t=C[q['img']];en=q.get('lang')=='en'
  ca=re.search(CALC_EN if en else CALC_AR,t,re.I);th=re.search(THINK_EN if en else THINK_AR,t,re.I)
  if q['subject']=='الرياضيات' and ca and not th: q['track']='calc'
  elif th and not ca: q['track']='think'
json.dump(C,open(cache,'w'),ensure_ascii=False)
json.dump(d,open(P,'w'),ensure_ascii=False,indent=0)
from collections import Counter;print(Counter((q.get('lang','ar'),q['subject'],q.get('track')) for q in d))
# manual review removed think tag from knowledge-recall items: 6tha-11, 9tha-15, 9tha-en-15, 9thb-14
