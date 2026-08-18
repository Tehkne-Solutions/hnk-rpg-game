const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function materialWetnessProfile(profile,id){return profile.materials?.[id]||profile.materials?.STONE}
export function regionalWetnessProfile(profile,id){return profile.regional?.[id]||{rainGain:1,dryingScale:1,puddleDrain:1}}
export function wetnessStep(state,{rain=0,wind=0,dt=1,regionId='RING_BASIN',materialId='STONE',profile}={}){
 const m=materialWetnessProfile(profile,materialId),r=regionalWetnessProfile(profile,regionId);
 const gain=rain*m.absorption*r.rainGain*dt*.14;
 const dry=(1-rain)*m.drying*r.dryingScale*(.35+.65*wind)*dt*.045;
 const wet=clamp((state?.wetness||0)+gain-dry,0,1);
 const puddleGain=rain*m.puddleAffinity*r.rainGain*dt*.07*wet;
 const drain=(1-rain)*r.puddleDrain*(.25+.75*wind)*dt*.035;
 const puddle=clamp((state?.puddle||0)+puddleGain-drain,0,1);
 return {wetness:wet,puddle};
}
export function materialAppearance(profile,materialId,state){
 const m=materialWetnessProfile(profile,materialId),w=clamp(state?.wetness||0,0,1),p=clamp(state?.puddle||0,0,1);
 return {darken:m.darkening*w,roughnessDelta:-m.roughnessDrop*w,specularWater:p*.42,waterFilm:clamp(w*.35+p*.65,0,1)};
}
export function updateSurfaceSet(surfaceStates,ctx){
 const out={};for(const id of Object.keys(ctx.profile.materials||{}))out[id]=wetnessStep(surfaceStates?.[id],{...ctx,materialId:id});return out;
}
