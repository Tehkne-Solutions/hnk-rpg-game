using System;

namespace Tehkne.Afterworld.Core
{
    [Serializable]
    public readonly struct EntityId : IEquatable<EntityId>
    {
        public string Value { get; }

        public EntityId(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("EntityId cannot be empty.", nameof(value));

            Value = value;
        }

        public bool Equals(EntityId other) => string.Equals(Value, other.Value, StringComparison.Ordinal);
        public override bool Equals(object obj) => obj is EntityId other && Equals(other);
        public override int GetHashCode() => StringComparer.Ordinal.GetHashCode(Value ?? string.Empty);
        public override string ToString() => Value;

        public static bool operator ==(EntityId left, EntityId right) => left.Equals(right);
        public static bool operator !=(EntityId left, EntityId right) => !left.Equals(right);
    }
}
