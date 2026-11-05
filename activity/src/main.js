import { DiscordSDK } from '@discord/embedded-app-sdk';
import './style.css';

const app = document.querySelector('#app');
const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
const discord = clientId ? new DiscordSDK(clientId) : null;
let participants = 0;
let energy = 36;
let palette = 0;
let unlocked = false;
let history = [];
const palettes = [
  ['#ae78ff','#57e5ff','#0d1023'],
  ['#ff6db3','#ffc96e','#210c24'],
  ['#80ffa5','#a0a6ff','#091d1b']
];
app.innerHTML = `
  <main class="shell">
    <header><div class="eyebrow">NEXUS OMEGA / SHARED EXPERIENCE</div><h1>REALITY ROOM</h1>
    <p>Shape a living digital artifact together. Every tap changes the room.</p></header>
    <section class="portal" aria-label="Interactive energy portal">
      <canvas id="field" width="900" height="600"></canvas>
      <div class="portal-meta"><span id="status">Standalone preview</span><span id="power">ENERGY 36</span></div>
    </section>
    <section class="controls">
      <button id="pulse">⚡ CHARGE THE CORE</button>
      <button id="shift">◈ SHIFT REALITY</button>
      <button id="capture">⬇ SAVE YOUR CREATION</button>
    </section>
    <section class="transmission"><label for="message">TRANSMISSION</label>
      <input id="message" maxlength="90" placeholder="A message to leave in the universe…"/>
      <button id="inscribe">INSCRIBE</button>
      <p id="transmission-result" aria-live="polite"></p>
    </section>
    <footer>Playable locally. Real Discord multiplayer needs a hosted backend and authorized Activity configuration.</footer>
  </main>`;
const canvas = document.querySelector('#field');
const ctx = canvas.getContext('2d');
const power = document.querySelector('#power');
const status = document.querySelector('#status');
const message = document.querySelector('#message');
const result = document.querySelector('#transmission-result');
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
function draw() {
  const [a,b,bg] = palettes[palette];
  ctx.fillStyle = bg; ctx.fillRect(0,0,900,600);
  const time = performance.now() * .0006;
  for(let i=0;i<85;i++){
    const angle = i*2.39996 + time * (i%3===0?1:-.2);
    const radius = 25 + Math.sqrt(i)* (12+energy*.24);
    const x=450+Math.cos(angle)*radius, y=300+Math.sin(angle)*radius*.72;
    ctx.beginPath(); ctx.fillStyle=i%2?a:b;
    ctx.globalAlpha=.2+(i%6)*.12;
    ctx.arc(x,y,1.5+(i%5)+energy*.015,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;
  const halo=ctx.createRadialGradient(450,300,5,450,300,200+energy);
  halo.addColorStop(0,a); halo.addColorStop(.28,b+'55'); halo.addColorStop(1,bg+'00');
  ctx.fillStyle=halo; ctx.beginPath();ctx.arc(450,300,200+energy,0,Math.PI*2);ctx.fill();
  ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 29px system-ui';
  ctx.fillText(unlocked?'REALITY UNLOCKED':'THE CORE IS LISTENING',450,310);
  ctx.font='18px system-ui';
  ctx.fillText(history.length?history[history.length-1]:'CHARGE • SHIFT • CREATE',450,350,760);
  requestAnimationFrame(draw);
}
draw();
function update(){power.textContent='ENERGY '+energy;unlocked=energy>=100;}
document.querySelector('#pulse').onclick=()=>{energy=clamp(energy+9,0,100);update();};
document.querySelector('#shift').onclick=()=>{palette=(palette+1)%palettes.length;energy=clamp(energy+3,0,100);update();};
document.querySelector('#inscribe').onclick=()=>{
 const value=message.value.trim();
 if(!value){result.textContent='Enter a transmission first.';return;}
 history.push(value); if(history.length>20)history.shift();
 result.textContent='Transmission inscribed into your local room.';
 message.value='';
};
document.querySelector('#capture').onclick=()=>{
 const a=document.createElement('a');a.download='nexus-reality-room.png';a.href=canvas.toDataURL('image/png');a.click();
};
if(discord){
 discord.ready().then(()=>{
  status.textContent='Discord Activity connected';
 }).catch(()=>{status.textContent='Activity connection unavailable';});
} else {
 status.textContent='Standalone preview • configure VITE_DISCORD_CLIENT_ID';
}
