using System;
using System.Collections.Generic;
using Tehkne.Afterworld.Core;

namespace Tehkne.Afterworld.Simulation
{
    [Serializable]
    public sealed class WorldState
    {
        public int SaveVersion = 1;
        public long WorldTick;
        public int Seed;
        public List<EntitySnapshot> Entities = new();
    }

    [Serializable]
    public sealed class EntitySnapshot
    {
        public string EntityId;
        public string DefinitionId;
        public string RegionId;
        public string LifecycleState = "active";

        public EntityId StableId => new(EntityId);
    }
}
