'use client';
import {useEffect,useState} from 'react';
import type {RouteId} from './routes';

/** Chapters come from the actual page, rather than a second hand-maintained outline. */
export function ReadingCompass({route}:{route:RouteId}) {
  const [chapters,setChapters]=useState<{id:string;title:string}[]>([]);
  const [active,setActive]=useState('');
  useEffect(()=>{
    const main=document.getElementById('main');
    if(!main)return;
    let observer:IntersectionObserver|undefined;
    let signature="";
    const collect=()=>{
      const headings=[...main.querySelectorAll<HTMLElement>('h2')].filter(h=>!h.closest('.section-pagination,.v7-chapter-guide') && h.textContent?.trim());
      const nextSignature=headings.map(h=>h.textContent).join("|");
      if(nextSignature===signature)return;
      signature=nextSignature;observer?.disconnect();
      const used=new Set([...document.querySelectorAll('[id]')].map(el=>el.id));
      const outline=headings.map(h=>{
        if(!h.id){
          const stem='chapter-'+(h.textContent||'section').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
          let id=stem;let suffix=2;while(used.has(id))id=stem+'-'+suffix++;
          h.id=id;used.add(id);
        }
        return {id:h.id,title:h.textContent!.trim().replace(/([.!?])(?=[A-Z])/g,'$1 ').replace(/\s+/g,' ')};
      });
      setChapters(outline);setActive(outline[0]?.id||'');
      observer=new IntersectionObserver(entries=>{
        for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id);
      },{rootMargin:'-15% 0px -65% 0px'});
      headings.forEach(h=>observer!.observe(h));
    };
    const timer=window.setTimeout(collect,250);
    // Source-reader and question views can replace their content after hydration.
    const contentObserver=new MutationObserver(records=>{
      if(records.every(r=>(r.target instanceof Element?r.target:r.target.parentElement)?.closest('.v7-chapter-guide')))return;
      collect();
    });
    // Child-list changes only; scroll attributes do not continually rebuild the outline.
    contentObserver.observe(main,{childList:true,subtree:true});
    return()=>{clearTimeout(timer);observer?.disconnect();contentObserver.disconnect();};
  },[route]);
  if(chapters.length<2)return null;
  return <nav className="v7-chapter-guide" aria-label="On this page">
    <label htmlFor={'chapter-'+route}>On this page</label>
    <select id={'chapter-'+route} name="chapter" value={active} onChange={event=>{
      const id=event.target.value;setActive(id);
      const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
      const heading=document.getElementById(id);
      for(let parent=heading?.parentElement;parent;parent=parent.parentElement){
        if(parent instanceof HTMLDetailsElement)parent.open=true;
      }
      heading?.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});
      history.replaceState(history.state,'',location.pathname+location.search+'#'+id);
    }}>{chapters.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select>
    <a href="#main" className="v7-return-top">Back to top</a>
  </nav>;
}
