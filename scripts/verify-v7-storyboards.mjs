// Run against an already built site. Never builds, starts a server or changes source assets.
// node scripts/verify-v7-storyboards.mjs <base-url> [results.json]
import {chromium} from 'playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const site=(process.argv[2]||'').replace(/\/?$/,'/');
if(!/^https?:\/\//.test(site))throw Error('Usage: verify-v7-storyboards.mjs <built-base-url> [results.json]');
const data=JSON.parse(readFileSync(resolve(root,'app/architecture-storyboard-data.json'),'utf8'));
const cases=Object.keys(data).filter(id=>id!=='dg32-2dom').map(id=>({id,route:`products/${id==='dg32-lite'?'sku-4':id}.html`}));
cases.push({id:'dg32-2dom',route:'products.html',variant:true});
const results=[];const failures=[];const checkedLinks=new Set();
const browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
async function check(label,run){try{await run();results.push({label,status:'passed'});}catch(error){failures.push(`${label}: ${error.message}`);results.push({label,status:'failed',error:error.message});}}
async function visit(page,c){
 const response=await page.goto(new URL(c.route,site).href,{waitUntil:'domcontentloaded'});
 assert.equal(response?.status(),200,'Route did not return 200');
 if(c.variant)await page.getByRole('button',{name:'DG32-2DOM · attention domain',exact:true}).click();
 const figure=page.locator(`[data-storyboard="${c.id}"]`).first();
 await figure.locator('.as-reading h3').waitFor({state:'attached'});
 return figure;
}
function drawingReady(page,id){return page.waitForFunction(id=>{
 const figure=document.querySelector(`[data-storyboard="${id}"]`);const doc=figure?.querySelector('object')?.contentDocument;
 return !!doc?.querySelector('svg [role="button"]');
},id,{timeout:20000});}
async function narrativeAtRest(page,figure){
 assert.equal(await page.evaluate(()=>scrollY),0,'Reader was scrolled before resting-state check');
 const state=await figure.locator('.as-reading').evaluate(el=>{
  const hidden=[];for(let node=el;node;node=node.parentElement){const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)hidden.push(node.className);}
  return {hidden,height:el.getBoundingClientRect().height,text:el.textContent.trim()};
 });
 assert.deepEqual(state.hidden,[],'Narrative is hidden before scrolling');assert(state.height>0&&state.text.length>80,'Narrative has no readable resting state');
 assert(await figure.locator('.as-reading h3').isVisible(),'Finding is absent');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Page overflows viewport');
}
try{
 const desktop=await browser.newPage({viewport:{width:1440,height:1000}});desktop.setDefaultTimeout(20000);
 for(const c of cases)await check(`1440 ${c.id}: chapters, source SVG, keyboard, edge/reset, links`,async()=>{
  const figure=await visit(desktop,c);await drawingReady(desktop,c.id);
  const chapters=figure.locator('.as-chapters button');assert.equal(await chapters.count(),5);
  for(let i=0;i<5;i++){
   await chapters.nth(i).click();assert.equal(await chapters.nth(i).getAttribute('aria-pressed'),'true');
   assert.equal((await figure.locator('.as-reading h3').textContent()).trim(),data[c.id].frames[i].finding);
  }
  const component=data[c.id].components.find(node=>data[c.id].connections.some(edge=>edge.from===node.id||edge.to===node.id));assert(component,'No connected source component');
  await figure.locator('object').evaluate((object,id)=>object.contentDocument.querySelector(`[data-cell-id="${id}"]`).focus(),component.id);
  const focused=await figure.locator('object').evaluate((object,id)=>object.contentDocument.activeElement?.getAttribute('data-cell-id')===id,component.id);assert(focused,'Source SVG component did not receive keyboard focus');
  await desktop.keyboard.press('Enter');await figure.locator('.as-selection').waitFor();
  assert((await figure.locator('.as-selection strong').textContent()).includes(component.label),'Enter did not select the source component');
  await figure.locator('.as-register summary').click();
  const edge=figure.locator('.as-edge-list button').first();await edge.click();assert.equal(await edge.getAttribute('aria-pressed'),'true');
  await desktop.waitForFunction(id=>[...document.querySelector(`[data-storyboard="${id}"] object`).contentDocument.querySelectorAll('[data-cell-id]')].some(g=>g.style.opacity==='.22'||g.style.opacity==='0.22'),c.id);
  const firstEdge=data[c.id].connections[0];
  assert.equal(await figure.locator('object').evaluate((object,id)=>object.contentDocument.querySelector(`[data-cell-id="${id}"]`).style.opacity,firstEdge.id),'1','Selected source arrow is dimmed');
  await figure.getByRole('button',{name:'Show all connections',exact:true}).click();
  await desktop.waitForFunction(id=>![...document.querySelector(`[data-storyboard="${id}"] object`).contentDocument.querySelectorAll('[data-cell-id]')].some(g=>g.style.opacity==='0.22'),c.id);
  assert.equal(await figure.locator('.as-selection').count(),0,'Reset kept selected connection details');
  for(const href of await figure.locator('.as-sources a').evaluateAll(links=>links.map(a=>a.href))){
   const link=new URL(href);assert.equal(link.origin,new URL(site).origin,'Source link left the built site');assert(link.pathname.startsWith(new URL(site).pathname),'Source link lost Pages base');
   if(!checkedLinks.has(href)){const response=await desktop.request.get(href);assert.equal(response.status(),200,`Source link ${href}`);checkedLinks.add(href);}
  }
 });
 // The products overview must support both directions of variant selection without losing specs.
 await check('products: both variant controls and retained specifications',async()=>{
  await desktop.goto(new URL('products.html',site).href,{waitUntil:'domcontentloaded'});
  for(const [name,id] of [['DG32-2DOM · attention domain','dg32-2dom'],['DG32-LITE · control domain','dg32-lite']]){
   const button=desktop.getByRole('button',{name,exact:true});await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');await desktop.locator(`[data-storyboard="${id}"]`).waitFor();
  }
  const specs=desktop.locator('details').filter({has:desktop.getByText('Full specifications, side by side',{exact:true})});await specs.locator('summary').click();assert(await specs.locator('table').isVisible(),'Side-by-side specifications were lost');
 });
 await desktop.close();
 for(const [width,reducedMotion] of [[768,'no-preference'],[390,'reduce']]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion});page.setDefaultTimeout(20000);
  for(const c of cases.filter(c=>!c.variant))await check(`${width} ${reducedMotion} ${c.id}: narrative before scrolling`,async()=>{const figure=await visit(page,c);await narrativeAtRest(page,figure);});
  // On the overview, initial LITE must be readable without any variant click or scroll.
  await check(`${width} ${reducedMotion} products: initial narrative before scrolling`,async()=>{
   const figure=await visit(page,{id:'dg32-lite',route:'products.html'});await narrativeAtRest(page,figure);
  });
  await page.close();
 }
}finally{await browser.close();}
const summary={baseUrl:site,architectures:Object.keys(data).length,chapters:55,sourceLinks:checkedLinks.size,checks:results.length,failures,results};
if(process.argv[3]){const output=resolve(process.argv[3]);mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(summary,null,2)+'\n');}
if(failures.length)throw Error(failures.join('\n'));
console.log(`v7 storyboard gate PASS: 11 architectures, 55 chapter selections, source SVG keyboard/edge/reset controls, ${checkedLinks.size} source links; tablet and reduced-motion phone resting narratives.`);
