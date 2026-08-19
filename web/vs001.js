import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const CANONICAL=[
  ['Calibration Glade','/web/assets/glade_H0.glb'],
  ['Explorer Zero','/web/assets/explorer.glb'],
  ['Vale Grazer','/web/assets/grazer.glb'],
  ['Foldback Stalker','/web/assets/foldback.glb'],
  ['Shrine','/web/assets/shrine.glb'],
  ['Broken Ring','/web/assets/broken_ring.glb'],
  ['Vale Oak','/web/assets/oak_adult.glb']
];

const canvas=document.querySelector('#world');
const status=document.querySelector('#status');
const hud=document.querySelector('#hud');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x171a16);
scene.fog=new THREE.FogExp2(0x171a16,.018);
const camera=new THREE.PerspectiveCamera(55,1,.1,400);
camera.position.set(8,5,10);
const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;controls.target.set(0,1,0);controls.maxPolarAngle=Math.PI*.47;
scene.add(new THREE.HemisphereLight(0xd9dfcf,0x433b31,1.5));
const sun=new THREE.DirectionalLight(0xfff2d7,2.2);sun.position.set(-10,16,8);sun.castShadow=true;scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.MeshStandardMaterial({color:0x30372a,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

const loader=new GLTFLoader();
const keys=new Set();
addEventListener('keydown',e=>keys.add(e.code));addEventListener('keyup',e=>keys.delete(e.code));
let explorer=null;
function loadGLB(path){return new Promise((resolve,reject)=>loader.load(path,g=>resolve(g.scene),undefined,reject));}
function fitObject(o,max=4){const b=new THREE.Box3().setFromObject(o),s=new THREE.Vector3();b.getSize(s);const m=Math.max(s.x,s.y,s.z)||1;o.scale.multiplyScalar(max/m);b.setFromObject(o);const c=new THREE.Vector3();b.getCenter(c);o.position.sub(c);o.position.y-=new THREE.Box3().setFromObject(o).min.y;}
function place(o,name){fitObject(o,name==='Calibration Glade'?45:name==='Explorer Zero'?1.8:3);o.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});if(name==='Calibration Glade'){o.position.set(0,0,0)}else if(name==='Explorer Zero'){o.position.set(0,0,0);explorer=o}else{const pos={"Vale Grazer":[5,0,-4],"Foldback Stalker":[-7,0,-8],"Shrine":[8,0,6],"Broken Ring":[-10,0,5],"Vale Oak":[3,0,8]}[name]||[0,0,0];o.position.set(...pos)}scene.add(o)}

async function boot(){
 status.innerHTML='<h2>VS-001 ASSET MATERIALIZATION GATE</h2>';
 let loaded=0;
 for(const [name,path] of CANONICAL){
  try{const obj=await loadGLB(path);place(obj,name);loaded++;status.insertAdjacentHTML('beforeend',`<div class="ok">✓ ${name}</div>`)}
  catch{status.insertAdjacentHTML('beforeend',`<div class="bad">✕ ${name} — GLB ausente</div>`)}
 }
 if(loaded===CANONICAL.length){status.insertAdjacentHTML('beforeend','<p class="ok"><b>PLAYABLE 3D GATE: PASS</b></p>');hud.classList.remove('hidden')}
 else{status.insertAdjacentHTML('beforeend',`<p class="warn"><b>RECOVERY SHELL ONLINE</b><br>${loaded}/${CANONICAL.length} assets canônicos materializados.<br>O gate permanece fail-closed até os GLBs reais retornarem ao repo.</p>`)}
}

function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const clock=new THREE.Clock();
function frame(){
 requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05);
 if(explorer){
  const inputX=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);
  const inputZ=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0);
  if(inputX||inputZ){
   const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();
   const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0)).normalize();
   const move=forward.multiplyScalar(inputZ).add(right.multiplyScalar(inputX)).normalize();
   move.multiplyScalar((keys.has('ShiftLeft')?5:2.8)*dt);explorer.position.add(move);
   const targetYaw=Math.atan2(move.x,move.z);explorer.rotation.y=targetYaw;
   controls.target.lerp(explorer.position.clone().add(new THREE.Vector3(0,1,0)),.12);
  }
 }
 controls.update();renderer.render(scene,camera)
}
boot();frame();
