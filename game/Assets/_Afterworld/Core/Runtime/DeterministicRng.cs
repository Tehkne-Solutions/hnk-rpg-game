using System;

namespace Tehkne.Afterworld.Core
{
    /// <summary>
    /// Small deterministic PRNG for abstract simulation decisions.
    /// State is explicit so save/load and causal replay can reproduce results.
    /// </summary>
    [Serializable]
    public sealed class DeterministicRng
    {
        private uint _state;

        public uint State => _state;

        public DeterministicRng(int seed)
        {
            _state = unchecked((uint)seed);
            if (_state == 0) _state = 0x6D2B79F5u;
        }

        public uint NextUInt()
        {
            var x = _state;
            x ^= x << 13;
            x ^= x >> 17;
            x ^= x << 5;
            _state = x;
            return x;
        }

        public int NextInt(int minInclusive, int maxExclusive)
        {
            if (maxExclusive <= minInclusive) throw new ArgumentOutOfRangeException(nameof(maxExclusive));
            var range = (uint)(maxExclusive - minInclusive);
            return minInclusive + (int)(NextUInt() % range);
        }

        public void Restore(uint state)
        {
            _state = state == 0 ? 0x6D2B79F5u : state;
        }
    }
}
