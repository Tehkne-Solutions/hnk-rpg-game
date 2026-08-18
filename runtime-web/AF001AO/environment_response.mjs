const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function familyResponse(profile,category){return profile.families?.[category]||profile.families?.MIDGROUND||{sway:0,flutter:0,gust:0,response:0}}
export function regionalResponse(profile,regionId){return profile.regional?.[regionId]||{windScale:1,gustScale:1,rainShelter:0,mistRetention:0}}
export function windField({wind=0,regionId='RING_BASIN',time=0,profile}){
 const r=regionalResponse(profile,regionId),base=clamp(wind*r.windScale,0,1.5);
 const wave=(Math.sin(time*.71)+Math.sin(time*1.37+1.4)*.52+1.52)/3.04;
 const gust=clamp(base*(.72+wave*.58)*r.gustScale,0,1.8);
 return {base,gust,direction:[1,0.18],rainShelter:r.rainShelter,mistRetention:r.mistRetention};
}
export function entityWindOffset(entity,category,field,time,profile){
 const f=familyResponse(profile,category),seed=((entity.id||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0)%97)/97;
 const sway=Math.sin(time*(.55+f.response*.5)+seed*6.283)*f.sway*field.base;
 const flutter=Math.sin(time*(2.4+f.response*3.1)+seed*12.1)*f.flutter*field.gust;
 return {lean:(sway+flutter)*.11,yaw:sway*.08+flutter*.035,scaleY:1-Math.abs(flutter)*.012,response:f.response};
}
export function precipitationResponse(style,field){
 return {effectiveRain:clamp(style.precipitation*(1-field.rainShelter),0,1),rainDrift:field.direction[0]*field.base*.22,mistAdvection:field.base*(.18+Math.max(0,field.mistRetention)*.12),mistPersistence:clamp(style.fogBoost+field.mistRetention,0,1)};
}
