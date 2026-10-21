/* Rolê p8: rede social (início, explorar, viagens, mensagens, perfil, ajustes, login), tema claro/escuro, navegação e gestos */
(function(){
const RL=window.__role;const {S,router,SCREENS,save,toast,sheet,ic,I,esc,$,$$,ago,fmtKm,fmtT}=RL;const C=RL.comm,T=RL.tt;
const hsh=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return((h>>>0)%100000)/100000;};
const getMap=()=>RL.getMap&&RL.getMap();
const IC={home:'<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',plus:'<path d="M12 5v14M5 12h14"/>',
 heart:'<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',send:'<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',dots:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',save:'<path d="M6 3h12v18l-6-4-6 4z"/>',cmt:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
 back:'<path d="M15 5l-7 7 7 7"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',chev:'<path d="M9 5l7 7-7 7"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
 car:'<path d="M5 13l1.6-4.8A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.2L19 13v5h-2v-2H7v2H5z"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>',flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
 people:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',loc:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0"/>',check:'<path d="M5 12l5 5 9-10"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',share:'<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M7 8l5-5 5 5"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 pump:'<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 10h10M14 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/>',play:'<path d="M7 4l13 8-13 8z"/>',reel:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8.5h18M8 3l2.5 5.5M13.5 3L16 8.5"/><path d="M10.5 12.3v4.4l3.8-2.2z"/>',mute:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l4 6M21 9l-4 6"/>',vol:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 8a5 5 0 0 1 0 8"/>',bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',moon:'<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/>'};
const ico=(k,s=22,w=2)=>ic(IC[k]||k,s,w);
const fmt=n=>n>=1e6?(n/1e6).toFixed(1).replace('.',',')+' mi':n>=1e4?Math.round(n/1e3)+' mil':n>=1e3?(n/1e3).toFixed(1).replace('.',',')+' mil':String(n);
const who=h=>C.who(h)||{h,n:h};
const avatar=(w,s)=>RL.avatar2?RL.avatar2(w&&w.me?{me:true}:w,s):`<span class="av" style="width:${s}px;height:${s}px"></span>`;
const modelKey=c=>RL.modelKey?RL.modelKey(c||''):c;
const people=()=>(T&&T.people?T.people():C.P).filter(w=>!w.me);
const me={get h(){return S.me.handle;}};

/* ================= TEMA ================= */
S.theme=S.theme||'auto';S.accent=S.accent||'lime';
const ACC={lime:['#C6F432','#DCFF6A','#5C7A00','Lima'],orange:['#FF7A3D','#FFA27A','#C2410C','Laranja'],cyan:['#22D3EE','#7FE7F7','#0E7490','Ciano'],pink:['#FF5FA2','#FF9AC4','#BE185D','Rosa'],violet:['#A78BFA','#C4B5FD','#6D28D9','Violeta'],white:['#F2F2EF','#FFFFFF','#111111','Neutro']};
function applyTheme(){const dark=S.theme==='dark'||(S.theme==='auto'&&!(matchMedia&&matchMedia('(prefers-color-scheme: light)').matches));const r=document.documentElement;const cn=router.cur&&router.cur.name;const forceDark=cn&&(cn==='map'||(SCREENS[cn]&&SCREENS[cn].clear)||cn==='login');r.dataset.theme=(dark||forceDark)?'dark':'light';const a=ACC[S.accent]||ACC.lime;
  r.style.setProperty('--lime',a[0]);r.style.setProperty('--lime2',a[1]);r.style.setProperty('--acc-ink',dark?a[1]:a[2]);r.style.setProperty('--on-acc',S.accent==='white'&&!dark?'#fff':'#0A0B0A');
  let m=document.querySelector('meta[name=theme-color]');if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m);}m.content=dark?'#0A0B0A':'#F4F4F1';}
applyTheme();try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',applyTheme);}catch(e){}
RL.applyTheme=applyTheme;

const st=document.createElement('style');st.textContent=`
:root{--sheet:#141513;--surf:#141513;--surf2:#1B1C1A;--ease:cubic-bezier(.32,.72,0,1)}
:root[data-theme=light]{--bg:#F4F4F1;--bg2:#FFFFFF;--card:#FFFFFF;--line:rgba(17,17,17,.07);--line2:rgba(17,17,17,.12);--tx:#111111;--tx2:#36363B;--tx3:#8A8A93;--tx4:#B5B5BB;--glass:rgba(255,255,255,.86);--sheet:#FFFFFF;--surf:#FFFFFF;--surf2:#EDEDE8}
:root[data-theme=light] body,:root[data-theme=light] html{background:#E9E9E4}
:root[data-theme=light] .ib{background:#fff;border-color:var(--line)}
:root[data-theme=light] .card{background:#fff;border-color:var(--line)}
:root[data-theme=light] .lime{color:var(--acc-ink)!important}
:root[data-theme=light] .seg{background:#E6E6E1}:root[data-theme=light] .seg button.on{background:#111;color:#fff}
:root[data-theme=light] .inp{background:#fff;border-color:var(--line2);color:var(--tx)}
:root[data-theme=light] .chip{background:#fff;border-color:var(--line);color:var(--tx)}
:root[data-theme=light] .sheetw .sh,:root[data-theme=light] .sh{background:#fff;color:var(--tx)}
/* nav flutuante */
#tabbar.nb{position:absolute;left:16px;right:16px;bottom:calc(12px + var(--safeB));height:64px;border-radius:999px;background:var(--glass);backdrop-filter:blur(22px) saturate(1.4);-webkit-backdrop-filter:blur(22px) saturate(1.4);border:1px solid var(--line);display:flex;align-items:center;justify-content:space-around;padding:0 8px;z-index:30;box-shadow:0 10px 30px rgba(0,0,0,.18)}
#tabbar.nb button{width:48px;height:48px;border-radius:999px;display:flex;align-items:center;justify-content:center;color:var(--tx3);transition:background .25s var(--ease),color .2s,transform .15s}
#tabbar.nb button:active{transform:scale(.9)}
#tabbar.nb button.on{background:var(--lime);color:var(--on-acc)}
#tabbar.nb button.plus{background:var(--tx);color:var(--bg)}
#tabbar.nb button .nd{position:absolute}
/* transições */
.screen.tin-l{animation:tinl .34s var(--ease) both}.screen.tin-r{animation:tinr .34s var(--ease) both}
@keyframes tinl{from{transform:translateX(28%);opacity:.4}to{transform:none;opacity:1}}@keyframes tinr{from{transform:translateX(-28%);opacity:.4}to{transform:none;opacity:1}}
.screen.drag{transition:none!important;animation:none!important}
.screen.snap{transition:transform .3s var(--ease),opacity .3s var(--ease)}
/* base das telas novas */
.x-top{display:flex;align-items:center;gap:10px;padding:calc(10px + var(--safeT)) 16px 8px}
.x-top h1{flex:1;margin:0;font-size:26px;font-weight:800;letter-spacing:-.6px}
.x-top h2{flex:1;margin:0;font-size:18px;font-weight:800;text-align:center}
.wm{flex:1;font-family:'Anton','Oswald',sans-serif;font-size:30px;letter-spacing:.5px;line-height:1;text-transform:lowercase}
.wm i{font-style:normal;color:var(--lime)}
.rb{width:42px;height:42px;border-radius:999px;background:var(--surf);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;position:relative;color:var(--tx);flex-shrink:0;transition:transform .15s}
.rb:active{transform:scale(.92)}
.rb .bd{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;padding:0 5px;border-radius:99px;background:var(--lime);color:var(--on-acc);font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg)}
.xs{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;padding-bottom:calc(100px + var(--safeB))}
.pills{display:flex;gap:8px;overflow-x:auto;padding:4px 16px 10px;scrollbar-width:none}.pills::-webkit-scrollbar{display:none}
.pill{flex-shrink:0;height:36px;padding:0 15px;border-radius:999px;background:var(--surf);border:1px solid var(--line);font-size:13.5px;font-weight:700;color:var(--tx2);display:flex;align-items:center;gap:6px;transition:background .2s,color .2s}
.pill.on{background:var(--lime);border-color:transparent;color:var(--on-acc)}
.sh-t{display:flex;align-items:baseline;justify-content:space-between;padding:18px 16px 10px}.sh-t b{font-size:17px;font-weight:800;letter-spacing:-.2px}.sh-t button{font-size:13px;font-weight:700;color:var(--tx3)}
.hs{display:flex;gap:12px;overflow-x:auto;padding:0 16px;scroll-snap-type:x mandatory;scrollbar-width:none}.hs::-webkit-scrollbar{display:none}.hs>*{scroll-snap-align:start;flex-shrink:0}
/* stories */
.stories2{display:flex;gap:14px;overflow-x:auto;padding:6px 16px 4px;scrollbar-width:none}.stories2::-webkit-scrollbar{display:none}
.sto{display:flex;flex-direction:column;align-items:center;gap:6px;width:68px;flex-shrink:0}
.sto .rg{width:68px;height:68px;border-radius:999px;padding:2.5px;background:conic-gradient(var(--lime),#86C92A,var(--lime));display:flex;align-items:center;justify-content:center;position:relative}
.sto.seen .rg{background:var(--line2)}
.sto .rg>span{border:3px solid var(--bg);border-radius:999px;display:block}
.sto .rg .av{width:58px!important;height:58px!important}
.sto small{font-size:11.5px;font-weight:600;color:var(--tx2);max-width:68px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sto .add{position:absolute;right:0;bottom:0;width:22px;height:22px;border-radius:99px;background:var(--lime);color:var(--on-acc);border:2.5px solid var(--bg);display:flex;align-items:center;justify-content:center}
/* crews */
.crc{width:210px;border-radius:22px;overflow:hidden;background:var(--surf);border:1px solid var(--line);text-align:left}
.crc .ph{height:112px;position:relative;overflow:hidden;background:#222}.crc .ph img{width:100%;height:100%;object-fit:cover}
.crc .ph .tg{position:absolute;left:10px;top:10px;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:800;color:#0A0B0A}
.crc .in{padding:10px 12px 12px}.crc .in b{font-size:15px}.crc .in div{font-size:12px;color:var(--tx3);margin-top:2px}
/* post estilo instagram */
.ig{margin:6px 0 18px}
.ig-h{display:flex;align-items:center;gap:10px;padding:0 14px 10px}
.ig-h .nm{flex:1;min-width:0;text-align:left}.ig-h .nm b{font-size:14px;font-weight:800;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ig-h .nm span{font-size:12px;color:var(--tx3);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ig-m{position:relative;margin:0 10px;border-radius:24px;overflow:hidden;aspect-ratio:3/4;background:#0d0e0c}
.ig-cs{display:flex;width:100%;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.ig-cs::-webkit-scrollbar{display:none}
.ig-cs>div{flex:0 0 100%;height:100%;scroll-snap-align:center;position:relative;overflow:hidden}
.ig-cs img,.ig-cs video{width:100%;height:100%;object-fit:cover;display:block}
.ig-cs .smap{width:100%!important;height:100%!important}
.ig-m .cnt{position:absolute;right:12px;top:12px;padding:4px 10px;border-radius:99px;background:rgba(0,0,0,.5);color:#fff;font-size:12px;font-weight:700;backdrop-filter:blur(8px)}
.ig-m .mt{position:absolute;right:12px;bottom:12px;width:34px;height:34px;border-radius:99px;background:rgba(0,0,0,.5);color:#fff;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
.ig-m .stat{position:absolute;left:12px;bottom:12px;display:flex;gap:6px}.ig-m .stat span{padding:6px 11px;border-radius:99px;background:rgba(10,11,10,.7);color:#fff;font-size:12.5px;font-weight:800;backdrop-filter:blur(8px)}
.ig-m .stat span.l{background:var(--lime);color:#0A0B0A}
.ig-m .pop{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;opacity:0;transform:scale(.6);pointer-events:none;transition:opacity .2s,transform .35s var(--ease)}.ig-m .pop.on{opacity:1;transform:scale(1)}
.ig-d{display:flex;justify-content:center;gap:5px;padding-top:10px;height:16px}.ig-d i{width:6px;height:6px;border-radius:9px;background:var(--line2);transition:background .2s,width .2s}.ig-d i.on{background:var(--lime);width:14px}
.ig-a{display:flex;align-items:center;gap:4px;padding:2px 10px 0}
.ig-a button{height:40px;min-width:40px;padding:0 8px;border-radius:99px;display:flex;align-items:center;gap:6px;font-size:13.5px;font-weight:700;color:var(--tx)}
.ig-a button.on{color:var(--acc-ink)}.ig-a button.on svg{fill:currentColor}
.ig-c{padding:0 16px;font-size:14px;line-height:1.45}.ig-c b{font-weight:800;margin-right:5px}
.ig-c .mu{color:var(--tx3);font-size:13px;margin-top:4px;display:block}
.ig-cr{font-size:10.5px;color:var(--tx4);padding:4px 16px 0}
/* sugestões */
.sug{width:150px;border-radius:22px;padding:16px 12px 12px;background:var(--surf);border:1px solid var(--line);display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px}
.sug b{font-size:14px;margin-top:6px}.sug small{font-size:11.5px;color:var(--tx3);height:30px;overflow:hidden}
.btn2{height:36px;padding:0 16px;border-radius:999px;background:var(--lime);color:var(--on-acc);font-weight:800;font-size:13.5px;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.btn2.sec{background:var(--surf2);color:var(--tx)}.btn2.full{width:100%;height:46px;font-size:15px}
/* viagens */
.trc{width:272px;height:340px;border-radius:26px;overflow:hidden;position:relative;text-align:left;background:#222;color:#fff}
.trc img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.trc .sh2{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.82))}
.trc .in{position:absolute;left:16px;right:16px;bottom:16px}.trc .in b{font-size:21px;font-weight:800;letter-spacing:-.3px;display:block;line-height:1.1}.trc .in div{font-size:13px;opacity:.85;margin-top:6px}
.trc .tg{position:absolute;left:14px;top:14px;display:flex;gap:6px}.trc .tg span{padding:5px 10px;border-radius:99px;background:rgba(255,255,255,.18);backdrop-filter:blur(10px);font-size:11.5px;font-weight:800}
.row2{display:flex;align-items:center;gap:12px;padding:10px 16px;text-align:left;width:100%}
.row2 .tx{flex:1;min-width:0}.row2 .tx b{font-size:15px;font-weight:700;display:block}.row2 .tx span{font-size:12.5px;color:var(--tx3);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.thumb{width:56px;height:56px;border-radius:16px;overflow:hidden;flex-shrink:0;background:var(--surf2)}.thumb img{width:100%;height:100%;object-fit:cover}
/* grade explorar/perfil */
.gr3{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;padding:0 3px}
.gr3>button{aspect-ratio:3/4;position:relative;overflow:hidden;background:var(--surf2);border-radius:6px}
.gr3 img{width:100%;height:100%;object-fit:cover}.gr3 .tl{grid-row:span 2;aspect-ratio:auto}
.gr3 .vi{position:absolute;right:6px;top:6px;color:#fff;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6))}
.gr3 .smap{width:100%!important;height:100%!important}
/* listas estilo ajustes */
.grp{margin:8px 16px 0;border-radius:22px;background:var(--surf);border:1px solid var(--line);overflow:hidden}
.grp-t{font-size:12.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:var(--tx3);padding:20px 22px 6px}
.it{display:flex;align-items:center;gap:12px;padding:14px 16px;width:100%;text-align:left;font-size:15px;font-weight:600}
.it+.it{border-top:1px solid var(--line)}
.it .ii{width:34px;height:34px;border-radius:11px;background:var(--surf2);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--tx)}
.it .tx{flex:1;min-width:0}.it .tx small{display:block;font-size:12.5px;font-weight:500;color:var(--tx3);margin-top:2px}
.it .v{font-size:13.5px;color:var(--tx3);font-weight:600}
.tg2{width:50px;height:30px;border-radius:99px;background:var(--line2);position:relative;transition:background .2s;flex-shrink:0}.tg2:after{content:'';position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:99px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .25s var(--ease)}
.tg2.on{background:var(--lime)}.tg2.on:after{transform:translateX(20px)}
.sw3{display:flex;gap:4px;padding:4px;border-radius:14px;background:var(--surf2)}.sw3 button{flex:1;height:34px;border-radius:11px;font-size:13px;font-weight:700;color:var(--tx3)}.sw3 button.on{background:var(--surf);color:var(--tx);box-shadow:0 1px 4px rgba(0,0,0,.12)}
.accs{display:flex;gap:10px;padding:4px 16px 16px}.accs button{width:38px;height:38px;border-radius:99px;border:3px solid transparent;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}.accs button.on{border-color:var(--tx)}
/* perfil */
.pf-h{display:flex;align-items:center;gap:18px;padding:6px 18px 0}
.pf-st{flex:1;display:flex;justify-content:space-around;text-align:center}.pf-st b{display:block;font-size:18px;font-weight:800}.pf-st span{font-size:12px;color:var(--tx3)}
.pf-b{padding:12px 18px 0;font-size:14px;line-height:1.45}.pf-b b{font-size:16px}.pf-b .cr{display:inline-flex;align-items:center;gap:6px;margin-top:6px;padding:4px 10px;border-radius:99px;background:var(--surf2);font-size:12.5px;font-weight:800}
.pf-btns{display:flex;gap:8px;padding:14px 18px 6px}.pf-btns .btn2{flex:1}
.tabs2{position:sticky;top:0;z-index:3;display:flex;background:var(--bg);border-bottom:1px solid var(--line);margin-top:12px}
.tabs2 button{flex:1;height:46px;display:flex;align-items:center;justify-content:center;gap:6px;color:var(--tx3);font-size:13px;font-weight:800;position:relative}
.tabs2 button.on{color:var(--tx)}.tabs2 button.on:after{content:'';position:absolute;left:28%;right:28%;bottom:-1px;height:2.5px;border-radius:2px;background:var(--tx)}
.gcard{display:flex;align-items:center;gap:12px;margin:10px 16px 0;padding:12px;border-radius:22px;background:var(--surf);border:1px solid var(--line);width:calc(100% - 32px);text-align:left}
.gcard .pic{width:96px;height:64px;border-radius:14px;background:var(--surf2);display:flex;align-items:center;justify-content:center;overflow:hidden}.gcard .pic img{max-width:92px;max-height:60px;object-fit:contain}
.bdg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px 16px}.bdg>div{border-radius:20px;padding:14px 8px;text-align:center;background:var(--surf);border:1px solid var(--line)}.bdg .e{width:44px;height:44px;margin:0 auto 8px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:var(--lime);color:var(--on-acc)}.bdg .off .e{background:var(--surf2);color:var(--tx4)}.bdg b{font-size:12.5px;display:block}.bdg small{font-size:11px;color:var(--tx3)}
/* mensagens */
.thr{display:flex;align-items:center;gap:12px;padding:10px 16px;width:100%;text-align:left}
.thr .tx{flex:1;min-width:0}.thr .tx b{font-size:15px;display:block}.thr .tx span{font-size:13px;color:var(--tx3);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.thr.un .tx span{color:var(--tx);font-weight:700}
.thr .dt{width:10px;height:10px;border-radius:99px;background:var(--lime)}
.on1{position:relative}.on1:after{content:'';position:absolute;right:1px;bottom:1px;width:13px;height:13px;border-radius:99px;background:#22C55E;border:2.5px solid var(--bg)}
.gav{width:52px;height:52px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;color:#0A0B0A;flex-shrink:0}
.msgs{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:4px}
.bb{max-width:76%;padding:10px 14px;border-radius:22px;font-size:14.5px;line-height:1.4;background:var(--surf2);align-self:flex-start;animation:bbin .25s var(--ease)}
.bb.me{align-self:flex-end;background:var(--lime);color:var(--on-acc)}.bb small{display:block;font-size:10.5px;opacity:.55;margin-top:3px}
.bb.ty{display:flex;gap:4px;padding:14px}.bb.ty i{width:7px;height:7px;border-radius:9px;background:var(--tx3);animation:tyb 1s infinite}.bb.ty i:nth-child(2){animation-delay:.15s}.bb.ty i:nth-child(3){animation-delay:.3s}
@keyframes tyb{50%{transform:translateY(-4px);opacity:.5}}@keyframes bbin{from{opacity:0;transform:translateY(6px) scale(.97)}}
.cmp{display:flex;gap:8px;align-items:center;padding:8px 12px calc(10px + var(--safeB));border-top:1px solid var(--line);background:var(--bg)}
.cmp input{flex:1;height:46px;border-radius:999px;border:1px solid var(--line2);background:var(--surf);padding:0 18px;color:var(--tx);font-size:15px;outline:none}
.cmp button{width:46px;height:46px;border-radius:99px;background:var(--lime);color:var(--on-acc);display:flex;align-items:center;justify-content:center}
/* notificações */
.nt{display:flex;align-items:center;gap:12px;padding:10px 16px}.nt .tx{flex:1;font-size:14px;line-height:1.4}.nt .tx small{color:var(--tx3)}.nt .ph{width:46px;height:58px;border-radius:10px;overflow:hidden;background:var(--surf2)}.nt .ph img{width:100%;height:100%;object-fit:cover}
.nt .ic{width:44px;height:44px;border-radius:99px;display:flex;align-items:center;justify-content:center;background:var(--lime);color:var(--on-acc);flex-shrink:0}
/* story viewer */
.stv{position:absolute;inset:0;z-index:80;background:#000;color:#fff;animation:stvin .3s var(--ease)}@keyframes stvin{from{transform:scale(.92);opacity:0}}
.stv .md{position:absolute;inset:0}.stv .md img,.stv .md video{width:100%;height:100%;object-fit:cover}
.stv .bars{position:absolute;left:10px;right:10px;top:calc(10px + var(--safeT));display:flex;gap:4px;z-index:2}.stv .bars i{flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,.35);overflow:hidden}.stv .bars i b{display:block;height:100%;width:0;background:#fff}
.stv .hd{position:absolute;left:12px;right:12px;top:calc(22px + var(--safeT));display:flex;align-items:center;gap:10px;z-index:2}.stv .hd .tx{flex:1;font-size:14px;font-weight:800}.stv .hd .tx small{font-weight:500;opacity:.7;margin-left:6px}
.stv .ft{position:absolute;left:12px;right:12px;bottom:calc(14px + var(--safeB));display:flex;gap:10px;z-index:2}.stv .ft input{flex:1;height:46px;border-radius:99px;border:1px solid rgba(255,255,255,.5);background:transparent;color:#fff;padding:0 18px;font-size:15px;outline:none}
.stv .cap{position:absolute;left:16px;right:16px;bottom:calc(76px + var(--safeB));font-size:15px;font-weight:700;text-shadow:0 1px 6px rgba(0,0,0,.6);z-index:2}
.stv .sh3{position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.45),transparent 22%,transparent 70%,rgba(0,0,0,.55));pointer-events:none}
.stv .tl,.stv .tr2{position:absolute;top:0;bottom:90px;width:35%;z-index:1}.stv .tl{left:0}.stv .tr2{right:0}
/* login */
.lg{position:absolute;inset:0;background:#000;color:#fff;overflow:hidden;display:flex;flex-direction:column}
.lg video,.lg .pst{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lg .shd{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.1) 30%,rgba(0,0,0,.35) 55%,rgba(0,0,0,.92) 80%)}
.lg .top{position:relative;padding:calc(28px + var(--safeT)) 24px 0;flex:1}
.lg .wm2{font-family:'Anton','Oswald',sans-serif;font-size:76px;line-height:.9;letter-spacing:1px}.lg .wm2 i{font-style:normal;color:var(--lime)}
.lg .tag{font-size:15px;font-weight:600;opacity:.85;margin-top:10px;max-width:260px;line-height:1.4}
.lg .bt{position:relative;padding:0 20px calc(22px + var(--safeB));display:flex;flex-direction:column;gap:10px}
.lg .bt button.lgb{height:56px;letter-spacing:0;line-height:1.2;text-shadow:none;width:100%;border-radius:999px;font-size:16px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:10px}
.lg .g{background:#fff;color:#111}.lg .e{background:var(--lime);color:#0A0B0A}.lg .o{background:rgba(255,255,255,.14);color:#fff;backdrop-filter:blur(12px)}
.lg .gi{width:22px;height:22px;border-radius:99px;border:2.5px solid #111;font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center}
.lg .lgal{font-size:11px;opacity:.55;text-align:center;line-height:1.5}
.lgf{position:absolute;inset:0;z-index:5;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;animation:fade .2s}
.lgf .bx{width:100%;background:var(--sheet);color:var(--tx);border-radius:30px 30px 0 0;padding:22px 20px calc(20px + var(--safeB));animation:upin .35s var(--ease)}@keyframes upin{from{transform:translateY(100%)}}
.lgf h3{margin:0 0 4px;font-size:22px;font-weight:800}.lgf p{margin:0 0 14px;color:var(--tx3);font-size:14px}
.lgf label{font-size:12.5px;font-weight:700;color:var(--tx3);display:block;margin:10px 4px 6px}
.lgf input{width:100%;height:50px;border-radius:16px;border:1px solid var(--line2);background:var(--surf2);color:var(--tx);padding:0 16px;font-size:15px;outline:none}
.lgf input:focus{border-color:var(--lime)}
/* mapa limpo */
.screen.clear #homeSheet,.screen.clear .chatpill,.screen.clear .fab[data-on=chat],.screen.clear .fab[data-on=events],.screen.clear .fab[data-on=fuelList],.screen.clear .fab[data-on=rank2],.screen.clear>.chips,.screen.clear [data-go=notifs]{display:none!important}
.mapfabs{bottom:calc(100px + var(--safeB))!important;top:auto!important}
.modechip{top:calc(76px + var(--safeT))!important}.disc{top:calc(76px + var(--safeT))!important;right:auto!important;left:150px;max-width:none!important;white-space:nowrap}
.gobtn{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(92px + var(--safeB));z-index:6;height:52px;padding:0 22px 0 16px;border-radius:999px;background:var(--lime);color:#0A0B0A;font-weight:800;font-size:15px;display:flex;align-items:center;gap:8px;box-shadow:0 10px 30px rgba(0,0,0,.45);transition:transform .15s}.gobtn:active{transform:translateX(-50%) scale(.95)}
/* reels: mídia 3:4 no topo, legenda abaixo */
.tti .ttbg{top:calc(58px + var(--safeT))!important;bottom:auto!important;height:auto!important;aspect-ratio:3/4;max-height:calc(100% - 250px);left:0;right:0;border-radius:0 0 22px 22px;overflow:hidden}
.tti .ttcs>div,.tti .ttcs img,.tti .ttcs video{object-fit:cover!important;background:#000}
.tti .ttshade{background:linear-gradient(transparent 55%,rgba(0,0,0,.9) 78%)!important}
`;document.head.appendChild(st);

/* ================= NAV ================= */
const TB=['home','explore','feed','map','profile'];
function navHTML(){const un=S.notifs.filter(n=>!n.read).length;return`<button data-t="home" aria-label="Início">${ico('home',22)}</button><button data-t="explore" aria-label="Explorar">${ico('compass',22)}</button><button data-t="feed" aria-label="Rolês em vídeo">${ico('reel',22)}</button><button data-t="map" aria-label="Mapa">${ico('map',22)}</button><button data-t="profile" aria-label="Perfil">${ico('user',22)}</button>`;}
function buildNav(){const tb=$('#tabbar');if(!tb)return;tb.className='tabbar nb';tb.innerHTML=navHTML();
  $$('button',tb).forEach(b=>b.onclick=()=>{const t=b.dataset.t;if(RL.ride.on&&t!=='map'){toast('Encerre o rolê antes','dark');return;}if(t==='compose'){router.go('compose');return;}
   if(router.cur&&(router.cur.tab||router.cur.name)===t&&router.stack.length===1){const sc=router.cur.el&&router.cur.el.querySelector('.xs');if(sc)sc.scrollTo({top:0,behavior:'smooth'});return;}go2(t);});
  const cur=router.cur;if(cur)$$('button',tb).forEach(b=>b.classList.toggle('on',b.dataset.t===(cur.tab||cur.name)));}
function go2(t,dir){const a=TB.indexOf(router.cur&&(router.cur.tab||router.cur.name)),b=TB.indexOf(t);router.tabTo(t);const el=router.cur&&router.cur.el;
  if(el&&!el.classList.contains('clear')&&a>=0&&b>=0&&a!==b){el.classList.remove('root');el.classList.add(dir||(b>a?'tin-l':'tin-r'));}}
RL.go2=go2;
/* antigas abas viram telas internas */
['garage'].forEach(k=>{if(SCREENS[k]){SCREENS[k].tab=null;}});
if(SCREENS.garage){SCREENS.garage.tabbar=false;const gh=SCREENS.garage.html;SCREENS.garage.html=function(p){return`<button class="rb" data-back style="position:absolute;left:14px;top:calc(12px + var(--safeT));z-index:20" aria-label="Voltar">${ico('back',20)}</button>`+gh.call(this,p).replace('<h1','<h1 style="padding-left:52px"');};}
if(SCREENS.feed){SCREENS.feed.tab='feed';delete SCREENS.feed.tabbar;}

/* ================= GESTO: arrastar entre abas, com o dedo ================= */
(function(){let sx=0,sy=0,st0=0,lock=0,el=null,W=1,cur=null,from=-1,edge=false;
 const blocked=t=>t.closest('#tt,.pgar,.cfp,.hs,.pills,.stories2,.ig-cs,.ttcs,.vbar,input,textarea,.noswipe,.mpick,.gcar,.brands,.chips,.sw3,.accs,.stv,.lgf,.sheetw');
 document.addEventListener('touchstart',e=>{lock=0;el=null;if(e.touches.length>1)return;const t=e.touches[0];cur=router.cur;if(!cur||!cur.el||cur.clear)return;if(blocked(e.target))return;
  from=TB.indexOf(cur.tab||cur.name);edge=t.clientX<26&&router.stack.length>1;if(from<0&&!edge)return;if(cur.tabbar===false&&!edge)return;sx=t.clientX;sy=t.clientY;st0=Date.now();el=cur.el;W=el.clientWidth||400;},{passive:true});
 document.addEventListener('touchmove',e=>{if(!el)return;const t=e.touches[0],dx=t.clientX-sx,dy=t.clientY-sy;
  if(!lock){if(Math.abs(dx)<10&&Math.abs(dy)<10)return;lock=Math.abs(dx)>Math.abs(dy)*1.2?1:2;if(lock===1){el.classList.add('drag');}}
  if(lock!==1)return;let d=dx;if(edge){d=Math.max(0,dx);}else{const n=from+(dx<0?1:-1);if(n<0||n>=TB.length)d=dx*.25;}
  el.style.transform=`translateX(${d}px)`;el.style.opacity=String(1-Math.min(.5,Math.abs(d)/W*.6));},{passive:true});
 document.addEventListener('touchend',e=>{if(!el||lock!==1){el=null;return;}const t=e.changedTouches[0],dx=t.clientX-sx,v=Math.abs(dx)/Math.max(1,Date.now()-st0);const e0=el;el=null;e0.classList.remove('drag');
  const go=Math.abs(dx)>W*.28||v>.55;const n=edge?-1:from+(dx<0?1:-1);
  if(go&&(edge?dx>0:(n>=0&&n<TB.length))){e0.classList.add('snap');e0.style.transform=`translateX(${dx<0?-W:W}px)`;e0.style.opacity='0';
   setTimeout(()=>{if(edge)router.back();else go2(TB[n],dx<0?'tin-l':'tin-r');},170);return;}
  e0.classList.add('snap');e0.style.transform='';e0.style.opacity='';setTimeout(()=>e0.classList.remove('snap'),320);},{passive:true});})();

/* ================= DADOS DO FEED ================= */
const VID=()=>RL.VIDS||[];
const made=new Map();
function gen(i){if(made.has(i))return made.get(i);const p=T.genPost(i+300);if(p.kind==='photo'&&!p.nph){const r=hsh('n'+p.id);p.nph=r<.45?1:r<.7?2:r<.88?3:4;}
  if(p.kind!=='ride'&&hsh('v'+p.id)<.34&&VID().length){p.kind='video';p.vid=VID()[Math.floor(hsh('vv'+p.id)*VID().length)];}made.set(i,p);return p;}
const FLT={all:()=>true,fol:p=>p.mine||!!S.follow[p.h],crew:p=>{const w=who(p.h);return p.mine||!!(w.crew&&w.crew===S.me.crew);},near:p=>!RL.distKm||RL.distKm(p.h)<=30,video:p=>p.kind==='video'};
function slidesOf(p){const w=who(p.h);const key=p.model||(p.car?modelKey(p.car):modelKey(w.car||''));
  if(p.media)return p.media.map(m=>m.type==='video'?`<div><video data-mk="${m.k}" muted loop playsinline preload="metadata"></video></div>`:`<div><img data-mk="${m.k}" alt=""></div>`);
  if(p.kind==='video'&&p.vid)return[`<div>${RL.vtag?RL.vtag(p.vid):`<video src="${esc(p.vid.src||p.vid)}" muted loop playsinline></video>`}</div>`];
  if(p.kind==='photo'){const a=[];for(let k=0;k<(p.nph||1);k++)a.push(`<div>${RL.picTag(key,p.id+':'+k)}</div>`);return a;}
  const tr=p.track;if(tr&&tr.length>1)return[`<div>${RL.staticMap?RL.staticMap(tr,360,480,{pad:60}):RL.trackSVG(tr,360,480)}</div>`];
  return[`<div>${RL.picTag(key,p.id)}</div>`];}
function igCard(p){const w=who(p.h);if(!w)return'';const cr=w.crew&&C.CREWS[w.crew];const sl=slidesOf(p);const on=p.mine?!!(S.posts.find(x=>x.id===p.id)||{}).hornOn:!!S.horn[p.id];
  const n=p.mine?(S.posts.find(x=>x.id===p.id)||{}).horn||0:(p.horn||0)+(S.horn[p.id]?1:0);const cm=(p.cm||[]).length+((S.cm||{})[p.id]||[]).length;const key=p.model||modelKey(w.car||'');const saved=!!(S.saved||{})[p.id];
  const isRide=!p.media&&p.kind!=='photo'&&p.kind!=='video';const sub=[p.city||p.where||'',ago(p.t)].filter(Boolean).join(' · ');
  return`<article class="ig" data-id="${p.id}"><div class="ig-h"><button data-on="prof" data-h="${esc(p.h)}">${avatar(w,38)}</button><div class="nm2"><button class="u" data-u="${esc(p.h)}"><b>${esc(w.n)}${cr?` <span style="color:${cr.c}">●</span>`:''}</b></button><span class="sub">${key?`<button data-car="${esc(key)}">${esc(key)}</button> · `:''}${esc(sub)}</span></div><button class="rb" style="border:none;background:none;width:34px" data-on="more" data-id="${p.id}" aria-label="Mais">${ico('dots',20)}</button></div>
   <div class="ig-m"><div class="ig-cs">${sl.join('')}</div>${sl.length>1?`<span class="cnt">1/${sl.length}</span>`:''}${p.kind==='video'||p.media&&p.media.some(m=>m.type==='video')?`<button class="mt" data-on="snd">${ico(S.sound?'vol':'mute',16)}</button>`:''}
   ${isRide?`<div class="stat"><span class="l">+${p.hex||0} hex</span><span>${String(Math.round((p.km||0)*10)/10).replace('.',',')} km</span>${p.sec?`<span>${fmtT(p.sec)}</span>`:''}</div>`:''}<div class="pop">${ic(I.horn,88,2)}</div></div>
   ${sl.length>1?`<div class="ig-d">${sl.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:''}
   <div class="ig-a"><button data-on="horn" data-id="${p.id}" class="${on?'on':''}" aria-label="Buzinar">${ic(I.horn,23,2)}<span>${n}</span></button><button data-on="cmts" data-id="${p.id}" aria-label="Comentar">${ico('cmt',22)}<span>${cm}</span></button><button data-on="sharep" data-id="${p.id}" aria-label="Enviar">${ico('send',21)}</button><span style="flex:1"></span><button data-on="save" data-id="${p.id}" class="${saved?'on':''}" aria-label="Salvar">${ico('save',21)}</button></div>
   <div class="ig-c"><button class="u" data-u="${esc(p.h)}">${esc(w.h)}</button>${esc(p.txt||'')}${cm?`<button class="mu" data-on="cmts" data-id="${p.id}">Ver ${cm>1?'os '+cm+' comentários':'1 comentário'}</button>`:''}</div>
   ${p.kind==='video'&&p.vid&&p.vid.a?`<div class="ig-cr">Vídeo: ${esc(p.vid.a)} · ${esc(p.vid.l)} · Wikimedia Commons</div>`:p.kind==='photo'?`<div class="ig-cr">Foto: Wikimedia Commons (CC)</div>`:''}</article>`;}
RL.igCard=igCard;
const playV=v=>RL.playV?RL.playV(v):v.play().catch(()=>{});
function wireFeed(root){const obs=new IntersectionObserver(es=>es.forEach(e=>{$$('video',e.target).forEach(v=>{if(e.isIntersecting&&e.intersectionRatio>.55){v.muted=!S.sound;if(v.preload==='none')v.preload='auto';playV(v);}else v.pause();});}),{threshold:[0,.55,1]});
  $$('.ig:not([data-w])',root).forEach(a=>{a.dataset.w=1;obs.observe($('.ig-m',a));const cs=$('.ig-cs',a);if(cs){const n=cs.children.length;cs.addEventListener('scroll',()=>{const i=Math.round(cs.scrollLeft/(cs.clientWidth||1));$$('.ig-d i',a).forEach((d,k)=>d.classList.toggle('on',k===i));const c=$('.cnt',a);if(c)c.textContent=(i+1)+'/'+n;},{passive:true});}
   let lt=0;$('.ig-m',a).addEventListener('click',e=>{if(e.target.closest('button'))return;const now=Date.now();if(now-lt<300){lt=0;const b=$('[data-on="horn"]',a);if(b&&!b.classList.contains('on'))b.click();const pp=$('.pop',a);pp.classList.add('on');setTimeout(()=>pp.classList.remove('on'),650);navigator.vibrate&&navigator.vibrate(12);return;}lt=now;
    setTimeout(()=>{if(lt!==now)return;const v=$('video',a);if(v){if(v.paused)playV(v);else v.pause();}},300);});});
  if(RL.fillMedia)RL.fillMedia(root);else $$('[data-mk]',root).forEach(()=>{});}
const PH={...C.postHandlers,save(a){S.saved=S.saved||{};const id=a.dataset.id;S.saved[id]=!S.saved[id];if(!S.saved[id])delete S.saved[id];save();a.classList.toggle('on',!!S.saved[id]);toast(S.saved[id]?'Salvo na sua coleção':'Removido dos salvos','dark');},
 snd(a){S.sound=!S.sound;save();$$('.ig video').forEach(v=>v.muted=!S.sound);$$('.ig .mt').forEach(b=>b.innerHTML=ico(S.sound?'vol':'mute',16));},
 more(a){const id=a.dataset.id;sheet(`<div class="grp" style="margin:0"><button class="it" id="m1"><span class="ii">${ico('save',18)}</span><span class="tx">Salvar</span></button><button class="it" id="m2"><span class="ii">${ico('share',18)}</span><span class="tx">Compartilhar</span></button><button class="it" id="m3"><span class="ii">${ico('x',18)}</span><span class="tx">Não tenho interesse</span></button><button class="it" id="m4" style="color:var(--red)"><span class="ii">${ico('flag',18)}</span><span class="tx">Denunciar</span></button></div>`,(w,close)=>{
   $('#m1',w).onclick=()=>{close();PH.save({dataset:{id},classList:{toggle(){}}});};$('#m2',w).onclick=()=>{close();PH.sharep({dataset:{id}});};$('#m3',w).onclick=()=>{close();const el=document.querySelector(`.ig[data-id="${id}"]`);if(el){el.style.transition='opacity .25s,transform .25s';el.style.opacity=0;el.style.transform='scale(.97)';setTimeout(()=>el.remove(),260);}toast('Vamos mostrar menos posts assim','dark');};$('#m4',w).onclick=()=>{close();toast('Obrigado, vamos analisar','dark');};});}};

/* ================= STORIES ================= */
S.seen=S.seen||{};
const storyPeople=()=>{const m=people().filter(w=>S.follow[w.h]||(RL.mutual&&RL.mutual(w.h)));const rest=people().filter(w=>!m.includes(w)&&hsh('st'+w.h)<.5);return[...m,...rest].slice(0,14);};
function storiesOf(w){const key=modelKey(w.car||'');const n=1+Math.floor(hsh('sn'+w.h)*3);const out=[];const caps=['Bom dia de estrada','Lavou, tá novo','Rolê de hoje','Olha esse pôr do sol','Parada pro café','Quem colou?'];
  for(let k=0;k<n;k++){if(k===1&&VID().length&&hsh('sv'+w.h)<.6){const v=VID()[Math.floor(hsh('svv'+w.h)*VID().length)];out.push({v,cap:caps[Math.floor(hsh(w.h+k)*caps.length)],t:Date.now()-hsh('t'+w.h+k)*20*3600e3});}
   else out.push({img:RL.picTag(key,w.h+':st'+k),cap:k===0?caps[Math.floor(hsh(w.h)*caps.length)]:'',t:Date.now()-hsh('t'+w.h+k)*20*3600e3});}return out;}
function storiesRow(){const list=storyPeople();const mine=(S.myStories||[]).filter(s=>s.t>Date.now()-864e5);
  return`<div class="stories2"><button class="sto" data-on="mystory"><span class="rg" style="${mine.length?'':'background:none'}"><span>${avatar({me:true},58)}</span><i class="add">${ico('plus',12,3)}</i></span><small>Seu story</small></button>
   ${list.map(w=>`<button class="sto ${S.seen[w.h]?'seen':''}" data-on="story" data-h="${esc(w.h)}"><span class="rg"><span>${avatar(w,58)}</span></span><small>${esc(w.n.split(' ')[0])}</small></button>`).join('')}</div>`;}
function openStories(startH){const list=storyPeople();let pi=Math.max(0,list.findIndex(w=>w.h===startH)),si=0,timer=0,t0=0,dur=5000,paused=false,raf=0;
  const host=document.getElementById('app');const w=document.createElement('div');w.className='stv';host.appendChild(w);
  const close=()=>{cancelAnimationFrame(raf);w.style.transition='opacity .2s,transform .25s';w.style.opacity=0;w.style.transform='scale(.94)';setTimeout(()=>w.remove(),220);const el=router.cur&&router.cur.el;if(el)$$('.sto[data-h]',el).forEach(b=>b.classList.toggle('seen',!!S.seen[b.dataset.h]));};
  function show(){const p=list[pi];if(!p){close();return;}const items=storiesOf(p);if(si>=items.length){pi++;si=0;return show();}if(si<0){pi=Math.max(0,pi-1);si=0;}const it=items[si];S.seen[p.h]=1;save();
   w.innerHTML=`<div class="md">${it.v?RL.vtag(it.v,'autoplay'):it.img}</div><div class="sh3"></div><div class="bars">${items.map((_,k)=>`<i><b style="width:${k<si?100:0}%"></b></i>`).join('')}</div>
    <div class="hd"><button data-u="${esc(p.h)}" style="display:flex;align-items:center;gap:10px;color:#fff;font:inherit;text-align:left">${avatar(p,34)}<span class="tx">${esc(p.n)}<small>${ago(it.t)}</small></span></button><span style="flex:1"></span><button class="rb" style="background:rgba(0,0,0,.3);border:none;color:#fff" data-x aria-label="Fechar">${ico('x',18)}</button></div>
    ${it.cap?`<div class="cap">${esc(it.cap)}</div>`:''}<div class="tl"></div><div class="tr2"></div><div class="ft"><input placeholder="Responder ${esc(p.n.split(' ')[0])}…" enterkeyhint="send"><button class="rb" style="background:none;border:none;color:#fff" data-h>${ic(I.horn,24,2)}</button></div>`;
   const img=$('.md img',w);if(img){img.classList.add('ok');img.style.opacity=1;}const v=$('video',w);dur=5000;if(v){v.muted=!S.sound;playV(v);v.addEventListener('loadedmetadata',()=>{dur=Math.min(12000,(v.duration||5)*1000);});}
   if(RL.fillMedia)RL.fillMedia(w);
   $('[data-x]',w).onclick=close;$('.tl',w).onclick=()=>{si--;if(si<0){pi--;si=0;if(pi<0){pi=0;}}t0=performance.now();show();};$('.tr2',w).onclick=()=>{si++;t0=performance.now();show();};
   const inp=$('input',w);inp.onfocus=()=>paused=true;inp.onblur=()=>paused=false;inp.onkeydown=e=>{if(e.key==='Enter'&&inp.value.trim()){dmSend(p.h,inp.value.trim(),'↪ Respondeu seu story');inp.value='';inp.blur();toast('Resposta enviada','dark');}};
   $('[data-h]',w).onclick=()=>{toast('Buzinou pro story de '+p.n.split(' ')[0],'dark');navigator.vibrate&&navigator.vibrate(15);};
   t0=performance.now();}
  let pst=0;w.addEventListener('pointerdown',e=>{if(e.target.closest('input,button'))return;pst=performance.now();paused=true;});w.addEventListener('pointerup',()=>{paused=false;});
  let sy=0;w.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;},{passive:true});w.addEventListener('touchend',e=>{if(e.changedTouches[0].clientY-sy>90)close();},{passive:true});
  let last=performance.now();const loop=now=>{const dt=now-last;last=now;if(paused)t0+=dt;const k=Math.min(1,(now-t0)/dur);const b=$$('.bars i b',w)[si];if(b)b.style.width=(k*100)+'%';if(k>=1){si++;show();}raf=requestAnimationFrame(loop);};
  show();raf=requestAnimationFrame(loop);}
RL.openStories=openStories;

/* ================= INÍCIO ================= */
const CRT=['all','fol','crew','near','video'],CRL={all:'Para você',fol:'Seguindo',crew:'Crew',near:'Perto de mim',video:'Vídeos'};
function crewsRow(){const cs=Object.entries(C.CREWS);return`<div class="sh-t"><b>Crews em alta</b><button data-go="crews">Ver todas</button></div><div class="hs">${cs.map(([n,c],i)=>{const m=C.P.find(p=>p.crew===n);return`<button class="crc" data-go="crew" data-p='${esc(JSON.stringify({id:n}))}'><div class="ph">${RL.picTag(modelKey(m?m.car:''),'crew'+n)}<span class="tg" style="background:${c.c}">${c.m} membros</span></div><div class="in"><b>${esc(n)}</b><div>${esc(c.d)}</div></div></button>`;}).join('')}</div>`;}
function suggRow(){const ps=people().filter(w=>!S.follow[w.h]).slice(0,8);if(!ps.length)return'';return`<div class="sh-t"><b>Sugestões pra você</b><button data-go="explore">Ver mais</button></div><div class="hs" style="padding-bottom:6px">${ps.map(w=>`<div class="sug"><button data-on="prof" data-h="${esc(w.h)}">${avatar(w,64)}</button><b>${esc(w.n)}</b><small>${esc(w.car||'')}${w.crew?' · '+esc(w.crew):''}</small><button class="btn2" data-on="fol" data-h="${esc(w.h)}" style="width:100%;margin-top:6px">Seguir</button></div>`).join('')}</div>`;}
function tripsRow(){return`<div class="sh-t"><b>Viagens pra fazer de carro</b><button data-go="trips">Ver todas</button></div><div class="hs" style="padding-bottom:6px">${TRIPS.slice(0,5).map(tripCard).join('')}</div>`;}
SCREENS.home={tab:'home',
 html(){const f=this.f||'all';const un=S.notifs.filter(n=>!n.read).length+notifSeed().filter(n=>!S.nread||n.t>S.nread).length;const dm=unreadDM();
  return`<div class="x-top"><div class="wm">rol<i>ê</i></div><button class="rb" data-on="create" aria-label="Criar">${ico('plus',21,2.2)}</button><button class="rb" data-go="notifs" aria-label="Notificações">${ico('heart',21)}${un?`<span class="bd">${un>9?'9+':un}</span>`:''}</button><button class="rb" data-go="inbox" aria-label="Mensagens">${ico('send',20)}${dm?`<span class="bd">${dm}</span>`:''}</button></div>
  <div class="xs" id="hx">${storiesRow()}<div class="pills" style="padding-top:12px">${CRT.map(k=>`<button class="pill ${k===f?'on':''}" data-on="flt" data-k="${k}">${CRL[k]}</button>`).join('')}</div><div id="hf"></div></div>`;},
 mount(el){const f=this.f||'all';const hf=$('#hf',el);this.n=0;this.i=0;
  const mine=C.allPosts().filter(p=>p.mine).slice(0,4);const base=[...mine,...C.FPOSTS].filter(FLT[f]);
  const add=list=>{let h='';for(const p of list){h+=igCard(p);this.n++;if(this.n===2&&f==='all')h+=crewsRow();if(this.n===4)h+=suggRow();if(this.n===7)h+=tripsRow();}hf.insertAdjacentHTML('beforeend',h);wireFeed(hf);};
  const more=()=>{const l=[];let g=0;while(l.length<5&&g<60){const p=gen(this.i++);g++;if(FLT[f](p))l.push(p);}add(l);};
  if(f==='crew'&&!S.me.crew)hf.innerHTML=`<div style="padding:30px 24px;text-align:center"><div class="b" style="font-size:17px">Você ainda não tem crew</div><div class="small muted" style="margin:6px 0 14px">Crews rodam juntas, dividem território e têm chat próprio.</div><button class="btn2" data-go="crews">Achar uma crew</button></div>`+crewsRow();
  else{add(base.slice(0,6));more();}
  const hx=$('#hx',el);hx.addEventListener('scroll',()=>{if(hx.scrollTop+hx.clientHeight*2.5>hx.scrollHeight&&!(f==='crew'&&!S.me.crew))more();},{passive:true});
  if(this.y)hx.scrollTop=this.y;hx.addEventListener('scroll',()=>{this.y=hx.scrollTop;},{passive:true});},
 leave(){$$('.ig video').forEach(v=>v.pause());},
 on:{...PH,flt(a){if(a.dataset.k===(this.f||'all'))return;this.f=a.dataset.k;this.y=0;router.render(this,true,true);},story(a){openStories(a.dataset.h);},create(){RL.createSheet&&RL.createSheet();},
  mystory(){const mine=(S.myStories||[]).filter(s=>s.t>Date.now()-864e5);if(!mine.length)router.go('compose',{mode:'story'});else RL.openMyStory&&RL.openMyStory();},
  fol(a){const on=!S.follow[a.dataset.h];C.follow(a.dataset.h,on);a.textContent=on?'Seguindo':'Seguir';a.classList.toggle('sec',on);}}};

/* ================= EXPLORAR ================= */
const ECAT=[['all','Tudo'],['car','Carros'],['moto','Motos'],['trip','Viagens'],['ev','Eventos'],['crew','Crews'],['rank','Rankings']];
SCREENS.explore={tab:'explore',
 html(){const c=this.c||'all';return`<div class="x-top"><h1>Explorar</h1><button class="rb" data-go="trips" aria-label="Viagens">${ico('route',20)}</button></div>
  <div style="padding:0 16px 6px"><button data-go="search" style="width:100%;height:48px;border-radius:16px;background:var(--surf);border:1px solid var(--line);display:flex;align-items:center;gap:10px;padding:0 16px;color:var(--tx3);font-size:15px">${ico('search',18)}Pessoas, carros, cidades, ruas…</button></div>
  <div class="pills">${ECAT.map(([k,t])=>`<button class="pill ${k===c?'on':''}" data-on="cat" data-k="${k}">${t}</button>`).join('')}</div><div class="xs" id="ex"></div>`;},
 mount(el){const c=this.c||'all';const ex=$('#ex',el);let h='';
  const evs=(RL.evAll?RL.evAll():[]).slice(0,8);
  const evRow=()=>evs.length?`<div class="sh-t"><b>Eventos perto de você</b><button data-go="events">Ver todos</button></div><div class="hs">${evs.map(e=>`<button class="crc" style="width:230px" data-go="event" data-p='${esc(JSON.stringify({id:e.id}))}'><div class="ph" style="height:96px">${RL.picTag(modelKey((C.who(e.host)||{}).car||''),'ev'+e.id)}<span class="tg" style="background:var(--lime)">${new Date(e.t).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span></div><div class="in"><b>${esc(e.title)}</b><div>${e.going} vão · ${RL.distTxt?'':''}${new Date(e.t).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</div></div></button>`).join('')}</div>`:'';
  const crews=()=>`<div class="sh-t"><b>Crews</b><button data-go="crews">Ver todas</button></div>${Object.entries(C.CREWS).map(([n,cr])=>`<button class="row2" data-go="crew" data-p='${esc(JSON.stringify({id:n}))}'><span class="gav" style="background:${cr.c}">${esc(n.split(' ').map(x=>x[0]).join(''))}</span><span class="tx"><b>${esc(n)}</b><span>${cr.m} membros · ${fmt(cr.hex)} hex · ${esc(cr.d)}</span></span>${ico('chev',18)}</button>`).join('')}`;
  const rank=()=>`<div class="sh-t"><b>Rankings</b></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px">${[['km','Mais km rodados','route'],['hex','Mais hexágonos','grid'],['bairros','Mais bairros','lock'],['cidades','Mais cidades','flag']].map(([k,t,i])=>`<button data-go="rank2" style="text-align:left;padding:14px;border-radius:20px;background:var(--surf);border:1px solid var(--line)"><span class="ii" style="width:36px;height:36px;border-radius:12px;background:var(--lime);color:var(--on-acc);display:flex;align-items:center;justify-content:center">${ico(i,18)}</span><b style="display:block;margin-top:10px;font-size:14px">${t}</b><small class="muted">Mundo · Brasil · cidade</small></button>`).join('')}</div><div class="small muted" style="padding:10px 18px 0">Na rua o ranking é de exploração. Tempo e velocidade só valem no modo pista, em autódromo.</div>`;
  const grid=flt=>{const ps=[];for(let i=0;ps.length<30&&i<200;i++){const p=gen(1000+i);if(p.kind==='ride')continue;if(flt&&!flt(p))continue;ps.push([1000+i,p]);}
   return`<div class="sh-t"><b>Em alta</b></div><div class="gr3">${ps.map(([ix,p],i)=>{const w=who(p.h);const key=p.model||modelKey(w.car||'');const tall=i%10===2||i%10===6;return`<button class="${tall?'tl':''}" data-go="post" data-p='{"i":${ix}}'>${p.kind==='video'?`<img src="${esc(p.vid.poster)}" alt="" loading="lazy" onerror="this.style.display='none'"><span class="vi">${ico('play',16)}</span>`:RL.picTag(key,p.id+':0')}</button>`;}).join('')}</div>`;};
  if(c==='all')h=tripsRow()+evRow()+crewsRow()+grid();
  else if(c==='car')h=grid(p=>!RL.isMoto||!RL.isMoto(p.model||''));
  else if(c==='moto')h=grid(p=>{const w=who(p.h);return!!w.moto||(RL.isMoto&&RL.isMoto(p.model||''));});
  else if(c==='trip')h=TRIPS.map(t=>`<button class="row2" data-go="trip" data-p='${esc(JSON.stringify({id:t.id}))}'><span class="thumb"><img src="${esc(tripImg(t))}" alt=""></span><span class="tx"><b>${esc(t.n)}</b><span>≈ ${t.km} km · ${esc(t.tags.join(' · '))}</span></span>${ico('chev',18)}</button>`).join('');
  else if(c==='ev')h=evRow()+`<div style="padding:12px 16px"><button class="btn2 full" data-go="events">Ver mapa de eventos</button></div>`;
  else if(c==='crew')h=crews();else if(c==='rank')h=rank();
  ex.innerHTML=h+`<div style="height:20px"></div>`;if(RL.fillMedia)RL.fillMedia(ex);},
 on:{cat(a){this.c=a.dataset.k;router.render(this,true,true);}}};
SCREENS.post={tabbar:false,html(p){const q=gen(p.i);return`<div class="x-top"><button class="rb" data-back>${ico('back',20)}</button><h2>Publicação</h2><span style="width:42px"></span></div><div class="xs" id="px">${igCard(q)}</div>`;},mount(el){wireFeed(el);},leave(){$$('.ig video').forEach(v=>v.pause());},on:{...PH}};
SCREENS.crews={tabbar:false,html(){return`<div class="x-top"><button class="rb" data-back>${ico('back',20)}</button><h2>Crews</h2><span style="width:42px"></span></div><div class="xs">${Object.entries(C.CREWS).map(([n,cr])=>`<button class="row2" data-go="crew" data-p='${esc(JSON.stringify({id:n}))}'><span class="gav" style="background:${cr.c}">${esc(n.split(' ').map(x=>x[0]).join(''))}</span><span class="tx"><b>${esc(n)}${S.me.crew===n?' · sua crew':''}</b><span>${cr.m} membros · ${fmt(cr.hex)} hex</span><span>${esc(cr.d)}</span></span>${ico('chev',18)}</button>`).join('')}</div>`;}};

/* ================= VIAGENS ================= */
const TRIPS=[
 {id:'cipo',n:'Serra do Cipó',from:'Belo Horizonte',a:[-43.94,-19.92],b:[-43.58,-19.33],km:100,h:'1h50',tags:['Serra','Cachoeiras'],v:'Riding_on_the_road_shoulder',d:'MG-010 com subida de serra e mirantes. Pare na Cachoeira Grande e no Mirante do Cipó.',stops:['Lagoa Santa (café)','Mirante da Serra do Cipó','Cachoeira Grande']},
 {id:'op',n:'Ouro Preto pela Estrada Real',from:'Belo Horizonte',a:[-43.94,-19.92],b:[-43.50,-20.385],km:100,h:'1h45',tags:['Histórica','Curvas'],v:'road_trip_to_Iran',d:'BR-040 e BR-356 até a cidade histórica. Ladeiras de pedra: vá devagar.',stops:['Itabirito (pastel de angu)','Cachoeira das Andorinhas','Centro histórico']},
 {id:'cap',n:'Capitólio e Furnas',from:'Belo Horizonte',a:[-43.94,-19.92],b:[-46.05,-20.615],km:280,h:'4h',tags:['Lago','Fim de semana'],v:'Mai_Mahiu',d:'MG-050 até os cânions de Furnas. Melhor sair cedo no sábado.',stops:['Divinópolis (abastecer)','Mirante dos Canyons','Lagoa Azul']},
 {id:'can',n:'Serra da Canastra',from:'Belo Horizonte',a:[-43.94,-19.92],b:[-46.63,-20.25],km:330,h:'5h',tags:['Terra','Aventura'],v:'Mai_Mahiu',d:'Trechos de terra no parque. Pneu calibrado e tanque cheio antes de São Roque.',stops:['Piumhi','São Roque de Minas','Casca d\'Anta']},
 {id:'ino',n:'Inhotim',from:'Belo Horizonte',a:[-43.94,-19.92],b:[-44.22,-20.125],km:60,h:'1h10',tags:['Bate-volta','Arte'],v:'Cars_driving_at_night',d:'Bate-volta curto pela BR-381 e MG-040. Bom pra estrear o carro novo.',stops:['Brumadinho','Inhotim']},
 {id:'rio',n:'BH → Rio pela BR-040',from:'Belo Horizonte',a:[-43.94,-19.92],b:[-43.18,-22.91],km:440,h:'6h30',tags:['Clássica','Serra'],v:'road_trip_to_Iran',d:'Descida da serra de Petrópolis no final. Pedágios no caminho.',stops:['Juiz de Fora','Petrópolis','Rio de Janeiro']},
 {id:'jp',n:'João Pinheiro → Paracatu',from:'João Pinheiro',a:[-46.17,-17.74],b:[-46.87,-17.22],km:105,h:'1h30',tags:['Noroeste de MG','Reta'],v:'Driving_past',d:'BR-040 sentido Brasília, cerrado aberto e retas longas.',stops:['Posto na BR-040','Centro histórico de Paracatu']},
 {id:'rastro',n:'Serra do Rio do Rastro',from:'Florianópolis',a:[-48.55,-27.59],b:[-49.55,-28.39],km:200,h:'3h30',tags:['Lendária','Curvas'],v:'Drift_Zone',d:'Uma das estradas mais bonitas do mundo. Neblina comum: farol baixo.',stops:['Lauro Müller','Mirante da Serra','Bom Jardim da Serra']}];
const tripImg=t=>{const v=VID().find(x=>x.fn&&x.fn.includes(t.v))||VID()[Math.floor(hsh(t.id)*Math.max(1,VID().length))];return v?v.poster:'';};
function tripCard(t){return`<button class="trc" data-go="trip" data-p='${esc(JSON.stringify({id:t.id}))}'><img src="${esc(tripImg(t))}" alt="" loading="lazy"><div class="sh2"></div><div class="tg">${t.tags.map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="in"><b>${esc(t.n)}</b><div>Saindo de ${esc(t.from)} · ≈ ${t.km} km · ${t.h}</div></div></button>`;}
S.trips=S.trips||[];
const kml=()=>{const c=RL.activeCar&&RL.activeCar();return(c&&+c.kml)||11;};
const tripCost=km=>{const c=RL.activeCar&&RL.activeCar();if(c&&c.ev)return km/((+c.kml)||6)*(S.kwhPrice||.95);let p=RL.fuelAvg?+RL.fuelAvg():0;if(!isFinite(p)||p<2)p=5.9;return km/(kml()||12)*p;};
const brl=v=>'R$ '+v.toFixed(2).replace('.',',');
SCREENS.trips={tabbar:false,
 html(){const t=this.t||'disc';return`<div class="x-top"><button class="rb" data-back>${ico('back',20)}</button><h2>Viagens</h2><button class="rb" data-on="newt" aria-label="Nova viagem">${ico('plus',20)}</button></div>
  <div style="padding:0 16px 8px"><div class="sw3"><button class="${t==='disc'?'on':''}" data-on="tab" data-k="disc">Descobrir</button><button class="${t==='mine'?'on':''}" data-on="tab" data-k="mine">Minhas viagens${S.trips.length?' ('+S.trips.length+')':''}</button></div></div>
  <div class="xs">${t==='disc'?`<div class="hs" style="padding-top:8px">${TRIPS.slice(0,4).map(tripCard).join('')}</div><div class="sh-t"><b>Todas as rotas</b></div>${TRIPS.map(x=>`<button class="row2" data-go="trip" data-p='${esc(JSON.stringify({id:x.id}))}'><span class="thumb"><img src="${esc(tripImg(x))}" alt=""></span><span class="tx"><b>${esc(x.n)}</b><span>${esc(x.from)} · ≈ ${x.km} km · ${x.h} · ${brl(tripCost(x.km))} de combustível</span></span>${ico('chev',18)}</button>`).join('')}`
   :S.trips.length?S.trips.map((x,i)=>{const dd=Math.ceil((new Date(x.date)-Date.now())/864e5);const ck=Object.values(x.ck||{}).filter(Boolean).length;return`<button class="row2" data-go="tripPlan" data-p='${esc(JSON.stringify({i}))}'><span class="thumb"><img src="${esc(x.img||'')}" alt=""></span><span class="tx"><b>${esc(x.n)}</b><span>${x.date?(dd>0?'em '+dd+' dias':dd===0?'hoje':'já foi'):'sem data'} · ${(x.who||[]).length+1} pessoas · checklist ${ck}/${CHK.length}</span></span>${ico('chev',18)}</button>`;}).join('')
   :`<div style="padding:40px 28px;text-align:center"><div style="font-size:17px;font-weight:800">Nenhuma viagem planejada</div><div class="small muted" style="margin:6px 0 16px">Escolha uma rota ou crie a sua. Dá pra chamar amigos, dividir o combustível e fazer o checklist do carro.</div><button class="btn2" data-on="newt">Criar viagem</button></div>`}</div>`;},
 mount(){},
 on:{tab(a){this.t=a.dataset.k;router.render(this,true,true);},newt(){sheet(`<div style="font-size:20px;font-weight:800">Nova viagem</div><div class="small muted" style="margin:4px 0 8px">Pra onde você vai?</div><input class="inp" id="td" placeholder="Ex.: Tiradentes, MG" style="width:100%"><button class="btn2 full" id="tg" style="margin-top:14px">Calcular rota</button>`,(w,close)=>{
   $('#tg',w).onclick=async()=>{const q=$('#td',w).value.trim();if(q.length<3)return;$('#tg',w).textContent='Buscando…';try{const j=await(await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q='+encodeURIComponent(q))).json();if(!j[0])throw 0;
    const a=(RL.gps&&RL.gps.pos)||S.lastPos||RL.DEFAULT_CENTER;const b=[+j[0].lon,+j[0].lat];const id='u'+Date.now();TRIPS.push({id,n:j[0].display_name.split(',')[0],from:RL.myCity&&RL.myCity()||'Você',a,b,km:Math.round(hav(a,b)*1.25/1000),h:'—',tags:['Sua rota'],v:'',d:'Rota criada por você.',stops:[]});close();router.go('trip',{id});}catch(e){$('#tg',w).textContent='Não achei, tente outro nome';}};});}}};
const hav=(a,b)=>{const R=x=>x*Math.PI/180;const d=Math.sin(R(b[1]-a[1])/2)**2+Math.cos(R(a[1]))*Math.cos(R(b[1]))*Math.sin(R(b[0]-a[0])/2)**2;return 12742000*Math.asin(Math.sqrt(d));};
const CHK=['Calibrar pneus e estepe','Óleo e água','Documentos e CNH','Macaco e triângulo','Carregador e suporte','Tanque cheio'];
SCREENS.trip={tabbar:false,
 html(p){const t=TRIPS.find(x=>x.id===p.id);if(!t)return'<div class="empty">Rota não encontrada</div>';
  return`<div class="xs" style="padding-bottom:120px"><div style="position:relative;height:300px;overflow:hidden"><img src="${esc(tripImg(t))}" style="width:100%;height:100%;object-fit:cover" alt=""><div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.4),transparent 35%,transparent 55%,var(--bg))"></div>
   <button class="rb" data-back style="position:absolute;left:14px;top:calc(12px + var(--safeT))">${ico('back',20)}</button><div style="position:absolute;left:18px;right:18px;bottom:8px"><div style="font-size:28px;font-weight:800;letter-spacing:-.5px;line-height:1.1">${esc(t.n)}</div><div class="small muted" style="margin-top:4px">Saindo de ${esc(t.from)} · ${t.tags.map(esc).join(' · ')}</div></div></div>
   <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:14px 16px 0">${[['tk','≈ '+t.km+' km','distância'],['th',t.h,'tempo'],['tc',brl(tripCost(t.km)),'combustível']].map(([i,v,l])=>`<div style="padding:12px;border-radius:18px;background:var(--surf);border:1px solid var(--line)"><b id="${i}" style="font-size:17px;display:block">${v}</b><small class="muted">${l}</small></div>`).join('')}</div>
   <div id="trm" style="margin:12px 16px 0;height:190px;border-radius:22px;overflow:hidden;background:var(--surf2)"></div>
   <div style="padding:14px 18px 0;font-size:14.5px;line-height:1.5;color:var(--tx2)">${esc(t.d)}</div>
   ${t.stops.length?`<div class="sh-t"><b>Paradas sugeridas</b></div>${t.stops.map((s,i)=>`<div class="row2"><span class="ii" style="width:30px;height:30px;border-radius:99px;background:${i===t.stops.length-1?'var(--lime)':'var(--surf2)'};color:${i===t.stops.length-1?'var(--on-acc)':'var(--tx)'};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px">${i+1}</span><span class="tx"><b style="font-size:14.5px">${esc(s)}</b></span></div>`).join('')}`:''}
   <div class="sh-t"><b>Quem já fez</b></div><div class="hs">${people().filter(w=>hsh(t.id+w.h)<.4).slice(0,8).map(w=>`<button data-on="prof" data-h="${esc(w.h)}" style="display:flex;flex-direction:column;align-items:center;gap:4px;width:64px">${avatar(w,52)}<small style="font-size:11px">${esc(w.n.split(' ')[0])}</small></button>`).join('')}</div>
   <div class="small muted" style="padding:14px 18px 0">Distância e tempo pela rota real (OSRM/OpenStreetMap). Combustível estimado com o consumo do seu carro e o preço médio perto de você.</div></div>
  <div style="position:absolute;left:0;right:0;bottom:0;padding:12px 16px calc(14px + var(--safeB));background:linear-gradient(transparent,var(--bg) 30%);display:flex;gap:10px"><button class="btn2 sec" data-on="nav" style="height:52px;flex:1">${ico('route',18)}Navegar</button><button class="btn2" data-on="plan" style="height:52px;flex:1.4">Planejar viagem</button></div>`;},
 async mount(el){const t=TRIPS.find(x=>x.id===this.params.id);if(!t)return;const m=$('#trm',el);const W=m.clientWidth||360;
  m.innerHTML=RL.staticMap?RL.staticMap([t.a,t.b],W,190,{pad:30}):'';
  try{const j=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${t.a.join(',')};${t.b.join(',')}?overview=simplified&geometries=geojson`)).json();const r=j.routes&&j.routes[0];if(!r||router.cur.el!==el)return;
   t.km=Math.round(r.distance/1000);const mn=Math.round(r.duration/60);t.h=mn>=60?Math.floor(mn/60)+'h'+String(mn%60).padStart(2,'0'):mn+' min';$('#tk',el).textContent=t.km+' km';$('#th',el).textContent=t.h;$('#tc',el).textContent=brl(tripCost(t.km));
   if(RL.staticMap)m.innerHTML=RL.staticMap(r.geometry.coordinates,W,190,{pad:24});}catch(e){}},
 on:{prof(a){C.openProfile(a.dataset.h);},nav(){const t=TRIPS.find(x=>x.id===this.params.id);router.go('preview',{dest:{name:t.n,p:t.b}});},
  plan(){const t=TRIPS.find(x=>x.id===this.params.id);S.trips.unshift({id:t.id,n:t.n,km:t.km,img:tripImg(t),date:'',who:[],ck:{}});save();router.go('tripPlan',{i:0});}}};
SCREENS.tripPlan={tabbar:false,
 html(p){const x=S.trips[p.i];if(!x)return'';const fr=people().filter(w=>RL.mutual?RL.mutual(w.h):S.follow[w.h]).slice(0,10);const n=(x.who||[]).length+1;const c=tripCost(x.km||0)*2;
  return`<div class="x-top"><button class="rb" data-back>${ico('back',20)}</button><h2>${esc(x.n)}</h2><button class="rb" data-on="del" aria-label="Excluir">${ico('x',18)}</button></div><div class="xs">
   <div class="grp-t">Quando</div><div class="grp"><div class="it"><span class="ii">${ico('cal',18)}</span><span class="tx">Data de saída</span><input type="date" id="tdt" value="${esc(x.date||'')}" style="background:none;border:none;color:var(--tx);font:inherit;font-weight:700"></div></div>
   <div class="grp-t">Quem vai</div><div class="grp">${fr.length?fr.map(w=>`<button class="it" data-on="who" data-h="${esc(w.h)}">${avatar(w,34)}<span class="tx">${esc(w.n)}<small>${esc(w.car||'')}</small></span><span class="tg2 ${(x.who||[]).includes(w.h)?'on':''}"></span></button>`).join(''):'<div class="it"><span class="tx">Siga e seja seguido de volta pra convidar amigos</span></div>'}</div>
   <div class="grp-t">Custo (ida e volta)</div><div class="grp"><div class="it"><span class="ii">${ico('pump',18)}</span><span class="tx">Combustível total<small>${x.km||'?'} km × 2 · ${kml()} km/l</small></span><b>${brl(c)}</b></div><div class="it"><span class="ii">${ico('people',18)}</span><span class="tx">Por pessoa<small>${n} pessoa${n>1?'s':''} no carro</small></span><b class="lime">${brl(c/n)}</b></div></div>
   <div class="grp-t">Checklist do carro</div><div class="grp">${CHK.map((k,i)=>`<button class="it" data-on="ck" data-i="${i}"><span class="ii" style="${(x.ck||{})[i]?'background:var(--lime);color:var(--on-acc)':''}">${ico('check',16,2.6)}</span><span class="tx" style="${(x.ck||{})[i]?'text-decoration:line-through;color:var(--tx3)':''}">${k}</span></button>`).join('')}</div>
   <div style="padding:16px"><button class="btn2 full" data-on="grp">${ico('send',18)}Abrir chat da viagem</button></div></div>`;},
 mount(el){const x=S.trips[this.params.i];const d=$('#tdt',el);if(d)d.onchange=()=>{x.date=d.value;save();toast('Data salva','dark');};},
 on:{who(a){const x=S.trips[this.params.i];x.who=x.who||[];const h=a.dataset.h;x.who=x.who.includes(h)?x.who.filter(k=>k!==h):[...x.who,h];save();router.render(this,true,true);},
  ck(a){const x=S.trips[this.params.i];x.ck=x.ck||{};x.ck[a.dataset.i]=!x.ck[a.dataset.i];save();router.render(this,true,true);},
  del(){if(!confirm('Excluir essa viagem?'))return;S.trips.splice(this.params.i,1);save();router.back();},
  grp(){const x=S.trips[this.params.i];const id='trip:'+x.id;S.dms[id]=S.dms[id]||{name:'Viagem: '+x.n,grp:1,who:x.who||[],m:[{h:'sys',txt:'Chat da viagem criado. Combinem horário e ponto de encontro.',t:Date.now()}]};save();router.go('dm',{id});}}};

/* ================= MENSAGENS ================= */
S.dms=S.dms||{};
const RPL=['Bora!','Kkkkk demais','Fechou, que horas?','Tô na estrada agora, te falo já','Manda a localização','Esse rolê foi brabo','Sábado eu colo','Calibra o pneu antes hein','👊','Partiu'];
function seedDM(){if(S.dmSeed)return;const fr=people().slice(0,6);const L=['Viu o encontro de sábado?','Passa o contato do mecânico','Bora pra Serra do Cipó?','Tomaram nossos hex na Savassi 😤','Que roda é essa no seu carro?','Valeu pelo rolê ontem'];
  fr.forEach((w,i)=>{S.dms['u:'+w.h]={h:w.h,m:[{h:w.h,txt:L[i],t:Date.now()-(i*5+1)*3600e3}],un:i<2?1:0};});
  if(S.me.crew)S.dms['crew:'+S.me.crew]={name:S.me.crew,grp:1,crew:S.me.crew,m:[{h:people().find(w=>w.crew===S.me.crew)?.h||'duka',txt:'Rolê sexta 21h na Pampulha, quem vai?',t:Date.now()-2*3600e3}],un:1};
  S.dmSeed=1;save();}
const unreadDM=()=>{seedDM();return Object.values(S.dms).filter(d=>d.un).length;};
function dmSend(h,txt,pre){const id=h.includes(':')?h:'u:'+h;S.dms[id]=S.dms[id]||{h,m:[]};S.dms[id].m.push({me:1,txt:(pre?pre+'\n':'')+txt,t:Date.now()});save();
  const d=S.dms[id];const from=d.grp?(d.who&&d.who[0])||people()[Math.floor(Math.random()*6)].h:d.h;
  setTimeout(()=>{d.m.push({h:from,txt:RPL[Math.floor(Math.random()*RPL.length)],t:Date.now()});const cur=router.cur;if(cur&&cur.name==='dm'&&cur.params.id===id)cur.draw&&cur.draw();else{d.un=1;toast((who(from).n||from).split(' ')[0]+' respondeu','dark');}save();},2200+Math.random()*2500);return id;}
RL.dmSend=dmSend;
const thName=(id,d)=>d.name||(who(d.h).n||d.h);
SCREENS.inbox={tabbar:false,
 html(){seedDM();const th=Object.entries(S.dms).sort((a,b)=>(b[1].m.slice(-1)[0]||{}).t-(a[1].m.slice(-1)[0]||{}).t);const on=people().filter(w=>hsh('on'+w.h+new Date().getHours())<.35).slice(0,10);
  return`<div class="x-top"><button class="rb" data-back>${ico('back',20)}</button><h2>${esc(S.me.handle)}</h2><button class="rb" data-on="new" aria-label="Nova mensagem">${ico('edit',19)}</button></div>
  <div class="xs"><div style="padding:0 16px 8px"><input class="inp" id="iq" placeholder="Pesquisar" style="width:100%;height:42px;border-radius:14px"></div>
   <div class="stories2" style="padding-top:8px">${on.map(w=>`<button class="sto" data-on="open" data-id="u:${esc(w.h)}"><span class="on1">${avatar(w,60)}</span><small>${esc(w.n.split(' ')[0])}</small></button>`).join('')}</div>
   <div class="sh-t"><b>Mensagens</b><button data-go="chat">Chat da região</button></div><div id="thl">${th.map(([id,d])=>{const l=d.m.slice(-1)[0]||{};const cr=d.crew&&C.CREWS[d.crew];return`<button class="thr ${d.un?'un':''}" data-on="open" data-id="${esc(id)}" data-q="${esc(thName(id,d).toLowerCase())}">${d.grp?`<span class="gav" style="background:${cr?cr.c:'var(--lime)'}">${esc(thName(id,d).replace(/^Viagem: /,'').split(' ').map(x=>x[0]).join('').slice(0,2))}</span>`:avatar(who(d.h),52)}<span class="tx"><b>${esc(thName(id,d))}</b><span>${l.me?'Você: ':''}${esc((l.txt||'').split('\n').pop())} · ${ago(l.t)}</span></span>${d.un?'<i class="dt"></i>':''}</button>`;}).join('')}</div></div>`;},
 mount(el){const q=$('#iq',el);q.oninput=()=>{const v=q.value.trim().toLowerCase();$$('#thl .thr',el).forEach(b=>b.style.display=!v||b.dataset.q.includes(v)?'':'none');};},
 on:{open(a){router.go('dm',{id:a.dataset.id});},new(){const fr=people().slice(0,12);sheet(`<div style="font-size:20px;font-weight:800;margin-bottom:8px">Nova mensagem</div>${fr.map(w=>`<button class="row2" style="padding:8px 0" data-h="${esc(w.h)}">${avatar(w,40)}<span class="tx"><b>${esc(w.n)}</b><span>@${esc(w.h)}</span></span></button>`).join('')}`,(w,close)=>{$$('[data-h]',w).forEach(b=>b.onclick=()=>{close();const id='u:'+b.dataset.h;S.dms[id]=S.dms[id]||{h:b.dataset.h,m:[]};save();router.go('dm',{id});});});}}};
SCREENS.dm={tabbar:false,
 html(p){const d=S.dms[p.id]||{h:p.id.slice(2),m:[]};const w=d.h?who(d.h):null;const cr=d.crew&&C.CREWS[d.crew];
  return`<div class="x-top" style="border-bottom:1px solid var(--line)"><button class="rb" data-back>${ico('back',20)}</button>${w?`<button data-on="prof" data-h="${esc(d.h)}" style="display:flex;align-items:center;gap:10px;flex:1;text-align:left"><span class="on1">${avatar(w,38)}</span><span><b style="display:block;font-size:15px">${esc(w.n)}</b><small class="muted">${hsh('on'+d.h+new Date().getHours())<.35?'Online agora':'Ativo há '+(1+Math.floor(hsh(d.h)*50))+' min'}</small></span></button>`:`<span class="gav" style="width:38px;height:38px;border-radius:13px;font-size:13px;background:${cr?cr.c:'var(--lime)'}">${esc(thName(p.id,d).replace(/^Viagem: /,'').split(' ').map(x=>x[0]).join('').slice(0,2))}</span><span style="flex:1"><b style="display:block;font-size:15px">${esc(thName(p.id,d))}</b><small class="muted">${d.crew?(cr?cr.m:'')+' membros':'Grupo'}</small></span>`}</div>
  <div class="msgs" id="ms"></div><div class="cmp"><input id="mi" placeholder="Mensagem…" enterkeyhint="send" autocomplete="off"><button id="mb" aria-label="Enviar">${ico('send',19,2.2)}</button></div>`;},
 mount(el){const d=S.dms[this.params.id];if(d){d.un=0;save();}this.draw=()=>{const d=S.dms[this.params.id]||{m:[]};const ms=$('#ms',el);if(!ms)return;
   ms.innerHTML=d.m.map((m,i)=>{if(m.h==='sys')return`<div class="small muted" style="text-align:center;margin:8px 0">${esc(m.txt)}</div>`;const nm=d.grp&&!m.me&&(i===0||d.m[i-1].h!==m.h)?`<small style="font-size:11px;color:var(--tx3);margin:6px 0 0 6px">${esc(who(m.h).n||m.h)}</small>`:'';return nm+`<div class="bb ${m.me?'me':''}">${esc(m.txt).replace(/\n/g,'<br>')}<small>${new Date(m.t).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</small></div>`;}).join('');ms.scrollTop=ms.scrollHeight;};
  this.draw();const i=$('#mi',el),send=()=>{const v=i.value.trim();if(!v)return;i.value='';dmSend(this.params.id,v);this.draw();const ms=$('#ms',el);setTimeout(()=>{if(!$('.bb.ty',ms)&&router.cur===this){ms.insertAdjacentHTML('beforeend','<div class="bb ty"><i></i><i></i><i></i></div>');ms.scrollTop=ms.scrollHeight;}},700);};
  $('#mb',el).onclick=send;i.onkeydown=e=>{if(e.key==='Enter')send();};},
 on:{prof(a){C.openProfile(a.dataset.h);}}};

/* ================= NOTIFICAÇÕES ================= */
function notifSeed(){const ps=people();const out=[];const K=[['fol','começou a seguir você'],['horn','buzinou pro seu post'],['cmt','comentou: "Brabo demais"'],['crew','te convidou pra crew'],['horn','e mais 12 buzinaram pro seu rolê'],['ev','vai no Encontro de sábado'],['fol','começou a seguir você'],['trip','fez a viagem Serra do Cipó']];
  for(let i=0;i<10;i++){const w=ps[Math.floor(hsh('nf'+i)*ps.length)];const k=K[i%K.length];out.push({k:k[0],h:w.h,txt:k[1],t:Date.now()-(i*i*2.3+.5)*3600e3,id:'ns'+i});}return out;}
SCREENS.notifs={tabbar:false,
 html(){const f=this.f||'all';const own=S.notifs.map(n=>({k:'terr',txt:n.txt,t:n.t,id:n.id}));const all=[...own,...notifSeed()].sort((a,b)=>b.t-a.t).filter(n=>f==='all'||n.k===f);
  const grp=[['Hoje',n=>Date.now()-n.t<864e5],['Esta semana',n=>Date.now()-n.t<7*864e5&&Date.now()-n.t>=864e5],['Antes',n=>Date.now()-n.t>=7*864e5]];
  const row=n=>{const w=n.h?who(n.h):null;const p=n.k==='horn'||n.k==='cmt'?gen(Math.floor(hsh(n.id)*20)):null;
   return`<div class="nt">${w?`<button data-on="prof" data-h="${esc(n.h)}">${avatar(w,46)}</button>`:`<span class="ic">${ico(n.k==='terr'?'grid':'bolt',20)}</span>`}<div class="tx">${w?`<b>${esc(w.h)}</b> `:''}${esc(n.txt)} <small>${ago(n.t)}</small></div>
   ${n.k==='fol'?`<button class="btn2 ${S.follow[n.h]?'sec':''}" data-on="fol" data-h="${esc(n.h)}">${S.follow[n.h]?'Seguindo':'Seguir de volta'}</button>`:n.k==='crew'?`<button class="btn2" data-on="crewj" data-c="${esc(who(n.h).crew||'')}">Ver</button>`:p?`<button class="ph" data-go="post" data-p='${esc(JSON.stringify({i:Math.floor(hsh(n.id)*20)}))}'>${p.kind==='video'?`<img src="${esc(p.vid.poster)}" alt="">`:RL.picTag(p.model||'',p.id+':0')}</button>`:''}</div>`;};
  return`<div class="x-top"><button class="rb" data-back>${ico('back',20)}</button><h2>Notificações</h2><button class="rb" data-go="settings" data-p='{"s":"ntf"}' aria-label="Ajustes">${ico('gear',19)}</button></div>
  <div class="pills">${[['all','Tudo'],['fol','Seguidores'],['horn','Buzinas'],['cmt','Comentários'],['terr','Território']].map(([k,t])=>`<button class="pill ${k===f?'on':''}" data-on="f" data-k="${k}">${t}</button>`).join('')}</div>
  <div class="xs">${grp.map(([t,fn])=>{const l=all.filter(fn);return l.length?`<div class="sh-t"><b>${t}</b></div>`+l.map(row).join(''):'';}).join('')||'<div style="padding:40px;text-align:center" class="muted">Nada por aqui ainda</div>'}</div>`;},
 mount(el){S.notifs.forEach(n=>n.read=true);S.nread=Date.now();save();if(RL.fillMedia)RL.fillMedia(el);},
 on:{f(a){this.f=a.dataset.k;router.render(this,true,true);},prof(a){C.openProfile(a.dataset.h);},fol(a){const on=!S.follow[a.dataset.h];C.follow(a.dataset.h,on);a.textContent=on?'Seguindo':'Seguir de volta';a.classList.toggle('sec',on);},crewj(a){if(a.dataset.c)router.go('crew',{id:a.dataset.c});}}};

/* ================= PERFIL (com garagem) ================= */
const OP=SCREENS.profile.on||{};
SCREENS.profile={tab:'profile',
 html(){const t=this.t||'posts';const posts=C.allPosts().filter(p=>p.mine);const fol=Object.keys(S.follow).length;const fw=Math.round(40+hsh(S.me.handle)*300)+Object.keys(S.followsMe||{}).length;const cr=S.me.crew&&C.CREWS[S.me.crew];const km=C.myKm();
  return`<div class="x-top"><h1 style="font-size:20px">${esc(S.me.handle)}</h1><button class="rb" data-on="share" aria-label="Compartilhar perfil">${ico('share',19)}</button><button class="rb" data-go="settings" aria-label="Ajustes">${ico('gear',20)}</button></div>
  <div class="xs" id="pfx"><div class="pf-h"><button data-on="avz" aria-label="Ver foto">${avatar({me:true},86)}</button><div class="pf-st"><div><b>${posts.length}</b><span>posts</span></div><div><b>${fmt(fw)}</b><span>seguidores</span></div><div><b>${fol}</b><span>seguindo</span></div></div></div>
   <div class="pf-b"><b>${esc(S.me.name)}</b>${S.me.bio?`<div>${esc(S.me.bio)}</div>`:''}<div class="muted small" style="margin-top:2px">${fmtKm(km*1000)} km rodados · ${Object.keys(S.hexes||{}).length} hex${S.me.city&&S.me.showCity!==false?' · '+esc(S.me.city):''}</div>${cr?`<button class="cr" data-go="crew" data-p='${esc(JSON.stringify({id:S.me.crew}))}'><i style="width:9px;height:9px;border-radius:9px;background:${cr.c}"></i>${esc(S.me.crew)}</button>`:''}</div>
   <div class="pf-btns"><button class="btn2 sec" data-on="edit">Editar perfil</button><button class="btn2 sec" data-on="create" style="flex:0 0 46px;padding:0" aria-label="Criar">${ico('plus',18,2.4)}</button><button class="btn2 sec" data-go="inbox" style="flex:0 0 46px;padding:0" aria-label="Mensagens">${ico('send',17)}</button></div>
   ${RL.pgarHTML?RL.pgarHTML():''}
   <div class="pqk">${[['Viagens','route','trips'],['Rankings','trophy','rank2'],['Salvos','save','saved'],['Personalizar','edit','studio']].map(([n,i,g])=>`<button data-go="${g}">${ico(i,17)}<span>${n}</span></button>`).join('')}</div>
   <div class="tabs2">${[['posts','grid'],['rides','route'],['bdg','trophy']].map(([k,i])=>`<button class="${k===t?'on':''}" data-on="tab" data-k="${k}" aria-label="${k}">${ico(i,20)}</button>`).join('')}</div><div id="pft"></div></div>`;},
 mount(el){const t=this.t||'posts';const box=$('#pft',el);if(RL.pgarMount)RL.pgarMount(el);
  if(t==='posts'){const ps=C.allPosts().filter(p=>p.mine);box.innerHTML=ps.length?`<div class="gr3" style="padding-top:3px">${ps.map(p=>`<button data-on="mp" data-id="${p.id}">${p.media?(p.media[0].type==='video'?`<video data-mk="${p.media[0].k}" muted playsinline style="width:100%;height:100%;object-fit:cover"></video><span class="vi">${ico('play',16)}</span>`:`<img data-mk="${p.media[0].k}" alt="">`):p.track?(RL.staticMap?RL.staticMap(p.track,130,174,{pad:16,sw:3}):''):''}</button>`).join('')}</div>`:`<div style="padding:40px 30px;text-align:center"><div style="font-size:17px;font-weight:800">Compartilhe seu primeiro rolê</div><div class="small muted" style="margin:6px 0 14px">Fotos, vídeos e trajetos aparecem aqui.</div><button class="btn2" data-go="compose">Postar</button></div>`;if(RL.fillMedia)RL.fillMedia(box);}
  else if(t==='gar'){box.innerHTML=S.cars.map(c=>`<button class="gcard" data-go="garage"><span class="pic">${c.front?`<img src="${c.front}" alt="">`:ico('car',26)}</span><span style="flex:1"><b style="display:block">${esc(c.model)}</b><small class="muted">${esc([c.year,c.color].filter(Boolean).join(' · '))}${c.id===S.activeCar?' · em uso':''}</small></span>${ico('chev',18)}</button>`).join('')+`<div style="padding:12px 16px;display:flex;gap:8px"><button class="btn2 sec" data-go="garage" style="flex:1">Abrir garagem</button><button class="btn2" data-go="carForm" style="flex:1">${ico('plus',16,2.6)}Veículo</button></div>`;}
  else if(t==='rides'){box.innerHTML=S.rides.length?S.rides.map(r=>`<button class="row2" data-go="summary" data-p='${esc(JSON.stringify({id:r.id}))}'><span class="thumb">${RL.trackSVG(r.track,56,56)}</span><span class="tx"><b>${esc(r.dest?'Até '+r.dest:r.mode==='terr'?'Território':'Rolê livre')}</b><span>${new Date(r.t).toLocaleDateString('pt-BR')} · ${fmtKm(r.dist)} km · ${fmtT(r.sec)}</span></span><b class="lime" style="font-size:13px">+${r.hex||0}</b></button>`).join(''):`<div style="padding:40px 30px;text-align:center"><div style="font-size:17px;font-weight:800">Nenhum rolê ainda</div><div class="small muted" style="margin:6px 0 14px">Seus trajetos, km e hexágonos ficam aqui.</div><button class="btn2" data-go="startRide">Começar rolê</button></div>`;}
  else{const km=C.myKm(),hx=Object.keys(S.hexes||{}).length,bh=Object.keys(S.fogH||{}).length,cs=Object.keys(S.cities||{}).length;const B=[['Primeiro rolê','flag',S.rides.length>=1],['100 km','route',km>=100],['1.000 km','route',km>=1000],['50 hex','grid',hx>=50],['Explorador','lock',bh>=200],['3 cidades','map',cs>=3],['Viajante','route',S.trips.length>=1],['Crew','people',!!S.me.crew],['Madrugada','moon',S.rides.some(r=>{const h=new Date(r.t).getHours();return h<5;})]];
   box.innerHTML=`<div class="bdg">${B.map(([n,i,ok])=>`<div class="${ok?'':'off'}"><div class="e">${ico(i,20)}</div><b>${n}</b><small>${ok?'conquistado':'bloqueado'}</small></div>`).join('')}</div>`;}},
 on:{...OP,tab(a){this.t=a.dataset.k;const el=this.el;$$('.tabs2 button',el).forEach(b=>b.classList.toggle('on',b===a));this.mount(el);},
  edit(){(OP.edit||(()=>{})).call(this);},mystory(){SCREENS.home.on.mystory();},avz(){RL.avatarViewer&&RL.avatarViewer();},create(){RL.createSheet&&RL.createSheet();},
  mp(a){const p=C.allPosts().find(x=>x.id===a.dataset.id);if(!p)return;sheet(`<div style="margin:-6px -6px 0">${igCard(p)}</div>`,(w)=>{wireFeed(w);});},
  async share(){const u=location.href.split('#')[0];try{if(navigator.share)await navigator.share({title:'Rolê',text:'Me segue no Rolê: @'+S.me.handle,url:u});else{await navigator.clipboard.writeText('@'+S.me.handle+' no Rolê '+u);toast('Link copiado');}}catch(e){}}}};
SCREENS.saved={tabbar:false,html(){const ids=Object.keys(S.saved||{});const ps=ids.map(id=>[...made.values(),...C.allPosts()].find(p=>p.id===id)).filter(Boolean);return`<div class="x-top"><button class="rb" data-back>${ico('back',20)}</button><h2>Salvos</h2><span style="width:42px"></span></div><div class="xs">${ps.length?ps.map(igCard).join(''):'<div style="padding:40px;text-align:center" class="muted">Toque no marcador de um post pra salvar aqui.</div>'}</div>`;},mount(el){wireFeed(el);},on:{...PH}};

/* ================= AJUSTES ================= */
S.layers=S.layers||{radar:1,fuel:1,sig:1,hex:1};S.np=S.np||{horn:1,cmt:1,fol:1,crew:1,terr:1};
const LAYER={radar:['osm-radar'],fuel:['osm-fuel'],sig:['osm-signal','osm-signs'],hex:['hex-fill','hex-line','hex-glow']};
function applyLayers(){const m=getMap();if(!m||!m.getLayer)return;for(const[k,ls]of Object.entries(LAYER))ls.forEach(l=>{if(m.getLayer(l))m.setLayoutProperty(l,'visibility',S.layers[k]?'visible':'none');});}
RL.applyLayers=applyLayers;
const tgl=(id,on,t,sub,i)=>`<button class="it" data-on="tg" data-k="${id}">${i?`<span class="ii">${ico(i,18)}</span>`:''}<span class="tx">${t}${sub?`<small>${sub}</small>`:''}</span><span class="tg2 ${on?'on':''}"></span></button>`;
const lnk=(go,t,i,v,p)=>`<button class="it" ${go.startsWith('on:')?`data-on="${go.slice(3)}"`:`data-go="${go}"`} ${p?`data-p='${esc(JSON.stringify(p))}'`:''}><span class="ii">${ico(i,18)}</span><span class="tx">${t}</span>${v?`<span class="v">${v}</span>`:''}${ico('chev',16)}</button>`;
SCREENS.settings={tabbar:false,
 html(){const th=S.theme,md=S.mapAsk===false?S.mapMode||'unlock':'ask';
  return`<div class="x-top"><button class="rb" data-back>${ico('back',20)}</button><h2>Ajustes</h2><span style="width:42px"></span></div><div class="xs">
  <div class="grp-t">Conta</div><div class="grp">${lnk('on:edit','Editar perfil','user')}${tgl('priv',S.priv,'Conta privada','Só seguidores aprovados veem seus posts','lock')}${tgl('city',S.me.showCity!==false,'Mostrar minha cidade','Aparece no seu perfil','map')}</div>
  <div class="grp-t">Privacidade no mapa</div><div class="grp">${tgl('ghost',!!S.settings.ghost,'Modo fantasma','Ninguém te vê no mapa. Fica salvo mesmo fechando o app','moon')}<div class="it"><span class="ii">${ico('people',18)}</span><span class="tx">Quem aparece no seu mapa<small>Só amigos mútuos: você segue e eles te seguem</small></span></div></div>
  <div class="grp-t">Aparência</div><div class="grp"><div style="padding:14px 16px 6px"><div class="sw3">${[['auto','Automático'],['light','Claro'],['dark','Escuro']].map(([k,t])=>`<button class="${th===k?'on':''}" data-on="theme" data-k="${k}">${t}</button>`).join('')}</div></div>
   <div class="it" style="padding-bottom:6px"><span class="tx">Cor de destaque</span><span class="v">${ACC[S.accent][3]}</span></div><div class="accs">${Object.entries(ACC).map(([k,a])=>`<button class="${S.accent===k?'on':''}" data-on="acc" data-k="${k}" style="background:${a[0]}" aria-label="${a[3]}"></button>`).join('')}</div>${lnk('studio','Moldura, rastro e oficina','edit')}</div>
  <div class="grp-t">Mapa</div><div class="grp"><div style="padding:14px 16px 6px"><div class="small muted" style="margin:0 2px 8px">Ao abrir o mapa</div><div class="sw3">${[['ask','Perguntar'],['unlock','Desbloqueio'],['nav','Navegação']].map(([k,t])=>`<button class="${md===k?'on':''}" data-on="mmode" data-k="${k}">${t}</button>`).join('')}</div></div>
   ${tgl('L:hex',S.layers.hex,'Hexágonos de território','','grid')}${tgl('L:radar',S.layers.radar,'Radares','','bolt')}${tgl('L:fuel',S.layers.fuel,'Postos e preços','','pump')}${tgl('L:sig',S.layers.sig,'Semáforos e placas','','flag')}</div>
  <div class="grp-t">Rolê</div><div class="grp">${tgl('sim',S.settings.simulate,'Modo simulação','O carro anda sozinho, pra testar parado','car')}${tgl('voice',S.settings.voice,'Avisos por voz','Hexágonos, radares e curvas','vol')}</div>
  <div class="grp-t">Notificações</div><div class="grp">${tgl('N:horn',S.np.horn,'Buzinas')}${tgl('N:cmt',S.np.cmt,'Comentários')}${tgl('N:fol',S.np.fol,'Novos seguidores')}${tgl('N:crew',S.np.crew,'Crew e convites')}${tgl('N:terr',S.np.terr,'Território','Quando tomam seus hexágonos')}</div>
  <div class="grp-t">Sobre</div><div class="grp"><div class="it"><span class="tx">Créditos<small>Mapas © OpenStreetMap, OpenFreeMap, Esri. Postos: ANP. Radares: ANTT e OSM. Fotos e vídeos de exemplo: Wikimedia Commons (CC), autores em cada post.</small></span></div><div class="it"><span class="tx">Versão</span><span class="v">protótipo 0.8</span></div></div>
  <div class="grp" style="margin-top:18px"><button class="it" data-on="out" style="color:var(--red);justify-content:center">Sair da conta</button></div>
  <div style="text-align:center;padding:14px"><button class="small muted" data-on="wipe" style="text-decoration:underline">Apagar meus dados do protótipo</button></div></div>`;},
 on:{edit(){(OP.edit||(()=>{})).call(this);},
  tg(a){const k=a.dataset.k;const sw=$('.tg2',a);let v;
   if(k.startsWith('L:')){const n=k.slice(2);S.layers[n]=S.layers[n]?0:1;v=S.layers[n];applyLayers();}
   else if(k.startsWith('N:')){const n=k.slice(2);S.np[n]=S.np[n]?0:1;v=S.np[n];}
   else if(k==='priv'){S.priv=!S.priv;v=S.priv;}else if(k==='city'){S.me.showCity=S.me.showCity===false;v=S.me.showCity;}
   else if(k==='ghost'){S.settings.ghost=!S.settings.ghost;v=S.settings.ghost;document.body.classList.toggle('ghost',!!v);try{localStorage.setItem('role.ghost',v?'1':'0');}catch(e){}}
   else if(k==='sim'){S.settings.simulate=!S.settings.simulate;v=S.settings.simulate;}else if(k==='voice'){S.settings.voice=!S.settings.voice;v=S.settings.voice;}
   save();sw.classList.toggle('on',!!v);},
  theme(a){S.theme=a.dataset.k;save();applyTheme();$$('[data-on="theme"]',this.el).forEach(b=>b.classList.toggle('on',b===a));},
  acc(a){S.accent=a.dataset.k;save();applyTheme();router.render(this,true,true);},
  mmode(a){const k=a.dataset.k;if(k==='ask')S.mapAsk=true;else{S.mapAsk=false;S.mapMode=k;}save();$$('[data-on="mmode"]',this.el).forEach(b=>b.classList.toggle('on',b===a));},
  out(){if(!confirm('Sair da conta?'))return;S.auth=0;save();router.stack=[];router.go('login',{},{root:true});},
  wipe(){if(confirm('Apagar rolês, hexágonos, posts e ajustes?')){try{localStorage.clear();}catch(e){}try{indexedDB.deleteDatabase('role-media');indexedDB.deleteDatabase('role-img');}catch(e){}location.reload();}}}};

/* ================= LOGIN (visual) ================= */
SCREENS.login={tabbar:false,
 html(){const v=VID().find(x=>/twilight/.test(x.fn))||VID()[0];return`<div class="lg">${v?`<img class="pst" src="${esc(v.poster)}" alt="">${RL.vtag(v,'autoplay')}`:''}<div class="shd"></div>
  <div class="top"><div class="wm2">rol<i>ê</i></div><div class="tag">A rede social de quem vive no volante. Conquiste a cidade, ache sua crew, planeje a próxima viagem.</div></div>
  <div class="bt"><button class="lgb g" data-on="google"><span class="gi">G</span>Continuar com Google</button><button class="lgb e" data-on="mail">Entrar com e-mail</button><button class="lgb o" data-on="reg">Criar conta</button>
   <div class="lgal">Protótipo: nenhum login é real e nada é enviado.<br>${v?`Vídeo: ${esc(v.a)} · ${esc(v.l)} · Wikimedia Commons`:''}</div></div></div>`;},
 mount(el){const v=$('video',el);if(v){v.muted=true;v.preload='auto';playV(v);}},
 on:{google(a){a.innerHTML='<span class="gi">G</span>Conectando…';setTimeout(()=>done(),900);},
  mail(){form(false);},reg(){form(true);}}};
function form(reg){const host=router.cur.el.querySelector('.lg');const w=document.createElement('div');w.className='lgf';
  w.innerHTML=`<div class="bx"><h3>${reg?'Criar conta':'Entrar'}</h3><p>${reg?'Leva 20 segundos.':'Use o login de demonstração ou qualquer um.'}</p>
   ${reg?`<label>Nome</label><input id="ln" value="${esc(S.me.name||'')}" autocomplete="off"><label>Usuário</label><input id="lu" value="${esc(S.me.handle||'')}" autocomplete="off">`:''}
   <label>E-mail</label><input id="le" value="demo@role.app" autocomplete="off" inputmode="email"><label>Senha</label><input id="lp" type="password" value="role2026" autocomplete="off">
   <button class="btn2 full" id="lgo" style="margin-top:18px;height:52px">${reg?'Criar conta':'Entrar'}</button></div>`;
  host.appendChild(w);w.onclick=e=>{if(e.target===w)w.remove();};
  $('#lgo',w).onclick=()=>{if(reg){const n=$('#ln',w).value.trim(),u=$('#lu',w).value.trim().toLowerCase().replace(/[^a-z0-9._]/g,'');if(n.length<2||u.length<3){toast('Nome ou usuário muito curto','dark');return;}S.me.name=n;S.me.handle=u;}done();};}
function done(){S.auth=1;save();router.stack=[];router.go('home',{},{root:true});const el=router.cur.el;if(el)el.classList.add('tin-l');toast('Bem-vindo, '+(S.me.name||'').split(' ')[0],'dark');}

/* ================= MAPA: menos coisa na tela ================= */
const MS=SCREENS.map;const mh=MS.html;
MS.html=function(p){return mh.call(this,p).replace('<div class="mapfabs">',`<div class="mapfabs"><button class="fab" data-on="layers" aria-label="Camadas">${ico('layers',19)}</button><button class="fab" data-on="me2" aria-label="Onde estou">${ico('loc',19)}</button>`)+`<button class="gobtn" data-go="startRide">${ico('play',16,2.4)}Começar rolê</button>`;};
MS.on.me2=function(){const m=getMap();const p=(RL.gps&&RL.gps.pos)||S.lastPos;if(m&&p)m.easeTo({center:p,zoom:16,duration:600});else toast('Sem localização ainda','dark');};
MS.on.layers=function(){sheet(`<div style="font-size:20px;font-weight:800;margin-bottom:10px">Camadas do mapa</div><div class="grp" style="margin:0">${tgl('L:hex',S.layers.hex,'Hexágonos de território','','grid')}${tgl('L:radar',S.layers.radar,'Radares','','bolt')}${tgl('L:fuel',S.layers.fuel,'Postos e preços','','pump')}${tgl('L:sig',S.layers.sig,'Semáforos e placas','','flag')}</div>
  <div class="grp" style="margin:10px 0 0">${lnk('on:x1','Lista de postos','pump')}${lnk('on:x2','Eventos no mapa','cal')}${lnk('on:x3','Chat da região','cmt')}</div>`,(w,close)=>{
  $$('[data-on="tg"]',w).forEach(b=>b.onclick=()=>{const n=b.dataset.k.slice(2);S.layers[n]=S.layers[n]?0:1;save();applyLayers();$('.tg2',b).classList.toggle('on',!!S.layers[n]);});
  $('[data-on="x1"]',w).onclick=()=>{close();router.go('fuel');};$('[data-on="x2"]',w).onclick=()=>{close();router.go('events');};$('[data-on="x3"]',w).onclick=()=>{close();router.go('chat');};});};
const mr=MS.mapReady;MS.mapReady=function(){const r=mr&&mr.apply(this,arguments);const m=getMap();if(m)m.setPadding({top:120,bottom:120,left:0,right:0});setTimeout(applyLayers,300);return r;};
if(SCREENS.events){SCREENS.events.tab=null;SCREENS.events.tabbar=false;}

/* ================= ARRANQUE ================= */
function start(){buildNav();const r0=router.render.bind(router);router.render=function(node,a,b){r0(node,a,b);applyTheme();const tb=$('#tabbar');if(tb){const t=node.tab||node.name;$$('button',tb).forEach(x=>x.classList.toggle('on',x.dataset.t===t));}};
  if(!S.auth){router.go('login',{},{root:true});}else{router.tabTo('home');}
  setInterval(()=>{const m=getMap();if(m&&m.isStyleLoaded&&m.isStyleLoaded())applyLayers();},4000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0));else setTimeout(start,0);
})();
