const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function structureStats(profile,{structureId='HUT',materialId='TIMBER',condition=1}={}){
 const s=profile.structures?.[structureId]||profile.structures.HUT,m=profile.materials?.[materialId]||profile.materials.TIMBER,c=clamp(condition,0,1);
 return{capacity:s.capacity,weatherProtection:clamp(s.weatherProtection*(.65+.35*m.waterResistance)*c,0,1),insulation:clamp(s.insulation*(.6+.4*m.insulation)*c,0,1),security:clamp(s.security*c,0,1),hygieneBase:s.hygieneBase,storage:s.storage*c,durability:m.durability}
}
export function occupancyState(profile,state,{structureId='HUT',occupants=0,animals=0}={}){
 const s=profile.structures?.[structureId]||profile.structures.HUT,total=occupants+animals,load=total/Math.max(1,s.capacity);
 return{total,capacity:s.capacity,overcrowded:load>1,load}
}
export function hygieneDay(profile,state,{structureId='HUT',occupants=0,animals=0,waste=0,cleaning=0,days=1}={}){
 const s=profile.structures?.[structureId]||profile.structures.HUT,occ=occupancyState(profile,state,{structureId,occupants,animals}),prev=state?.hygiene??s.hygieneBase;
 const decline=(occ.load*.05+waste*.08)*days,improve=cleaning*.10*days;
 return{...state,hygiene:clamp(prev-decline+improve,0,1),overcrowded:occ.overcrowded}
}
export function climateStress(profile,state,{structureId='HUT',materialId='TIMBER',condition=1,cold=0,heat=0,rain=0}={}){
 const st=structureStats(profile,{structureId,materialId,condition});
 const coldStress=clamp(cold*(1-st.insulation),0,1),heatStress=clamp(heat*(1-st.weatherProtection*.35),0,1),rainStress=clamp(rain*(1-st.weatherProtection),0,1);
 return{coldStress,heatStress,rainStress,totalStress:clamp(coldStress*.4+heatStress*.3+rainStress*.3,0,1)}
}
export function enclosureRisk(profile,state,{structureId='ANIMAL_PEN',materialId='TIMBER',condition=1,predatorPressure=.3,escapePressure=.2}={}){
 const st=structureStats(profile,{structureId,materialId,condition});
 return{predatorRisk:clamp(predatorPressure*(1-st.security),0,1),escapeRisk:clamp(escapePressure*(1-st.security*.8),0,1)}
}
export function maintenanceDay(profile,state,{structureId='HUT',materialId='TIMBER',weatherExposure=.3,useLoad=.5,maintenance=0,days=1}={}){
 const st=structureStats(profile,{structureId,materialId,condition:state?.condition??1}),prev=state?.condition??1;
 const wear=(weatherExposure*.05+useLoad*.03)*(1-st.durability)*days,repair=maintenance*.08*days;
 return{...state,condition:clamp(prev-wear+repair,0,1),day:(state?.day||0)+days}
}
export function storageProtection(profile,{structureId='HUT',materialId='TIMBER',condition=1,stored=0}={}){
 const st=structureStats(profile,{structureId,materialId,condition});return{capacity:st.storage,overflow:Math.max(0,stored-st.storage),protectedAmount:Math.min(stored,st.storage)}
}
