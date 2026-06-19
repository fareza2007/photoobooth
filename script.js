/* ============================================================
   KACHEES PHOTOBOOTH v3 — script.js
   No external runtime dependencies (no CDN scripts needed)
   ============================================================ */

'use strict';

/* ── Sticker Library ───────────────────────────────────────────────────── */
const STICKERS = {
    cute:   ['🌸','🌺','🌻','💐','🌷','🎀','💕','💖','💗','✨','⭐','🌟','💫','🦋','🐱','🐰','🐼','🌈','🫶','🥰'],
    food:   ['🍰','🧁','🍩','🍫','🍓','🍒','🍑','🍬','🧃','☕','🍵','🥤','🎂','🍮','🍡','🍭','🧋','🫖','🍦','🍧'],
    nature: ['🌿','🌱','🍃','🌾','🌼','🌙','☀️','🌤️','❄️','🍂','🍁','🐝','🦚','🌴','🌊','🏔️','🌺','🪴','🍄','🌬️'],
    vibe:   ['💿','📸','🎵','🎶','🎤','🎧','📷','📼','✌️','🤙','👑','💎','🔮','🎭','🪄','🎪','🎠','🛸','🌀','⚡'],
    text:   ['❤️','💯','🆗','🆙','❗','❓','‼️','✅','🔥','😊','😍','🥰','😎','🤩','😜','🤪','😴','🥳','🎉','🥹'],
};

/* ── Filter CSS strings ────────────────────────────────────────────────── */
const FILTERS = {
    none:    '',
    vintage: 'sepia(0.6) contrast(1.1) brightness(0.9) saturate(0.8)',
    dreamy:  'brightness(1.1) saturate(1.3) hue-rotate(330deg) contrast(0.9)',
    noir:    'grayscale(1) contrast(1.2) brightness(0.9)',
    golden:  'sepia(0.4) saturate(1.5) brightness(1.1) hue-rotate(-10deg)',
    cool:    'hue-rotate(195deg) saturate(1.2) brightness(1.05)',
    vivid:   'saturate(2) contrast(1.1)',
    soft:    'brightness(1.08) saturate(0.7) contrast(0.9)',
    rose:    'sepia(0.3) saturate(1.4) hue-rotate(300deg) brightness(1.05)',
    summer:  'saturate(1.5) brightness(1.1) hue-rotate(15deg)',
};

/* ── Frame canvas painters ─────────────────────────────────────────────── */
const FRAMES = {
    pastel: {
        bg(ctx,w,h){
            const g=ctx.createLinearGradient(0,0,w,h);
            g.addColorStop(0,'#ffd6eb');g.addColorStop(1,'#f5d6ff');
            ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
            ctx.fillStyle='rgba(255,255,255,0.28)';
            for(let x=14;x<w;x+=22)for(let y=14;y<h;y+=22){ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();}
        },
        decorTop(ctx,w){ctx.font='20px serif';ctx.textAlign='center';ctx.fillText('🌸',w*.2,34);ctx.fillText('⭐',w*.5,28);ctx.fillText('🌷',w*.8,34);},
        decorBottom(ctx,w,h){
            ctx.fillStyle='rgba(255,200,230,0.6)';ctx.fillRect(0,h-54,w,54);
            ctx.font='bold 13px Pacifico,cursive';ctx.textAlign='center';ctx.fillStyle='#c060a0';ctx.fillText('kachees ✨',w/2,h-34);
            ctx.font='10px Nunito,sans-serif';ctx.fillStyle='#d070b0';ctx.fillText(dateStr(),w/2,h-16);
        },
        border:{color:'#ffaacc',width:3}, gap:8, pad:14, top:48, bot:54,
    },
    y2k: {
        bg(ctx,w,h){
            ctx.fillStyle='#111';ctx.fillRect(0,0,w,h);
            for(let y=0;y<h;y+=40){ctx.fillStyle='rgba(255,0,127,0.05)';ctx.fillRect(0,y,w,1.5);}
        },
        decorTop(ctx,w){
            ctx.font='bold 15px Impact,sans-serif';ctx.textAlign='left';ctx.fillStyle='#ff007f';ctx.fillText('★ KACHEES ★',12,30);
            ctx.font='18px serif';ctx.textAlign='right';ctx.fillStyle='white';ctx.fillText('💿',w-12,30);
        },
        decorBottom(ctx,w,h){
            ctx.fillStyle='#ff007f';ctx.fillRect(0,h-46,w,46);
            ctx.font='bold 12px Impact,sans-serif';ctx.textAlign='center';ctx.fillStyle='white';ctx.fillText('★ KACHEES PHOTOBOOTH ★',w/2,h-26);
            ctx.font='9px Courier New';ctx.fillStyle='rgba(255,255,255,0.7)';ctx.fillText(dateStr(),w/2,h-10);
        },
        border:{color:'#ff007f',width:4}, gap:10, pad:12, top:44, bot:46,
    },
    film: {
        bg(ctx,w,h){
            ctx.fillStyle='#0f0f0f';ctx.fillRect(0,0,w,h);
            for(let i=0;i<2000;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*.035})`;ctx.fillRect(Math.random()*w,Math.random()*h,1,1);}
        },
        decorTop(ctx,w){
            ctx.fillStyle='#2a2a2a';
            const g=(w-8)/5,hw=12,hh=8;
            for(let i=0;i<5;i++){ctx.beginPath();ctx.roundRect(6+i*g,5,hw,hh,2);ctx.fill();}
            ctx.font='9px Courier New';ctx.textAlign='center';ctx.fillStyle='#666';ctx.fillText('KODAK · ULTRAMAX 400',w/2,30);
        },
        decorBottom(ctx,w,h){
            ctx.fillStyle='#2a2a2a';
            const g=(w-8)/5,hw=12,hh=8;
            for(let i=0;i<5;i++){ctx.beginPath();ctx.roundRect(6+i*g,h-14,hw,hh,2);ctx.fill();}
            ctx.font='bold 11px Courier New';ctx.textAlign='center';ctx.fillStyle='#aaa';ctx.fillText('📽️ kachees · '+new Date().getFullYear(),w/2,h-20);
        },
        border:{color:'#2a2a2a',width:2}, gap:6, pad:10, top:40, bot:38,
    },
    coquette: {
        bg(ctx,w,h){
            const g=ctx.createLinearGradient(0,0,0,h);
            g.addColorStop(0,'#ffe0f0');g.addColorStop(1,'#ffd0e8');
            ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
            ctx.setLineDash([4,4]);ctx.strokeStyle='rgba(255,100,150,0.3)';ctx.lineWidth=1.5;ctx.strokeRect(6,6,w-12,h-12);ctx.setLineDash([]);
        },
        decorTop(ctx,w){ctx.font='22px serif';ctx.textAlign='center';ctx.fillText('🎀',w*.2,34);ctx.fillText('♡',w*.5,26);ctx.fillText('🎀',w*.8,34);},
        decorBottom(ctx,w,h){
            const g=ctx.createLinearGradient(0,h-52,w,h);g.addColorStop(0,'#ffb3cc');g.addColorStop(1,'#ff80aa');
            ctx.fillStyle=g;ctx.fillRect(0,h-52,w,52);
            ctx.font='bold 12px serif';ctx.textAlign='center';ctx.fillStyle='white';ctx.fillText('♡ kachees ♡',w/2,h-30);
            ctx.font='10px serif';ctx.fillStyle='rgba(255,255,255,0.8)';ctx.fillText(dateStr(),w/2,h-14);
        },
        border:{color:'#ffaacc',width:3}, gap:8, pad:14, top:46, bot:52,
    },
    matcha: {
        bg(ctx,w,h){
            const g=ctx.createLinearGradient(0,0,w,h);
            g.addColorStop(0,'#d4ead0');g.addColorStop(1,'#b8d4b0');
            ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
        },
        decorTop(ctx,w){ctx.font='20px serif';ctx.textAlign='center';ctx.fillText('🍵',w*.18,34);ctx.fillText('🌿',w*.5,28);ctx.fillText('☘️',w*.82,34);},
        decorBottom(ctx,w,h){
            ctx.fillStyle='#5a8a50';ctx.fillRect(0,h-48,w,48);
            ctx.font='bold 12px Nunito,sans-serif';ctx.textAlign='center';ctx.fillStyle='white';ctx.fillText('🍵 kachees',w/2,h-28);
            ctx.font='10px Nunito,sans-serif';ctx.fillStyle='rgba(255,255,255,0.75)';ctx.fillText(dateStr(),w/2,h-12);
        },
        border:{color:'#8ab880',width:3}, gap:8, pad:14, top:46, bot:48,
    },
    starry: {
        bg(ctx,w,h){
            const g=ctx.createLinearGradient(0,0,0,h);
            g.addColorStop(0,'#0d1b4b');g.addColorStop(1,'#1a0a3b');
            ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
            for(let i=0;i<120;i++){ctx.fillStyle=`rgba(255,255,200,${.3+Math.random()*.7})`;ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,Math.random()*1.5,0,Math.PI*2);ctx.fill();}
        },
        decorTop(ctx,w){ctx.font='20px serif';ctx.textAlign='center';ctx.fillText('🌙',w*.18,34);ctx.fillText('✦',w*.5,26);ctx.fillText('⭐',w*.82,34);},
        decorBottom(ctx,w,h){
            ctx.fillStyle='#ffd700';ctx.fillRect(0,h-48,w,48);
            ctx.font='bold 12px Nunito,sans-serif';ctx.textAlign='center';ctx.fillStyle='#1a0a3b';ctx.fillText('✦ kachees ✦',w/2,h-28);
            ctx.font='10px Nunito,sans-serif';ctx.fillStyle='rgba(26,10,59,0.7)';ctx.fillText(dateStr(),w/2,h-12);
        },
        border:{color:'#ffd700',width:3}, gap:8, pad:12, top:46, bot:48,
    },
    bubblegum: {
        bg(ctx,w,h){
            const g=ctx.createLinearGradient(0,0,w,h);
            g.addColorStop(0,'#ff80cc');g.addColorStop(1,'#cc40ff');
            ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
            ctx.fillStyle='rgba(255,255,255,0.18)';
            for(let x=12;x<w;x+=22)for(let y=12;y<h;y+=22){ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();}
        },
        decorTop(ctx,w){ctx.font='20px serif';ctx.textAlign='center';ctx.fillText('🍬',w*.18,34);ctx.fillText('💜',w*.5,28);ctx.fillText('🍬',w*.82,34);},
        decorBottom(ctx,w,h){
            ctx.fillStyle='#9900cc';ctx.fillRect(0,h-48,w,48);
            ctx.font='bold 12px Nunito,sans-serif';ctx.textAlign='center';ctx.fillStyle='white';ctx.fillText('🍬 kachees 🍬',w/2,h-28);
            ctx.font='10px Nunito,sans-serif';ctx.fillStyle='rgba(255,255,255,0.7)';ctx.fillText(dateStr(),w/2,h-12);
        },
        border:{color:'#cc00ff',width:3}, gap:8, pad:12, top:46, bot:48,
    },
    minimal: {
        bg(ctx,w,h){
            ctx.fillStyle='#f9f9f9';ctx.fillRect(0,0,w,h);
            ctx.strokeStyle='#e0e0e0';ctx.lineWidth=1;ctx.strokeRect(7,7,w-14,h-14);
        },
        decorTop(ctx,w){ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillStyle='#ccc';ctx.fillText('· · · · ·',w/2,24);},
        decorBottom(ctx,w,h){
            ctx.strokeStyle='#e0e0e0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(20,h-42);ctx.lineTo(w-20,h-42);ctx.stroke();
            ctx.font='bold 12px Nunito,sans-serif';ctx.textAlign='center';ctx.fillStyle='#888';ctx.fillText('kachees',w/2,h-24);
            ctx.font='10px Nunito,sans-serif';ctx.fillStyle='#aaa';ctx.fillText(dateStr(),w/2,h-10);
        },
        border:{color:'#ddd',width:2}, gap:6, pad:16, top:36, bot:46,
    },
};

/* ── Helpers ───────────────────────────────────────────────────────────── */
function dateStr() {
    return new Date().toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
}
function rrect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
}
function loadImg(src){
    return new Promise((ok,fail)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=fail;i.src=src;});
}
function applyFilter(img,w,h,f){
    const c=document.createElement('canvas');c.width=w;c.height=h;
    const x=c.getContext('2d');if(f)x.filter=f;
    x.drawImage(img,0,0,w,h);return c;
}
function showScreen(id){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    const sc=document.getElementById(id);if(sc){sc.classList.add('active');window.scrollTo({top:0});}
}

/* ── State ─────────────────────────────────────────────────────────────── */
let stream=null, totalShots=4, layout='strip', frameStyle='pastel', currentFilter='none';
let photos=[], stickerEls=[], isDrag=false, dragEl=null, dragOX=0, dragOY=0, stickerSize=2.2;

/* ════════════════════════════════════════════════════════════════════════
   BOOT
════════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded',()=>{

    /* ── Back buttons ── */
    document.querySelectorAll('[data-target]').forEach(b=>
        b.addEventListener('click',()=>showScreen(b.dataset.target))
    );

    /* ══════════════════════════════════════
       S1 → S2: Start
    ══════════════════════════════════════ */
    document.getElementById('btn-start').addEventListener('click',()=>showScreen('screen-grid'));

    /* ══════════════════════════════════════
       S2 → S2b: Grid pick
    ══════════════════════════════════════ */
    document.querySelectorAll('.grid-card').forEach(card=>{
        card.addEventListener('click',()=>{
            document.querySelectorAll('.grid-card').forEach(c=>c.classList.remove('selected'));
            card.classList.add('selected');
            totalShots=parseInt(card.dataset.shots);
            layout=card.dataset.layout;
            showScreen('screen-frame');
        });
    });

    /* ══════════════════════════════════════
       S2b: Frame style pick
    ══════════════════════════════════════ */
    const goBtn=document.getElementById('btn-go-camera');
    document.querySelectorAll('.frame-card').forEach(card=>{
        card.addEventListener('click',()=>{
            document.querySelectorAll('.frame-card').forEach(c=>c.classList.remove('selected'));
            card.classList.add('selected');
            frameStyle=card.dataset.style;
            goBtn.style.display='inline-flex';
        });
    });
    goBtn.addEventListener('click',async()=>{await startCamera();setupCamera();showScreen('screen-camera');});

    /* ══════════════════════════════════════
       S3: Camera
    ══════════════════════════════════════ */
    async function startCamera(){
        if(stream){stream.getTracks().forEach(t=>t.stop());}
        try{
            stream=await navigator.mediaDevices.getUserMedia({
                video:{facingMode:'user',width:{ideal:1280},height:{ideal:960}},audio:false
            });
            document.getElementById('video').srcObject=stream;
        }catch(e){
            alert('⚠️ Camera permission denied. Please allow access and try again.');
            console.error(e);
        }
    }

    function setupCamera(){
        photos=[];
        document.getElementById('shot-counter').textContent=`📷 1 / ${totalShots}`;
        document.getElementById('shoot-hint').textContent='Tap the button to start your photo sequence!';
        const tc=document.getElementById('thumbs');tc.innerHTML='';
        for(let i=0;i<totalShots;i++){
            const d=document.createElement('div');d.className='thumb';d.id=`th${i}`;tc.appendChild(d);
        }
        document.getElementById('btn-shoot').onclick=()=>startSeq();
    }

    let seqRunning=false;
    function startSeq(){
        if(seqRunning)return;seqRunning=true;
        document.getElementById('btn-shoot').disabled=true;
        document.getElementById('shoot-hint').textContent='Get ready! 😊';
        nextShot();
    }
    function nextShot(){
        if(photos.length>=totalShots){
            seqRunning=false;
            document.getElementById('btn-shoot').disabled=false;
            document.getElementById('shoot-hint').textContent='✅ All done! Moving to filters…';
            if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
            setTimeout(()=>{buildFilterPreview();showScreen('screen-filter');},700);
            return;
        }
        countdown(3,()=>{
            snap();
            const taken=photos.length;
            document.getElementById('shot-counter').textContent=`📷 ${Math.min(taken+1,totalShots)} / ${totalShots}`;
            document.getElementById('shoot-hint').textContent=`${taken} / ${totalShots} — keep posing! 😄`;
            setTimeout(nextShot,900);
        });
    }

    function countdown(from,done){
        const el=document.getElementById('countdown');
        let n=from;
        el.textContent=n;el.classList.remove('hidden');
        el.style.animation='none';void el.offsetWidth;el.style.animation='countPop 1s ease-out forwards';
        const iv=setInterval(()=>{
            n--;
            if(n<=0){clearInterval(iv);el.classList.add('hidden');done();}
            else{
                el.textContent=n;
                el.style.animation='none';void el.offsetWidth;el.style.animation='countPop 1s ease-out forwards';
            }
        },1000);
    }

    function snap(){
        const fl=document.getElementById('flash');fl.style.opacity='1';setTimeout(()=>fl.style.opacity='0',130);
        const vid=document.getElementById('video'),cv=document.getElementById('cap-canvas');
        cv.width=vid.videoWidth||640;cv.height=vid.videoHeight||480;
        const ctx=cv.getContext('2d');ctx.translate(cv.width,0);ctx.scale(-1,1);
        ctx.drawImage(vid,0,0,cv.width,cv.height);
        const url=cv.toDataURL('image/jpeg',.92);
        photos.push(url);
        const slot=document.getElementById(`th${photos.length-1}`);
        if(slot){slot.classList.add('filled');const img=document.createElement('img');img.src=url;slot.appendChild(img);}
    }

    /* ══════════════════════════════════════
       S4: Filter
    ══════════════════════════════════════ */
    function buildFilterPreview(){
        const area=document.getElementById('filter-preview-area');area.innerHTML='';
        const strip=document.createElement('div');strip.className='filter-preview-strip';
        if(layout==='2x2')strip.classList.add('layout-2x2');
        if(layout==='wide')strip.classList.add('layout-wide');
        photos.forEach(src=>{
            const img=document.createElement('img');img.src=src;img.className='fprev-img';
            img.style.filter=FILTERS[currentFilter]||'';strip.appendChild(img);
        });
        area.appendChild(strip);
    }

    document.querySelectorAll('.filter-chip').forEach(chip=>{
        chip.addEventListener('click',()=>{
            document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter=chip.dataset.filter;
            document.querySelectorAll('.fprev-img').forEach(img=>img.style.filter=FILTERS[currentFilter]||'');
        });
    });

    document.getElementById('btn-to-sticker').addEventListener('click',()=>{buildStickerStage();showScreen('screen-sticker');});

    /* ══════════════════════════════════════
       S5: Sticker
    ══════════════════════════════════════ */
    function buildStickerStage(){
        stickerEls=[];
        const ph=document.getElementById('sticker-photos');ph.innerHTML='';
        ph.className='sticker-photos';
        if(layout==='2x2')ph.classList.add('layout-2x2');
        if(layout==='wide')ph.classList.add('layout-wide');
        photos.forEach(src=>{
            const img=document.createElement('img');img.src=src;
            img.style.filter=FILTERS[currentFilter]||'';ph.appendChild(img);
        });
        document.getElementById('sticker-layer').innerHTML='';
        loadCat('cute');

        document.querySelectorAll('.scat').forEach(b=>{
            b.addEventListener('click',()=>{
                document.querySelectorAll('.scat').forEach(x=>x.classList.remove('active'));
                b.classList.add('active');loadCat(b.dataset.cat);
            });
        });
    }

    function loadCat(cat){
        const g=document.getElementById('sticker-grid');g.innerHTML='';
        (STICKERS[cat]||[]).forEach(e=>{
            const s=document.createElement('span');s.className='s-opt';s.textContent=e;
            s.addEventListener('click',()=>placeSticker(e));g.appendChild(s);
        });
    }

    function placeSticker(emoji){
        const stage=document.getElementById('sticker-stage');
        const r=stage.getBoundingClientRect();
        const fs=Math.round(stickerSize*16);
        const x=32+Math.random()*(r.width-64);
        const y=32+Math.random()*(r.height-64);
        const el=document.createElement('span');
        el.className='placed';el.textContent=emoji;
        el.style.left=x+'px';el.style.top=y+'px';el.style.fontSize=fs+'px';
        el.addEventListener('mousedown', e=>{e.preventDefault();startDrag(el,e.clientX,e.clientY);});
        el.addEventListener('touchstart',e=>{e.preventDefault();startDrag(el,e.touches[0].clientX,e.touches[0].clientY);},{passive:false});
        document.getElementById('sticker-layer').appendChild(el);
        stickerEls.push(el);
    }

    function startDrag(el,cx,cy){
        isDrag=true;dragEl=el;
        const r=el.getBoundingClientRect();dragOX=cx-r.left;dragOY=cy-r.top;
        el.style.zIndex=999;
    }
    document.addEventListener('mousemove', e=>{if(isDrag)moveDrag(e.clientX,e.clientY);});
    document.addEventListener('touchmove', e=>{if(isDrag){e.preventDefault();moveDrag(e.touches[0].clientX,e.touches[0].clientY);}},{passive:false});
    function moveDrag(cx,cy){
        const r=document.getElementById('sticker-stage').getBoundingClientRect();
        dragEl.style.left=(cx-r.left-dragOX)+'px';
        dragEl.style.top =(cy-r.top -dragOY)+'px';
    }
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend',stopDrag);
    function stopDrag(){if(dragEl){dragEl.style.zIndex='';}isDrag=false;dragEl=null;}

    document.getElementById('sticker-size').addEventListener('input',e=>{
        stickerSize=parseFloat(e.target.value);
        const labels=['Tiny','Small','Medium','Large','XL'];
        document.getElementById('size-label').textContent=labels[Math.round((stickerSize-1.2)/0.95)]||'Medium';
    });
    document.getElementById('btn-undo').addEventListener('click',()=>{
        const l=document.getElementById('sticker-layer');
        if(l.lastChild){l.removeChild(l.lastChild);stickerEls.pop();}
    });
    document.getElementById('btn-clear').addEventListener('click',()=>{
        document.getElementById('sticker-layer').innerHTML='';stickerEls=[];
    });
    document.getElementById('btn-to-save').addEventListener('click',()=>{renderFinal();showScreen('screen-save');});

    /* ══════════════════════════════════════
       S6: Render final canvas
    ══════════════════════════════════════ */
    async function renderFinal(){
        const F=FRAMES[frameStyle]||FRAMES.pastel;
        const PAD=F.pad, GAP=F.gap, TOP=F.top, BOT=F.bot;
        const PHOTO_W=300, PHOTO_H=Math.round(PHOTO_W*3/4);

        let CW,CH;
        if(layout==='2x2'){
            const cols=2,rows=Math.ceil(photos.length/2);
            CW=PAD*2+PHOTO_W*cols+GAP*(cols-1);
            CH=TOP+BOT+PHOTO_H*rows+GAP*(Math.max(rows-1,0));
        } else if(layout==='wide'){
            CW=PAD*2+PHOTO_W*photos.length+GAP*(photos.length-1);
            CH=TOP+BOT+Math.round(PHOTO_W*3/4);
        } else {
            CW=PAD*2+PHOTO_W;
            CH=TOP+BOT+PHOTO_H*photos.length+GAP*(photos.length-1);
        }

        const fc=document.getElementById('final-canvas');
        fc.width=CW;fc.height=CH;
        const ctx=fc.getContext('2d');

        // Background + decorations
        F.bg(ctx,CW,CH);
        if(F.border){ctx.strokeStyle=F.border.color;ctx.lineWidth=F.border.width;ctx.strokeRect(F.border.width/2,F.border.width/2,CW-F.border.width,CH-F.border.width);}
        F.decorTop(ctx,CW);

        // Photos
        const imgs=await Promise.all(photos.map(loadImg));
        imgs.forEach((img,i)=>{
            let dx,dy,dw=PHOTO_W,dh=PHOTO_H;
            if(layout==='2x2'){
                const col=i%2,row=Math.floor(i/2);
                dx=PAD+col*(PHOTO_W+GAP);dy=TOP+row*(PHOTO_H+GAP);
            } else if(layout==='wide'){
                dx=PAD+i*(PHOTO_W+GAP);dy=TOP;
            } else {
                dx=PAD;dy=TOP+i*(PHOTO_H+GAP);
            }
            ctx.save();
            rrect(ctx,dx,dy,dw,dh,6);ctx.clip();
            const filtered=currentFilter!=='none'?applyFilter(img,dw,dh,FILTERS[currentFilter]):null;
            ctx.drawImage(filtered||img,dx,dy,dw,dh);
            ctx.restore();
        });

        // Stickers from live DOM
        const stage=document.getElementById('sticker-stage');
        const sr=stage.getBoundingClientRect();
        const sx=CW/sr.width, sy=CH/sr.height;
        stickerEls.forEach(el=>{
            const l=parseFloat(el.style.left)||0, t=parseFloat(el.style.top)||0;
            const fs=parseFloat(el.style.fontSize)||32;
            ctx.font=`${Math.round(fs*Math.min(sx,sy))}px serif`;
            ctx.textAlign='left';
            ctx.fillText(el.textContent,l*sx,(t+fs)*sy*0.92);
        });

        F.decorBottom(ctx,CW,CH);

        // Responsive display size
        fc.style.maxWidth=Math.min(300,window.innerWidth-80)+'px';
        fc.style.height='auto';
    }

    /* ══════════════════════════════════════
       Download
    ══════════════════════════════════════ */
    document.getElementById('btn-download').addEventListener('click',()=>{
        const btn=document.getElementById('btn-download');
        const orig=btn.innerHTML;btn.innerHTML='⏳ Saving…';btn.disabled=true;
        const link=document.createElement('a');
        link.download=`kachees-${frameStyle}-${Date.now()}.png`;
        link.href=document.getElementById('final-canvas').toDataURL('image/png');
        link.click();
        setTimeout(()=>{btn.innerHTML=orig;btn.disabled=false;},1000);
    });

    /* ══════════════════════════════════════
       Retake
    ══════════════════════════════════════ */
    document.getElementById('btn-retake').addEventListener('click',()=>{
        photos=[];currentFilter='none';stickerEls=[];
        document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
        document.querySelector('[data-filter="none"]').classList.add('active');
        document.querySelectorAll('.frame-card,.grid-card').forEach(c=>c.classList.remove('selected'));
        document.getElementById('btn-go-camera').style.display='none';
        showScreen('screen-landing');
    });

}); // end DOMContentLoaded
