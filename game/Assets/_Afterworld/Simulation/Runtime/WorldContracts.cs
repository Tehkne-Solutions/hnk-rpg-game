using Tehkne.Afterworld.Core;

namespace Tehkne.Afterworld.Simulation
{
    public interface IWorldCommand
    {
        string CommandId { get; }
        EntityId Issuer { get; }
        long IssuedAtTick { get; }
    }

    public interface IWorldEvent
    {
        string EventId { get; }
        string EventType { get; }
        long OccurredAtTick { get; }
    }

    public interface ICommandHandler<in TCommand> where TCommand : IWorldCommand
    {
        void Handle(WorldState world, TCommand command, IWorldEventSink events);
    }

    public interface IWorldEventSink
    {
        void Publish(IWorldEvent worldEvent);
    }
}
