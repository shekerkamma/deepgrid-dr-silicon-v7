'use client';
import {useEffect,useId,useRef,useState} from 'react';
import stories from './architecture-storyboard-data.json';
import {asset,url} from './routes';
import './architecture-storyboard.css';
export type ArchitectureStoryId=keyof typeof stories;
/** Reader and interaction layer over unchanged draw.io exports; no native diagram layout. */
export function ArchitectureStoryboard({id,compact=false}:{id:ArchitectureStoryId;compact?:boolean}){
 const story=stories[id]; const [frame,setFrame]=useState(0); const [selected,setSelected]=useState<string|null>(null); const [loaded,setLoaded]=useState(0); const [expanded,setExpanded]=useState(false);
 const object=useRef<HTMLObjectElement>(null); const uid=useId(); const active=story.frames[frame];
 const related=selected?story.connections.filter(c=>c.from===selected||c.to===selected||c.id===selected):[];
 const component=story.components.find(c=>c.id===selected);
 useEffect(()=>{setFrame(0);setSelected(null);},[id]);
 useEffect(()=>{
  const doc=object.current?.contentDocument; if(!doc)return;
  const cleanup:(()=>void)[]=[];
  for(const c of story.components){const g=doc.querySelector(`[data-cell-id="${c.id}"]`);if(!g)continue;
   const el=g as SVGGElement; el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',c.label);el.style.cursor='pointer';
   const choose=()=>setSelected(c.id); const key=(e:Event)=>{const k=e as KeyboardEvent;if(k.key==='Enter'||k.key===' '){k.preventDefault();choose();}};
   el.addEventListener('click',choose);el.addEventListener('keydown',key);cleanup.push(()=>{el.removeEventListener('click',choose);el.removeEventListener('keydown',key);});
  }
  return ()=>cleanup.forEach(f=>f());
 },[id,loaded,story]);
 useEffect(()=>{
  const doc=object.current?.contentDocument;if(!doc)return;
  const keep=new Set(related.flatMap(c=>[c.id,c.from,c.to]));if(selected)keep.add(selected);
  for(const c of [...story.components,...story.connections]){const el=doc.querySelector(`[data-cell-id="${c.id}"]`) as SVGGElement|null;if(el){el.style.opacity=selected&&!keep.has(c.id)?'.22':'1';el.setAttribute('aria-pressed',String(c.id===selected));}}
 },[selected,related,loaded,story]);
 return <figure className="architecture-storyboard" data-storyboard={id} data-compact={compact}>
  <header className="as-header"><p className="dr-kicker">ARCHITECTURE STORYBOARD · {story.title}</p><p>Follow the signal, inspect the control path, then name what must be tested.</p></header>
  <div className="as-chapters" aria-label={`${story.title} storyboard chapters`}>{story.frames.map((f,i)=><button key={f.name} aria-pressed={frame===i} aria-controls={uid} onClick={()=>{setFrame(i);setSelected(null);}}><span>{String(i+1).padStart(2,'0')}</span>{f.name}</button>)}</div>
  <div className="as-scene" data-expanded={expanded}>
   <div className="as-reading" id={uid} aria-live="polite"><p className="as-frame">{String(frame+1).padStart(2,'0')} / {active.name}</p><h3>{active.finding}</h3><ol>{active.lines.map((line,i)=><li key={i}>{line}</li>)}</ol><p className="as-provenance">Reading basis: {active.sourceSection}. Architecture values are design targets unless separately identified as implementation or simulation evidence.</p></div>
   <div className="as-visual"><div className="as-tools"><span>DRAW.IO SOURCE VIEW</span><button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{expanded?'Fit drawing':'Enlarge drawing'}</button><button onClick={()=>setSelected(null)} disabled={!selected}>Show all connections</button></div><div className="as-vector"><object ref={object} type="image/svg+xml" data={asset(story.asset)} aria-label={`${story.title}: original draw.io component flows; select a component to inspect its connections`} onLoad={()=>setLoaded(x=>x+1)}><a href={asset(story.asset)}>Open the source-derived architecture view</a></object></div><p className="as-image-note">Original draw.io geometry and labelled arrows. Select a component in the drawing, or use the connection register below. Functional topology, not a fabricated floorplan.</p></div>
  </div>
  <details className="as-register"><summary>Inspect component connections · {story.connections.length} source arrows</summary><div className="as-edge-list">{story.connections.map(c=><button key={c.id} aria-pressed={selected===c.id} onClick={()=>setSelected(c.id)}>{c.fromLabel} <span>→ {c.label||'source connection'} →</span> {c.toLabel}</button>)}</div></details>
  {selected&&<aside className="as-selection" aria-live="polite"><strong>{component?.label||'Selected source connection'}</strong>{related.map(c=><p key={c.id}>{c.fromLabel} → {c.label||'source connection'} → {c.toLabel}</p>)}</aside>}
  <figcaption className="as-sources"><a href={url(story.guide)}>Read the architecture guide</a><a href={asset(story.drawio)} download>Download original .drawio</a><a href={asset(story.asset)} target="_blank" rel="noreferrer">Open original vector drawing</a><span>Pre-silicon architecture · no certification implied</span></figcaption>
 </figure>;
}
