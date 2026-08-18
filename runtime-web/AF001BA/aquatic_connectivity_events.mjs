export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const eventModifier=events=>Object.values(events||{}).filter(e=>e.active).reduce((a,e)=>a+(e.connectivityDelta||0),0);
export function effectiveBarrier(base,events){return clamp(base-eventModifier(events),0,1)}
export function canPass(tolerance,barrier){return barrier<=tolerance}
export function stepEvents(events,hours=1){const next=JSON.parse(JSON.stringify(events||{}));for(const e of Object.values(next)){if(!e.active)continue;e.remainingHours=Math.max(0,e.remainingHours-hours);if(e.remainingHours===0)e.active=false}return next}
