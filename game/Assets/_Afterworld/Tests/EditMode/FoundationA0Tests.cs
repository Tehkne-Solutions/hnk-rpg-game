using NUnit.Framework;
using Tehkne.Afterworld.Core;
using Tehkne.Afterworld.Simulation;

namespace Tehkne.Afterworld.Tests
{
    public sealed class FoundationA0Tests
    {
        [Test]
        public void EntityId_IsStableAndComparable()
        {
            var a = new EntityId("agent:surv_01");
            var b = new EntityId("agent:surv_01");
            Assert.That(a, Is.EqualTo(b));
            Assert.That(a.ToString(), Is.EqualTo("agent:surv_01"));
        }

        [Test]
        public void WorldClock_AdvancesDeterministically()
        {
            var clock = new WorldClock(10);
            Assert.That(clock.Advance(5), Is.EqualTo(15));
            clock.Restore(3);
            Assert.That(clock.Tick, Is.EqualTo(3));
        }

        [Test]
        public void DeterministicRng_ReplaysFromSameSeed()
        {
            var a = new DeterministicRng(1009);
            var b = new DeterministicRng(1009);

            for (var i = 0; i < 32; i++)
            {
                Assert.That(a.NextUInt(), Is.EqualTo(b.NextUInt()));
            }
        }

        [Test]
        public void FirstDaysGoldenWorld_HasCanonicalFoundationEntities()
        {
            var world = FirstDaysGoldenWorld.Create();

            Assert.That(world.SaveVersion, Is.EqualTo(1));
            Assert.That(world.Seed, Is.EqualTo(FirstDaysGoldenWorld.DefaultSeed));
            Assert.That(world.Entities.Count, Is.EqualTo(4));
            Assert.That(world.Entities.Exists(e => e.EntityId == "player:main"), Is.True);
            Assert.That(world.Entities.Exists(e => e.EntityId == "agent:surv_01"), Is.True);
            Assert.That(world.Entities.Exists(e => e.EntityId == "device:purifier_01"), Is.True);
            Assert.That(world.Entities.Exists(e => e.EntityId == "creature:unknown_001"), Is.True);
        }
    }
}
