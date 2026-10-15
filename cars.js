/* Rolê — catálogo de veículos, silhuetas, veículo destaque (foto de perfil), página do modelo, perfis com veículo em destaque */
(()=>{'use strict';
const RL=window.__role;if(!RL||!RL.comm)return;
const {S,SCREENS,save,toast,sheet,ic,I,esc,$,$$,router,activeCar,rebuildCar,fmtKm,trackSVG,fmtT,ago}=RL;
const C=RL.comm;const {P,CREWS,FPOSTS,postCard,postHandlers,openProfile,ini,genTrack,rnd,follow,TROPHY,ME_G,G}=C;
const FREE=3;
const st=document.createElement('style');st.textContent=`
.carlink{color:var(--tx2);font-weight:700;text-decoration:underline;text-decoration-color:rgba(255,255,255,.28);text-underline-offset:2px}
.vhero{position:relative;border-radius:24px;overflow:hidden;background:radial-gradient(70% 80% at 50% 85%,var(--vc,rgba(198,244,50,.22)),transparent 70%),#121311;border:1px solid var(--line);padding:16px}
.vhero .pic{height:150px;display:flex;align-items:flex-end;justify-content:center}
.vhero .pic img{max-width:92%;max-height:150px;object-fit:contain;filter:drop-shadow(0 14px 14px rgba(0,0,0,.6))}
.vhero .pic svg{width:72%;max-height:130px}
.vbadge{position:absolute;left:14px;top:14px;height:24px;padding:0 10px;border-radius:99px;background:rgba(198,244,50,.16);border:1px solid rgba(198,244,50,.45);color:var(--lime2);font-size:11px;font-weight:800;display:flex;align-items:center;gap:5px}
.vmini{width:116px;flex-shrink:0;border-radius:16px;background:#141513;border:1px solid var(--line);padding:8px;text-align:left}
.vmini .im{height:54px;border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#1A1B18}
.vmini .im img{max-width:100%;max-height:100%;object-fit:contain}.vmini .im svg{width:78%}
.vmini.on{border-color:rgba(198,244,50,.6)}
.brands{display:flex;flex-wrap:wrap;gap:8px}
.pick{height:38px;padding:0 14px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid var(--line2);font-size:14px;font-weight:600;color:var(--tx2)}
.pick.on{background:var(--lime);color:#0A0B0A;border-color:var(--lime);font-weight:800}
select.inp{appearance:none;-webkit-appearance:none}
.plusc{border-radius:22px;padding:18px;background:linear-gradient(140deg,rgba(198,244,50,.18),rgba(198,244,50,.02) 60%),#121311;border:1px solid rgba(198,244,50,.4)}
`;document.head.appendChild(st);
/* ---------- catálogo ---------- */
const CARS={Chevrolet:'Onix,Onix Plus,Prisma,Celta,Corsa,Cobalt,Cruze,Tracker,Spin,Montana,S10,Equinox',Fiat:'Uno,Palio,Mobi,Argo,Cronos,Siena,Grand Siena,Strada,Toro,Pulse,Fastback,Fiorino,Doblò',Volkswagen:'Gol,Voyage,Fox,Up!,Polo,Virtus,Nivus,T-Cross,Taos,Saveiro,Jetta,Golf,Amarok',Ford:'Ka,Ka Sedan,Fiesta,Focus,EcoSport,Ranger,Territory,Bronco Sport',Toyota:'Corolla,Corolla Cross,Etios,Yaris,Hilux,SW4,RAV4',Honda:'Civic,City,Fit,HR-V,WR-V,ZR-V,CR-V',Hyundai:'HB20,HB20S,Creta,Tucson,ix35',Renault:'Kwid,Sandero,Logan,Duster,Oroch,Captur,Kardian',Nissan:'Kicks,Versa,March,Sentra,Frontier',Jeep:'Renegade,Compass,Commander',Peugeot:'208,2008,207,3008',Citroën:'C3,C3 Aircross,C4 Cactus,Basalt',Mitsubishi:'L200 Triton,Pajero,Outlander,ASX',BYD:'Dolphin,Dolphin Mini,Seal,Song Plus,King',Kia:'Sportage,Cerato,Picanto,Sorento'};
const MOTOS={Honda:'CG 160,Biz 125,Pop 110i,Bros 160,XRE 190,XRE 300,CB 300F Twister,CB 500X,CB 650R,PCX 160,Elite 125,Sahara 300,NC 750X',Yamaha:'Factor 150,Fazer 250,Lander 250,Crosser 150,MT-03,MT-07,NMax 160,XMax 250,R3,Neo 125',Suzuki:'V-Strom 650,GSX-S750,Burgman 125',Kawasaki:'Ninja 400,Z400,Versys 650,Z900',BMW:'G 310 GS,G 310 R,F 850 GS,R 1250 GS,S 1000 RR','Royal Enfield':'Meteor 350,Classic 350,Hunter 350,Himalayan',Triumph:'Tiger 900,Street Triple,Trident 660',Shineray:'Jet 50,XY 150',Haojue:'DK 150,NK 150'};
const split=o=>Object.fromEntries(Object.entries(o).map(([b,m])=>[b,m.split(',')]));
const CAT={car:split(CARS),moto:split(MOTOS)};
const ALL=[];for(const t of['moto','car'])for(const b in CAT[t])for(const m of CAT[t][b])ALL.push({t,b,m,k:b+' '+m});
ALL.sort((x,y)=>y.m.length-x.m.length);
function lookup(s){s=String(s||'').replace(/^VW\s/i,'Volkswagen ').trim();
  for(const e of ALL){if(s===e.k||s.startsWith(e.k+' '))return e;}
  for(const e of ALL){if(s===e.m||s.startsWith(e.m+' '))return e;}return null;}
const modelKey=s=>{const e=lookup(s);return e?e.k:String(s||'').split(' ').slice(0,2).join(' ');};
const isMoto=s=>{const e=lookup(s);return e?e.t==='moto':/moto/i.test(s||'');};
/* ---------- silhuetas (genéricas, pretas) ---------- */
const SIL={car:'<svg viewBox="0 0 120 50" fill="#0A0B0A"><path d="M8 36c0-5 3-8 8-9l18-3 12-11c3-2.5 6-3.5 10-3.5h26c4 0 7 1.5 9.5 4.5L100 24l8 2c4 1 6 4 6 8v3c0 1.5-1 2.5-2.5 2.5H104a10 10 0 0 0-20 0H38a10 10 0 0 0-20 0h-7.5C9 39.5 8 38.5 8 37z"/><path d="M50 14.5 42 24h54l-7-8.5c-1.2-1.1-2.6-1.7-4.2-1.7H55c-2 0-3.7 0-5 .7z" fill="rgba(255,255,255,.13)"/><circle cx="28" cy="39.5" r="8.5"/><circle cx="94" cy="39.5" r="8.5"/></svg>',
 moto:'<svg viewBox="0 0 120 64" fill="none" stroke="#0A0B0A" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="46" r="13" stroke-width="7"/><circle cx="96" cy="46" r="13" stroke-width="7"/><path d="M24 46 44 30h26l10-8h8l8 24" stroke-width="6"/><path d="M46 22c4-6 12-7 20-4l8 6H44z" fill="#0A0B0A" stroke-width="3"/><path d="M28 26h22l-4 5H32z" fill="#0A0B0A" stroke-width="3"/><path d="M84 9l6 13M80 9h10" stroke-width="5"/></svg>'};
const silh=t=>SIL[t==='moto'?'moto':'car'];RL.silh=(t)=>silh(t);
/* ---------- veículo destaque e avatar ---------- */
const featCar=()=>S.cars.find(c=>c.id===S.me.feat)||activeCar()||S.cars[0];RL.featCar=featCar;
function avatar(w,s){if(w&&w.me){const c=featCar();if(c&&c.front)return`<span class="av" style="width:${s}px;height:${s}px;background:${ME_G}"><img src="${c.front}" style="width:88%;height:88%;object-fit:contain;transform:translateY(6%)"></span>`;
  return`<span class="av" style="width:${s}px;height:${s}px;background:${ME_G}">${silh(c&&c.type).replace('<svg','<svg style="width:76%"')}</span>`;}
  const moto=w&&(w.moto||isMoto(w.car));return`<span class="av" style="width:${s}px;height:${s}px;background:${(w&&w.g)||G[0]}">${silh(moto?'moto':'car').replace('<svg','<svg style="width:76%"')}</span>`;}
RL.avatar=avatar;
/* ---------- distância (prioriza quem está perto) ---------- */
const hsh=s=>{let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return(h>>>0)/4294967295;};
const EXTRA=RL.extra=RL.extra||{};RL.extraPosts=RL.extraPosts||[];
const distKm=h=>{if(h===S.me.handle)return 0;const x=hsh('d'+h);const far=EXTRA[h]?60:20;return Math.round((.4+Math.pow(x,1.6)*far)*10)/10;};
RL.distKm=distKm;RL.distTxt=h=>h===S.me.handle?'':` · a ${String(distKm(h)).replace('.',',')} km`;
/* donos simulados de cada modelo (gerados de forma estável) */
const FN='Ana,Bruno,Carla,Diego,Elisa,Felipe,Gabi,Henrique,Isa,João,Karen,Léo,Mari,Nico,Otávio,Pri,Rodrigo,Sabrina,Thiago,Vitória,Wesley,Yasmin'.split(','),LN='Alves,Barbosa,Costa,Duarte,Freitas,Gomes,Lopes,Martins,Neves,Pires,Ribeiro,Santos,Teixeira,Vieira'.split(',');
const BIO=['Rodando todo dia','Só rolê de fim de semana','Uber nas horas vagas','Apaixonado pelo meu','Estrada é terapia','Pintando a cidade'];
const gen=new Set();
function ownersOf(key){if(!gen.has(key)){gen.add(key);const r=rnd(Math.floor(hsh(key)*1e6));const n=6+Math.floor(r()*5);const moto=isMoto(key),cr=Object.keys(CREWS);
  for(let i=0;i<n;i++){const fn=FN[Math.floor(r()*FN.length)],ln=LN[Math.floor(r()*LN.length)],h=(fn+'.'+ln.slice(0,3)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')+Math.floor(r()*90+10);if(EXTRA[h]||P.some(p=>p.h===h))continue;
   const p={h,n:fn+' '+ln,crew:r()<.45?cr[Math.floor(r()*cr.length)]:'',car:key,year:2008+Math.floor(r()*18),hex:Math.floor(40+r()*420),wk:Math.floor(r()*38),km:Math.floor(20+r()*500),bio:BIO[Math.floor(r()*BIO.length)],fol:Math.floor(30+r()*900),g:G[Math.floor(r()*G.length)],moto,gen:1};EXTRA[h]=p;
   const np=1+Math.floor(r()*2);for(let j=0;j<np;j++){const hx=2+Math.floor(r()*12);RL.extraPosts.push({id:'xp'+h+j,h,txt:['Rolê de hoje com o '+key.split(' ').slice(1).join(' '),'Mais '+hx+' hex pra conta','Fim de tarde perfeito','Testando o modo território'][Math.floor(r()*4)],hex:hx,km:Math.round(5+r()*40),sec:Math.round(600+r()*3600),t:Date.now()-(1+r()*120)*3600e3,horn:Math.floor(r()*120),track:genTrack(Math.floor(r()*500)+20),cm:[]});}}}
  const own=[...P.filter(p=>modelKey(p.car)===key),...Object.values(EXTRA).filter(p=>p.car===key)];
  if(S.cars.some(c=>modelKey(c.model)===key))own.push({h:S.me.handle,n:S.me.name,crew:S.me.crew,me:true,car:key,hex:Object.keys(S.hexes).length,wk:C.wkHex(),km:Math.round(C.myKm())});
  return own;}
/* ---------- CADASTRO (marca → modelo → ano) ---------- */
function paywall(){sheet(`<div class="plusc"><div class="b lime" style="font-size:13px">ROLÊ+</div><div style="font-size:24px;font-weight:800;margin-top:4px;line-height:1.15">Garagem ilimitada</div>
  <div class="small muted" style="margin-top:8px;line-height:1.5">Grátis: até ${FREE} veículos.<br>Rolê+: veículos ilimitados, cores e neon extras no estúdio, ranking por modelo com histórico e selo no perfil.</div>
  <div style="font-size:28px;font-weight:800;margin-top:14px">R$ 9,90<span class="small muted" style="font-weight:600">/mês</span></div></div>
  <button class="btn" id="pb" style="margin-top:14px">Assinar Rolê+</button><div class="small" style="text-align:center;color:var(--tx4);margin-top:8px">Protótipo: nenhuma cobrança é feita</div>`,(w,close)=>{$('#pb',w).onclick=()=>{S.plus=true;save();close();toast('Rolê+ ativado (simulação)');router.go('carForm',{});};});}
RL.paywall=paywall;
SCREENS.carForm={tabbar:false,
 html(p){const c=p.id?S.cars.find(x=>x.id===p.id):null;
  if(!c&&S.cars.length>=FREE&&!S.plus)return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Novo veículo</h2></div><div class="scroll"><div class="plusc"><div class="b lime" style="font-size:13px">LIMITE GRÁTIS</div><div style="font-size:22px;font-weight:800;margin-top:6px">Você já tem ${S.cars.length} veículos</div><div class="small muted" style="margin-top:8px;line-height:1.5">No plano grátis cabem ${FREE}. Com o Rolê+ sua garagem não tem limite.</div></div><button class="btn" data-on="plus" style="margin-top:14px">Conhecer o Rolê+</button></div>`;
  const e=c?lookup(c.model):null;this.t=c?(c.type||(e&&e.t)||'car'):'car';this.b=e?e.b:null;this.m=e?e.m:null;this.manual=c&&!e;
  return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>${c?'Editar veículo':'Novo veículo'}</h2><span class="small muted">${S.plus?'Rolê+':`${S.cars.length+(c?0:1)}/${FREE}`}</span></div><div class="scroll">
  <div class="seg" id="tp"><button data-t="car" class="${this.t==='car'?'on':''}">Carro</button><button data-t="moto" class="${this.t==='moto'?'on':''}">Moto</button></div>
  <div id="cat"></div>
  <div class="row" style="gap:10px;align-items:flex-start"><div style="flex:1"><label class="f">Ano</label><select class="inp" id="fy">${Array.from({length:38},(_,i)=>2027-i).map(y=>`<option ${c&&+c.year===y?'selected':''}>${y}</option>`).join('')}</select></div><div style="flex:1"><label class="f">Cor</label><input class="inp" id="fc" value="${esc(c&&c.color||'')}" placeholder="Prata"></div></div>
  <div class="row" style="gap:10px;align-items:flex-start"><div style="flex:1"><label class="f">Consumo médio (km/l)</label><input class="inp" id="fk" inputmode="decimal" value="${c&&c.kml?String(c.kml).replace('.',','):''}" placeholder="12,5"></div><div style="flex:1"><label class="f">Quilometragem</label><input class="inp" id="fo" inputmode="numeric" value="${esc(c&&c.km||'')}" placeholder="62000"></div></div>
  <button class="btn" data-on="save" style="margin-top:20px">${c?'Salvar':'Continuar pras fotos'}</button>
  <div class="small muted" style="text-align:center;margin-top:10px">Sem foto, seu veículo aparece como silhueta.</div></div>`;},
 mount(el){if(!$('#cat',el))return;const c=this.params.id?S.cars.find(x=>x.id===this.params.id):null;
  const draw=()=>{const cat=CAT[this.t];const q=(this.q||'').toLowerCase();
   if(this.manual){$('#cat',el).innerHTML=`<label class="f">Marca e modelo</label><input class="inp" id="fm" value="${esc(c&&c.model||'')}" placeholder="Ex.: Fiat 147 1979"><button class="small b lime" data-k="cat" style="margin:10px 4px 0">Voltar pra lista</button>`;$('[data-k="cat"]',el).onclick=()=>{this.manual=false;draw();};return;}
   $('#cat',el).innerHTML=`<label class="f">Marca</label><div class="brands">${Object.keys(cat).map(b=>`<button class="pick ${this.b===b?'on':''}" data-b="${esc(b)}">${esc(b)}</button>`).join('')}</div>
   ${this.b&&cat[this.b]?`<label class="f">Modelo</label>${cat[this.b].length>8?`<input class="inp" id="mq" placeholder="Buscar modelo da ${esc(this.b)}" value="${esc(this.q||'')}" style="margin-bottom:8px">`:''}<div class="brands" id="ml">${cat[this.b].filter(m=>!q||m.toLowerCase().includes(q)).map(m=>`<button class="pick ${this.m===m?'on':''}" data-m="${esc(m)}">${esc(m)}</button>`).join('')}</div>`:''}
   <button class="small b" data-k="man" style="margin:12px 4px 0;color:var(--tx3)">Não achei meu ${this.t==='moto'?'modelo':'carro'}</button>`;
   $$('[data-b]',el).forEach(b=>b.onclick=()=>{this.b=b.dataset.b;this.m=null;this.q='';draw();});
   $$('[data-m]',el).forEach(b=>b.onclick=()=>{this.m=b.dataset.m;$$('[data-m]',el).forEach(x=>x.classList.toggle('on',x===b));});
   const mq=$('#mq',el);if(mq)mq.oninput=()=>{this.q=mq.value;const pos=mq.selectionStart;draw();const n=$('#mq',el);n.focus();n.setSelectionRange(pos,pos);};
   $('[data-k="man"]',el).onclick=()=>{this.manual=true;draw();};};
  $$('#tp button',el).forEach(b=>b.onclick=()=>{this.t=b.dataset.t;this.b=null;this.m=null;$$('#tp button',el).forEach(x=>x.classList.toggle('on',x===b));draw();});draw();},
 on:{plus(){paywall();},
  save(){const el=this.el;let model;if(this.manual){model=($('#fm',el)||{}).value||'';model=model.trim();if(model.length<2){toast('Escreva a marca e o modelo','dark');return;}}
   else{if(!this.b||!this.m){toast(this.b?'Escolha o modelo':'Escolha a marca','dark');return;}model=this.b+' '+this.m;}
   const kml=parseFloat(($('#fk',el).value||'').replace(',','.'))||null,year=parseInt($('#fy',el).value)||'',km=parseInt(($('#fo',el).value||'').replace(/\D/g,''))||null,color=$('#fc',el).value.trim(),type=this.t;
   let c=this.params.id?S.cars.find(x=>x.id===this.params.id):null;
   if(c){Object.assign(c,{model,year,kml,km,type,color});save();rebuildCar();toast('Salvo');router.tabTo('garage');return;}
   if(!S.me.feat&&S.cars[0])S.me.feat=S.cars[0].id;c={id:'c'+Date.now(),model,year,kml,km,type,color,front:null,rear:null,active:true};S.cars.forEach(x=>x.active=false);S.cars.push(c);if(!S.me.feat)S.me.feat=c.id;save();rebuildCar();
   router.go('photo',{id:c.id,slot:'rear',then:'front',fresh:true},{root:true});}}};
/* ---------- PÁGINA DO MODELO ---------- */
SCREENS.model={tabbar:false,
 html(p){const key=modelKey(p.m),own=ownersOf(key),near=own.filter(o=>!o.me&&distKm(o.h)<=15).length,moto=isMoto(key),t=this.t||'posts';
  return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>${esc(key)}</h2></div><div class="scroll">
  <div class="vhero"><div class="pic">${silh(moto?'moto':'car')}</div><div style="margin-top:12px"><div style="font-size:26px;font-weight:800">${esc(key)}</div><div class="small muted">${own.length} ${own.length===1?'dono':'donos'} no Rolê · <b class="lime">${near} perto de você</b></div></div></div>
  <div class="small muted b" style="margin:16px 4px 8px">Donos perto de você</div><div class="stories">${own.filter(o=>!o.me).sort((a,b)=>distKm(a.h)-distKm(b.h)).slice(0,10).map(o=>`<button class="story" data-on="prof" data-h="${esc(o.h)}">${avatar(o,52)}<span>${String(distKm(o.h)).replace('.',',')} km</span></button>`).join('')}</div>
  <div class="seg" id="mt" style="margin-top:6px">${[['posts','Rolês recentes'],['rank','Ranking']].map(([k,x])=>`<button data-k="${k}" class="${t===k?'on':''}">${x}</button>`).join('')}</div><div id="mb" style="margin-top:14px"></div></div>`;},
 mount(el){const key=modelKey(this.params.m);const draw=()=>{const t=this.t||'posts',own=ownersOf(key),hs=new Set(own.map(o=>o.h));
   if(t==='posts'){const ps=[...FPOSTS,...RL.extraPosts].filter(p=>hs.has(p.h)).map(p=>({p,d:distKm(p.h)})).sort((a,b)=>(Math.floor(a.d/5)-Math.floor(b.d/5))||(b.p.t-a.p.t)).map(x=>x.p);
    $('#mb',el).innerHTML=`<div class="small muted" style="margin:0 4px 10px">Ordenado por quem está mais perto de você</div>${ps.map(postCard).join('')||'<div class="card empty small">Nenhum rolê ainda.</div>'}`;}
   else{const m=this.rm||'hex';const rows=own.slice().sort((a,b)=>(b[m]||0)-(a[m]||0));
    $('#mb',el).innerHTML=`<div class="chips" id="rm">${[['hex','Hexágonos'],['wk','Esta semana'],['km','Km rodados']].map(([k,x])=>`<button class="chip ${m===k?'lime':''}" data-r="${k}">${x}</button>`).join('')}</div>
    <div class="card list" style="margin-top:12px;padding:4px 8px">${rows.map((o,i)=>`<button class="rk press ${o.me?'me':''}" data-on="prof" data-h="${esc(o.h)}" style="width:100%;text-align:left"><span class="n">${i+1}</span>${avatar(o,38)}<div style="flex:1;min-width:0"><div class="b" style="font-size:14px">${esc(o.n)}${o.me?' (você)':''}</div><div class="small muted">${o.me?'você':'a '+String(distKm(o.h)).replace('.',',')+' km'}${o.crew?' · '+esc(o.crew):''}</div></div><b>${(o[m]||0).toLocaleString('pt-BR')} <span class="small muted">${m==='km'?'km':'hex'}</span></b></button>`).join('')}</div>`;
    $$('[data-r]',el).forEach(b=>b.onclick=()=>{this.rm=b.dataset.r;draw();});}};
  $$('#mt button',el).forEach(b=>b.onclick=()=>{this.t=b.dataset.k;$$('#mt button',el).forEach(x=>x.classList.toggle('on',x===b));draw();});draw();},
 on:postHandlers};
/* ---------- PERFIL DE OUTRA PESSOA (veículo em destaque) ---------- */
const extraCar=p=>{const r=rnd(Math.floor(hsh('c2'+p.h)*1e6));if(r()>.35)return null;const pool=ALL.filter(e=>e.t===(r()<.7?'car':'moto'));return pool[Math.floor(r()*pool.length)].k;};
SCREENS.person={tabbar:false,
 html(pp){const p=C.person(pp.h);if(!p)return'<div class="empty">Perfil não encontrado</div>';const c=CREWS[p.crew];const ps=[...FPOSTS,...RL.extraPosts].filter(x=>x.h===p.h);const fo=!!S.follow[p.h];
  const key=modelKey(p.car),moto=isMoto(key),c2=extraCar(p);const rank=[...P].sort((a,b)=>b.wk-a.wk).findIndex(x=>x.h===p.h)+1;
  return`<div class="scroll" style="padding-top:0"><div class="cover" style="--cc:${c?c.c+'55':'#2B3519'}"></div>
  <button class="ib glass" data-back style="position:absolute;left:14px;top:calc(14px + var(--safeT))">${ic(I.back)}</button>
  <div style="margin-top:-38px;display:flex;align-items:flex-end;gap:12px"><span style="border:4px solid var(--bg);border-radius:99px;display:inline-flex">${avatar(p,78)}</span><div style="flex:1"></div><button class="ib" data-on="chal" aria-label="Desafiar">${ic(I.flag,18)}</button><button class="fbtn ${fo?'on':''}" data-on="fol" data-h="${p.h}">${fo?'Seguindo':'Seguir'}</button></div>
  <div style="margin:10px 4px 0"><div style="font-size:26px;font-weight:800;letter-spacing:-.5px">${esc(p.n)}</div><div class="small muted">@${esc(p.h)}${p.crew?` · <button data-go="crew" data-p='${JSON.stringify({id:p.crew})}' class="b" style="color:${c.c}">${esc(p.crew)}</button>`:''} · a ${String(distKm(p.h)).replace('.',',')} km de você</div><div style="margin-top:8px;font-size:14px">${esc(p.bio)}</div>
  <div class="small" style="margin-top:8px"><b>${(p.fol+(fo?1:0)).toLocaleString('pt-BR')}</b> <span class="muted">seguidores</span></div></div>
  <div class="vhero" style="margin-top:14px;--vc:${c?c.c+'33':'rgba(198,244,50,.18)'}"><span class="vbadge">★ Destaque</span><div class="pic">${silh(moto?'moto':'car')}</div>
   <div class="row" style="margin-top:12px;align-items:flex-end"><div style="flex:1"><div class="small muted">${p.year||''}</div><button data-on="model" data-m="${esc(key)}" style="font-size:24px;font-weight:800;text-align:left">${esc(p.car)}</button></div><button class="btn sm sec" data-on="model" data-m="${esc(key)}">Ver donos</button></div></div>
  ${c2?`<div class="small muted b" style="margin:14px 4px 8px">Também na garagem</div><div class="row" style="gap:10px"><button class="vmini" data-on="model" data-m="${esc(c2)}"><div class="im">${silh(isMoto(c2)?'moto':'car')}</div><div class="small b" style="margin-top:6px">${esc(c2)}</div></button></div>`:''}
  <div class="card stat3" style="margin-top:14px;padding:14px 0"><div><b class="lime">${p.hex}</b><span>hexágonos</span></div><div><b>${rank?'#'+rank:'—'}</b><span>na semana</span></div><div><b>${p.km}</b><span>km no mês</span></div></div>
  <div class="sec-t">Rolês</div>${ps.map(postCard).join('')||'<div class="card empty small">Nenhum rolê público ainda.</div>'}</div>`;},
 on:{...postHandlers,fol(a){const on=!S.follow[a.dataset.h];follow(a.dataset.h,on);router.render(this,true,true);},
  chal(){const p=C.person(this.params.h);toast('Desafio enviado: quem fizer mais hex até domingo vence','dark');S.notifs.unshift({id:'n'+Date.now(),t:Date.now(),txt:`Você desafiou ${p.n}. Quem fizer mais hex até domingo vence.`,read:true});save();}}};
/* ---------- MEU PERFIL (veículo destaque = foto de perfil) ---------- */
const prevProfile=SCREENS.profile;
function vPic(c,h=150){return c&&c.front?`<img src="${c.front}" alt="">`:silh(c&&c.type);}
SCREENS.profile={tab:'profile',
 html(){const tot=C.myKm(),nh=Object.keys(S.hexes).length,cr=CREWS[S.me.crew],nf=Object.keys(S.follow).length,f=featCar();
  const rides=f?S.rides.filter(r=>r.car===f.model):[];
  return`<div class="scroll" style="padding-top:0"><div class="cover" style="--cc:${cr?cr.c+'55':'#2B3519'}"></div><button class="ib glass" data-on="settings" style="position:absolute;right:14px;top:calc(14px + var(--safeT))">${ic(I.gear)}</button>
  <div style="margin-top:-38px;display:flex;align-items:flex-end;gap:12px"><button data-on="feat" style="border:4px solid var(--bg);border-radius:99px;display:inline-flex">${avatar({me:true},78)}</button><div style="flex:1"></div><button class="btn sm sec" data-on="edit">Editar perfil</button></div>
  <div style="margin:10px 4px 0"><div style="font-size:26px;font-weight:800">${esc(S.me.name)}${S.plus?' <span class="vbadge" style="position:static;display:inline-flex;vertical-align:middle">Rolê+</span>':''}</div><div class="small muted">@${esc(S.me.handle)} · nível ${S.me.level}${S.me.crew?` · <button data-go="crew" data-p='${JSON.stringify({id:S.me.crew})}' class="b" style="color:${cr?cr.c:'var(--lime2)'}">${esc(S.me.crew)}</button>`:''}</div>${S.me.bio?`<div style="margin-top:8px;font-size:14px">${esc(S.me.bio)}</div>`:''}
  <div class="row small" style="margin-top:8px;gap:14px"><span><b>${37+nf%5}</b> <span class="muted">seguidores</span></span><button data-go="explore"><b>${nf}</b> <span class="muted">seguindo</span></button></div></div>
  ${f?`<div class="vhero" style="margin-top:14px"><span class="vbadge">★ Destaque · foto do perfil</span><div class="pic">${vPic(f)}</div>
   <div class="row" style="margin-top:12px;align-items:flex-end"><div style="flex:1"><div class="small muted">${esc(f.year||'')}${f.color?' · '+esc(f.color):''}</div><button data-on="model" data-m="${esc(modelKey(f.model))}" style="font-size:24px;font-weight:800;text-align:left;line-height:1.15">${esc(f.model)}</button></div><button class="btn sm sec" data-on="feat">Trocar</button></div>
   <div class="row small muted" style="margin-top:10px;gap:14px"><span><b style="color:var(--tx)">${rides.length}</b> rolês</span><span><b style="color:var(--tx)">${fmtKm(rides.reduce((a,r)=>a+r.dist,0))}</b> km</span><span><b class="lime">${rides.reduce((a,r)=>a+r.hex,0)}</b> hex com ele</span></div></div>`:''}
  <div class="sec-t">Garagem <span class="small muted" style="font-weight:600">${S.plus?S.cars.length+' veículos · Rolê+':S.cars.length+'/'+FREE+' grátis'}</span></div>
  <div class="row" style="gap:10px;overflow-x:auto;padding-bottom:4px">${S.cars.map(c=>`<button class="vmini ${f&&c.id===f.id?'on':''}" data-on="vsel" data-id="${c.id}"><div class="im">${vPic(c)}</div><div class="small b" style="margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.model)}</div><div class="small muted">${f&&c.id===f.id?'★ destaque':esc(c.year||'')}</div></button>`).join('')}
   <button class="vmini" data-on="add" style="display:flex;flex-direction:column;align-items:center;justify-content:center;border-style:dashed;min-height:104px">${ic(I.plus,22)}<div class="small b" style="margin-top:6px">${S.cars.length>=FREE&&!S.plus?'Rolê+':'Adicionar'}</div></button></div>
  <div class="card stat3" style="margin-top:14px;padding:14px 0"><div><b class="lime">${nh}</b><span>hexágonos</span></div><div><b>${S.rides.length}</b><span>rolês</span></div><div><b>${fmtKm(tot*1000)}</b><span>km</span></div></div>
  <button class="card row press" data-go="ranking" style="width:100%;text-align:left;margin-top:10px"><span class="ib" style="width:42px;height:42px;color:var(--lime2)">${ic(TROPHY,20)}</span><div style="flex:1"><div class="b">Ranking da semana</div><div class="small muted">${C.wkHex()} hex nos últimos 7 dias</div></div>${ic(I.back,18).replace('<svg','<svg style="transform:rotate(180deg)"')}</button>
  <div class="sec-t">Seus rolês</div>${S.rides.length?S.rides.map(r=>`<button class="card row press" data-go="summary" data-p='${JSON.stringify({id:r.id})}' style="width:100%;text-align:left;margin-bottom:8px;padding:8px"><div style="width:62px;height:62px;border-radius:14px;overflow:hidden;flex-shrink:0">${trackSVG(r.track,62,62)}</div><div style="flex:1"><div class="b">${esc(r.dest?'Até '+r.dest:r.mode==='terr'?'Território':'Rolê livre')}</div><div class="small muted">${new Date(r.t).toLocaleDateString('pt-BR')} · ${fmtKm(r.dist)} km · ${fmtT(r.sec)}</div></div><span class="lime b small" style="padding-right:8px">+${r.hex} hex</span></button>`).join(''):'<div class="card empty">Nenhum rolê ainda. Toque no + pra começar.</div>'}</div>`;},
 on:{...prevProfile.on,model(a){router.go('model',{m:a.dataset.m});},
  add(){S.cars.length>=FREE&&!S.plus?paywall():router.go('carForm',{});},
  feat(){if(S.cars.length<2){toast('Adicione outro veículo pra trocar o destaque','dark');return;}sheet(`<div style="font-size:20px;font-weight:800;margin-bottom:4px">Veículo destaque</div><div class="small muted" style="margin-bottom:12px">Ele vira sua foto de perfil e aparece em cima no seu perfil</div>${S.cars.map(c=>`<button class="row press" data-id="${c.id}" style="width:100%;text-align:left;padding:10px 0;border-bottom:1px solid var(--line)"><div class="vmini" style="width:86px;padding:4px;border:none"><div class="im">${vPic(c)}</div></div><div style="flex:1"><div class="b">${esc(c.model)}</div><div class="small muted">${esc(c.year||'')}</div></div>${featCar().id===c.id?'<span class="lime b">★</span>':''}</button>`).join('')}`,(w,close)=>{$$('[data-id]',w).forEach(b=>b.onclick=()=>{S.me.feat=b.dataset.id;save();close();router.tabTo('profile');toast('Destaque trocado');});});},
  vsel(a){const c=S.cars.find(x=>x.id===a.dataset.id);sheet(`<div style="font-size:20px;font-weight:800">${esc(c.model)}</div><button class="btn" id="v1" style="margin-top:14px">★ Usar como destaque</button><button class="btn sec" id="v2" style="margin-top:10px">Usar no mapa (veículo ativo)</button><button class="btn sec" id="v3" style="margin-top:10px">Ver donos de ${esc(modelKey(c.model))}</button>`,(w,close)=>{
   $('#v1',w).onclick=()=>{S.me.feat=c.id;save();close();router.tabTo('profile');toast('Destaque trocado');};
   $('#v2',w).onclick=()=>{S.cars.forEach(x=>x.active=x===c);save();rebuildCar();close();toast(c.model+' no mapa');router.tabTo('profile');};
   $('#v3',w).onclick=()=>{close();router.go('model',{m:modelKey(c.model)});};});}}};
})();
