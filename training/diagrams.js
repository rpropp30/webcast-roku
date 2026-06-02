/* ============================================================================
   diagrams.js — technical SVG illustration library
   Shared by index.html (deck) and landing.html.
   Every function returns an <svg> string that scales to its container.
   Pure geometry — no external assets, works offline.
   ============================================================================ */
(function(global){
const P={navy:'#0B2545',navyD:'#06162B',navy2:'#134074',steel:'#3A5A80',sky:'#5B8FB9',
  amber:'#F5B100',amberD:'#C88A00',danger:'#D4351A',dangerD:'#9E2410',green:'#2E8B57',
  ink:'#1A2B3C',light:'#EEF2F7',light2:'#E2E9F1',white:'#ffffff',gray:'#5B6B7B',copper:'#C77B30'};

/* ---- shared high-quality gradient + shadow kit (injected into every diagram) ---- */
const QDEFS=`<defs>
  <linearGradient id="qbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#e7eef7"/></linearGradient>
  <linearGradient id="qsteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eef2f7"/><stop offset="48%" stop-color="#c4cdd8"/><stop offset="100%" stop-color="#9aa6b3"/></linearGradient>
  <linearGradient id="qcopper" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e6a566"/><stop offset="50%" stop-color="#c77b30"/><stop offset="100%" stop-color="#9c5a1e"/></linearGradient>
  <linearGradient id="qamber" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffd54d"/><stop offset="100%" stop-color="#e09a00"/></linearGradient>
  <linearGradient id="qnavy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1c4078"/><stop offset="100%" stop-color="#0b2545"/></linearGradient>
  <linearGradient id="qred" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e7553a"/><stop offset="100%" stop-color="#b8290f"/></linearGradient>
  <linearGradient id="qgreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#43a06b"/><stop offset="100%" stop-color="#23744a"/></linearGradient>
  <radialGradient id="qspark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff7d6"/><stop offset="42%" stop-color="#ffd24d"/><stop offset="100%" stop-color="#f5b100" stop-opacity="0"/></radialGradient>
  <linearGradient id="qsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cfe6fb"/><stop offset="60%" stop-color="#e6f1fb"/><stop offset="100%" stop-color="#f2f7fc"/></linearGradient>
  <linearGradient id="qground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c9b48f"/><stop offset="100%" stop-color="#a98f68"/></linearGradient>
  <linearGradient id="qwood" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#a06c38"/><stop offset="22%" stop-color="#b9854c"/><stop offset="55%" stop-color="#8a5a2b"/><stop offset="100%" stop-color="#5e3d1c"/></linearGradient>
  <linearGradient id="qgalv" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f4f7fa"/><stop offset="42%" stop-color="#c2ccd7"/><stop offset="100%" stop-color="#828f9d"/></linearGradient>
  <linearGradient id="qporc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#efe9dc"/><stop offset="100%" stop-color="#c3b49a"/></linearGradient>
  <linearGradient id="qrubber" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e7634a"/><stop offset="45%" stop-color="#cf3a22"/><stop offset="100%" stop-color="#9e2410"/></linearGradient>
  <filter id="qsh" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="2.5" stdDeviation="3" flood-color="#0b2545" flood-opacity="0.22"/></filter>
</defs>`;

/* ---- string helpers ---- */
function arr(x1,y1,x2,y2,c,w){w=w||3;const a=Math.atan2(y2-y1,x2-x1),L=11,A=0.42;
  const bx=x2-L*0.55*Math.cos(a),by=y2-L*0.55*Math.sin(a);
  const p1x=x2-L*Math.cos(a-A),p1y=y2-L*Math.sin(a-A),p2x=x2-L*Math.cos(a+A),p2y=y2-L*Math.sin(a+A);
  return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`+
         `<polygon points="${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}" fill="${c}"/>`;}
function T(x,y,s,o){o=o||{};return `<text x="${x}" y="${y}" font-family="'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif" `+
  `font-size="${o.s||15}" fill="${o.c||P.ink}" font-weight="${o.w||400}" `+
  `text-anchor="${o.a||'start'}" font-style="${o.i||'normal'}" letter-spacing="${o.ls||0}">${s}</text>`;}
function sine(x0,y0,wlen,amp,cycles,phase,c,sw,samples,cls){
  samples=samples||120;let d='';for(let i=0;i<=samples;i++){const t=i/samples;
    const x=x0+t*wlen;const y=y0-amp*Math.sin(2*Math.PI*cycles*t+phase);d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';}
  return `<path class="${cls||''}" d="${d}" fill="none" stroke="${c}" stroke-width="${sw||3}" stroke-linejoin="round"/>`;}
function svg(vb,inner,extra){return `<svg viewBox="0 0 ${vb}" style="width:100%;height:auto;display:block" `+
  `xmlns="http://www.w3.org/2000/svg" ${extra||''}>${QDEFS}${inner}</svg>`;}
function defs(id){return `<defs>
  <radialGradient id="${id}-g" cx="50%" cy="42%" r="65%"><stop offset="0%" stop-color="#15376a"/><stop offset="100%" stop-color="${P.navy}"/></radialGradient>
  </defs>`;}

/* a small lineworker glyph (head, torso, arms, legs) at (x,y) scale sc */
function worker(x,y,sc,c,hardhat){c=c||P.navy;sc=sc||1;const s=v=>v*sc;
  let g=`<g transform="translate(${x},${y})" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#qsh)">`;
  g+=`<circle cx="0" cy="${s(-46)}" r="${s(11)}" fill="${P.light}"/>`;
  if(hardhat){g+=`<path d="M ${s(-13)} ${s(-50)} A ${s(13)} ${s(13)} 0 0 1 ${s(13)} ${s(-50)} Z" fill="url(#qamber)" stroke="${P.amberD}"/>`+
    `<rect x="${s(-15)}" y="${s(-51)}" width="${s(30)}" height="${s(3.5)}" rx="1.5" fill="url(#qamber)" stroke="${P.amberD}"/>`;}
  g+=`<line x1="0" y1="${s(-35)}" x2="0" y2="${s(8)}"/>`;
  g+=`<line x1="0" y1="${s(8)}" x2="${s(-12)}" y2="${s(40)}"/><line x1="0" y1="${s(8)}" x2="${s(12)}" y2="${s(40)}"/>`;
  g+=`</g>`;return g;}

/* ===== rich illustration kit (materials, depth, authentic hardware) ===== */
function gshadow(cx,cy,rx,ry,op){return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry||rx*0.26}" fill="#0b2545" opacity="${op||0.15}"/>`;}
/* tapered wood distribution pole from top to bottom */
function woodPole(cx,top,bot,w){w=w||30;const hw=w/2,tw=hw*0.8;
  let g=`<g>`;
  g+=gshadow(cx+12,bot,w*1.25,8,0.13);
  g+=`<path d="M ${cx-tw} ${top} L ${cx+tw} ${top} L ${cx+hw} ${bot} L ${cx-hw} ${bot} Z" fill="url(#qwood)"/>`;
  g+=`<path d="M ${cx-tw} ${top} L ${cx-tw+3} ${top} L ${cx-hw+4} ${bot} L ${cx-hw} ${bot} Z" fill="#ffffff" opacity="0.16"/>`;
  for(const k of [-0.42,0.05,0.5]) g+=`<line x1="${cx+k*tw}" y1="${top+8}" x2="${cx+k*hw}" y2="${bot-4}" stroke="#4f3317" stroke-width="1.3" opacity="0.45"/>`;
  g+=`<ellipse cx="${cx}" cy="${top}" rx="${tw}" ry="3.5" fill="#7a5128"/>`;
  g+=`</g>`;return g;}
/* wood crossarm centered on the pole at height y, with galvanized bolts + braces */
function crossarm(cx,y,w,h){w=w||240;h=h||18;const x=cx-w/2;
  let g=`<g>`;
  g+=`<line x1="${cx-46}" y1="${y+h-1}" x2="${cx-7}" y2="${y+h+44}" stroke="url(#qgalv)" stroke-width="4"/>`;
  g+=`<line x1="${cx+46}" y1="${y+h-1}" x2="${cx+7}" y2="${y+h+44}" stroke="url(#qgalv)" stroke-width="4"/>`;
  g+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#qwood)"/>`;
  g+=`<rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="#ffffff" opacity="0.16"/>`;
  for(const bx of [x+13,x+w-13]) g+=`<circle cx="${bx}" cy="${y+h/2}" r="3.2" fill="url(#qgalv)" stroke="#6b7787" stroke-width="0.8"/>`;
  g+=`</g>`;return g;}
/* porcelain pin insulator with stacked sheds; conductor groove sits at top */
function pinInsulator(x,y,sc){sc=sc||1;const s=v=>v*sc;
  let g=`<g transform="translate(${x},${y})">`;
  g+=`<rect x="${s(-2.5)}" y="${s(-2)}" width="${s(5)}" height="${s(13)}" fill="url(#qgalv)"/>`;
  g+=`<ellipse cx="0" cy="${s(-1)}" rx="${s(13)}" ry="${s(5)}" fill="url(#qporc)" stroke="#a99a7e" stroke-width="1"/>`;
  g+=`<ellipse cx="0" cy="${s(-8)}" rx="${s(10.5)}" ry="${s(4.4)}" fill="url(#qporc)" stroke="#a99a7e" stroke-width="1"/>`;
  g+=`<ellipse cx="0" cy="${s(-15)}" rx="${s(8)}" ry="${s(3.8)}" fill="url(#qporc)" stroke="#a99a7e" stroke-width="1"/>`;
  g+=`<ellipse cx="0" cy="${s(-18.5)}" rx="${s(5)}" ry="${s(2.4)}" fill="#b6a585"/>`;
  g+=`<ellipse cx="${s(-3.5)}" cy="${s(-2.5)}" rx="${s(3.5)}" ry="${s(1.4)}" fill="#ffffff" opacity="0.35"/>`;
  g+=`</g>`;return g;}
/* catenary conductor with a thin specular highlight */
function conductor(x1,y1,x2,y2,sag,c,sw){c=c||'#37404a';sw=sw||4.5;sag=sag||0;
  const mx=(x1+x2)/2,my=(y1+y2)/2+sag,d=`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`+
         `<path d="${d}" fill="none" stroke="#ffffff" stroke-width="${(sw*0.32).toFixed(1)}" opacity="0.3" stroke-linecap="round"/>`;}
/* detailed FR-clad lineworker, anchored at the feet (x,y); sc≈1 → ~165px tall */
function lineworker2(x,y,sc,fr){sc=sc||1;fr=fr||'#22406e';const s=v=>v*sc;
  let g=`<g transform="translate(${x},${y})">`;
  g+=gshadow(0,s(2),s(26),s(6),0.16);
  g+=`<path d="M ${s(-15)} ${s(-80)} L ${s(-17)} ${s(-6)} L ${s(-5)} ${s(-6)} L ${s(-3)} ${s(-80)} Z" fill="${fr}"/>`;
  g+=`<path d="M ${s(15)} ${s(-80)} L ${s(17)} ${s(-6)} L ${s(5)} ${s(-6)} L ${s(3)} ${s(-80)} Z" fill="${fr}"/>`;
  g+=`<path d="M ${s(-21)} ${s(-6)} L ${s(-3)} ${s(-6)} L ${s(-3)} ${s(2)} L ${s(-24)} ${s(2)} Z" fill="#262626"/>`;
  g+=`<path d="M ${s(21)} ${s(-6)} L ${s(3)} ${s(-6)} L ${s(3)} ${s(2)} L ${s(24)} ${s(2)} Z" fill="#262626"/>`;
  g+=`<path d="M ${s(-21)} ${s(-132)} Q 0 ${s(-140)} ${s(21)} ${s(-132)} L ${s(17)} ${s(-78)} L ${s(-17)} ${s(-78)} Z" fill="${fr}"/>`;
  g+=`<rect x="${s(-20)}" y="${s(-102)}" width="${s(40)}" height="${s(6)}" fill="url(#qamber)"/>`;
  g+=`<path d="M ${s(-20)} ${s(-130)} L ${s(-31)} ${s(-94)}" stroke="${fr}" stroke-width="${s(8.5)}" stroke-linecap="round"/>`;
  g+=`<path d="M ${s(20)} ${s(-130)} L ${s(31)} ${s(-94)}" stroke="${fr}" stroke-width="${s(8.5)}" stroke-linecap="round"/>`;
  g+=`<circle cx="${s(-32)}" cy="${s(-89)}" r="${s(6.5)}" fill="url(#qrubber)"/>`;
  g+=`<circle cx="${s(32)}" cy="${s(-89)}" r="${s(6.5)}" fill="url(#qrubber)"/>`;
  g+=`<rect x="${s(-4)}" y="${s(-144)}" width="${s(8)}" height="${s(9)}" fill="#d79f72"/>`;
  g+=`<circle cx="0" cy="${s(-152)}" r="${s(11)}" fill="#e8b489"/>`;
  g+=`<path d="M ${s(-13)} ${s(-154)} A ${s(13)} ${s(13)} 0 0 1 ${s(13)} ${s(-154)} Z" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="1.2"/>`;
  g+=`<rect x="${s(-15.5)}" y="${s(-155)}" width="${s(31)}" height="${s(4)}" rx="2" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="1"/>`;
  g+=`</g>`;return g;}

const D={};

/* ============ 1. ATOM / ELECTRON FLOW ============ */
D.atom=()=>svg('640 470', defs('at')+`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  <g transform="translate(220,230)">
    <g class="dgm-spin">
      <ellipse rx="150" ry="58" fill="none" stroke="${P.steel}" stroke-width="2" opacity="0.7"/>
      <ellipse rx="150" ry="58" transform="rotate(60)" fill="none" stroke="${P.steel}" stroke-width="2" opacity="0.7"/>
      <ellipse rx="150" ry="58" transform="rotate(120)" fill="none" stroke="${P.steel}" stroke-width="2" opacity="0.7"/>
      <circle cx="129" cy="29" r="9" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="2"/>
      <circle cx="-150" cy="0" r="9" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="2"/>
      <circle cx="44" cy="-65" r="9" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="2"/>
    </g>
    <circle r="30" fill="url(#qnavy)" filter="url(#qsh)"/><circle cx="-9" cy="-10" r="9" fill="#ffffff" opacity="0.16"/>
    <circle cx="-9" cy="-6" r="9" fill="url(#qred)"/><circle cx="10" cy="-7" r="9" fill="url(#qred)"/>
    <circle cx="0" cy="9" r="9" fill="${P.sky}"/><circle cx="-12" cy="9" r="9" fill="${P.sky}"/>
  </g>
  ${T(220,455,'A single atom: protons (+) &amp; neutrons in the nucleus, electrons orbiting',{s:13,c:P.gray,a:'middle'})}
  <g transform="translate(470,150)">
    ${T(0,-22,'FREE ELECTRON FLOW',{s:13,w:700,c:P.navy,a:'middle'})}
    <g class="dgm-drift">${[0,1,2,3].map(i=>`<circle cx="${-70+i*46}" cy="0" r="8" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="2"/>`).join('')}</g>
    ${arr(-95,40,95,40,P.danger,3)}
    ${T(0,70,'Current = drifting charge',{s:13,c:P.danger,a:'middle',w:600})}
    ${T(0,150,'In a conductor, loosely-held',{s:13,c:P.ink,a:'middle'})}
    ${T(0,170,'outer electrons drift from',{s:13,c:P.ink,a:'middle'})}
    ${T(0,190,'atom to atom when pushed',{s:13,c:P.ink,a:'middle'})}
    ${T(0,210,'by a difference in charge.',{s:13,c:P.ink,a:'middle'})}
  </g>`);

/* ============ 2. CONDUCTOR vs INSULATOR ============ */
D.conductor=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,40,'Why some materials carry current and others stop it',{s:14,c:P.gray,a:'middle'})}
  <g transform="translate(40,90)">
    ${T(0,0,'CONDUCTOR',{s:17,w:800,c:P.green})}
    <rect x="0" y="18" width="560" height="80" rx="10" fill="#ffffff" stroke="${P.green}" stroke-width="3"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${40+i*68}" cy="58" r="9" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="2"/>`).join('')}
    ${arr(30,58,540,58,P.danger,3)}
    ${T(280,128,'Free electrons move easily → low resistance (copper, aluminum, steel, wet body)',{s:13,c:P.ink,a:'middle'})}
  </g>
  <g transform="translate(40,260)">
    ${T(0,0,'INSULATOR',{s:17,w:800,c:P.danger})}
    <rect x="0" y="18" width="560" height="80" rx="10" fill="#ffffff" stroke="${P.danger}" stroke-width="3"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${40+i*68}" cy="58" r="9" fill="url(#qsteel)"/>`).join('')}
    <g stroke="${P.danger}" stroke-width="4" stroke-linecap="round"><line x1="270" y1="40" x2="300" y2="76"/><line x1="300" y1="40" x2="270" y2="76"/></g>
    ${T(280,128,'Electrons are bound → high resistance (rubber, glass, porcelain, dry wood, air)',{s:13,c:P.ink,a:'middle'})}
  </g>`);

/* ============ 3. WATER ANALOGY (V, I, R) ============ */
D.water=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,36,'The plumbing analogy',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="70" y="90" width="500" height="260" rx="40" fill="none" stroke="${P.sky}" stroke-width="22" opacity="0.55"/>
  <circle cx="70" cy="220" r="42" fill="url(#qnavy)" filter="url(#qsh)"/>${T(70,225,'PUMP',{s:13,w:700,c:P.white,a:'middle'})}
  ${T(70,300,'VOLTAGE',{s:15,w:800,c:P.navy,a:'middle'})}${T(70,320,'the pressure',{s:12,c:P.gray,a:'middle'})}
  <g transform="translate(320,350)"><polygon points="-22,-18 22,-18 0,6" fill="${P.amberD}"/><rect x="-6" y="-30" width="12" height="14" fill="${P.amberD}"/></g>
  ${T(320,392,'RESISTANCE',{s:15,w:800,c:P.amberD,a:'middle'})}${T(320,412,'the restriction (Ω)',{s:12,c:P.gray,a:'middle'})}
  ${arr(250,90,360,90,P.danger,4)}
  ${T(560,300,'CURRENT',{s:15,w:800,c:P.danger,a:'middle'})}${T(560,320,'the flow (amps)',{s:12,c:P.gray,a:'middle'})}
  ${T(320,150,'More pressure (V) → more flow (I).',{s:14,c:P.ink,a:'middle'})}
  ${T(320,172,'More restriction (R) → less flow.',{s:14,c:P.ink,a:'middle'})}
  ${T(320,210,'V = I × R',{s:26,w:800,c:P.navy,a:'middle'})}`);

/* ============ 4. BIRD ON A WIRE / POTENTIAL DIFFERENCE ============ */
D.bird=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  <g>
    ${T(160,40,'ONE wire = SAFE',{s:16,w:800,c:P.green,a:'middle'})}
    <line x1="20" y1="150" x2="300" y2="150" stroke="${P.navy}" stroke-width="6"/>
    <g transform="translate(160,150)"><ellipse cx="0" cy="-14" rx="22" ry="13" fill="${P.ink}"/><circle cx="18" cy="-22" r="8" fill="${P.ink}"/><polygon points="24,-24 38,-20 24,-16" fill="url(#qamber)"/><line x1="-6" y1="-2" x2="-6" y2="6" stroke="${P.ink}" stroke-width="3"/><line x1="6" y1="-2" x2="6" y2="6" stroke="${P.ink}" stroke-width="3"/></g>
    ${T(160,210,'Same potential at both feet.',{s:13,c:P.ink,a:'middle'})}
    ${T(160,230,'No difference → no current.',{s:13,c:P.green,a:'middle',w:700})}
  </g>
  <line x1="320" y1="70" x2="320" y2="430" stroke="${P.light2}" stroke-width="3"/>
  <g>
    ${T(480,40,'Bridge TWO = SHOCK',{s:16,w:800,c:P.danger,a:'middle'})}
    <line x1="360" y1="130" x2="620" y2="130" stroke="${P.danger}" stroke-width="6"/>
    <line x1="360" y1="210" x2="620" y2="210" stroke="${P.green}" stroke-width="6"/>
    <g transform="translate(490,170)"><ellipse cx="0" cy="0" rx="20" ry="12" fill="${P.ink}"/><circle cx="16" cy="-8" r="7" fill="${P.ink}"/>
      ${arr(-16,-28,-16,-2,P.amber,3)}${arr(16,2,16,28,P.amber,3)}</g>
    ${arr(470,134,470,206,P.danger,4)}
    ${T(480,250,'A second point of contact at a',{s:13,c:P.ink,a:'middle'})}
    ${T(480,270,'different potential completes the',{s:13,c:P.ink,a:'middle'})}
    ${T(480,290,'circuit → current flows through it.',{s:13,c:P.danger,a:'middle',w:700})}
  </g>
  ${T(320,440,'It is the DIFFERENCE of potential — not the wire — that drives current.',{s:14,w:700,c:P.navy,a:'middle'})}`);

/* ============ 5. OHM'S LAW WHEEL ============ */
D.ohm=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,38,'Cover what you want — the rest is the formula',{s:14,c:P.gray,a:'middle'})}
  <g transform="translate(190,250)">
    <polygon points="0,-120 -130,90 130,90" fill="#ffffff" stroke="${P.navy}" stroke-width="3" filter="url(#qsh)"/>
    <line x1="-130" y1="0" x2="130" y2="0" stroke="${P.navy}" stroke-width="3"/>
    <line x1="0" y1="0" x2="0" y2="90" stroke="${P.navy}" stroke-width="3"/>
    ${T(0,-45,'V',{s:46,w:800,c:P.danger,a:'middle'})}
    ${T(-60,65,'I',{s:40,w:800,c:P.navy2,a:'middle'})}
    ${T(62,65,'R',{s:40,w:800,c:P.amberD,a:'middle'})}
  </g>
  <g transform="translate(440,120)">
    ${T(0,0,'V = I × R',{s:22,w:800,c:P.navy})}
    ${T(0,46,'I = V ÷ R',{s:22,w:800,c:P.navy})}
    ${T(0,92,'R = V ÷ I',{s:22,w:800,c:P.navy})}
    <line x1="-4" y1="120" x2="180" y2="120" stroke="${P.light2}" stroke-width="2"/>
    ${T(0,158,'POWER',{s:14,w:800,c:P.amberD,ls:1})}
    ${T(0,190,'P = V × I',{s:20,w:700,c:P.ink})}
    ${T(0,222,'P = I² × R',{s:20,w:700,c:P.ink})}
    ${T(0,262,'Heat &amp; arc energy',{s:13,c:P.gray,i:'italic'})}
    ${T(0,282,'rise with I² — current squared',{s:13,c:P.danger})}
  </g>`);

/* ============ 6. AC vs DC WAVEFORMS ============ */
D.acdc=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  <g>
    ${T(60,52,'DIRECT CURRENT (DC)',{s:18,w:800,c:P.steel})}
    <line x1="60" y1="80" x2="60" y2="330" stroke="${P.gray}" stroke-width="2"/>
    <line x1="60" y1="205" x2="560" y2="205" stroke="${P.gray}" stroke-width="2" stroke-dasharray="4 4"/>
    <line x1="60" y1="130" x2="560" y2="130" stroke="${P.steel}" stroke-width="4"/>
    ${T(310,360,'Steady, one direction — batteries, solar, HVDC',{s:14,c:P.ink,a:'middle'})}
    ${T(50,135,'+',{s:18,w:800,c:P.steel,a:'end'})}
  </g>
  <line x1="600" y1="70" x2="600" y2="380" stroke="${P.light2}" stroke-width="3"/>
  <g>
    ${T(640,52,'ALTERNATING CURRENT (AC)',{s:18,w:800,c:P.navy2})}
    <line x1="640" y1="80" x2="640" y2="330" stroke="${P.gray}" stroke-width="2"/>
    <line x1="640" y1="205" x2="1140" y2="205" stroke="${P.gray}" stroke-width="2" stroke-dasharray="4 4"/>
    ${sine(640,205,500,72,2.5,0,P.navy2,4,120,'dgm-flow')}
    <line x1="640" y1="133" x2="1140" y2="133" stroke="${P.danger}" stroke-width="1.5" stroke-dasharray="6 5"/>
    ${T(1146,137,'peak',{s:12,c:P.danger})}
    <line x1="640" y1="160" x2="1140" y2="160" stroke="${P.green}" stroke-width="1.5" stroke-dasharray="6 5"/>
    ${T(1146,164,'RMS',{s:12,c:P.green})}
    ${T(890,360,'Reverses 60×/sec (60 Hz) — the grid runs on AC',{s:14,c:P.ink,a:'middle'})}
    ${T(630,135,'+',{s:18,w:800,c:P.navy2,a:'end'})}${T(630,280,'–',{s:18,w:800,c:P.navy2,a:'end'})}
  </g>`);

/* ============ 7. THREE-PHASE ============ */
D.threephase=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(590,42,'THREE-PHASE POWER — three waveforms 120° apart',{s:18,w:800,c:P.navy,a:'middle'})}
  <line x1="70" y1="90" x2="70" y2="330" stroke="${P.gray}" stroke-width="2"/>
  <line x1="70" y1="210" x2="1000" y2="210" stroke="${P.gray}" stroke-width="2" stroke-dasharray="4 4"/>
  ${sine(70,210,930,90,3,0,P.danger,4,120,'dgm-flow')}
  ${sine(70,210,930,90,3,-2*Math.PI/3,P.navy2,4,120,'dgm-flow')}
  ${sine(70,210,930,90,3,2*Math.PI/3,P.green,4,120,'dgm-flow')}
  <g>
    <rect x="1030" y="120" width="22" height="22" fill="url(#qred)"/>${T(1062,138,'Phase A',{s:15,w:700,c:P.ink})}
    <rect x="1030" y="165" width="22" height="22" fill="${P.navy2}"/>${T(1062,183,'Phase B',{s:15,w:700,c:P.ink})}
    <rect x="1030" y="210" width="22" height="22" fill="${P.green}"/>${T(1062,228,'Phase C',{s:15,w:700,c:P.ink})}
  </g>
  ${T(540,375,'Continuous, smooth power — the backbone of transmission, distribution &amp; large motors',{s:14,c:P.gray,a:'middle'})}`);

/* ============ 8. TRANSFORMER ============ */
D.transformer=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,40,'Stepping voltage up &amp; down by induction',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="285" y="110" width="70" height="240" rx="5" fill="url(#qsteel)" stroke="#6b7787" stroke-width="2" filter="url(#qsh)"/>
  <g stroke="${P.navy2}" stroke-width="6" fill="none">${[0,1,2,3,4,5].map(i=>`<circle cx="265" cy="${135+i*36}" r="20"/>`).join('')}</g>
  <g stroke="${P.amberD}" stroke-width="6" fill="none">${[0,1,2].map(i=>`<circle cx="375" cy="${165+i*60}" r="20"/>`).join('')}</g>
  ${T(190,110,'PRIMARY',{s:14,w:800,c:P.navy2,a:'middle'})}${T(190,130,'Np turns',{s:12,c:P.gray,a:'middle'})}
  ${T(455,110,'SECONDARY',{s:14,w:800,c:P.amberD,a:'middle'})}${T(455,130,'Ns turns',{s:12,c:P.gray,a:'middle'})}
  ${arr(120,235,225,235,P.danger,3)}${T(120,220,'Vp',{s:16,w:800,c:P.navy2})}
  ${arr(520,235,415,235,P.danger,3)}${T(505,220,'Vs',{s:16,w:800,c:P.amberD})}
  ${arr(320,150,320,110,P.green,2.5)}
  ${T(320,400,'Vs / Vp = Ns / Np',{s:22,w:800,c:P.navy,a:'middle'})}
  ${T(320,432,'Power in ≈ power out → voltage UP means current DOWN',{s:13,c:P.gray,a:'middle'})}`);

/* ============ 9. THE GRID (one-line) ============ */
D.grid=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="url(#qsky)" stroke="#cdd8e4" rx="16"/>
  ${T(590,34,'From generation to your service — and the voltage at each stage',{s:15,w:700,c:P.navy,a:'middle'})}
  <path d="M 8 364 H 1172 V 408 a8 8 0 0 1 -8 8 H 16 a8 8 0 0 1 -8 -8 Z" fill="url(#qground)"/>
  <path d="M 150 296 H 268" stroke="#37404a" stroke-width="2.5"/>
  <path d="M 340 300 L 360 198 H 642 L 660 300" stroke="#37404a" stroke-width="2.5" fill="none"/>
  <path d="M 740 300 L 900 252" stroke="#37404a" stroke-width="2.5" fill="none"/>
  <path d="M 905 262 L 1046 318" stroke="#37404a" stroke-width="2.5" fill="none"/>
  <circle class="dgm-travel" cx="170" cy="296" r="6" fill="url(#qamber)"/>
  <rect x="74" y="298" width="80" height="66" fill="#9aa6b3"/><rect x="74" y="298" width="80" height="6" fill="#ffffff" opacity="0.22"/>
  <rect x="88" y="266" width="12" height="34" fill="#7e8b99"/><rect x="122" y="258" width="12" height="42" fill="#7e8b99"/>
  <ellipse cx="94" cy="262" rx="12" ry="6" fill="#e4ebf2" opacity="0.85"/><ellipse cx="128" cy="252" rx="13" ry="7" fill="#e4ebf2" opacity="0.85"/>
  ${[305,700].map(cx=>`<rect x="${cx-36}" y="320" width="72" height="44" fill="#c2ccd7" stroke="#9aa6b3"/>
    <circle cx="${cx-9}" cy="338" r="13" fill="none" stroke="${P.navy}" stroke-width="2.6"/><circle cx="${cx+9}" cy="338" r="13" fill="none" stroke="${P.navy}" stroke-width="2.6"/>
    <line x1="${cx-9}" y1="325" x2="${cx-9}" y2="313" stroke="#6b7787" stroke-width="2.5"/><line x1="${cx+9}" y1="325" x2="${cx+9}" y2="313" stroke="#6b7787" stroke-width="2.5"/>`).join('')}
  <g stroke="#8b97a4" stroke-width="2.6" fill="none">
    <line x1="474" y1="364" x2="496" y2="160"/><line x1="526" y1="364" x2="504" y2="160"/>
    ${[[474,364,526,364],[480,313,520,313],[486,262,514,262],[492,211,508,211],[496,160,504,160]]
      .map((r,i,a)=>`<line x1="${r[0]}" y1="${r[1]}" x2="${r[2]}" y2="${r[3]}"/>${i<4?`<line x1="${r[0]}" y1="${r[1]}" x2="${a[i+1][2]}" y2="${a[i+1][3]}"/><line x1="${r[2]}" y1="${r[1]}" x2="${a[i+1][0]}" y2="${a[i+1][3]}"/>`:''}`).join('')}
    <line x1="456" y1="178" x2="544" y2="178"/>
  </g>
  ${[468,500,532].map(x=>`<line x1="${x}" y1="178" x2="${x}" y2="196" stroke="#9aa6b2" stroke-width="2"/><ellipse cx="${x}" cy="198" rx="4" ry="2.4" fill="url(#qporc)"/>`).join('')}
  ${woodPole(905,212,364,18)}
  ${crossarm(905,212,118,12)}
  <rect x="922" y="246" width="26" height="40" rx="11" fill="url(#qgalv)" stroke="#6b7787" stroke-width="0.8"/><line x1="930" y1="246" x2="930" y2="236" stroke="#6b7787" stroke-width="2"/>
  <polygon points="1042,316 1080,286 1118,316" fill="#9c5a3a"/><rect x="1048" y="316" width="64" height="48" fill="#ece5d8" stroke="#cdbfa6"/>
  <rect x="1072" y="338" width="16" height="26" fill="#9c7536"/><rect x="1056" y="324" width="13" height="13" fill="#bcd6ea" stroke="#9aa6b3"/>
  ${[['GENERATION','~20 kV',110,P.navy],['STEP-UP','↑ 230–765 kV',305,P.amberD],
     ['TRANSMISSION','HV lines',500,P.navy2],['STEP-DOWN','↓ 4–35 kV',700,P.amberD],
     ['DISTRIBUTION','primary',905,P.navy2],['SERVICE','120/240 V',1080,P.green]]
    .map(([t,v,x,c])=>`<rect x="${Math.max(6,Math.min(x-74,1026))}" y="74" width="148" height="44" rx="8" fill="#ffffff" stroke="${c}" stroke-width="2" opacity="0.96"/>
    ${T(Math.max(80,Math.min(x,1100)),93,t,{s:12.5,w:800,c:c,a:'middle'})}
    ${T(Math.max(80,Math.min(x,1100)),111,v,{s:12,c:P.gray,a:'middle'})}`).join('')}
  ${T(590,400,'Transmit HIGH (low current, low loss) → distribute &amp; use LOW (safe for customers)',{s:14,w:700,c:P.navy,a:'middle'})}`);

/* ============ 10. CURRENT PATH THROUGH BODY ============ */
D.body=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,40,'Path matters — current across the chest stops the heart',{s:14,c:P.gray,a:'middle'})}
  <g transform="translate(320,250)" fill="url(#qsteel)" opacity="0.95" filter="url(#qsh)">
    <circle cx="0" cy="-130" r="34"/>
    <path d="M -42 -86 Q 0 -100 42 -86 L 60 30 L 40 34 L 34 -40 L 30 120 L 8 120 L 0 0 L -8 120 L -30 120 L -34 -40 L -40 34 L -60 30 Z"/>
  </g>
  <g transform="translate(308,180)"><path d="M0 10 C -14 -8, -34 6, 0 34 C 34 6, 14 -8, 0 10 Z" fill="url(#qred)"/></g>
  <path class="dgm-current" d="M 255 150 Q 308 120 380 150" fill="none" stroke="${P.amber}" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round"/>
  ${arr(255,150,250,156,P.amber,4)}${arr(376,148,382,154,P.amber,4)}
  ${T(150,150,'CONTACT',{s:13,w:800,c:P.danger,a:'middle'})}${T(150,170,'energized',{s:12,c:P.gray,a:'middle'})}
  ${T(498,150,'2ND POINT',{s:13,w:800,c:P.danger,a:'middle'})}${T(498,170,'ground/phase',{s:12,c:P.gray,a:'middle'})}
  ${T(320,420,'Hand-to-hand or hand-to-foot routes current straight through the heart',{s:13,c:P.ink,a:'middle'})}
  ${T(320,442,'It is CURRENT — not voltage — that injures and kills',{s:14,w:700,c:P.danger,a:'middle'})}`);

/* ============ 11. SHOCK THRESHOLD LADDER ============ */
D.threshold=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,40,'Effects of 60 Hz current through the body',{s:15,w:700,c:P.navy,a:'middle'})}
  <defs><linearGradient id="th-g" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="${P.green}"/><stop offset="35%" stop-color="${P.amber}"/>
    <stop offset="62%" stop-color="${P.danger}"/><stop offset="100%" stop-color="${P.dangerD}"/></linearGradient></defs>
  <rect x="90" y="70" width="70" height="350" rx="8" fill="url(#th-g)"/>
  ${[['1 mA','Perception — faint tingle',408],
     ['5 mA','Startling shock — fall risk',360],
     ['10–16 mA','&ldquo;Let-go&rdquo; lost — muscles clamp',300],
     ['20–50 mA','Severe contraction, breathing fails',240],
     ['50–100 mA','Ventricular fibrillation likely',175],
     ['100 mA–2 A','Usually FATAL fibrillation',110],
     ['&gt; 2 A','Cardiac arrest &amp; burns',78]]
    .map(([a,b,y])=>`<line x1="160" y1="${y}" x2="185" y2="${y}" stroke="${P.navy}" stroke-width="2"/>
      ${T(195, y-2, a,{s:14,w:800,c:P.navy})}${T(195, y+15, b,{s:12,c:P.gray})}`).join('')}
  ${T(125,448,'The deadly range begins in MILLIAMPS',{s:13,w:700,c:P.danger,a:'middle'})}`);

/* ============ 12. ARC FLASH ============ */
D.arcflash=()=>svg('640 470',`
  <rect width="640" height="470" fill="#0a1830" rx="16"/>
  <rect x="60" y="250" width="152" height="172" rx="8" fill="url(#qsteel)" stroke="#5b6776" stroke-width="2"/>
  <rect x="74" y="266" width="124" height="18" rx="3" fill="#b4bdc8"/><rect x="74" y="292" width="124" height="10" rx="2" fill="#9aa6b3"/>
  ${T(136,440,'equipment / fault',{s:12,c:P.light,a:'middle'})}
  <circle cx="220" cy="298" r="156" fill="url(#qspark)" class="dgm-spark"/>
  <g class="dgm-spark" stroke="${P.amber}" stroke-width="3" fill="none" opacity="0.95">
    ${[-50,-25,0,25,50,75,100].map(a=>{const r=(a*Math.PI/180);
      return `<path d="M 220 300 L ${(250+Math.cos(r)*40).toFixed(0)} ${(300+Math.sin(r)*40).toFixed(0)} L ${(300+Math.cos(r)*90).toFixed(0)} ${(300+Math.sin(r)*90-20).toFixed(0)} L ${(360+Math.cos(r)*150).toFixed(0)} ${(300+Math.sin(r)*150).toFixed(0)}" />`;}).join('')}
  </g>
  <circle cx="220" cy="298" r="46" fill="#fff7d6"/><circle cx="220" cy="298" r="26" fill="#ffd24d"/>
  <polygon class="dgm-spark" points="220,248 232,293 270,298 232,306 220,353 208,306 170,298 208,293" fill="#ffffff"/>
  ${T(440,120,'ARC FLASH',{s:24,w:800,c:P.amber,a:'middle'})}
  ${T(440,160,'up to ~35,000°F',{s:16,w:700,c:P.white,a:'middle'})}
  ${T(440,182,'(hotter than the sun&rsquo;s surface)',{s:12,c:P.sky,a:'middle'})}
  ${T(440,235,'ARC BLAST',{s:24,w:800,c:P.danger,a:'middle'})}
  ${T(440,272,'pressure wave • molten metal',{s:14,c:P.white,a:'middle'})}
  ${T(440,294,'shrapnel • sound &gt; 140 dB',{s:14,c:P.white,a:'middle'})}
  ${T(440,350,'Copper vapor expands ~67,000×',{s:13,c:P.amber,a:'middle'})}
  ${T(440,392,'Can occur WITHOUT contact —',{s:13,c:P.white,a:'middle'})}
  ${T(440,412,'proximity alone can trigger it',{s:13,w:700,c:P.white,a:'middle'})}`);

/* ============ 13. STEP & TOUCH POTENTIAL ============ */
D.steptouch=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="url(#qsky)" stroke="#cdd8e4" rx="16"/>
  ${T(590,34,'A downed conductor energizes the ground in a voltage gradient',{s:15,w:700,c:P.navy,a:'middle'})}
  <path d="M 8 250 H 1172 V 408 a8 8 0 0 1 -8 8 H 16 a8 8 0 0 1 -8 -8 Z" fill="url(#qground)"/>
  <line x1="8" y1="250" x2="1172" y2="250" stroke="#9c7536" stroke-width="2"/>
  ${woodPole(150,72,250,24)}
  <path d="M 150 92 C 224 92, 244 232, 252 250" stroke="#cf3a22" stroke-width="6" fill="none"/>
  <path d="M 150 92 C 224 92, 244 232, 252 250" stroke="#ffffff" stroke-width="1.5" opacity="0.25" fill="none"/>
  ${T(150,60,'downed line',{s:12,w:700,c:P.danger,a:'middle'})}
  <g>${[34,92,160,238,320].map((r,i)=>`<ellipse cx="252" cy="250" rx="${r}" ry="${(r*0.3).toFixed(0)}" fill="none" stroke="${P.danger}" stroke-width="2" opacity="${(0.85-i*0.14).toFixed(2)}"/>`).join('')}</g>
  <circle cx="252" cy="250" r="12" fill="url(#qred)"/>
  <path d="M 252 112 C 360 116, 430 236, 1150 246" fill="none" stroke="${P.navy2}" stroke-width="3"/>
  ${T(330,104,'voltage vs distance from the contact point',{s:13,w:700,c:P.navy2})}
  <g transform="translate(770,250)">
    ${lineworker2(0,0,0.92)}
    ${T(0,-150,'STEP POTENTIAL',{s:13,w:800,c:P.danger,a:'middle'})}
    <line x1="-16" y1="6" x2="16" y2="6" stroke="${P.danger}" stroke-width="2.5"/>
    ${T(0,38,'V between the feet',{s:12,c:P.gray,a:'middle'})}
  </g>
  ${arr(700,312,650,312,P.navy,3)}${arr(840,312,890,312,P.navy,3)}
  ${T(770,372,'SHUFFLE out — feet together, tiny steps. Keep the public back. Assume the ground is energized.',{s:14,w:700,c:P.navy,a:'middle'})}`);

/* ============ 14. MINIMUM APPROACH DISTANCE ============ */
D.mad=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qsky)" stroke="#cdd8e4" rx="16"/>
  ${T(320,36,'The air gap voltage must not be allowed to jump',{s:14,c:P.gray,a:'middle'})}
  <path d="M 8 420 H 632 V 462 a8 8 0 0 1 -8 8 H 16 a8 8 0 0 1 -8 -8 Z" fill="url(#qground)"/>
  ${woodPole(120,150,452,28)}
  ${pinInsulator(120,150,1.5)}
  <line x1="20" y1="120" x2="120" y2="120" stroke="#cf3a22" stroke-width="6" stroke-linecap="round"/>
  <path d="M 120 120 L 162 186" stroke="#cf3a22" stroke-width="5"/>
  <circle cx="162" cy="186" r="58" fill="url(#qspark)"/><circle cx="162" cy="186" r="13" fill="url(#qred)"/>
  ${T(120,104,'ENERGIZED',{s:12,w:800,c:P.danger,a:'middle'})}
  <circle cx="162" cy="186" r="205" fill="none" stroke="${P.navy2}" stroke-width="2.5" stroke-dasharray="8 6"/>
  ${lineworker2(500,452,1.0)}
  ${arr(168,402,365,402,P.navy,3)}${arr(365,402,168,402,P.navy,3)}
  <line x1="168" y1="384" x2="168" y2="412" stroke="${P.navy}" stroke-width="2"/><line x1="365" y1="384" x2="365" y2="412" stroke="${P.navy}" stroke-width="2"/>
  ${T(266,396,'MINIMUM APPROACH DISTANCE',{s:12.5,w:800,c:P.navy,a:'middle'})}
  ${T(500,288,'qualified worker —',{s:11.5,c:P.gray,a:'middle'})}${T(500,346,'stays outside the ring',{s:11.5,c:P.gray,a:'middle'})}
  ${T(320,452,'Body, tools, boom, materials — everything conductive must stay back',{s:12.5,w:600,c:P.navy,a:'middle'})}`);

/* ============ 15. SECOND POINT OF CONTACT (hero) ============ */
D.secondpoint=()=>svg('1180 470',`
  <rect width="1180" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(590,38,'The circuit completes only when you touch a SECOND point at a different potential',{s:15,w:700,c:P.navy,a:'middle'})}
  <g>
    <rect x="40" y="70" width="520" height="370" rx="12" fill="#ffffff" stroke="${P.danger}" stroke-width="2.5"/>
    ${T(300,100,'UNPROTECTED — circuit through worker',{s:14,w:800,c:P.danger,a:'middle'})}
    <line x1="80" y1="150" x2="520" y2="150" stroke="${P.danger}" stroke-width="7"/>
    ${T(90,140,'energized phase',{s:12,c:P.danger})}
    <line x1="80" y1="360" x2="520" y2="360" stroke="${P.green}" stroke-width="7"/>
    ${T(90,385,'grounded neutral / structure',{s:12,c:P.green})}
    ${lineworker2(300,360,1.2)}
    <path class="dgm-current" d="M 300 150 L 300 305" stroke="${P.amber}" stroke-width="5" stroke-dasharray="2 8" stroke-linecap="round"/>
    ${arr(300,300,300,312,P.amber,4)}
    ${T(360,250,'current flows',{s:13,w:700,c:P.amberD})}${T(360,270,'THROUGH you',{s:13,w:700,c:P.amberD})}
    <circle cx="300" cy="150" r="9" fill="url(#qred)"/><circle cx="300" cy="360" r="9" fill="${P.green}"/>
  </g>
  <g>
    <rect x="620" y="70" width="520" height="370" rx="12" fill="#ffffff" stroke="${P.green}" stroke-width="2.5"/>
    ${T(880,100,'COVERED UP — no second point',{s:14,w:800,c:P.green,a:'middle'})}
    <line x1="660" y1="150" x2="1100" y2="150" stroke="${P.danger}" stroke-width="7"/>
    <rect x="760" y="140" width="240" height="20" rx="10" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="2"/>
    ${T(670,140,'line hose',{s:12,c:P.amberD})}
    <line x1="660" y1="360" x2="1100" y2="360" stroke="${P.green}" stroke-width="7"/>
    <rect x="800" y="350" width="160" height="20" rx="6" fill="${P.navy2}" opacity="0.85"/>
    ${T(670,385,'insulating cover-up',{s:12,c:P.navy2})}
    ${lineworker2(880,360,1.2)}
    <g stroke="${P.green}" stroke-width="5" fill="none"><path d="M 856 224 l 13 15 l 26 -32"/></g>
    ${T(905,234,'isolated from both',{s:13,w:700,c:P.green})}
    ${T(905,252,'→ safe',{s:13,w:700,c:P.green})}
  </g>`);

/* ============ 16. EQUIPOTENTIAL ZONE / GROUNDING ============ */
D.epz=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,40,'Bond everything to ONE potential — ride the voltage together',{s:14,c:P.gray,a:'middle'})}
  <line x1="60" y1="120" x2="580" y2="120" stroke="${P.navy}" stroke-width="7"/>${T(70,108,'de-energized conductor',{s:12,c:P.gray})}
  ${lineworker2(320,330,1.05)}
  <path d="M 320 120 L 320 200" stroke="${P.green}" stroke-width="5"/>
  <circle cx="320" cy="120" r="9" fill="${P.green}"/>
  <path d="M 320 330 L 320 380 L 470 380 L 470 410" stroke="${P.green}" stroke-width="5" fill="none"/>
  <polygon points="450,410 490,410 470,432" fill="${P.green}"/>
  ${[0,1,2].map(i=>`<line x1="${460+i*7}" y1="${436+i*5}" x2="${480-i*7}" y2="${436+i*5}" stroke="${P.green}" stroke-width="2"/>`).join('')}
  ${T(490,395,'protective ground',{s:12,c:P.green})}
  ${T(150,250,'V',{s:18,w:800,c:P.green,a:'middle'})}${T(490,250,'V',{s:18,w:800,c:P.green,a:'middle'})}${T(320,160,'V',{s:18,w:800,c:P.green,a:'middle'})}
  ${T(320,432,'Same potential everywhere → no difference across the body → no current',{s:13,w:700,c:P.navy,a:'middle'})}`);

/* ============ 17. COVER-UP POLE TOP ============ */
D.coverup=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qsky)" stroke="#cdd8e4" rx="16"/>
  ${T(320,40,'Insulate every energized AND grounded part within reach',{s:14,c:P.gray,a:'middle'})}
  ${woodPole(320,150,452,32)}
  ${crossarm(320,150,300,18)}
  ${pinInsulator(206,150,1.45)}${pinInsulator(434,150,1.45)}
  <path d="M 40 121 L 600 121" stroke="#37404a" stroke-width="6" stroke-linecap="round"/>
  <path d="M 40 121 L 600 121" stroke="#ffffff" stroke-width="1.6" opacity="0.28" stroke-linecap="round"/>
  <rect x="150" y="112" width="340" height="18" rx="9" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="1.5"/>
  ${[206,434].map(x=>`<path d="M ${x-21} 124 q 21 -34 42 0 Z" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="1.5"/>`).join('')}
  <path d="M 60 300 Q 320 312 600 300" stroke="#5b6b7b" stroke-width="5" fill="none"/>
  <path d="M 252 288 h136 a8 8 0 0 1 8 8 v18 a8 8 0 0 1 -8 8 h-136 a8 8 0 0 1 -8 -8 v-18 a8 8 0 0 1 8 -8 Z" fill="${P.navy2}" opacity="0.9"/>
  <path d="M 252 288 h136 v4 h-136 Z" fill="#ffffff" opacity="0.14"/>
  ${T(86,150,'line hose',{s:12,w:700,c:P.amberD})}<line x1="120" y1="146" x2="150" y2="124" stroke="${P.amberD}" stroke-width="1.2"/>
  ${T(206,86,'insulator hood',{s:12,w:700,c:P.amberD,a:'middle'})}<line x1="206" y1="92" x2="206" y2="104" stroke="${P.amberD}" stroke-width="1.2"/>
  ${T(320,346,'insulating blanket (covers the grounded neutral)',{s:12,w:700,c:P.navy2,a:'middle'})}
  ${T(320,404,'Cover the NEAREST hazard first, then work outward.',{s:13.5,w:700,c:P.navy,a:'middle'})}
  ${T(320,428,'Remove in REVERSE — last on, first off.',{s:13,c:P.ink,a:'middle'})}`);

/* ============ 18. GLOVE CLASSES ============ */
D.gloves=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(590,40,'Rubber insulating glove classes (ASTM D120) — select AT or ABOVE your voltage',{s:15,w:700,c:P.navy,a:'middle'})}
  ${[['00','500 V','#e6d3a8','#b79a5f',P.ink],['0','1,000 V','#d8442b','#9e2410',P.white],['1','7,500 V','#eef1f5','#aeb8c4',P.ink],
     ['2','17,000 V','#f5b81f','#c88a00',P.ink],['3','26,500 V','#33915f','#1f6b43',P.white],['4','36,000 V','#e2701a','#a8500f',P.white]]
    .map(([cl,v,fill,dk,tc],i)=>{const cx=118+i*182;return `
    <g transform="translate(${cx},94)">
      ${gshadow(2,232,34,7,0.13)}
      ${[-19.5,-9.5,0.5,10.5].map((fx,j)=>`<rect x="${fx}" y="${-46+(j===0||j===3?6:0)}" width="9" height="${64-(j===0||j===3?6:0)}" rx="4.5" fill="${fill}" stroke="${dk}" stroke-width="1"/>`).join('')}
      <path d="M -30 8 q -10 -20 6 -30 q 8 8 16 4 l 6 14 Z" fill="${fill}" stroke="${dk}" stroke-width="1"/>
      <rect x="-21" y="-8" width="42" height="52" rx="13" fill="${fill}" stroke="${dk}" stroke-width="1"/>
      <path d="M -22 34 L -27 116 Q -27 124 -19 124 L 19 124 Q 27 124 27 116 L 22 34 Z" fill="${fill}" stroke="${dk}" stroke-width="1"/>
      <ellipse cx="-7" cy="8" rx="10" ry="22" fill="#ffffff" opacity="0.16"/>
      <path d="M -25 70 L -27 116 Q -27 124 -19 124 L 19 124 Q 27 124 27 116 L 25 70 Z" fill="#c79a5b" stroke="#9c7536" stroke-width="1.2"/>
      <path d="M -25 70 L 25 70" stroke="#9c7536" stroke-width="1" stroke-dasharray="3 3"/>
      ${T(0,150,'CLASS',{s:10.5,w:700,c:P.gray,a:'middle'})}
      <circle cx="0" cy="98" r="15" fill="#ffffff" stroke="#c88a00" stroke-width="1.5"/>${T(0,104,cl,{s:16,w:800,c:P.navy,a:'middle'})}
    </g>
    ${T(cx,300,v,{s:19,w:800,c:P.navy,a:'middle'})}
    ${T(cx,323,'max use voltage',{s:10.5,c:P.gray,a:'middle'})}`;}).join('')}
  ${T(590,378,'Always worn with leather protectors • air-test &amp; inspect before every use • retest ≈ every 6 months',{s:13,c:P.ink,a:'middle'})}`);

/* ============ 19. HOT STICK / LIVE-LINE TOOL ============ */
D.hotstick=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qsky)" stroke="#cdd8e4" rx="16"/>
  ${T(320,38,'Reach beyond the minimum approach distance — work through the tool',{s:14,c:P.gray,a:'middle'})}
  <path d="M 8 418 H 632 V 462 a8 8 0 0 1 -8 8 H 16 a8 8 0 0 1 -8 -8 Z" fill="url(#qground)"/>
  ${woodPole(118,118,452,28)}
  ${pinInsulator(118,118,1.45)}
  <line x1="20" y1="90" x2="118" y2="90" stroke="#cf3a22" stroke-width="6" stroke-linecap="round"/>
  <line x1="20" y1="90" x2="118" y2="90" stroke="#ffffff" stroke-width="1.4" opacity="0.28" stroke-linecap="round"/>
  ${T(118,76,'energized',{s:12,w:700,c:P.danger,a:'middle'})}
  <circle cx="150" cy="150" r="50" fill="url(#qspark)"/>
  <path d="M 118 90 L 150 150" stroke="#cf3a22" stroke-width="5"/>
  <circle cx="150" cy="150" r="10" fill="url(#qred)"/>
  <circle cx="150" cy="150" r="170" fill="none" stroke="${P.navy2}" stroke-width="2" stroke-dasharray="8 6"/>
  ${lineworker2(486,452,1.0)}
  <line x1="455" y1="363" x2="160" y2="156" stroke="url(#qamber)" stroke-width="8.5" stroke-linecap="round"/>
  <line x1="455" y1="363" x2="160" y2="156" stroke="#ffffff" stroke-width="2" opacity="0.25" stroke-linecap="round"/>
  <line x1="455" y1="363" x2="420" y2="338" stroke="${P.green}" stroke-width="9" stroke-linecap="round"/>
  <ellipse cx="408" cy="330" rx="12" ry="5" fill="${P.amberD}" transform="rotate(35 408 330)"/>
  <path d="M 150 150 q -12 -10 -2 -22" stroke="${P.gray}" stroke-width="3" fill="none"/>
  <circle cx="160" cy="156" r="6" fill="${P.navy}"/>
  ${T(286,250,'fiberglass insulating stick',{s:12,w:700,c:P.amberD,a:'middle'})}
  ${T(560,300,'worker stays back',{s:12,c:P.gray,a:'middle'})}
  ${T(320,442,'Keep it CLEAN &amp; DRY — contamination ruins the insulating surface',{s:13,w:700,c:P.navy,a:'middle'})}`);

/* ============ 20. PROTECTIVE GROUNDS ============ */
D.grounds=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,38,'Protective grounds — sized to carry fault current &amp; trip protection fast',{s:14,c:P.gray,a:'middle'})}
  <path d="M 8 392 H 632 V 462 a8 8 0 0 1 -8 8 H 16 a8 8 0 0 1 -8 -8 Z" fill="url(#qground)"/>
  ${[150,320,490].map((x,i)=>`<line x1="${x-44}" y1="92" x2="${x+44}" y2="92" stroke="#cf3a22" stroke-width="6" stroke-linecap="round"/>
    ${T(x,76,['A','B','C'][i],{s:13,w:800,c:P.danger,a:'middle'})}
    <rect x="${x-10}" y="95" width="20" height="15" rx="3" fill="url(#qgalv)" stroke="#6b7787" stroke-width="0.8"/>
    <circle cx="${x}" cy="102" r="3" fill="#6b7787"/>`).join('')}
  <path d="M 150 110 Q 205 188 298 252" stroke="url(#qcopper)" stroke-width="5.5" fill="none"/>
  <path d="M 320 110 Q 320 182 320 252" stroke="url(#qcopper)" stroke-width="5.5" fill="none"/>
  <path d="M 490 110 Q 435 188 342 252" stroke="url(#qcopper)" stroke-width="5.5" fill="none"/>
  <rect x="274" y="250" width="92" height="20" rx="5" fill="${P.navy}"/>
  <rect x="274" y="250" width="92" height="4" rx="2" fill="#ffffff" opacity="0.18"/>
  ${T(376,266,'cluster bar',{s:12,w:700,c:P.gray})}
  <path d="M 320 270 L 320 392" stroke="url(#qcopper)" stroke-width="6"/>
  <rect x="308" y="392" width="24" height="11" rx="2" fill="url(#qgalv)" stroke="#6b7787" stroke-width="0.8"/>
  <rect x="316" y="400" width="8" height="56" rx="2" fill="url(#qgalv)"/>
  ${T(344,432,'ground rod → earth',{s:11,w:700,c:'#7a5a3a'})}
  ${T(150,150,'ground clamp',{s:11,c:P.gray,a:'middle'})}
  ${T(320,386,'Connect ground end FIRST, then the line ends — remove in REVERSE',{s:13,w:700,c:P.navy,a:'middle'})}`);

/* ============ 21. PPE / FR FIGURE ============ */
D.ppe=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,38,'Head-to-toe protection — the LAST layer of defense',{s:14,c:P.gray,a:'middle'})}
  ${lineworker2(205,432,1.72)}
  <rect x="186" y="170" width="38" height="7" rx="3.5" fill="#22323f" opacity="0.85"/>
  ${[['Class E hard hat',150,221,154],
     ['Arc-rated face shield / glasses',196,225,174],
     ['FR / arc-rated shirt (cal/cm²)',268,242,272],
     ['Rubber gloves + leather protectors',320,261,284],
     ['EH-rated boots',414,224,420]]
    .map(([t,y,ax,ay])=>`<line x1="396" y1="${y-4}" x2="${ax}" y2="${ay}" stroke="${P.steel}" stroke-width="1.4"/><circle cx="${ax}" cy="${ay}" r="2.6" fill="${P.steel}"/>${T(404,y,t,{s:12.5,c:P.ink})}`).join('')}`);

/* ============ 22. HIERARCHY OF CONTROLS ============ */
D.hierarchy=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,40,'Reach for the top first — PPE is the last line, never the only line',{s:14,c:P.gray,a:'middle'})}
  ${[['ELIMINATE','De-energize, isolate, test dead, ground',P.green],
     ['SUBSTITUTE / ENGINEER','Reroute, switch load, remote methods',P.navy2],
     ['ISOLATE THE WORKER','Insulate &amp; isolate — gloves, cover-up, MAD',P.steel],
     ['ADMINISTRATIVE','Procedures, job briefs, qualified workers',P.amberD],
     ['PPE','FR clothing, face &amp; head protection',P.danger]]
    .map(([t,d,c],i)=>{const topW=560,botW=180,y=80+i*66,h=58;
      const w1=topW-(topW-botW)*(i/5),w2=topW-(topW-botW)*((i+1)/5);
      const x1=320-w1/2,x2=320-w2/2;
      return `<polygon points="${x1.toFixed(0)},${y} ${(x1+w1).toFixed(0)},${y} ${(x2+w2).toFixed(0)},${y+h} ${x2.toFixed(0)},${y+h}" fill="${c}"/>
        ${T(320, y+26, t,{s:15,w:800,c:P.white,a:'middle'})}
        ${T(320, y+45, d,{s:11.5,c:P.white,a:'middle'})}`;}).join('')}
  ${arr(70,90,70,400,P.navy,3)}${T(40,250,'MOST',{s:12,w:800,c:P.navy,a:'middle'})}${T(40,268,'EFFECTIVE',{s:11,c:P.gray,a:'middle'})}`);

/* ============ 23. TAILBOARD / JOB BRIEFING ============ */
D.tailboard=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,40,'The job briefing aligns the whole crew before work starts',{s:14,c:P.gray,a:'middle'})}
  ${[[140,140],[500,140],[120,330],[520,330],[320,400]].map(([x,y])=>`<line x1="${x}" y1="${y-30}" x2="320" y2="235" stroke="${P.amber}" stroke-width="2" stroke-dasharray="3 4"/>`).join('')}
  <g transform="translate(320,235)">
    <rect x="-55" y="-70" width="110" height="140" rx="8" fill="#ffffff" stroke="${P.navy}" stroke-width="3"/>
    <rect x="-20" y="-82" width="40" height="20" rx="5" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="2"/>
    ${[-44,-28,-12,4,20,36,52].map((y,i)=>`<line x1="-40" y1="${y}" x2="${i%2?30:40}" y2="${y}" stroke="${P.steel}" stroke-width="3"/>`).join('')}
  </g>
  ${[[140,140],[500,140],[120,330],[520,330],[320,400]].map(([x,y])=>lineworker2(x,y,0.5)).join('')}
  ${T(320,452,'Hazards • procedures • controls • PPE • roles • rescue — and everyone can speak up',{s:13,w:600,c:P.navy,a:'middle'})}`);

/* ============ 24. LOTO / DE-ENERGIZE SEQUENCE ============ */
D.loto=()=>svg('1180 410',`
  <rect width="1180" height="410" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(590,42,'The verification sequence — never skip a step',{s:15,w:700,c:P.navy,a:'middle'})}
  ${[['IDENTIFY','right circuit &amp; section',P.navy],['OPEN','visible disconnect',P.navy2],
     ['LOCK &amp; TAG','each worker&rsquo;s lock',P.amberD],['TEST','prove it dead',P.danger],
     ['GROUND','equipotential zone',P.green]]
    .map(([t,d,c],i)=>{const x=70+i*222;return `
     <circle cx="${x+70}" cy="180" r="44" fill="${c}" filter="url(#qsh)"/>${T(x+70,190,i+1,{s:34,w:800,c:P.white,a:'middle'})}
     ${T(x+70,258,t,{s:15,w:800,c:c,a:'middle'})}
     ${T(x+70,280,d,{s:12,c:P.gray,a:'middle'})}
     ${i<4?arr(x+118,180,x+196,180,P.steel,3):''}`;}).join('')}
  ${T(590,350,'&ldquo;Test your tester&rdquo; on a known source before AND after — treat every conductor as energized until proven dead',{s:13,c:P.ink,a:'middle'})}`);

/* ============ 25. RECLOSER / AUTO-RECLOSE ============ */
D.recloser=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(590,38,'Reclosers automatically re-close — a “dead” line can come back live',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="50" y="150" width="120" height="74" rx="8" fill="${P.navy}"/>${T(110,193,'SOURCE',{s:13,w:800,c:P.white,a:'middle'})}
  <line x1="170" y1="187" x2="1110" y2="187" stroke="${P.steel}" stroke-width="4"/>
  <circle cx="300" cy="187" r="26" fill="#fff" stroke="${P.danger}" stroke-width="4"/>${T(300,195,'R',{s:22,w:800,c:P.danger,a:'middle'})}
  ${T(300,138,'RECLOSER',{s:12,w:800,c:P.danger,a:'middle'})}
  <line x1="640" y1="187" x2="640" y2="300" stroke="${P.steel}" stroke-width="3"/>
  <rect x="631" y="222" width="18" height="34" rx="3" fill="#fff" stroke="${P.amberD}" stroke-width="3"/>${T(666,246,'fuse',{s:12,c:P.amberD})}
  <polygon points="640,300 631,322 643,322 632,346" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="1"/>
  ${T(640,362,'fault / downed line',{s:12,c:P.danger,a:'middle'})}
  ${arr(1080,187,1108,187,P.steel,3)}
  ${[['TRIP',P.danger],['reclose',P.green],['TRIP',P.danger],['reclose',P.green],['LOCKOUT',P.navy]]
    .map(([t,c],i)=>`<rect class="dgm-seq" style="animation-delay:${(i*0.5).toFixed(1)}s" x="${120+i*180}" y="388" width="150" height="30" rx="6" fill="${c}"/>${T(195+i*180,408,t,{s:13,w:800,c:P.white,a:'middle'})}${i<4?arr(272+i*180,403,298+i*180,403,P.gray,2):''}`).join('')}`);

/* ============ 26. INSULATED AERIAL DEVICE (BUCKET) ============ */
D.bucket=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qsky)" stroke="#cdd8e4" rx="16"/>
  ${T(320,36,'The insulated aerial device keeps the boom — and you — isolated',{s:14,c:P.gray,a:'middle'})}
  <path d="M 8 406 H 632 V 462 a8 8 0 0 1 -8 8 H 16 a8 8 0 0 1 -8 -8 Z" fill="url(#qground)"/>
  <line x1="40" y1="104" x2="600" y2="104" stroke="#cf3a22" stroke-width="6" stroke-linecap="round"/>
  <line x1="40" y1="104" x2="600" y2="104" stroke="#ffffff" stroke-width="1.5" opacity="0.28" stroke-linecap="round"/>
  ${T(56,94,'energized conductor',{s:12,w:700,c:P.danger})}
  <path d="M 70 372 L 44 405 L 60 405 Z" fill="url(#qgalv)"/><path d="M 300 372 L 320 405 L 304 405 Z" fill="url(#qgalv)"/>
  ${gshadow(190,407,150,9,0.14)}
  <rect x="60" y="350" width="252" height="40" rx="6" fill="${P.navy}"/>
  <rect x="60" y="320" width="74" height="42" rx="6" fill="${P.navy2}"/>
  <path d="M 74 330 h34 v20 h-40 v-12 a8 8 0 0 1 6 -8 Z" fill="#bcd6ea"/>
  <rect x="140" y="328" width="172" height="28" rx="4" fill="#e9eef4" stroke="#cdd6e0"/>
  ${[158,198,238,278].map(x=>`<rect x="${x}" y="333" width="16" height="18" rx="2" fill="#d4dce5" stroke="#aab6c2"/>`).join('')}
  ${[110,262].map(wx=>`<circle cx="${wx}" cy="392" r="21" fill="#262626"/><circle cx="${wx}" cy="392" r="9" fill="url(#qgalv)"/>`).join('')}
  <rect x="250" y="304" width="46" height="20" rx="4" fill="${P.steel}"/>
  <line x1="274" y1="314" x2="366" y2="250" stroke="url(#qgalv)" stroke-width="15" stroke-linecap="round"/>
  ${T(286,302,'lower boom',{s:11.5,c:P.gray})}
  <circle cx="366" cy="250" r="9" fill="${P.steel}"/>
  <line x1="366" y1="250" x2="470" y2="138" stroke="url(#qamber)" stroke-width="15" stroke-linecap="round"/>
  <line x1="366" y1="250" x2="470" y2="138" stroke="#ffffff" stroke-width="3" opacity="0.25" stroke-linecap="round"/>
  ${T(488,196,'insulated (dielectric)',{s:11.5,w:700,c:P.amberD})}${T(488,212,'upper boom',{s:11.5,c:P.amberD})}
  ${lineworker2(474,152,0.34)}
  <path d="M 446 112 h54 a6 6 0 0 1 6 6 v38 a8 8 0 0 1 -8 8 h-50 a8 8 0 0 1 -8 -8 v-38 a6 6 0 0 1 6 -6 Z" fill="#f4f7fb" stroke="${P.navy}" stroke-width="2.5"/>
  <path d="M 440 120 h66" stroke="#ffffff" stroke-width="2" opacity="0.6"/>
  ${T(320,452,'The dielectric boom section is an insulating gap — rubber-glove work proceeds in the bucket',{s:12.5,c:P.ink,a:'middle'})}`);

/* ============ 27. SWITCHING / CLEARANCE ONE-LINE ============ */
D.switching=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(590,38,'A clearance: isolated on every side, locked, tagged, tested &amp; grounded',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="40" y="170" width="100" height="60" rx="8" fill="${P.navy}"/>${T(90,206,'SOURCE',{s:12,w:800,c:P.white,a:'middle'})}
  <rect x="1040" y="170" width="100" height="60" rx="8" fill="${P.navy}"/>${T(1090,206,'SOURCE',{s:12,w:800,c:P.white,a:'middle'})}
  <line x1="140" y1="200" x2="360" y2="200" stroke="${P.steel}" stroke-width="4"/>
  <line x1="820" y1="200" x2="1040" y2="200" stroke="${P.steel}" stroke-width="4"/>
  ${[360,820].map(x=>`<circle cx="${x}" cy="200" r="5" fill="${P.navy}"/><circle cx="${x+90}" cy="200" r="5" fill="${P.navy}"/><line x1="${x}" y1="200" x2="${x+68}" y2="158" stroke="${P.danger}" stroke-width="4"/>
    <rect x="${x+32}" y="118" width="26" height="20" rx="3" fill="url(#qamber)" stroke="${P.amberD}" stroke-width="2"/>${T(x+45,133,'L',{s:12,w:800,c:P.navy,a:'middle'})}
    ${T(x+45,108,'OPEN',{s:11,w:800,c:P.danger,a:'middle'})}`).join('')}
  <rect x="450" y="150" width="280" height="150" rx="10" fill="#fff" stroke="${P.green}" stroke-width="3" stroke-dasharray="7 5"/>
  <line x1="450" y1="200" x2="730" y2="200" stroke="${P.steel}" stroke-width="4"/>
  ${lineworker2(590,298,0.6)}
  ${T(590,172,'WORK ZONE',{s:13,w:800,c:P.green,a:'middle'})}
  ${[470,710].map(x=>`<line x1="${x}" y1="200" x2="${x}" y2="300" stroke="${P.green}" stroke-width="4"/><polygon points="${x-12},300 ${x+12},300 ${x},318" fill="${P.green}"/>`).join('')}
  ${T(590,340,'protective grounds',{s:12,c:P.green,a:'middle'})}
  ${T(590,400,'Open &amp; visible · locked &amp; tagged · tested dead · grounded — only the holder releases the clearance',{s:13,w:600,c:P.navy,a:'middle'})}`);

/* ============ 28. INDUCED VOLTAGE ============ */
D.induced=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(590,38,'Induced voltage — a de-energized line picks up potential from a parallel live one',{s:15,w:700,c:P.navy,a:'middle'})}
  <line x1="60" y1="120" x2="1120" y2="120" stroke="${P.danger}" stroke-width="7"/>
  ${T(70,108,'ENERGIZED CIRCUIT',{s:13,w:800,c:P.danger})}
  ${arr(900,120,1010,120,P.amber,3)}${T(955,108,'load current',{s:11,c:P.amberD,a:'middle'})}
  <line x1="60" y1="270" x2="1120" y2="270" stroke="${P.navy2}" stroke-width="7"/>
  ${T(70,300,'DE-ENERGIZED CIRCUIT (running parallel)',{s:13,w:800,c:P.navy2})}
  ${[240,420,600].map(x=>arr(x,134,x,256,P.steel,2)).join('')}
  ${T(420,200,'magnetic &amp; electrostatic coupling',{s:12,c:P.gray,a:'middle'})}
  ${lineworker2(815,270,0.64)}
  <line x1="848" y1="262" x2="848" y2="350" stroke="${P.green}" stroke-width="4"/><polygon points="836,350 860,350 848,368" fill="${P.green}"/>
  ${T(884,332,'ground at the WORK SITE',{s:12,w:700,c:P.green})}
  ${T(590,400,'“Dead” is not “grounded.” Bond &amp; ground at the work location to keep induced voltage off the worker.',{s:13,w:600,c:P.navy,a:'middle'})}`);

/* ============ 29. PHASING / VOLTAGE TEST ============ */
D.phasing=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qbg)" stroke="#d7e1ec" rx="16"/>
  ${T(320,38,'Verify voltage &amp; phase — and prove the tester works',{s:14,c:P.gray,a:'middle'})}
  <line x1="120" y1="110" x2="520" y2="110" stroke="${P.danger}" stroke-width="7"/>${T(130,100,'phase A',{s:12,c:P.danger})}
  <line x1="120" y1="205" x2="520" y2="205" stroke="${P.danger}" stroke-width="7"/>${T(130,236,'phase B',{s:12,c:P.danger})}
  <rect x="280" y="138" width="80" height="44" rx="6" fill="${P.navy}"/>${T(320,166,'V',{s:20,w:800,c:P.amber,a:'middle'})}
  <line x1="300" y1="138" x2="300" y2="113" stroke="${P.copper}" stroke-width="6"/>
  <line x1="340" y1="182" x2="340" y2="205" stroke="${P.copper}" stroke-width="6"/>
  ${T(420,158,'phasing /',{s:12,c:P.navy2})}${T(420,176,'voltage tester',{s:12,c:P.navy2})}
  ${T(320,300,'TEST THE TESTER',{s:18,w:800,c:P.danger,a:'middle'})}
  ${T(320,332,'Prove it on a known live source',{s:13,c:P.ink,a:'middle'})}
  ${T(320,352,'BEFORE and AFTER you test the line.',{s:13,c:P.ink,a:'middle'})}
  ${T(320,408,'A “no-voltage” reading from an unproven tester proves nothing.',{s:13,w:700,c:P.navy,a:'middle'})}`);

/* ============ 30. POLE-TOP RESCUE ============ */
D.rescue=()=>svg('640 470',`
  <rect width="640" height="470" fill="url(#qsky)" stroke="#cdd8e4" rx="16"/>
  ${T(320,38,'Pole-top rescue — fast, but never at the cost of a second victim',{s:14,c:P.gray,a:'middle'})}
  <path d="M 8 406 H 632 V 462 a8 8 0 0 1 -8 8 H 16 a8 8 0 0 1 -8 -8 Z" fill="url(#qground)"/>
  ${woodPole(300,72,452,30)}
  ${crossarm(300,120,230,18)}
  <line x1="60" y1="100" x2="580" y2="100" stroke="${P.green}" stroke-width="6" stroke-linecap="round"/>
  <line x1="60" y1="100" x2="580" y2="100" stroke="#ffffff" stroke-width="1.4" opacity="0.3" stroke-linecap="round"/>
  ${T(70,90,'de-energized / covered',{s:11,w:700,c:P.green})}
  <path d="M 338 138 L 372 138 L 372 322" stroke="#c79a5b" stroke-width="3.5" fill="none"/>
  ${T(388,238,'handline',{s:12,w:700,c:'#9c7536'})}
  <g transform="translate(286,202)">
    <line x1="-16" y1="-6" x2="18" y2="-6" stroke="#9c7536" stroke-width="4" stroke-linecap="round"/>
    <circle cx="0" cy="2" r="11" fill="#e8b489" stroke="${P.danger}" stroke-width="2.5"/>
    <path d="M 0 13 q -14 10 -12 44" stroke="${P.danger}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
    <line x1="-6" y1="26" x2="-22" y2="40" stroke="${P.danger}" stroke-width="4.5" stroke-linecap="round"/>
  </g>
  ${T(214,208,'injured worker',{s:12,w:700,c:P.danger,a:'end'})}
  ${lineworker2(470,406,0.92)}
  <rect x="512" y="360" width="46" height="32" rx="5" fill="url(#qred)"/>${T(535,381,'AED',{s:12,w:800,c:P.white,a:'middle'})}
  <path d="M 524 366 h10 M 529 361 v10" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  ${T(320,432,'Remove the source FIRST · lower the patient · CPR + AED — minutes matter',{s:13,w:700,c:P.navy,a:'middle'})}`);

/* ============ 31. INCIDENT ENERGY vs DISTANCE ============ */
D.arcenergy=()=>svg('1180 430',`
  ${T(590,36,'Incident energy: driven UP by fault current &amp; clearing time, DOWN by distance²',{s:15,w:700,c:P.navy,a:'middle'})}
  <line x1="130" y1="80" x2="130" y2="360" stroke="${P.gray}" stroke-width="2"/>
  <line x1="130" y1="360" x2="1080" y2="360" stroke="${P.gray}" stroke-width="2"/>
  ${T(130,390,'working distance from the arc →',{s:13,c:P.gray})}
  ${T(96,206,'cal/cm²',{s:13,c:P.gray,a:'middle'})}${T(96,224,'(energy)',{s:11,c:P.gray,a:'middle'})}
  <path d="M 162 108 C 320 300, 520 332, 1060 352" fill="none" stroke="${P.danger}" stroke-width="4.5" filter="url(#qsh)"/>
  ${T(214,118,'incident energy',{s:13,w:700,c:P.danger})}
  <line x1="130" y1="296" x2="1080" y2="296" stroke="${P.amberD}" stroke-width="2.5" stroke-dasharray="8 5"/>
  ${T(1072,288,'arc-flash boundary — 1.2 cal/cm² (onset of a 2nd-degree burn)',{s:12.5,w:700,c:P.amberD,a:'end'})}
  <line x1="430" y1="360" x2="430" y2="248" stroke="${P.navy2}" stroke-width="1.5" stroke-dasharray="4 4"/>
  ${worker(430,360,0.74,P.navy,true)}
  <circle cx="430" cy="248" r="6" fill="url(#qred)"/>
  ${T(452,244,'energy at the working distance sets the required PPE arc rating',{s:12.5,c:P.ink})}
  ${T(840,150,'Farther back = exponentially safer',{s:13,w:700,c:P.green,a:'middle'})}
  ${T(300,340,'closer in = far worse',{s:12,c:P.danger,a:'middle'})}`);

/* ============ 32. ARC-FLASH PPE CATEGORIES ============ */
D.ppecat=()=>svg('1180 430',`
  ${T(590,40,'Arc-flash PPE categories (NFPA 70E) — the arc rating must meet or exceed the incident energy',{s:15,w:700,c:P.navy,a:'middle'})}
  ${[['1','≥ 4',P.green,['AR shirt &amp; pants','Hard hat, safety glasses','Arc face shield + gloves']],
     ['2','≥ 8',P.navy2,['AR shirt &amp; pants','Arc-rated hood or','balaclava + face shield']],
     ['3','≥ 25',P.amberD,['AR flash-suit jacket','&amp; trousers','Arc-rated flash hood']],
     ['4','≥ 40',P.danger,['Heavy AR flash suit','Arc-rated flash hood','Full ensemble']]]
    .map(([c,cal,col,gear],i)=>{const x=70+i*272;return `
     <rect x="${x}" y="92" width="248" height="278" rx="14" fill="#ffffff" stroke="#d7e1ec" filter="url(#qsh)"/>
     <path d="M ${x} 106 a14 14 0 0 1 14 -14 h220 a14 14 0 0 1 14 14 v44 h-248 Z" fill="${col}"/>
     ${T(x+124,128,'CATEGORY '+c,{s:16,w:800,c:P.white,a:'middle'})}
     ${T(x+124,212,cal,{s:44,w:800,c:col,a:'middle'})}
     ${T(x+124,238,'cal/cm² minimum',{s:12,c:P.gray,a:'middle'})}
     <line x1="${x+22}" y1="256" x2="${x+226}" y2="256" stroke="#e6ecf3"/>
     ${gear.map((g,j)=>T(x+20,286+j*23,'• '+g,{s:11.5,c:P.ink})).join('')}`;}).join('')}`);

/* ============ 33. ARC-FLASH / SHOCK LABEL ============ */
D.arclabel=()=>svg('640 470',`
  ${T(320,32,'What an arc-flash &amp; shock label tells you',{s:14,c:P.gray,a:'middle'})}
  <rect x="118" y="58" width="404" height="372" rx="12" fill="#ffffff" stroke="${P.ink}" stroke-width="2.5" filter="url(#qsh)"/>
  <path d="M 118 70 a12 12 0 0 1 12 -12 h380 a12 12 0 0 1 12 12 v54 h-404 Z" fill="url(#qamber)"/>
  <polygon points="158,112 176,78 194,112" fill="#0a1830"/>${T(176,108,'!',{s:18,w:800,c:'#ffd24d',a:'middle'})}
  ${T(330,96,'WARNING',{s:25,w:800,c:'#0a1830',a:'middle'})}
  ${T(330,116,'Arc Flash &amp; Shock Hazard — Appropriate PPE Required',{s:11.5,w:700,c:'#0a1830',a:'middle'})}
  ${[['Nominal system voltage','12.47 kV'],['Arc-flash boundary','3 ft 6 in'],['Incident energy','8.4 cal/cm² @ 18 in'],['Required PPE category','CATEGORY 2'],['Minimum glove class','Class 2 — 17 kV'],['Limited approach (shock)','per NESC / 70E']]
    .map(([k,v],i)=>{const y=162+i*42;return `${T(140,y,k,{s:12.5,c:P.gray})}${T(500,y,v,{s:13,w:800,c:P.navy,a:'end'})}<line x1="140" y1="${y+13}" x2="500" y2="${y+13}" stroke="#eef2f7"/>`;}).join('')}
  ${T(320,452,'Illustrative values — the label on YOUR equipment governs',{s:11.5,c:P.gray,a:'middle',i:'italic'})}`);

/* ============ 34. EMERGENCY SCENE CONTROL ============ */
D.scenecontrol=()=>svg('1180 430',`
  ${T(590,34,'Emergency scene control — protect yourself, then the patient',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="40" y="300" width="1100" height="112" fill="#d9c4a3" rx="6"/>
  <line x1="40" y1="300" x2="1140" y2="300" stroke="${P.copper}" stroke-width="3"/>
  <rect x="180" y="80" width="22" height="222" rx="3" fill="url(#qcopper)"/>
  <path d="M 191 108 C 300 128, 362 282, 430 300" stroke="${P.danger}" stroke-width="6" fill="none"/>
  ${[28,74,124].map((r,i)=>`<ellipse cx="430" cy="300" rx="${r}" ry="${(r*0.3).toFixed(0)}" fill="none" stroke="${P.danger}" stroke-width="2" opacity="${(0.8-i*0.22).toFixed(2)}"/>`).join('')}
  <circle cx="430" cy="300" r="10" fill="url(#qred)"/>
  <g transform="translate(470,290)"><circle cx="0" cy="0" r="11" fill="${P.light}" stroke="${P.danger}" stroke-width="3"/><line x1="11" y1="0" x2="78" y2="0" stroke="${P.danger}" stroke-width="5" stroke-linecap="round"/><line x1="44" y1="0" x2="52" y2="-15" stroke="${P.danger}" stroke-width="4" stroke-linecap="round"/></g>
  ${T(520,248,'patient — do NOT touch until the source is removed',{s:12.5,w:700,c:P.danger})}
  <line x1="790" y1="300" x2="790" y2="172" stroke="${P.amberD}" stroke-width="3" stroke-dasharray="6 5"/>
  ${T(800,206,'keep back until',{s:12.5,w:700,c:P.amberD})}${T(800,224,'de-energized &amp; grounded',{s:12.5,w:700,c:P.amberD})}
  ${worker(910,300,0.95,P.navy,true)}
  ${T(910,362,'rescuer — calls for help, controls the scene',{s:12,c:P.gray,a:'middle'})}
  ${T(590,400,'A rescuer who becomes the second victim helps no one — de-energize / remove the source first.',{s:13.5,w:700,c:P.navy,a:'middle'})}`);

/* ============ 35. CPR + AED SEQUENCE ============ */
D.cpraed=()=>svg('1180 410',`
  ${T(590,38,'Cardiac arrest from contact — CPR + AED the moment the scene is safe',{s:15,w:700,c:P.navy,a:'middle'})}
  ${[['SCENE SAFE','Source removed first',P.navy],
     ['CALL','911 + AED, assign roles',P.navy2],
     ['COMPRESS','100–120/min · 2 in deep',P.danger],
     ['AED','Pads on, follow prompts',P.amberD],
     ['CONTINUE','Cycles until EMS arrives',P.green]]
    .map(([t,d,c],i)=>{const x=60+i*222;return `
      <circle cx="${x+70}" cy="172" r="46" fill="${c}" filter="url(#qsh)"/>${T(x+70,184,i+1,{s:34,w:800,c:P.white,a:'middle'})}
      ${T(x+70,252,t,{s:15,w:800,c:c,a:'middle'})}
      ${T(x+70,274,d,{s:11.5,c:P.gray,a:'middle'})}
      ${i<4?arr(x+120,172,x+196,172,P.steel,3):''}`;}).join('')}
  ${T(590,340,'Push hard, push fast, minimize interruptions. An AED can restart a coordinated rhythm — know where yours is.',{s:13,c:P.ink,a:'middle'})}`);

global.DIAGRAMS=D;
})(typeof window!=='undefined'?window:globalThis);
