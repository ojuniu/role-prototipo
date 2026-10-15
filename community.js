/* Rolê — parte 3: comunidade (feed, explorar, perfis, ranking, crews, comentários) */
(()=>{'use strict';
const RL=window.__role;if(!RL)return;
const {S,SCREENS,save,toast,sheet,ic,I,esc,$,$$,fmtKm,router,av,trackSVG,ago,fmtT}=RL;
const st=document.createElement('style');st.textContent=`
.stories{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 12px;scrollbar-width:none}.stories::-webkit-scrollbar{display:none}
.story{display:flex;flex-direction:column;align-items:center;gap:6px;width:62px;flex-shrink:0;font-size:11px;color:var(--tx2)}
.story .rg2{padding:2.5px;border-radius:99px;background:conic-gradient(#C6F432,#86C92A,#C6F432)}.story .rg2 .av{border:2.5px solid var(--bg)}
.story span{max-width:62px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cover{height:120px;margin:0 -16px;background:radial-gradient(60% 90% at 70% 0%,var(--cc,#2B3519),transparent 70%),repeating-linear-gradient(60deg,transparent 0 22px,rgba(255,255,255,.035) 22px 23px),repeating-linear-gradient(-60deg,transparent 0 22px,rgba(255,255,255,.035) 22px 23px),#0E0F0D}
.pod{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:8px;align-items:end;margin-top:8px}
.pod>div{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.pod .bar{width:100%;border-radius:14px 14px 4px 4px;background:linear-gradient(rgba(198,244,50,.22),rgba(198,244,50,.04));border:1px solid rgba(198,244,50,.3);display:flex;align-items:flex-start;justify-content:center;padding-top:8px;font-weight:800;font-size:20px}
.rk{display:flex;align-items:center;gap:12px;padding:11px 6px}.rk.me{background:rgba(198,244,50,.08);border-radius:14px;border-bottom:none!important}
.rk .n{width:24px;text-align:center;font-weight:800;color:var(--tx3)}
.war{height:12px;border-radius:99px;overflow:hidden;display:flex;background:#222}
.crewb{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#0A0B0A}
.cmt-in{position:absolute;left:0;right:0;bottom:0;padding:10px 14px calc(12px + var(--safeB));background:#0E0F0D;border-top:1px solid var(--line);display:flex;gap:10px}
.fbtn{height:38px;padding:0 18px;border-radius:99px;font-weight:800;font-size:14px;background:var(--lime);color:#0A0B0A}.fbtn.on{background:rgba(255,255,255,.08);color:var(--tx);border:1px solid var(--line2)}
`;document.head.appendChild(st);
const TROPHY='<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>';
/* ---------- dados (fictícios no protótipo) ---------- */
const CREWS={'Turbo Clan':{c:'#C6F432',m:24,hex:3120,d:'Rolê de sexta, da Savassi até a Pampulha. Chega mais.'},'Rosa Choque':{c:'#FF6A3D',m:31,hex:3480,d:'Território é nosso. A cidade é rosa (e laranja).'},'Moto Norte':{c:'#22D3EE',m:18,hex:2210,d:'Duas rodas, Venda Nova e região norte.'},'Noturnos':{c:'#A78BFA',m:12,hex:1460,d:'Só depois das 22h. Cidade vazia, caminho livre.'}};
const G=['linear-gradient(135deg,#FFC2E8,#E0559E)','linear-gradient(135deg,#9CF0D0,#2FB38A)','linear-gradient(135deg,#FFB08A,#FF6A3D)','linear-gradient(135deg,#E2E3DE,#8C8E88)','linear-gradient(135deg,#B9D4FF,#4F7BEA)','linear-gradient(135deg,#FFE58A,#E0A800)','linear-gradient(135deg,#D9C2FF,#8B5CF6)'];
const P=[['lia.m','Lia Moraes','Rosa Choque','Fiat Argo 1.3',412,41,318,'Serra, café e curva.',1820],['duka','Eduardo Lima','Turbo Clan','VW Polo TSI',388,36,204,'Pampulha toda sexta.',940],['rafa_cg','Rafa Campos','','Gol G4 1.0',301,33,150,'Sem crew, sem chefe.',610],['paulao','Paulo Reis','Moto Norte','Honda CB 500X',356,29,480,'Moto é liberdade.',1210],['bia.turbo','Bia Nunes','Turbo Clan','Chevrolet Onix',264,27,175,'Pintando BH de lima.',530],['marcao','Marcos Teles','Noturnos','Fiat Toro',222,24,260,'Depois das 22h.',380],['ju.rocha','Juliana Rocha','Rosa Choque','Hyundai HB20S',298,22,190,'Vice da Rosa.',870],['caio.r','Caio Ramos','Moto Norte','Yamaha Fazer 250',187,19,340,'Venda Nova raiz.',290],['nanda','Fernanda Dias','Noturnos','Fiat Mobi',143,15,98,'Rolê curto, foto boa.',450],['gui_s','Guilherme Souza','','Toyota Corolla',176,14,220,'Estrada > cidade.',210],['vini','Vinícius Prado','Rosa Choque','Honda Civic',251,12,140,'Rosa até o fim.',660]]
 .map((x,i)=>({h:x[0],n:x[1],crew:x[2],car:x[3],hex:x[4],wk:x[5],km:x[6],bio:x[7],fol:x[8],g:G[i%G.length],moto:/CB|Fazer/.test(x[3])}));
const ME_G='linear-gradient(135deg,#EFFF7A,#86C92A)';
const person=h=>P.find(p=>p.h===h);
const ini=n=>n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
function rnd(seed){let s=seed*9301+49297;return()=>(s=(s*9301+49297)%233280)/233280;}
function genTrack(i,n=42){const r=rnd(i+3);let x=-43.945+r()*.03,y=-19.94+r()*.03,d=Math.floor(r()*4);const t=[[x,y]];for(let k=0;k<n;k++){if(r()<.18)d=(d+(r()<.5?1:3))%4;const s=.0009+r()*.0006;x+=[s,0,-s,0][d];y+=[0,s,0,-s][d];t.push([x,y]);}return t;}
const TX=['Pampulha no fim de tarde, {h} hex novos','Fui buscar pão e voltei com {h} hex','Serra do Curral sem trânsito, que paz','Rolê da crew hoje, quem colou?','Tomei a Savassi de volta 😤','Primeira vez rodando no modo território, viciei','Contorno inteiro sem semáforo vermelho','Gasolina a R$ 5,79 no posto da Amazonas, corre'];
const CM=['Brabo demais','Essa rota é boa mesmo','Bora junto semana que vem?','Devolve meus hex 😂','Que horas foi isso?','Top!','Tô chegando nesse ranking','Rosa Choque vai responder'];
const FPOSTS=[0,6,1,3,4,2,7,5,8,10].map((pi,i)=>{const p=P[pi],r=rnd(i+11);const hx=4+Math.floor(r()*14);return{id:'fp'+i,h:p.h,txt:TX[i%TX.length].replace('{h}',hx),hex:hx,km:Math.round(8+r()*60),sec:Math.round(900+r()*4000),t:Date.now()-(i*2.7+.6)*3600e3,horn:Math.round(20+r()*260),track:genTrack(i),cm:[0,1,2].slice(0,1+Math.floor(r()*3)).map(k=>({h:P[(pi+k+2)%P.length].h,txt:CM[(i+k)%CM.length],t:Date.now()-(i*2.7+.3-k*.1)*3600e3}))};});
S.follow=S.follow||{'duka':1,'bia.turbo':1,'lia.m':1};S.horn=S.horn||{};S.cm=S.cm||{};
const myPosts=()=>S.posts.map(p=>{const r=S.rides.find(x=>x.id===p.ride)||{};return{id:p.id,h:S.me.handle,mine:true,txt:p.txt,hex:r.hex||0,km:r.dist?r.dist/1000:0,sec:r.sec||0,t:p.t,horn:p.horn||0,track:r.track,cm:[]};});
const allPosts=()=>[...myPosts(),...FPOSTS].sort((a,b)=>b.t-a.t);
const postById=id=>allPosts().find(p=>p.id===id);
const who=h=>h===S.me.handle?{h,n:S.me.name,crew:S.me.crew,g:ME_G,me:true}:person(h);
const wkHex=()=>Object.values(S.hexes).filter(t=>t>Date.now()-7*864e5).length;
const myKm=()=>S.rides.reduce((a,r)=>a+r.dist,0)/1000;
const hornN=p=>p.mine?(S.posts.find(x=>x.id===p.id)||{}).horn||0:p.horn+(S.horn[p.id]?1:0);
const hornOn=p=>p.mine?!!(S.posts.find(x=>x.id===p.id)||{}).hornOn:!!S.horn[p.id];
const cmts=p=>[...(p.cm||[]),...(S.cm[p.id]||[])];
const avOf=(w,s)=>av(ini(w.n),s,w.g);
function postCard(p){const w=who(p.h);if(!w)return'';const c=w.crew&&CREWS[w.crew];
  return`<div class="card post"><div class="row"><button data-on="prof" data-h="${esc(p.h)}" style="display:flex;align-items:center;gap:12px;flex:1;text-align:left">${avOf(w,38)}<div><div class="b" style="font-size:14px">${esc(w.n)} ${w.crew?`<span style="font-weight:600;color:${c?c.c:'var(--tx3)'}">· ${esc(w.crew)}</span>`:''}</div><div class="small muted">${ago(p.t)}${w.car?' · '+esc(w.car):''}</div></div></button></div>
  ${p.track&&p.track.length>1?`<div class="postmap">${trackSVG(p.track,360,170)}</div><div class="row small" style="margin-top:8px;gap:14px"><b class="lime">+${p.hex} hex</b><span>${String(Math.round(p.km*10)/10).replace('.',',')} km</span>${p.sec?`<span>${fmtT(p.sec)}</span>`:''}</div>`:''}
  <div style="margin-top:10px;font-size:14px;line-height:1.4">${esc(p.txt)}</div>
  <div class="acts"><button data-on="horn" data-id="${p.id}" class="${hornOn(p)?'on':''}">${ic(I.horn,18)}<span>${hornN(p)}</span></button><button data-on="cmts" data-id="${p.id}">${ic(I.cmt,17)}${cmts(p).length}</button><button data-on="sharep" data-id="${p.id}" style="margin-left:auto">${ic(I.share,17)}</button></div></div>`;}
const postHandlers={
 horn(a){const id=a.dataset.id,n=a.querySelector('span'),on=!a.classList.contains('on');a.classList.toggle('on',on);n.textContent=+n.textContent+(on?1:-1);
  const mp=S.posts.find(x=>x.id===id);if(mp){mp.hornOn=on;mp.horn=(mp.horn||0)+(on?1:-1);}else S.horn[id]=on;save();if(on)navigator.vibrate&&navigator.vibrate(15);},
 cmts(a){router.go('comments',{id:a.dataset.id});},
 prof(a){openProfile(a.dataset.h);},
 async sharep(a){const p=postById(a.dataset.id);const txt=`${who(p.h).n} fez +${p.hex} hex no Rolê`;try{if(navigator.share)await navigator.share({title:'Rolê',text:txt,url:location.href.split('#')[0]});else{await navigator.clipboard.writeText(txt);toast('Copiado');}}catch(e){}}};
function openProfile(h){h===S.me.handle?router.go('profile'):router.go('person',{h});}
function follow(h,on){if(on)S.follow[h]=1;else delete S.follow[h];save();
  if(on&&Math.random()<.6)setTimeout(()=>{S.notifs.unshift({id:'n'+Date.now(),t:Date.now(),txt:`@${h} começou a te seguir de volta`,read:false});save();toast(`@${h} te seguiu de volta`,'dark');},3500);}
/* ---------- FEED ---------- */
SCREENS.feed={tab:'feed',
 html(){const unread=S.notifs.filter(n=>!n.read).length;const f=this.f||'all';
  const live=P.filter((_,i)=>i%3!==2).slice(0,7);
  return`<div class="hdr"><h1>Comunidade</h1><button class="ib" data-go="explore" aria-label="Buscar">${ic(I.search)}</button><button class="ib" data-go="ranking" aria-label="Ranking">${ic(TROPHY)}</button><button class="ib" data-go="notifs" aria-label="Notificações" style="position:relative">${ic(I.bell)}${unread?'<span class="dotn"></span>':''}</button></div><div class="scroll" id="fs">
  <div class="small muted b" style="margin:0 4px 8px">Rodando agora</div><div class="stories">${live.map(p=>`<button class="story" data-on="prof" data-h="${p.h}"><span class="rg2">${av(ini(p.n),54,p.g)}</span><span>${esc(p.h)}</span></button>`).join('')}</div>
  <div class="seg" id="ff" style="margin-bottom:14px">${[['all','Para você'],['fol','Seguindo'],['crew','Minha crew']].map(([k,t])=>`<button data-k="${k}" class="${f===k?'on':''}">${t}</button>`).join('')}</div>
  <div id="fl"></div></div>`;},
 mount(el){const draw=()=>{const f=this.f||'all';let ps=allPosts();if(f==='fol')ps=ps.filter(p=>p.mine||S.follow[p.h]);if(f==='crew')ps=ps.filter(p=>{const w=who(p.h);return w&&w.crew&&w.crew===S.me.crew;});
   $('#fl',el).innerHTML=ps.map(postCard).join('')||`<div class="card empty">${f==='fol'?'Siga pilotos pra ver os rolês deles aqui.':'Nada por aqui ainda.'}</div>`;};
  $$('#ff button',el).forEach(b=>b.onclick=()=>{this.f=b.dataset.k;$$('#ff button',el).forEach(x=>x.classList.toggle('on',x===b));draw();});draw();},
 on:postHandlers};
/* ---------- COMENTÁRIOS ---------- */
SCREENS.comments={tabbar:false,
 html(p){const po=postById(p.id);if(!po)return'<div class="empty">Post não encontrado</div>';const cs=cmts(po);
  return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Comentários</h2></div><div class="scroll" style="padding-bottom:120px">${postCard(po)}
  <div class="list" id="cl">${cs.map(c=>{const w=who(c.h)||{n:c.h,g:G[0]};return`<div class="row" style="padding:12px 4px;align-items:flex-start"><button data-on="prof" data-h="${esc(c.h)}">${avOf(w,34)}</button><div style="flex:1"><div class="small"><b>${esc(w.n)}</b> <span class="muted">${ago(c.t)}</span></div><div style="font-size:14px;margin-top:2px;line-height:1.4">${esc(c.txt)}</div></div></div>`;}).join('')||'<div class="empty small">Seja o primeiro a comentar.</div>'}</div></div>
  <div class="cmt-in"><input class="inp" id="ci" placeholder="Comentar…" maxlength="280" style="height:46px"><button class="ib" data-on="send" style="width:46px;height:46px;background:var(--lime);color:#0A0B0A">${ic(I.check,20,2.6)}</button></div>`;},
 mount(el){$('#ci',el).addEventListener('keydown',e=>{if(e.key==='Enter')this.on.send.call(this);});},
 on:{...postHandlers,send(){const i=$('#ci',this.el),v=i.value.trim();if(!v)return;const id=this.params.id;(S.cm[id]=S.cm[id]||[]).push({h:S.me.handle,txt:v,t:Date.now()});save();router.render(this,true,true);setTimeout(()=>{const s=$('.scroll',this.el);s.scrollTop=s.scrollHeight;},50);}}};
/* ---------- EXPLORAR ---------- */
SCREENS.explore={tabbar:false,
 html(){return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><input id="xq" class="inp" placeholder="Buscar pilotos, crews, carros…" autocomplete="off" style="flex:1"></div><div class="scroll" id="xr"></div>`;},
 mount(el){const q=$('#xq',el);const draw=()=>{const v=q.value.trim().toLowerCase();const ps=P.filter(p=>!v||(p.n+' '+p.h+' '+p.car+' '+p.crew).toLowerCase().includes(v));const cs=Object.keys(CREWS).filter(c=>!v||c.toLowerCase().includes(v));
   $('#xr',el).innerHTML=`${cs.length?`<div class="sec-t">Crews</div><div class="card list" style="padding:4px 14px">${cs.map(c=>`<button class="row press" data-go="crew" data-p='${JSON.stringify({id:c})}' style="width:100%;text-align:left;padding:10px 0"><span class="crewb" style="background:${CREWS[c].c};width:42px;height:42px;border-radius:13px">${ic(I.hex,20,2.4)}</span><div style="flex:1"><div class="b">${esc(c)}</div><div class="small muted">${CREWS[c].m+(S.me.crew===c?1:0)} membros · ${CREWS[c].hex.toLocaleString('pt-BR')} hex</div></div>${S.me.crew===c?'<span class="small lime b">Sua crew</span>':''}</button>`).join('')}</div>`:''}
   <div class="sec-t">${v?'Pilotos':'Pilotos em alta'}</div><div class="card list" style="padding:4px 14px">${ps.map(p=>`<div class="row" style="padding:10px 0"><button data-on="prof" data-h="${p.h}" style="display:flex;gap:12px;align-items:center;flex:1;text-align:left">${av(ini(p.n),42,p.g)}<div style="min-width:0"><div class="b">${esc(p.n)}</div><div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">@${esc(p.h)} · ${esc(p.car)}</div></div></button><button class="fbtn ${S.follow[p.h]?'on':''}" data-on="fol" data-h="${p.h}">${S.follow[p.h]?'Seguindo':'Seguir'}</button></div>`).join('')||'<div class="empty small">Ninguém com esse nome</div>'}</div>`;};
  q.addEventListener('input',draw);draw();setTimeout(()=>q.focus(),250);},
 on:{prof(a){openProfile(a.dataset.h);},fol(a){const on=!S.follow[a.dataset.h];follow(a.dataset.h,on);a.classList.toggle('on',on);a.textContent=on?'Seguindo':'Seguir';}}};
/* ---------- PERFIL PÚBLICO ---------- */
SCREENS.person={tabbar:false,
 html(pp){const p=person(pp.h);if(!p)return'<div class="empty">Perfil não encontrado</div>';const c=CREWS[p.crew];const ps=FPOSTS.filter(x=>x.h===p.h);const fo=!!S.follow[p.h];
  const rank=[...P].sort((a,b)=>b.wk-a.wk).findIndex(x=>x.h===p.h)+1;
  return`<div class="scroll" style="padding-top:0"><div class="cover" style="--cc:${c?c.c+'55':'#2B3519'}"></div>
  <button class="ib glass" data-back style="position:absolute;left:14px;top:calc(14px + var(--safeT))">${ic(I.back)}</button>
  <div style="margin-top:-38px;display:flex;align-items:flex-end;gap:12px"><span style="border:4px solid var(--bg);border-radius:99px;display:inline-flex">${av(ini(p.n),78,p.g)}</span><div style="flex:1"></div><button class="ib" data-on="chal" aria-label="Desafiar">${ic(I.flag,18)}</button><button class="fbtn ${fo?'on':''}" data-on="fol" data-h="${p.h}">${fo?'Seguindo':'Seguir'}</button></div>
  <div style="margin:10px 4px 0"><div style="font-size:26px;font-weight:800;letter-spacing:-.5px">${esc(p.n)}</div><div class="small muted">@${esc(p.h)}${p.crew?` · <button data-go="crew" data-p='${JSON.stringify({id:p.crew})}' class="b" style="color:${c.c}">${esc(p.crew)}</button>`:''}</div><div style="margin-top:8px;font-size:14px">${esc(p.bio)}</div>
  <div class="row small" style="margin-top:8px;gap:14px"><span><b>${(p.fol+(fo?1:0)).toLocaleString('pt-BR')}</b> <span class="muted">seguidores</span></span><span class="muted">${ic(p.moto?I.flag:I.car,14)} ${esc(p.car)}</span></div></div>
  <div class="card stat3" style="margin-top:14px;padding:14px 0"><div><b class="lime">${p.hex}</b><span>hexágonos</span></div><div><b>#${rank}</b><span>na semana</span></div><div><b>${p.km}</b><span>km no mês</span></div></div>
  <div class="sec-t">Rolês</div>${ps.map(postCard).join('')||'<div class="card empty small">Nenhum rolê público ainda.</div>'}</div>`;},
 on:{...postHandlers,fol(a){const on=!S.follow[a.dataset.h];follow(a.dataset.h,on);router.render(this,true,true);},
  chal(){const p=person(this.params.h);toast(`Desafio enviado: quem fizer mais hex até domingo vence`,'dark');S.notifs.unshift({id:'n'+Date.now(),t:Date.now(),txt:`Você desafiou ${p.n}. Quem fizer mais hex até domingo vence.`,read:true});save();}}};
/* ---------- RANKING ---------- */
SCREENS.ranking={tabbar:false,
 html(){const m=this.m||'wk',k=this.k||'p';
  return`<div class="hdr hexbg"><button class="ib" data-back>${ic(I.back)}</button><h2>Ranking · BH</h2></div><div class="scroll hexbg" style="padding-top:0">
  <div class="seg" id="rk1">${[['p','Pilotos'],['c','Crews']].map(([x,t])=>`<button data-k="${x}" class="${k===x?'on':''}">${t}</button>`).join('')}</div>
  <div class="chips" id="rk2" style="margin-top:10px">${[['wk','Esta semana'],['hex','Geral'],['km','Km rodados']].map(([x,t])=>`<button class="chip ${m===x?'lime':''}" data-m="${x}">${t}</button>`).join('')}</div>
  <div id="rkb"></div></div>`;},
 mount(el){const draw=()=>{const m=this.m||'wk',k=this.k||'p';
   const me={h:S.me.handle,n:S.me.name,crew:S.me.crew,g:ME_G,me:true,wk:wkHex(),hex:Object.keys(S.hexes).length,km:Math.round(myKm())};
   let rows,unit=m==='km'?'km':'hex';
   if(k==='p')rows=[...P,me].map(x=>({id:x.h,name:x.n,sub:x.crew||'sem crew',g:x.g,me:x.me,v:x[m],ini:ini(x.n),go:()=>openProfile(x.h)}));
   else rows=Object.keys(CREWS).map(c=>{const mem=[...P,me].filter(x=>x.crew===c);const base=m==='hex'?CREWS[c].hex:0;return{id:c,name:c,sub:`${CREWS[c].m+(S.me.crew===c?1:0)} membros`,g:CREWS[c].c,v:base+mem.reduce((a,x)=>a+x[m],0),me:S.me.crew===c,ini:c.split(' ').map(w=>w[0]).join('')};});
   rows.sort((a,b)=>b.v-a.v);const top=rows.slice(0,3),my=rows.findIndex(r=>r.me);
   const pod=[top[1],top[0],top[2]].map((r,i)=>r?`<div data-i="${rows.indexOf(r)}">${av(r.ini,i===1?64:52,r.g)}<div class="small b" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.name)}</div><div class="bar" style="height:${[78,110,58][i]}px">${[2,1,3][i]}</div></div>`:'<div></div>').join('');
   $('#rkb',el).innerHTML=`<div class="pod">${pod}</div>${my>=0?`<div class="card row" style="margin-top:14px;border-color:rgba(198,244,50,.4)"><div class="b" style="flex:1">${k==='p'?'Você':'Sua crew'} está em <span class="lime">#${my+1}</span></div><div class="small muted">${my>0?`${rows[my-1].v-rows[my].v} ${unit} pro #${my}`:'Liderando!'}</div></div>`:''}
   <div class="card list" style="margin-top:12px;padding:4px 8px">${rows.map((r,i)=>`<button class="rk press ${r.me?'me':''}" data-i="${i}" style="width:100%;text-align:left"><span class="n">${i+1}</span>${av(r.ini,38,r.g)}<div style="flex:1;min-width:0"><div class="b" style="font-size:14px">${esc(r.name)}${r.me&&k==='p'?' (você)':''}</div><div class="small muted">${esc(r.sub)}</div></div><b>${r.v.toLocaleString('pt-BR')} <span class="small muted" style="font-weight:600">${unit}</span></b></button>`).join('')}</div>
   ${k==='p'&&m==='wk'?'<div class="small muted" style="text-align:center;margin-top:12px">O ranking semanal zera toda segunda às 00h</div>':''}`;
   $$('[data-i]',$('#rkb',el)).forEach(b=>b.onclick=()=>{const r=rows[+b.dataset.i];k==='p'?openProfile(r.id):router.go('crew',{id:r.id});});};
  $$('#rk1 button',el).forEach(b=>b.onclick=()=>{this.k=b.dataset.k;$$('#rk1 button',el).forEach(x=>x.classList.toggle('on',x===b));draw();});
  $$('#rk2 button',el).forEach(b=>b.onclick=()=>{this.m=b.dataset.m;$$('#rk2 button',el).forEach(x=>x.classList.toggle('lime',x===b));draw();});draw();}};
/* ---------- CREW ---------- */
SCREENS.crew={tabbar:false,
 html(pp){const id=pp.id,c=CREWS[id];if(!c)return'<div class="empty">Crew não encontrada</div>';const mine=S.me.crew===id;
  const mem=[...(mine?[{h:S.me.handle,n:S.me.name,g:ME_G,wk:wkHex(),me:true}]:[]),...P.filter(p=>p.crew===id)].sort((a,b)=>b.wk-a.wk);
  const rival=id==='Rosa Choque'?'Turbo Clan':'Rosa Choque',a=c.hex+(mine?Object.keys(S.hexes).length:0),b=CREWS[rival].hex,pa=Math.round(a/(a+b)*100);
  const posts=FPOSTS.filter(p=>(person(p.h)||{}).crew===id);
  return`<div class="scroll" style="padding-top:0"><div class="cover" style="--cc:${c.c}66"></div><button class="ib glass" data-back style="position:absolute;left:14px;top:calc(14px + var(--safeT))">${ic(I.back)}</button>
  <div style="margin-top:-30px;display:flex;align-items:flex-end;gap:12px"><span class="crewb" style="background:${c.c};width:68px;height:68px;border-radius:20px;border:4px solid var(--bg)">${ic(I.hex,30,2.4)}</span><div style="flex:1"></div><button class="fbtn ${mine?'on':''}" data-on="join">${mine?'Você é membro':'Entrar na crew'}</button></div>
  <div style="margin:10px 4px 0"><div style="font-size:26px;font-weight:800">${esc(id)}</div><div class="small muted">${c.m+(mine?1:0)} membros · Belo Horizonte</div><div style="margin-top:8px;font-size:14px">${esc(c.d)}</div></div>
  <div class="card" style="margin-top:14px"><div class="row small b" style="justify-content:space-between"><span style="color:${c.c}">${esc(id)} ${pa}%</span><span style="color:${CREWS[rival].c}">${100-pa}% ${esc(rival)}</span></div><div class="war" style="margin-top:8px"><i style="width:${pa}%;background:${c.c}"></i><i style="flex:1;background:${CREWS[rival].c}"></i></div><div class="small muted" style="margin-top:8px">Guerra de território na região central · termina domingo${mine?` · você contribuiu com <b class="lime">${Object.keys(S.hexes).length} hex</b>`:''}</div></div>
  <div class="sec-t">Membros</div><div class="card list" style="padding:4px 14px">${mem.map((m,i)=>`<button class="row press" data-on="prof" data-h="${esc(m.h)}" style="width:100%;text-align:left;padding:10px 0"><span class="small muted b" style="width:18px">${i+1}</span>${av(ini(m.n),38,m.g)}<div style="flex:1"><div class="b" style="font-size:14px">${esc(m.n)}${m.me?' (você)':''}</div><div class="small muted">${i===0?'Líder da semana':'@'+esc(m.h)}</div></div><b>${m.wk} <span class="small muted">hex</span></b></button>`).join('')}</div>
  ${posts.length?`<div class="sec-t">Rolês da crew</div>${posts.map(postCard).join('')}`:''}</div>`;},
 on:{...postHandlers,join(){const id=this.params.id;if(S.me.crew===id){if(!confirm(`Sair da ${id}?`))return;S.me.crew='';toast('Você saiu da crew','dark');}else{if(S.me.crew&&!confirm(`Trocar ${S.me.crew} por ${id}?`))return;S.me.crew=id;toast(`Bem-vindo à ${id}!`);}save();router.render(this,true,true);}}};
/* ---------- MEU PERFIL ---------- */
SCREENS.profile={tab:'profile',
 html(){const tot=myKm(),nh=Object.keys(S.hexes).length,c=CREWS[S.me.crew];const nf=Object.keys(S.follow).length;
  return`<div class="scroll" style="padding-top:0"><div class="cover" style="--cc:${c?c.c+'55':'#2B3519'}"></div><button class="ib glass" data-on="settings" style="position:absolute;right:14px;top:calc(14px + var(--safeT))">${ic(I.gear)}</button>
  <div style="margin-top:-38px;display:flex;align-items:flex-end;gap:12px"><span style="border:4px solid var(--bg);border-radius:99px;display:inline-flex">${av(ini(S.me.name),78,ME_G)}</span><div style="flex:1"></div><button class="btn sm sec" data-on="edit">Editar perfil</button></div>
  <div style="margin:10px 4px 0"><div style="font-size:26px;font-weight:800">${esc(S.me.name)}</div><div class="small muted">@${esc(S.me.handle)} · nível ${S.me.level}${S.me.crew?` · <button data-go="crew" data-p='${JSON.stringify({id:S.me.crew})}' class="b" style="color:${c?c.c:'var(--lime2)'}">${esc(S.me.crew)}</button>`:''}</div>${S.me.bio?`<div style="margin-top:8px;font-size:14px">${esc(S.me.bio)}</div>`:''}
  <div class="row small" style="margin-top:8px;gap:14px"><span><b>${37+Object.keys(S.follow).length%5}</b> <span class="muted">seguidores</span></span><button data-go="explore"><b>${nf}</b> <span class="muted">seguindo</span></button></div></div>
  <div class="card stat3" style="margin-top:14px;padding:14px 0"><div><b class="lime">${nh}</b><span>hexágonos</span></div><div><b>${S.rides.length}</b><span>rolês</span></div><div><b>${fmtKm(tot*1000)}</b><span>km</span></div></div>
  <button class="card row press" data-go="ranking" style="width:100%;text-align:left;margin-top:10px"><span class="ib" style="width:42px;height:42px;color:var(--lime2)">${ic(TROPHY,20)}</span><div style="flex:1"><div class="b">Ranking da semana</div><div class="small muted">${wkHex()} hex nos últimos 7 dias</div></div>${ic(I.back,18).replace('<svg','<svg style="transform:rotate(180deg)"')}</button>
  <div class="sec-t">Seus rolês</div>${S.rides.length?S.rides.map(r=>`<button class="card row press" data-go="summary" data-p='${JSON.stringify({id:r.id})}' style="width:100%;text-align:left;margin-bottom:8px;padding:8px"><div style="width:62px;height:62px;border-radius:14px;overflow:hidden;flex-shrink:0">${trackSVG(r.track,62,62)}</div><div style="flex:1"><div class="b">${esc(r.dest?'Até '+r.dest:r.mode==='terr'?'Território':'Rolê livre')}</div><div class="small muted">${new Date(r.t).toLocaleDateString('pt-BR')} · ${fmtKm(r.dist)} km · ${fmtT(r.sec)}</div></div><span class="lime b small" style="padding-right:8px">+${r.hex} hex</span></button>`).join(''):'<div class="card empty">Nenhum rolê ainda. Toque no + pra começar.</div>'}</div>`;},
 on:{edit(){sheet(`<div style="font-size:20px;font-weight:800">Editar perfil</div><label class="f">Nome</label><input class="inp" id="en" value="${esc(S.me.name)}" maxlength="30"><label class="f">Usuário</label><input class="inp" id="eh" value="${esc(S.me.handle)}" maxlength="20"><label class="f">Bio</label><input class="inp" id="eb" value="${esc(S.me.bio||'')}" maxlength="80" placeholder="Uma frase sobre seus rolês"><button class="btn" id="es" style="margin-top:16px">Salvar</button>`,(w,close)=>{$('#es',w).onclick=()=>{const n=$('#en',w).value.trim(),h=$('#eh',w).value.trim().toLowerCase().replace(/[^a-z0-9._]/g,'');if(n.length<2||h.length<3){toast('Nome ou usuário muito curto','dark');return;}S.me.name=n;S.me.handle=h;S.me.bio=$('#eb',w).value.trim();save();close();router.tabTo('profile');toast('Perfil atualizado');};});},
  settings(){sheet(`<div style="font-size:20px;font-weight:800;margin-bottom:6px">Ajustes</div>
   <div class="row" style="padding:12px 0" id="s1"><div style="flex:1"><div class="b">Modo simulação</div><div class="small muted">O carro anda sozinho, pra testar parado</div></div><span class="switch ${S.settings.simulate?'on':''}"></span></div>
   <div class="row" style="padding:12px 0" id="s2"><div style="flex:1"><div class="b">Avisos por voz</div></div><span class="switch ${S.settings.voice?'on':''}"></span></div>
   <button class="btn danger" id="rs" style="margin-top:12px">Apagar meus dados do protótipo</button>`,(w)=>{
   $('#s1',w).onclick=()=>{S.settings.simulate=!S.settings.simulate;save();$('#s1 .switch',w).classList.toggle('on');};
   $('#s2',w).onclick=()=>{S.settings.voice=!S.settings.voice;save();$('#s2 .switch',w).classList.toggle('on');};
   $('#rs',w).onclick=()=>{if(confirm('Apagar rolês, hexágonos, carros e ajustes?')){localStorage.removeItem('role.v2');location.reload();}};});}}};
})();
