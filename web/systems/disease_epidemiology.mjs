const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

export function exposureDose({contactHours=0,proximity=1,infectiousness=0,protection=0,environment=1}={}){
  return Math.max(0,contactHours)*clamp(proximity)*clamp(infectiousness)*clamp(1-protection)*Math.max(0,environment);
}

export function infectionProbability({dose=0,resistance=0,immunity=0}={}){
  const effective=dose*clamp(1-resistance)*clamp(1-immunity);
  return clamp(1-Math.exp(-effective));
}

export function createInfection({pathogenId,exposedAt=0,incubationHours=24,severity=0.4}={}){
  return {pathogenId,exposedAt,stage:'INCUBATING',elapsedHours:0,incubationHours:Math.max(1,incubationHours),severity:clamp(severity),symptomLoad:0,treated:false,isolation:false,recovered:false};
}

export function tickInfection(infection,{hours=1,careQuality=0,nutrition=0.7,rest=0.7,treatmentEffect=0}={}){
  if(infection.recovered)return {...infection};
  const elapsed=infection.elapsedHours+Math.max(0,hours);
  let stage=infection.stage;
  if(stage==='INCUBATING'&&elapsed>=infection.incubationHours)stage='SYMPTOMATIC';
  const support=(clamp(careQuality)+clamp(nutrition)+clamp(rest)+clamp(treatmentEffect))/4;
  let symptomLoad=infection.symptomLoad;
  if(stage==='SYMPTOMATIC') symptomLoad=clamp(symptomLoad+hours*(0.015+infection.severity*0.02-support*0.02));
  const recoveryProgress=Math.max(0,(infection.recoveryProgress||0)+hours*(0.005+support*0.02));
  const recovered=stage==='SYMPTOMATIC'&&recoveryProgress>=1;
  return {...infection,elapsedHours:elapsed,stage:recovered?'RECOVERED':stage,symptomLoad:recovered?0:symptomLoad,recoveryProgress:clamp(recoveryProgress,0,1),recovered};
}

export function contagiousness(infection,{base=1}={}){
  if(!infection||infection.recovered)return 0;
  if(infection.stage==='INCUBATING')return base*0.25;
  if(infection.stage==='SYMPTOMATIC')return base*(0.5+clamp(infection.symptomLoad)*0.5)*(infection.isolation?0.15:1);
  return 0;
}

export function workCapacityFromDisease(infections=[]){
  const load=infections.reduce((sum,i)=>sum+(i.recovered?0:clamp(i.symptomLoad)*(0.35+clamp(i.severity)*0.45)),0);
  return clamp(1-load,0.1,1);
}

export function triageOutbreak({population=[]}={}){
  const infected=population.filter(p=>(p.infections||[]).some(i=>!i.recovered));
  const symptomatic=infected.filter(p=>p.infections.some(i=>i.stage==='SYMPTOMATIC'&&!i.recovered));
  const isolated=infected.filter(p=>p.infections.some(i=>i.isolation&&!i.recovered));
  const prevalence=population.length?infected.length/population.length:0;
  return {population:population.length,infected:infected.length,symptomatic:symptomatic.length,isolated:isolated.length,prevalence,alertLevel:prevalence>=0.25?'CRITICAL':prevalence>=0.1?'HIGH':prevalence>0?'WATCH':'CLEAR'};
}

export function isolationDecision({infection,bedAvailable=false,homeIsolation=false,publicHealthPriority=0}={}){
  if(!infection||infection.recovered)return {isolate:false,reason:'NOT_INFECTIOUS'};
  const need=(infection.stage==='SYMPTOMATIC'?0.6:0.25)+clamp(infection.severity)*0.4+clamp(publicHealthPriority)*0.3;
  const isolate=need>=0.65&&(bedAvailable||homeIsolation);
  return {isolate,need:clamp(need),mode:isolate?(bedAvailable?'CLINIC':'HOME'):'NONE'};
}
