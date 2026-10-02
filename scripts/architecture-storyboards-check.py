"""Verify source contracts and SVG interaction targets without regenerating assets."""
from pathlib import Path
import json, hashlib, xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
records=json.loads((root/'app/architecture-storyboard-data.json').read_text())
assert len(records)==11, 'Architecture coverage changed'
arrows=0
for id,record in records.items():
 assert [f['name'] for f in record['frames']]==['Setup','Component flow','Control / fault','Implication','Evaluation'], id
 assert all(f['finding'] and f['lines'] for f in record['frames']),id
 for source in record['sources']:
  assert hashlib.sha256((root/source['path']).read_bytes()).hexdigest()==source['sha256'],source['path']
 image=root/'public'/record['asset'].lstrip('/')
 assert image.read_bytes()==(root/record['sources'][2]['path']).read_bytes(),id+' drawing changed'
 svg=ET.parse(image)
 svgids={g.get('data-cell-id') for g in svg.iter() if g.get('data-cell-id')}
 assert all(c['id'] in svgids for c in record['components']),id+' missing component interaction target'
 assert all(c['id'] in svgids for c in record['connections']),id+' missing source arrow'
 drawio=ET.parse(root/record['sources'][1]['path'])
 edges={c.get('id'):c for c in drawio.findall('.//mxCell') if c.get('edge')=='1'}
 for edge in record['connections']:
  assert (edge['from'],edge['to'])==(edges[edge['id']].get('source'),edges[edge['id']].get('target')),id
 arrows+=len(record['connections'])
assert any('cannot run as a task inside that software.' in line for line in records['d100']['frames'][3]['lines']), 'D100 recovery rationale was truncated'
print(f'Architecture storyboard check: {len(records)} architectures, 5 chapters each, {arrows} unchanged source arrows; source digests and original SVG assets match.')
