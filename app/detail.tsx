'use client';
import {ArrowUpRight} from 'lucide-react';
import {url} from './routes';
import {readHref} from './doc-links';
import {nbspUnits as nb, type DiagramNotes as DiagramNotesData, type DiagramRef} from './diagram-notes';
import type {Explained,Step} from './detail-content';

// Layout primitives for the detailed sections. Content lives in detail-content.ts.

export function Eyebrow({children}:{children:React.ReactNode}){return <p className="eyebrow"><span/> {children}</p>}
export function SectionHead({title,copy,kicker}:{tag?:string;kicker?:string;title:string;copy:string}){return <header className="section-head"><div>{kicker&&<p className="kicker">{kicker}</p>}<h1>{title}</h1></div><p>{copy}</p></header>}

export function Sec({kicker,title,em,copy,children}:{kicker:string;title:string;em?:string;copy?:React.ReactNode;children?:React.ReactNode}){
 return <section className="dr-sec"><header className="dr-sec-head"><div><p className="dr-kicker">{kicker}</p><h2 className="dr-h2">{title}{em&&<><br/><em>{em}</em></>}</h2></div>{copy&&<div className="dr-sec-copy">{typeof copy==='string'?<p>{copy}</p>:copy}</div>}</header>{children}</section>;
}

export function ExplainedGrid({items,cols=3}:{items:Explained[];cols?:2|3}){
 return <div className={'dr-explained dr-cols-'+cols}>{items.map(x=><article key={x.name}><h3>{x.name}</h3><p>{x.what}</p><p className="dr-why-line"><span className="mono">WHY</span>{x.why}</p>{x.points&&<ul>{x.points.map(p=><li key={p}>{p}</li>)}</ul>}</article>)}</div>;
}

export function Steps({steps,label}:{steps:Step[];label?:string}){
 return <ol className="dr-steps" aria-label={label}>{steps.map(([t,d],i)=><li key={t}><span className="dr-step-n">{String(i+1).padStart(2,'0')}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>;
}

export function Flows({flows}:{flows:{title:string;lead:string;steps:Step[]}[]}){
 return <div className={'dr-flows dr-flows-'+flows.length}>{flows.map(f=><div key={f.title} className="dr-flow"><h3>{f.title}</h3><p className="dr-flow-lead">{f.lead}</p><Steps steps={f.steps} label={f.title}/></div>)}</div>;
}

export function DataTable({caption,head,rows,wide}:{caption:string;head:string[];rows:readonly (readonly (string|number)[])[];wide?:boolean}){
 return <div className="table-scroll"><table className={'dr-table'+(wide?' dr-table-wide':'')}><caption>{caption}</caption><thead><tr>{head.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={String(r[0])}><th scope="row">{r[0]}</th>{r.slice(1).map((c,i)=><td key={i}>{c}</td>)}</tr>)}</tbody></table></div>;
}

export function Callout({label,children,action}:{label:string;children:React.ReactNode;action?:React.ReactNode}){return <aside className="dr-callout"><span className="mono">{label}</span><p>{children}</p>{action}</aside>}

export function Stats({items}:{items:readonly (readonly [string,string])[]}){return <div className="spec-grid dr-stats-grid">{items.map(([v,k])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>}

/** The reading notes under an architecture diagram: what each zone is and why it exists, what the
 *  numbered markers mean, then the primary documents and background reading. Data: diagram-notes.ts. */
export function DiagramNotes({notes}:{notes:DiagramNotesData}){
 const refs=(items:DiagramRef[],external:boolean)=><ul className="dr-dnotes-list">{items.map(r=><li key={r.href}><a href={r.href} {...(external?{target:'_blank',rel:'noreferrer'}:{})}><strong>{r.title}{external&&<ArrowUpRight size={14} aria-hidden="true"/>}</strong><span>{nb(r.note)}</span>{r.meta&&<small className="mono">{r.meta}</small>}</a></li>)}</ul>;
 return <div className="dr-dnotes">
  <section aria-label="How to read this diagram">
   <p className="dr-kicker">THE NUMBERED MARKERS</p>
   <ol className="dr-dnotes-marks">{notes.markers.map(m=><li key={m.mark}><b aria-hidden="true">{m.mark}</b><span><span className="sr-only">Marker {m.mark}: </span>{nb(m.text)}</span></li>)}</ol>
   <p className="dr-kicker dr-dnotes-gap">HOW TO READ THIS DIAGRAM</p>
   <dl className="dr-dnotes-zones">{notes.zones.map(z=><div key={z.name}><dt>{z.name}</dt><dd><p>{nb(z.what)}</p>{z.why&&<p className="dr-dnotes-why"><b>Why</b> {nb(z.why)}</p>}<a className="dr-dnotes-cite" href={readHref(notes.guide,z.section)}>Guide: {z.section.replace(/^Component: /,'')}</a></dd></div>)}</dl>
  </section>
  <section aria-label="Sources and further reading" className="dr-dnotes-refs">
   <p className="dr-kicker">PRIMARY SOURCES</p>
   {refs(notes.primary,false)}
   <details className="dr-dnotes-more"><summary className="dr-kicker">BACKGROUND READING · {notes.background.length}</summary>
    {refs(notes.background,true)}
    <p className="disclaimer">Background reading explains the general technique each block uses. None of it describes this part or implies its certification.</p>
   </details>
  </section>
 </div>;
}
