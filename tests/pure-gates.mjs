import assert from 'node:assert/strict';
import {canStore,containerLoad,decayStored,haulingCost,transfer} from '../web/systems/storage_logistics.mjs';

const profile={
  items:{
    STONE:{mass:6,volume:.004,tags:['RAW']},
    FOOD:{mass:1,volume:.001,tags:['FOOD','ORGANIC'],perishable:true,decayPerHour:.01}
  },
  containers:{
    PACK:{massCapacity:12,volumeCapacity:.02,allowedTags:[],preservation:0},
    FOOD_CHEST:{massCapacity:20,volumeCapacity:.05,allowedTags:['FOOD','ORGANIC'],preservation:.5}
  }
};

{
  const full={type:'PACK',inventory:{STONE:2}};
  assert.equal(canStore(profile,full,'STONE',1).ok,false,'mass capacity must block impossible storage');
  assert.equal(canStore(profile,full,'STONE',1).reason,'MASS_CAPACITY');
}

{
  const from={type:'PACK',inventory:{STONE:2}};
  const to={type:'PACK',inventory:{}};
  const moved=transfer(profile,from,to,'STONE',1);
  assert.equal(moved.ok,true);
  assert.equal(moved.from.inventory.STONE,1);
  assert.equal(moved.to.inventory.STONE,1);
  const before=containerLoad(profile,from.inventory).mass+containerLoad(profile,to.inventory).mass;
  const after=containerLoad(profile,moved.from.inventory).mass+containerLoad(profile,moved.to.inventory).mass;
  assert.equal(after,before,'transfer must conserve cargo mass');
}

{
  const cost=haulingCost(profile,{STONE:5},10,{carrierCapacity:12,terrain:1.5});
  assert.equal(cost.trips,3,'heavy cargo must require multiple trips');
  assert.equal(cost.labor,45,'labor must reflect distance, terrain and trip count');
}

{
  const open=decayStored(profile,{type:'PACK',inventory:{FOOD:10}},10,{temperature:20,humidity:.5});
  const protectedFood=decayStored(profile,{type:'FOOD_CHEST',inventory:{FOOD:10}},10,{temperature:20,humidity:.5});
  assert.ok(protectedFood.losses.FOOD<open.losses.FOOD,'preservation must reduce food loss without erasing decay');
  assert.ok(protectedFood.losses.FOOD>0,'preservation must not make perishables immortal');
}

console.log('PASS pure gates — AF-001CB storage logistics');
