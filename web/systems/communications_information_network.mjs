const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export function linkBudget({txPower=1,txRangeKm=1,distanceKm=0,terrainLoss=0,weatherLoss=0,relayGain=0,powered=true}={}){
  if(!powered)return{reachable:false,quality:0};
  const range=Math.max(.001,txRangeKm*(1+relayGain));
  const distancePenalty=clamp(distanceKm/range,0,2);
  const quality=clamp(txPower*(1-distancePenalty)-terrainLoss-weatherLoss,0,1);
  return{reachable:distanceKm<=range&&quality>0,quality};
}

export function transmitMessage(message,network={}){
  const {nodes={},links=[]}=network; const deliveries=[];
  for(const link of links){
    if(link.from!==message.senderId)continue;
    const source=nodes[link.from]||{}, target=nodes[link.to]||{};
    const budget=linkBudget({...link,powered:source.powered!==false&&target.powered!==false});
    if(!budget.reachable)continue;
    deliveries.push({messageId:message.id,from:link.from,to:link.to,quality:budget.quality,payload:message.payload,createdAt:message.createdAt??0});
  }
  return deliveries;
}

export function relayDeliveries(deliveries=[],network={}){
  const queue=[...deliveries], seen=new Set(queue.map(d=>`${d.messageId}:${d.to}`)), out=[...queue];
  while(queue.length){
    const current=queue.shift();
    for(const link of network.links||[]){
      if(link.from!==current.to)continue;
      const relay=network.nodes?.[current.to]||{};
      if(!relay.relay)continue;
      const target=network.nodes?.[link.to]||{};
      const budget=linkBudget({...link,relayGain:relay.relayGain||0,powered:relay.powered!==false&&target.powered!==false});
      const key=`${current.messageId}:${link.to}`;
      if(!budget.reachable||seen.has(key))continue;
      const next={...current,from:current.to,to:link.to,quality:Math.min(current.quality,budget.quality)};
      seen.add(key); out.push(next); queue.push(next);
    }
  }
  return out;
}

export function sensorDetection(sensor={},stimulus={}){
  if(sensor.powered===false)return{detected:false,confidence:0};
  if(!(sensor.detects||[]).includes(stimulus.type))return{detected:false,confidence:0};
  const distance=stimulus.distanceKm||0, range=sensor.rangeKm||0;
  const confidence=clamp((sensor.baseConfidence??1)*(1-distance/Math.max(.001,range))-(stimulus.noise||0),0,1);
  return{detected:distance<=range&&confidence>0,confidence,type:stimulus.type,sourceId:stimulus.sourceId??null};
}

export function receiveInformation(agent={},delivery={}){
  if(delivery.to!==agent.nodeId)return{...agent};
  const inbox=[...(agent.inbox||[]),delivery];
  const known=[...(agent.knownInformation||[])];
  if(delivery.quality>=.35&&!known.some(k=>k.messageId===delivery.messageId))known.push({messageId:delivery.messageId,payload:delivery.payload,confidence:delivery.quality,sourceNode:delivery.from});
  return{...agent,inbox,knownInformation:known};
}

export function networkCoverage(nodes={},links=[]){
  const powered=Object.values(nodes).filter(n=>n.powered!==false).length;
  const viable=links.filter(l=>linkBudget({...l,powered:(nodes[l.from]?.powered!==false)&&(nodes[l.to]?.powered!==false)}).reachable).length;
  return{poweredNodes:powered,totalNodes:Object.keys(nodes).length,viableLinks:viable,totalLinks:links.length,coverage:links.length?viable/links.length:0};
}
