gsap.registerPlugin(ScrollTrigger);
gsap.config({force3D:true,nullTargetWarn:false});
ScrollTrigger.config({ignoreMobileResize:true});

document.body.classList.remove("light-theme");

const reduceMotion =
window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const compactMotion =
window.matchMedia("(max-width: 768px)").matches;

const lightMotion =
reduceMotion || compactMotion;

const canHover =
window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if(false && canHover && !reduceMotion){

const customCursor =
document.createElement("div");

customCursor.className =
"custom-cursor";

document.body.appendChild(customCursor);
document.body.classList.add("has-custom-cursor");

let cursorX = -80;
let cursorY = -80;
let targetCursorX = -80;
let targetCursorY = -80;

function renderCustomCursor(){

cursorX += (targetCursorX-cursorX)*0.22;
cursorY += (targetCursorY-cursorY)*0.22;

customCursor.style.transform =
`translate3d(${cursorX}px,${cursorY}px,0) translate(-50%,-50%)`;

requestAnimationFrame(renderCustomCursor);

}

renderCustomCursor();

window.addEventListener("pointermove",(event)=>{

targetCursorX = event.clientX;
targetCursorY = event.clientY;

customCursor.classList.add("is-visible");

},{passive:true});

document.addEventListener("pointerover",(event)=>{

if(event.target.closest("a,button,input,textarea,select,[role='button']")){

customCursor.classList.add("is-link");

}

});

document.addEventListener("pointerout",(event)=>{

if(event.target.closest("a,button,input,textarea,select,[role='button']")){

customCursor.classList.remove("is-link");

}

});

document.addEventListener("pointerdown",()=>{

customCursor.classList.add("is-down");

});

document.addEventListener("pointerup",()=>{

customCursor.classList.remove("is-down");

});

document.addEventListener("mouseleave",()=>{

customCursor.classList.remove("is-visible");

});

}

window.addEventListener("load",()=>{
gsap.to(".loader",{opacity:0,duration:1,onComplete:()=>{
document.querySelector(".loader").style.display="none";
}});
});

/* Stars System */

const canvas=document.getElementById("stars");
const ctx=canvas.getContext("2d",{alpha:true});

let starWidth = 0;
let starHeight = 0;
let starDpr = 1;

const starCount =
reduceMotion ? 42 : compactMotion ? 86 : 150;

let stars=[];
let shootingStars=[];

function resizeStars(){

starWidth = window.innerWidth;
starHeight = window.innerHeight;
starDpr = Math.min(window.devicePixelRatio || 1,compactMotion ? 1.25 : 1.5);

canvas.width = Math.floor(starWidth*starDpr);
canvas.height = Math.floor(starHeight*starDpr);
canvas.style.width = `${starWidth}px`;
canvas.style.height = `${starHeight}px`;

ctx.setTransform(starDpr,0,0,starDpr,0,0);

stars = Array.from({length:starCount},()=>({
x:Math.random()*starWidth,
y:Math.random()*starHeight,
r:0.45+Math.random()*1.25,
speed:0.08+Math.random()*0.18
}));

}

resizeStars();

function createShootingStar(){

shootingStars.push({

x:Math.random()*starWidth,

y:Math.random()*starHeight*0.3,

size:2.2,

speedX:1.8+Math.random()*1.8,
speedY:2.6+Math.random()*1.8,

life:0

});

}

/* 🌌 MAIN DRAW FUNCTION */

function drawStars(){

ctx.clearRect(0,0,starWidth,starHeight);

ctx.shadowBlur = 0;
ctx.fillStyle="rgba(255,255,255,0.86)";
ctx.beginPath();

stars.forEach(star=>{

ctx.moveTo(star.x+star.r,star.y);
ctx.arc(star.x,star.y,star.r,0,Math.PI*2);

star.y += star.speed;

if(star.y>starHeight){

star.y = 0;
star.x = Math.random()*starWidth;

}

});

ctx.fill();

if(!compactMotion && !reduceMotion && Math.random()<0.004){

createShootingStar();

}

ctx.shadowBlur=8;
ctx.shadowColor="white";
ctx.fillStyle="white";

shootingStars.forEach((s,i)=>{

ctx.beginPath();

ctx.arc(
s.x,
s.y,
s.size,
0,
Math.PI*2
);

ctx.fill();

s.x+=s.speedX;
s.y+=s.speedY;

s.life++;

if(s.life>180){

shootingStars.splice(i,1);

}

});

ctx.shadowBlur=0;

if(reduceMotion) return;

requestAnimationFrame(drawStars);

}

drawStars();

/* Resize Fix */

let starResizeTimer;

window.addEventListener("resize",()=>{

clearTimeout(starResizeTimer);
starResizeTimer = setTimeout(resizeStars,160);

},{passive:true});

/* ========================= */
/* AUTO SCROLL MOUSE EFFECT */
/* ========================= */

const autoScrollBar =
document.querySelector(".auto-scroll-bar");

if(false && autoScrollBar){

const autoScrollItems =
autoScrollBar.querySelectorAll(".auto-scroll-item");

if(canHover){

autoScrollBar.addEventListener("pointermove",(event)=>{

const rect =
autoScrollBar.getBoundingClientRect();

autoScrollBar.style.setProperty(
"--mouse-x",
`${event.clientX-rect.left}px`
);

autoScrollBar.style.setProperty(
"--mouse-y",
`${event.clientY-rect.top}px`
);

autoScrollBar.classList.add("is-hovering");

});

autoScrollBar.addEventListener("pointerleave",()=>{

autoScrollBar.classList.remove("is-hovering");

autoScrollItems.forEach(item=>{

item.style.setProperty("--rotate-x","0deg");
item.style.setProperty("--rotate-y","0deg");
item.style.setProperty("--shine-x","50%");
item.style.setProperty("--shine-y","50%");

});

});

}

autoScrollBar.addEventListener("click",(event)=>{

const rect =
autoScrollBar.getBoundingClientRect();

const ripple =
document.createElement("span");

ripple.className =
"auto-click-ripple";

ripple.style.setProperty(
"--ripple-x",
`${event.clientX-rect.left}px`
);

ripple.style.setProperty(
"--ripple-y",
`${event.clientY-rect.top}px`
);

autoScrollBar.appendChild(ripple);
autoScrollBar.classList.toggle("is-active");

ripple.addEventListener("animationend",()=>{

ripple.remove();

});

});

if(canHover){

autoScrollItems.forEach(item=>{

item.addEventListener("pointermove",(event)=>{

const rect =
item.getBoundingClientRect();

const x =
(event.clientX-rect.left)/rect.width;

const y =
(event.clientY-rect.top)/rect.height;

item.style.setProperty(
"--rotate-x",
`${(0.5-y)*12}deg`
);

item.style.setProperty(
"--rotate-y",
`${(x-0.5)*14}deg`
);

item.style.setProperty(
"--shine-x",
`${x*100}%`
);

item.style.setProperty(
"--shine-y",
`${y*100}%`
);

});

item.addEventListener("pointerleave",()=>{

item.style.setProperty("--rotate-x","0deg");
item.style.setProperty("--rotate-y","0deg");
item.style.setProperty("--shine-x","50%");
item.style.setProperty("--shine-y","50%");

});

});

}

}

/* ========================= */
/* SCROLL KEYBOARD SHOWCASE */
/* ========================= */

const scrollKeyboard =
document.querySelector(".scroll-keyboard");

if(scrollKeyboard){

const keyboardKeys =
gsap.utils.toArray(".keyboard-key");

const keyboardTrail =
gsap.utils.toArray(".keyboard-trail span");

const serviceKeys =
gsap.utils.toArray(".key-service");

const keyboardOrbits =
gsap.utils.toArray(".keyboard-orbit");

if(lightMotion){

scrollKeyboard.style.setProperty("--typed-reveal","100%");
scrollKeyboard.style.setProperty("--line-scale","1");
keyboardKeys.forEach(key=>key.classList.add("is-pressed"));

}else{

gsap.set(scrollKeyboard,{
autoAlpha:0,
x:160,
y:-58,
rotateX:24,
rotateY:-34,
rotateZ:8,
scale:0.72,
"--keyboard-glow":0.2,
"--typed-reveal":"0%",
"--line-scale":0
});

gsap.set(keyboardKeys,{
autoAlpha:0.2,
y:-18,
scale:0.92
});

gsap.set(keyboardTrail,{
autoAlpha:0,
x:40,
y:18,
scale:0.86
});

const keyboardTimeline =
gsap.timeline({
scrollTrigger:{
trigger:".what-we-do",
start:"top 82%",
end:"bottom 18%",
scrub:0.9
}
});

keyboardTimeline
.to(scrollKeyboard,{
autoAlpha:1,
x:28,
y:-30,
rotateX:16,
rotateY:-24,
rotateZ:4,
scale:0.82,
"--keyboard-glow":0.7,
duration:0.22,
ease:"power2.out"
})
.to(keyboardKeys,{
autoAlpha:1,
y:0,
scale:1,
stagger:{
each:0.018,
from:"start"
},
duration:0.2,
ease:"back.out(1.8)"
},"-=0.12")
.to(scrollKeyboard,{
"--typed-reveal":"100%",
"--line-scale":1,
x:-6,
y:-14,
rotateX:10,
rotateY:-14,
rotateZ:1,
scale:0.92,
"--keyboard-glow":1,
duration:0.32,
ease:"power2.out"
})
.to(serviceKeys,{
scale:0.96,
y:5,
stagger:0.045,
duration:0.16,
ease:"power1.inOut"
},"-=0.08")
.to(keyboardTrail,{
autoAlpha:1,
x:0,
y:0,
scale:1,
stagger:0.045,
duration:0.2,
ease:"power2.out"
},"-=0.1")
.to(scrollKeyboard,{
x:-34,
y:12,
rotateX:4,
rotateY:7,
rotateZ:-2,
scale:0.95,
"--keyboard-glow":0.78,
duration:0.28,
ease:"none"
});

ScrollTrigger.create({
trigger:".what-we-do",
start:"top 78%",
end:"bottom 18%",
onUpdate:self=>{

const activeIndex =
Math.min(
keyboardKeys.length-1,
Math.floor(self.progress*keyboardKeys.length)
);

keyboardKeys.forEach((key,index)=>{

key.classList.toggle("is-pressed",index<=activeIndex);

});

}
});

gsap.to(scrollKeyboard,{
"--keyboard-lift":"-10px",
duration:2.2,
repeat:-1,
yoyo:true,
ease:"sine.inOut"
});

gsap.to(keyboardTrail,{
y:-10,
duration:1.8,
repeat:-1,
yoyo:true,
stagger:0.15,
ease:"sine.inOut"
});

gsap.to(keyboardKeys,{
boxShadow:"0 0 20px rgba(92,199,201,0.28), inset 0 0 16px rgba(92,199,201,0.1)",
duration:1.6,
repeat:-1,
yoyo:true,
stagger:0.08,
ease:"sine.inOut"
});

gsap.to(keyboardOrbits,{
scale:1.08,
opacity:0.95,
duration:2.4,
repeat:-1,
yoyo:true,
stagger:0.35,
ease:"sine.inOut"
});

}

}

/* ========================= */
/* SERVICES GSAP SHOWCASE */
/* ========================= */

const servicesSection =
document.querySelector(".services");

if(servicesSection){

const servicesHeader =
servicesSection.querySelector(".services-header");

const serviceCore =
servicesSection.querySelector(".service-core");

const serviceCoreLabel =
serviceCore.querySelector(".service-core-label");

const serviceCards =
gsap.utils.toArray(".service-card");

const serviceCardInners =
gsap.utils.toArray(".service-card-inner");

const servicesTimeline =
gsap.timeline({
scrollTrigger:{
trigger:servicesSection,
start:"top 72%",
once:true
}
});

servicesTimeline
.to(servicesHeader,{
opacity:1,
y:0,
duration:0.8,
ease:"power3.out"
})
.to(serviceCore,{
"--core-reveal":1,
"--core-scale":1,
duration:0.8,
ease:"back.out(1.7)"
},"-=0.38")
.to(serviceCardInners,{
"--reveal":1,
"--enter-y":"0px",
"--card-scale":1,
"--card-blur":"0px",
duration:0.95,
stagger:{
each:0.08,
from:"center"
},
ease:"power3.out"
},"-=0.42");

let activeServiceIndex = 0;

function setActiveService(index){

serviceCards.forEach((card,cardIndex)=>{

card.classList.toggle("is-active",cardIndex===index);

});

if(serviceCoreLabel && serviceCards[index]){

serviceCoreLabel.innerText =
serviceCards[index].querySelector("h3").innerText;

}

}

setActiveService(activeServiceIndex);

function cycleActiveService(){

activeServiceIndex =
(activeServiceIndex+1)%serviceCards.length;

setActiveService(activeServiceIndex);

gsap.delayedCall(2.4,cycleActiveService);

}

if(serviceCards.length){

gsap.delayedCall(2.4,cycleActiveService);

}

if(!lightMotion){

serviceCardInners.forEach((inner,index)=>{

gsap.to(inner,{
"--float-y":`${index%2===0 ? -14 : 14}px`,
duration:2.8+(index*0.22),
repeat:-1,
yoyo:true,
ease:"sine.inOut",
delay:index*0.16
});

});

}

servicesSection.addEventListener("pointermove",(event)=>{

if(!canHover || window.innerWidth<900) return;

const rect =
servicesSection.getBoundingClientRect();

servicesSection.style.setProperty(
"--spot-x",
`${event.clientX-rect.left}px`
);

servicesSection.style.setProperty(
"--spot-y",
`${event.clientY-rect.top}px`
);

servicesSection.classList.add("is-hovering");

const pointerX =
(event.clientX-rect.left)/rect.width-0.5;

const pointerY =
(event.clientY-rect.top)/rect.height-0.5;

serviceCards.forEach(card=>{

const depth =
Number(card.dataset.depth) || 1;

const inner =
card.querySelector(".service-card-inner");

gsap.to(inner,{
"--move-x":`${pointerX*40*depth}px`,
"--move-y":`${pointerY*30*depth}px`,
"--tilt-y":`${pointerX*9*depth}deg`,
"--tilt-x":`${pointerY*-8*depth}deg`,
duration:0.55,
ease:"power3.out",
overwrite:"auto"
});

});

gsap.to(serviceCore,{
"--core-x":`${pointerX*28}px`,
"--core-y":`${pointerY*20}px`,
duration:0.55,
ease:"power3.out",
overwrite:"auto"
});

});

servicesSection.addEventListener("pointerleave",()=>{

servicesSection.classList.remove("is-hovering");

serviceCardInners.forEach(inner=>{

gsap.to(inner,{
"--move-x":"0px",
"--move-y":"0px",
"--tilt-x":"0deg",
"--tilt-y":"0deg",
duration:0.7,
ease:"power3.out",
overwrite:"auto"
});

});

gsap.to(serviceCore,{
"--core-x":"0px",
"--core-y":"0px",
duration:0.7,
ease:"power3.out",
overwrite:"auto"
});

});

}

/* ========================= */
/* PROJECTS MOTION LAB */
/* ========================= */

const projectsLab =
document.querySelector(".projects-lab");

if(projectsLab){

const projectHeader =
projectsLab.querySelector(".projects-header");

const projectCards =
gsap.utils.toArray(".motion-project-card");

const projectMarquee =
projectsLab.querySelector(".project-marquee-track");

const projectTimeline =
gsap.timeline({
scrollTrigger:{
trigger:projectsLab,
start:"top 68%",
once:true
}
});

projectTimeline
.to(projectHeader,{
opacity:1,
y:0,
duration:0.8,
ease:"power3.out"
})
.to(projectCards,{
opacity:1,
"--card-y":"0px",
"--card-rotate":"0deg",
duration:1,
stagger:{
each:0.12,
from:"center"
},
ease:"expo.out"
},"-=0.34")
.to(".visual-ring",{
opacity:1,
scale:1,
duration:0.8,
stagger:0.06,
ease:"back.out(1.6)"
},"-=0.74");

if(projectMarquee && !lightMotion){

gsap.to(projectMarquee,{
xPercent:-25,
duration:30,
repeat:-1,
ease:"none"
});

}

let activeProjectIndex = 0;

function setActiveProject(index){

projectCards.forEach((card,cardIndex)=>{

card.classList.toggle("is-active",cardIndex===index);

});

}

function cycleProjectFocus(){

if(!projectCards.length) return;

setActiveProject(activeProjectIndex);

activeProjectIndex =
(activeProjectIndex+1)%projectCards.length;

gsap.delayedCall(2.6,cycleProjectFocus);

}

if(!reduceMotion){

cycleProjectFocus();

}
else{

setActiveProject(0);

}

projectCards.forEach((card,index)=>{

const depth =
Number(card.dataset.depth) || 1;

const frame =
card.querySelector(".visual-frame");

const rings =
card.querySelectorAll(".visual-ring");

const chips =
card.querySelectorAll(".visual-chip");

const lines =
card.querySelectorAll(".visual-line");

if(!lightMotion){

gsap.to(card,{
"--float-y":`${index%2===0 ? -12 : 12}px`,
duration:3.2+(index*0.32),
repeat:-1,
yoyo:true,
ease:"sine.inOut"
});

gsap.to(frame,{
rotation:`+=${index%2===0 ? 10 : -10}`,
duration:5.5+(index*0.6),
repeat:-1,
yoyo:true,
ease:"sine.inOut"
});

gsap.to(rings,{
rotation:`+=${index%2===0 ? 360 : -360}`,
duration:16+(index*2),
repeat:-1,
ease:"none",
stagger:0.2
});

gsap.to(chips,{
y:(chipIndex)=>chipIndex%2===0 ? -14 : 14,
x:(chipIndex)=>chipIndex%2===0 ? 10 : -10,
duration:2.8+(index*0.24),
repeat:-1,
yoyo:true,
ease:"sine.inOut",
stagger:0.12
});

gsap.to(lines,{
scaleX:0.64,
duration:1.8+(index*0.18),
repeat:-1,
yoyo:true,
ease:"power1.inOut",
stagger:0.18,
transformOrigin:"left center"
});

}

card.addEventListener("pointermove",(event)=>{

if(!canHover || window.innerWidth<768) return;

const rect =
card.getBoundingClientRect();

const pointerX =
(event.clientX-rect.left)/rect.width;

const pointerY =
(event.clientY-rect.top)/rect.height;

gsap.to(card,{
"--tilt-y":`${(pointerX-0.5)*14*depth}deg`,
"--tilt-x":`${(0.5-pointerY)*12*depth}deg`,
"--glow-x":`${pointerX*100}%`,
"--glow-y":`${pointerY*100}%`,
duration:0.45,
ease:"power3.out",
overwrite:"auto"
});

});

card.addEventListener("pointerleave",()=>{

gsap.to(card,{
"--tilt-y":"0deg",
"--tilt-x":"0deg",
"--glow-x":"50%",
"--glow-y":"50%",
duration:0.65,
ease:"power3.out",
overwrite:"auto"
});

});

});

projectsLab.addEventListener("pointermove",(event)=>{

if(!canHover) return;

const rect =
projectsLab.getBoundingClientRect();

projectsLab.style.setProperty(
"--project-mouse-x",
`${event.clientX-rect.left}px`
);

projectsLab.style.setProperty(
"--project-mouse-y",
`${event.clientY-rect.top}px`
);

projectsLab.classList.add("is-hovering");

});

projectsLab.addEventListener("pointerleave",()=>{

projectsLab.classList.remove("is-hovering");

});

ScrollTrigger.refresh();

}

/* ========================= */
/* LIVE TRANSLATE MOTION CONSOLE */
/* ========================= */

const liveTranslate =
document.querySelector(".live-translate");

if(liveTranslate){

const translateHeader =
liveTranslate.querySelector(".translate-header");

const translatePanels =
gsap.utils.toArray(".translate-panel");

const avatarRings =
liveTranslate.querySelectorAll(".avatar-ring");

const voiceNodes =
liveTranslate.querySelectorAll(".voice-node");

const signalLines =
liveTranslate.querySelectorAll(".signal-stack span");

const translateButton =
document.getElementById("translateButton");

gsap.timeline({
scrollTrigger:{
trigger:liveTranslate,
start:"top 68%",
once:true
}
})
.to(translateHeader,{
opacity:1,
y:0,
duration:0.8,
ease:"power3.out"
})
.to(translatePanels,{
opacity:1,
"--panel-y":"0px",
duration:0.9,
stagger:0.14,
ease:"expo.out"
},"-=0.32");

if(!lightMotion){

gsap.to(avatarRings,{
rotation:(index)=>index%2===0 ? 360 : -360,
duration:(index)=>16+(index*4),
repeat:-1,
ease:"none",
transformOrigin:"50% 50%",
stagger:0.16
});

gsap.to(voiceNodes,{
y:(index)=>index%2===0 ? -16 : 16,
x:(index)=>index%2===0 ? 12 : -10,
duration:2.4,
repeat:-1,
yoyo:true,
ease:"sine.inOut",
stagger:0.18
});

gsap.to(signalLines,{
scaleX:0.35,
opacity:0.25,
duration:1.4,
repeat:-1,
yoyo:true,
ease:"power1.inOut",
transformOrigin:"left center",
stagger:0.18
});

}

function pulseTranslatePanels(){

translatePanels.forEach(panel=>{

panel.classList.remove("is-active");

requestAnimationFrame(()=>{

panel.classList.add("is-active");

});

});

setTimeout(()=>{

translatePanels.forEach(panel=>panel.classList.remove("is-active"));

},1700);

}

if(translateButton){

translateButton.addEventListener("click",pulseTranslatePanels);

}

liveTranslate.addEventListener("pointermove",(event)=>{

if(!canHover) return;

const rect =
liveTranslate.getBoundingClientRect();

liveTranslate.style.setProperty(
"--translate-x",
`${event.clientX-rect.left}px`
);

liveTranslate.style.setProperty(
"--translate-y",
`${event.clientY-rect.top}px`
);

liveTranslate.classList.add("is-hovering");

const pointerX =
(event.clientX-rect.left)/rect.width-0.5;

const pointerY =
(event.clientY-rect.top)/rect.height-0.5;

translatePanels.forEach(panel=>{

const depth =
Number(panel.dataset.depth) || 1;

gsap.to(panel,{
"--tilt-y":`${pointerX*8*depth}deg`,
"--tilt-x":`${pointerY*-7*depth}deg`,
duration:0.45,
ease:"power3.out",
overwrite:"auto"
});

});

});

liveTranslate.addEventListener("pointerleave",()=>{

liveTranslate.classList.remove("is-hovering");

translatePanels.forEach(panel=>{

gsap.to(panel,{
"--tilt-y":"0deg",
"--tilt-x":"0deg",
duration:0.65,
ease:"power3.out",
overwrite:"auto"
});

});

});

}

/* ========================= */
/* VIDEO MOTION LAB */
/* ========================= */

const videoLab =
document.querySelector(".video-lab");

if(videoLab){

const videoHeader =
videoLab.querySelector(".video-header");

const videoCards =
gsap.utils.toArray(".video-card");

const videoScans =
videoLab.querySelectorAll(".video-scan");

const videoTimelineBars =
videoLab.querySelectorAll(".video-timeline span");

let activeVideoIndex = 0;
let videoLabVisible = false;

gsap.timeline({
scrollTrigger:{
trigger:videoLab,
start:"top 70%",
once:true
}
})
.to(videoHeader,{
opacity:1,
y:0,
duration:0.8,
ease:"power3.out"
})
.to(videoCards,{
opacity:1,
"--card-y":"0px",
"--card-rotate":"0deg",
duration:0.9,
stagger:{
each:0.12,
from:"center"
},
ease:"expo.out"
},"-=0.34")
.to(videoTimelineBars,{
"--bar-scale":1,
duration:0.65,
stagger:0.14,
ease:"power3.out"
},"-=0.5");

if(!lightMotion){

gsap.to(videoScans,{
yPercent:200,
duration:3.2,
repeat:-1,
ease:"none",
stagger:0.35
});

}

function playVideo(video){

if(!video || reduceMotion) return;

const playPromise =
video.play();

if(playPromise){

playPromise.catch(()=>{});

}

}

function pauseAllVideos(exceptCard){

videoCards.forEach(card=>{

if(card===exceptCard) return;

const video =
card.querySelector("video");

if(video){

video.pause();

}

});

}

function setActiveVideo(index,shouldPlay){

if(!videoCards.length) return;

activeVideoIndex = index%videoCards.length;

const activeCard =
videoCards[activeVideoIndex];

videoCards.forEach((card,cardIndex)=>{

card.classList.toggle("is-active",cardIndex===activeVideoIndex);

});

videoTimelineBars.forEach((bar,barIndex)=>{

gsap.to(bar,{
"--bar-scale":barIndex<=activeVideoIndex ? 1 : 0.18,
duration:0.35,
ease:"power3.out",
overwrite:"auto"
});

});

pauseAllVideos(activeCard);

if(shouldPlay && videoLabVisible){

playVideo(activeCard.querySelector("video"));

}

}

function cycleActiveVideo(){

if(videoLabVisible){

setActiveVideo(activeVideoIndex+1,true);

}
else if(videoCards.length){

activeVideoIndex =
(activeVideoIndex+1)%videoCards.length;

}

gsap.delayedCall(3.1,cycleActiveVideo);

}

if("IntersectionObserver" in window){

const videoObserver =
new IntersectionObserver((entries)=>{

videoLabVisible = entries[0].isIntersecting;

if(videoLabVisible){

setActiveVideo(activeVideoIndex,true);

}
else{

pauseAllVideos();

}

},{threshold:0.35});

videoObserver.observe(videoLab);

}
else{

videoLabVisible = true;

}

setActiveVideo(0,false);

if(!reduceMotion){

gsap.delayedCall(3.1,cycleActiveVideo);

}

videoCards.forEach((card,index)=>{

const depth =
Number(card.dataset.depth) || 1;

const video =
card.querySelector("video");

if(canHover){

card.addEventListener("mouseenter",()=>{

setActiveVideo(index,true);

});

card.addEventListener("pointermove",(event)=>{

const rect =
card.getBoundingClientRect();

const pointerX =
(event.clientX-rect.left)/rect.width-0.5;

const pointerY =
(event.clientY-rect.top)/rect.height-0.5;

gsap.to(card,{
"--tilt-y":`${pointerX*13*depth}deg`,
"--tilt-x":`${pointerY*-10*depth}deg`,
duration:0.45,
ease:"power3.out",
overwrite:"auto"
});

});

card.addEventListener("pointerleave",()=>{

gsap.to(card,{
"--tilt-y":"0deg",
"--tilt-x":"0deg",
duration:0.65,
ease:"power3.out",
overwrite:"auto"
});

if(videoLabVisible && video){

playVideo(videoCards[activeVideoIndex].querySelector("video"));

}

});

}

});

videoLab.addEventListener("pointermove",(event)=>{

if(!canHover) return;

const rect =
videoLab.getBoundingClientRect();

videoLab.style.setProperty(
"--video-x",
`${event.clientX-rect.left}px`
);

videoLab.style.setProperty(
"--video-y",
`${event.clientY-rect.top}px`
);

videoLab.classList.add("is-hovering");

});

videoLab.addEventListener("pointerleave",()=>{

videoLab.classList.remove("is-hovering");

});

document.addEventListener("visibilitychange",()=>{

if(document.hidden){

pauseAllVideos();

}
else if(videoLabVisible){

setActiveVideo(activeVideoIndex,true);

}

});

}

/* ========================= */
/* INTRO + FOOTER REVEALS */
/* ========================= */

const introSection =
document.querySelector(".intro");

if(introSection){

gsap.timeline({
scrollTrigger:{
trigger:introSection,
start:"top 72%",
once:true
}
})
.from(".intro-kicker",{
opacity:0,
y:18,
duration:0.55,
ease:"power3.out"
})
.from(".intro h1",{
opacity:0,
y:28,
duration:0.75,
ease:"power3.out"
},"-=0.2")
.from(".intro p",{
opacity:0,
y:22,
duration:0.65,
ease:"power3.out"
},"-=0.38")
.from(".intro-metrics div",{
opacity:0,
y:26,
duration:0.7,
stagger:0.08,
ease:"power3.out"
},"-=0.34")
.from(".intro-device",{
opacity:0,
scale:0.94,
duration:0.85,
ease:"expo.out"
},"-=0.72");

}

const footerSection =
document.querySelector(".site-footer");

if(footerSection){

gsap.from(".footer-brand, .footer-column",{
scrollTrigger:{
trigger:footerSection,
start:"top 82%",
once:true
},
opacity:0,
y:34,
duration:0.8,
stagger:0.08,
ease:"power3.out"
});

}

const themeToggle =
document.getElementById("themeToggle");

if(themeToggle){

const themeToggleText =
themeToggle.querySelector(".theme-toggle-text");

function updateThemeButton(){

const isLight =
document.body.classList.contains("light-theme");

themeToggleText.innerText =
isLight ? "Dark Theme" : "Light Theme";

themeToggle.setAttribute(
"aria-label",
isLight ? "Switch to dark theme" : "Switch to light theme"
);

}

updateThemeButton();

themeToggle.addEventListener("click",()=>{

document.body.classList.toggle("light-theme");

updateThemeButton();

});

}

const packageRequest =
document.querySelector(".package-request");

const selectedPlanLabel =
document.querySelector(".selected-plan-label");

const selectedPlanInput =
document.querySelector("#selectedPlan");

document.querySelectorAll(".plan-select").forEach(button=>{

button.addEventListener("click",()=>{

const plan =
button.dataset.plan || "Selected Plan";

if(selectedPlanLabel){

selectedPlanLabel.innerText =
plan;

}

if(selectedPlanInput){

selectedPlanInput.value =
plan;

}

if(packageRequest){

packageRequest.classList.add("is-visible");
packageRequest.scrollIntoView({behavior:"smooth",block:"center"});

}

});

});

const serviceDetails = {
transcript:[
"General Transcript",
"Business Transcript",
"Legal Transcript",
"Interview Transcript",
"Lecture Transcript"
],
captioning:[
"Movie Captioning",
"Series Captioning",
"Lecture Captioning",
"YouTube / Social Captioning",
"SRT / VTT Subtitle File"
],
translation:[
"English to Hindi",
"Hindi to English",
"English to Marathi",
"English to Spanish",
"Transcript & Caption Translation"
]
};

document.querySelectorAll("[data-service-picker]").forEach(picker=>{

const serviceSelect =
picker.querySelector("[data-service-main]");

const detailSelect =
picker.querySelector("[data-service-detail]");

if(!serviceSelect || !detailSelect) return;

function updateServiceDetails(){

const options =
serviceDetails[serviceSelect.value] || [];

detailSelect.innerHTML =
options.map(option=>`<option>${option}</option>`).join("");

}

serviceSelect.addEventListener("change",updateServiceDetails);
updateServiceDetails();

});
/* ========================= */
/* LIVE TRANSLATION SYSTEM */
/* ========================= */

async function translateWithGoogle(text,targetLang){

const url =
`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;

const response =
await fetch(url);

if(!response.ok){

throw new Error("Google Translate failed");

}

const data =
await response.json();

return data[0]
.map(part=>part[0])
.join("");

}

async function translateWithFallback(text,targetLang){

try{

return await translateWithGoogle(text,targetLang);

}
catch(error){

const response = await fetch(
"https://libretranslate.de/translate",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
q:text,
source:"auto",
target:targetLang,
format:"text"
})
}
);

if(!response.ok){

throw new Error("Fallback translation failed");

}

const data = await response.json();

return data.translatedText || text;

}

}

async function translateText(){

const text =
document.getElementById("inputText").value.trim();

const targetLang =
document.getElementById("languageSelect").value;

const subtitle =
document.getElementById("subtitleText");

const mouth =
document.getElementById("mouth");

const avatar =
document.querySelector(".ai-avatar");

const activePanels =
document.querySelectorAll(".translate-panel");

if(!text){

subtitle.innerText =
"Type something to translate...";

return;

}

subtitle.innerText =
"Translating...";

activePanels.forEach(panel=>panel.classList.add("is-active"));

try{

const translatedText =
await translateWithFallback(text,targetLang);

subtitle.innerText =
translatedText;

speechSynthesis.cancel();

const speech =
new SpeechSynthesisUtterance(
translatedText
);

const speechLangs = {
en:"en-US",
hi:"hi-IN",
mr:"mr-IN",
es:"es-ES",
fr:"fr-FR"
};

speech.lang =
speechLangs[targetLang] || targetLang;

mouth.classList.add("talking");

if(avatar){

avatar.classList.add("speaking");

}

speech.onend = () => {

mouth.classList.remove("talking");

if(avatar){

avatar.classList.remove("speaking");

}

};

speech.onerror = () => {

mouth.classList.remove("talking");

if(avatar){

avatar.classList.remove("speaking");

}

};

speechSynthesis.speak(speech);

}
catch(error){

subtitle.innerText =
"Translation service is not responding right now.";

mouth.classList.remove("talking");

if(avatar){

avatar.classList.remove("speaking");

}

}

setTimeout(()=>{

activePanels.forEach(panel=>panel.classList.remove("is-active"));

},1600);

}
