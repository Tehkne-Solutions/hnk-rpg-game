const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function roadCapacity({baseCapacity=1,condition=1,laneFactor=1}={}){return Math.max(.01,baseCapacity*clamp(condition,0,1)*Math.max(.1,laneFactor))}
export function congestion({flow=0,capacity=1}={}){const ratio=flow/Math.max(.01,capacity);return{ratio,level:ratio<.7?'FREE':ratio<1?'BUSY':ratio<1.35?'CONGESTED':'GRIDLOCK',delayMultiplier:ratio<=1?1:1+(ratio-1)*1.8}}
export function segmentTravelTime({distance=1,speed=1,condition=1,flow=0,capacity=1,weatherPenalty=0}={}){const free=distance/Math.max(.01,speed*clamp(condition,.1,1));const c=congestion({flow,capacity});return free*c.delayMultiplier*(1+Math.max(0,weatherPenalty))}
export function routeTravelTime(segments=[]){return segments.reduce((sum,s)=>sum+segmentTravelTime(s),0)}
export function accessibilityScore({travelMinutes=30,servicePriority=.5,roadReliability=.8}={}){const timeScore=1-clamp(travelMinutes/120,0,1);return clamp(timeScore*.55+clamp(servicePriority,0,1)*.2+clamp(roadReliability,0,1)*.25,0,1)}
export function maintenanceNeed({condition=1,trafficLoad=0,weatherStress=0,criticality=.5}={}){const wear=(1-clamp(condition,0,1))*.55+clamp(trafficLoad,0,2)/2*.25+clamp(weatherStress,0,1)*.1+clamp(criticality,0,1)*.1;return clamp(wear,0,1)}
export function emergencyResponseTime({baseMinutes=10,route=[],priorityAccess=false}={}){const normal=routeTravelTime(route);return Math.max(0,baseMinutes+normal*(priorityAccess?.75:1))}
export function logisticsThroughput({vehicleCapacity=0,trips=0,routeReliability=1,congestionRatio=0}={}){const congestionPenalty=1/(1+Math.max(0,congestionRatio-1));return Math.max(0,vehicleCapacity*trips*clamp(routeReliability,0,1)*congestionPenalty)}
