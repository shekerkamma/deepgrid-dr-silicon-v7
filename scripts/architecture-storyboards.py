"""Build reading storyboards from unchanged draw.io exports and primary guides.
No diagram geometry is invented. Source digests make the derivation reviewable.
"""
from pathlib import Path
import xml.etree.ElementTree as ET
import re, json, hashlib, shutil, html
ROOT=Path(__file__).resolve().parents[1]
IDS=['dg32-lite','dg32-2dom','sku-1','sku-2','sku-3','sku-5','sku-6','sku-7','sku-8','sku-9','d100']
QUESTIONS={
'dg32-lite':'Measure the current-loop budget and hardware fault response on first silicon, including worst-case firmware and the external gate-driver path.',
'dg32-2dom':'Measure control-loop timing while attention traffic is active; compare engine outputs with the golden software model across supported shapes.',
'sku-1':'Measure loop latency and latched gate shutdown across the intended supply, temperature and motor load.',
'sku-2':'Validate metrology error, channel synchronisation and isolation across the intended load and temperature range.',
'sku-3':'Resolve the documented rail, ADC and sequencer differences before testing start-up, transients and fault recovery.',
'sku-5':'Test both channels for timing, bus faults and recovery across the intended voltage and temperature envelope.',
'sku-6':'Resolve threshold and timing assumptions, then measure fault assertion, reset ordering and watchdog limits.',
'sku-7':'Characterise conversion accuracy, noise and channel timing under the intended sensor and wiring conditions.',
'sku-8':'Validate the actual panel interface, voltage swing, thermal behaviour and frozen-frame response.',
'sku-9':'Measure scheduled network traffic, power switching and fault containment under concurrent load; qualification remains separate.',
'd100':'Validate the independent failsafe path and navigation performance on the intended platform; neither flight safety nor GPS-denied accuracy is established.'}
def clean(s):
 return html.unescape(re.sub(r'<[^>]+>',' ',s)).replace('**','').strip()
def section(text, heading):
 m=re.search(r'^## '+re.escape(heading)+r'[^\n]*\n(.*?)(?=^## |\Z)',text,re.M|re.S)
 return m.group(1).strip() if m else ''
def paragraphs(body):
 return [' '.join(p.split()) for p in re.split(r'\n\s*\n',body) if p.strip()]
def items(body):
 result=[]; current=[]
 for line in body.splitlines():
  match=re.match(r'^(?:[-*]|\d+\.)\s+(.*)',line)
  if match:
   if current: result.append(' '.join(current))
   current=[match.group(1).strip()]
  elif current and line.strip() and not re.match(r'^(?:#|---|\|)',line):
   current.append(line.strip())
  else:
   if current: result.append(' '.join(current))
   current=[]
 if current: result.append(' '.join(current))
 return result
records={}
for id in IDS:
 stem=id+'-architecture'
 guide=ROOT/'public/downloads'/f'{stem}-guide.md'; drawio=ROOT/'public/downloads'/f'{stem}.drawio'; svg=ROOT/'public/diagrams'/f'{stem}.svg'
 text=guide.read_text(); doc=ET.parse(drawio); cells=doc.findall('.//mxCell'); labels={c.get('id'):clean(c.get('value','')) for c in cells}
 components=[{'id':c.get('id'),'label':labels[c.get('id')]} for c in cells if c.get('vertex')=='1' and labels[c.get('id')] and '<b>' in c.get('value','')]
 connections=[{'id':c.get('id'),'from':c.get('source'),'to':c.get('target'),'label':clean(c.get('value','')),'fromLabel':labels.get(c.get('source'),''),'toLabel':labels.get(c.get('target'),'')} for c in cells if c.get('edge')=='1' and c.get('source') and c.get('target')]
 overview=items(section(text,'Architecture Overview'))
 flows=section(text,'Key Data Flows'); blocks=re.split(r'^### ',flows,flags=re.M)
 normal=items(blocks[1] if len(blocks)>1 else flows)
 fault=next((items(b) for b in blocks if re.match(r'(A CPU fault|A failsafe trip|The control loop)',b)),[])
 if not fault:
  fault=[s for s in items(flows) if re.search(r'fault|watchdog|protection|shutdown|monitor|freeze|reset|current sense|feedback',s,re.I)]
 if not fault:
  fault=[s for s in paragraphs(text) if (s.startswith('What it does:') or s.startswith('- **')) and re.search(r'fault|watchdog|protection|shutdown|monitor|freeze|reset|feedback',s,re.I)]
 if not fault:
  fault=[s for s in normal if re.search(r'receiver|result|feedback|read',s,re.I)] or normal[-1:]
 decisions=items(section(text,'Design Decisions')) or [re.sub(r'^Why it (?:exists|is[^:]*):\s*','',s) for s in paragraphs(text) if s.startswith('Why it ')]
 diffs=section(text,'Where this differs from the annex sheet')
 frames=[
 {'name':'Setup','finding':clean(overview[0]) if overview else id.upper(),'lines':[clean(s) for s in overview],'sourceSection':'Architecture Overview'},
 {'name':'Component flow','finding':clean(normal[0]),'lines':[clean(s) for s in normal],'sourceSection':'Key Data Flows'},
 {'name':'Control / fault','finding':clean(fault[0]),'lines':[clean(s) for s in fault],'sourceSection':'Key Data Flows / component descriptions'},
 {'name':'Implication','finding':clean(decisions[0]) if decisions else 'Read the control path with its constraints.','lines':[clean(s) for s in decisions] or [clean(s) for s in overview], 'sourceSection':'Design Decisions / component rationale'},
 {'name':'Evaluation','finding':QUESTIONS[id],'lines':[QUESTIONS[id], 'Design targets and pre-silicon evidence remain separate from manufactured-silicon measurements, production status and certification.']+([clean(diffs)] if diffs else []),'sourceSection':'v7 evaluation questions; architecture-guide reconciliation'}]
 target=ROOT/'public/storyboards'/f'{id}.svg'; shutil.copyfile(svg,target)
 records[id]={'id':id,'title':text.splitlines()[0].removeprefix('# ').replace(': Architecture Guide',''),'asset':f'/storyboards/{id}.svg','guide':f'/downloads/{stem}-guide.md','drawio':f'/downloads/{stem}.drawio','frames':frames,'components':components,'connections':connections,'sources':[{'path':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [guide,drawio,svg]]}
(ROOT/'app/architecture-storyboard-data.json').write_text(json.dumps(records,indent=2,ensure_ascii=False)+'\n')
(ROOT/'docs/v7/architecture-storyboard-contract.json').write_text(json.dumps({'workflow':'architecture-to-everything: existing draw.io → source explanation → interactive web storyboard','scope':'Web storyboards only; no requested PPTX or Notebook upload','diagramRendering':'Unchanged draw.io-exported SVG assets; no native HTML architecture diagram runtime','coverage':list(records),'sourceRegister':{k:v['sources'] for k,v in records.items()},'frames':['Setup','Component flow','Control / fault','Implication','Evaluation'],'constraints':['No claim of measured silicon or certification','Do not imply logic topology is a physical floorplan','No auto-advance; keyboard, touch and reduced-motion reading','Every source edge preserves original endpoints and label']},indent=2)+'\n')
print(f'Built {len(records)} source-derived storyboards; {sum(len(x["connections"]) for x in records.values())} original draw.io connections.')
