const ParticipantSlot = ({ number, participant }) => {
    
    if (!participant) {
        return (
            <div className='rounded-md aspect-3/4 flex items-center justify-center bg-maroon-slot-empty text-white/40 border-dotted border-3'>
                <span className='text-3xl'>WAIT</span>
            </div>
        );

    }

    return (
        <div className='rounded-md aspect-3/4 flex flex-col items-center gap-1 bg-maroon-slot'>
            <span className='text-orange-300 text-2xl'>{number}</span>
            <span className="text-white text-3xl text-center leading-tight">{participant.username}{participant.isHost && <><br />(HOST)</>}</span>
        </div>
    );

}

export default ParticipantSlot;