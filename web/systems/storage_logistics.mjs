const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export function containerLoad(profile={},inventory={}){
  let mass=0,volume=0;
  for(const [id,qty] of Object.entries(inventory)){
    const item=profile.items?.[id]||{};
    mass+=Math.max(0,qty)*(item.mass||0);
    volume+=Math.max(0,qty)*(item.volume||0);
  }
  return {mass,volume};
}

export function canStore(profile={},container={},itemId,qty=1){
  const item=profile.items?.[itemId];
  if(!item||qty<=0)return{ok:false,reason:'UNKNOWN_ITEM'};
  const spec=profile.containers?.[container.type];
  if(!spec)return{ok:false,reason:'UNKNOWN_CONTAINER'};
  const next={...(container.inventory||{})};next[itemId]=(next[itemId]||0)+qty;
  const load=containerLoad(profile,next);
  if(load.mass>spec.massCapacity+1e-9)return{ok:false,reason:'MASS_CAPACITY',load};
  if(load.volume>spec.volumeCapacity+1e-9)return{ok:false,reason:'VOLUME_CAPACITY',load};
  if(spec.allowedTags?.length&&!item.tags?.some(t=>spec.allowedTags.includes(t)))return{ok:false,reason:'INCOMPATIBLE_ITEM',load};
  return{ok:true,load};
}

export function transfer(profile={},from={},to={},itemId,qty=1){
  if(qty<=0||((from.inventory||{})[itemId]||0)<qty)return{ok:false,reason:'INSUFFICIENT_SOURCE'};
  const permitted=canStore(profile,to,itemId,qty);if(!permitted.ok)return permitted;
  const source={...(from.inventory||{})},target={...(to.inventory||{})};
  source[itemId]-=qty;if(source[itemId]<=0)delete source[itemId];target[itemId]=(target[itemId]||0)+qty;
  return{ok:true,from:{...from,inventory:source},to:{...to,inventory:target},moved:{itemId,qty}};
}

export function haulingCost(profile={},cargo={},distance=0,{carrierCapacity=20,terrain=1}={}){
  const load=containerLoad(profile,cargo);
  const burden=carrierCapacity<=0?Infinity:load.mass/carrierCapacity;
  const trips=Math.max(1,Math.ceil(Math.max(0,burden)));
  return{mass:load.mass,volume:load.volume,trips,labor:Math.max(0,distance)*Math.max(.1,terrain)*trips};
}

export function decayStored(profile={},container={},elapsedHours=0,{temperature=20,humidity=.5}={}){
  const inventory={...(container.inventory||{})},losses={};
  for(const [id,qty] of Object.entries(inventory)){
    const item=profile.items?.[id];if(!item?.perishable)continue;
    const protection=profile.containers?.[container.type]?.preservation||0;
    const climate=Math.max(.15,1+(temperature-20)*.025+Math.max(0,humidity-.5)*.5);
    const rate=Math.max(0,item.decayPerHour||0)*climate*(1-clamp(protection,0,.95));
    const lost=Math.min(qty,qty*rate*Math.max(0,elapsedHours));
    if(lost>0){inventory[id]=Math.max(0,qty-lost);losses[id]=lost;if(inventory[id]<=1e-9)delete inventory[id];}
  }
  return{container:{...container,inventory},losses};
}
