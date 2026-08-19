using System;

namespace Tehkne.Afterworld.Core
{
    [Serializable]
    public sealed class WorldClock
    {
        public long Tick { get; private set; }

        public WorldClock(long initialTick = 0)
        {
            if (initialTick < 0) throw new ArgumentOutOfRangeException(nameof(initialTick));
            Tick = initialTick;
        }

        public long Advance(long ticks = 1)
        {
            if (ticks < 0) throw new ArgumentOutOfRangeException(nameof(ticks));
            Tick = checked(Tick + ticks);
            return Tick;
        }

        public void Restore(long tick)
        {
            if (tick < 0) throw new ArgumentOutOfRangeException(nameof(tick));
            Tick = tick;
        }
    }
}
