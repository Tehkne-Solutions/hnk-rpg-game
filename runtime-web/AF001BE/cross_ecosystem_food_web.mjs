const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function bridgeStrength(profile,bridgeId,{wetland=0.5,regionId='RING_BASIN'}={}){
 const b=profile.bridges?.[bridgeId],r=profile.regional?.[regionId]||{bridgeStrength:1,dryPenalty:.5};if(!b)return 0;
 const wet=clamp(wetland,0,1);
 return clamp(b.wetlandScale*r.bridgeStrength*(wet-(1-wet)*r.dryPenalty),0,1.5)
}
export function transferResource(state,{sourceResource,consumerSpecies,amount=0}={}){
 const next=JSON.parse(JSON.stringify(state||{resources:{},populations:{},energy:{}}));next.resources=next.resources||{};next.energy=next.energy||{};
 const available=Math.max(0,next.resources[sourceResource]||0),take=Math.min(available,Math.max(0,amount));
 next.resources[sourceResource]=available-take;next.energy[consumerSpecies]=clamp((next.energy[consumerSpecies]||0)+take*.12,0,1);
 return{state:next,transferred:take}
}
export function shorelinePredation(profile,state,{predatorId,wetland=.5,regionId='RING_BASIN'}={}){
 const p=profile.predators?.[predatorId];if(!p)return{state,kills:0,prey:null};
 const next=JSON.parse(JSON.stringify(state||{populations:{}}));next.populations=next.populations||{};
 const prey=(p.prey||[]).filter(id=>(next.populations[id]||0)>0).sort((a,b)=>(next.populations[b]||0)-(next.populations[a]||0))[0];
 if(!prey)return{state:next,kills:0,prey:null};
 const strength=clamp(wetland*p.shoreAffinity*(profile.regional?.[regionId]?.bridgeStrength||1),0,1.5);
 const predators=Math.max(1,next.populations[predatorId]||1),preyN=next.populations[prey]||0,kills=Math.min(preyN,Math.floor(predators*p.huntRate*strength));
 next.populations[prey]=Math.max(0,preyN-kills);
 return{state:next,kills,prey}
}
export function crossEcosystemDay(profile,state,{wetland=.5,regionId='RING_BASIN',days=1}={}){
 let next=JSON.parse(JSON.stringify(state||{day:0,resources:{},populations:{},energy:{}}));
 for(let d=0;d<days;d++){
  const aq=bridgeStrength(profile,'AQUATIC_TO_SHORE',{wetland,regionId}),st=bridgeStrength(profile,'SHORE_TO_TERRESTRIAL',{wetland,regionId}),ta=bridgeStrength(profile,'TERRESTRIAL_TO_SHORE',{wetland,regionId});
  for(const [bridgeId,strength] of [['AQUATIC_TO_SHORE',aq],['TERRESTRIAL_TO_SHORE',ta]]){
   const b=profile.bridges[bridgeId],resource=b.resources.find(r=>(next.resources?.[r]||0)>0),consumer=b.consumers.find(c=>(next.populations?.[c]||0)>0);
   if(resource&&consumer){const res=transferResource(next,{sourceResource:resource,consumerSpecies:consumer,amount:strength*.18});next=res.state}
  }
  if(st>0){for(const pid of Object.keys(profile.predators||{})){const r=shorelinePredation(profile,next,{predatorId:pid,wetland,regionId});next=r.state}}
  next.day=(next.day||0)+1
 }
 return next
}
export function biomassConserved(before,after){
 const sum=s=>Object.values(s?.resources||{}).reduce((a,n)=>a+n,0)+Object.values(s?.populations||{}).reduce((a,n)=>a+n,0);
 return sum(after)<=sum(before)+.000001
}
