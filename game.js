import * as THREE from 'three';

// ---------- data (palettes, colours, records kept from Добрый Дракончик 3D) ----------
const STORE = 'kapitan-briz-3d-v1';
const NAMES = ['Солнечная набережная','Старая гавань','Радужный порт','Маячная горка','Яблоневая слобода'];
const HOUSE_COLORS = ['#FFB6C1','#FFD700','#ADD8E6','#FFA07A','#98FB98'];
const PALS = [
  {top:'#6ec8ee',mid:'#e7f7ff',hill:'#8ed36a',grass:'#62b84a',sun:'#ffe56a'},
  {top:'#f2b56a',mid:'#ffe7c4',hill:'#86c864',grass:'#5aaa42',sun:'#ffb03a'},
  {top:'#8ec8f5',mid:'#e4f3ff',hill:'#7dccb0',grass:'#4eae78',sun:'#fff1a8'},
  {top:'#b9d4f5',mid:'#f3f7ff',hill:'#9bce8a',grass:'#6eb85a',sun:'#fff6d0'},
  {top:'#f6c1d4',mid:'#fff0f5',hill:'#8ed07a',grass:'#63b84e',sun:'#ffe08a'}];
const TH = [
  {n:'night',a:['Звёздная','Лунная','Ночная'],top:'#1f2a5a',mid:'#4a5a9a',hill:'#3f7a5a',grass:'#2f6a48',sun:'#f4f1ff'},
  {n:'winter',a:['Снежная','Морозная','Зимняя'],top:'#9fc4e8',mid:'#f2f8ff',hill:'#e6f0f7',grass:'#cfe0ea',sun:'#fff7e6'},
  {n:'autumn',a:['Осенняя','Листопадная','Рыжая'],top:'#9cc3d8',mid:'#fbeee0',hill:'#d0a060',grass:'#b07a3e',sun:'#ffd2a0'},
  {n:'sunset',a:['Закатная','Вечерняя','Розовая'],top:'#7a5aa8',mid:'#ffb3a0',hill:'#6aa86a',grass:'#4e8e52',sun:'#ff9a7a'},
  {n:'spring',a:['Весенняя','Цветочная','Росистая'],top:'#8fd0f0',mid:'#f0fbff',hill:'#9ad88a',grass:'#6cc060',sun:'#fff0d0'},
  {n:'mist',a:['Туманная','Жемчужная','Тихая'],top:'#b8c4d8',mid:'#eef0f6',hill:'#8fb8a0',grass:'#6a9e80',sun:'#ffffff'}];
const NN = ['набережная','гавань','пристань','слобода','площадь','улица'];
function rng(seed){let t=seed>>>0;return()=>{t|=0;t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);e=e+Math.imul(e^e>>>7,61|e)^e;return((e^e>>>14)>>>0)/4294967296}}
function shade(hex,d){const n=parseInt(hex.slice(1),16),c=v=>Math.max(0,Math.min(255,v+d));return '#'+[c(n>>16&255),c(n>>8&255),c(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function meadow(f){
  if(f<=5) return {name:NAMES[f-1],kind:'classic'+(f-1),pal:PALS[f-1]};
  const k=f-6,t=TH[k%TH.length],r=rng(f*7919+3),j=x=>shade(x,Math.round((r()-.5)*28)),c=Math.floor(k/108);
  return {name:t.a[Math.floor(k/6)%3]+' '+NN[Math.floor(k/18)%6]+(c>0?' '+(c+1):''),kind:t.n,pal:{top:j(t.top),mid:j(t.mid),hill:j(t.hill),grass:j(t.grass),sun:t.sun}};
}
function load(){const d={version:1,bestRounds:0,totalGifts:0,muted:false,stars:0,owned:['skin0'],skin:0,up:{blast:0,hp:0}};try{const v=JSON.parse(localStorage.getItem(STORE)||'null');return v&&v.version===1?{...d,...v}:d}catch{return d}}
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify({version:1,bestRounds:S.best,totalGifts:S.total,muted:S.muted,stars:S.stars,owned:[...S.owned],skin:S.skin,up:S.up}))}catch{}};

// ---------- audio (port of p()) ----------
function audio(){let e=null,g=null,muted=false;
  function init(){if(e)return;const A=window.AudioContext||window.webkitAudioContext;if(!A)return;e=new A({latencyHint:'interactive'});g=e.createGain();g.gain.value=muted?0:.22;g.connect(e.destination)}
  function tone(f,d,type,v,to,delay=0){if(!e||!g||muted)return;const t=e.currentTime+delay,o=e.createOscillator(),a=e.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(40,f),t);to&&o.frequency.exponentialRampToValueAtTime(Math.max(40,to),t+d);a.gain.setValueAtTime(1e-4,t);a.gain.exponentialRampToValueAtTime(Math.max(1e-4,v),t+.012);a.gain.exponentialRampToValueAtTime(1e-4,t+d);o.connect(a);a.connect(g);o.start(t);o.stop(t+d+.03)}
  return{unlock(){init();e&&e.state==='suspended'&&e.resume()},setMuted(m){muted=m;e&&g&&g.gain.setTargetAtTime(m?0:.22,e.currentTime,.03)},
    tap(){tone(620,.07,'sine',.07)},toss(){tone(420,.14,'sine',.06,760)},
    deliver(){const k=.94+Math.random()*.12;tone(523*k,.12,'sine',.11);tone(784*k,.2,'triangle',.09,0,.05)},
    win(){[523,659,784,1046].forEach((f,i)=>tone(f,.28,'triangle',.1,0,i*.11))},
    fire(){tone(520,.18,'sawtooth',.05,1500);tone(180,.2,'sine',.08,90)},grab(){tone(300,.12,'square',.04,520)},throw(){tone(700,.22,'triangle',.07,200)},thud(){tone(120,.16,'sine',.12,60)},poof(){tone(900,.14,'sine',.1,260);tone(1400,.1,'triangle',.06,0,.05);tone(620,.12,'sine',.05,1100,.1)},
    bonk(){tone(330,.2,'sine',.08,170)},catch(){tone(523,.1,'sine',.07,880)}}}
const snd=audio();

// ---------- renderer / lights ----------
const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(1.5,devicePixelRatio||1));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(55,1,.3,700);
const hemi=new THREE.HemisphereLight(0xdfefff,0x6a7a5a,1.1);scene.add(hemi);
const sunLight=new THREE.DirectionalLight(0xfff2dd,2.4);sunLight.castShadow=true;
sunLight.shadow.mapSize.set(1024,1024);Object.assign(sunLight.shadow.camera,{left:-55,right:55,top:55,bottom:-55,near:1,far:220});
sunLight.shadow.bias=-.0006;sunLight.shadow.normalBias=.04;scene.add(sunLight,sunLight.target);
const MC=new Map();
const M=(c,o)=>{const k=c+(o?JSON.stringify(o):'');if(!MC.has(k))MC.set(k,new THREE.MeshStandardMaterial({color:c,roughness:.85,metalness:0,...(o||{})}));return MC.get(k)};
const sphere=new THREE.SphereGeometry(1,20,14), box=new THREE.BoxGeometry(1,1,1), cone=new THREE.ConeGeometry(1,1,16), cyl=new THREE.CylinderGeometry(1,1,1,14), cone4=new THREE.ConeGeometry(1,1,4);
const SHARED=new Set([sphere,box,cone,cyl,cone4]);
function mesh(g,c,sx=1,sy=1,sz=1,x=0,y=0,z=0,shadow=true){const m=new THREE.Mesh(g,typeof c==='string'||typeof c==='number'?M(c):c);m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;return m}
const W=72, D=40;
const rot=(m,x=0,y=0)=>{m.rotation.set(x,y,0);return m};

// ---------- facade texture (window grid, lit windows for night) ----------
const FT=(()=>{const cw=32,chh=32,cols=4,rows=8,a=document.createElement('canvas'),b=document.createElement('canvas');a.width=b.width=cols*cw;a.height=b.height=rows*chh;
  const x=a.getContext('2d'),y=b.getContext('2d');x.fillStyle='#ffffff';x.fillRect(0,0,a.width,a.height);y.fillStyle='#000';y.fillRect(0,0,b.width,b.height);
  const r=rng(42);
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const px=i*cw+8,py=j*chh+6;
    x.fillStyle='#e6e1d8';x.fillRect(px-2,py+20,20,3); // sill
    const g=x.createLinearGradient(0,py,0,py+19);g.addColorStop(0,'#5d7488');g.addColorStop(1,'#2c3a48');x.fillStyle=g;x.fillRect(px,py,16,19);
    x.fillStyle='#d8d2c8';x.fillRect(px+7,py,2,19);x.fillRect(px,py+8,16,2);
    if(r()<.42){const c=['#ffd890','#ffe9b8','#ffc070'][Math.floor(r()*3)];y.fillStyle=c;y.fillRect(px,py,16,19);y.fillStyle='#3a2a10';y.fillRect(px+7,py,2,19)}}
  const mk=cv=>{const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t};
  return{map:mk(a),emi:mk(b),tw:8.8,th:24}})();
let night=false;
function facadeMat(col){const k='F'+col+night;if(!MC.has(k))MC.set(k,new THREE.MeshStandardMaterial({color:col,map:FT.map,roughness:.9,emissiveMap:night?FT.emi:null,emissive:night?'#ffffff':'#000000',emissiveIntensity:night?1.2:0}));return MC.get(k)}
function uvBox(geo,w,h,d,r){const uv=geo.attributes.uv,u0=Math.floor(r()*4)/4,v0=Math.floor(r()*8)/8;
  for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;
    if(f===2||f===3){uv.setXY(i,.01,.01);continue}
    const fw=f<2?d:w;uv.setXY(i,u0+uv.getX(i)*fw/FT.tw,v0+uv.getY(i)*h/FT.th)}uv.needsUpdate=true}

// ---------- hero: Капитан Бриз ----------
const GOLD='#ffd27a',SKIN='#f1c6a0';
const SKINS=[
  {name:'Бриз',d:'морской синий, коралловый плащ',suit:'#1f5f8b',suit2:'#163f5e',cape:'#ff6b5a',gold:'#ffd27a',price:0},
  {name:'Классика',d:'синий костюм, красный плащ',suit:'#2456c8',suit2:'#18307a',cape:'#d8202a',gold:'#f2f2f2',price:20},
  {name:'Изумруд',d:'зелёный с серебром',suit:'#1f8a5a',suit2:'#145a3c',cape:'#c8ccd2',gold:'#e0e6ea',price:30},
  {name:'Полночь',d:'тёмный, фиолетовый плащ, неон',suit:'#2a2438',suit2:'#141020',cape:'#7a5ab8',gold:'#4ad0ff',price:35},
  {name:'Заря',d:'белый с оранжевым',suit:'#f4efe6',suit2:'#c8b8a8',cape:'#ff8a3a',gold:'#d94a3a',price:40}];
const POWERS=[
  {id:'ice',key:'1',ico:'❄️',name:'Ледяное дыхание',short:'Лёд',d:'заморозка злодеев перед камерой на 4 с',price:30,cd:7},
  {id:'laser',key:'2',ico:'🔴',name:'Лазерный взгляд',short:'Лазер',d:'луч туда, куда смотрит камера, 1,4 с',price:45,cd:6,dur:1.4},
  {id:'speed',key:'3',ico:'💨',name:'Суперскорость',short:'Скорость',d:'вдвое быстрее 5 с, таран злодеев',price:25,cd:11,dur:5},
  {id:'shield',key:'4',ico:'🛡️',name:'Щит',short:'Щит',d:'6 с неуязвимости, отталкивает злодеев и отражает снаряды',price:35,cd:13,dur:6}];
const UPS=[{id:'blast',ico:'⚡',name:'Сила удара',d:'+1 к урону удара',prices:[20,35,50]},{id:'hp',ico:'❤️',name:'Здоровье',d:'+25 к силам героя',prices:[20,35,50]}];
function makeHero(sk=SKINS[0]){const SUIT=sk.suit,SUIT2=sk.suit2,CAPE=sk.cape,GOLD=sk.gold;
  const g=new THREE.Group(),body=new THREE.Group();g.add(body);
  const cap=(r,l)=>new THREE.CapsuleGeometry(r,l,6,12);
  body.add(mesh(cap(.45,.8),SUIT,1,1,.85,0,0,0));
  body.add(mesh(sphere,SUIT,.5,.32,.4,0,.42,0));
  body.add(mesh(cyl,GOLD,.47,.13,.4,0,-.42,0));                        // belt
  body.add(rot(mesh(cyl,GOLD,.27,.05,.27,0,.22,.36),Math.PI/2)); // emblem disc
  const bolt=new THREE.Shape();[[.05,.2],[-.1,-.02],[0,-.02],[-.06,-.2],[.11,.04],[.01,.04],[.07,.2]].forEach(([x,y],i)=>i?bolt.lineTo(x,y):bolt.moveTo(x,y));
  const bm=mesh(new THREE.ExtrudeGeometry(bolt,{depth:.03,bevelEnabled:false}),CAPE,1,1,1,0,.22,.385);body.add(bm);
  body.add(mesh(sphere,SKIN,.32,.35,.32,0,1.0,0));                        // head
  body.add(mesh(sphere,'#3a2a20',.34,.24,.34,0,1.18,-.03));               // hair
  const fr=mesh(cone,'#3a2a20',.12,.3,.1,.05,1.3,.22);fr.rotation.x=.9;fr.rotation.z=-.4;body.add(fr);
  body.add(mesh(cyl,SUIT2,.335,.13,.335,0,1.05,0));                       // mask band
  for(const s of[-1,1]){body.add(mesh(sphere,'#ffffff',.09,.06,.04,.12*s,1.05,.31));
    const tl=mesh(cone,SUIT2,.06,.3,.04,.33*s,1.06,-.12);tl.rotation.z=s*1.8;body.add(tl)}           // mask tails
  body.add(mesh(sphere,'#c98a6a',.08,.03,.03,0,.88,.3));                  // smile
  const arms=[];
  for(const s of[-1,1]){const piv=new THREE.Group();piv.position.set(.58*s,.42,0);
    piv.add(mesh(cap(.13,.55),SUIT,1,1,1,0,-.38,0));piv.add(mesh(sphere,GOLD,.17,.17,.17,0,-.8,0));piv.add(mesh(cyl,GOLD,.15,.18,.15,0,-.62,0));
    body.add(piv);arms.push({piv,s})}
  const legs=[];
  for(const s of[-1,1]){const piv=new THREE.Group();piv.position.set(.22*s,-.5,0);
    piv.add(mesh(cap(.17,.6),SUIT,1,1,1,0,-.45,0));piv.add(mesh(cap(.19,.25),SUIT2,1,1,1.1,0,-.95,.04));piv.add(mesh(cyl,GOLD,.2,.08,.2,0,-.78,0));
    body.add(piv);legs.push({piv,s})}
  // cape: segmented plane, animated per frame
  const cg=new THREE.PlaneGeometry(1.25,2.3,6,12);cg.translate(0,-1.15,0);
  const cape=new THREE.Mesh(cg,new THREE.MeshStandardMaterial({color:CAPE,side:THREE.DoubleSide,roughness:.7}));cape.castShadow=true;cape.position.set(0,.6,-.38);body.add(cape);
  cape.userData.base=cg.attributes.position.array.slice();
  body.add(mesh(cyl,GOLD,.08,.06,.08,.42,.58,-.2));body.add(mesh(cyl,GOLD,.08,.06,.08,-.42,.58,-.2));
  const gift=makeGift(.8);gift.position.set(-.75,-.1,.35);body.add(gift);
  g.scale.setScalar(1.25);
  g.userData={body,arms,legs,cape,gift};return g}
function makeGift(s=1){const g=new THREE.Group();
  g.add(mesh(box,'#fffdf8',s,s*.8,s));
  g.add(mesh(box,'#ff7a45',s*.2,s*.82,s*1.02));g.add(mesh(box,'#ff7a45',s*1.02,s*.82,s*.2));
  g.add(mesh(sphere,'#ff7a45',s*.25,s*.15,s*.18,-s*.18,s*.48,0));g.add(mesh(sphere,'#ff7a45',s*.25,s*.15,s*.18,s*.18,s*.48,0));return g}

// ---------- witch (from original) ----------
function makeWitch(){const g=new THREE.Group();
  const stick=mesh(cyl,'#8a5a3c',.1,4,.1,0,0,0);stick.rotation.x=Math.PI/2;g.add(stick);
  const br=mesh(cone,'#e8b86a',.55,1.2,.55,0,0,-2.3);br.rotation.x=Math.PI/2;g.add(br);
  g.add(mesh(cone,'#9b7fd4',.7,1.4,.7,0,.6,0));
  g.add(mesh(sphere,'#ff9a6a',.5,.55,.45,0,1.5,-.15));
  g.add(mesh(sphere,'#ffd7b5',.48,.48,.48,0,1.55,.05));
  for(const s of[-1,1]){g.add(mesh(sphere,'#243228',.07,.08,.04,.17*s,1.62,.5));g.add(mesh(sphere,'#ff7a8a',.1,.06,.03,.28*s,1.45,.46))}
  g.add(mesh(cyl,'#7a5ab8',.8,.08,.8,0,1.95,0));
  const hat=mesh(cone,'#7a5ab8',.45,1.2,.45,0,2.55,-.1);hat.rotation.x=-.25;g.add(hat);
  g.add(mesh(cyl,'#ffb6c1',.47,.14,.47,0,2.1,0));
  g.add(mesh(sphere,'#5a4590',.18,.12,.3,0,.0,.6));
  g.scale.setScalar(1.1);return g}

// ---------- HP bars: camera-facing sprites (canvas), green→red ----------
function makeBar(numeric,w=2.6){const cv=document.createElement('canvas');cv.width=160;cv.height=numeric?62:22;const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));sp.scale.set(w,w*cv.height/160,1);sp.renderOrder=6;scene.add(sp);let lk='';
  return{sp,set(hp,max){const k=Math.ceil(hp)+'/'+max;if(k===lk)return;lk=k;const x=cv.getContext('2d');const f=Math.max(0,Math.min(1,hp/max)),y0=numeric?40:0;x.clearRect(0,0,160,cv.height);
    if(numeric){x.font='bold 32px Nunito, sans-serif';x.textAlign='center';x.lineWidth=5;x.strokeStyle='#243228';x.fillStyle='#ffffff';const t=Math.ceil(Math.max(0,hp))+' / '+max;x.strokeText(t,80,30);x.fillText(t,80,30)}
    x.fillStyle='#243228';x.fillRect(0,y0,160,22);x.fillStyle=`hsl(${Math.round(120*f)},75%,48%)`;x.fillRect(3,y0+3,154*f,16);x.fillStyle='#ffffff55';x.fillRect(3,y0+3,154*f,5);tex.needsUpdate=true},
    dispose(){scene.remove(sp);sp.material.map.dispose();sp.material.dispose()}}}
function makeDrone(){const g=new THREE.Group();g.add(mesh(box,'#2f3a44',1.4,.5,1.4));g.add(mesh(sphere,M('#ff3a3a',{emissive:'#ff2020',emissiveIntensity:1.5}),.25,.2,.2,0,-.1,.72,false));
  for(const sx of[-1,1])for(const sz of[-1,1]){g.add(mesh(box,'#4a5560',.9,.1,.12,sx*.6,.15,sz*.6));const r=mesh(cyl,'#c8ccd2',.55,.04,.55,sx*1,.3,sz*1);r.userData.rotor=1;g.add(r)}
  g.scale.setScalar(1.3);return g}
const VIL={witch:{hp:2,dmg:15,h:3.8,num:false},drone:{hp:3,dmg:10,h:2,num:false},boss:{hp:14,dmg:25,h:7.5,num:true}};
function makeVillain(kind){let g;if(kind==='lex')g=makeLex();else if(kind==='mozg')g=makeMozg();else if(kind==='grom')g=makeGrom();else if(kind==='drone')g=makeDrone();else{g=makeWitch();if(kind==='boss'){g.scale.setScalar(2.3);const cr=mesh(cone,GOLD,.35,.5,.35,0,3.25,-.2);g.add(cr)}}
  const ice=new THREE.Mesh(sphere,new THREE.MeshStandardMaterial({color:'#bfeaff',transparent:true,opacity:.55,roughness:.1}));ice.scale.set(1.3,1.8,1.3);ice.position.y=1;ice.visible=false;g.add(ice);
  const d=VIL[kind];return{ice,frozen:0,g,kind,hp:d.hp,max:d.hp,dmg:d.dmg,bh:d.h,hr:{boss:4.5,lex:6,mozg:6.5,grom:7}[kind]||2.8,sh:2+Math.random()*3,bar:makeBar(d.num,{boss:4.5,lex:7,mozg:7,grom:7}[kind]||2.4)}}

// ---------- delivery house (original 5 colours) ----------
function makeHouse(color){const g=new THREE.Group();
  g.add(mesh(box,color,3.2,3,3.2,0,1.5,0));
  const roof=mesh(new THREE.ConeGeometry(2.7,2,4),shade(color,-48),1,1,1,0,4,0);roof.rotation.y=Math.PI/4;g.add(roof);
  g.add(mesh(box,shade(color,-28),.5,1.2,.5,.8,4.3,.3));
  g.add(mesh(box,'#6b4636',.8,1.4,.1,0,.7,1.61));
  const winM=new THREE.MeshStandardMaterial({color:'#e7f7ff',emissive:'#000000'});
  for(const x of[-.9,.9])g.add(mesh(box,winM,.6,.6,.1,x,2.1,1.61));
  const beacon=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,30,16,1,true),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide}));beacon.position.y=18;g.add(beacon);
  const gift=makeGift(1);gift.position.y=6.2;g.add(gift);
  g.scale.setScalar(1.5);
  g.userData={winM,gift,beacon};return g}

// ---------- grabbable props ----------
const CARC=['#d94a3a','#2f6fb0','#f2f2ee','#2a2f36','#e8b84a','#4a9a7a','#8a5ab0','#c8ccd2'];
function makeProp(kind,r,type){const g=new THREE.Group();let half=.5,rad=1,mass=1,extra={};
  if(kind==='car'){const cb=buildCar(g,type||CTYPES[Math.floor(r()*CTYPES.length)],r);half=cb.half;rad=cb.rad;mass=cb.mass;extra={wheels:cb.wheels,wr:cb.wr,type}}
  else if(kind==='oldcar'){const c=CARC[Math.floor(r()*CARC.length)];
    g.add(mesh(box,M(c,{roughness:.35,metalness:.3}),4.2,1,1.9,0,-.05,0));g.add(mesh(box,M('#2b3c4e',{roughness:.15,metalness:.4}),2.3,.75,1.75,-.2,.8,0));
    g.add(mesh(box,M(c,{roughness:.35,metalness:.3}),2.2,.08,1.7,-.2,1.2,0));
    for(const sx of[-1.35,1.35])for(const sz of[-.9,.9]){const w=mesh(cyl,'#1c1c1c',.42,.3,.42,sx,-.55,sz);w.rotation.x=Math.PI/2;g.add(w)}
    for(const sz of[-.6,.6]){g.add(mesh(box,M('#fff6d0',{emissive:'#fff0b0',emissiveIntensity:night?1.5:.2}),.05,.2,.35,2.1,.05,sz,false));g.add(mesh(box,M('#c0202a',{emissive:'#a01010',emissiveIntensity:.6}),.05,.18,.3,-2.1,.05,sz,false))}
    half=.95;rad=2.2;mass=2}
  else if(kind==='bench'){g.add(mesh(box,'#8a5a3c',2.4,.12,.7,0,0,0));g.add(mesh(box,'#8a5a3c',2.4,.6,.1,0,.35,-.33));
    for(const x of[-1,1])g.add(mesh(box,'#2a2f36',.1,.5,.7,x,-.3,0));half=.55;rad=1.3}
  else if(kind==='tree'){g.add(mesh(cyl,'#6b4a34',.22,3,.22,0,0,0));const c=['#4e9a4a','#5aa850','#3f8a48'][Math.floor(r()*3)];
    g.add(mesh(new THREE.IcosahedronGeometry(1.6,1),c,1,1.15,1,0,2.4,0));g.add(mesh(new THREE.IcosahedronGeometry(1.1,1),shade(c,15),1,1,1,.6,3.3,.3));half=1.5;rad=1.6;mass=1.5}
  else if(kind==='lamp'){g.add(mesh(cyl,'#2f3a44',.09,5.2,.09,0,0,0));g.add(mesh(box,'#2f3a44',.9,.08,.08,.4,2.5,0));
    g.add(mesh(sphere,M('#fff4d0',{emissive:'#ffe0a0',emissiveIntensity:night?3:.15}),.25,.18,.25,.8,2.38,0,false));g.add(mesh(cyl,'#2f3a44',.25,.2,.25,0,-2.5,0));
    g.add(mesh(new THREE.CylinderGeometry(.15,.45,.35,8),'#2f3a44',1,1,1,.8,2.58,0));g.add(mesh(cyl,'#3a4652',.16,.6,.16,0,-2.1,0));g.add(mesh(sphere,'#3a4652',.14,.14,.14,0,2.62,0));half=2.6;rad=.6}
  else if(kind==='crate'){const c=['#b07a4a','#c08a50','#3a6a8a','#c0503a'][Math.floor(r()*4)];g.add(mesh(box,c,1.6,1.6,1.6));g.add(mesh(box,shade(c,-30),1.65,.2,1.65,0,.6,0));g.add(mesh(box,shade(c,-30),1.65,.2,1.65,0,-.6,0));half=.8;rad=1.1}
  else if(kind==='kiosk'){g.add(mesh(box,'#3a8a9a',2,2.2,2));g.add(mesh(box,'#fff4e0',2.3,.25,2.3,0,1.2,0));g.add(mesh(box,'#ffd27a',.06,.9,1.6,1.01,.2,0,false));half=1.1;rad=1.5;mass=1.5}
  else if(kind==='barrel'){g.add(mesh(cyl,'#4a7ab0',.6,1.3,.6));g.add(mesh(cyl,'#2a2f36',.62,.1,.62,0,.4,0));g.add(mesh(cyl,'#2a2f36',.62,.1,.62,0,-.4,0));half=.65;rad=.7}
  return {g,kind:kind==='oldcar'?'car':kind,half,rad,mass,...extra,v:new THREE.Vector3(),av:new THREE.Vector3(),rest:true,held:false,hitCd:0}}

// ---------- state ----------
const saved=load();
const S={roamT:20,roamLvl:0,walk:false,bossFight:false,bossDone:false,stolen:0,rescued:0,stars:saved.stars|0,owned:new Set(saved.owned||['skin0']),skin:saved.skin|0,up:{blast:0,hp:0,...(saved.up||{})},cd:{},act:{},prev:'menu',hp:100,tired:0,hurtT:9,phase:'menu',round:1,score:0,total:saved.totalGifts,best:saved.bestRounds,muted:saved.muted,chased:0,wind:0};
snd.setMuted(S.muted);
let world=new THREE.Group();scene.add(world);
let hero=makeHero(SKINS[saved.skin|0]||SKINS[0]);scene.add(hero);
const maxHp=()=>100+25*S.up.hp;
function setSkin(i){S.skin=i;hero.remove(shieldM);scene.remove(hero);hero.traverse(o=>o.geometry&&!SHARED.has(o.geometry)&&o.geometry.dispose());hero=makeHero(SKINS[i]);scene.add(hero);hero.add(shieldM);save()}
function earn(n,pos){S.stars+=n;floater('+'+n+'⭐',pos.clone().add(new THREE.Vector3(0,1.5,0)),'#d8a020');save();ui()}
const P=new THREE.Vector3(0,8,-20);let yaw=0,vel=new THREE.Vector3(),tilt=0,turnRate=0;
let houses=[],tosses=[],witches=[],blasts=[],particles=[],drops=null,carry=true,fcd=0,waveT=2,waveN=0,clearT=0,allDone=false,weather=null,time=0,hintOn=true;
let solids=[],props=[],held=null,dragProp=null,boats=[],beam=null,candidate=null;
let camYaw=Math.PI,camPitch=.42,camDist=20,camIdle=0;
const keys=new Set();
const heroBar=makeBar(true,3);
function hudHP(){$('hp').textContent=S.tired>0?'устал':Math.ceil(S.hp);const f=S.hp/maxHp();$('hpFill').style.width=f*100+'%';$('hpFill').style.background=`hsl(${Math.round(120*f)},70%,45%)`;
  $('tired').hidden=!(S.tired>0);if(S.tired>0)$('tired').textContent=`Капитан отдыхает… ${Math.ceil(S.tired)}`}
const marker=new THREE.Mesh(new THREE.RingGeometry(1.4,1.9,32),new THREE.MeshBasicMaterial({color:'#ffd27a',transparent:true,opacity:.8,side:THREE.DoubleSide,depthTest:false}));marker.rotation.x=-Math.PI/2;marker.renderOrder=5;scene.add(marker);

function waterAt(x,z){return z<-30||(Math.abs(x+15)<4&&z<29&&!(Math.abs(z+22)<4.5||Math.abs(z-6)<4.5))}
function heightAt(x,z,pad=0){let h=waterAt(x,z)?-1.2:0;for(const s of solids)if(x>s.x0-pad&&x<s.x1+pad&&z>s.z0-pad&&z<s.z1+pad&&s.h>h)h=s.h;return h}
function solid(x,z,w,d,h){solids.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,h})}

function skyTexture(p){const cv=document.createElement('canvas');cv.width=4;cv.height=256;const x=cv.getContext('2d'),gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,p.top);gr.addColorStop(.7,p.mid);gr.addColorStop(1,shade(p.mid,-10));x.fillStyle=gr;x.fillRect(0,0,4,256);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t}

// ---------- city: Приморск — harbour, canal with bridges, lighthouse, hilly old town ----------
const PASTEL=['#e8d6b8','#f0c9a8','#d9e4ea','#f2e2c4','#e0b8a0','#c8d8c0','#f4efe6','#d8c0d8','#e9cfa0','#bcd0e0'];
const XB=[[-70,-49],[-41,-19],[-11,11],[19,41],[49,70]], ZB=[[-17,1],[11,29]];
function addBuilding(x,z,w,d,h,col,base,pitched,r,face=-1){const n0=world.children.length;DET&&addDetails(x,z,w,d,h,base,pitched,r,face);
  const geo=new THREE.BoxGeometry(w,h,d);uvBox(geo,w,h,d,r);const m=new THREE.Mesh(geo,facadeMat(col));m.position.set(x,base+h/2,z);m.castShadow=m.receiveShadow=true;world.add(m);
  let top=base+h;
  if(pitched){const rf=mesh(cone4,'#b8583a',w*.75,2.4,d*.75,x,top+1.2,z);rf.rotation.y=Math.PI/4;world.add(rf);top+=2.4}
  else{world.add(mesh(box,'#8a8580',w+.3,.4,d+.3,x,top+.2,z));if(r()<.5)world.add(mesh(box,'#a8a49c',w*.3,1.2,d*.3,x+(r()-.5)*w*.4,top+.8,z+(r()-.5)*d*.4));top+=.4}
  if(!pitched&&h<14)world.add(mesh(box,M('#d0503a'),w+.4,.12,1.4,x,base+3.4,z+d/2+.6));   // awning
  solid(x,z,w,d,top);const ms=world.children.slice(n0);blds.push({meshes:ms,y0:ms.map(m=>m.position.y),s:solids[solids.length-1],c:new THREE.Vector3(x,base,z),lift:0})}
function addProp(kind,x,z,r,ry=0){const p=makeProp(kind,r);p.g.position.set(x,heightAt(x,z)+p.half,z);p.g.rotation.y=ry;world.add(p.g);props.push(p);return p}
let DET=null;
function addDetails(x,z,w,d,h,base,pitched,r,face){const fz=z+face*(d/2),top=base+h;
  DET.door.push([x+(r()-.5)*w*.4,base+1.1,fz+face*.06,1.2,2.2,.12]);DET.step.push([x,base+.1,fz+face*.5,2,.2,1]);
  DET.corn.push([x,top-.15,z,w+.5,.35,d+.5]);for(let y=base+6;y<top-2;y+=6)DET.ledge.push([x,y,z,w+.25,.18,d+.25]);
  if(base===0&&h<18){DET.base.push([x,1.6,z,w+.08,3.2,d+.08]);if(r()<.7){DET.sign.push([x,3.5,fz+face*.12,Math.min(4,w*.6),.6,.12]);DET.signC.push(['#d94a3a','#2f6fb0','#4a9a7a','#e8b84a','#7a5ab8'][Math.floor(r()*5)])}}
  if(h>8&&r()<.55)for(let y=base+6;y<top-1;y+=3){DET.bal.push([x,y,fz+face*.5,2.4,.14,1]);DET.rail.push([x,y+.45,fz+face*.98,2.4,.7,.05])}
  if(!pitched){const n=1+Math.floor(r()*3);for(let i=0;i<n;i++)DET.ac.push([x+(r()-.5)*w*.6,top+.75,z+(r()-.5)*d*.6,.9,.6,.9]);
    if(r()<.35){const tx=x+(r()-.5)*w*.4,tz=z+(r()-.5)*d*.4;DET.tank.push([tx,top+1.9,tz,.75,1.4,.75]);for(const s of[-1,1])DET.leg.push([tx+s*.4,top+.8,tz,.07,1,.07])}
    if(r()<.4)DET.ant.push([x+w*.3,top+2,z-d*.3,.05,3.2,.05])}}
function cityDetails(r){const D=DET;
  instanced(box,M('#5a3a2a'),D.door);instanced(box,M('#bdb4a6'),D.step,false);instanced(box,M('#ece4d4'),D.corn);instanced(box,M('#e4dccc'),D.ledge,false);
  instanced(box,M('#9a8c7c'),D.base);const si=instanced(box,M('#ffffff',{emissive:'#ffffff',emissiveIntensity:night?.35:0}),D.sign,false);D.signC.forEach((c,i)=>si.setColorAt(i,new THREE.Color(c)));if(si.instanceColor)si.instanceColor.needsUpdate=true;
  instanced(box,M('#d8d2c6'),D.bal);instanced(box,M('#4a5560',{metalness:.4,roughness:.5}),D.rail,false);instanced(box,M('#c8ccd2',{metalness:.3}),D.ac);
  instanced(cyl,M('#8a6a4a'),D.tank);instanced(cyl,M('#5a5a5a'),D.leg,false);instanced(cyl,M('#3a3a3a'),D.ant,false);
  // traffic lights at intersections
  const pole=[],head=[],lamps=[],lc=[];for(const x of TR_V)for(const z of TR_H)for(const [sx,sz] of[[1,1],[-1,-1]]){const px=x+sx*5.2,pz=z+sz*5.2;pole.push([px,2.2,pz,.12,4.4,.12]);head.push([px,4.6,pz,.45,1.3,.45]);
    for(let k=0;k<3;k++){lamps.push([px+sx*.24,5.0-k*.4,pz,.04,.14,.14]);lamps.push([px,5.0-k*.4,pz+sz*.24,.14,.14,.04]);const on=(k===0)===(sx>0);lc.push(on?['#ff3a3a','#ffd040','#3aff6a'][sx>0?0:2]:'#333333',on?['#ff3a3a','#ffd040','#3aff6a'][sx>0?2:0]:'#333333')}}
  instanced(cyl,M('#2f3a44'),pole);instanced(box,M('#243228'),head);const li=instanced(box,M('#ffffff',{emissive:'#ffffff',emissiveIntensity:.6}),lamps,false);lc.forEach((c,i)=>li.setColorAt(i,new THREE.Color(c)));if(li.instanceColor)li.instanceColor.needsUpdate=true;
  // bus stops
  for(const [x,z,ry] of[[-30,-26.9,0],[30,10.9,Math.PI],[5,1.1,0]]){const b=new THREE.Group();b.add(mesh(box,'#2f3a44',3.8,.12,1.5,0,2.5,0));b.add(mesh(box,M('#bfeaff',{transparent:true,opacity:.35,roughness:.1}),3.6,2.2,.06,0,1.3,-.68,false));
    for(const s of[-1,1])b.add(mesh(box,'#2f3a44',.1,2.5,.1,s*1.8,1.25,-.65));b.add(mesh(box,'#8a5a3c',2.6,.1,.5,0,.5,-.4));b.add(mesh(cyl,'#2f3a44',.06,3,.06,2.3,1.5,.4));b.add(mesh(box,'#2f6fb0',.7,.7,.05,2.3,2.9,.4));
    b.position.set(x,0,z);b.rotation.y=ry;world.add(b)}
  // solid lane edge lines
  const ed=[];for(const z of TR_H)for(const s of[-1,1])ed.push([0,.05,z+s*3.6,150,.02,.14]);for(const x of TR_V)for(const s of[-1,1])ed.push([x+s*3.6,.055,6,.14,.02,64]);instanced(box,M('#f4f1e8',{roughness:.6}),ed,false);
  DET=null}
function instanced(geo,mat,list,cast=true){const im=new THREE.InstancedMesh(geo,mat,Math.max(1,list.length));im.count=list.length;const o=new THREE.Object3D();
  list.forEach((t,i)=>{o.position.set(t[0],t[1],t[2]);o.scale.set(t[3],t[4]??t[3],t[5]??t[3]);o.rotation.set(0,t[6]||0,0);o.updateMatrix();im.setMatrixAt(i,o.matrix)});im.castShadow=cast;im.receiveShadow=true;world.add(im);return im}

function buildRound(){
  scene.remove(world);world.traverse(o=>{o.geometry&&!SHARED.has(o.geometry)&&o.geometry.dispose()});
  for(const[k,m]of MC)if(k[0]==='F'){m.dispose();MC.delete(k)}
  world=new THREE.Group();scene.add(world);solids=[];blds=[];DET={door:[],step:[],corn:[],ledge:[],base:[],sign:[],signC:[],bal:[],rail:[],ac:[],tank:[],leg:[],ant:[]};roamer=null;props=[];held=null;dragProp=null;boats=[];
  const md=meadow(S.round),p=md.pal,r=rng(S.round*9973+17);night=md.kind==='night';
  scene.background=skyTexture(p);scene.fog=new THREE.Fog(new THREE.Color(p.mid),90,300);
  hemi.color.set(p.top).lerp(new THREE.Color('#ffffff'),.5);hemi.groundColor=new THREE.Color(p.grass).lerp(new THREE.Color('#8a8070'),.5);
  hemi.intensity=night?.45:1.0;sunLight.color.set(night?'#b8c4ff':p.sun).lerp(new THREE.Color('#ffffff'),.4);sunLight.intensity=night?.45:2.4;
  renderer.toneMappingExposure=night?1.2:1.05;
  // ground, sea, quay
  world.add(rot(mesh(new THREE.PlaneGeometry(500,300),'#c9c1b3',1,1,1,0,0,120,false),-Math.PI/2));
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(700,400),new THREE.MeshStandardMaterial({color:new THREE.Color('#2a6f8f').lerp(new THREE.Color(p.top),.35),roughness:.18,metalness:.25,transparent:true,opacity:.95}));
  sea.rotation.x=-Math.PI/2;sea.position.set(0,-1.1,-230);sea.receiveShadow=true;world.add(sea);
  world.add(rot(mesh(new THREE.PlaneGeometry(700,400),'#1d4a5a',1,1,1,0,-3,-230,false),-Math.PI/2));
  world.add(mesh(box,'#9a9488',300,2.2,1.2,0,-.9,-30.4));
  // canal
  const canal=new THREE.Mesh(new THREE.PlaneGeometry(8,59),sea.material);canal.rotation.x=-Math.PI/2;canal.position.set(-15,-1.1,-.5);world.add(canal);
  world.add(mesh(box,'#1d4a5a',8,.1,59,-15,-2.5,-.5,false));
  for(const s of[-1,1])world.add(mesh(box,'#a89e8c',.6,1.4,59,-15+s*4.3,-.4,-.5));
  // roads (asphalt, curbs, dashed markings, zebras)
  const asph=M('#3b3e44',{roughness:.95}),dash=[],zeb=[];
  const roadH=[-22,6,34],roadV=[-45,15,45];
  for(const z of roadH){const rd=mesh(new THREE.PlaneGeometry(150,8),asph,1,1,1,0,.03,z,false);rd.rotation.x=-Math.PI/2;world.add(rd);
    for(const s of[-1,1])world.add(mesh(box,'#d8d2c6',150,.25,1.6,0,.12,z+s*4.8,false));
    for(let x=-72;x<74;x+=6)if(Math.abs(x+15)>5)dash.push([x,.05,z,2.2,.02,.18])}
  for(const x of roadV){const rd=mesh(new THREE.PlaneGeometry(8,64),asph,1,1,1,x,.035,6,false);rd.rotation.x=-Math.PI/2;world.add(rd);
    for(let z=-24;z<38;z+=6)dash.push([x,.055,z,.18,.02,2.2]);
    for(const z of roadH)for(let k=-3;k<=3;k++){zeb.push([x+k*1.1,.06,z-5.8,.55,.02,2.2]);zeb.push([x-5.8,.06,z+k*1.1,2.2,.02,.55])}}
  instanced(box,M('#f4f1e8',{roughness:.6}),dash,false);instanced(box,M('#f4f1e8',{roughness:.6}),zeb,false);
  // bridges over the canal
  for(const z of[-22,6]){world.add(mesh(box,'#b8ad98',10,.6,9,-15,.0,z));
    const arch=mesh(new THREE.TorusGeometry(3.6,.5,8,24,Math.PI),'#a89e8c',1,1,1,-15,-1.2,z);world.add(arch);
    for(const s of[-1,1]){world.add(mesh(box,'#a89e8c',10,.9,.35,-15,.7,z+s*4.3));for(let k=-2;k<=2;k++)world.add(mesh(cyl,'#8a8070',.18,1.1,.18,-15+k*2.2,.6,z+s*4.3))}}
  // lots
  const lots=[];XB.forEach((bx,i)=>ZB.forEach((bz,j)=>{const bw=bx[1]-bx[0],n=Math.max(2,Math.round(bw/7.5)),lw=bw/n;
    for(let k=0;k<n;k++)for(let rr=0;rr<2;rr++)lots.push({x:bx[0]+lw*(k+.5),z:bz[0]+4.5+rr*9,w:lw-1.2,d:8,blk:i*2+j,base:0,front:rr===0})}));
  const oldLots=[];for(const [z,base] of[[43,2.5],[50,2.5],[60,5],[68,5],[76,5]])for(let x=-68;x<=68;x+=7.2)if(!(Math.abs(x)<7&&z>55))oldLots.push({x:x+(r()-.5)*1.2,z,w:5.4+r(),d:6,base,old:true});
  // parks: one lower-town block + harbour square
  const park=S.round===1?5:Math.floor(r()*10);
  // targets
  let tl=[];
  if(S.round===1){const pick=[[0,0],[1,0],[3,0],[4,1],[2,1]];tl=pick.map(([b,j])=>lots.filter(l=>l.blk===b*2+j&&l.front)[1]||lots.find(l=>l.blk===b*2+j))}
  else{const pool=[...lots.filter(l=>l.blk!==park),...oldLots.filter((l,i)=>i%3===0)];const used=new Set();
    while(tl.length<5){const l=pool[Math.floor(r()*pool.length)];const key=l.blk??('o'+l.z);if(used.has(key)&&tl.length<4)continue;if(tl.includes(l))continue;used.add(key);tl.push(l)}}
  // terraces (old town on the hill)
  const stone='#c9b79a';
  world.add(mesh(box,stone,160,2.5,44,0,1.25,60));solid(0,60,160,44,2.5);
  world.add(mesh(box,shade(stone,-12),160,2.5,26,0,3.75,69));solids.push({x0:-80,x1:80,z0:56,z1:82,h:5});
  for(const [z,y] of[[38.2,2.6],[56.2,5.1]])world.add(mesh(box,'#e8e0cc',160,.5,.6,0,y,z));
  for(let i=0;i<14;i++){world.add(mesh(sphere,p.hill,40+r()*30,18+r()*14,22,(i-7)*30+r()*10,-4,100+r()*30))}
  for(const s of[-1,1])for(let i=0;i<4;i++)world.add(mesh(sphere,p.hill,22+r()*10,8+r()*6,26,s*(100+r()*20),-2,(i-1)*30+r()*10));
  const grassM=M(p.grass,{roughness:1});
  // building fill
  const treesI=[];
  for(const l of lots){if(tl.includes(l))continue;
    if(l.blk===park){continue}
    const h=l.front&&l.blk%2===0?5+r()*9:6+r()*r()*22,col=PASTEL[Math.floor(r()*PASTEL.length)];
    addBuilding(l.x,l.z,l.w,l.d,h,col,0,h<8&&r()<.6,r,l.front?-1:1)}
  for(const l of oldLots){if(tl.includes(l))continue;addBuilding(l.x,l.z,l.w,l.d-.6,3.5+r()*4.5,PASTEL[Math.floor(r()*PASTEL.length)],l.base,true,r)}
  // church tower on top of the hill
  addBuilding(0,66,5,5,20,'#efe6d4',5,false,r);world.add(rot(mesh(cone4,'#5a7a8a',4.2,7,4.2,0,33.5,66),0,Math.PI/4));solid(0,66,5,5,37);
  world.add(mesh(sphere,M('#ffd27a',{metalness:.6,roughness:.3}),.5,.5,.5,0,37.3,66));
  // park block
  {const bx=XB[park>>1],bz=ZB[park&1],cx=(bx[0]+bx[1])/2,cz=(bz[0]+bz[1])/2,w=bx[1]-bx[0],d=bz[1]-bz[0];
    const g=mesh(new THREE.PlaneGeometry(w,d),grassM,1,1,1,cx,.06,cz,false);g.rotation.x=-Math.PI/2;world.add(g);
    const path=mesh(new THREE.PlaneGeometry(w,1.6),'#d8c8a8',1,1,1,cx,.08,cz,false);path.rotation.x=-Math.PI/2;world.add(path);
    world.add(mesh(cyl,'#b8ad98',2.6,.7,2.6,cx,.35,cz));world.add(mesh(cyl,M('#6ab0d0',{roughness:.2}),2.2,.1,2.2,cx,.72,cz,false));world.add(mesh(cyl,'#e8e0cc',.3,1.8,.3,cx,1.4,cz));
    solid(cx,cz,5,5,.7);
    for(let i=0;i<14;i++){const x=bx[0]+2+r()*(w-4),z=bz[0]+2+r()*(d-4);if(Math.abs(z-cz)<2.5)continue;treesI.push([x,0,z,1+r()*.5])}
    for(let i=0;i<3;i++)addProp('tree',bx[0]+3+i*(w-6)/2,cz+5.5,r);
    for(const s of[-1,1])addProp('bench',cx+s*6,cz+(s>0?-1.6:1.6),r,s>0?0:Math.PI)}
  // harbour: pier, crates, boats, lighthouse
  world.add(mesh(box,'#8a6a4a',6,.5,34,25,.0,-47));solid(25,-47,6,34,.25);
  for(let z=-62;z<=-32;z+=5)for(const s of[-1,1])world.add(mesh(cyl,'#5a4434',.25,3,.25,25+s*2.8,-1.4,z));
  world.add(mesh(box,'#8a6a4a',30,.5,5,-28,.0,-33.5));solid(-28,-33.5,30,5,.25);  // boardwalk
  for(let i=0;i<5;i++){const b=new THREE.Group(),c=['#ffffff','#ff6b5a','#2f6fb0','#ffd27a','#4a9a7a'][i];
    b.add(mesh(box,c,2.4,1,6.5,0,0,0));b.add(rot(mesh(cone,c,1.2,1.6,.5,0,0,4),Math.PI/2));b.add(mesh(box,'#d8c8a8',2.2,.1,6,0,.52,0));
    b.add(mesh(cyl,'#e8e0cc',.08,7,.08,0,4,0));const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(0,6);sh.lineTo(3.2,.3);
    const sail=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshStandardMaterial({color:'#fffdf8',side:THREE.DoubleSide}));sail.position.set(.05,.8,0);sail.rotation.y=-Math.PI/2;sail.castShadow=true;b.add(sail);
    const x=i<3?18+(i%2)*14:40+(i-3)*10,z=-38-i*6;b.position.set(x,-.7,z);b.rotation.y=(r()-.5)*.3;world.add(b);boats.push({b,ph:r()*6})}
  {const lx=-52,lz=-50;world.add(mesh(new THREE.DodecahedronGeometry(6,1),'#8a8580',1,.6,1,lx,-1,lz));
    for(let i=0;i<5;i++)world.add(mesh(new THREE.CylinderGeometry(1.6-i*.15,1.75-i*.15,3,16),i%2?'#d94a3a':'#f4f1e8',1,1,1,lx,2.5+i*3,lz));
    world.add(mesh(cyl,'#2f3a44',1.5,.3,1.5,lx,17.2,lz));world.add(mesh(cyl,M('#fff4d0',{emissive:'#ffe0a0',emissiveIntensity:night?3:.4}),1,1.6,1,lx,18.2,lz));
    world.add(mesh(cone,'#d94a3a',1.4,1.6,1.4,lx,19.8,lz));solid(lx,lz,4,4,20.6);
    beam=new THREE.Mesh(new THREE.ConeGeometry(4,40,20,1,true),new THREE.MeshBasicMaterial({color:'#fff4c0',transparent:true,opacity:night?.22:.06,depthWrite:false,side:THREE.DoubleSide,fog:false}));
    beam.geometry.translate(0,-20,0);beam.geometry.rotateZ(Math.PI/2);beam.position.set(lx,18.2,lz);world.add(beam)}
  // static instanced trees (hill parks, promenade)
  for(let i=0;i<70;i++){const x=(r()-.5)*170,z=84+r()*30;treesI.push([x,heightAt(x,z),z,1+r()*.8])}
  for(const s of[-1,1])for(let i=0;i<25;i++){const x=s*(78+r()*25),z=-25+r()*100;treesI.push([x,0,z,1+r()*.8])}
  instanced(cyl,M('#6b4a34'),treesI.map(t=>[t[0],t[1]+1.3*t[3],t[2],.25*t[3],2.6*t[3],.25*t[3]]));
  instanced(new THREE.IcosahedronGeometry(1,1),M(shade(p.grass,-10)),treesI.map(t=>[t[0],t[1]+3.6*t[3],t[2],1.8*t[3],2.1*t[3],1.8*t[3]]));
  // delivery houses
  const cols=[...HOUSE_COLORS];if(S.round>1)for(let i=4;i>0;i--){const j=Math.floor(r()*(i+1));[cols[i],cols[j]]=[cols[j],cols[i]]}
  houses=[];
  tl.forEach((l,i)=>{const h=makeHouse(cols[i]);h.position.set(l.x,l.base,l.z);h.rotation.y=l.old?0:(l.z<0?Math.PI:0)+(r()-.5)*.2;world.add(h);solid(l.x,l.z,4.8,4.8,l.base+6.5);
    world.add(rot(mesh(new THREE.PlaneGeometry(l.w,l.d),grassM,1,1,1,l.x,l.base+.05,l.z,false),-Math.PI/2));
    houses.push({g:h,has:true,happy:false,cheer:0,x:l.x,z:l.z,base:l.base,top:l.base+5.2*1.5})});
  // grabbable props along streets and harbour
  for(let x=-66;x<=66;x+=11){if(Math.abs(x+15)<6)continue;addProp('lamp',x,-27.6,r,Math.PI/2);addProp('lamp',x+5,1.2,r,-Math.PI/2)}
  for(let x=-63;x<=63;x+=14){if(Math.abs(x+15)<7)continue;addProp('bench',x,-28.6,r,Math.PI)}
  for(let x=-68;x<=68;x+=9.5){if(Math.abs(x+15)<7||r()<.25)continue;addProp('tree',x,10.8,r)}
  for(let i=0;i<9;i++){const z=[-22,6,34][i%3]+(i%2?3.3:-3.3),x=-68+r()*136;if(Math.abs(x+15)<7||roadV.some(v=>Math.abs(x-v)<6))continue;addProp('car',x,z,r,0)}
  for(let i=0;i<3;i++){const x=roadV[i%3]+(i%2?3.3:-3.3),z=-15+r()*40;if(TR_H.some(h=>Math.abs(z-h)<7))continue;addProp('car',x,z,r,Math.PI/2)}
  spawnTraffic(r);cityDetails(r);
  for(let i=0;i<7;i++)addProp(i%3===2?'barrel':'crate',22+(i%2)*2.2+r()*.4,-36-Math.floor(i/2)*2.4,r,r());
  addProp('kiosk',-5,-27.5,r);addProp('kiosk',38,-27.5,r);
  for(let i=0;i<4;i++)addProp('barrel',-34+i*3,-33.5,r);
  // clouds
  for(let i=0;i<10;i++){const c=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:'#ffffff',emissive:night?'#30344a':'#bbbbbb'});
    for(let k=0;k<4;k++)c.add(new THREE.Mesh(sphere,m).translateX(k*3-4).translateY(r()));c.children.forEach(o=>o.scale.set(3+r()*2,1.6+r(),2.5));
    c.position.set((r()-.5)*240,48+r()*16,(r()-.5)*200);c.userData.sp=.6+r()*.8;world.add(c)}
  const sun=new THREE.Mesh(new THREE.SphereGeometry(night?6:8,24,16),new THREE.MeshBasicMaterial({color:p.sun,fog:false}));sun.position.set(90,70,-260);world.add(sun);
  // weather (procedural districts)
  weather=null;
  if(['night','winter','autumn','spring'].includes(md.kind)){
    const n=md.kind==='night'?500:md.kind==='winter'?700:250,pos=new Float32Array(n*3);
    for(let i=0;i<n;i++){pos[i*3]=(r()-.5)*260;pos[i*3+1]=md.kind==='night'?70+r()*60:r()*50;pos[i*3+2]=(r()-.5)*260}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const col={night:'#ffffff',winter:'#ffffff',autumn:'#e07a3a',spring:'#ffb6c1'}[md.kind];
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:col,size:md.kind==='night'?.9:.6,fog:md.kind!=='night'}));
    world.add(pts);weather={pts,kind:md.kind}}
  S.hp=maxHp();S.tired=0;S.hurtT=9;S.cd={};S.act={};S.bossFight=false;S.bossDone=false;S.roamT=S.round===1?20:14;S.stolen=0;S.rescued=0;bossW=null;steal=null;spawnCitizens(r);
  tosses=[];witches=[];blasts=[];drops=null;carry=true;fcd=0;waveT=1.8;waveN=0;clearT=0;allDone=false;S.score=0;
  S.wind=S.round<=1?0:(S.round%2===0?1:-1)*Math.min(78,18+S.round*9);
  P.set(0,9,-24);yaw=0;vel.set(0,0,0);camYaw=Math.PI;camPitch=.42;camDist=20;
  ui();}

// ---------- floaters / particles ----------
const floatersEl=document.getElementById('floaters');
function floater(text,pos,color){const el=document.createElement('div');el.className='floater';el.textContent=text;el.style.color=color;floatersEl.appendChild(el);particles.push({el,pos:pos.clone(),life:1.1,max:1.1,vy:2.2})}
const sparkGeo=new THREE.SphereGeometry(.18,6,4);
function sparks(pos,colors,n=16,speed=8){for(let i=0;i<n;i++){const m=new THREE.Mesh(sparkGeo,new THREE.MeshBasicMaterial({color:colors[i%colors.length],transparent:true}));m.position.copy(pos);scene.add(m);
  const v=new THREE.Vector3(Math.random()-.5,Math.random()-.2,Math.random()-.5).normalize().multiplyScalar(speed*(.5+Math.random()));particles.push({m,v,life:.7+Math.random()*.4,max:1.1,grav:true})}}
function puff(pos,col='#ffffff'){for(let i=0;i<6;i++){const m=new THREE.Mesh(sphere,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.8}));m.scale.setScalar(.6);m.position.copy(pos).add(new THREE.Vector3((Math.random()-.5)*2,(Math.random()-.5)*2,(Math.random()-.5)*2));scene.add(m);particles.push({m,v:new THREE.Vector3(0,1.5,0),life:.7,max:.7,grow:true})}}

// ---------- gameplay ----------
const fwd=()=>new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));
const camDir=()=>camera.getWorldDirection(new THREE.Vector3());
function fire(){if(S.phase!=='play'||fcd>0||S.tired>0)return;fcd=.5;snd.unlock();snd.fire();
  const d=camDir();d.y=Math.max(d.y,-.35);d.normalize();
  const m=new THREE.Mesh(new THREE.SphereGeometry(.5,14,10),new THREE.MeshBasicMaterial({color:'#bff4ff'}));
  m.add(new THREE.Mesh(new THREE.SphereGeometry(1,14,10),new THREE.MeshBasicMaterial({color:'#4ad0ff',transparent:true,opacity:.35,depthWrite:false})));
  m.add(new THREE.Mesh(new THREE.TorusGeometry(.8,.08,6,20),new THREE.MeshBasicMaterial({color:GOLD})));
  m.position.copy(P).add(new THREE.Vector3(0,1.6,0)).addScaledVector(d,2);scene.add(m);let tgt=null,bd=1e9;
  for(const w of witches){if(w.st===2)continue;const to=w.g.position.clone().add(new THREE.Vector3(0,1,0)).sub(m.position),dd=to.length();if(dd<70&&to.normalize().dot(d)>.78&&dd<bd){bd=dd;tgt=w}}
  blasts.push({m,v:d.multiplyScalar(48),t:0,tgt});hero.userData.punch=.35;hideHint()}
function findCandidate(){const cd=camDir(),cp=camera.position;let best=null,bs=1e9;
  for(const p of props){if(p.held)continue;const d=p.g.position.distanceTo(P);if(d>18)continue;const to=p.g.position.clone().sub(cp).normalize(),dot=to.dot(cd);if(dot<.82)continue;const s=d*(1.6-dot);if(s<bs){bs=s;best=p}}return best}
function grab(){if(S.phase!=='play'||S.tired>0)return;snd.unlock();
  if(held){const d=camDir();d.y+=.18;d.normalize();held.held=false;held.rest=false;held.v.copy(d.multiplyScalar(30/Math.sqrt(held.mass))).add(vel.clone().multiplyScalar(.5));held.av.set(Math.random()*4-2,Math.random()*4-2,Math.random()*4-2);
    held.hitCd=0;snd.throw();floater('бросок!',held.g.position,'#2a6f8f');held=null;hero.userData.punch=.35;ui();return}
  const c=findCandidate();if(!c){floater('рядом нечего схватить',P.clone().add(new THREE.Vector3(0,3,0)),'#5c6b60');snd.tap();return}
  held=c;c.held=true;c.rest=false;snd.grab();floater(c.kind==='car'?'машина — легко!':'взял!',c.g.position,'#2a6f8f');hideHint();ui()}
function hideHint(){if(hintOn){hintOn=false;ui()}}
function waveSpeed(){return Math.min(22,6+S.round*1.6)}
function spawnWave(){const n=Math.min(10,S.round-1+Math.floor(waveN/2)),sp=waveSpeed();
  const kinds=[];for(let i=0;i<n;i++)kinds.push(S.round>=4&&i%3===2?'drone':'witch');
  if(S.round>=3&&waveN===2&&!witches.some(w=>w.kind==='boss'))kinds.push('boss');
  kinds.forEach((k,i)=>{const vl=makeVillain(k),g=vl.g,side=Math.random()<.5?-1:1;
    g.position.set(P.x+side*(55+i*6),14+Math.random()*12,P.z+(Math.random()-.5)*50);scene.add(g);
    witches.push(Object.assign(vl,{v:new THREE.Vector3(-side*sp,0,0),st:0,t:0,ph:Math.random()*6,spin:0}))});
  if(kinds.includes('boss'))floater('Главная ведьма!',P.clone().add(new THREE.Vector3(0,4,0)),'#7a5ab8');
  waveN++;waveT=Math.max(3,9-S.round*.45)}
const B=()=>1+S.up.blast;
const DMG={blast:()=>B(),throw:m=>Math.round(2*B()*Math.max(1,m/2)),ice:()=>3*B(),laser:()=>2*B(),speed:()=>5*B(),shield:()=>2*B()};
const DCOL={blast:'#1f7fd0',throw:'#8a5a2a',ice:'#2ab8e8',laser:'#e0302a',speed:'#ff7a1a',shield:'#7a5ab8',reflect:'#a040d0'};
function hit(w,dmg,v,word,col){w.hp-=dmg;floater(word+' −'+dmg,w.g.position.clone().add(new THREE.Vector3(0,w.big?5:2.6,0)),col);if(w.hp<=0){knock(w,v,word,col);return}
  if(w.big){w.flash=.2;snd.bonk();const c=w.g.position.clone().add(new THREE.Vector3(0,3,0));sparks(c,[col,'#ffd27a'],8,6);if(w.kind==='mozg'&&steal)cancelSteal(true);return}
  w.v.copy(v).setY(0).normalize().multiplyScalar(16);w.st=1;w.t=0;snd.bonk();const c=w.g.position.clone().add(new THREE.Vector3(0,1,0));sparks(c,[col,'#ffd27a'],8,6)}
function hurt(d,label){if(S.tired>0||S.phase!=='play')return;if(S.act.shield>0)return;S.hp=Math.max(0,S.hp-d);S.hurtT=0;floater((label?label+' ':'')+'−'+d,P.clone().add(new THREE.Vector3(0,3.4,0)),'#d94a3a');sparks(P.clone().add(new THREE.Vector3(0,1,0)),['#ff6b5a','#ffffff'],10,6);
  if(S.hp<=0){S.tired=3;if(held){held.held=false;held.rest=false;held=null}for(const w of witches)if(w.st===0){w.st=1;w.t=0}snd.bonk();floater('Капитан устал…',P.clone().add(new THREE.Vector3(0,4,0)),'#7a5ab8')}ui()}
function knock(w,v,word,col){w.st=2;earn(w.roam?12:w.big?30:w.kind==='boss'?15:2,w.g.position);if(w.roam){w.hp=0;S.chased++;S.roamLvl++;banner('Лекс-Мех отступает!','«Я вернусь — и буду сильнее!»');ui();return}if(w.big){w.hp=0;S.chased++;banner(w.name+' повержен!','город снова в безопасности');if(w.kind==='mozg'){for(const b of blds)if(b.stolen){b.stolen=false;b.meshes.forEach(m=>m.visible=true);b.lift=24;b.back=true;S.stolen--}cancelSteal(false)}ui();return}w.v.copy(v).normalize().multiplyScalar(14);w.v.y=12;S.chased++;snd.poof();const c=w.g.position.clone().add(new THREE.Vector3(0,1,0));
  sparks(c,['#4ad0ff','#ffd27a','#fffdf8','#c9b4f0'],18,9);puff(c);floater(word,c,col);ui()}
function deliver(i){const h=houses[i];if(!h||h.happy)return;h.happy=true;h.cheer=.001;S.score++;S.total++;earn(3,new THREE.Vector3(h.x,h.top+3,h.z));
  h.g.userData.winM.color.set('#ffe08a');h.g.userData.winM.emissive.set('#a07a20');h.g.userData.beacon.visible=false;
  const top=new THREE.Vector3(h.x,h.top+1.5,h.z);sparks(top,[h.g.children[0].material.color.getStyle(),'#fffdf8','#ff6b8a'],18,7);floater('спасибо!',top,'#e25a28');snd.deliver();
  if(S.score>=5)allDone=true;save();ui()}

// autopilot: fly to dropped gift, else the nearest house still waiting; climb over and steer around buildings
function cruiseAlong(a,dist){let m=0;const f=new THREE.Vector3(Math.sin(a),0,Math.cos(a));for(let s=0;s<=dist;s+=2.5){const h=heightAt(P.x+f.x*s,P.z+f.z*s,2);if(h>m)m=h}return m}
// finger/mouse steering: hold on the screen -> hero heads to the point under the finger
let steer=null,manualT=0;
function steerPoint(ground){ray.setFromCamera(new THREE.Vector2(steer.x/innerWidth*2-1,-(steer.y/innerHeight)*2+1),camera);
  if(ground){const hit=new THREE.Vector3();if(ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-(P.y-FOOT)),hit)&&hit.distanceTo(P)<80)return hit}
  return camera.position.clone().addScaledVector(ray.ray.direction,camDist+25)}
function steerFly(dt){let speed=0;
  if(steer){const t=steerPoint(false),dx=t.x-P.x,dz=t.z-P.z,dist=Math.hypot(dx,dz),want=Math.atan2(dx,dz);
    const dy=Math.atan2(Math.sin(want-yaw),Math.cos(want-yaw)),tr=Math.max(-2.8,Math.min(2.8,dy*3));yaw+=tr*dt;turnRate=THREE.MathUtils.lerp(turnRate,tr,.1);
    speed=Math.min(17,2+dist)*(S.act.speed>0?2:1);const tv=fwd().multiplyScalar(speed);const safe=heightAt(P.x+Math.sin(yaw)*6,P.z+Math.cos(yaw)*6,1.5)+3;
    tv.y=Math.max(-10,Math.min(12,(Math.max(t.y,safe)-P.y)*1.8));vel.lerp(tv,1-Math.exp(-3.5*dt))}
  else{vel.multiplyScalar(Math.exp(-2*dt));turnRate*=.9}
  P.addScaledVector(vel,dt);P.x+=S.wind/14*dt;const floor=heightAt(P.x,P.z,.8)+1.4;if(P.y<floor)P.y=THREE.MathUtils.lerp(P.y,floor,.5);
  P.x=Math.max(-95,Math.min(95,P.x));P.z=Math.max(-80,Math.min(90,P.z));P.y=Math.min(45,P.y);return Math.max(speed,vel.length())}
function autopilot(dt){
  let tx,tz,ty;
  if(drops){tx=drops.m.position.x;tz=drops.m.position.z;ty=drops.m.position.y+1.2}
  else{let best=null,bd=1e9;if(carry&&S.score<5)for(const h of houses){if(!h.has)continue;const d=(h.x-P.x)**2+(h.z-P.z)**2;if(d<bd){bd=d;best=h}}
    if(best){tx=best.x;tz=best.z;ty=best.top+3.5}else{const a=time*.25;tx=Math.sin(a)*30;tz=Math.cos(a)*20;ty=22}}
  const dx=tx-P.x,dz=tz-P.z,dist=Math.hypot(dx,dz);let want=Math.atan2(dx,dz);
  const ahead=Math.min(18,dist+2),cf=cruiseAlong(want,ahead);
  if(dist>10&&cf>P.y+5){const cl=cruiseAlong(want+.7,ahead),cr=cruiseAlong(want-.7,ahead);if(Math.min(cl,cr)<cf-3)want+=cl<cr?.7:-.7}
  let dy=Math.atan2(Math.sin(want-yaw),Math.cos(want-yaw));const tr=Math.max(-2.6,Math.min(2.6,dy*3));yaw+=tr*dt;turnRate=THREE.MathUtils.lerp(turnRate,tr,.1);
  const speed=Math.min(17,1+dist*1.1)*(Math.abs(dy)>1.2?.4:1)*(S.act.speed>0?2:1);
  const safe=Math.max(cruiseAlong(yaw,Math.min(16,dist+1)),heightAt(P.x,P.z,1.5))+3.2;
  const wantY=dist<9?Math.max(ty,safe-1.5):Math.max(safe,Math.min(ty+6,18),7);
  const target=fwd().multiplyScalar(speed);target.y=Math.max(-9,Math.min(12,(wantY-P.y)*2.2));
  vel.lerp(target,1-Math.exp(-3.5*dt));
  P.addScaledVector(vel,dt);P.x+=S.wind/14*dt;
  const floor=heightAt(P.x,P.z,.8)+1.4;if(P.y<floor)P.y=THREE.MathUtils.lerp(P.y,floor,.5);
  P.x=Math.max(-95,Math.min(95,P.x));P.z=Math.max(-80,Math.min(90,P.z));P.y=Math.min(45,P.y);
  return speed}

function stepProps(dt){
  for(const p of props){const g=p.g;p.hitCd=Math.max(0,p.hitCd-dt);
    if(p.held){const t=P.clone().add(new THREE.Vector3(0,2.6+p.half,0));g.position.lerp(t,1-Math.exp(-14*dt));g.rotation.x*=.9;g.rotation.z*=.9;g.rotation.y=THREE.MathUtils.lerp(g.rotation.y,yaw+Math.PI/2,.1);continue}
    if(p===dragProp?.p||p.rest)continue;
    p.v.y-=24*dt;const ox=g.position.x,oz=g.position.z,oy=g.position.y;g.position.addScaledVector(p.v,dt);
    g.rotation.x+=p.av.x*dt;g.rotation.y+=p.av.y*dt;g.rotation.z+=p.av.z*dt;
    let gr=heightAt(g.position.x,g.position.z)+p.half;
    if(gr>oy+.2){g.position.x=ox;g.position.z=oz;p.v.x*=-.4;p.v.z*=-.4;gr=heightAt(ox,oz)+p.half;if(Math.abs(p.v.y)<1&&p.hitCd<=0){snd.thud();p.hitCd=.3}}  // wall bounce
    if(g.position.y<gr){g.position.y=gr;if(p.v.y<-4&&p.hitCd<=0){snd.thud();puff(g.position.clone().add(new THREE.Vector3(0,-p.half,0)),'#e8e0d0');p.hitCd=.3}
      p.v.y=-p.v.y*.35;p.v.x*=.72;p.v.z*=.72;p.av.multiplyScalar(.6);
      if(p.v.lengthSq()<1.2){p.v.set(0,0,0);p.rest=true;p.av.set(0,0,0);g.rotation.x=Math.round(g.rotation.x/(Math.PI/2))*Math.PI/2;g.rotation.z=Math.round(g.rotation.z/(Math.PI/2))*Math.PI/2}}
    g.position.x=Math.max(-110,Math.min(110,g.position.x));g.position.z=Math.max(-120,Math.min(110,g.position.z));
    const sp=p.v.length();
    if(p.enemy){if(g.position.distanceTo(P)<p.rad+1.6){p.enemy=false;if(S.act.shield>0)floater('щит!',P,'#2a6f8f');else hurt(12,'Брошенная машина')}if(p.rest)p.enemy=false}
    if(sp>5&&!p.enemy)for(const w of witches){if(w.st===2)continue;if(w.g.position.distanceTo(g.position)<p.rad+w.hr*.65){hit(w,DMG.throw(p.mass),p.v,'Бросок','#8a5a2a');p.v.multiplyScalar(.5)}}
    // knock resting props
    if(sp>6)for(const q of props){if(q===p||q.held||q.g.position.distanceTo(g.position)>p.rad+q.rad)continue;q.rest=false;q.v.add(p.v.clone().multiplyScalar(.5/q.mass)).add(new THREE.Vector3(0,3,0));q.av.set(Math.random()*3,Math.random()*3,0);p.v.multiplyScalar(.6)}}}

function update(dt){
  time+=dt;
  world.children.forEach(o=>{if(o.userData.sp){o.position.x+=o.userData.sp*dt;if(o.position.x>130)o.position.x=-130}});
  if(weather&&weather.kind!=='night'){const a=weather.pts.geometry.attributes.position;const sp=weather.kind==='winter'?3:2;
    for(let i=0;i<a.count;i++){let y=a.getY(i)-sp*dt;if(y<0)y=50;a.setY(i,y);a.setX(i,a.getX(i)+Math.sin(time+i)*dt*.6)}a.needsUpdate=true}
  if(weather&&weather.kind==='night')weather.pts.material.size=.8+Math.sin(time*2)*.15;
  for(const b of boats){b.b.position.y=-.7+Math.sin(time*1.3+b.ph)*.15;b.b.rotation.z=Math.sin(time*1.1+b.ph)*.05}
  if(beam)beam.rotation.y=time*.8;
  for(const p of particles){p.life-=dt;
    if(p.el){p.pos.y+=p.vy*dt;const v=p.pos.clone().project(camera);p.el.style.left=((v.x+1)/2*innerWidth)+'px';p.el.style.top=((1-v.y)/2*innerHeight)+'px';p.el.style.opacity=Math.max(0,p.life/p.max)}
    else{p.grav&&(p.v.y-=14*dt);p.m.position.addScaledVector(p.v,dt);p.m.material.opacity=Math.max(0,p.life/p.max);p.grow&&p.m.scale.multiplyScalar(1+dt*1.5)}}
  particles=particles.filter(p=>{if(p.life>0)return true;p.el?p.el.remove():(scene.remove(p.m),p.m.material.dispose());return false});
  for(const h of houses){const gift=h.g.userData.gift;gift.visible=h.has;gift.position.y=6.2+Math.sin(time*3+h.x)*.25;gift.rotation.y+=dt;
    if(h.happy){h.cheer=Math.min(1,h.cheer+dt*1.8);h.g.position.y=h.base+Math.sin(h.cheer*Math.PI)*.6}}
  for(const t of tosses){t.t+=dt;const k=Math.min(1,t.t/.5),e=k*k*(3-2*k);t.m.position.lerpVectors(t.a,t.b,e);t.m.position.y+=Math.sin(k*Math.PI)*3;
    if(k>=1&&!t.done){t.done=true;scene.remove(t.m);deliver(t.i)}}
  tosses=tosses.filter(t=>!t.done);
  let speed=8;
  if(S.phase==='menu'){const a=time*.2;P.set(Math.sin(a)*35,26+Math.sin(time*.9),-34+Math.cos(a)*6);yaw=Math.PI/2*Math.sign(Math.cos(a)||1);camYaw=Math.PI+.35;camPitch=.32;camDist=24;speed=14}
  if(S.phase==='play'){S.hurtT+=dt;
    if(S.tired>0){S.tired-=dt;vel.multiplyScalar(.9);P.y=THREE.MathUtils.lerp(P.y,heightAt(P.x,P.z,1)+1.4,.04);speed=0;
      if(S.tired<=0){S.tired=0;S.hp=maxHp();P.set(0,9,-24);vel.set(0,0,0);floater('снова в строю!',P.clone().add(new THREE.Vector3(0,3,0)),'#2f6b32');snd.catch();ui()}}
    else{if(!steer)manualT=Math.max(0,manualT-dt);speed=S.walk?walkStep(dt):(steer||manualT>0?steerFly(dt):autopilot(dt));if(S.hurtT>4&&S.hp<maxHp())S.hp=Math.min(maxHp(),S.hp+4*dt)}
    play(dt);stepV3(dt);stepRoamer(dt);stepTraffic(dt);hudHP()}
  heroBar.sp.position.copy(P).y+=3.6;heroBar.sp.visible=S.phase==='play';heroBar.set(S.hp,maxHp());
  stepProps(dt);
  // hero pose + cape
  const ud=hero.userData;hero.position.copy(P);if(!S.walk||S.phase!=='play')hero.position.y+=Math.sin(time*2.4)*.15;hero.rotation.y=yaw;
  const hold=!!held,k=S.tired>0||(S.walk&&S.phase==='play')?0:hold?.25:Math.min(1,speed/14)*1.25;tilt=THREE.MathUtils.lerp(tilt,k,.06);
  ud.body.rotation.x=tilt;ud.body.rotation.z=THREE.MathUtils.lerp(ud.body.rotation.z,-turnRate*.18,.1);
  ud.punch=Math.max(0,(ud.punch||0)-dt);
  const [L,R]=ud.arms;R.piv.rotation.x=hold?Math.PI:THREE.MathUtils.lerp(R.piv.rotation.x,tilt>.6||ud.punch>0?Math.PI:.3,.15);R.piv.rotation.z=hold?-.3:0;
  L.piv.rotation.x=hold?Math.PI:-.2+Math.sin(time*2)*.1;L.piv.rotation.z=hold?.3:.25;
  for(const l of ud.legs)l.piv.rotation.x=(tilt>.5?.15:-.1)+Math.sin(time*3+l.s)*.08*l.s;
  if(S.walk&&S.phase==='play'){const m=Math.min(1,speed/6);for(const l of ud.legs)l.piv.rotation.x=Math.sin(walkPh*2+(l.s>0?0:Math.PI))*.8*m+(onGround?0:-.5);if(!hold){L.piv.rotation.x=Math.sin(walkPh*2)*.7*m;R.piv.rotation.x=ud.punch>0?Math.PI/2:-Math.sin(walkPh*2)*.7*m;L.piv.rotation.z=.12;R.piv.rotation.z=-.12}}
  ud.gift.visible=carry&&S.score<5&&S.phase!=='clear'&&!hold;
  {const a=ud.cape.geometry.attributes.position,b=ud.cape.userData.base,fl=.25+Math.min(1,speed/14)*.9;
    for(let i=0;i<a.count;i++){const x=b[i*3],y=b[i*3+1],t=-y/2.3;a.setZ(i,-t*t*fl*1.4*(tilt>.6?.5:1)-Math.sin(time*11-t*6+x*2)*.18*t*fl-t*.25);a.setY(i,y*(1-.05*fl))}
    a.needsUpdate=true;ud.cape.geometry.computeVertexNormals()}
  // shadow camera follows hero
  sunLight.position.set(P.x+40,P.y+70,P.z+30);sunLight.target.position.copy(P);
  // grab candidate marker
  candidate=S.phase==='play'&&!held?findCandidate():null;marker.visible=!!candidate;
  if(candidate){marker.position.set(candidate.g.position.x,candidate.g.position.y-candidate.half+.15,candidate.g.position.z);marker.scale.setScalar(candidate.rad*.9+.4+Math.sin(time*6)*.08)}
  // orbit camera
  let ky=0,kp=0,kz=0;
  if(keys.has('ArrowLeft')||keys.has('KeyA'))ky-=1;if(keys.has('ArrowRight')||keys.has('KeyD'))ky+=1;
  if(keys.has('ArrowUp')||keys.has('KeyW'))kp+=1;if(keys.has('ArrowDown')||keys.has('KeyS'))kp-=1;
  if(keys.has('KeyE')||keys.has('Equal')||keys.has('NumpadAdd'))kz-=1;if(keys.has('KeyQ')||keys.has('Minus')||keys.has('NumpadSubtract'))kz+=1;
  if(S.walk&&S.phase==='play'){ky=0;kp=0}
  if(ky||kp||kz){camYaw+=ky*2*dt;camPitch=clampP(camPitch+kp*1.2*dt);camDist=clampD(camDist+kz*20*dt);camIdle=0;hideHint()}
  camIdle+=dt;const fol=steer&&S.phase==='play';if((camIdle>3||fol)&&S.phase==='play'){const behind=yaw+Math.PI,d=Math.atan2(Math.sin(behind-camYaw),Math.cos(behind-camYaw));camYaw+=d*Math.min(1,dt*(fol?1.6:.6))}
  const cp=new THREE.Vector3(Math.sin(camYaw)*Math.cos(camPitch),Math.sin(camPitch),Math.cos(camYaw)*Math.cos(camPitch)).multiplyScalar(camDist).add(P);
  cp.y=Math.max(cp.y,heightAt(cp.x,cp.z,1)+1.5);
  camera.position.lerp(cp,1-Math.exp(-8*dt));camera.lookAt(P.x,P.y+1.5,P.z);
}
const clampP=v=>Math.max(-.05,Math.min(1.35,v)),clampD=v=>Math.max(7,Math.min(45,v));
function play(dt){
  if(carry&&!tosses.length&&S.score<5){let best=-1,bd=42;for(let i=0;i<5;i++){const h=houses[i];if(!h.has)continue;const dx=P.x-h.x,dz=P.z-h.z,d=dx*dx+dz*dz;if(d<bd&&P.y<h.top+10){bd=d;best=i}}
    if(best>=0){const h=houses[best];h.has=false;const m=makeGift(.9);scene.add(m);tosses.push({m,a:P.clone().add(new THREE.Vector3(0,-.6,0)),b:new THREE.Vector3(h.x,h.top+1.0,h.z),t:0,i:best});snd.toss()}}
  if(drops){drops.v.y-=16*dt;drops.m.position.addScaledVector(drops.v,dt);const gy=heightAt(drops.m.position.x,drops.m.position.z)+.5;if(drops.m.position.y<gy){drops.m.position.y=gy;drops.v.set(0,0,0)}
    drops.m.rotation.y+=dt*2;drops.ring.position.set(drops.m.position.x,gy-.4,drops.m.position.z);drops.ring.material.opacity=.4+.3*Math.sin(time*6);
    const dx=P.x-drops.m.position.x,dz=P.z-drops.m.position.z;if(dx*dx+dz*dz<9&&Math.abs(P.y-drops.m.position.y)<4){carry=true;floater('поймал!',drops.m.position,'#2f6b32');snd.catch();scene.remove(drops.m,drops.ring);drops=null;ui()}}
  if(S.round>=2&&!allDone){waveT-=dt;if(waveT<=0)spawnWave()}
  const sp=waveSpeed();
  for(const w of witches){const g=w.g;if(w.frozen>0){w.frozen-=dt;w.ice.visible=w.frozen>0;continue}if(w.big){bossAI(w,dt);continue}w.t+=dt;
    if(w.st===0){w.sh-=dt;const dd=g.position.distanceTo(P);if(w.sh<=0&&dd<45&&dd>5){if(w.kind==='drone'){w.sh=3;eshot(g.position.clone(),P,{col:'#ff3a3a',sp:30,dmg:6,label:'Лазер дрона',r:.25})}else{w.sh=w.kind==='boss'?3:5+Math.random()*2;eshot(g.position.clone().add(new THREE.Vector3(0,1.6,0)),P,{col:'#c060ff',sp:9,dmg:w.kind==='boss'?12:8,label:'Заклятие',home:.6})}}}
    if(w.st===0){const to=P.clone().sub(g.position),d=to.length()||1;to.multiplyScalar(sp/d);to.y*=.7;w.v.lerp(to,1-Math.exp(-1.3*dt));
      if(w.t>10&&w.kind==='witch')w.st=1;
      if(d<(w.kind==='boss'?4.5:2.6)){if(S.act.shield>0||S.act.speed>0){S.act.speed>0?hit(w,DMG.speed(),g.position.clone().sub(P),'Таран',DCOL.speed):hit(w,DMG.shield(),g.position.clone().sub(P),'Щит',DCOL.shield);continue}if(carry&&S.score<5&&w.kind!=='drone'){carry=false;const m=makeGift(1);m.position.copy(P);scene.add(m);
          const ring=new THREE.Mesh(new THREE.RingGeometry(1.2,1.8,24),new THREE.MeshBasicMaterial({color:'#fffdf8',transparent:true,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;scene.add(ring);
          drops={m,ring,v:new THREE.Vector3(w.v.x*.3,4,w.v.z*.3)};snd.bonk();floater('ой, подарок!',P.clone().add(new THREE.Vector3(0,2.5,0)),'#7a5ab8');ui()}
        w.st=1;w.t=0}}
    else if(w.st===1){if(w.kind!=='witch'&&w.t>2.5&&S.tired<=0){w.st=0;w.t=0}const away=new THREE.Vector3(Math.sign(g.position.x-P.x||1)*sp*1.4,4,0);w.v.lerp(away,1-Math.exp(-2*dt))}
    else{w.v.y-=12*dt;w.spin+=dt*10;g.rotation.z=w.spin}
    g.position.addScaledVector(w.v,dt);
    if(w.st!==2){g.rotation.y=Math.atan2(w.v.x,w.v.z);g.position.y+=Math.sin(time*4+w.ph)*.02}}
  witches=witches.filter(w=>{const p=w.g.position,ok=w.roam?!w.gone:w.big?!w.gone:w.st===0||(p.distanceTo(P)<110&&p.y>-5&&p.y<90);if(!ok){scene.remove(w.g);w.bar.dispose()}return ok});
  for(const w of witches){w.bar.sp.position.copy(w.g.position).y+=w.bh;w.bar.sp.visible=w.st!==2;w.bar.set(w.hp,w.max);if(w.kind==='drone')w.g.children.forEach(o=>o.userData.rotor&&(o.rotation.y+=dt*30))}
  fcd=Math.max(0,fcd-dt);
  for(const b of blasts){b.t+=dt;if(b.tgt&&b.tgt.st!==2){const to=b.tgt.g.position.clone().add(new THREE.Vector3(0,1,0)).sub(b.m.position).normalize().multiplyScalar(48);b.v.lerp(to,1-Math.exp(-6*dt))}
    b.m.position.addScaledVector(b.v,dt);b.m.children[1].rotation.x+=dt*12;b.m.scale.setScalar(1+Math.sin(time*30)*.1);
    if(Math.random()<.6)sparks(b.m.position,['#4ad0ff','#ffd27a'],1,1.5);
    for(const w of witches){if(w.st===2)continue;const c=w.g.position.clone().add(new THREE.Vector3(0,1,0));if(c.distanceTo(b.m.position)<w.hr){hit(w,DMG.blast(),b.v,'Удар',DCOL.blast);b.t=9;break}}
    for(const p of props){if(p.held||b.t>2)continue;if(p.g.position.distanceTo(b.m.position)<p.rad+.6){p.rest=false;p.v.add(b.v.clone().multiplyScalar(.3/p.mass)).add(new THREE.Vector3(0,6,0));p.av.set(2,3,1);sparks(b.m.position,['#4ad0ff','#fffdf8'],10,6);b.t=9;break}}
    if(b.m.position.y<heightAt(b.m.position.x,b.m.position.z)){sparks(b.m.position,['#4ad0ff','#fffdf8'],8,5);b.t=9}}
  blasts=blasts.filter(b=>{if(b.t<1.5)return true;scene.remove(b.m);return false});
  if(allDone&&!tosses.length&&!S.bossFight&&!S.bossDone)startBoss();
  if(S.bossDone&&!tosses.length){clearT+=dt;if(clearT>1.5){S.phase='clear';allDone=false;S.bossDone=false;$('clearPct').textContent=`Город спасён на ${rescuePct()}% · спасено жителей: ${S.rescued}`;earn(5,P);if(S.round>S.best)S.best=S.round;save();snd.win();
    for(const w of witches)w.st=1;
    sparks(P.clone().add(new THREE.Vector3(0,4,0)),HOUSE_COLORS,40,12);ui()}}
}

// ---------- superpowers (bought in the shop; they hurt villains only) ----------
const shieldM=new THREE.Mesh(new THREE.SphereGeometry(2.4,24,16),new THREE.MeshBasicMaterial({color:'#4ad0ff',transparent:true,opacity:.22,depthWrite:false}));shieldM.visible=false;hero.add(shieldM);
const laserM=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,1,8,1,true).translate(0,.5,0).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:'#ff3a3a',transparent:true,opacity:.85,depthWrite:false}));
laserM.add(new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,1,8,1,true).translate(0,.5,0).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:'#ff9a8a',transparent:true,opacity:.3,depthWrite:false})));laserM.visible=false;scene.add(laserM);
let laserTick=0;
function usePower(id){if(S.phase!=='play'||S.tired>0||!S.owned.has(id)||(S.cd[id]||0)>0)return false;const pw=POWERS.find(p=>p.id===id);snd.unlock();S.cd[id]=pw.cd;hideHint();
  const d=camDir();
  if(id==='ice'){snd.poof();let n=0;for(const w of witches){if(w.st===2)continue;const to=w.g.position.clone().sub(P),dd=to.length();if(dd<10||(dd<34&&to.normalize().dot(d)>.6)){w.frozen=4;w.ice.visible=true;n++;{const dm=DMG.ice();w.hp-=dm;floater('Лёд −'+dm,w.g.position.clone().add(new THREE.Vector3(0,w.big?5:2.6,0)),DCOL.ice);if(w.hp<=0){w.frozen=0;w.ice.visible=false;knock(w,d,'дзынь!',DCOL.ice)}}}}
    for(let i=0;i<24;i++){const m=new THREE.Mesh(sparkGeo,new THREE.MeshBasicMaterial({color:i%2?'#bfeaff':'#ffffff',transparent:true}));m.position.copy(P).y+=1.6;scene.add(m);particles.push({m,v:d.clone().multiplyScalar(18+Math.random()*10).add(new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).multiplyScalar(6)),life:.8,max:.8})}
    floater(n?'заморозка!':'❄',P.clone().add(new THREE.Vector3(0,3,0)),'#2a6f8f')}
  else{S.act[id]=pw.dur;if(id==='laser')snd.fire();else snd.catch()}
  ui();return true}
function stepPowers(dt){for(const k in S.cd)S.cd[k]=Math.max(0,S.cd[k]-dt);for(const k in S.act)S.act[k]=Math.max(0,S.act[k]-dt);
  shieldM.visible=S.act.shield>0;if(shieldM.visible)shieldM.scale.setScalar(1+Math.sin(time*8)*.04);
  laserM.visible=S.act.laser>0&&S.phase==='play';
  if(laserM.visible){let d=camDir();const o=P.clone().add(new THREE.Vector3(0,2.3,0));{let bd=.8;for(const w of witches){if(w.st===2)continue;const t=w.g.position.clone().add(new THREE.Vector3(0,1,0)).sub(o),l=t.length();if(l>70)continue;const k=t.normalize().dot(d);if(k>bd){bd=k;d=t}}}laserM.position.copy(o);laserM.lookAt(o.clone().add(d));laserM.scale.set(1,1,70);
    laserTick-=dt;if(laserTick<=0){laserTick=.25;for(const w of witches){if(w.st===2)continue;const c=w.g.position.clone().add(new THREE.Vector3(0,1,0)),t=c.clone().sub(o).dot(d);if(t<0||t>70)continue;
      if(o.clone().addScaledVector(d,t).distanceTo(c)<w.hr*.8)hit(w,DMG.laser(),d,'Лазер',DCOL.laser)}}}
  if(S.act.speed>0&&Math.random()<.5)sparks(P,['#ffffff','#bfeaff'],1,2)}
function powersUI(){const el=$('powers');el.hidden=S.phase!=='play'||!POWERS.some(p=>S.owned.has(p.id));
  el.innerHTML=POWERS.filter(p=>S.owned.has(p.id)).map(p=>{const c=S.cd[p.id]||0;return`<button class="pw-btn${c>0?' cd':''}${S.act[p.id]>0?' act':''}" data-p="${p.id}"><i>${p.key}</i><span>${p.ico}</span>${c>0?Math.ceil(c)+' с':p.short}</button>`}).join('')}
let pwSig='';function powersTick(){const sig=S.phase+POWERS.map(p=>(S.owned.has(p.id)?1:0)+':'+Math.ceil(S.cd[p.id]||0)+':'+(S.act[p.id]>0)).join();if(sig!==pwSig){pwSig=sig;powersUI()}}
document.getElementById('powers').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-p]');if(!b)return;e.preventDefault();e.stopPropagation();usePower(b.dataset.p)});

// ---------- shop ----------
const pvR=new THREE.WebGLRenderer({canvas:document.getElementById('pv'),antialias:true,alpha:true});pvR.setPixelRatio(Math.min(2,devicePixelRatio||1));pvR.setSize(200,220,false);pvR.toneMapping=THREE.ACESFilmicToneMapping;
const pvS=new THREE.Scene(),pvC=new THREE.PerspectiveCamera(35,200/220,.1,50);pvC.position.set(0,1.2,7.5);pvC.lookAt(0,.6,0);
pvS.add(new THREE.HemisphereLight(0xffffff,0x8a8070,1.4));{const l=new THREE.DirectionalLight(0xffffff,2);l.position.set(3,5,4);pvS.add(l)}
let pvHero=null,pvSkin=-1;
function preview(i){if(pvSkin===i)return;pvSkin=i;if(pvHero)pvS.remove(pvHero);pvHero=makeHero(SKINS[i]);pvHero.userData.arms[1].piv.rotation.x=Math.PI;pvHero.userData.gift.visible=false;pvS.add(pvHero)}
function openShop(){if(S.phase==='shop')return;S.prev=S.phase;steer=null;ptrs.clear();dragProp=null;joy.on=false;joy.x=joy.y=0;keys.clear();$('shop').scrollTop=0;document.querySelectorAll('.shop-tabs .tab').forEach(x=>x.classList.toggle('on',x.dataset.tab==='skins'));$('tabSkins').hidden=false;$('tabPowers').hidden=true;S.phase='shop';preview(S.skin);shopUI();ui()}
function dmgText(id){return id==='ice'?DMG.ice():id==='laser'?DMG.laser()+' за тик (×4 в секунду)':id==='speed'?DMG.speed()+' за таран':DMG.shield()+' толчок, отражение: урон снаряда +'+DMG.shield()}
function shopUI(){$('shopStars').textContent=S.stars;
  $('shopPowers').innerHTML=POWERS.map(p=>{const own=S.owned.has(p.id);return`<div class="item"><span class="ico">${p.ico}</span><span class="nm">${p.name} <small>${p.d} · <b style="color:${DCOL[p.id]}">урон ${dmgText(p.id)}</b> · клавиша ${p.key}</small></span>${own?'<button disabled>Есть</button>':`<button data-buy="${p.id}" ${S.stars<p.price?'disabled':''}>${p.price} ⭐</button>`}</div>`}).join('')+
    UPS.map(u=>{const lv=S.up[u.id],pr=u.prices[lv];return`<div class="item"><span class="ico">${u.ico}</span><span class="nm">${u.name} ${lv}/3 <small>${u.d}${u.id==='blast'?` · сейчас: Удар −${DMG.blast()}, бросок −${DMG.throw(2)}`:''}</small></span>${pr==null?'<button disabled>Макс.</button>':`<button data-up="${u.id}" ${S.stars<pr?'disabled':''}>${pr} ⭐</button>`}</div>`}).join('');
  $('shopSkins').innerHTML=SKINS.map((k,i)=>{const own=S.owned.has('skin'+i),on=S.skin===i;return`<div class="item" data-pv="${i}"><span class="sw" style="background:${k.suit}"></span><span class="sw" style="background:${k.cape}"></span><span class="nm">${k.name}<small>${k.d}</small></span>${
    !own?`<button data-skin="${i}" ${S.stars<k.price?'disabled':''}>${k.price} ⭐</button>`:on?(i?`<button class="alt" data-off="1">Снять</button>`:'<button disabled>Надет</button>'):`<button class="alt" data-wear="${i}">Надеть</button>`}</div>`}).join('')}
{const sh=document.getElementById('shop');['pointerdown','pointermove','pointerup','touchstart','wheel'].forEach(t=>sh.addEventListener(t,e=>e.stopPropagation(),{passive:true}))}
document.querySelectorAll('.shop-tabs .tab').forEach(t=>t.addEventListener('click',e=>{e.preventDefault();document.querySelectorAll('.shop-tabs .tab').forEach(x=>x.classList.toggle('on',x===t));$('tabSkins').hidden=t.dataset.tab!=='skins';$('tabPowers').hidden=t.dataset.tab!=='powers'}));
document.getElementById('shop').addEventListener('click',e=>{e.preventDefault();const b=e.target.closest('button'),it=e.target.closest('[data-pv]');if(it)preview(+it.dataset.pv);if(!b||b.disabled)return;const ds=b.dataset;snd.unlock();
  if(ds.buy){const p=POWERS.find(p=>p.id===ds.buy);if(S.stars>=p.price){S.stars-=p.price;S.owned.add(p.id);snd.win()}}
  else if(ds.up){const u=UPS.find(u=>u.id===ds.up),pr=u.prices[S.up[u.id]];if(pr!=null&&S.stars>=pr){S.stars-=pr;S.up[u.id]++;if(u.id==='hp')S.hp=Math.min(maxHp(),S.hp+25);snd.win()}}
  else if(ds.skin){const i=+ds.skin;if(S.stars>=SKINS[i].price){S.stars-=SKINS[i].price;S.owned.add('skin'+i);setSkin(i);snd.win()}}
  else if(ds.wear){setSkin(+ds.wear);snd.tap()}else if(ds.off){setSkin(0);snd.tap()}
  else if(b.id==='shopClose'){S.phase=S.prev;snd.tap();ui();return}
  save();shopUI();ui()});

// ---------- v4: vehicles, traffic, city details, roaming Лекс-Мех ----------
const CTYPES=['sedan','sedan','hatch','van','taxi','bus','truck','hatch'];
function buildCar(g,type,r){const c=type==='taxi'?'#f2c230':type==='bus'?['#d94a3a','#2f6fb0','#4a9a7a'][Math.floor(r()*3)]:CARC[Math.floor(r()*CARC.length)];
  const paint=M(c,{roughness:.35,metalness:.3}),glass=M('#2b3c4e',{roughness:.15,metalness:.4});
  const S={sedan:[4.2,1.9,.42],hatch:[3.6,1.8,.4],van:[4.8,2,.45],taxi:[4.2,1.9,.42],bus:[10,2.5,.55],truck:[7.2,2.3,.55]}[type],L=S[0],Wd=S[1],wr=S[2];let half=.95,mass=2;
  if(type==='sedan'||type==='taxi'){g.add(mesh(box,paint,L,.9,Wd,0,-.1,0));g.add(mesh(box,glass,2.3,.75,Wd-.15,-.2,.7,0));g.add(mesh(box,paint,2.2,.08,Wd-.2,-.2,1.1,0));
    if(type==='taxi'){g.add(mesh(box,'#243228',.6,.3,.9,-.2,1.3,0));g.add(mesh(box,'#243228',L+.02,.18,Wd+.02,0,-.1,0))}}
  else if(type==='hatch'){g.add(mesh(box,paint,L,1,Wd,0,-.05,0));g.add(mesh(box,glass,2.1,.8,Wd-.15,-.45,.8,0));g.add(mesh(box,paint,2,.08,Wd-.2,-.45,1.22,0))}
  else if(type==='van'){g.add(mesh(box,paint,L,2,Wd,0,.45,0));g.add(mesh(box,glass,.08,.8,Wd-.2,L/2,.9,0));g.add(mesh(box,glass,2.8,.6,Wd+.02,.4,1,0));half=1.45;mass=2.5}
  else if(type==='bus'){g.add(mesh(box,paint,L,2.6,Wd,0,.75,0));g.add(mesh(box,glass,L-.6,.9,Wd+.02,.1,1.25,0));g.add(mesh(box,'#f4f1e8',L,.12,Wd+.02,0,.5,0));g.add(mesh(box,'#ffd27a',.06,.35,1.6,L/2+.01,1.85,0,false));half=1.6;mass=4}
  else{g.add(mesh(box,paint,2.1,2,Wd,L/2-1.05,.45,0));g.add(mesh(box,glass,.08,.8,Wd-.2,L/2,.9,0));g.add(mesh(box,'#e8e6e0',L-2.3,2.7,Wd+.1,-1.1,.8,0));half=1.6;mass=3.5}
  const wheels=[];for(const sx of[-(L/2-wr*2),L/2-wr*2])for(const sz of[-Wd/2+.05,Wd/2-.05]){const wp=new THREE.Group();wp.position.set(sx,-half+wr,sz);const w=mesh(cyl,'#1c1c1c',wr,.3,wr);w.rotation.x=Math.PI/2;wp.add(w);
    const hub=mesh(cyl,'#c8ccd2',wr*.5,.32,wr*.5);hub.rotation.x=Math.PI/2;wp.add(hub);g.add(wp);wheels.push(wp)}
  for(const sz of[-Wd/2+.35,Wd/2-.35]){g.add(mesh(box,M('#fff6d0',{emissive:'#fff0b0',emissiveIntensity:night?2:.2}),.05,.22,.35,L/2+.01,-half+.9,sz,false));g.add(mesh(box,M('#c0202a',{emissive:'#a01010',emissiveIntensity:night?1.2:.5}),.05,.2,.3,-L/2-.01,-half+.9,sz,false))}
  return{half,rad:Math.max(2.2,L/2),mass,wheels,wr}}
// traffic on the street graph (right-hand lanes, random turns at intersections)
const TR_H=[-22,6,34],TR_V=[-45,15,45],NODES=new Map();
{const add=(a,b)=>{const ka=a.join(),kb=b.join();if(!NODES.has(ka))NODES.set(ka,{p:a,n:[]});if(!NODES.has(kb))NODES.set(kb,{p:b,n:[]});NODES.get(ka).n.push(kb);NODES.get(kb).n.push(ka)};
  for(const z of TR_H){const xs=[-72,...TR_V,72];for(let i=0;i<xs.length-1;i++)add([xs[i],z],[xs[i+1],z])}
  for(const x of TR_V)for(let i=0;i<TR_H.length-1;i++)add([x,TR_H[i]],[x,TR_H[i+1]])}
let traffic=[];
function spawnTraffic(r){traffic=[];const keys=[...NODES.keys()];
  for(let i=0;i<14;i++){const a=keys[Math.floor(r()*keys.length)],nd=NODES.get(a),b=nd.n[Math.floor(r()*nd.n.length)];const p=makeProp('car',r,CTYPES[i%CTYPES.length]);world.add(p.g);props.push(p);
    p.traffic={a,b,s:r()*6,v:0,max:7+r()*4};traffic.push(p);placeCar(p,0)}}
function placeCar(p,dt){const t=p.traffic,A=NODES.get(t.a).p,B=NODES.get(t.b).p,dx=B[0]-A[0],dz=B[1]-A[1],len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len;
  const x=A[0]+ux*t.s-uz*2.2,z=A[1]+uz*t.s+ux*2.2;p.g.position.set(x,p.half+.03,z);const want=Math.atan2(-uz,ux);let d=Math.atan2(Math.sin(want-p.g.rotation.y),Math.cos(want-p.g.rotation.y));
  p.g.rotation.y+=dt?d*Math.min(1,dt*6):d;p.g.rotation.x=p.g.rotation.z=0;return{len,ux,uz}}
function stepTraffic(dt){for(const p of traffic){const t=p.traffic;if(!t)continue;if(p.held||!p.rest||p===dragProp?.p){p.traffic=null;continue}
    const A=NODES.get(t.a).p,B=NODES.get(t.b).p,len=Math.hypot(B[0]-A[0],B[1]-A[1]),ux=(B[0]-A[0])/len,uz=(B[1]-A[1])/len,pos=p.g.position;let stop=false;
    const ahead=(qx,qz,far,lat)=>{const rx=qx-pos.x,rz=qz-pos.z,al=rx*ux+rz*uz,la=Math.abs(-rx*uz+rz*ux);return al>0&&al<far&&la<lat};
    if(S.walk&&ahead(P.x,P.z,p.rad+7,3)&&P.y-heightAt(P.x,P.z)<3)stop=true;
    for(const c of citizens)if(ahead(c.g.position.x,c.g.position.z,p.rad+4,1.6)){stop=true;break}
    if(!stop)for(const q of traffic){if(q===p||!q.traffic)continue;if(ahead(q.g.position.x,q.g.position.z,p.rad+q.rad+2.5,1.6)){stop=true;break}}
    t.v=THREE.MathUtils.lerp(t.v,stop?0:t.max,1-Math.exp(-(stop?6:1.5)*dt));t.s+=t.v*dt;
    if(t.s>=len){const nd=NODES.get(t.b),opts=nd.n.filter(k=>k!==t.a);t.a=t.b;t.b=(opts.length?opts:nd.n)[Math.floor(Math.random()*(opts.length||nd.n.length))];t.s=0}
    placeCar(p,dt);for(const w of p.wheels)w.rotation.z-=t.v*dt/p.wr}
  traffic=traffic.filter(p=>p.traffic)}
// roaming Доктор Лекс-Мех (from round 1): patrols, shoots only with powers, retreats when beaten and returns stronger
let roamer=null;
function stepRoamer(dt){if(S.phase!=='play')return;
  if(roamer&&S.bossFight&&roamer.st!==2){roamer.st=2;roamer.retreat=true}
  if(!roamer&&!S.bossFight&&!S.bossDone){S.roamT-=dt;if(S.roamT<=0){const vl=makeVillain('lex');vl.big=true;vl.roam=true;vl.name='Доктор Лекс-Мех';vl.max=vl.hp=20+12*S.roamLvl+3*S.round;vl.at={a:3,b:12,c:0};
      vl.g.scale.setScalar(1.2);vl.g.position.set(P.x-40,P.y+18,P.z+30);scene.add(vl.g);witches.push(Object.assign(vl,{v:new THREE.Vector3(),st:0,t:0,ph:0,spin:0}));roamer=vl;
      banner('Доктор Лекс-Мех на патруле!',S.roamLvl?'вернулся сильнее — уровень '+(S.roamLvl+1):'бьёт только суперсилами: сферы и дроны');snd.bonk()}}
  if(roamer&&roamer.gone){roamer=null;S.roamT=45}}

// ---------- v3: original bosses, villain projectiles, citizens, rescue %, walking ----------
const BOSSES=[
  {kind:'lex',name:'Доктор Лекс-Мех',sub:'лысый гений в зелёно-фиолетовом мехе: самонаводящиеся сферы и дроны',hp:60},
  {kind:'mozg',name:'Мозгобот',sub:'зелёный андроид на корабле-черепе: луч-похититель крадёт здания — бей по кораблю!',hp:75},
  {kind:'grom',name:'Громозавр',sub:'каменный громила: ударная волна и летящие машины',hp:90}];
function makeLex(){const g=new THREE.Group(),G='#3a8a4a',V='#6a3a9a';
  g.add(mesh(box,G,2.6,2.2,1.8,0,0,0));g.add(mesh(box,V,2.8,.5,2,0,.9,0));g.add(mesh(box,V,1.2,1.2,.2,0,0,.95));
  g.add(mesh(sphere,M('#ffe08a',{emissive:'#ffb000',emissiveIntensity:1}),.35,.35,.1,0,0,1.06,false));
  const dome=new THREE.Mesh(new THREE.SphereGeometry(1,20,14,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:'#bfeaff',transparent:true,opacity:.35,roughness:.05}));dome.position.y=1.15;g.add(dome);
  g.add(mesh(sphere,SKIN,.55,.62,.55,0,1.65,0));for(const s of[-1,1]){g.add(mesh(sphere,'#243228',.08,.08,.05,.2*s,1.72,.48));g.add(mesh(box,G,.35,.08,.05,.2*s,1.86,.48))}
  for(const s of[-1,1]){const a=new THREE.Group();a.position.set(1.7*s,.4,0);a.add(mesh(cyl,V,.35,1.8,.35,0,-.8,0));a.add(mesh(sphere,G,.55,.55,.55,0,-1.8,0));g.add(a);
    g.add(mesh(cyl,'#2f3a44',.4,1.6,.4,.8*s,-1.8,0));g.add(mesh(cone,M('#4ad0ff',{emissive:'#4ad0ff',emissiveIntensity:2}),.35,.8,.35,.8*s,-2.9,0,false)).children}
  g.scale.setScalar(1.6);return g}
function makeMozg(){const g=new THREE.Group();
  g.add(mesh(sphere,'#9aa8a0',3.2,1.4,3.6,0,0,0));
  for(const s of[-1,1])g.add(mesh(sphere,'#141820',.8,.6,.4,1.1*s,.1,3.2,false));
  g.add(mesh(cone,'#141820',.35,.6,.3,0,-.4,3.4,false));for(let i=-2;i<=2;i++)g.add(mesh(box,'#e8e8e0',.3,.4,.2,i*.45,-.95,3.0,false));
  g.add(mesh(cyl,'#5a7a6a',3.4,.25,3.4,0,-.3,0));
  const a=new THREE.Group();a.position.y=1.3;a.add(mesh(cyl,'#4ab84a',.45,1.6,.45,0,.8,0));a.add(mesh(sphere,'#5ad05a',.6,.7,.6,0,2.1,0));
  for(const s of[-1,1]){a.add(mesh(sphere,M('#ff3aff',{emissive:'#d020d0',emissiveIntensity:1.5}),.12,.15,.08,.22*s,2.2,.52,false));a.add(mesh(cyl,'#7a5ab8',.05,.7,.05,.3*s,2.9,0));a.add(mesh(sphere,'#7a5ab8',.12,.12,.12,.3*s,3.25,0))}
  g.add(a);g.scale.setScalar(1.5);return g}
function makeGrom(){const g=new THREE.Group(),R='#7a6a5a',R2='#5a4c40',dod=new THREE.DodecahedronGeometry(1,0);
  g.add(mesh(dod,R,2.4,2.6,2,0,4.6,0));g.add(mesh(dod,R2,1.2,1,1.1,0,7.4,.4));
  for(const s of[-1,1]){g.add(mesh(sphere,M('#ff8a2a',{emissive:'#ff6a00',emissiveIntensity:2}),.2,.14,.1,.4*s,7.6,1.4,false));
    g.add(mesh(dod,R2,.9,1.6,.9,2.6*s,5,0));g.add(mesh(dod,R,1.1,1.1,1.1,2.9*s,3.2,.4));g.add(mesh(dod,R2,1,2,1,1*s,1.2,0))}
  for(let i=0;i<5;i++)g.add(mesh(cone,'#9a8a7a',.4,1,.4,(i-2)*.6,6.6,-1.4));
  g.scale.setScalar(1.25);return g}
Object.assign(VIL,{lex:{hp:60,dmg:0,h:8,num:true},mozg:{hp:75,dmg:0,h:7.5,num:true},grom:{hp:90,dmg:0,h:12.5,num:true}});
let eproj=[],waves=[],citizens=[],blds=[],beamM=null,steal=null,bossW=null;
function eshot(from,to,o){const d=to.clone().sub(from).normalize();const m=new THREE.Mesh(new THREE.SphereGeometry(o.r||.45,12,8),new THREE.MeshBasicMaterial({color:o.col}));
  m.add(new THREE.Mesh(new THREE.SphereGeometry((o.r||.45)*2,12,8),new THREE.MeshBasicMaterial({color:o.col,transparent:true,opacity:.3,depthWrite:false})));
  m.position.copy(from);scene.add(m);eproj.push({m,v:d.multiplyScalar(o.sp),dmg:o.dmg,label:o.label,t:0,home:o.home||0,sp:o.sp,col:o.col})}
function startBoss(i){const b=BOSSES[i??((S.round-1)%3)];S.bossFight=true;const vl=makeVillain(b.kind);vl.big=true;vl.max=vl.hp=Math.round(b.hp*(1+.3*(S.round-1)));vl.name=b.name;vl.at={a:2,b:5,c:8};
  vl.g.position.set(P.x+28,b.kind==='grom'?heightAt(P.x+28,P.z):P.y+10,P.z+10);scene.add(vl.g);witches.push(Object.assign(vl,{v:new THREE.Vector3(),st:0,t:0,ph:0,spin:0}));bossW=vl;
  banner(b.name,b.sub);snd.bonk();ui()}
function banner(t,s){const el=$('bossBanner');el.innerHTML=`<b>${t}</b><span>${s}</span>`;el.hidden=false;el.classList.remove('go');void el.offsetWidth;el.classList.add('go');clearTimeout(banner.t);banner.t=setTimeout(()=>el.hidden=true,3200)}
function bossAI(w,dt){const g=w.g,gp=g.position;w.t+=dt;
  if(w.st===2&&w.roam){w.dead=(w.dead||0)+dt;gp.y+=dt*16;gp.x+=dt*10;g.rotation.y+=dt*2;if(Math.random()<.4)sparks(gp,['#4ad0ff','#ffffff'],3,4);if(w.dead>2.5&&!w.gone){w.gone=true;scene.remove(g);w.bar.dispose()}return}
  if(w.st===2){w.dead=(w.dead||0)+dt;g.rotation.y+=dt*6;g.rotation.z=Math.sin(w.dead*9)*.3;g.scale.multiplyScalar(1-dt*.35);gp.y-=dt*(w.kind==='grom'?1:4);
    if(Math.random()<.5)sparks(gp.clone().add(new THREE.Vector3((Math.random()-.5)*6,Math.random()*6,(Math.random()-.5)*6)),['#ffd27a','#ff6b5a','#ffffff','#4ad0ff'],6,10);
    if(w.dead>2.4&&!w.gone){w.gone=true;puff(gp.clone());S.bossFight=false;S.bossDone=true;bossW=null;floater('Победа!',gp.clone().add(new THREE.Vector3(0,4,0)),'#d94a3a');snd.win();ui()}return}
  w.flash=Math.max(0,(w.flash||0)-dt);g.traverse(o=>{});
  const toH=P.clone().sub(gp);g.rotation.y=Math.atan2(toH.x,toH.z);
  if(w.kind==='grom'){const dist=Math.hypot(toH.x,toH.z);if(dist>12){const st=Math.min(6,dist-12)*dt;gp.x+=toH.x/dist*st;gp.z+=toH.z/dist*st}
    gp.y=THREE.MathUtils.lerp(gp.y,heightAt(gp.x,gp.z,2),.2);g.scale.y=1.25*(1-Math.max(0,Math.sin(w.t*8))*.03);
    w.at.a-=dt;if(w.at.a<=0){w.at.a=6;const ring=new THREE.Mesh(new THREE.RingGeometry(.8,1.6,40),new THREE.MeshBasicMaterial({color:'#ffb060',transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(gp.x,gp.y+.3,gp.z);scene.add(ring);waves.push({ring,r:1,hitH:false,c:gp.clone()});snd.thud();sparks(gp,['#9a8a7a','#ffb060'],14,8)}
    w.at.b-=dt;if(w.at.b<=0){w.at.b=4.5;let car=null,bd=50;for(const p of props){if(p.held||p.kind!=='car'||p===dragProp?.p)continue;const d=p.g.position.distanceTo(gp);if(d<bd){bd=d;car=p}}
      if(car){const from=gp.clone().add(new THREE.Vector3(0,10,0));car.g.position.copy(from);const T=1.4,tgt=P.clone();car.v.copy(tgt.sub(from).multiplyScalar(1/T));car.v.y+=.5*24*T;car.rest=false;car.enemy=true;car.av.set(2,1,3);floater('машина летит!',from,'#d94a3a')}}}
  else{const tp=P.clone().add(new THREE.Vector3(Math.sin(w.t*.35)*20,8,Math.cos(w.t*.35)*20));if(steal&&w.kind==='mozg')tp.copy(steal.b.c).add(new THREE.Vector3(0,26,0));gp.lerp(tp,1-Math.exp(-.7*dt));gp.y=Math.max(gp.y,heightAt(gp.x,gp.z,4)+6)}
  if(w.kind==='lex'){w.at.a-=dt;if(w.at.a<=0){w.at.a=2.6;for(const s of[-1,1])eshot(gp.clone().add(new THREE.Vector3(s*2.5,1,0)),P,{col:'#9a4ad0',sp:13,dmg:w.roam?6+S.roamLvl*2:10,label:'Энергосфера',home:2.2,r:.6})}
    w.at.b-=dt;if(w.at.b<=0&&!(w.roam&&S.roamLvl===0)){w.at.b=w.roam?16:10;for(let i=0;i<(w.roam?1:2);i++){const d=makeVillain('drone');d.g.position.copy(gp).add(new THREE.Vector3((i?4:-4),2,0));scene.add(d.g);witches.push(Object.assign(d,{v:new THREE.Vector3(),st:0,t:0,ph:Math.random()*6,spin:0}))}floater('дроны, в атаку!',gp.clone().add(new THREE.Vector3(0,6,0)),'#6a3a9a')}}
  if(w.kind==='mozg'){w.at.a-=dt;if(w.at.a<=0){w.at.a=3;eshot(gp.clone().add(new THREE.Vector3(0,-2,0)),P,{col:'#4affb0',sp:22,dmg:8,label:'Разряд луча'})}
    w.at.b-=dt;if(w.at.b<=0&&!steal){w.at.b=11;let best=null,bd=1e9;for(const b of blds){if(b.stolen||b.lift>0)continue;const d=(b.c.x-gp.x)**2+(b.c.z-gp.z)**2;if(d<bd){bd=d;best=b}}
      if(best){steal={b:best,t:0};best.s.h0=best.s.h;best.s.h=0;floater('луч-похититель!',best.c.clone().add(new THREE.Vector3(0,10,0)),'#2f9a4a')}}}}
function cancelSteal(save){if(!steal)return;steal.b.back=true;if(save){floater('здание спасено!',steal.b.c.clone().add(new THREE.Vector3(0,8,0)),'#2f6b32');earn(3,steal.b.c)}steal=null}
function stepV3(dt){
  // tractor beam + building lifting/returning
  if(steal&&bossW?.kind==='mozg'){steal.t+=dt;const b=steal.b;b.lift=Math.min(24,steal.t*4);
    if(!beamM){beamM=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,16,1,true).translate(0,.5,0).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:'#6aff8a',transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}));scene.add(beamM)}
    const top=bossW.g.position,bot=b.c.clone().setY(b.lift+b.c.y);beamM.visible=true;beamM.position.copy(top);beamM.lookAt(bot);beamM.scale.set(4,4,top.distanceTo(bot));
    if(steal.t>6.5){b.stolen=true;b.meshes.forEach(m=>m.visible=false);S.stolen++;floater('здание украдено!',top.clone(),'#d94a3a');steal=null;ui()}}
  else{if(beamM)beamM.visible=false;if(steal&&!bossW){cancelSteal(true)}}
  for(const b of blds){if(b.back){b.lift=Math.max(0,b.lift-dt*18);if(b.lift===0){b.back=false;b.s.h=b.s.h0??b.s.h;snd.thud()}}
    if(b.lift!==b.lastL){b.meshes.forEach((m,i)=>m.position.y=b.y0[i]+b.lift);b.lastL=b.lift}}
  // shockwaves
  for(const w of waves){w.r+=dt*20;w.ring.scale.setScalar(w.r);w.ring.material.opacity=Math.max(0,.8-w.r/40);
    const d=Math.hypot(P.x-w.c.x,P.z-w.c.z);if(!w.hitH&&Math.abs(d-w.r*1.2)<2.2&&P.y-heightAt(P.x,P.z)<6){w.hitH=true;hurt(15,'Ударная волна')}
    for(const p of props){if(p.held||!p.rest)continue;const pd=Math.hypot(p.g.position.x-w.c.x,p.g.position.z-w.c.z);if(Math.abs(pd-w.r*1.2)<1.5){p.rest=false;p.v.y+=6;p.av.set(1,0,1)}}}
  waves=waves.filter(w=>{if(w.r<34)return true;scene.remove(w.ring);return false});
  // villain projectiles (the only way villains deal damage)
  for(const e of eproj){e.t+=dt;if(e.home){const want=P.clone().add(new THREE.Vector3(0,.5,0)).sub(e.m.position).normalize().multiplyScalar(e.sp);e.v.lerp(want,1-Math.exp(-e.home*dt))}
    e.m.position.addScaledVector(e.v,dt);if(Math.random()<.3)sparks(e.m.position,[e.col],1,1);
    if(!e.refl&&e.m.position.distanceTo(P)<(S.act.shield>0?2.8:1.9)){if(S.act.shield>0){e.refl=true;e.home=0;e.t=4;e.v.negate().multiplyScalar(1.4);floater('Отражение!',P.clone().add(new THREE.Vector3(0,3,0)),DCOL.reflect);snd.catch()}else{e.t=99;hurt(e.dmg,e.label)}sparks(P,[e.col,'#ffffff'],10,6)}
    if(e.refl)for(const w of witches){if(w.st===2)continue;if(w.g.position.distanceTo(e.m.position)<w.hr){hit(w,DMG.shield()+e.dmg,e.v,'Отражение',DCOL.reflect);e.t=99;break}}
    for(const b of blasts)if(b.m.position.distanceTo(e.m.position)<1.8){e.t=99;sparks(e.m.position,[e.col,'#4ad0ff'],8,6)}
    if(e.m.position.y<heightAt(e.m.position.x,e.m.position.z))e.t=99}
  eproj=eproj.filter(e=>{if(e.t<7)return true;scene.remove(e.m);return false});
  stepCitizens(dt);
  rescueT-=dt;if(rescueT<=0){rescueT=.3;$('rescue').textContent=`🏙 Город спасён на ${rescuePct()}%`}
  const bh=$('bossHud');bh.hidden=!bossW||S.phase!=='play';if(bossW){$('bossName').textContent=bossW.name;$('bossNum').textContent=`${Math.max(0,Math.ceil(bossW.hp))} / ${bossW.max}`;const f=Math.max(0,bossW.hp/bossW.max);$('bossFill').style.width=f*100+'%';$('bossFill').style.background=`hsl(${Math.round(120*f)},75%,45%)`}}
let rescueT=0;
function rescuePct(){const calm=citizens.length?citizens.filter(c=>!c.scared).length/citizens.length:1;
  const bossPart=S.bossDone?1:bossW?1-Math.max(0,bossW.hp)/bossW.max:0;
  return Math.max(0,Math.min(100,Math.round(40*S.score/5+40*bossPart+20*calm-7*S.stolen)))}
// citizens
const SHIRTS=['#d94a3a','#2f6fb0','#e8b84a','#4a9a7a','#8a5ab0','#f2f2ee','#ff8a3a'];
function makeCitizen(r){const g=new THREE.Group(),sh=SHIRTS[Math.floor(r()*SHIRTS.length)],sk=['#f1c6a0','#d8a07a','#a8704a','#f4d8b8'][Math.floor(r()*4)];
  const legs=[];for(const s of[-1,1]){const l=new THREE.Group();l.position.set(.13*s,.8,0);l.add(mesh(box,'#3a4a6a',.18,.8,.2,0,-.4,0));g.add(l);legs.push(l)}
  g.add(mesh(box,sh,.55,.7,.32,0,1.15,0));g.add(mesh(sphere,sk,.2,.22,.2,0,1.72,0));g.add(mesh(sphere,['#3a2a20','#e8c870','#7a3a20','#202020'][Math.floor(r()*4)],.21,.14,.21,0,1.82,-.02));
  const arms=[];for(const s of[-1,1]){const a=new THREE.Group();a.position.set(.36*s,1.45,0);a.add(mesh(box,sh,.14,.6,.14,0,-.3,0));a.add(mesh(sphere,sk,.08,.08,.08,0,-.62,0));g.add(a);arms.push(a)}
  g.scale.setScalar(1.1);return{g,legs,arms}}
function spawnCitizens(r){citizens=[];const lanes=[[-26.1,-70,70],[-17.7,-70,70],[1.9,-70,70],[10.2,-70,70],[29.6,-70,70]];
  for(let i=0;i<26;i++){const L=lanes[i%lanes.length];let x=L[1]+r()*(L[2]-L[1]);if(Math.abs(x+15)<6)x+=12;const c=makeCitizen(r);c.g.position.set(x,heightAt(x,L[0]),L[0]);world.add(c.g);
    citizens.push(Object.assign(c,{z:L[0],dir:r()<.5?-1:1,sp:1+r()*.8,ph:r()*6,scared:false,sc:0,cheer:0,rescued:0}))}}
function stepCitizens(dt){for(const c of citizens){const g=c.g,p=g.position;let near=null,nd=20;
    for(const w of witches){if(w.st===2)continue;const d=Math.hypot(w.g.position.x-p.x,w.g.position.z-p.z);if(d<(w.big?34:20)&&d<nd+ (w.big?14:0)){nd=d;near=w}}
    if(near){if(!c.scared&&Math.random()<.3)floater('ой!',p.clone().add(new THREE.Vector3(0,2.6,0)),'#7a5ab8');c.scared=true;c.sc=0;c.dir=Math.sign(p.x-near.g.position.x)||1}
    else if(c.scared){c.sc+=dt;if(c.sc>1.2){c.scared=false;c.cheer=2.6;if(c.rescued<3&&S.phase==='play'){c.rescued++;S.rescued++;earn(1,p.clone().add(new THREE.Vector3(0,1,0)));floater('ура, Капитан!',p.clone().add(new THREE.Vector3(0,3,0)),'#2f6b32')}}}
    c.ph+=dt*(c.scared?14:6);
    if(c.cheer>0){c.cheer-=dt;g.position.y=heightAt(p.x,c.z)+Math.abs(Math.sin(c.cheer*6))*.5;c.arms.forEach((a,i)=>{a.rotation.x=Math.PI;a.rotation.z=(i?-1:1)*(.3+Math.sin(c.cheer*12)*.4)});g.rotation.y=Math.atan2(P.x-p.x,P.z-p.z);continue}
    const sp=c.scared?5:c.sp;let nx=p.x+c.dir*sp*dt;if(Math.abs(nx)>72||Math.abs(nx+15)<5.5||heightAt(nx,c.z)>heightAt(p.x,c.z)+.6){c.dir*=-1;nx=p.x}
    p.x=nx;p.y=heightAt(p.x,c.z);g.rotation.y=c.dir>0?Math.PI/2:-Math.PI/2;
    c.legs.forEach((l,i)=>l.rotation.x=Math.sin(c.ph+i*Math.PI)*.6);c.arms.forEach((a,i)=>{a.rotation.x=c.scared?Math.PI+Math.sin(c.ph+i)*.3:Math.sin(c.ph+i*Math.PI+Math.PI)*.5;a.rotation.z=c.scared?(i?-.4:.4):0})}}
// walking mode
const FOOT=2.05;let vy=0,onGround=false,walkPh=0;const joy={x:0,y:0,on:false};
function toggleWalk(){if(S.phase!=='play')return;S.walk=!S.walk;vy=0;if(S.walk){camDist=Math.min(camDist,14);floater('пешком!',P.clone().add(new THREE.Vector3(0,3,0)),'#2a6f8f')}else{if(held&&false);floater('полетели!',P.clone().add(new THREE.Vector3(0,3,0)),'#2a6f8f')}hideHint();ui()}
function jump(){if(S.walk&&onGround&&S.tired<=0){vy=12;onGround=false;snd.toss()}}
function walkStep(dt){let f=0,s=0;
  if(keys.has('KeyW')||keys.has('ArrowUp'))f+=1;if(keys.has('KeyS')||keys.has('ArrowDown'))f-=1;if(keys.has('KeyA')||keys.has('ArrowLeft'))s-=1;if(keys.has('KeyD')||keys.has('ArrowRight'))s+=1;
  f+=-joy.y;s+=joy.x;const cd=camDir();cd.y=0;cd.normalize();const rt=new THREE.Vector3(-cd.z,0,cd.x);const mv=cd.multiplyScalar(f).addScaledVector(rt,s);
  if(steer){const t=steerPoint(true),dx=t.x-P.x,dz=t.z-P.z,dd=Math.hypot(dx,dz);if(dd>1.2)mv.set(dx/dd,0,dz/dd)}const l=Math.min(1,mv.length());
  if(l>.05){mv.normalize();const want=Math.atan2(mv.x,mv.z);yaw+=Math.atan2(Math.sin(want-yaw),Math.cos(want-yaw))*Math.min(1,dt*10);hideHint()}
  const sp=9*(S.act.speed>0?2:1)*l;const nx=P.x+mv.x*sp*dt,nz=P.z+mv.z*sp*dt,feet=P.y-FOOT;
  if(heightAt(nx,nz,.4)<=feet+1.3){P.x=Math.max(-95,Math.min(95,nx));P.z=Math.max(-80,Math.min(90,nz))}
  vy-=30*dt;P.y+=vy*dt;const gy=heightAt(P.x,P.z,.4)+FOOT;if(P.y<=gy){P.y=gy;vy=0;onGround=true}else onGround=P.y-gy<.05;
  vel.set(mv.x*sp,vy,mv.z*sp);walkPh+=sp*dt*1.1;turnRate=0;return sp}

// ---------- UI ----------
const $=id=>document.getElementById(id);
function plural(n){const t=n%10,h=n%100;return t===1&&h!==11?'район':t>=2&&t<=4&&(h<12||h>14)?'района':'районов'}
function ui(){const ph=S.phase,md=meadow(S.round);
  $('menu').hidden=ph!=='menu';$('shop').hidden=ph!=='shop';$('stars').textContent=S.stars;$('pause').hidden=ph!=='pause';$('clear').hidden=ph!=='clear';
  $('hud').hidden=ph==='menu';$('catcher').hidden=ph!=='play';$('fireBtn').hidden=ph!=='play';$('grabBtn').hidden=ph!=='play';$('walkBtn').hidden=ph!=='play';$('walkBtn').innerHTML=S.walk?'🦸 Лететь':'🚶 Идти';$('joy').hidden=!(ph==='play'&&S.walk);$('rescue').hidden=ph!=='play';$('hint').hidden=!(ph==='play'&&hintOn);
  $('grabTxt').textContent=held?'Бросить':'Схватить';$('grabBtn').classList.toggle('on',!!held);
  $('score').textContent=`${S.score} / 5`;$('chased').textContent=S.chased;$('chasedPill').hidden=S.round<2&&S.chased===0;
  $('meadow').textContent=`${S.round}. ${md.name}`;
  $('wind').hidden=!S.wind;$('wind').textContent=S.wind>0?'Бриз →':'← Бриз';
  $('carry').hidden=carry||ph!=='play';$('carry').textContent='Ой, подарок! Герой летит за ним';
  $('muteBtn').textContent=S.muted?'🔇':'🔊';$('muteBtn2').textContent=S.muted?'Звук выключен':'Звук включён';
  $('stats').hidden=!S.total;$('stats').textContent=`Подарено ${S.total} · рекорд ${S.best} ${plural(S.best)}`;
  $('clearStats').textContent=$('stats').textContent;$('clearMeadow').textContent=md.name;
  $('pauseText').textContent=`Доставлено ${S.score} из 5. Можно продолжить, когда будете готовы.`}
function clearActors(){for(const e of eproj)scene.remove(e.m);eproj=[];for(const w of waves)scene.remove(w.ring);waves=[];if(beamM)beamM.visible=false;for(const w of witches){scene.remove(w.g);w.bar.dispose()}for(const b of blasts)scene.remove(b.m);if(drops)scene.remove(drops.m,drops.ring);for(const t of tosses)scene.remove(t.m)}
const startRound=()=>{clearActors();buildRound();S.phase='play';ui()};
$('startBtn').onclick=()=>{snd.unlock();snd.tap();S.round=Math.max(1,parseInt(new URLSearchParams(location.search).get('round'))||1);S.chased=0;hintOn=true;startRound()};
$('nextBtn').onclick=()=>{snd.tap();S.round++;hintOn=false;startRound()};
$('restartBtn').onclick=()=>{snd.tap();startRound()};
const toMenu=()=>{snd.tap();clearActors();S.round=1;buildRound();S.phase='menu';ui()};
$('menuBtn').onclick=toMenu;$('menuBtn2').onclick=toMenu;
$('pauseBtn').onclick=()=>{if(S.phase==='play'){S.phase='pause';ui()}};
$('resumeBtn').onclick=()=>{S.phase='play';ui()};
const toggleMute=()=>{S.muted=!S.muted;snd.setMuted(S.muted);if(!S.muted){snd.unlock();snd.tap()}save();ui()};
$('shopHud').onclick=()=>{if(S.phase!=='play')return;snd.tap();S.phase='pause';ui();openShop()};
$('shopBtn').onclick=()=>{snd.unlock();snd.tap();openShop()};$('shopBtn2').onclick=()=>{snd.tap();openShop()};
$('muteBtn').onclick=toggleMute;$('muteBtn2').onclick=toggleMute;
$('fireBtn').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fire()});
$('grabBtn').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();grab()});
addEventListener('keydown',e=>{if(S.phase==='play'&&(e.key.startsWith('Arrow')||e.code==='Space'))e.preventDefault();if(e.repeat)return;keys.add(e.code);
  if(e.code==='Space'){S.walk?jump():fire()}if(e.code==='KeyX'||e.code==='Enter')fire();if(e.code==='KeyT')toggleWalk();if(e.code==='KeyG'||e.code==='KeyF')grab();{const p=POWERS.find(p=>e.code==='Digit'+p.key||e.code==='Numpad'+p.key);if(p)usePower(p.id)}
  if(e.code==='Escape'||e.code==='KeyP'){if(S.phase==='play'){S.phase='pause';ui()}else if(S.phase==='pause'){S.phase='play';ui()}}});
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>keys.clear());
// pointer: drag = orbit camera; drag starting on an object = move/fling it; pinch/wheel = zoom; double tap = blast
const catcher=$('catcher'),ptrs=new Map(),ray=new THREE.Raycaster();let lastTap=0,pinch0=0,dist0=0;
function ndc(e){return new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1)}
function pickProp(e){ray.setFromCamera(ndc(e),camera);const hits=ray.intersectObjects(props.filter(p=>!p.held&&p.g.position.distanceTo(P)<45).map(p=>p.g),true);
  if(!hits.length)return null;let o=hits[0].object;while(o&&!props.some(p=>p.g===o))o=o.parent;return props.find(p=>p.g===o)}
catcher.addEventListener('pointerdown',e=>{catcher.setPointerCapture(e.pointerId);snd.unlock();const po={x:e.clientX,y:e.clientY,orbit:e.button===2||e.clientX>innerWidth/2};ptrs.set(e.pointerId,po);
  if(ptrs.size===2){dragProp=null;if(steer){steer=null;manualT=2}const [a,b]=[...ptrs.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);dist0=camDist;return}
  const n=performance.now();if(n-lastTap<300){fire();lastTap=0}else lastTap=n;
  const p=e.button===2?null:pickProp(e);if(p)po.orbit=false;if(po.orbit)return;if(!p){steer={id:e.pointerId,x:e.clientX,y:e.clientY};hideHint()}if(p){dragProp={p,y:Math.max(p.g.position.y,heightAt(p.g.position.x,p.g.position.z)+p.half)+1.2,last:p.g.position.clone(),v:new THREE.Vector3()};p.rest=false;snd.grab();hideHint()}});
catcher.addEventListener('pointermove',e=>{const o=ptrs.get(e.pointerId);if(!o)return;const dx=e.clientX-o.x,dy=e.clientY-o.y;o.x=e.clientX;o.y=e.clientY;
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];camDist=clampD(dist0*pinch0/Math.max(20,Math.hypot(a.x-b.x,a.y-b.y)));camYaw-=dx*.003;camPitch=clampP(camPitch+dy*.002);camIdle=0;return}
  if(steer&&steer.id===e.pointerId){steer.x=e.clientX;steer.y=e.clientY;return}
  if(!o.orbit&&!dragProp)return;
  if(dragProp){ray.setFromCamera(ndc(e),camera);const pl=new THREE.Plane(new THREE.Vector3(0,1,0),-dragProp.y),hit=new THREE.Vector3();
    if(ray.ray.intersectPlane(pl,hit)&&hit.distanceTo(P)<45){const g=dragProp.p.g;dragProp.v.copy(hit).sub(g.position).multiplyScalar(30);g.position.set(hit.x,Math.max(dragProp.y,heightAt(hit.x,hit.z)+dragProp.p.half),hit.z)}return}
  camYaw-=dx*.006;camPitch=clampP(camPitch+dy*.004);camIdle=0;if(Math.abs(dx)+Math.abs(dy)>3)hideHint()});
const endPtr=e=>{ptrs.delete(e.pointerId);if(steer&&steer.id===e.pointerId){steer=null;manualT=2}if(dragProp&&!ptrs.size){const p=dragProp.p;p.v.copy(dragProp.v.clampLength(0,26));p.v.y+=2;p.rest=false;p.av.set(1,1,0);dragProp=null}};
catcher.addEventListener('pointerup',endPtr);catcher.addEventListener('pointercancel',endPtr);
catcher.addEventListener('wheel',e=>{e.preventDefault();camDist=clampD(camDist*(1+Math.sign(e.deltaY)*.1))},{passive:false});
$('walkBtn').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();toggleWalk()});
{const jb=$('joy'),kn=$('joyKnob');const mv=e=>{const r=jb.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,R=r.width/2;let x=(e.clientX-cx)/R,y=(e.clientY-cy)/R;const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}joy.x=x;joy.y=y;kn.style.transform=`translate(${x*R*.6}px,${y*R*.6}px)`};
  jb.addEventListener('pointerdown',e=>{if(e.target.id==='jumpBtn')return;e.preventDefault();e.stopPropagation();jb.setPointerCapture(e.pointerId);joy.on=true;mv(e)});jb.addEventListener('pointermove',e=>{if(joy.on)mv(e)});
  const up=()=>{joy.on=false;joy.x=joy.y=0;kn.style.transform=''};jb.addEventListener('pointerup',up);jb.addEventListener('pointercancel',up)}
$('jumpBtn').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();jump()});
document.querySelector('.game-root').addEventListener('contextmenu',e=>e.preventDefault());

function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<h?70:55;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
buildRound();camera.position.set(0,20,-50);
let last=performance.now();
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;if(S.phase!=='pause'&&S.phase!=='shop'){update(dt);stepPowers(dt)}powersTick();renderer.render(scene,camera);
  if(S.phase==='shop'&&pvHero){pvHero.rotation.y+=dt*.8;const a=pvHero.userData.cape.geometry.attributes.position,b=pvHero.userData.cape.userData.base;for(let i=0;i<a.count;i++){const t=-b[i*3+1]/2.3;a.setZ(i,-t*.3-Math.sin(n/150-t*6+b[i*3]*2)*.1*t)}a.needsUpdate=true;pvR.render(pvS,pvC)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
window.__hero={S,get witches(){return witches.length},get held(){return held&&held.kind},get props(){return props.length},get drops(){return !!drops},fire,grab,P,
  face(x,z){camYaw=Math.atan2(P.x-x,P.z-z);camPitch=.3;camIdle=-99},findCandidate,nearest(kind){let b=null,bd=1e9;for(const p of props){if(kind&&p.kind!==kind)continue;const d=p.g.position.distanceTo(P);if(d<bd){bd=d;b=p}}return b&&{x:b.g.position.x,z:b.g.position.z,d:bd}},
  faceWitch(){const w=witches.find(w=>w.st===0);if(!w)return false;camYaw=Math.atan2(P.x-w.g.position.x,P.z-w.g.position.z);camPitch=Math.max(-.05,Math.min(1.3,Math.atan2(P.y-w.g.position.y,Math.hypot(P.x-w.g.position.x,P.z-w.g.position.z))+.15));camIdle=-99;return true},
  hurt,get hp(){return S.hp},get villains(){return witches.map(w=>w.kind+':'+w.hp)},
  spawnBoss(){waveN=2;S.round=Math.max(3,S.round);spawnWave()},power:usePower,shop:openShop,get stars(){return S.stars},set stars(v){S.stars=v;ui()},
  steerAt(x,y){steer=x==null?null:{id:-1,x,y};if(x==null)manualT=2},get manual(){return !!steer||manualT>0},
  get traffic(){return traffic.length},get roamer(){return roamer&&{hp:roamer.hp,max:roamer.max,lvl:S.roamLvl}},callRoamer(){S.roamT=0},beatRoamer(){if(roamer)hit(roamer,9999,new THREE.Vector3(1,0,0),'удар','#d94a3a')},carPos(){const p=traffic[0];return p&&{x:p.g.position.x,z:p.g.position.z}},
  get cam(){return camYaw},startBoss,toggleWalk,get boss(){return bossW&&{k:bossW.kind,hp:bossW.hp,x:bossW.g.position.x,y:bossW.g.position.y,z:bossW.g.position.z}},get rescue(){return rescuePct()},get citizens(){return citizens.length},get cheering(){return citizens.filter(c=>c.cheer>0).length},get scared(){return citizens.filter(c=>c.scared).length},
  killBoss(){if(bossW)hit(bossW,9999,new THREE.Vector3(0,1,0),'удар','#d94a3a')},faceBoss(){if(!bossW)return;const p=bossW.g.position;camYaw=Math.atan2(P.x-p.x,P.z-p.z)+.35;camPitch=.15;camDist=34;camIdle=-99},
  setCam(y,p,d){camYaw=y;camPitch=p;camDist=d;camIdle=-99}};
