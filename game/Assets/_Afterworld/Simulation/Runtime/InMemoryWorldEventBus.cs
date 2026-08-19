using System;
using System.Collections.Generic;

namespace Tehkne.Afterworld.Simulation
{
    public sealed class InMemoryWorldEventBus : IWorldEventSink
    {
        private readonly List<IWorldEvent> _events = new();
        private readonly Dictionary<Type, List<Delegate>> _handlers = new();

        public IReadOnlyList<IWorldEvent> Events => _events;

        public void Publish(IWorldEvent worldEvent)
        {
            if (worldEvent == null) throw new ArgumentNullException(nameof(worldEvent));
            _events.Add(worldEvent);

            var eventType = worldEvent.GetType();
            if (!_handlers.TryGetValue(eventType, out var handlers)) return;

            foreach (var handler in handlers)
            {
                handler.DynamicInvoke(worldEvent);
            }
        }

        public void Subscribe<TEvent>(Action<TEvent> handler) where TEvent : IWorldEvent
        {
            if (handler == null) throw new ArgumentNullException(nameof(handler));
            var type = typeof(TEvent);
            if (!_handlers.TryGetValue(type, out var handlers))
            {
                handlers = new List<Delegate>();
                _handlers[type] = handlers;
            }
            handlers.Add(handler);
        }

        public void ClearJournal() => _events.Clear();
    }
}
