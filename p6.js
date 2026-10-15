/* Rolê — personalização (adesivos, moldura, rastro, oficina) e página da cidade */
(()=>{'use strict';
const RL=window.__role;if(!RL||!RL.comm||!RL.tt)return;
const {S,SCREENS,save,toast,sheet,ic,I,esc,$,$$,router,ride,gps,ago}=RL;
const C=RL.comm,T=RL.tt;const DEF=RL.DEFAULT_CENTER||[-43.9386,-19.9255];
const myPos=()=>gps.pos||ride.last||S.lastPos||DEF;
const hsh=s=>{let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return(h>>>0)/4294967295;};
const rad=d=>d*Math.PI/180;
const dist=(a,b)=>{const dLat=rad(b[1]-a[1]),dLng=rad(b[0]-a[0]);const x=Math.sin(dLat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dLng/2)**2;return 12742000*Math.asin(Math.sqrt(x));};
const LOCK='<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>';
const st=document.createElement('style');st.textContent=`
.pz-prev{position:relative;height:250px;border-radius:26px;overflow:hidden;background:radial-gradient(70% 60% at 50% 62%,rgba(198,244,50,.14),transparent 70%),linear-gradient(#151613,#0A0B09);border:1px solid var(--line);touch-action:none;user-select:none;-webkit-user-select:none}
.pz-prev .car{position:absolute;left:0;right:0;top:34px;bottom:34px;display:flex;align-items:center;justify-content:center}
.pz-prev .car>img{max-width:88%;max-height:100%;object-fit:contain;filter:drop-shadow(0 14px 14px rgba(0,0,0,.6));pointer-events:none}
.pz-prev .car>img.real{width:92%;height:100%;max-width:none;object-fit:cover;border-radius:18px;opacity:1}
#pzs{position:absolute;inset:0}
.stk-layer{position:absolute;inset:0;pointer-events:none}
.stk{position:absolute;width:var(--w);transform:translate(-50%,-50%) rotate(var(--r));pointer-events:auto;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}
.stk svg{width:100%;height:auto;display:block}
.stk.sel{outline:2px dashed rgba(198,244,50,.9);outline-offset:4px;border-radius:6px}
.gim .stk-layer .stk,.pz-ro .stk{pointer-events:none}
.pz-tabs{display:flex;gap:6px;margin:14px 0 10px;overflow-x:auto;scrollbar-width:none}.pz-tabs::-webkit-scrollbar{display:none}
.pz-tabs button{flex:0 0 auto;height:38px;padding:0 14px;border-radius:99px;background:#141512;border:1px solid var(--line);font-weight:800;font-size:13px}
.pz-tabs button.on{background:var(--lime);color:#0A0B0A;border-color:var(--lime)}
.pz-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.pz-it{position:relative;aspect-ratio:1;border-radius:16px;background:#141512;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;padding:10px}
.pz-it svg{width:100%;height:100%}.pz-it.on{border-color:var(--lime);background:rgba(198,244,50,.1)}
.pz-it .lk{position:absolute;right:5px;top:5px;width:20px;height:20px;border-radius:99px;background:#0A0B0A;border:1px solid rgba(198,244,50,.5);display:flex;align-items:center;justify-content:center;color:var(--lime2)}
.pz-it .nm{position:absolute;left:0;right:0;bottom:4px;font-size:10px;font-weight:700;color:var(--tx3);text-align:center}
.pz-tools{display:flex;gap:8px;margin-top:10px}.pz-tools button{flex:1;height:42px;border-radius:14px;background:#141512;border:1px solid var(--line);font-weight:800;font-size:13px}
.pz-note{font-size:12.5px;color:var(--tx3);margin:8px 2px 0;line-height:1.45}
.plusbar{display:flex;align-items:center;gap:12px;margin-top:14px;padding:14px;border-radius:20px;background:linear-gradient(120deg,rgba(198,244,50,.18),rgba(198,244,50,.04));border:1px solid rgba(198,244,50,.35)}
.avf{position:relative;display:inline-flex;border-radius:99px;flex-shrink:0}
.avf::before{content:"";position:absolute;inset:-3px;border-radius:99px;z-index:0}
.avf>.av{position:relative;z-index:1}
.avf.f-lime::before{background:var(--lime)}
.avf.f-fogo::before{background:conic-gradient(#FF3D00,#FFB300,#FF6A3D,#FF1744,#FF3D00)}
.avf.f-cromo::before{background:conic-gradient(#fff,#8C8E88,#E6E7E2,#55574F,#fff)}
.avf.f-neon::before{background:#22D3EE;box-shadow:0 0 12px #22D3EE}
.avf.f-rosa::before{background:linear-gradient(135deg,#FFC2E8,#E0559E)}
.avf.f-arco::before{background:conic-gradient(#FF4F4F,#FACC15,#C6F432,#22D3EE,#8B5CF6,#FF4F4F);animation:avspin 4s linear infinite}
@keyframes avspin{to{transform:rotate(360deg)}}
.modchips{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.modchips span{font-size:10.5px;font-weight:800;padding:3px 7px;border-radius:99px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.14);color:#E8EBE0}
.rcol{width:100%;aspect-ratio:1;border-radius:16px;border:1px solid var(--line);position:relative;overflow:hidden;background:#141512}
.rcol svg{position:absolute;inset:0;width:100%;height:100%}
/* cidade */
.cy{position:absolute;inset:0;overflow-y:auto;background:#0A0B0A}
.cyh{position:relative;height:380px;overflow:hidden}
.cyh .smap{position:absolute!important;inset:0;filter:saturate(.6)}
.cyh .shade{position:absolute;inset:0;background:linear-gradient(rgba(10,11,10,.55),rgba(10,11,10,.1) 30%,rgba(10,11,10,.55) 62%,#0A0B0A 98%)}
.cyh .top{position:absolute;left:14px;right:14px;top:calc(12px + var(--safeT));display:flex;gap:8px;z-index:3}
.cyh .ttl{position:absolute;left:18px;right:18px;bottom:66px;z-index:3}
.cyname{font-family:'Anton','Oswald','Arial Narrow',sans-serif;text-transform:uppercase;line-height:.86;letter-spacing:.5px;color:#fff;white-space:nowrap}
.cyghost{font-family:'Anton','Oswald','Arial Narrow',sans-serif;text-transform:uppercase;line-height:.86;letter-spacing:.5px;color:transparent;-webkit-text-stroke:1.5px rgba(198,244,50,.55);white-space:nowrap;margin-bottom:-.18em;opacity:.9}
.cysub{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13px;font-weight:700;color:var(--tx2)}
.cysub i{width:8px;height:8px;border-radius:99px;background:var(--lime);box-shadow:0 0 10px var(--lime);font-style:normal}
.cyh .acts{position:absolute;left:18px;right:18px;bottom:14px;display:flex;gap:8px;z-index:3}
.cyh .acts button{height:42px;padding:0 16px;border-radius:99px;font-weight:800;font-size:13.5px;display:flex;align-items:center;gap:7px;background:rgba(20,21,18,.8);border:1px solid var(--line2);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.cyh .acts button.pri{background:var(--lime);color:#0A0B0A;border-color:var(--lime)}
.cystats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:6px 16px 0}
.cystats div{border-radius:16px;background:#121311;border:1px solid var(--line);padding:10px 8px;text-align:center}
.cystats b{display:block;font-family:'Anton','Oswald',sans-serif;font-size:22px;font-weight:400;letter-spacing:.5px}.cystats span{font-size:10.5px;font-weight:700;color:var(--tx3)}
.cytabs{position:sticky;top:0;z-index:4;background:#0A0B0A;padding:14px 16px 10px;display:flex;gap:18px;border-bottom:1px solid var(--line)}
.cytabs button{font-weight:800;font-size:15px;color:var(--tx3);padding-bottom:6px;border-bottom:2px solid transparent}
.cytabs button.on{color:var(--tx);border-color:var(--lime)}
.cygrid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:2px}
.cygrid button{position:relative;aspect-ratio:9/14;overflow:hidden;background:#141512}
.cygrid img,.cygrid video{width:100%;height:100%;object-fit:cover;opacity:1}
.cygrid .cyb{position:absolute;left:6px;bottom:6px;display:flex;align-items:center;gap:4px;font-size:11px;font-weight:800;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.8)}
.cygrid .cyk{position:absolute;right:6px;top:6px;color:#fff;filter:drop-shadow(0 1px 3px rgba(0,0,0,.7))}
.cyride{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:radial-gradient(80% 60% at 50% 40%,rgba(198,244,50,.16),#111210)}
.cyride b{font-family:'Anton','Oswald',sans-serif;font-weight:400;font-size:26px;color:var(--lime2)}
.cylist{padding:12px 16px 120px}
.pmloc{cursor:pointer}
`;document.head.appendChild(st);
if(!document.getElementById('fnt-anton')){const l=document.createElement('link');l.id='fnt-anton';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Anton&display=swap';document.head.appendChild(l);}
/* ---------- migração: tira a pintura/neon antigos que ficavam feios ---------- */
let mig=false;for(const c of S.cars){if(c.style||c.glow){if(c.frontOrig)c.front=c.frontOrig;if(c.rearOrig)c.rear=c.rearOrig;c.style=null;c.glow=null;mig=true;}}if(mig){save();try{RL.rebuildCar&&RL.rebuildCar();}catch(e){}}
/* ---------- adesivos (desenhos próprios) ---------- */
const SV=(b,vb='0 0 100 100')=>`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
const STK={
 raio:['Raio',0,SV('<path d="M58 4L18 56h26L36 96l46-58H54z" fill="#C6F432" stroke="#0A0B0A" stroke-width="4" stroke-linejoin="round"/>')],
 hex:['Hex',0,SV('<path d="M50 6l38 22v44L50 94 12 72V28z" fill="#0A0B0A" stroke="#C6F432" stroke-width="7"/><path d="M50 30l17 10v20L50 70 33 60V40z" fill="#C6F432"/>')],
 role:['Rolê',0,SV('<rect x="4" y="22" width="152" height="56" rx="28" fill="#C6F432"/><text x="80" y="64" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="34" fill="#0A0B0A">ROLÊ</text>','0 0 160 100')],
 xadrez:['Bandeira',0,SV('<rect x="10" y="20" width="80" height="60" rx="6" fill="#fff"/>'+[0,1,2,3].map(r=>[0,1,2,3,4].map(c=>(r+c)%2?`<rect x="${10+c*16}" y="${20+r*15}" width="16" height="15" fill="#111"/>`:'').join('')).join('')+'<rect x="10" y="20" width="80" height="60" rx="6" fill="none" stroke="#111" stroke-width="3"/>')],
 estrela:['Estrela',0,SV('<path d="M50 6l12 28 30 3-23 20 7 30-26-16-26 16 7-30L8 37l30-3z" fill="#FACC15" stroke="#0A0B0A" stroke-width="4" stroke-linejoin="round"/>')],
 chama:['Chamas',1,SV('<path d="M6 70c20 4 30-6 34-20 4 14 12 22 26 20-8-8-6-22 4-30 0 14 10 22 24 22-6 10-20 18-40 18H6z" fill="#FF6A3D"/><path d="M20 70c12 0 20-6 22-14 4 8 10 12 20 12-6 4-14 8-26 8H20z" fill="#FACC15"/>','0 0 100 100')],
 n07:['Nº 07',1,SV('<circle cx="50" cy="50" r="44" fill="#fff" stroke="#0A0B0A" stroke-width="6"/><text x="50" y="66" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="46" fill="#0A0B0A">07</text>')],
 faixa:['Faixas',1,SV('<g transform="skewX(-18)"><rect x="30" y="20" width="14" height="60" fill="#C6F432"/><rect x="52" y="20" width="14" height="60" fill="#fff"/><rect x="74" y="20" width="14" height="60" fill="#C6F432"/></g>')],
 coracao:['Coração',1,SV('<path d="M50 88S10 62 10 34a20 20 0 0 1 40-6 20 20 0 0 1 40 6c0 28-40 54-40 54z" fill="#FF4F8B" stroke="#0A0B0A" stroke-width="4"/>')],
 olho:['Olho',1,SV('<path d="M6 50s16-28 44-28 44 28 44 28-16 28-44 28S6 50 6 50z" fill="#fff" stroke="#0A0B0A" stroke-width="5"/><circle cx="50" cy="50" r="14" fill="#0A0B0A"/><circle cx="55" cy="45" r="4" fill="#fff"/>')],
 vento:['Vento',1,SV('<path d="M8 36h56a12 12 0 1 0-12-12M8 52h76a12 12 0 1 1-12 12M8 68h40" fill="none" stroke="#22D3EE" stroke-width="8" stroke-linecap="round"/>')],
 coroa:['Coroa',1,SV('<path d="M12 74l-4-46 22 18 20-30 20 30 22-18-4 46z" fill="#FACC15" stroke="#0A0B0A" stroke-width="5" stroke-linejoin="round"/><rect x="12" y="74" width="76" height="12" rx="3" fill="#FACC15" stroke="#0A0B0A" stroke-width="5"/>')]};
const stkHTML=(c,edit)=>`<div class="stk-layer">${(c.stk||[]).map((s,i)=>STK[s.k]?`<div class="stk" data-si="${i}" style="left:${s.x}%;top:${s.y}%;--w:${s.w}%;--r:${s.r||0}deg">${STK[s.k][2]}</div>`:'').join('')}</div>`;
RL.stkHTML=stkHTML;
/* adesivos e oficina aparecem na garagem */
const FR={none:['Sem moldura',0],lime:['Lima',0],rosa:['Rosa',0],fogo:['Fogo',1],cromo:['Cromo',1],neon:['Neon',1],arco:['Arco-íris',1]};
const TR={'#EFFF7A':['Lima',0],'#22D3EE':['Ciano',0],'#FF4F8B':['Rosa',1],'#FF9F1C':['Laranja',1],'#FFFFFF':['Branco',1],'#8B5CF6':['Roxo',1]};
const MODS=['Rebaixado','Suspensão a ar','Rodas esportivas','Insulfilm','Som automotivo','Escape esportivo','Turbo','Remap','Envelopado','Faróis LED','Kit visual','Bancos esportivos'];
const av0=RL.avatar2;RL.avatar2=function(w,s){const h=av0(w,s);const f=S.me.frame;if(w&&w.me&&f&&f!=='none')return`<span class="avf f-${f}">${h}</span>`;return h;};
function applyTrail(){const m=RL.getMap&&RL.getMap();const c=S.me.trail;if(!m||!c)return;try{if(m.getLayer('track'))m.setPaintProperty('track','line-color',c);if(m.getLayer('route-core'))m.setPaintProperty('route-core','line-color',c);if(m.getLayer('route-glow'))m.setPaintProperty('route-glow','line-color',c);}catch(e){}}
const tw=setInterval(()=>{const m=RL.getMap&&RL.getMap();if(m&&m.getLayer&&m.getLayer('track')){clearInterval(tw);applyTrail();}},700);
/* garagem: mods no palco (adesivos entram pelo carPic da garagem) */
const GS=SCREENS.garage;if(GS){
 const tx=GS.txtH;if(tx)GS.txtH=function(c,still){const h=tx.call(this,c,still);const m=(c.mods||[]);return m.length?h.replace('</div></div><span class="odo',`</div><div class="modchips">${m.slice(0,4).map(x=>`<span>${esc(x)}</span>`).join('')}${m.length>4?`<span>+${m.length-4}</span>`:''}</div></div><span class="odo`):h;};}
/* ---------- tela PERSONALIZAR (substitui o estúdio antigo) ---------- */
const locked=pl=>pl&&!S.plus;
SCREENS.studio={tabbar:false,
 html(p){const c=(p&&p.id&&S.cars.find(x=>x.id===p.id))||RL.featCar&&RL.featCar()||S.cars[0];this.c=c;const t=this.t||'stk';
  return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Personalizar</h2>${S.plus?'<span class="badge" style="background:rgba(198,244,50,.16);color:var(--lime2)">Rolê+</span>':''}</div><div class="scroll">
  <div class="pz-prev" id="pzp"><div class="car" id="pzc">${c.front?`<img src="${c.front}" alt="">`:(RL.picTag?RL.picTag(RL.modelKey(c.model),'g'+c.id,'real'):'')}<div id="pzs">${stkHTML(c,1)}</div></div></div>
  <div class="pz-tabs" id="pzt">${[['stk','Adesivos'],['frm','Moldura'],['trl','Rastro'],['mod','Oficina']].map(([k,n])=>`<button data-t="${k}" class="${t===k?'on':''}">${n}</button>`).join('')}</div>
  <div id="pzb"></div>${S.plus?'':`<button class="plusbar" data-on="plus" style="width:100%;text-align:left"><span class="ib" style="width:40px;height:40px;background:var(--lime);color:#0A0B0A">✦</span><div style="flex:1"><div class="b">Libere tudo com Rolê+</div><div class="small muted">Adesivos, molduras e rastros exclusivos</div></div>${ic('<path d="M9 6l6 6-6 6"/>',18)}</button>`}</div>`;},
 mount(el){this.sel=null;this.drawB();this.wire();$$('#pzt [data-t]',el).forEach(b=>b.onclick=()=>{this.t=b.dataset.t;$$('#pzt [data-t]',el).forEach(x=>x.classList.toggle('on',x===b));this.drawB();});},
 drawB(){const el=this.el,c=this.c,t=this.t||'stk',b=$('#pzb',el);
  if(t==='stk'){b.innerHTML=`<div class="pz-grid">${Object.entries(STK).map(([k,[n,pl,svg]])=>`<button class="pz-it" data-k="${k}">${svg}${locked(pl)?`<span class="lk">${ic(LOCK,11,2.4)}</span>`:''}</button>`).join('')}</div>
    <div class="pz-tools" id="pzx" style="${this.sel==null?'opacity:.4;pointer-events:none':''}"><button data-x="m">Menor</button><button data-x="p">Maior</button><button data-x="r">Girar</button><button data-x="d" style="color:#FF7B7B">Tirar</button></div>
    <div class="pz-note">Toque num adesivo pra colocar no carro e arraste pra posicionar. Aparece na sua garagem.</div>`;
   $$('[data-k]',b).forEach(x=>x.onclick=()=>{const it=STK[x.dataset.k];if(locked(it[1])){RL.paywall&&RL.paywall();return;}c.stk=c.stk||[];if(c.stk.length>=8){toast('Máximo de 8 adesivos','dark');return;}c.stk.push({k:x.dataset.k,x:30+Math.random()*40,y:35+Math.random()*30,w:x.dataset.k==='role'?30:18,r:0});save();this.sel=c.stk.length-1;this.redraw();this.drawB();});
   $$('#pzx [data-x]',b).forEach(x=>x.onclick=()=>{const s=c.stk&&c.stk[this.sel];if(!s)return;const a=x.dataset.x;if(a==='m')s.w=Math.max(6,s.w-3);if(a==='p')s.w=Math.min(60,s.w+3);if(a==='r')s.r=((s.r||0)+15)%360;if(a==='d'){c.stk.splice(this.sel,1);this.sel=null;this.drawB();}save();this.redraw();});}
  if(t==='frm'){const cur=S.me.frame||'none';b.innerHTML=`<div class="pz-grid">${Object.entries(FR).map(([k,[n,pl]])=>`<button class="pz-it ${cur===k?'on':''}" data-f="${k}" style="flex-direction:column;padding:8px 6px 18px">${k==='none'?RL.avatar2({me:true},44).replace(/<span class="avf[^>]*>|<\/span>$/g,''):`<span class="avf f-${k}">${av0({me:true},44)}</span>`}<span class="nm">${n}</span>${locked(pl)?`<span class="lk">${ic(LOCK,11,2.4)}</span>`:''}</button>`).join('')}</div><div class="pz-note">A moldura aparece em volta da sua foto no feed, no chat e nos comentários.</div>`;
   $$('[data-f]',b).forEach(x=>x.onclick=()=>{if(locked(FR[x.dataset.f][1])){RL.paywall&&RL.paywall();return;}S.me.frame=x.dataset.f;save();this.drawB();toast('Moldura aplicada');});}
  if(t==='trl'){const cur=S.me.trail||'#EFFF7A';b.innerHTML=`<div class="pz-grid">${Object.entries(TR).map(([k,[n,pl]])=>`<button class="pz-it ${cur===k?'on':''}" data-c="${k}" style="padding:6px"><div class="rcol"><svg viewBox="0 0 100 100"><path d="M10 80C30 80 30 40 50 40S70 20 90 20" fill="none" stroke="${k}" stroke-opacity=".3" stroke-width="16" stroke-linecap="round"/><path d="M10 80C30 80 30 40 50 40S70 20 90 20" fill="none" stroke="${k}" stroke-width="6" stroke-linecap="round"/></svg></div><span class="nm">${n}</span>${locked(pl)?`<span class="lk">${ic(LOCK,11,2.4)}</span>`:''}</button>`).join('')}</div><div class="pz-note">Cor do seu trajeto e da rota no mapa durante o rolê.</div>`;
   $$('[data-c]',b).forEach(x=>x.onclick=()=>{if(locked(TR[x.dataset.c][1])){RL.paywall&&RL.paywall();return;}S.me.trail=x.dataset.c;save();applyTrail();this.drawB();toast('Rastro aplicado no mapa');});}
  if(t==='mod'){const m=c.mods||[];b.innerHTML=`<div class="chips" style="flex-wrap:wrap">${MODS.map(x=>`<button class="chip ${m.includes(x)?'lime':''}" data-m="${esc(x)}">${esc(x)}</button>`).join('')}</div>
   <div class="card" style="margin-top:12px"><div class="b">Anotar serviço na oficina</div><div class="small muted" style="margin-top:2px">Vai pros gastos e pro histórico do carro</div>
   <div class="row" style="gap:8px;margin-top:10px"><input class="inp" id="osv" placeholder="Ex.: Rodas aro 17" style="flex:1.6"><input class="inp" id="ovl" inputmode="decimal" placeholder="R$" style="flex:1"></div><button class="btn sm" id="oad" style="margin-top:10px">Salvar serviço</button></div>
   <div class="pz-note">As modificações aparecem como etiquetas no seu carro na garagem.</div>`;
   $$('[data-m]',b).forEach(x=>x.onclick=()=>{c.mods=c.mods||[];const v=x.dataset.m;const i=c.mods.indexOf(v);if(i>=0)c.mods.splice(i,1);else c.mods.push(v);save();x.classList.toggle('lime',i<0);});
   $('#oad',b).onclick=()=>{const k=$('#osv',b).value.trim(),v=parseFloat(($('#ovl',b).value||'').replace(',','.'));if(!k){toast('Escreva o serviço','dark');return;}c.costs=c.costs||[];c.costs.unshift({t:Date.now(),v:v>0?v:0,k:'Oficina: '+k});save();$('#osv',b).value='';$('#ovl',b).value='';toast('Serviço anotado nos gastos');};}},
 redraw(){const c=this.c,el=this.el;$('#pzs',el).innerHTML=stkHTML(c,1);$$('#pzs .stk',el).forEach(x=>x.classList.toggle('sel',+x.dataset.si===this.sel));},
 wire(){const el=this.el,box=$('#pzp',el),car=$('#pzc',el),c=this.c;let drag=null;
  const pt=e=>{const t=e.touches?e.touches[0]:e;const r=car.getBoundingClientRect();return[(t.clientX-r.left)/r.width*100,(t.clientY-r.top)/r.height*100];};
  const down=e=>{const s=e.target.closest('.stk');if(!s){if(this.sel!=null){this.sel=null;this.redraw();this.drawB();}return;}const i=+s.dataset.si;const p=pt(e);drag={i,dx:c.stk[i].x-p[0],dy:c.stk[i].y-p[1]};if(this.sel!==i){this.sel=i;this.redraw();if((this.t||'stk')==='stk')this.drawB();}e.preventDefault();};
  const move=e=>{if(!drag)return;const p=pt(e);const s=c.stk[drag.i];s.x=Math.max(0,Math.min(100,p[0]+drag.dx));s.y=Math.max(0,Math.min(100,p[1]+drag.dy));const n=$(`#pzs .stk[data-si="${drag.i}"]`,el);if(n){n.style.left=s.x+'%';n.style.top=s.y+'%';}e.preventDefault();};
  const up=()=>{if(drag){drag=null;save();}};
  box.addEventListener('touchstart',down,{passive:false});box.addEventListener('touchmove',move,{passive:false});box.addEventListener('touchend',up);
  box.addEventListener('mousedown',down);window.addEventListener('mousemove',move);window.addEventListener('mouseup',up);},
 on:{plus(){RL.paywall&&RL.paywall();}}};
/* ---------- PÁGINA DA CIDADE (toque na localização de um post) ---------- */
const GEO=S.cityGeo=S.cityGeo||{};
async function geocode(name){if(GEO[name])return GEO[name];const j=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(name)}`)).json();if(!j[0])return null;const pr=j[0].display_name.split(',').map(x=>x.trim());
  const g={p:[+j[0].lon,+j[0].lat],sub:pr.filter(x=>!/^\d/.test(x)&&x!=='Brasil'&&x!==name).slice(-2).join(' · ')};GEO[name]=g;save();return g;}
const cityOf=txt=>{const t=String(txt||'').trim();if(!t||/oculta|^cidade$|perto de você/i.test(t))return'';const parts=t.split('·').map(x=>x.trim()).filter(Boolean);return parts[parts.length-1].replace(/^.*→\s*/,'');};
document.addEventListener('click',e=>{const l=e.target.closest('.pmloc');if(!l)return;const name=cityOf(l.textContent);if(!name)return;e.stopPropagation();e.preventDefault();router.go('city',{name});},true);
function postsFor(name){const mine=C.allPosts().filter(p=>p.mine&&((p.city||'')===name||String(p.where||'').includes(name)));const home=(RL.myCity&&RL.myCity())===name;const out=[...mine];
  const seed=Math.floor(hsh(name)*5000);for(let i=0;out.length<30&&i<90;i++){const p=T.genPost(home?i:seed+i);if(home||hsh(name+p.id)<.6)out.push(p);}return out;}
const fitName=(el,name)=>{const box=$('.ttl',el);if(!box)return;const W=box.clientWidth||340;let fs=Math.min(96,Math.max(40,W/Math.max(4,name.length)*1.9));$$('.cyname,.cyghost',el).forEach(x=>x.style.fontSize=fs+'px');const n=$('.cyname',el);let k=0;while(n.scrollWidth>W&&k++<30){fs-=3;$$('.cyname,.cyghost',el).forEach(x=>x.style.fontSize=fs+'px');}};
SCREENS.city={tabbar:false,clear:false,
 html(p){const name=p.name;const t=this.t||'posts';
  return`<div class="cy" id="cy"><div class="cyh"><div id="cym"></div><div class="shade"></div>
   <div class="top"><button class="ib glass" data-back>${ic(I.back)}</button><span style="flex:1"></span><button class="ib glass" data-on="share" aria-label="Compartilhar">${ic(I.share,18)}</button></div>
   <div class="ttl"><div class="cyghost">${esc(name)}</div><div class="cyname">${esc(name)}</div><div class="cysub"><i></i><span id="cysub">Brasil</span></div></div>
   <div class="acts"><button class="pri" data-on="chat">${ic('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/>',17)}Chat da cidade</button><button data-on="mapa">${ic(I.map,17)}Ver no mapa</button></div></div>
   <div class="cystats" id="cys"><div><b id="cs1">—</b><span>posts</span></div><div><b id="cs2">—</b><span>pilotos</span></div><div><b id="cs3">—</b><span>semáforos</span></div><div><b id="cs4">—</b><span>radares</span></div></div>
   <div class="cytabs" id="cyt">${[['posts','Recentes'],['ev','Eventos'],['ppl','Pilotos'],['via','Na via']].map(([k,n])=>`<button data-t="${k}" class="${t===k?'on':''}">${n}</button>`).join('')}</div><div id="cyb"></div></div>`;},
 async mount(el,p){const name=p.name;fitName(el,name);setTimeout(()=>fitName(el,name),600);this.posts=postsFor(name);$('#cs1',el).textContent=this.posts.length;
  const ppl=T.people().filter(w=>hsh(name+w.h)<.45);this.ppl=ppl;$('#cs2',el).textContent=ppl.length;
  $$('#cyt [data-t]',el).forEach(b=>b.onclick=()=>{this.t=b.dataset.t;$$('#cyt [data-t]',el).forEach(x=>x.classList.toggle('on',x===b));this.body();});this.body();
  try{const g=await geocode(name);if(!g)return;this.g=g;$('#cysub',el).textContent=g.sub||'Brasil';const W=el.clientWidth||400,d=.045;
   $('#cym',el).innerHTML=RL.staticMap?RL.staticMap([[g.p[0]-d,g.p[1]-d*.7],[g.p[0]+d,g.p[1]+d*.7]],W,380,{noRoute:true,maxZ:14,pad:0}):'';
   if(RL.osmLoad){await RL.osmLoad(g.p[0]-.06,g.p[1]-.06,g.p[0]+.06,g.p[1]+.06,4);let s=0,r=0;for(const n of RL.osmNodes().values()){if(Math.abs(n.p[0]-g.p[0])>.06||Math.abs(n.p[1]-g.p[1])>.06)continue;if(n.k==='signal')s++;else if(n.k==='radar')r++;}$('#cs3',el).textContent=s;$('#cs4',el).textContent=r;if(this.t==='via')this.body();}}catch(e){}},
 body(){const el=this.el,b=$('#cyb',el),t=this.t||'posts';
  if(t==='posts'){b.innerHTML=`<div class="cygrid">${this.posts.map((p,i)=>{let inner='',k='';
    if(p.media&&p.media[0]){const m=p.media[0];inner=m.type==='video'?`<video data-mk="${m.k}" muted playsinline preload="metadata"></video>`:`<img data-mk="${m.k}" alt="">`;if(p.media.length>1)k=ic('<rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/>',16);if(m.type==='video')k=ic(I.play,15);}
    else if(p.kind==='video'&&p.vid){inner=`<video src="${esc(typeof p.vid==='string'?p.vid:p.vid.src)}#t=1" muted playsinline preload="metadata"></video>`;k=ic(I.play,15);}
    else if(p.kind==='photo'){inner=RL.picTag(p.model||'',p.id+':0');if((p.nph||1)>1)k=ic('<rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/>',16);}
    else inner=`<div class="cyride"><b>+${p.hex||0}</b><span class="small muted b">hex · ${p.km||0} km</span></div>`;
    return`<button data-i="${i}">${inner}${k?`<span class="cyk">${k}</span>`:''}<span class="cyb">${ic(I.horn,13,2)}${p.horn||0}</span></button>`;}).join('')}</div><div style="height:110px"></div>`;
   (async()=>{for(const x of $$('[data-mk]',b)){try{const d=await new Promise((ok,no)=>{const r=indexedDB.open('role-media',1);r.onsuccess=()=>ok(r.result);r.onerror=no;});const bl=await new Promise(ok=>{const q=d.transaction('m').objectStore('m').get(x.dataset.mk);q.onsuccess=()=>ok(q.result);q.onerror=()=>ok(null);});if(bl)x.src=URL.createObjectURL(bl);}catch(e){}}})();
   $$('[data-i]',b).forEach(x=>x.onclick=()=>router.go('cityFeed',{name:this.params.name,i:+x.dataset.i}));}
  if(t==='ev'){const g=this.g;const ev=(RL.evAll?RL.evAll():[]).filter(e=>g&&dist(g.p,e.p)<30000).sort((a,b)=>a.t-b.t);
   b.innerHTML=`<div class="cylist">${ev.length?ev.map(e=>{const d=new Date(e.t);return`<button class="card row press" data-ev="${e.id}" style="width:100%;text-align:left;margin-bottom:8px;gap:12px"><div style="width:52px;text-align:center;flex-shrink:0"><div style="font-family:Anton,Oswald,sans-serif;font-size:28px;line-height:1">${d.getDate()}</div><div class="small muted b">${['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][d.getMonth()]}</div></div><div style="flex:1;min-width:0"><div class="b">${esc(e.title)}</div><div class="small muted">${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} · ${e.going||0} vão</div></div></button>`;}).join(''):`<div class="card empty">Nenhum evento marcado por aqui ainda.<br><br><button class="btn sm" data-go="eventNew">Criar evento</button></div>`}</div>`;
   $$('[data-ev]',b).forEach(x=>x.onclick=()=>router.go('event',{id:x.dataset.ev}));}
  if(t==='ppl'){b.innerHTML=`<div class="cylist"><div class="card list" style="padding:2px 12px">${this.ppl.slice(0,40).map(w=>`<button class="row press" data-h="${esc(w.h)}" style="width:100%;text-align:left;padding:10px 0;gap:12px">${RL.avatar2(w,44)}<div style="flex:1;min-width:0"><div class="b">${esc(w.n)}</div><div class="small muted">@${esc(w.h)}${w.car?' · '+esc(w.car):''}</div></div>${w.crew?`<span class="small b" style="color:${(C.CREWS[w.crew]||{}).c||'var(--tx3)'}">${esc(w.crew)}</span>`:''}</button>`).join('')}</div></div>`;
   $$('[data-h]',b).forEach(x=>x.onclick=()=>router.go('person',{h:x.dataset.h}));}
  if(t==='via'){const g=this.g;let s=0,r=0,stp=0,f=0;if(g&&RL.osmNodes){for(const n of RL.osmNodes().values()){if(Math.abs(n.p[0]-g.p[0])>.06||Math.abs(n.p[1]-g.p[1])>.06)continue;if(n.k==='signal')s++;else if(n.k==='radar')r++;else if(n.k==='stop')stp++;}for(const x of RL.osmStations().values())if(Math.abs(x.p[0]-g.p[0])<.06&&Math.abs(x.p[1]-g.p[1])<.06)f++;}
   b.innerHTML=`<div class="cylist"><div class="cystats" style="padding:0;grid-template-columns:repeat(2,1fr)"><div><b>${f}</b><span>postos</span></div><div><b>${r}</b><span>radares</span></div><div><b>${s}</b><span>semáforos</span></div><div><b>${stp}</b><span>placas de PARE</span></div></div>
    <div class="pz-note" style="margin-top:12px">Dados do OpenStreetMap e da ANTT. Faltou algo? No mapa, toque no botão laranja de alerta e use "Falta algo no mapa?".</div><button class="btn sec" data-on="mapa" style="margin-top:12px">${ic(I.map,18)}Ver tudo no mapa</button></div>`;}},
 on:{chat(){const g=this.g;if(g){SCREENS.chat.ctr=g.p;SCREENS.chat.cname=this.params.name;}router.go('chat');},
  mapa(){const g=this.g;router.tabTo('map');if(g)setTimeout(()=>{const m=RL.getMap();m&&m.flyTo({center:g.p,zoom:14,pitch:30,duration:900});},500);},
  async share(){const txt=`${this.params.name} no Rolê`;try{if(navigator.share)await navigator.share({title:txt,url:location.href.split('#')[0]});else{await navigator.clipboard.writeText(txt);toast('Copiado');}}catch(e){}}}};
/* feed em tela cheia só com os posts da cidade */
SCREENS.cityFeed={tabbar:false,
 html(p){return`<div class="ttwrap"><div class="tt" id="tt"></div><div class="tthdr"><button class="ib glass" data-back>${ic(I.back)}</button><div class="b" style="font-family:Anton,Oswald,sans-serif;font-size:22px;letter-spacing:.5px;text-transform:uppercase;flex:1">${esc(p.name)}</div></div></div>`;},
 mount(el,p){const list=postsFor(p.name);const tt=$('#tt',el);const it=RL.feedItem||(x=>T.ttItem(x));tt.innerHTML=list.map(it).join('');RL.feedWire&&RL.feedWire(tt);requestAnimationFrame(()=>{const s=tt.children[p.i||0];if(s)tt.scrollTop=s.offsetTop;});},
 on:{...C.postHandlers}};
})();
