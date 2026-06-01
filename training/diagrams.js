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

/* ---- string helpers ---- */
function arr(x1,y1,x2,y2,c,w){w=w||3;const a=Math.atan2(y2-y1,x2-x1),L=11,A=0.42;
  const bx=x2-L*0.55*Math.cos(a),by=y2-L*0.55*Math.sin(a);
  const p1x=x2-L*Math.cos(a-A),p1y=y2-L*Math.sin(a-A),p2x=x2-L*Math.cos(a+A),p2y=y2-L*Math.sin(a+A);
  return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`+
         `<polygon points="${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}" fill="${c}"/>`;}
function T(x,y,s,o){o=o||{};return `<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" `+
  `font-size="${o.s||15}" fill="${o.c||P.ink}" font-weight="${o.w||400}" `+
  `text-anchor="${o.a||'start'}" font-style="${o.i||'normal'}" letter-spacing="${o.ls||0}">${s}</text>`;}
function sine(x0,y0,wlen,amp,cycles,phase,c,sw,samples){
  samples=samples||120;let d='';for(let i=0;i<=samples;i++){const t=i/samples;
    const x=x0+t*wlen;const y=y0-amp*Math.sin(2*Math.PI*cycles*t+phase);d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';}
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${sw||3}" stroke-linejoin="round"/>`;}
function svg(vb,inner,extra){return `<svg viewBox="0 0 ${vb}" style="width:100%;height:auto;display:block" `+
  `xmlns="http://www.w3.org/2000/svg" ${extra||''}>${inner}</svg>`;}
function defs(id){return `<defs>
  <radialGradient id="${id}-g" cx="50%" cy="42%" r="65%"><stop offset="0%" stop-color="#15376a"/><stop offset="100%" stop-color="${P.navy}"/></radialGradient>
  </defs>`;}

/* a small lineworker glyph (head, torso, arms, legs) at (x,y) scale sc */
function worker(x,y,sc,c,hardhat){c=c||P.navy;sc=sc||1;const s=v=>v*sc;
  let g=`<g transform="translate(${x},${y})" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round">`;
  g+=`<circle cx="0" cy="${s(-46)}" r="${s(11)}" fill="${P.light}"/>`;
  if(hardhat){g+=`<path d="M ${s(-13)} ${s(-50)} A ${s(13)} ${s(13)} 0 0 1 ${s(13)} ${s(-50)} Z" fill="${P.amber}" stroke="${P.amberD}"/>`+
    `<rect x="${s(-15)}" y="${s(-51)}" width="${s(30)}" height="${s(3.5)}" rx="1.5" fill="${P.amber}" stroke="${P.amberD}"/>`;}
  g+=`<line x1="0" y1="${s(-35)}" x2="0" y2="${s(8)}"/>`;
  g+=`<line x1="0" y1="${s(8)}" x2="${s(-12)}" y2="${s(40)}"/><line x1="0" y1="${s(8)}" x2="${s(12)}" y2="${s(40)}"/>`;
  g+=`</g>`;return g;}

const D={};

/* ============ 1. ATOM / ELECTRON FLOW ============ */
D.atom=()=>svg('640 470', defs('at')+`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  <g transform="translate(220,230)">
    <ellipse rx="150" ry="58" fill="none" stroke="${P.steel}" stroke-width="2" opacity="0.7"/>
    <ellipse rx="150" ry="58" transform="rotate(60)" fill="none" stroke="${P.steel}" stroke-width="2" opacity="0.7"/>
    <ellipse rx="150" ry="58" transform="rotate(120)" fill="none" stroke="${P.steel}" stroke-width="2" opacity="0.7"/>
    <circle r="30" fill="${P.navy}"/>
    <circle cx="-9" cy="-6" r="9" fill="${P.danger}"/><circle cx="10" cy="-7" r="9" fill="${P.danger}"/>
    <circle cx="0" cy="9" r="9" fill="${P.sky}"/><circle cx="-12" cy="9" r="9" fill="${P.sky}"/>
    <circle cx="129" cy="29" r="9" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>
    <circle cx="-150" cy="0" r="9" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>
    <circle cx="44" cy="-65" r="9" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>
  </g>
  ${T(220,455,'A single atom: protons (+) &amp; neutrons in the nucleus, electrons orbiting',{s:13,c:P.gray,a:'middle'})}
  <g transform="translate(470,150)">
    ${T(0,-22,'FREE ELECTRON FLOW',{s:13,w:700,c:P.navy,a:'middle'})}
    ${[0,1,2,3].map(i=>`<circle cx="${-70+i*46}" cy="0" r="8" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>`).join('')}
    ${arr(-95,40,95,40,P.danger,3)}
    ${T(0,70,'Current = drifting charge',{s:13,c:P.danger,a:'middle',w:600})}
    ${T(0,150,'In a conductor, loosely-held',{s:13,c:P.ink,a:'middle'})}
    ${T(0,170,'outer electrons drift from',{s:13,c:P.ink,a:'middle'})}
    ${T(0,190,'atom to atom when pushed',{s:13,c:P.ink,a:'middle'})}
    ${T(0,210,'by a difference in charge.',{s:13,c:P.ink,a:'middle'})}
  </g>`);

/* ============ 2. CONDUCTOR vs INSULATOR ============ */
D.conductor=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,40,'Why some materials carry current and others stop it',{s:14,c:P.gray,a:'middle'})}
  <g transform="translate(40,90)">
    ${T(0,0,'CONDUCTOR',{s:17,w:800,c:P.green})}
    <rect x="0" y="18" width="560" height="80" rx="10" fill="#ffffff" stroke="${P.green}" stroke-width="3"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${40+i*68}" cy="58" r="9" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>`).join('')}
    ${arr(30,58,540,58,P.danger,3)}
    ${T(280,128,'Free electrons move easily → low resistance (copper, aluminum, steel, wet body)',{s:13,c:P.ink,a:'middle'})}
  </g>
  <g transform="translate(40,260)">
    ${T(0,0,'INSULATOR',{s:17,w:800,c:P.danger})}
    <rect x="0" y="18" width="560" height="80" rx="10" fill="#ffffff" stroke="${P.danger}" stroke-width="3"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${40+i*68}" cy="58" r="9" fill="${P.steel}"/>`).join('')}
    <g stroke="${P.danger}" stroke-width="4" stroke-linecap="round"><line x1="270" y1="40" x2="300" y2="76"/><line x1="300" y1="40" x2="270" y2="76"/></g>
    ${T(280,128,'Electrons are bound → high resistance (rubber, glass, porcelain, dry wood, air)',{s:13,c:P.ink,a:'middle'})}
  </g>`);

/* ============ 3. WATER ANALOGY (V, I, R) ============ */
D.water=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,36,'The plumbing analogy',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="70" y="90" width="500" height="260" rx="40" fill="none" stroke="${P.sky}" stroke-width="22" opacity="0.55"/>
  <circle cx="70" cy="220" r="42" fill="${P.navy}"/>${T(70,225,'PUMP',{s:13,w:700,c:P.white,a:'middle'})}
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
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  <g>
    ${T(160,40,'ONE wire = SAFE',{s:16,w:800,c:P.green,a:'middle'})}
    <line x1="20" y1="150" x2="300" y2="150" stroke="${P.navy}" stroke-width="6"/>
    <g transform="translate(160,150)"><ellipse cx="0" cy="-14" rx="22" ry="13" fill="${P.ink}"/><circle cx="18" cy="-22" r="8" fill="${P.ink}"/><polygon points="24,-24 38,-20 24,-16" fill="${P.amber}"/><line x1="-6" y1="-2" x2="-6" y2="6" stroke="${P.ink}" stroke-width="3"/><line x1="6" y1="-2" x2="6" y2="6" stroke="${P.ink}" stroke-width="3"/></g>
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
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,38,'Cover what you want — the rest is the formula',{s:14,c:P.gray,a:'middle'})}
  <g transform="translate(190,250)">
    <polygon points="0,-120 -130,90 130,90" fill="#ffffff" stroke="${P.navy}" stroke-width="3"/>
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
  <rect width="1180" height="430" fill="${P.light}" rx="14"/>
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
    ${sine(640,205,500,72,2.5,0,P.navy2,4)}
    <line x1="640" y1="133" x2="1140" y2="133" stroke="${P.danger}" stroke-width="1.5" stroke-dasharray="6 5"/>
    ${T(1146,137,'peak',{s:12,c:P.danger})}
    <line x1="640" y1="160" x2="1140" y2="160" stroke="${P.green}" stroke-width="1.5" stroke-dasharray="6 5"/>
    ${T(1146,164,'RMS',{s:12,c:P.green})}
    ${T(890,360,'Reverses 60×/sec (60 Hz) — the grid runs on AC',{s:14,c:P.ink,a:'middle'})}
    ${T(630,135,'+',{s:18,w:800,c:P.navy2,a:'end'})}${T(630,280,'–',{s:18,w:800,c:P.navy2,a:'end'})}
  </g>`);

/* ============ 7. THREE-PHASE ============ */
D.threephase=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="${P.light}" rx="14"/>
  ${T(590,42,'THREE-PHASE POWER — three waveforms 120° apart',{s:18,w:800,c:P.navy,a:'middle'})}
  <line x1="70" y1="90" x2="70" y2="330" stroke="${P.gray}" stroke-width="2"/>
  <line x1="70" y1="210" x2="1000" y2="210" stroke="${P.gray}" stroke-width="2" stroke-dasharray="4 4"/>
  ${sine(70,210,930,90,3,0,P.danger,4)}
  ${sine(70,210,930,90,3,-2*Math.PI/3,P.navy2,4)}
  ${sine(70,210,930,90,3,2*Math.PI/3,P.green,4)}
  <g>
    <rect x="1030" y="120" width="22" height="22" fill="${P.danger}"/>${T(1062,138,'Phase A',{s:15,w:700,c:P.ink})}
    <rect x="1030" y="165" width="22" height="22" fill="${P.navy2}"/>${T(1062,183,'Phase B',{s:15,w:700,c:P.ink})}
    <rect x="1030" y="210" width="22" height="22" fill="${P.green}"/>${T(1062,228,'Phase C',{s:15,w:700,c:P.ink})}
  </g>
  ${T(540,375,'Continuous, smooth power — the backbone of transmission, distribution &amp; large motors',{s:14,c:P.gray,a:'middle'})}`);

/* ============ 8. TRANSFORMER ============ */
D.transformer=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,40,'Stepping voltage up &amp; down by induction',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="285" y="110" width="70" height="240" fill="none" stroke="${P.gray}" stroke-width="10"/>
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
  <rect width="1180" height="430" fill="${P.light}" rx="14"/>
  ${T(590,40,'From generation to your service — and the voltage at each stage',{s:15,c:P.gray,a:'middle'})}
  <line x1="70" y1="200" x2="1110" y2="200" stroke="${P.steel}" stroke-width="3"/>
  ${[['GENERATION','~20 kV',95,P.navy],['STEP-UP','↑ 230–765 kV',285,P.amberD],
     ['TRANSMISSION','HV towers',475,P.navy2],['STEP-DOWN','↓ 4–35 kV',665,P.amberD],
     ['DISTRIBUTION','primary',855,P.navy2],['SERVICE','120/240 V',1045,P.green]]
    .map(([t,v,x,c],i)=>`
    <circle cx="${x}" cy="200" r="13" fill="${c}"/>
    <rect x="${x-78}" y="${i%2?248:92}" width="156" height="60" rx="9" fill="#ffffff" stroke="${c}" stroke-width="2.5"/>
    ${T(x, i%2?278:122, t,{s:14,w:800,c:c,a:'middle'})}
    ${T(x, i%2?298:142, v,{s:13,c:P.gray,a:'middle'})}
    <line x1="${x}" y1="200" x2="${x}" y2="${i%2?248:152}" stroke="${c}" stroke-width="2" stroke-dasharray="3 3"/>`).join('')}
  ${arr(1090,200,1108,200,P.steel,3)}
  ${T(590,400,'Transmit HIGH (low current, low loss) → distribute &amp; use LOW (safe for customers)',{s:14,w:700,c:P.navy,a:'middle'})}`);

/* ============ 10. CURRENT PATH THROUGH BODY ============ */
D.body=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,40,'Path matters — current across the chest stops the heart',{s:14,c:P.gray,a:'middle'})}
  <g transform="translate(320,250)" fill="${P.steel}" opacity="0.9">
    <circle cx="0" cy="-130" r="34"/>
    <path d="M -42 -86 Q 0 -100 42 -86 L 60 30 L 40 34 L 34 -40 L 30 120 L 8 120 L 0 0 L -8 120 L -30 120 L -34 -40 L -40 34 L -60 30 Z"/>
  </g>
  <g transform="translate(308,180)"><path d="M0 10 C -14 -8, -34 6, 0 34 C 34 6, 14 -8, 0 10 Z" fill="${P.danger}"/></g>
  <path d="M 255 150 Q 308 120 380 150" fill="none" stroke="${P.amber}" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round"/>
  ${arr(255,150,250,156,P.amber,4)}${arr(376,148,382,154,P.amber,4)}
  ${T(150,150,'CONTACT',{s:13,w:800,c:P.danger,a:'middle'})}${T(150,170,'energized',{s:12,c:P.gray,a:'middle'})}
  ${T(498,150,'2ND POINT',{s:13,w:800,c:P.danger,a:'middle'})}${T(498,170,'ground/phase',{s:12,c:P.gray,a:'middle'})}
  ${T(320,420,'Hand-to-hand or hand-to-foot routes current straight through the heart',{s:13,c:P.ink,a:'middle'})}
  ${T(320,442,'It is CURRENT — not voltage — that injures and kills',{s:14,w:700,c:P.danger,a:'middle'})}`);

/* ============ 11. SHOCK THRESHOLD LADDER ============ */
D.threshold=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
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
  <rect width="640" height="470" fill="${P.navyD}" rx="14"/>
  <rect x="70" y="250" width="150" height="160" rx="6" fill="${P.steel}" stroke="${P.gray}" stroke-width="3"/>
  ${T(145,440,'equipment / fault',{s:12,c:P.light,a:'middle'})}
  <g stroke="${P.amber}" stroke-width="3" fill="none" opacity="0.95">
    ${[-50,-25,0,25,50,75,100].map(a=>{const r=(a*Math.PI/180);
      return `<path d="M 220 300 L ${(250+Math.cos(r)*40).toFixed(0)} ${(300+Math.sin(r)*40).toFixed(0)} L ${(300+Math.cos(r)*90).toFixed(0)} ${(300+Math.sin(r)*90-20).toFixed(0)} L ${(360+Math.cos(r)*150).toFixed(0)} ${(300+Math.sin(r)*150).toFixed(0)}" />`;}).join('')}
  </g>
  <circle cx="220" cy="300" r="48" fill="${P.white}"/><circle cx="220" cy="300" r="30" fill="${P.amber}"/>
  <polygon points="220,250 232,295 270,300 232,308 220,355 208,308 170,300 208,295" fill="${P.white}"/>
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
  <rect width="1180" height="430" fill="${P.light}" rx="14"/>
  ${T(590,36,'A downed conductor energizes the ground in a voltage gradient',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="40" y="250" width="1100" height="150" fill="#d9c4a3" rx="6"/>
  <line x1="40" y1="250" x2="1140" y2="250" stroke="${P.copper}" stroke-width="3"/>
  <g>${[30,80,140,210,290].map((r,i)=>`<ellipse cx="250" cy="250" rx="${r}" ry="${(r*0.32).toFixed(0)}" fill="none" stroke="${P.danger}" stroke-width="2" opacity="${(0.9-i*0.15).toFixed(2)}"/>`).join('')}</g>
  <circle cx="250" cy="250" r="12" fill="${P.danger}"/>
  <path d="M 250 250 L 250 150 L 180 150" stroke="${P.danger}" stroke-width="4" fill="none"/>
  ${T(150,140,'downed line',{s:12,c:P.danger,a:'end'})}
  <path d="M 250 100 C 360 100, 430 230, 1120 245" fill="none" stroke="${P.navy2}" stroke-width="3"/>
  ${T(270,95,'Voltage vs distance',{s:13,w:700,c:P.navy2})}
  <g transform="translate(720,250)">
    ${worker(0,0,0.95,P.navy,true)}
    <line x1="-12" y1="38" x2="-12" y2="48" stroke="${P.danger}" stroke-width="4"/><line x1="11" y1="38" x2="11" y2="48" stroke="${P.danger}" stroke-width="4"/>
    ${T(0,-78,'STEP POTENTIAL',{s:13,w:800,c:P.danger,a:'middle'})}
    <line x1="-12" y1="60" x2="11" y2="60" stroke="${P.danger}" stroke-width="2"/>
    ${T(0,78,'V between feet',{s:12,c:P.gray,a:'middle'})}
  </g>
  ${arr(610,300,560,300,P.navy,3)}${arr(830,300,880,300,P.navy,3)}
  ${T(720,360,'SHUFFLE out — feet together, tiny steps. Keep the public back. Assume the ground is energized.',{s:14,w:700,c:P.navy,a:'middle'})}`);

/* ============ 14. MINIMUM APPROACH DISTANCE ============ */
D.mad=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,40,'The air gap voltage must not be allowed to jump',{s:14,c:P.gray,a:'middle'})}
  <circle cx="150" cy="240" r="26" fill="${P.danger}"/>${T(150,300,'ENERGIZED',{s:13,w:800,c:P.danger,a:'middle'})}${T(150,318,'conductor',{s:12,c:P.gray,a:'middle'})}
  <polyline points="176,235 220,215 250,255 300,230 340,248" fill="none" stroke="${P.amber}" stroke-width="3"/>
  <circle cx="150" cy="240" r="200" fill="none" stroke="${P.navy2}" stroke-width="2.5" stroke-dasharray="8 6"/>
  ${worker(440,290,1.05,P.navy,true)}
  ${arr(176,400,350,400,P.navy,3)}${arr(350,400,176,400,P.navy,3)}
  <line x1="176" y1="380" x2="176" y2="410" stroke="${P.navy}" stroke-width="2"/><line x1="350" y1="380" x2="350" y2="410" stroke="${P.navy}" stroke-width="2"/>
  ${T(263,428,'MINIMUM APPROACH DISTANCE',{s:13,w:800,c:P.navy,a:'middle'})}
  ${T(440,360,'Qualified worker',{s:12,c:P.gray,a:'middle'})}
  ${T(320,455,'Body, tools, boom, materials — everything conductive must stay outside the ring',{s:12.5,c:P.ink,a:'middle'})}`);

/* ============ 15. SECOND POINT OF CONTACT (hero) ============ */
D.secondpoint=()=>svg('1180 470',`
  <rect width="1180" height="470" fill="${P.light}" rx="14"/>
  ${T(590,38,'The circuit completes only when you touch a SECOND point at a different potential',{s:15,w:700,c:P.navy,a:'middle'})}
  <g>
    <rect x="40" y="70" width="520" height="370" rx="12" fill="#ffffff" stroke="${P.danger}" stroke-width="2.5"/>
    ${T(300,100,'UNPROTECTED — circuit through worker',{s:14,w:800,c:P.danger,a:'middle'})}
    <line x1="80" y1="150" x2="520" y2="150" stroke="${P.danger}" stroke-width="7"/>
    ${T(90,140,'energized phase',{s:12,c:P.danger})}
    <line x1="80" y1="360" x2="520" y2="360" stroke="${P.green}" stroke-width="7"/>
    ${T(90,385,'grounded neutral / structure',{s:12,c:P.green})}
    ${worker(300,360,1.25,P.navy,true)}
    <path d="M 300 150 L 300 305" stroke="${P.amber}" stroke-width="5" stroke-dasharray="2 8" stroke-linecap="round"/>
    ${arr(300,300,300,312,P.amber,4)}
    ${T(360,250,'current flows',{s:13,w:700,c:P.amberD})}${T(360,270,'THROUGH you',{s:13,w:700,c:P.amberD})}
    <circle cx="300" cy="150" r="9" fill="${P.danger}"/><circle cx="300" cy="360" r="9" fill="${P.green}"/>
  </g>
  <g>
    <rect x="620" y="70" width="520" height="370" rx="12" fill="#ffffff" stroke="${P.green}" stroke-width="2.5"/>
    ${T(880,100,'COVERED UP — no second point',{s:14,w:800,c:P.green,a:'middle'})}
    <line x1="660" y1="150" x2="1100" y2="150" stroke="${P.danger}" stroke-width="7"/>
    <rect x="760" y="140" width="240" height="20" rx="10" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>
    ${T(670,140,'line hose',{s:12,c:P.amberD})}
    <line x1="660" y1="360" x2="1100" y2="360" stroke="${P.green}" stroke-width="7"/>
    <rect x="800" y="350" width="160" height="20" rx="6" fill="${P.navy2}" opacity="0.85"/>
    ${T(670,385,'insulating cover-up',{s:12,c:P.navy2})}
    ${worker(880,360,1.25,P.navy,true)}
    <g stroke="${P.green}" stroke-width="5" fill="none"><path d="M 856 224 l 13 15 l 26 -32"/></g>
    ${T(905,234,'isolated from both',{s:13,w:700,c:P.green})}
    ${T(905,252,'→ safe',{s:13,w:700,c:P.green})}
  </g>`);

/* ============ 16. EQUIPOTENTIAL ZONE / GROUNDING ============ */
D.epz=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,40,'Bond everything to ONE potential — ride the voltage together',{s:14,c:P.gray,a:'middle'})}
  <line x1="60" y1="120" x2="580" y2="120" stroke="${P.navy}" stroke-width="7"/>${T(70,108,'de-energized conductor',{s:12,c:P.gray})}
  ${worker(320,330,1.1,P.navy,true)}
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
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,40,'Insulate every energized AND grounded part within reach',{s:14,c:P.gray,a:'middle'})}
  <rect x="300" y="90" width="40" height="350" rx="4" fill="${P.copper}"/>
  <rect x="120" y="170" width="400" height="26" rx="4" fill="#8a5a2b"/>
  ${[180,460].map(x=>`<rect x="${x-12}" y="140" width="24" height="34" rx="4" fill="${P.steel}"/>
     <path d="M ${x-20} 140 q ${20} -24 ${40} 0 Z" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>`).join('')}
  <line x1="40" y1="150" x2="600" y2="150" stroke="${P.danger}" stroke-width="7"/>
  <rect x="220" y="140" width="200" height="20" rx="10" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>
  <line x1="40" y1="300" x2="600" y2="300" stroke="${P.green}" stroke-width="6"/>
  <rect x="250" y="290" width="140" height="22" rx="6" fill="${P.navy2}" opacity="0.85"/>
  ${T(70,135,'line hose',{s:12,c:P.amberD})}
  ${T(208,128,'insulator hood',{s:12,c:P.amberD,a:'middle'})}
  ${T(320,335,'insulating blanket',{s:12,c:P.navy2,a:'middle'})}
  ${T(320,400,'Cover nearest hazard FIRST, work outward.',{s:13,w:700,c:P.navy,a:'middle'})}
  ${T(320,422,'Remove in REVERSE — last on, first off.',{s:13,c:P.ink,a:'middle'})}`);

/* ============ 18. GLOVE CLASSES ============ */
D.gloves=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="${P.light}" rx="14"/>
  ${T(590,42,'Rubber insulating glove classes (ASTM D120) — select AT or ABOVE your voltage',{s:15,w:700,c:P.navy,a:'middle'})}
  ${[['00','500 V','#E9D9B8',P.amberD],['0','1,000 V','#D4351A',P.white],['1','7,500 V','#ffffff',P.ink],
     ['2','17,000 V','#F5B100',P.ink],['3','26,500 V','#2E8B57',P.white],['4','36,000 V','#E2701A',P.white]]
    .map(([cl,v,fill,tc],i)=>{const x=70+i*182;return `
    <g transform="translate(${x},90)">
      <path d="M 30 40 q -18 -38 8 -52 q 10 14 18 8 l 0 -16 q 0 -10 12 -10 q 12 0 12 10 l 0 18 q 0 8 8 8 q 8 0 8 8 l 0 120 q 0 14 -14 14 l -56 0 q -14 0 -14 -14 Z"
        fill="${fill}" stroke="#9aa6b2" stroke-width="2"/>
      ${T(48,118,'CLASS',{s:11,w:700,c:tc,a:'middle'})}
      ${T(48,150,cl,{s:34,w:800,c:tc,a:'middle'})}
    </g>
    ${T(x+48,300,v,{s:18,w:800,c:P.navy,a:'middle'})}
    ${T(x+48,324,'max use',{s:11,c:P.gray,a:'middle'})}`;}).join('')}
  ${T(590,380,'Always worn with leather protectors • air-test &amp; inspect before every use • retest ≈ every 6 months',{s:13,c:P.ink,a:'middle'})}`);

/* ============ 19. HOT STICK / LIVE-LINE TOOL ============ */
D.hotstick=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,40,'Reach beyond the minimum approach distance — work through the tool',{s:14,c:P.gray,a:'middle'})}
  <circle cx="120" cy="190" r="22" fill="${P.danger}"/>${T(120,240,'energized',{s:12,c:P.danger,a:'middle'})}
  <circle cx="120" cy="190" r="150" fill="none" stroke="${P.navy2}" stroke-width="2" stroke-dasharray="8 6"/>
  ${worker(470,300,1.1,P.navy,true)}
  <line x1="455" y1="270" x2="142" y2="195" stroke="${P.amber}" stroke-width="9" stroke-linecap="round"/>
  <line x1="455" y1="270" x2="320" y2="238" stroke="${P.copper}" stroke-width="9" stroke-linecap="round"/>
  <circle cx="142" cy="195" r="9" fill="${P.navy}"/>
  ${T(300,300,'fiberglass insulating stick',{s:12,c:P.amberD,a:'middle'})}
  ${T(470,370,'worker stays back',{s:12,c:P.gray,a:'middle'})}
  ${T(320,440,'Keep it CLEAN &amp; DRY — contamination ruins the insulating surface',{s:13,c:P.ink,a:'middle'})}`);

/* ============ 20. PROTECTIVE GROUNDS ============ */
D.grounds=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,40,'Protective grounds — sized to carry fault current &amp; trip protection fast',{s:14,c:P.gray,a:'middle'})}
  ${[150,320,490].map((x,i)=>`<line x1="${x}" y1="90" x2="${x}" y2="120" stroke="${['#D4351A','#134074','#2E8B57'][i]}" stroke-width="7"/>
    <rect x="${x-14}" y="115" width="28" height="18" rx="4" fill="${P.gray}"/>`).join('')}
  ${T(150,80,'A',{s:14,w:800,c:P.danger,a:'middle'})}${T(320,80,'B',{s:14,w:800,c:P.navy2,a:'middle'})}${T(490,80,'C',{s:14,w:800,c:P.green,a:'middle'})}
  <path d="M 150 133 Q 200 200 300 250" stroke="${P.copper}" stroke-width="5" fill="none"/>
  <path d="M 320 133 Q 320 200 320 250" stroke="${P.copper}" stroke-width="5" fill="none"/>
  <path d="M 490 133 Q 440 200 340 250" stroke="${P.copper}" stroke-width="5" fill="none"/>
  <rect x="280" y="250" width="80" height="20" rx="5" fill="${P.navy}"/>${T(320,300,'cluster bar',{s:12,c:P.gray,a:'middle'})}
  <path d="M 320 270 L 320 360" stroke="${P.copper}" stroke-width="6"/>
  <polygon points="296,360 344,360 320,388" fill="${P.green}"/>
  ${[0,1,2].map(i=>`<line x1="${300+i*9}" y1="${392+i*6}" x2="${340-i*9}" y2="${392+i*6}" stroke="${P.green}" stroke-width="2"/>`).join('')}
  ${T(320,438,'Connect ground end FIRST, then the line ends — remove in REVERSE',{s:13,w:700,c:P.navy,a:'middle'})}`);

/* ============ 21. PPE / FR FIGURE ============ */
D.ppe=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,38,'Head-to-toe protection — the LAST layer of defense',{s:14,c:P.gray,a:'middle'})}
  <g transform="translate(300,250)">
    <path d="M -30 -110 A 30 30 0 0 1 30 -110 Z" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>
    <rect x="-34" y="-112" width="68" height="8" rx="3" fill="${P.amber}" stroke="${P.amberD}"/>
    <circle cx="0" cy="-92" r="20" fill="${P.light}" stroke="${P.steel}" stroke-width="2"/>
    <path d="M -22 -100 q 22 18 44 0 l 0 16 q -22 14 -44 0 Z" fill="${P.sky}" opacity="0.45"/>
    <path d="M -42 -70 Q 0 -84 42 -70 L 56 60 L 30 64 L 24 -30 L 20 110 L -20 110 L -24 -30 L -30 64 L -56 60 Z" fill="${P.navy2}"/>
    <rect x="44" y="56" width="22" height="34" rx="6" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>
    <rect x="-66" y="56" width="22" height="34" rx="6" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>
  </g>
  ${[['Class E hard hat',150],['Arc-rated face shield',210],['FR / arc-rated shirt (cal/cm²)',280],['Rubber gloves + leather protectors',330],['EH-rated boots',400]]
    .map(([t,y])=>T(465,y,t,{s:13,c:P.ink})).join('')}
  ${arr(360,150,460,150,P.steel,2)}${arr(355,210,460,210,P.steel,2)}${arr(345,280,460,280,P.steel,2)}
  ${arr(360,330,460,330,P.steel,2)}${arr(345,400,460,400,P.steel,2)}`);

/* ============ 22. HIERARCHY OF CONTROLS ============ */
D.hierarchy=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
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
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,40,'The job briefing aligns the whole crew before work starts',{s:14,c:P.gray,a:'middle'})}
  ${[[140,140],[500,140],[120,330],[520,330],[320,400]].map(([x,y])=>`<line x1="${x}" y1="${y-30}" x2="320" y2="235" stroke="${P.amber}" stroke-width="2" stroke-dasharray="3 4"/>`).join('')}
  <g transform="translate(320,235)">
    <rect x="-55" y="-70" width="110" height="140" rx="8" fill="#ffffff" stroke="${P.navy}" stroke-width="3"/>
    <rect x="-20" y="-82" width="40" height="20" rx="5" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>
    ${[-44,-28,-12,4,20,36,52].map((y,i)=>`<line x1="-40" y1="${y}" x2="${i%2?30:40}" y2="${y}" stroke="${P.steel}" stroke-width="3"/>`).join('')}
  </g>
  ${[[140,140],[500,140],[120,330],[520,330],[320,400]].map(([x,y])=>worker(x,y,0.62,P.navy,true)).join('')}
  ${T(320,452,'Hazards • procedures • controls • PPE • roles • rescue — and everyone can speak up',{s:13,w:600,c:P.navy,a:'middle'})}`);

/* ============ 24. LOTO / DE-ENERGIZE SEQUENCE ============ */
D.loto=()=>svg('1180 410',`
  <rect width="1180" height="410" fill="${P.light}" rx="14"/>
  ${T(590,42,'The verification sequence — never skip a step',{s:15,w:700,c:P.navy,a:'middle'})}
  ${[['IDENTIFY','right circuit &amp; section',P.navy],['OPEN','visible disconnect',P.navy2],
     ['LOCK &amp; TAG','each worker&rsquo;s lock',P.amberD],['TEST','prove it dead',P.danger],
     ['GROUND','equipotential zone',P.green]]
    .map(([t,d,c],i)=>{const x=70+i*222;return `
     <circle cx="${x+70}" cy="180" r="44" fill="${c}"/>${T(x+70,190,i+1,{s:34,w:800,c:P.white,a:'middle'})}
     ${T(x+70,258,t,{s:15,w:800,c:c,a:'middle'})}
     ${T(x+70,280,d,{s:12,c:P.gray,a:'middle'})}
     ${i<4?arr(x+118,180,x+196,180,P.steel,3):''}`;}).join('')}
  ${T(590,350,'&ldquo;Test your tester&rdquo; on a known source before AND after — treat every conductor as energized until proven dead',{s:13,c:P.ink,a:'middle'})}`);

/* ============ 25. RECLOSER / AUTO-RECLOSE ============ */
D.recloser=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="${P.light}" rx="14"/>
  ${T(590,38,'Reclosers automatically re-close — a “dead” line can come back live',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="50" y="150" width="120" height="74" rx="8" fill="${P.navy}"/>${T(110,193,'SOURCE',{s:13,w:800,c:P.white,a:'middle'})}
  <line x1="170" y1="187" x2="1110" y2="187" stroke="${P.steel}" stroke-width="4"/>
  <circle cx="300" cy="187" r="26" fill="#fff" stroke="${P.danger}" stroke-width="4"/>${T(300,195,'R',{s:22,w:800,c:P.danger,a:'middle'})}
  ${T(300,138,'RECLOSER',{s:12,w:800,c:P.danger,a:'middle'})}
  <line x1="640" y1="187" x2="640" y2="300" stroke="${P.steel}" stroke-width="3"/>
  <rect x="631" y="222" width="18" height="34" rx="3" fill="#fff" stroke="${P.amberD}" stroke-width="3"/>${T(666,246,'fuse',{s:12,c:P.amberD})}
  <polygon points="640,300 631,322 643,322 632,346" fill="${P.amber}" stroke="${P.amberD}" stroke-width="1"/>
  ${T(640,362,'fault / downed line',{s:12,c:P.danger,a:'middle'})}
  ${arr(1080,187,1108,187,P.steel,3)}
  ${[['TRIP',P.danger],['reclose',P.green],['TRIP',P.danger],['reclose',P.green],['LOCKOUT',P.navy]]
    .map(([t,c],i)=>`<rect x="${120+i*180}" y="388" width="150" height="30" rx="6" fill="${c}"/>${T(195+i*180,408,t,{s:13,w:800,c:P.white,a:'middle'})}${i<4?arr(272+i*180,403,298+i*180,403,P.gray,2):''}`).join('')}`);

/* ============ 26. INSULATED AERIAL DEVICE (BUCKET) ============ */
D.bucket=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,38,'The insulated aerial device keeps the boom — and you — isolated',{s:14,c:P.gray,a:'middle'})}
  <line x1="40" y1="92" x2="600" y2="92" stroke="${P.danger}" stroke-width="7"/>${T(50,82,'energized conductor',{s:12,c:P.danger})}
  <rect x="60" y="360" width="220" height="70" rx="8" fill="${P.navy}"/>
  <circle cx="110" cy="438" r="18" fill="#333"/><circle cx="230" cy="438" r="18" fill="#333"/>
  ${T(170,403,'utility truck',{s:12,w:700,c:P.white,a:'middle'})}
  <line x1="250" y1="362" x2="380" y2="250" stroke="${P.steel}" stroke-width="14" stroke-linecap="round"/>
  ${T(415,318,'lower boom',{s:12,c:P.gray})}
  <line x1="380" y1="250" x2="468" y2="132" stroke="${P.amber}" stroke-width="14" stroke-linecap="round"/>
  ${T(486,206,'insulated (dielectric)',{s:12,w:700,c:P.amberD})}${T(486,224,'upper boom',{s:12,c:P.amberD})}
  <rect x="448" y="110" width="62" height="46" rx="6" fill="#fff" stroke="${P.navy}" stroke-width="3"/>
  ${worker(479,122,0.5,P.navy,true)}
  ${T(320,455,'The dielectric boom section is an insulating gap — rubber-glove work proceeds in the bucket',{s:12.5,c:P.ink,a:'middle'})}`);

/* ============ 27. SWITCHING / CLEARANCE ONE-LINE ============ */
D.switching=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="${P.light}" rx="14"/>
  ${T(590,38,'A clearance: isolated on every side, locked, tagged, tested &amp; grounded',{s:15,w:700,c:P.navy,a:'middle'})}
  <rect x="40" y="170" width="100" height="60" rx="8" fill="${P.navy}"/>${T(90,206,'SOURCE',{s:12,w:800,c:P.white,a:'middle'})}
  <rect x="1040" y="170" width="100" height="60" rx="8" fill="${P.navy}"/>${T(1090,206,'SOURCE',{s:12,w:800,c:P.white,a:'middle'})}
  <line x1="140" y1="200" x2="360" y2="200" stroke="${P.steel}" stroke-width="4"/>
  <line x1="820" y1="200" x2="1040" y2="200" stroke="${P.steel}" stroke-width="4"/>
  ${[360,820].map(x=>`<circle cx="${x}" cy="200" r="5" fill="${P.navy}"/><circle cx="${x+90}" cy="200" r="5" fill="${P.navy}"/><line x1="${x}" y1="200" x2="${x+68}" y2="158" stroke="${P.danger}" stroke-width="4"/>
    <rect x="${x+32}" y="118" width="26" height="20" rx="3" fill="${P.amber}" stroke="${P.amberD}" stroke-width="2"/>${T(x+45,133,'L',{s:12,w:800,c:P.navy,a:'middle'})}
    ${T(x+45,108,'OPEN',{s:11,w:800,c:P.danger,a:'middle'})}`).join('')}
  <rect x="450" y="150" width="280" height="150" rx="10" fill="#fff" stroke="${P.green}" stroke-width="3" stroke-dasharray="7 5"/>
  <line x1="450" y1="200" x2="730" y2="200" stroke="${P.steel}" stroke-width="4"/>
  ${worker(590,252,0.78,P.navy,true)}
  ${T(590,172,'WORK ZONE',{s:13,w:800,c:P.green,a:'middle'})}
  ${[470,710].map(x=>`<line x1="${x}" y1="200" x2="${x}" y2="300" stroke="${P.green}" stroke-width="4"/><polygon points="${x-12},300 ${x+12},300 ${x},318" fill="${P.green}"/>`).join('')}
  ${T(590,340,'protective grounds',{s:12,c:P.green,a:'middle'})}
  ${T(590,400,'Open &amp; visible · locked &amp; tagged · tested dead · grounded — only the holder releases the clearance',{s:13,w:600,c:P.navy,a:'middle'})}`);

/* ============ 28. INDUCED VOLTAGE ============ */
D.induced=()=>svg('1180 430',`
  <rect width="1180" height="430" fill="${P.light}" rx="14"/>
  ${T(590,38,'Induced voltage — a de-energized line picks up potential from a parallel live one',{s:15,w:700,c:P.navy,a:'middle'})}
  <line x1="60" y1="120" x2="1120" y2="120" stroke="${P.danger}" stroke-width="7"/>
  ${T(70,108,'ENERGIZED CIRCUIT',{s:13,w:800,c:P.danger})}
  ${arr(900,120,1010,120,P.amber,3)}${T(955,108,'load current',{s:11,c:P.amberD,a:'middle'})}
  <line x1="60" y1="270" x2="1120" y2="270" stroke="${P.navy2}" stroke-width="7"/>
  ${T(70,300,'DE-ENERGIZED CIRCUIT (running parallel)',{s:13,w:800,c:P.navy2})}
  ${[240,420,600].map(x=>arr(x,134,x,256,P.steel,2)).join('')}
  ${T(420,200,'magnetic &amp; electrostatic coupling',{s:12,c:P.gray,a:'middle'})}
  ${worker(820,270,0.78,P.navy,true)}
  <line x1="858" y1="270" x2="858" y2="348" stroke="${P.green}" stroke-width="4"/><polygon points="846,348 870,348 858,366" fill="${P.green}"/>
  ${T(900,330,'ground at the WORK SITE',{s:12,w:700,c:P.green})}
  ${T(590,400,'“Dead” is not “grounded.” Bond &amp; ground at the work location to keep induced voltage off the worker.',{s:13,w:600,c:P.navy,a:'middle'})}`);

/* ============ 29. PHASING / VOLTAGE TEST ============ */
D.phasing=()=>svg('640 470',`
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
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
  <rect width="640" height="470" fill="${P.light}" rx="14"/>
  ${T(320,38,'Pole-top rescue — fast, but never at the cost of a second victim',{s:14,c:P.gray,a:'middle'})}
  <rect x="300" y="70" width="34" height="380" rx="4" fill="${P.copper}"/>
  <rect x="200" y="120" width="240" height="20" rx="4" fill="#8a5a2b"/>
  <line x1="60" y1="110" x2="580" y2="110" stroke="${P.green}" stroke-width="6"/>${T(70,100,'de-energized / covered',{s:11,c:P.green})}
  <g transform="translate(282,200)"><circle cx="0" cy="0" r="11" fill="${P.light}" stroke="${P.danger}" stroke-width="3"/><line x1="0" y1="11" x2="-15" y2="44" stroke="${P.danger}" stroke-width="4" stroke-linecap="round"/><line x1="-15" y1="44" x2="3" y2="60" stroke="${P.danger}" stroke-width="4" stroke-linecap="round"/></g>
  ${T(206,205,'injured',{s:12,w:700,c:P.danger,a:'end'})}
  <path d="M 320 130 L 362 130 L 362 300" stroke="${P.amber}" stroke-width="3" fill="none"/>
  ${T(400,212,'handline',{s:12,c:P.amberD})}
  ${worker(470,382,0.9,P.navy,true)}
  <rect x="502" y="346" width="42" height="30" rx="4" fill="${P.danger}"/>${T(523,366,'AED',{s:11,w:800,c:P.white,a:'middle'})}
  ${T(320,434,'Remove the source FIRST · lower the patient · CPR + AED — minutes matter',{s:13,w:700,c:P.navy,a:'middle'})}`);

global.DIAGRAMS=D;
})(typeof window!=='undefined'?window:globalThis);
