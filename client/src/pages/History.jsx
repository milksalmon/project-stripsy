import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHistory } from '@/services/historyService.js';
import LoadingIndicator from '@/components/LoadingIndicator';

const History = () => {
    const [sessions, setSessions] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory()
            .then(setSessions)
            .catch(() => setSessions([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className='flex items-center justify-center pt-32'>
                <LoadingIndicator />
            </div>
        );
    }

    if (sessions === null) {
        return (
            <div className='flex flex-col items-center gap-4 pt-32'>
                <p className='text-white text-xl'>LOG IN TO SEE YOUR SESSION HISTORY</p>
                <Link to='/login' className='text-peach'>LOG IN</Link>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center pt-16 gap-8'>
            <h1 className='text-5xl text-white'>SESSION HISTORY</h1>
            <p className='text-peach'>{sessions.length} STRIPS MADE</p>

            {sessions.length === 0 ? (
                <p className='text-white/60'>NOTHING HERE YET</p>
            ) : (
                <ul className='flex flex-col gap-2'>
                    {sessions.map((s) => (
                        <li key={s._id} className='text-white'>{s.comicTitle}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;