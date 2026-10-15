/* Rolê — parte 2: garagem, fotos do carro, recorte de fundo, estúdio de visual, marcador no mapa */
(()=>{'use strict';
const RL=window.__role;if(!RL)return;
const {S,SCREENS,save,toast,ic,I,esc,$,$$,activeCar,rebuildCar,fmtKm,router}=RL;
/* ---------- estilos ---------- */
const st=document.createElement('style');st.textContent=`
.gtiles{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.gtile{border-radius:18px;background:#141513;border:1px solid var(--line);padding:10px;text-align:left;display:block;width:100%}
.chk{background:repeating-conic-gradient(#1c1d1a 0 25%,#151614 0 50%) 0 0/16px 16px}
.gtile .im{height:92px;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.gtile .im img{max-width:100%;max-height:100%;object-fit:contain}
.stage{position:relative;aspect-ratio:4/3;border-radius:22px;overflow:hidden;border:1px solid var(--line2);display:flex;align-items:center;justify-content:center}
.stage canvas{max-width:100%;max-height:100%;display:block}
.stage.blurmode{border-color:#FF6A3D;box-shadow:0 0 0 2px rgba(255,106,61,.4)}
.guide{position:absolute;inset:16% 12% 14%;border:2px dashed rgba(198,244,50,.55);border-radius:34px 34px 14px 14px;pointer-events:none}
.guide:after{content:'placa';position:absolute;left:50%;bottom:22%;transform:translateX(-50%);width:26%;height:12%;border:1.5px dashed rgba(198,244,50,.45);border-radius:6px;font-size:10px;color:rgba(198,244,50,.6);display:flex;align-items:center;justify-content:center}
.mkprev{position:relative;height:160px;border-radius:18px;overflow:hidden;background:#121311}
.mkgrid{position:absolute;inset:-60px;background:repeating-linear-gradient(28deg,transparent 0 52px,#24251f 52px 62px),repeating-linear-gradient(-62deg,transparent 0 84px,#24251f 84px 94px)}
.mkprev .carmk{position:absolute;left:50%;top:50%;transform:translate(-50%,-55%)}
.swrow{display:flex;gap:10px;overflow-x:auto;padding:6px 2px 8px;scrollbar-width:none}
.swrow::-webkit-scrollbar{display:none}
.sw{width:38px;height:38px;border-radius:99px;border:2px solid rgba(255,255,255,.16);flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--tx3)}
.sw.on{outline:2px solid var(--lime);outline-offset:3px}
.rg{width:100%;accent-color:#C6F432;height:28px}
.pgbar{height:4px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:10px}
.pgbar i{display:block;height:4px;width:0;background:var(--lime);transition:width .2s}
.carmk .g{background:radial-gradient(closest-side,var(--glow,rgba(198,244,50,.6)),rgba(0,0,0,0))!important}
.plat:before{border-color:var(--glowB,rgba(198,244,50,.35))!important;box-shadow:0 0 40px var(--glowS,rgba(198,244,50,.18)),inset 0 0 30px var(--glowS,rgba(198,244,50,.12))!important}
`;document.head.appendChild(st);
/* ---------- util ---------- */
const hexRgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function setGlow(h){const r=document.documentElement.style;if(!h){['--glow','--glowB','--glowS'].forEach(p=>r.removeProperty(p));return;}const[a,b,c]=hexRgb(h);r.setProperty('--glow',`rgba(${a},${b},${c},.65)`);r.setProperty('--glowB',`rgba(${a},${b},${c},.45)`);r.setProperty('--glowS',`rgba(${a},${b},${c},.22)`);}
setGlow(activeCar()&&activeCar().glow);
const loadImg=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src;});
function toCanvas(img,max=1100){const k=Math.min(1,max/Math.max(img.naturalWidth||img.width,img.naturalHeight||img.height));const c=document.createElement('canvas');c.width=Math.round((img.naturalWidth||img.width)*k);c.height=Math.round((img.naturalHeight||img.height)*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);return c;}
function cloneC(c){const d=document.createElement('canvas');d.width=c.width;d.height=c.height;d.getContext('2d').drawImage(c,0,0);return d;}
function trimAlpha(c,pad=6){const x=c.getContext('2d'),{width:w,height:h}=c,d=x.getImageData(0,0,w,h).data;let x0=w,y0=h,x1=-1,y1=-1;
  for(let y=0;y<h;y++)for(let i=0;i<w;i++)if(d[(y*w+i)*4+3]>16){if(i<x0)x0=i;if(i>x1)x1=i;if(y<y0)y0=y;if(y>y1)y1=y;}
  if(x1<0)return c;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(w-1,x1+pad);y1=Math.min(h-1,y1+pad);const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,x0,y0,o.width,o.height,0,0,o.width,o.height);return o;}
function toData(c,max=560){const k=Math.min(1,max/Math.max(c.width,c.height));const o=document.createElement('canvas');o.width=Math.round(c.width*k);o.height=Math.round(c.height*k);const x=o.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,o.width,o.height);let u=o.toDataURL('image/webp',.86);if(!u.startsWith('data:image/webp'))u=o.toDataURL('image/png');return u;}
function pixelate(c,r){const x=c.getContext('2d');const rx=Math.round(r.x*c.width),ry=Math.round(r.y*c.height),rw=Math.max(4,Math.round(r.w*c.width)),rh=Math.max(4,Math.round(r.h*c.height));
  const t=document.createElement('canvas');t.width=Math.max(2,Math.round(rw/14));t.height=Math.max(2,Math.round(rh/14));const tx=t.getContext('2d');tx.drawImage(c,rx,ry,rw,rh,0,0,t.width,t.height);
  x.save();x.beginPath();x.rect(rx,ry,rw,rh);x.clip();x.imageSmoothingEnabled=false;x.drawImage(t,0,0,t.width,t.height,rx,ry,rw,rh);x.restore();}
/* recorte de fundo (IA no aparelho, carregada sob demanda) */
let bgLib=null;
async function removeBg(c,onP){if(!bgLib)bgLib=await import('https://esm.sh/@imgly/background-removal@1.4.5');
  const fn=bgLib.removeBackground||bgLib.default;const blob=await new Promise(r=>c.toBlob(r,'image/png'));
  const small=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||(navigator.deviceMemory||8)<=4;const out=await Promise.race([fn(blob,{model:small?'small':'medium',progress:(k,cur,tot)=>onP&&onP(k,cur,tot),output:{format:'image/png'}}),new Promise((_,no)=>setTimeout(()=>no(new Error('demorou demais')),120000))]);
  const u=URL.createObjectURL(out);const img=await loadImg(u);URL.revokeObjectURL(u);const o=document.createElement('canvas');o.width=c.width;o.height=c.height;o.getContext('2d').drawImage(img,0,0,o.width,o.height);return o;}
/* estúdio: pintura por luminância + brilho/contraste */
const sm=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t);};
function styleCanvas(src,s){const c=cloneC(src);if(!s)return c;const x=c.getContext('2d'),im=x.getImageData(0,0,c.width,c.height),d=im.data;
  const t=s.paint?hexRgb(s.paint):null,amt=(s.amt??80)/100,bf=(s.bright||0)*2.2,cf=1+(s.contrast||0)/100;
  for(let i=0;i<d.length;i+=4){if(d[i+3]===0)continue;let r=d[i],g=d[i+1],b=d[i+2];
    if(t){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(.299*r+.587*g+.114*b)/255,sat=(mx-mn)/255;
      const w=sm(.16,.4,l)*(1-sm(.88,1,l)*.6)*(1-sm(.35,.7,sat)*.3)*amt;
      if(w>0){const k=.35+l*1.1;r+=(Math.min(255,t[0]*k)-r)*w;g+=(Math.min(255,t[1]*k)-g)*w;b+=(Math.min(255,t[2]*k)-b)*w;}}
    if(bf||cf!==1){r=(r-128)*cf+128+bf;g=(g-128)*cf+128+bf;b=(b-128)*cf+128+bf;}
    d[i]=r<0?0:r>255?255:r;d[i+1]=g<0?0:g>255?255:g;d[i+2]=b<0?0:b>255?255:b;}
  x.putImageData(im,0,0);return c;}
async function styled(url,s){if(!url)return url;if(!s||(!s.paint&&!s.bright&&!s.contrast))return url;const c=toCanvas(await loadImg(url),900);return toData(styleCanvas(c,s));}
const carById=id=>S.cars.find(c=>c.id===id);
function markerHTML(c,mode){const m=mode||S.settings.marker;
  if(m==='arrow'||!c||!c.rear)return'<div class="g"></div><svg width="40" height="46" viewBox="0 0 40 46"><path d="M20 3 L36 41 L20 32 L4 41 Z" fill="#fff" stroke="#C6F432" stroke-width="2.5" stroke-linejoin="round"/></svg>';
  if(c.rearCut===false)return`<div class="g"></div><div class="ph"><img src="${c.rear}"></div>`;return`<div class="g"></div><img src="${c.rear}">`;}
const COLORS=[['Original',null],['Preto','#1B1C1E'],['Branco','#F1F1EE'],['Prata','#B9BDC2'],['Grafite','#5A5E63'],['Vermelho','#D7263D'],['Azul','#2563EB'],['Lima','#C6F432'],['Laranja','#FF7A1A'],['Amarelo','#FACC15'],['Verde','#10A37F'],['Roxo','#8B5CF6'],['Rosa','#EC4899']];
const GLOWS=[['Sem',null],['Lima','#C6F432'],['Ciano','#22D3EE'],['Rosa','#F472B6'],['Laranja','#FB923C'],['Roxo','#A78BFA'],['Branco','#FFFFFF']];
/* ---------- GARAGEM ---------- */
SCREENS.garage={tab:'garage',
 html(){const c=activeCar();if(!c)return`<div class="hdr"><h1>Garagem</h1></div><div class="scroll"><div class="card empty">Nenhum veículo ainda.<br><br><button class="btn" data-go="carForm">Adicionar veículo</button></div></div>`;
  const rides=S.rides.filter(r=>r.car===c.model);const km=rides.reduce((a,r)=>a+r.dist,0);
  return`<div class="hdr"><h1>Garagem</h1><button class="ib" data-go="carForm" aria-label="Adicionar veículo">${ic(I.plus)}</button></div><div class="scroll">
  ${S.cars.length>1?`<div class="chips" style="margin-bottom:6px">${S.cars.map(x=>`<button class="chip ${x.id===c.id?'lime':''}" data-on="pick" data-id="${x.id}">${ic(x.type==='moto'?I.flag:I.car,14)}${esc(x.model.split(' ').slice(0,2).join(' '))}</button>`).join('')}</div>`:''}
  <div class="plat">${c.front?`<img src="${c.front}" alt="">`:`<div style="position:relative;width:66%;margin-bottom:26px">${RL.silh?RL.silh(c.type):'Sem foto ainda'}</div>`}</div>
  <div class="row" style="margin:10px 4px 0;align-items:flex-end"><div style="flex:1"><div class="small muted">${esc(c.year||'')}${c.color?' · '+esc(c.color):''}${c.type==='moto'?' · moto':''}</div><div style="font-size:32px;font-weight:800;letter-spacing:-.8px;line-height:1.1">${esc(c.model)}</div></div><button class="btn sm sec" data-go="carForm" data-p='${JSON.stringify({id:c.id})}'>Editar</button></div>
  <div class="card stat3" style="margin-top:14px;padding:14px 0"><div><b>${c.kml?String(c.kml).replace('.',','):'—'}</b><span>km/l</span></div><div><b>${fmtKm(km)}</b><span>km no Rolê</span></div><div><b>${rides.length}</b><span>rolês</span></div></div>
  <div class="sec-t">Fotos do seu ${c.type==='moto'?'veículo':'carro'}</div>
  <div class="gtiles">${[['front','Frente','vitrine e perfil'],['rear','Traseira','aparece no mapa']].map(([k,t,s])=>`<button class="gtile press" data-go="photo" data-p='${JSON.stringify({id:c.id,slot:k})}'><div class="im chk">${c[k]?`<img src="${c[k]}" alt="">`:ic(I.cam,26)}</div><div class="b" style="margin-top:8px;font-size:14px">${t}</div><div class="small muted">${c[k]?s:'Toque pra tirar a foto'}</div></button>`).join('')}</div>
  <button class="card row press" data-go="studio" style="width:100%;text-align:left;margin-top:12px"><span class="ib" style="width:44px;height:44px;color:var(--lime2)">${ic('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>',20)}</span><div style="flex:1"><div class="b">Estúdio de visual</div><div class="small muted">Cor da pintura, brilho e neon embaixo</div></div>${ic(I.back,18).replace('<svg','<svg style="transform:rotate(180deg)"')}</button>
  <div class="sec-t">Seu ${c.type==='moto'?'veículo':'carro'} no mapa</div>
  <div class="mkprev"><div class="mkgrid"></div><div class="carmk" id="mkPrev">${markerHTML(c)}</div></div>
  <div class="card list" style="margin-top:10px">${[['photo','Foto da traseira','Seu carro de verdade no mapa'],['arrow','Seta padrão','Simples, vem pronta']].map(x=>`<div class="row" data-on="marker" data-m="${x[0]}" style="padding:10px 0"><div style="flex:1"><div class="b">${x[1]}</div><div class="small muted">${x[2]}</div></div><span class="switch ${S.settings.marker===x[0]?'on':''}"></span></div>`).join('')}</div>
  ${S.cars.length>1?`<button class="btn danger" data-on="del" style="margin-top:18px">Remover ${esc(c.model)}</button>`:''}
  </div>`;},
 on:{pick(a){S.cars.forEach(x=>x.active=x.id===a.dataset.id);save();setGlow(activeCar().glow);rebuildCar();router.tabTo('garage');},
  marker(a){S.settings.marker=a.dataset.m;save();$$('[data-on="marker"] .switch').forEach(s=>s.classList.toggle('on',s.parentElement===a));$('#mkPrev').innerHTML=markerHTML(activeCar());rebuildCar();toast(a.dataset.m==='arrow'?'Seta no mapa':'Foto da traseira no mapa');},
  del(){const c=activeCar();if(!confirm(`Remover ${c.model} da garagem?`))return;S.cars=S.cars.filter(x=>x!==c);S.cars[0].active=true;save();setGlow(activeCar().glow);rebuildCar();router.tabTo('garage');}}};
/* ---------- CADASTRO ---------- */
SCREENS.carForm={tabbar:false,
 html(p){const c=p.id?carById(p.id):null;const v=k=>esc(c&&c[k]!=null?c[k]:'');const moto=c&&c.type==='moto';
  return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>${c?'Editar veículo':'Novo veículo'}</h2></div><div class="scroll">
  <div class="seg" id="tp"><button data-t="car" class="${moto?'':'on'}">Carro</button><button data-t="moto" class="${moto?'on':''}">Moto</button></div>
  <label class="f">Modelo</label><input class="inp" id="fm" value="${v('model')}" placeholder="Ex.: Onix 1.0, Gol 1.6, CG 160">
  <div class="row" style="gap:10px;align-items:flex-start"><div style="flex:1"><label class="f">Ano</label><input class="inp" id="fy" inputmode="numeric" maxlength="4" value="${v('year')}" placeholder="2015"></div><div style="flex:1"><label class="f">Cor</label><input class="inp" id="fc" value="${v('color')}" placeholder="Prata"></div></div>
  <div class="row" style="gap:10px;align-items:flex-start"><div style="flex:1"><label class="f">Consumo médio (km/l)</label><input class="inp" id="fk" inputmode="decimal" value="${c&&c.kml?String(c.kml).replace('.',','):''}" placeholder="12,5"></div><div style="flex:1"><label class="f">Quilometragem</label><input class="inp" id="fo" inputmode="numeric" value="${v('km')}" placeholder="62000"></div></div>
  <div class="small muted" style="margin:14px 4px 0;line-height:1.45">${c?'As fotos você troca direto na garagem.':'Depois de salvar, você tira a foto da traseira (vai pro mapa) e da frente (vitrine).'}</div>
  <button class="btn" data-on="save" style="margin-top:20px">${c?'Salvar':'Continuar pras fotos'}</button></div>`;},
 mount(el){$$('#tp button',el).forEach(b=>b.onclick=()=>$$('#tp button',el).forEach(x=>x.classList.toggle('on',x===b)));},
 on:{save(){const el=this.el,model=$('#fm',el).value.trim();if(model.length<2){toast('Coloque o modelo','dark');$('#fm',el).focus();return;}
  const kml=parseFloat(($('#fk',el).value||'').replace(',','.'))||null,year=parseInt($('#fy',el).value)||'',km=parseInt(($('#fo',el).value||'').replace(/\D/g,''))||null;
  const type=$('#tp .on',el).dataset.t;let c=this.params.id?carById(this.params.id):null;
  if(c){Object.assign(c,{model,year,kml,km,type,color:$('#fc',el).value.trim()});save();rebuildCar();toast('Salvo');router.tabTo('garage');return;}
  c={id:'c'+Date.now(),model,year,kml,km,type,color:$('#fc',el).value.trim(),front:null,rear:null,active:true};S.cars.forEach(x=>x.active=false);S.cars.push(c);save();setGlow(null);rebuildCar();
  router.go('photo',{id:c.id,slot:'rear',then:'front',fresh:true},{root:true});}}};
/* ---------- FOTO (tirar, recortar, borrar placa) ---------- */
SCREENS.photo={tabbar:false,
 html(p){const c=carById(p.id),rear=p.slot==='rear';
  return`<div class="hdr"><button class="ib" data-on="bk">${ic(I.back)}</button><h2>${rear?'Foto da traseira':'Foto da frente'}</h2>${p.fresh&&!rear?'':''}<span class="small muted">${p.then?'1 de 2':p.fresh?'2 de 2':''}</span></div><div class="scroll">
  <div class="stage chk" id="stg"><div class="guide" id="gd"></div><canvas id="cv" style="display:none"></canvas>
   <div id="ph0" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:20px;text-align:center">${c&&c[p.slot]?`<img src="${c[p.slot]}" style="max-width:70%;max-height:55%;object-fit:contain;opacity:.55">`:ic(I.cam,34)}<div class="small muted" style="max-width:240px">${rear?'Fique uns 3 metros atrás do carro, na altura da placa, e enquadre a traseira inteira':'Fique de frente pro carro, um pouco de lado, e enquadre o carro inteiro'}</div></div></div>
  <div id="pgw" style="display:none"><div class="small muted" id="pg" style="margin:10px 4px 0">Preparando…</div><div class="pgbar"><i id="pgb"></i></div></div>
  <div class="row" id="pick" style="gap:10px;margin-top:14px"><button class="btn" data-on="cam" style="flex:1">${ic(I.cam,18)}Tirar foto</button><button class="btn sec" data-on="gal" style="flex:1">Galeria</button></div>
  <div id="tools" style="display:none"><div class="chips" style="margin-top:14px"><button class="chip lime" data-on="bg" id="bgB">✦ Remover fundo</button><button class="chip" data-on="blur" id="blB">Borrar placa</button><button class="chip" data-on="lasso" id="laB">Recorte manual</button><button class="chip" data-on="undo">Desfazer</button><button class="chip" data-on="gal">Trocar</button></div>
   <div class="small muted" id="tip" style="margin:10px 4px 0;line-height:1.45">Remova o fundo pra seu carro aparecer recortado no mapa. Depois toque em “Borrar placa” e toque em cima dela.</div>
   <button class="btn" data-on="save" style="margin-top:16px">Salvar foto</button></div>
  ${p.then||p.fresh?`<button class="btn sec" data-on="skip" style="margin-top:12px">Pular por agora</button>`:''}
  <input type="file" accept="image/*" capture="environment" id="fCam" hidden><input type="file" accept="image/*" id="fGal" hidden></div>`;},
 mount(el){this.hist=[];const onFile=async f=>{if(!f)return;try{const u=URL.createObjectURL(f);const img=await loadImg(u);URL.revokeObjectURL(u);this.src=toCanvas(img);this.cut=null;this.blurs=[];this.hist=[];this.show();}catch(e){toast('Não consegui abrir essa imagem','dark');}};
  $('#fCam',el).onchange=e=>onFile(e.target.files[0]);$('#fGal',el).onchange=e=>onFile(e.target.files[0]);
  $('#cv',el).addEventListener('click',e=>{if(!this.blurMode)return;const r=e.target.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
   this.hist.push({cut:this.cut,blurs:this.blurs.slice()});this.blurs.push({x:Math.max(0,x-.14),y:Math.max(0,y-.06),w:.28,h:.12});this.render();this.setBlur(false);toast('Placa borrada');});
  const cv=$('#cv',el),pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*cv.width,(e.clientY-r.top)/r.height*cv.height];};
  cv.addEventListener('pointerdown',e=>{if(!this.lassoMode)return;e.preventDefault();cv.setPointerCapture(e.pointerId);this.pts=[pt(e)];});
  cv.addEventListener('pointermove',e=>{if(!this.pts)return;this.pts.push(pt(e));const x=cv.getContext('2d');x.strokeStyle='#C6F432';x.lineWidth=Math.max(3,cv.width/150);x.lineCap='round';x.beginPath();const a=this.pts[this.pts.length-2],b=this.pts[this.pts.length-1];x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();});
  cv.addEventListener('pointerup',()=>{const P=this.pts;this.pts=null;if(!P)return;this.setLasso(false);if(P.length<12){this.render();toast('Contorno muito curto','dark');return;}const base=this.cut||this.src,o=document.createElement('canvas');o.width=base.width;o.height=base.height;const x=o.getContext('2d');x.beginPath();P.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.clip();x.drawImage(base,0,0);this.hist.push({cut:this.cut,blurs:this.blurs.slice()});this.cut=o;this.render();toast('Recortado');});},
 show(){const el=this.el;$('#ph0',el).style.display='none';$('#gd',el).style.display='none';$('#cv',el).style.display='block';$('#pick',el).style.display='none';$('#tools',el).style.display='block';this.render();},
 work(){const c=cloneC(this.cut||this.src);this.blurs.forEach(b=>pixelate(c,b));return c;},
 render(){const cv=$('#cv',this.el),w=this.work();cv.width=w.width;cv.height=w.height;cv.getContext('2d').drawImage(w,0,0);$('#bgB',this.el).classList.toggle('lime',!this.cut);},
 setLasso(on){this.lassoMode=on;$('#cv',this.el).style.touchAction=on?'none':'';$('#laB',this.el).classList.toggle('lime',on);$('#stg',this.el).classList.toggle('blurmode',on);},
 setBlur(on){this.blurMode=on;$('#stg',this.el).classList.toggle('blurmode',on);$('#blB',this.el).classList.toggle('lime',on);},
 on:{bk(){router.stack.length>1?router.back():router.tabTo('garage');},cam(){$('#fCam',this.el).click();},gal(){$('#fGal',this.el).click();},
  lasso(){this.setBlur(false);this.setLasso(!this.lassoMode);if(this.lassoMode)toast('Contorne o carro com o dedo, sem soltar','dark');},
  blur(){this.setLasso(false);this.setBlur(!this.blurMode);if(this.blurMode)toast('Toque em cima da placa','dark');},
  undo(){const h=this.hist.pop();if(!h){toast('Nada pra desfazer','dark');return;}this.cut=h.cut;this.blurs=h.blurs;this.render();},
  skip(){const p=this.params;p.then?router.go('photo',{id:p.id,slot:p.then,fresh:true},{root:true}):router.tabTo('garage');},
  async bg(a){if(this.cut||this.busy)return;this.busy=true;const el=this.el,pg=$('#pg',el),pb=$('#pgb',el);$('#pgw',el).style.display='block';a.textContent='Recortando…';
   const t0=Date.now();try{const out=await removeBg(this.src,(k,cur,tot)=>{const f=tot?cur/tot:0;pg.textContent=k.startsWith('fetch')?`Baixando a IA de recorte (só na 1ª vez) · ${Math.round(f*100)}%`:'Recortando seu carro…';pb.style.width=Math.round((k.startsWith('fetch')?f*.8:.9)*100)+'%';});
    this.hist.push({cut:this.cut,blurs:this.blurs.slice()});this.cut=out;this.render();pb.style.width='100%';pg.textContent=`Fundo removido em ${((Date.now()-t0)/1000).toFixed(1)} s`;toast('Fundo removido');}
   catch(e){console.error(e);bgLib=null;pb.style.width='0';pg.textContent='A IA não rodou neste aparelho ('+String(e&&e.message||e).slice(0,80)+'). Use o Recorte manual: contorne o carro com o dedo.';toast('IA de recorte falhou. Tente o recorte manual','dark');}
   a.textContent='✦ Remover fundo';this.busy=false;},
  async save(a){if(!this.src)return;const p=this.params,c=carById(p.id);if(!c)return;a.disabled=true;a.textContent='Salvando…';
   let w=this.work();if(this.cut)w=trimAlpha(w);const url=toData(w);c[p.slot+'Orig']=url;c[p.slot+'Cut']=!!this.cut;c[p.slot]=await styled(url,c.style);
   if(p.slot==='rear'&&this.cut)S.settings.marker='photo';save();rebuildCar();toast(p.slot==='rear'?'Traseira salva · já aparece no mapa':'Foto da frente salva');
   p.then?router.go('photo',{id:p.id,slot:p.then,fresh:true},{root:true}):router.tabTo('garage');}}};
/* ---------- ESTÚDIO ---------- */
SCREENS.studio={tabbar:false,
 html(){const c=activeCar(),s=c.style||{};return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Estúdio de visual</h2><button class="btn sm sec" data-on="reset">Original</button></div><div class="scroll">
  <div class="plat"><img id="pv" src="${c.frontOrig||c.front||''}" alt=""></div>
  <div class="sec-t">Cor da pintura</div><div class="swrow" id="pc">${COLORS.map(([n,h])=>`<button class="sw ${(s.paint||null)===h?'on':''}" data-c="${h||''}" title="${n}" aria-label="${n}" style="background:${h||'transparent'}">${h?'':ic(I.x,16)}</button>`).join('')}</div>
  <label class="f">Intensidade da cor</label><input type="range" class="rg" id="sa" min="20" max="100" value="${s.amt??80}">
  <div class="row" style="gap:14px"><div style="flex:1"><label class="f">Brilho</label><input type="range" class="rg" id="sb" min="-30" max="30" value="${s.bright||0}"></div><div style="flex:1"><label class="f">Contraste</label><input type="range" class="rg" id="sc" min="-30" max="30" value="${s.contrast||0}"></div></div>
  <div class="sec-t">Neon embaixo <span class="small muted" style="font-weight:600">aparece no mapa</span></div><div class="swrow" id="gc">${GLOWS.map(([n,h])=>`<button class="sw ${(c.glow||null)===h?'on':''}" data-c="${h||''}" title="${n}" aria-label="${n}" style="${h?`background:radial-gradient(circle,${h} 0 35%,transparent 70%);border-color:${h}`:''}">${h?'':ic(I.x,16)}</button>`).join('')}</div>
  <div class="card row" style="margin-top:16px;align-items:flex-start"><span style="color:var(--lime2);font-size:18px;line-height:1">✦</span><div class="small muted" style="line-height:1.45;flex:1"><b style="color:var(--tx)">Rodas, aerofólio, rebaixar e envelopar com IA</b><br>Entra quando o app tiver servidor. Aqui a edição é feita no próprio celular.</div></div>
  <button class="btn" data-on="apply" style="margin-top:18px">Aplicar no meu carro</button></div>`;},
 async mount(el){const c=activeCar();c.frontOrig=c.frontOrig||c.front;c.rearOrig=c.rearOrig||c.rear;this.s={...(c.style||{amt:80})};this.glow=c.glow||null;
  if(c.frontOrig){try{this.base=toCanvas(await loadImg(c.frontOrig),560);}catch(e){}}this.prev();
  const bind=(id,k)=>$('#'+id,el).addEventListener('input',e=>{this.s[k]=+e.target.value;this.prev();});bind('sa','amt');bind('sb','bright');bind('sc','contrast');
  $$('#pc .sw',el).forEach(b=>b.onclick=()=>{$$('#pc .sw',el).forEach(x=>x.classList.toggle('on',x===b));this.s.paint=b.dataset.c||null;this.prev();});
  $$('#gc .sw',el).forEach(b=>b.onclick=()=>{$$('#gc .sw',el).forEach(x=>x.classList.toggle('on',x===b));this.glow=b.dataset.c||null;setGlow(this.glow);});},
 prev(){if(!this.base)return;cancelAnimationFrame(this.raf);this.raf=requestAnimationFrame(()=>{const o=styleCanvas(this.base,this.s);$('#pv',this.el).src=o.toDataURL('image/png');});},
 leave(){const c=activeCar();if(c)setGlow(c.glow);},
 on:{reset(){this.s={amt:80};this.glow=null;setGlow(null);$$('.sw',this.el).forEach(x=>x.classList.toggle('on',!x.dataset.c));$('#sa',this.el).value=80;$('#sb',this.el).value=0;$('#sc',this.el).value=0;this.prev();},
  async apply(a){const c=activeCar();a.disabled=true;a.textContent='Aplicando…';const s=(this.s.paint||this.s.bright||this.s.contrast)?{...this.s}:null;
   c.style=s;c.glow=this.glow;c.front=await styled(c.frontOrig,s);c.rear=await styled(c.rearOrig,s);save();setGlow(c.glow);rebuildCar();toast('Visual aplicado · já aparece no mapa');router.tabTo('garage');}}};
})();
