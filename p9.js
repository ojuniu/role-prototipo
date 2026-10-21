/* Rolê p9: criar (post/story), garagem no perfil, foto de perfil, seletor de veículos (FIPE), voltar do Android, cliques em perfil/carro, cor de destaque, crews */
(function(){
const RL=window.__role;const {S,router,SCREENS,save,toast,sheet,ic,I,esc,$,$$,ago}=RL;const C=RL.comm;
const mk=RL.modelKey||(x=>x);
const X='<path d="M6 6l12 12M18 6L6 18"/>',CHEV='<path d="M9 6l6 6-6 6"/>',BACK='<path d="M15 5l-7 7 7 7"/>',PLUS='<path d="M12 5v14M5 12h14"/>',SRCH='<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>';
const GRID='<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>';
const STORY='<circle cx="12" cy="12" r="9" stroke-dasharray="3 2.4"/><path d="M12 8v8M8 12h8"/>',ROUTE='<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/>';
const CAL='<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',PIN='<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>';
const CAM='<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',TRASH='<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>';
const CARI='<path d="M4 16v-3.5l2-5A2 2 0 0 1 7.9 6h8.2a2 2 0 0 1 1.9 1.5l2 5V16"/><path d="M3 16h18"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>';
const MOTOI='<circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5L9 9h5l4.5 7.5M12 9l-1.5-3H8M14 9h3"/>';
const TRUCKI='<path d="M2 6h11v10H2zM13 9h5l3 3.5V16h-8z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>';
const carImg=c=>c.front?`<img src="${c.front}" alt="">`:(RL.picTag?RL.picTag(mk(c.model),'g'+c.id,'real'):'')||(RL.silh?RL.silh(c.type==='moto'?'moto':'car'):'');

/* ================= estilos ================= */
const st=document.createElement('style');st.textContent=`
:root{--lime3:color-mix(in srgb,var(--lime) 70%,#000)}
.stk-layer{display:none!important}
.evmap .smapw .smap{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
/* garagem no perfil */
.pgar{margin:10px 16px 2px;border-radius:24px;background:var(--surf);border:1px solid var(--line);overflow:hidden}
.pgh{display:flex;align-items:center;padding:12px 16px 0}.pgh b{flex:1;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--tx3)}.pgh button{font-size:13px;font-weight:700;color:var(--acc-ink,var(--lime2));display:flex;align-items:center;gap:2px}
.pgs{position:relative;height:132px;perspective:900px;touch-action:pan-y;cursor:grab}
.pgi{position:absolute;left:50%;top:50%;width:62%;height:118px;margin:-59px 0 0 -31%;display:flex;align-items:center;justify-content:center;transition:transform .42s cubic-bezier(.2,.8,.2,1),opacity .3s,filter .3s;will-change:transform}
.pgs.drag .pgi{transition:none}.pgi img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 12px 14px rgba(0,0,0,.35))}
.pgi svg{width:70%;height:auto;opacity:.5}
.pgt{display:flex;align-items:flex-end;gap:10px;padding:0 16px 12px}.pgt .n{flex:1;min-width:0}.pgt .n b{display:block;font-size:17px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pgt .n small{color:var(--tx3);font-size:12.5px}
.pgt .on{font-size:11px;font-weight:800;padding:4px 9px;border-radius:99px;background:color-mix(in srgb,var(--lime) 18%,transparent);color:var(--acc-ink,var(--lime2))}
.pgd{display:flex;gap:5px;justify-content:center;padding:0 0 12px}.pgd i{width:6px;height:6px;border-radius:9px;background:var(--line2);transition:all .25s}.pgd i.on{width:16px;background:var(--lime)}
.pgempty{display:flex;align-items:center;gap:12px;padding:14px 16px 16px}.pgempty span{flex:1;font-size:13.5px;color:var(--tx3)}
.pqk{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px 16px 6px}
.pqk button{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border-radius:18px;background:var(--surf);border:1px solid var(--line);font-size:12px;font-weight:700;color:var(--tx2)}
/* criar */
.crs h3{margin:2px 4px 12px;font-size:20px;font-weight:800}
.crs .op{display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:12px 6px;border-radius:16px}
.crs .op:active{background:var(--line)}
.crs .op .ii{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:var(--line);color:var(--tx)}
.crs .op.hl .ii{background:var(--lime);color:var(--on-acc,#0A0B0A)}
.crs .op b{display:block;font-size:16px}.crs .op small{color:var(--tx3);font-size:13px}
/* compose */
.cmp2{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--bg)}
.cmp2 .x-top h2{flex:1;text-align:center;font-size:17px;margin:0}
.cmp2 .pub{height:38px;padding:0 16px;border-radius:99px;background:var(--lime);color:var(--on-acc,#0A0B0A);font-weight:800;font-size:14px}
.cmp2 .pub:disabled{opacity:.4}
.cfp{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 16px 0;scrollbar-width:none}.cfp::-webkit-scrollbar{display:none}
.cfp .fr{flex:0 0 calc(100% - 32px);scroll-snap-align:center;aspect-ratio:3/4;border-radius:22px;overflow:hidden;background:#000;position:relative}
.cmp2.mstory .cfp .fr{aspect-ratio:9/16;max-height:62vh;flex-basis:auto;width:min(calc(100% - 32px),calc(62vh*9/16));margin:0 auto}
.cfp .fr img,.cfp .fr video{width:100%;height:100%;object-fit:cover;display:block}
.cfp .fr .cap2{position:absolute;left:14px;right:14px;bottom:18px;text-align:center;font-weight:800;font-size:18px;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.cfp .nn{position:absolute;top:12px;right:12px;font-size:12px;font-weight:800;padding:4px 9px;border-radius:99px;background:rgba(0,0,0,.55);color:#fff}
.cdrop{flex:1 0 calc(100% - 32px);aspect-ratio:3/4;border-radius:22px;border:1.5px dashed var(--line2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--tx3);font-size:14px;font-weight:600;background:var(--surf)}
.cmp2.mstory .cdrop{aspect-ratio:9/16;max-height:62vh}
.cdrop .ii{width:64px;height:64px;border-radius:22px;background:var(--lime);color:var(--on-acc,#0A0B0A);display:flex;align-items:center;justify-content:center}
.cdrop b{color:var(--tx);font-size:16px}
.cth{display:flex;gap:8px;overflow-x:auto;padding:12px 16px 2px;scrollbar-width:none}.cth::-webkit-scrollbar{display:none}
.cth>div,.cth>button{flex:0 0 58px;height:58px;border-radius:14px;overflow:hidden;position:relative;background:var(--surf);border:1px solid var(--line)}
.cth img,.cth video{width:100%;height:100%;object-fit:cover}.cth>div.on{outline:2px solid var(--lime);outline-offset:1px}
.cth [data-x]{position:absolute;top:3px;right:3px;width:20px;height:20px;border-radius:20px;background:rgba(0,0,0,.65);color:#fff;display:flex;align-items:center;justify-content:center}
.cth .add{display:flex;align-items:center;justify-content:center;color:var(--tx3)}
.cmf{padding:6px 16px 0}
.cmf .capw{display:flex;gap:12px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--line)}
.cmf textarea{flex:1;background:none;border:none;outline:none;color:var(--tx);font:inherit;font-size:15.5px;resize:none;min-height:60px;padding-top:6px}
.cmf .lb{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--tx3);margin:16px 0 8px}
.cvs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -16px;padding:0 16px}.cvs::-webkit-scrollbar{display:none}
.cvs button{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:6px 14px 6px 6px;border-radius:99px;background:var(--surf);border:1px solid var(--line);font-size:13.5px;font-weight:700}
.cvs button .p{width:40px;height:30px;border-radius:99px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--line)}.cvs button .p img{max-width:100%;max-height:100%;object-fit:contain}
.cvs button.on{border-color:var(--lime);background:color-mix(in srgb,var(--lime) 14%,transparent)}
.clo{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.clo button{padding:11px 6px;border-radius:14px;background:var(--surf);border:1px solid var(--line);font-size:13px;font-weight:700}
.clo button.on{border-color:var(--lime);background:color-mix(in srgb,var(--lime) 14%,transparent)}
.cmode{display:flex;justify-content:center;gap:4px;padding:10px 0 calc(12px + var(--safeB));border-top:1px solid var(--line)}
.cmode button{padding:9px 20px;border-radius:99px;font-weight:800;font-size:13px;letter-spacing:.08em;color:var(--tx3)}
.cmode button.on{background:var(--tx);color:var(--bg)}
.cstin{width:100%;margin-top:14px;height:48px;border-radius:14px;border:1px solid var(--line);background:var(--surf);color:var(--tx);padding:0 14px;font:inherit;font-size:15px}
/* foto de perfil */
.avz{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;animation:avf .22s ease}
.avz .bd{position:absolute;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(14px)}
.avz .in{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;width:100%;padding:0 28px;animation:avs .32s cubic-bezier(.2,.9,.2,1)}
.avz .big{width:240px;height:240px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
.avz .big>*{transform:scale(1)}.avz .big img{width:100%;height:100%;object-fit:cover}
.avz b{font-size:20px;color:#fff}.avz span.h{color:rgba(255,255,255,.6);font-size:14px}
.avz .acts{display:flex;flex-direction:column;gap:8px;width:100%;max-width:340px;margin-top:22px}
.avz .acts button{width:100%;height:50px;border-radius:16px;background:rgba(255,255,255,.1);color:#fff;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;gap:8px}
.avz .acts button.p{background:var(--lime);color:#0A0B0A}
.avz .cars{display:flex;gap:10px;overflow-x:auto;width:100%;max-width:340px;padding-top:6px}
.avz .cars button{flex:0 0 96px;height:72px;border-radius:14px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;overflow:hidden}.avz .cars img{max-width:100%;max-height:100%;object-fit:contain}
@keyframes avf{from{opacity:0}}@keyframes avs{from{opacity:0;transform:scale(.9)}}
/* seletor de veículo */
.vf .x-top h2{flex:1;font-size:17px;margin:0}
.vf .stp{display:flex;gap:4px;padding:0 16px 8px}.vf .stp i{flex:1;height:3px;border-radius:3px;background:var(--line2)}.vf .stp i.on{background:var(--lime)}
.vtyp{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px 16px 10px}
.vtyp button{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 6px 12px;border-radius:18px;background:var(--surf);border:1.5px solid var(--line);font-weight:800;font-size:13.5px;color:var(--tx2)}
.vtyp button.on{border-color:var(--lime);color:var(--tx);background:color-mix(in srgb,var(--lime) 12%,transparent)}
.vsr{margin:0 16px 6px;display:flex;align-items:center;gap:10px;height:48px;border-radius:16px;background:var(--surf);border:1px solid var(--line);padding:0 14px;color:var(--tx3)}
.vsr input{flex:1;background:none;border:none;outline:none;color:var(--tx);font:inherit;font-size:15.5px}
.vlb{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--tx3);padding:14px 18px 8px}
.vpop{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 6px;padding:0 12px}
.vpop button{display:flex;flex-direction:column;align-items:center;gap:7px;font-size:12px;font-weight:700;color:var(--tx2);min-width:0}
.vpop button span:last-child{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mono{width:56px;height:56px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:17px;letter-spacing:-.02em;color:#fff;flex-shrink:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.mono.s{width:40px;height:40px;border-radius:13px;font-size:13.5px}
.vlist button{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:8px 16px;font-size:15.5px;font-weight:700}
.vlist button:active{background:var(--line)}.vlist button .gr{flex:1}.vlist button .gr small{display:block;color:var(--tx3);font-weight:600;font-size:12.5px}
.vlist .lt{position:sticky;top:0;background:var(--bg);padding:8px 18px 4px;font-size:12px;font-weight:800;color:var(--tx3);z-index:1}
.vmods{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 16px}
.vmods button{padding:14px 14px;border-radius:16px;background:var(--surf);border:1px solid var(--line);text-align:left;font-weight:800;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vmods button:active{border-color:var(--lime)}
.vsel{display:flex;align-items:center;gap:12px;margin:4px 16px 8px;padding:12px;border-radius:20px;background:var(--surf);border:1px solid var(--line)}
.vsel .gr{flex:1;min-width:0}.vsel .gr b{display:block;font-size:17px}.vsel .gr small{color:var(--tx3)}
.vsel button{font-size:13px;font-weight:800;color:var(--acc-ink,var(--lime2))}
.vfrm{padding:0 16px}.vfrm .lb{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--tx3);margin:16px 2px 8px}
.vfrm select,.vfrm input{width:100%;height:50px;border-radius:15px;background:var(--surf);border:1px solid var(--line);color:var(--tx);padding:0 14px;font:inherit;font-size:15px}
.vfrm .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.vyrs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -16px;padding:0 16px}.vyrs::-webkit-scrollbar{display:none}
.vyrs button{flex:0 0 auto;padding:10px 15px;border-radius:14px;background:var(--surf);border:1px solid var(--line);font-weight:800;font-size:14px}
.vyrs button.on{background:var(--tx);color:var(--bg);border-color:var(--tx)}
.vcol{display:flex;gap:10px;flex-wrap:wrap}
.vcol button{width:38px;height:38px;border-radius:50%;border:2px solid var(--line2);position:relative}
.vcol button.on{outline:2.5px solid var(--lime);outline-offset:2px}
.vseg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.vseg button{height:46px;border-radius:14px;background:var(--surf);border:1.5px solid var(--line);font-weight:800;font-size:14px}
.vseg button.on{border-color:var(--lime);background:color-mix(in srgb,var(--lime) 12%,transparent)}
.vsave{position:sticky;bottom:0;padding:14px 16px calc(14px + var(--safeB));background:linear-gradient(transparent,var(--bg) 30%)}
.vsave button{width:100%;height:54px;border-radius:99px;background:var(--lime);color:var(--on-acc,#0A0B0A);font-weight:800;font-size:16px}
.vload{padding:30px;text-align:center;color:var(--tx3)}
.vman{display:block;margin:18px auto 30px;font-size:14px;font-weight:700;color:var(--tx3);text-decoration:underline}
/* nomes e carros clicáveis */
.ig-h .nm2{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;line-height:1.25}
.ig-h .nm2 button{font:inherit;color:inherit;padding:0;text-align:left}
.ig-h .nm2 .u b{font-size:14.5px}.ig-h .nm2 .sub{font-size:12.5px;color:var(--tx3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.ig-h .nm2 .sub button{color:var(--tx2);font-weight:700}
.ig-c button.u{font-weight:800;margin-right:6px;padding:0;font:inherit;font-weight:800;color:inherit}
.crj{margin-left:auto;height:34px;padding:0 14px;border-radius:99px;background:var(--lime);color:var(--on-acc,#0A0B0A);font-weight:800;font-size:13px;flex-shrink:0}
.crj.sec{background:var(--line);color:var(--tx)}
`;document.head.appendChild(st);

/* ================= foto de perfil ================= */
const A0=RL.avatar2;
RL.avatar2=function(w,s){if(w&&w.me&&S.me.photo){const h=`<span class="av avc" style="width:${s}px;height:${s}px;overflow:hidden"><img class="ok" src="${S.me.photo}" style="width:100%;height:100%;object-fit:cover;opacity:1" alt=""></span>`;const f=S.me.frame;return f&&f!=='none'?`<span class="avf f-${f}">${h}</span>`:h;}return A0?A0.call(this,w,s):'';};
function resizeSq(file,px){return new Promise((ok,no)=>{const u=URL.createObjectURL(file);const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=px;const x=c.getContext('2d');const m=Math.min(im.width,im.height);x.drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,px,px);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.86));};im.onerror=no;im.src=u;});}
function avatarViewer(){const w=document.createElement('div');w.className='avz';
  const draw=()=>{w.innerHTML=`<div class="bd"></div><div class="in"><div class="big">${RL.avatar2({me:true},240)}</div><b>${esc(S.me.name||'')}</b><span class="h">@${esc(S.me.handle||'')}</span>
   <div class="acts"><button class="p" data-a="pick">${ic(CAM,18)}Trocar foto</button>${S.cars.length?`<button data-a="car">${ic(CARI,18)}Usar foto de um veículo</button>`:''}${S.me.photo?`<button data-a="rm">${ic(TRASH,18)}Remover foto</button>`:''}<button data-a="x" style="background:none">Fechar</button></div>
   <div class="cars" id="avc" style="display:none">${S.cars.map(c=>`<button data-c="${c.id}">${carImg(c)}</button>`).join('')}</div></div><input type="file" accept="image/*" hidden>`;};
  draw();document.getElementById('app').appendChild(w);
  const close=()=>{w.style.transition='opacity .18s';w.style.opacity=0;setTimeout(()=>w.remove(),180);const el=router.cur&&router.cur.el;if(router.cur&&router.cur.name==='profile')router.render(router.cur,true,true);};
  w.addEventListener('click',async e=>{if(e.target.classList.contains('bd')){close();return;}const b=e.target.closest('[data-a],[data-c]');if(!b)return;
   if(b.dataset.c){S.me.feat=b.dataset.c;delete S.me.photo;save();draw();toast('Foto atualizada');return;}
   const a=b.dataset.a;if(a==='x')close();else if(a==='pick')$('input',w).click();else if(a==='rm'){delete S.me.photo;save();draw();}else if(a==='car'){const c=$('#avc',w);c.style.display=c.style.display==='none'?'flex':'none';}});
  w.addEventListener('change',async e=>{const f=e.target.files&&e.target.files[0];if(!f)return;try{S.me.photo=await resizeSq(f,420);save();draw();toast('Foto atualizada');}catch(x){toast('Não deu pra abrir essa imagem','dark');}});}
RL.avatarViewer=avatarViewer;

/* ================= garagem no perfil (arrastar) ================= */
RL.pgarHTML=function(){const cs=S.cars;if(!cs.length)return`<div class="pgar"><div class="pgh"><b>Garagem</b></div><div class="pgempty"><span>Cadastre seu carro ou moto pra aparecer no mapa e nos posts.</span><button class="crj" data-go="carForm">Adicionar</button></div></div>`;
  let ci=SCREENS.profile._ci;if(ci==null||ci>=cs.length){ci=Math.max(0,cs.findIndex(c=>c.id===S.me.feat||c.active));}SCREENS.profile._ci=ci;const c=cs[ci];
  return`<div class="pgar"><div class="pgh"><b>Garagem · ${cs.length}</b><button data-on="pgadd" aria-label="Adicionar veículo">${ic(PLUS,15,2.6)}</button><button data-on="pgopen" style="margin-left:12px">Abrir ${ic(CHEV,14,2.6)}</button></div>
   <div class="pgs" id="pgs">${cs.map((c,i)=>`<div class="pgi" data-i="${i}">${carImg(c)}</div>`).join('')}</div>
   <div class="pgt" id="pgt">${pgtH(c)}</div>${cs.length>1?`<div class="pgd">${cs.map((_,i)=>`<i class="${i===ci?'on':''}"></i>`).join('')}</div>`:''}</div>`;};
function pgtH(c){return`<div class="n"><b>${esc(c.model)}</b><small>${esc([c.year,c.color,c.ver].filter(Boolean).join(' · '))}</small></div>${c.active?'<span class="on">No mapa</span>':''}`;}
RL.pgarMount=function(el){const gc=$('#pgs',el);if(!gc)return;const ims=$$('.pgi',gc),n=ims.length;let ci=SCREENS.profile._ci||0;
  const place=dx=>{const W=gc.clientWidth||340;ims.forEach((e,i)=>{const p=(i-ci)+dx/W;const ap=Math.abs(p);e.style.transform=`translateX(${p*W*.62}px) scale(${1-Math.min(1,ap)*.38}) rotateY(${Math.max(-1,Math.min(1,p))*-20}deg)`;e.style.opacity=ap>1.5?0:1-Math.min(1,ap)*.65;e.style.filter=ap>.05?`blur(${Math.min(1,ap)*3}px)`:'';e.style.zIndex=10-Math.round(ap*3);});};
  place(0);
  const go=i=>{i=Math.max(0,Math.min(n-1,i));if(i!==ci){ci=i;SCREENS.profile._ci=i;navigator.vibrate&&navigator.vibrate(8);const t=$('#pgt',el);t.style.opacity=0;setTimeout(()=>{t.innerHTML=pgtH(S.cars[i]);t.style.opacity=1;},140);$$('.pgd i',el).forEach((d,k)=>d.classList.toggle('on',k===i));}place(0);};
  const t=$('#pgt',el);if(t)t.style.transition='opacity .14s';
  let sx=null,sy=0,dx=0,t0=0,lock=null,moved=false;
  gc.addEventListener('touchstart',e=>{const p=e.touches[0];sx=p.clientX;sy=p.clientY;dx=0;lock=null;moved=false;t0=Date.now();},{passive:true});
  gc.addEventListener('touchmove',e=>{if(sx==null)return;const p=e.touches[0],ddx=p.clientX-sx,ddy=p.clientY-sy;if(!lock){if(Math.abs(ddx)>7&&Math.abs(ddx)>Math.abs(ddy))lock='x';else if(Math.abs(ddy)>9){lock='y';sx=null;return;}else return;gc.classList.add('drag');}
   moved=true;dx=ddx;if((ci===0&&dx>0)||(ci===n-1&&dx<0))dx*=.35;place(dx);if(e.cancelable)e.preventDefault();},{passive:false});
  const end=()=>{if(sx==null)return;sx=null;gc.classList.remove('drag');if(lock!=='x')return;const W=gc.clientWidth,v=dx/Math.max(1,Date.now()-t0);let i=ci;if(dx<-W*.16||v<-.4)i++;else if(dx>W*.16||v>.4)i--;go(i);gc._dt=Date.now();};
  gc.addEventListener('touchend',end);gc.addEventListener('touchcancel',end);
  let mx=null;gc.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;mx=e.clientX;});gc.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse'||mx==null)return;const d=e.clientX-mx;mx=null;if(Math.abs(d)>40){go(ci+(d<0?1:-1));gc._dt=Date.now();}});
  ims.forEach((e,k)=>e.addEventListener('click',()=>{if(Date.now()-(gc._dt||0)<350)return;if(k!==ci)go(k);else{SCREENS.garage.ci=k;router.go('garage');}}));
  $$('.pgd i',el).forEach((d,k)=>d.onclick=()=>go(k));};
const PO=SCREENS.profile.on;PO.pgopen=function(){SCREENS.garage.ci=SCREENS.profile._ci||0;router.go('garage');};PO.pgadd=()=>router.go('carForm',{});

/* ================= criar (como no Instagram) ================= */
function createSheet(){sheet(`<div class="crs"><h3>Criar</h3>
  <button class="op hl" data-k="post"><span class="ii">${ic(GRID,22)}</span><span><b>Post</b><small>Fotos e vídeos no feed</small></span></button>
  <button class="op" data-k="story"><span class="ii">${ic(STORY,22)}</span><span><b>Story</b><small>Some em 24 horas</small></span></button>
  <button class="op" data-k="ride"><span class="ii">${ic(ROUTE,22)}</span><span><b>Rolê</b><small>Gravar o trajeto e pintar hexágonos</small></span></button>
  <button class="op" data-k="ev"><span class="ii">${ic(CAL,22)}</span><span><b>Evento</b><small>Encontro, rolê da crew, motociata</small></span></button>
  <button class="op" data-k="trip"><span class="ii">${ic(PIN,22)}</span><span><b>Viagem</b><small>Planejar rota, custo e quem vai</small></span></button></div>`,(w,close)=>{
  $$('.op',w).forEach(b=>b.onclick=()=>{close();const k=b.dataset.k;if(k==='post'||k==='story')router.go('compose',{mode:k});else if(k==='ride')router.go('startRide');else if(k==='ev')router.go(SCREENS.eventNew?'eventNew':'events');else router.go('trips');});});}
RL.createSheet=createSheet;

/* ================= nova tela de post / story ================= */
const MAXM=10;
SCREENS.compose={tabbar:false,
 html(p){const m=this.mode=this.mode||(p&&p.mode)||'post';return`<div class="cmp2 ${m==='story'?'mstory':'mpost'}">
  <div class="x-top"><button class="rb" data-back aria-label="Fechar">${ic(X,20)}</button><h2>${m==='story'?'Novo story':'Nova publicação'}</h2><button class="pub" data-on="pub" id="pubb" disabled>${m==='story'?'Compartilhar':'Publicar'}</button></div>
  <div class="xs" id="cpx" style="flex:1"><div class="cfp" id="cfp"></div><div class="cth" id="cth"></div><div id="cmf"></div></div>
  <div class="cmode"><button data-on="mode" data-k="post" class="${m==='post'?'on':''}">POST</button><button data-on="mode" data-k="story" class="${m==='story'?'on':''}">STORY</button></div>
  <input type="file" id="cf" accept="image/*,video/*" ${m==='story'?'':'multiple'} hidden></div>`;},
 mount(el){this.files=this.files||[];this.car=this.car!==undefined?this.car:(S.cars.find(c=>c.active)||S.cars[0]||{}).id||'';this.loc=this.loc||S.me.mediaLoc||'city';this.cur=this.cur||0;
  const inp=$('#cf',el);inp.onchange=e=>{const max=this.mode==='story'?1:MAXM;for(const f of e.target.files){if(this.mode==='story')this.files=[];if(this.files.length>=max)break;if(f.type.startsWith('video')&&f.size>80e6){toast('Vídeo muito grande (máx. 80 MB)','dark');continue;}this.files.push({f,type:f.type,u:URL.createObjectURL(f)});}inp.value='';this.draw();};
  this.draw();if(!this.files.length&&!this._asked){this._asked=1;setTimeout(()=>inp.click(),300);}},
 draw(){const el=this.el,m=this.mode,fs=this.files;const pv=$('#cfp',el);
  const med=(x,i)=>x.type.startsWith('video')?`<video src="${x.u}" muted playsinline loop autoplay></video>`:`<img src="${x.u}" alt="">`;
  pv.innerHTML=fs.length?fs.map((x,i)=>`<div class="fr">${med(x,i)}${fs.length>1?`<span class="nn">${i+1}/${fs.length}</span>`:''}${m==='story'&&this.cap?`<div class="cap2">${esc(this.cap)}</div>`:''}</div>`).join(''):`<button class="cdrop" data-on="pick"><span class="ii">${ic(CAM,28)}</span><b>${m==='story'?'Escolha uma foto ou vídeo':'Escolha fotos ou vídeos'}</b><span>${m==='story'?'Vertical fica melhor':'Até 10 · no feed aparecem em 3:4'}</span></button>`;
  $$('video',pv).forEach(v=>{v.muted=true;v.play().catch(()=>{});});
  const th=$('#cth',el);th.innerHTML=fs.length&&m==='post'?fs.map((x,i)=>`<div data-t="${i}">${x.type.startsWith('video')?`<video src="${x.u}" muted playsinline></video>`:`<img src="${x.u}" alt="">`}<button data-x="${i}" aria-label="Remover">${ic(X,11,3)}</button></div>`).join('')+(fs.length<MAXM?`<button class="add" data-on="pick" aria-label="Adicionar">${ic(PLUS,22)}</button>`:''):'';
  $$('[data-x]',th).forEach(b=>b.onclick=e=>{e.stopPropagation();this.files.splice(+b.dataset.x,1);this.draw();});
  $$('[data-t]',th).forEach(b=>b.onclick=()=>{const fr=$$('.fr',pv)[+b.dataset.t];if(fr)fr.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});});
  const mf=$('#cmf',el);
  if(m==='story'){mf.innerHTML=fs.length?`<div style="padding:0 16px"><input class="cstin" id="scap" maxlength="80" placeholder="Escrever algo no story (opcional)" value="${esc(this.cap||'')}"></div>`:'';const sc=$('#scap',el);if(sc)sc.oninput=()=>{this.cap=sc.value;const c=$('.cap2',pv);if(c)c.textContent=sc.value;else if(sc.value){const fr=$('.fr',pv);if(fr)fr.insertAdjacentHTML('beforeend',`<div class="cap2">${esc(sc.value)}</div>`);}};}
  else{const city=RL.myCity?RL.myCity():'';mf.innerHTML=`<div class="cmf"><div class="capw">${RL.avatar2?RL.avatar2({me:true},36):''}<textarea id="ct" maxlength="300" placeholder="Escreva uma legenda…">${esc(this.txt||'')}</textarea></div>
    ${S.cars.length?`<div class="lb">Veículo</div><div class="cvs">${S.cars.map(c=>`<button data-car2="${c.id}" class="${this.car===c.id?'on':''}"><span class="p">${carImg(c)}</span>${esc(c.model)}</button>`).join('')}<button data-car2="" class="${!this.car?'on':''}" style="padding-left:14px">Nenhum</button></div>`:''}
    <div class="lb">Localização</div><div class="clo">${[['city',city||'Cidade'],['street','Rua'],['hidden','Ocultar']].map(([k,n])=>`<button data-l="${k}" class="${this.loc===k?'on':''}">${esc(n)}</button>`).join('')}</div>
    <div class="small muted" style="margin:8px 2px 24px">${this.loc==='hidden'?'O post não mostra onde você está.':this.loc==='street'?'Mostra só o nome da rua mais próxima, nunca o número.':'Mostra só a cidade.'}</div></div>`;
   const ct=$('#ct',el);ct.oninput=()=>{this.txt=ct.value;};
   $$('[data-car2]',el).forEach(b=>b.onclick=()=>{this.car=b.dataset.car2;$$('[data-car2]',el).forEach(x=>x.classList.toggle('on',x===b));});
   $$('[data-l]',el).forEach(b=>b.onclick=()=>{this.loc=b.dataset.l;this.draw();});}
  $('#pubb',el).disabled=!fs.length;},
 on:{pick(){$('#cf',this.el).click();},
  mode(a){if(a.dataset.k===this.mode)return;this.mode=a.dataset.k;if(this.mode==='story'&&this.files.length>1)this.files=this.files.slice(0,1);router.render(this,true,true);},
  async pub(a){if(!this.files.length){toast('Escolha uma foto ou vídeo','dark');return;}if(!RL.putM){toast('Armazenamento indisponível','dark');return;}a.disabled=true;a.textContent='Enviando…';
   try{const media=[];for(const x of this.files){const k='m'+Date.now()+Math.random().toString(36).slice(2,7);const b=RL.shrink?await RL.shrink(x.f):x.f;await RL.putM(k,b);media.push({k,type:x.type.startsWith('video')?'video':'image'});}
    if(this.mode==='story'){S.myStories=(S.myStories||[]).filter(s=>s.t>Date.now()-864e5);S.myStories.push({id:'s'+Date.now(),t:Date.now(),k:media[0].k,type:media[0].type,cap:(this.cap||'').trim()});save();
     this.files=[];router.stack=[];router.tabTo('home');toast('Story publicado');return;}
    const car=S.cars.find(c=>c.id===this.car);const p={id:'p'+Date.now(),t:Date.now(),me:true,kind:'media',media,txt:(this.txt||'').trim(),car:car?car.model:'',loc:this.loc,horn:0,cmts:[]};
    if(this.loc==='city')p.city=RL.myCity?RL.myCity():'';S.me.mediaLoc=this.loc;S.posts.unshift(p);save();
    if(this.loc==='street'&&RL.gps){try{const c=S.lastPos;if(c)fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=16&accept-language=pt-BR&lat=${c[1]}&lon=${c[0]}`).then(r=>r.json()).then(j=>{const ad=j.address||{};p.where=[ad.road,ad.city||ad.town||ad.village].filter(Boolean).join(' · ');save();}).catch(()=>{});}catch(e){}}
    this.files=[];this.txt='';router.stack=[];SCREENS.home.f='all';SCREENS.home.y=0;router.tabTo('home');toast('Publicado');}
   catch(e){console.error(e);toast('Não deu pra salvar a mídia neste aparelho','dark');a.disabled=false;a.textContent=this.mode==='story'?'Compartilhar':'Publicar';}}},
 leave(){$$('.cmp2 video').forEach(v=>v.pause());}};
/* a tela é recriada a cada abertura: zera o estado */
const g0=router.go.bind(router);router.go=function(name,params,opts){if(name==='compose'){const sc=SCREENS.compose;delete sc.files;delete sc.mode;delete sc.txt;delete sc.cap;delete sc.car;delete sc._asked;delete sc.loc;}return g0(name,params,opts);};

/* ================= ver o próprio story ================= */
function openMyStory(){const items=(S.myStories||[]).filter(s=>s.t>Date.now()-864e5);if(!items.length)return;let i=0,t0=0,raf=0,dur=5000,paused=false;
  const w=document.createElement('div');w.className='stv';document.getElementById('app').appendChild(w);
  const close=()=>{cancelAnimationFrame(raf);w.style.transition='opacity .2s';w.style.opacity=0;setTimeout(()=>w.remove(),200);};
  const show=()=>{const it=items[i];if(!it){close();return;}
   w.innerHTML=`<div class="md">${it.type==='video'?`<video data-mk="${it.k}" playsinline autoplay muted style="width:100%;height:100%;object-fit:cover"></video>`:`<img data-mk="${it.k}" alt="" style="width:100%;height:100%;object-fit:cover">`}</div><div class="sh3"></div><div class="bars">${items.map((_,k)=>`<i><b style="width:${k<i?100:0}%"></b></i>`).join('')}</div>
    <div class="hd">${RL.avatar2({me:true},34)}<div class="tx">Seu story<small>${ago(it.t)}</small></div><button class="rb" style="background:rgba(0,0,0,.3);border:none;color:#fff" data-del aria-label="Excluir">${ic(TRASH,18)}</button><button class="rb" style="background:rgba(0,0,0,.3);border:none;color:#fff" data-x aria-label="Fechar">${ic(X,18)}</button></div>
    ${it.cap?`<div class="cap">${esc(it.cap)}</div>`:''}<div class="tl"></div><div class="tr2"></div>`;
   if(RL.fillMedia)RL.fillMedia(w);const v=$('video',w);dur=5000;if(v){v.addEventListener('loadedmetadata',()=>{dur=Math.min(15000,(v.duration||5)*1000);});setTimeout(()=>v.play&&v.play().catch(()=>{}),100);}
   $('[data-x]',w).onclick=close;$('[data-del]',w).onclick=()=>{S.myStories=(S.myStories||[]).filter(s=>s.id!==it.id);save();close();toast('Story excluído','dark');if(router.cur&&router.cur.name==='home')router.render(router.cur,true,true);};
   $('.tl',w).onclick=()=>{i=Math.max(0,i-1);t0=performance.now();show();};$('.tr2',w).onclick=()=>{i++;t0=performance.now();show();};t0=performance.now();};
  w.addEventListener('pointerdown',e=>{if(!e.target.closest('button'))paused=true;});w.addEventListener('pointerup',()=>paused=false);
  let last=performance.now();const loop=now=>{const dt=now-last;last=now;if(paused)t0+=dt;const k=Math.min(1,(now-t0)/dur);const b=$$('.bars i b',w)[i];if(b)b.style.width=(k*100)+'%';if(k>=1){i++;show();}if(w.isConnected)raf=requestAnimationFrame(loop);};
  show();raf=requestAnimationFrame(loop);}
RL.openMyStory=openMyStory;

/* ================= seletor de veículos (tabela FIPE) ================= */
const FT={car:'carros',moto:'motos',truck:'caminhoes'};
const POP={car:['Chevrolet','Volkswagen','Fiat','Ford','Hyundai','Toyota','Honda','Renault','Jeep','Nissan','Peugeot','Citroën','BYD','Caoa Chery','Mitsubishi','Kia Motors','BMW','Mercedes-Benz','Audi','GWM'],
 moto:['Honda','Yamaha','Suzuki','Kawasaki','BMW','Harley-davidson','Triumph','Royal Enfield','Ducati','KTM','Haojue','Shineray','Dafra','Bajaj','Kasinski','Mottu'],
 truck:['Mercedes-benz','Volvo','Scania','Volkswagen','Iveco','Ford','DAF','MAN','Agrale','Foton']};
const nb=b=>{b=String(b||'').replace(/^GM - /,'').replace(/^VW - VolksWagen$/i,'Volkswagen').replace(/^VW - /,'').trim();return b.split(' ').map(w=>w.length>3&&w===w.toUpperCase()&&!/\d/.test(w)?w[0]+w.slice(1).toLowerCase():w).join(' ');};
const tcw=w=>/\d/.test(w)||w.length<=3?w:(w===w.toUpperCase()?w[0]+w.slice(1).toLowerCase():w);
const fam=(n,t)=>{const w=String(n).replace(/[()]/g,' ').split(/\s+/).filter(Boolean);if(!w.length)return n;const f=[w[0]];if(w[1]&&((t!=='car'&&/^\d/.test(w[1]))||/^(grand|classe|range|nova|novo|new|space|land|town|santa|super|model|série|serie|land)$/i.test(w[0])))f.push(w[1]);return f.map(tcw).join(' ').replace(/\/.*$/,'').replace(/[+-]$/,'');};
const hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h;};
const mono=(b,sm)=>{const ini=b.replace(/[^A-Za-zÀ-ú0-9 -]/g,'').split(/[\s-]+/).filter(Boolean);const t=(ini.length>1?ini[0][0]+ini[1][0]:b.slice(0,2)).toUpperCase();const h=hue(b);return`<span class="mono${sm?' s':''}" style="background:linear-gradient(145deg,hsl(${h} 32% 30%),hsl(${h} 38% 16%))">${esc(t)}</span>`;};
const lsg=k=>{try{const c=JSON.parse(localStorage.getItem(k)||'null');if(c&&c.t>Date.now()-30*864e5)return c.d;}catch(e){}return null;};
const lss=(k,d)=>{try{localStorage.setItem(k,JSON.stringify({t:Date.now(),d}));}catch(e){}};
const API='https://parallelum.com.br/fipe/api/v1/';
async function brands(t){const k='role.fipeB.'+t;const c=lsg(k);if(c)return c;try{const r=await fetch(API+FT[t]+'/marcas');if(!r.ok)throw 0;const d=(await r.json()).map(b=>({n:nb(b.nome),c:+b.codigo}));lss(k,d);return d;}
  catch(e){const cat=(RL.CAT||{})[t==='moto'?'moto':'car']||{};return Object.keys(cat).map(n=>({n,c:0}));}}
async function models(t,b){const k='role.fipeM.'+t+'.'+b.c;const c=b.c?lsg(k):null;if(c)return c;if(b.c){try{const r=await fetch(API+FT[t]+'/marcas/'+b.c+'/modelos');if(!r.ok)throw 0;const d=(await r.json()).modelos.map(m=>m.nome);lss(k,d);return d;}catch(e){}}
  const cat=(RL.CAT||{})[t==='moto'?'moto':'car']||{};return cat[b.n]||[];}
const COLS=[['Preto','#111'],['Branco','#F4F4F4'],['Prata','#C9CDD2'],['Cinza','#6B7078'],['Vermelho','#C8202B'],['Azul','#1F4FBF'],['Verde','#2E7D4F'],['Amarelo','#F2C500'],['Laranja','#F07A1A'],['Marrom','#6B4428'],['Bege','#D8C7A3'],['Vinho','#6A1428']];
SCREENS.carForm={tabbar:false,
 html(p){const c=p&&p.id?S.cars.find(x=>x.id===p.id):null;this.c=c;
  if(!c&&S.cars.length>=3&&!S.plus)return`<div class="x-top"><button class="rb" data-back>${ic(BACK,20)}</button><h2 style="flex:1;font-size:17px;margin:0">Novo veículo</h2></div><div class="xs" style="padding:20px 16px"><div class="card" style="padding:20px"><div class="b lime small">LIMITE GRÁTIS</div><div style="font-size:22px;font-weight:800;margin-top:6px">Você já tem ${S.cars.length} veículos</div><div class="small muted" style="margin-top:8px;line-height:1.5">No plano grátis cabem 3. Com o Rolê+ a garagem não tem limite.</div><button class="crj" style="margin:16px 0 0;height:46px;width:100%" data-on="plus">Conhecer o Rolê+</button></div></div>`;
  if(this.st==null){if(c){this.st=3;this.t=c.type==='moto'?'moto':c.type==='truck'?'truck':'car';this.model=c.model;this.ver=c.ver||'';this.year=c.year||'';this.color=c.color||'';this.ev=!!c.ev;}else{this.st=1;this.t='car';this.year='';this.color='';this.ev=false;}}
  return`<div class="vf" style="position:absolute;inset:0;display:flex;flex-direction:column;background:var(--bg)"><div class="x-top"><button class="rb" data-on="bk" aria-label="Voltar">${ic(BACK,20)}</button><h2>${c?'Editar veículo':'Novo veículo'}</h2><span class="small muted">${this.st}/3</span></div>
   <div class="stp">${[1,2,3].map(i=>`<i class="${i<=this.st?'on':''}"></i>`).join('')}</div><div class="xs" id="vfb" style="flex:1"></div></div>`;},
 mount(el){if($('#vfb',el))this.draw();},
 async draw(){const el=this.el,box=$('#vfb',el);if(!box)return;const st=this.st,t=this.t;$$('.stp i',el).forEach((x,i)=>x.classList.toggle('on',i<st));const sc=$('.x-top .small',el);if(sc)sc.textContent=st+'/3';
  if(st===1){box.innerHTML=`<div class="vtyp">${[['car','Carro',CARI],['moto','Moto',MOTOI],['truck','Caminhão',TRUCKI]].map(([k,n,i])=>`<button data-ty="${k}" class="${t===k?'on':''}">${ic(i,26)}${n}</button>`).join('')}</div>
    <label class="vsr">${ic(SRCH,18)}<input id="bq" placeholder="Buscar marca" autocomplete="off" value="${esc(this.bq||'')}"></label><div id="bl"><div class="vload">Carregando marcas…</div></div>`;
   $$('[data-ty]',box).forEach(b=>b.onclick=()=>{this.t=b.dataset.ty;this.bq='';this.draw();});
   const bs=await brands(t);if(this.st!==1||this.t!==t||!box.isConnected)return;this.bs=bs;
   const list=()=>{const q=(this.bq||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');const bl=$('#bl',box);if(!bl)return;const nm=b=>b.n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    const pop=POP[t].map(n=>bs.find(b=>b.n.toLowerCase()===n.toLowerCase())).filter(Boolean);const all=bs.filter(b=>!q||nm(b).includes(q)).sort((a,b)=>a.n.localeCompare(b.n,'pt'));
    let h='';if(!q&&pop.length)h+=`<div class="vlb">Populares</div><div class="vpop">${pop.map(b=>`<button data-b="${b.c}|${esc(b.n)}">${mono(b.n)}<span>${esc(b.n)}</span></button>`).join('')}</div>`;
    h+=`<div class="vlb">${q?all.length+' marcas':'Todas as marcas · '+all.length}</div><div class="vlist">`;let L='';for(const b of all){const l=b.n[0].toUpperCase();if(!q&&l!==L){L=l;h+=`<div class="lt">${esc(l)}</div>`;}h+=`<button data-b="${b.c}|${esc(b.n)}">${mono(b.n,1)}<span class="gr">${esc(b.n)}</span>${ic(CHEV,16)}</button>`;}
    h+=`</div><button class="vman" data-man>Não achei meu veículo</button>`;bl.innerHTML=h;
    $$('[data-b]',bl).forEach(x=>x.onclick=()=>{const[c,...n]=x.dataset.b.split('|');this.b={c:+c,n:n.join('|')};this.st=2;this.mq='';this.draw();});$('[data-man]',bl).onclick=()=>{this.manual=true;this.st=3;this.model='';this.draw();};};
   const bq=$('#bq',box);bq.oninput=()=>{this.bq=bq.value;list();};list();return;}
  if(st===2){const b=this.b;box.innerHTML=`<div class="vsel">${mono(b.n)}<div class="gr"><small>${t==='moto'?'Moto':t==='truck'?'Caminhão':'Carro'}</small><b>${esc(b.n)}</b></div><button data-on="chb">Trocar</button></div>
    <label class="vsr">${ic(SRCH,18)}<input id="mq" placeholder="Buscar modelo da ${esc(b.n)}" autocomplete="off"></label><div id="ml"><div class="vload">Carregando modelos…</div></div>`;
   $('[data-on="chb"]',box).onclick=()=>{this.st=1;this.draw();};
   const ms=await models(t,b);if(this.st!==2||!box.isConnected)return;this.ms=ms;const fams={};ms.forEach(n=>{const f=fam(n,t);(fams[f]=fams[f]||[]).push(n);});this.fams=fams;
   const list=()=>{const q=(this.mq||'').toLowerCase();const ks=Object.keys(fams).filter(f=>!q||f.toLowerCase().includes(q)||fams[f].some(v=>v.toLowerCase().includes(q))).sort((a,c)=>a.localeCompare(c,'pt',{numeric:true}));
    $('#ml',box).innerHTML=(ks.length?`<div class="vlb">${ks.length} modelos</div><div class="vmods">${ks.map(f=>`<button data-f="${esc(f)}">${esc(f)}</button>`).join('')}</div>`:`<div class="vload">Nenhum modelo com “${esc(q)}”</div>`)+`<button class="vman" data-man>Não achei meu modelo</button>`;
    $$('[data-f]',box).forEach(x=>x.onclick=()=>{this.f=x.dataset.f;this.model=b.n+' '+this.f;this.ver='';this.manual=false;this.st=3;this.draw();});$('[data-man]',box).onclick=()=>{this.manual=true;this.model=b.n+' ';this.st=3;this.draw();};};
   const mq=$('#mq',box);mq.oninput=()=>{this.mq=mq.value;list();};list();return;}
  /* passo 3: detalhes */
  const vers=this.fams&&this.f?this.fams[this.f]:null;const yNow=new Date().getFullYear()+1;const ys=Array.from({length:46},(_,i)=>yNow-i);const c=this.c;
  box.innerHTML=`${this.manual?`<div class="vfrm"><div class="lb">Marca e modelo</div><input id="fm" value="${esc(this.model||'')}" placeholder="Ex.: Fiat 147"></div>`:`<div class="vsel">${mono((this.model||'?').split(' ')[0])}<div class="gr"><small>${t==='moto'?'Moto':t==='truck'?'Caminhão':'Carro'}</small><b>${esc(this.model)}</b></div><button data-on="chm">Trocar</button></div>`}
   <div class="vfrm">${vers&&vers.length>1?`<div class="lb">Versão</div><select id="fv"><option value="">Não sei / pular</option>${vers.map(v=>`<option ${this.ver===v?'selected':''}>${esc(v)}</option>`).join('')}</select>`:''}
   <div class="lb">Ano</div><div class="vyrs" id="fy">${ys.map(y=>`<button data-y="${y}" class="${+this.year===y?'on':''}">${y}</button>`).join('')}</div>
   <div class="lb">Cor</div><div class="vcol" id="fc">${COLS.map(([n,h])=>`<button data-c="${n}" style="background:${h}" class="${this.color===n?'on':''}" aria-label="${n}" title="${n}"></button>`).join('')}</div>
   ${t!=='moto'?`<div class="lb">Energia</div><div class="vseg" id="fe"><button data-e="0" class="${!this.ev?'on':''}">Combustão / flex</button><button data-e="1" class="${this.ev?'on':''}">Elétrico</button></div>`:''}
   <div class="two"><div><div class="lb" id="kl">${this.ev?'Consumo (km/kWh)':'Consumo (km/l)'}</div><input id="fk" inputmode="decimal" placeholder="${this.ev?'6,5':t==='moto'?'35':'12,5'}" value="${c&&c.kml?String(c.kml).replace('.',','):''}"></div><div><div class="lb">Quilometragem</div><input id="fo" inputmode="numeric" placeholder="62000" value="${esc(c&&c.km||'')}"></div></div></div>
   <div class="vsave"><button data-on="sv">${c?'Salvar':'Continuar pras fotos'}</button></div>`;
  const cm=$('[data-on="chm"]',box);if(cm)cm.onclick=()=>{this.st=this.b?2:1;this.draw();};
  const fv=$('#fv',box);if(fv)fv.onchange=()=>{this.ver=fv.value;};
  $$('#fy [data-y]',box).forEach(b=>b.onclick=()=>{this.year=+b.dataset.y;$$('#fy [data-y]',box).forEach(x=>x.classList.toggle('on',x===b));});
  const yo=$('#fy .on',box);if(yo)setTimeout(()=>yo.scrollIntoView({inline:'center',block:'nearest'}),30);
  $$('#fc [data-c]',box).forEach(b=>b.onclick=()=>{this.color=b.dataset.c;$$('#fc [data-c]',box).forEach(x=>x.classList.toggle('on',x===b));});
  $$('#fe [data-e]',box).forEach(b=>b.onclick=()=>{this.ev=b.dataset.e==='1';$$('#fe [data-e]',box).forEach(x=>x.classList.toggle('on',x===b));$('#kl',box).textContent=this.ev?'Consumo (km/kWh)':'Consumo (km/l)';});
  $('[data-on="sv"]',box).onclick=()=>this.saveC();},
 saveC(){const el=this.el;let model=this.manual?(($('#fm',el)||{}).value||'').trim():this.model;if(!model||model.length<2){toast('Escreva a marca e o modelo','dark');return;}
  const kml=parseFloat(($('#fk',el).value||'').replace(',','.'))||null,km=parseInt(($('#fo',el).value||'').replace(/\D/g,''))||null;const type=this.t,year=this.year||'',color=this.color||'',ev=type!=='moto'&&this.ev,ver=this.ver||'';
  let c=this.c;if(c){Object.assign(c,{model,year,kml,km,type,color,ev,ver});save();RL.rebuildCar&&RL.rebuildCar();toast('Salvo');this.st=null;router.back();return;}
  c={id:'c'+Date.now(),model,year,kml,km,type,color,ev,ver,front:null,rear:null,active:true};S.cars.forEach(x=>x.active=false);S.cars.push(c);if(!S.me.feat)S.me.feat=c.id;save();RL.rebuildCar&&RL.rebuildCar();this.st=null;
  router.go('photo',{id:c.id,slot:'rear',then:'front',fresh:true});},
 leave(){},
 on:{bk(){if(this.st>1&&!this.c){this.st--;this.draw();}else{this.st=null;router.back();}},plus(){RL.paywall&&RL.paywall();}}};
const gC=router.go;router.go=function(name,params,opts){if(name==='carForm'){const sc=SCREENS.carForm;['st','t','b','f','fams','ms','model','ver','year','color','ev','manual','bq','mq','bs','c'].forEach(k=>delete sc[k]);}return gC.call(router,name,params,opts);};

/* ================= estúdio sem figurinhas ================= */
if(SCREENS.studio){const sh=SCREENS.studio.html;SCREENS.studio.html=function(p){if(!this.t||this.t==='stk')this.t='frm';return sh.call(this,p).replace(/<button data-t="stk"[^>]*>Adesivos<\/button>/,'').replace('Adesivos, molduras e rastros exclusivos','Molduras e rastros exclusivos');};}

/* ================= crews: entrar direto da lista ================= */
if(SCREENS.crews){SCREENS.crews.html=function(){const fmt=n=>n>=1e3?(n/1e3).toFixed(1).replace('.',',')+' mil':String(n);return`<div class="x-top"><button class="rb" data-back>${ic(BACK,20)}</button><h2 style="flex:1;text-align:center;font-size:17px;margin:0">Crews</h2><span style="width:42px"></span></div><div class="xs">
  <div class="small muted" style="padding:2px 18px 10px">Crews rodam juntas, dividem território e têm chat próprio.</div>
  ${Object.entries(C.CREWS).map(([n,cr])=>`<div class="row2" style="cursor:pointer" data-go="crew" data-p='${esc(JSON.stringify({id:n}))}'><span class="gav" style="background:${cr.c}">${esc(n.split(' ').map(x=>x[0]).join(''))}</span><span class="tx"><b>${esc(n)}</b><span>${cr.m} membros · ${fmt(cr.hex)} hex</span><span>${esc(cr.d)}</span></span>${S.me.crew===n?`<button class="crj sec" data-on="leave" data-c="${esc(n)}">Sua crew</button>`:`<button class="crj" data-on="join" data-c="${esc(n)}">Entrar</button>`}</div>`).join('')}</div>`;};
 SCREENS.crews.on={join(a,e){e.stopPropagation();S.me.crew=a.dataset.c;save();toast('Você entrou na '+a.dataset.c);router.render(this,true,true);},leave(a,e){e.stopPropagation();router.go('crew',{id:a.dataset.c});}};}

/* ================= cliques: nome → perfil, carro → página do carro ================= */
function openProf(h){if(!h)return;const st=document.querySelector('.stv [data-x]');if(st)st.click();if(h===S.me.handle||h==='me'){router.tabTo('profile');return;}if(C&&C.openProfile)C.openProfile(h);else router.go('person',{h});}
RL.openProf=openProf;
document.addEventListener('click',e=>{const t=e.target;if(!t.closest)return;
  const u=t.closest('[data-u]');if(u){e.stopPropagation();e.preventDefault();openProf(u.dataset.u);return;}
  const c=t.closest('[data-car]');if(c&&c.dataset.car){e.stopPropagation();e.preventDefault();const st=document.querySelector('.stv [data-x]');if(st)st.click();router.go('model',{m:c.dataset.car});return;}
  const p=t.closest('[data-on="prof"][data-h]');if(p){const n=router.cur;const inScreen=n&&n.el&&n.el.contains(p);if(!inScreen||!(n.on&&n.on.prof)){e.stopPropagation();openProf(p.dataset.h);}return;}
  const md=t.closest('[data-on="model"][data-m]');if(md){const n=router.cur;const inScreen=n&&n.el&&n.el.contains(md);if(!inScreen||!(n.on&&n.on.model)){e.stopPropagation();router.go('model',{m:md.dataset.m});}}},true);

/* ================= voltar do Android/navegador não fecha o app ================= */
let lastBack=0;const guard=()=>{try{history.pushState({rl:Date.now()},'');}catch(e){}};
try{history.replaceState({rl:0},'');}catch(e){}guard();
addEventListener('popstate',()=>{
  const sw=[...document.querySelectorAll('.sheetwrap')].pop();if(sw){sw.remove();guard();return;}
  const av=document.querySelector('.avz');if(av){av.remove();guard();return;}
  const sv=document.querySelector('.stv');if(sv){const x=sv.querySelector('[data-x]');if(x)x.click();else sv.remove();guard();return;}
  const mp=document.querySelector('.mpick.on');if(mp){const x=mp.querySelector('.mpk-x');if(x)x.click();guard();return;}
  const cur=router.cur;if(cur&&cur.name==='carForm'&&cur.on&&cur.on.bk){cur.on.bk.call(cur);guard();return;}
  if(router.stack.length>1){router.back();guard();return;}
  const t=cur&&(cur.tab||cur.name);if(t&&t!=='home'&&t!=='login'&&S.auth){if(RL.go2)RL.go2('home','tin-r');else router.tabTo('home');guard();return;}
  if(Date.now()-lastBack<2200){history.back();return;}lastBack=Date.now();toast('Toque voltar de novo pra sair','dark');guard();});

/* ================= cor de destaque em tudo (CSS, estilos inline, SVG e mapa) ================= */
const TRI={'198,244,50':'--lime','184,230,46':'--lime','220,255,106':'--lime2','214,255,80':'--lime2','220,255,74':'--lime2','232,255,154':'--lime2','239,255,122':'--lime2','134,201,42':'--lime3'};
const HEX={'#c6f432':'198,244,50','#b8e62e':'184,230,46','#dcff6a':'220,255,106','#d6ff50':'214,255,80','#dcff4a':'220,255,74','#e8ff9a':'232,255,154','#efff7a':'239,255,122','#86c92a':'134,201,42'};
const RGBRE=/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+%?))?\s*\)/g;const HEXRE=/#(c6f432|b8e62e|dcff6a|d6ff50|dcff4a|e8ff9a|efff7a|86c92a)\b/gi;
const mix=(v,a)=>a==null||a===''||+a===1?`var(${v})`:`color-mix(in srgb,var(${v}) ${String(a).endsWith('%')?a:Math.round(+a*100)+'%'},transparent)`;
const fixTxt=s=>s.replace(HEXRE,m=>`var(${TRI[HEX[m.toLowerCase()]]})`).replace(RGBRE,(m,r,g,b,a)=>{const v=TRI[r+','+g+','+b];return v?mix(v,a):m;});
function fixSheets(){for(const sh of document.styleSheets){let rs;try{rs=sh.cssRules;}catch(e){continue;}walk(rs);}}
function walk(rs){for(const r of rs){if(r.cssRules&&!r.style){walk(r.cssRules);continue;}if(!r.style)continue;const s=r.style;for(let i=0;i<s.length;i++){const p=s[i];if(p.startsWith('--'))continue;const v=s.getPropertyValue(p);if(!v||!/rgb|#/.test(v))continue;const n=fixTxt(v);if(n!==v){try{s.setProperty(p,n,s.getPropertyPriority(p));}catch(e){}}}if(r.cssRules)walk(r.cssRules);}}
function fixNode(root){if(!root||!root.querySelectorAll)return;const els=[root,...root.querySelectorAll('[style],[fill],[stroke],stop')];for(const e of els){if(!e.getAttribute)continue;const st=e.getAttribute('style');if(st&&/198|220|214|232|239|134|184|#[cdeb8]/i.test(st)){const n=fixTxt(st);if(n!==st)e.setAttribute('style',n);}
  for(const a of['fill','stroke','stop-color']){const v=e.getAttribute(a);if(v){const k=HEX[v.toLowerCase()];if(k)e.setAttribute(a,`var(${TRI[k]})`);else if(/rgb/.test(v)){const n=fixTxt(v);if(n!==v)e.setAttribute(a,n);}}}}}
let mo=null;function domFix(on){if(on&&!mo){mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)fixNode(n);});mo.observe(document.getElementById('app'),{childList:true,subtree:true});fixNode(document.getElementById('app'));}else if(!on&&mo){mo.disconnect();mo=null;}}
function accHex(){return(getComputedStyle(document.documentElement).getPropertyValue('--lime')||'#C6F432').trim();}
function mapFix(){const m=RL.getMap&&RL.getMap();if(!m||!m.getStyle||!m.isStyleLoaded||!m.isStyleLoaded())return;const a=accHex();let st;try{st=m.getStyle();}catch(e){return;}
  for(const l of st.layers||[]){if(l.source==='openmaptiles'||!l.paint)continue;for(const[k,v]of Object.entries(l.paint)){if(!/color/.test(k))continue;const js=JSON.stringify(v);const orig=(m._rlOrig=m._rlOrig||{})[l.id+'|'+k]||(m._rlOrig[l.id+'|'+k]=js);
    if(!/c6f432|dcff6a|d6ff50|dcff4a|b8e62e|198,\s*244,\s*50|214,\s*255,\s*80|220,\s*255,\s*106/i.test(orig))continue;
    const rep=orig.replace(/#(c6f432|b8e62e|dcff6a|d6ff50|dcff4a|e8ff9a)/gi,a).replace(/rgba\(\s*(198,\s*244,\s*50|214,\s*255,\s*80|220,\s*255,\s*106)\s*,\s*([\d.]+)\s*\)/g,(mm,t,al)=>{const h=a.replace('#','');const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return`rgba(${r},${g},${b},${al})`;});
    try{m.setPaintProperty(l.id,k,JSON.parse(rep));}catch(e){}}}}
let lastAcc=null;function accApply(){const a=S.accent||'lime';fixSheets();domFix(a!=='lime');if(a!==lastAcc){lastAcc=a;setTimeout(mapFix,50);if(a!=='lime')fixNode(document.getElementById('app'));}}
const r1=router.render.bind(router);router.render=function(n,a,b){r1(n,a,b);if((S.accent||'lime')!==lastAcc)accApply();};
(function wm(){const m=RL.getMap&&RL.getMap();if(!m||!m.on){setTimeout(wm,600);return;}m.on('styledata',()=>{clearTimeout(wm.t);wm.t=setTimeout(mapFix,120);});})();
setTimeout(accApply,0);
/* ao trocar a cor nos ajustes, aplica na hora */
if(SCREENS.settings&&SCREENS.settings.on&&SCREENS.settings.on.acc){const ac=SCREENS.settings.on.acc;SCREENS.settings.on.acc=function(a){ac.call(this,a);lastAcc=null;accApply();};}
})();
