namespace Tehkne.Afterworld.Simulation
{
    /// <summary>
    /// Canonical deterministic fixture for M10-A0 and the future M0-M9 integration gates.
    /// This is data-only and intentionally contains no Unity scene or prefab references.
    /// </summary>
    public static class FirstDaysGoldenWorld
    {
        public const int DefaultSeed = 1009;

        public static WorldState Create()
        {
            var world = new WorldState
            {
                SaveVersion = 1,
                WorldTick = 0,
                Seed = DefaultSeed
            };

            world.Entities.Add(new EntitySnapshot
            {
                EntityId = "player:main",
                DefinitionId = "agent.player",
                RegionId = "region:shelter",
                LifecycleState = "active"
            });

            world.Entities.Add(new EntitySnapshot
            {
                EntityId = "agent:surv_01",
                DefinitionId = "agent.survivor.01",
                RegionId = "region:shelter",
                LifecycleState = "active"
            });

            world.Entities.Add(new EntitySnapshot
            {
                EntityId = "device:purifier_01",
                DefinitionId = "device.basic_water_purifier",
                RegionId = "region:shelter",
                LifecycleState = "active"
            });

            world.Entities.Add(new EntitySnapshot
            {
                EntityId = "creature:unknown_001",
                DefinitionId = "creature.afterworld_canid_01",
                RegionId = "region:plaza",
                LifecycleState = "active"
            });

            return world;
        }
    }
}
