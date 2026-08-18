export const AF001BH='vegetation-succession';
export function biomeFromScores(scores){return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];}
export function normalizeCommunity(c){const keys=['grass','sedge','shrub','woodland','wetland'];let total=0;const out={};for(const k of keys){out[k]=Math.max(0,c?.[k]||0);total+=out[k];}if(total<=0){out.grass=1;total=1;}for(const k of keys)out[k]/=total;return out;}
