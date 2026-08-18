const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function seasonAvailable(profile,resourceId,season='VERNAL'){const r=profile.resources?.[resourceId];return !!r&&(r.season||[]).includes(season)}
export function expectedYield(profile,{resourceId,methodId,abundance=1,season='VERNAL',skill=.5,toolQuality=.5}={}){
 const r=profile.resources?.[resourceId],m=profile.methods?.[methodId];if(!r||!m||!seasonAvailable(profile,resourceId,season))return 0;
 const skillFactor=.45+.55*clamp(skill,0,1)*m.skillScale,toolFactor=.50+.50*clamp(toolQuality,0,1)*m.toolScale;
 return Math.max(0,r.baseYield*clamp(abundance,0,1)*skillFactor*toolFactor)
}
export function harvestNode(profile,state,{resourceId,methodId,season='VERNAL',skill=.5,toolQuality=.5,effort=1}={}){
 const node={abundance:state?.abundance??1,lastHarvestDay:state?.lastHarvestDay??null};
 const r=profile.resources?.[resourceId],m=profile.methods?.[methodId];if(!r||!m)return{ok:false,reason:'INVALID_RESOURCE_OR_METHOD',state:node};
 const yieldAmount=expectedYield(profile,{resourceId,methodId,abundance:node.abundance,season,skill,toolQuality})*clamp(effort,0,1.5);
 if(yieldAmount<=0)return{ok:false,reason:'UNAVAILABLE',state:node};
 const depletion=clamp(yieldAmount*r.depletionSensitivity*.22,0,node.abundance);
 const next={...node,abundance:clamp(node.abundance-depletion,0,1),lastHarvestDay:state?.day??0,exhausted:node.abundance-depletion<.08};
 return{ok:true,item:r.item,yieldAmount,depletion,risk:m.risk,noise:m.noise,state:next}
}
export function regrowNode(profile,state,{resourceId,days=1}={}){
 const r=profile.resources?.[resourceId];if(!r)return{...state};
 const gain=(1-Math.max(0,state?.abundance??0))*clamp(days/Math.max(1,r.regrowthDays),0,1)*.42;
 const abundance=clamp((state?.abundance??0)+gain,0,1);return{...state,abundance,exhausted:abundance<.08}
}
export function acquisitionDay(profile,nodes,{season='VERNAL',days=1}={}){
 const next={};for(const[id,state]of Object.entries(nodes||{}))next[id]=regrowNode(profile,state,{resourceId:id,days});
 return{season,nodes:next}
}
export function harvestToInventory(result,inventory={}){
 if(!result?.ok)return{...inventory};return{...inventory,[result.item]:(inventory[result.item]||0)+result.yieldAmount}
}
