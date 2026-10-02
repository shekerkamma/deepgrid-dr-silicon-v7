'use client';
import {useEffect} from 'react';
import {url} from './routes';

declare global { interface Window {ScrollCraft?:{mount:(root:HTMLElement)=>unknown}} }
/** The upstream engine is copied unchanged; page-specific composition stays in markup/CSS. */
export function ScrollCraftSurface(){
  useEffect(()=>{
    const root=document.querySelector<HTMLElement>('.v7-home');
    if(!root)return;
    if(!document.getElementById('scrollcraft-styles')){
      const styles=document.createElement('link');styles.id='scrollcraft-styles';styles.rel='stylesheet';styles.href=url('/vendor/scrollcraft.css');document.head.appendChild(styles);
    }
    const mount=()=>{if(!root.dataset.craftMounted && window.ScrollCraft){root.dataset.craftMounted='true';window.ScrollCraft.mount(root);}};
    if(window.ScrollCraft){mount();return;}
    const script=document.createElement('script');script.src=url('/vendor/scrollcraft.js');script.async=true;
    script.addEventListener('load',mount);document.head.appendChild(script);
    return()=>{script.removeEventListener('load',mount);};
  },[]);
  return null;
}
