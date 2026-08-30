import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchHistory } from '@/services/historyService.js';
import { Stage, Layer, Line, Rect } from 'react-konva';
import LoadingIndicator from '@/components/LoadingIndicator';
import arrowIcon from '@/assets/icons/arrow.png';

const History = () => {
    const [sessions, setSessions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);
    const navigate = useNavigate();

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
            <button onClick={() => navigate('/')} className='cursor-pointer absolute top-6 left-6 text-white text-3xl flex flex-row gap-3'>
                <img className='w-7.5' src={arrowIcon} alt="Arrow" />
                <p>Back to Join</p>
            </button>
            <h1 className='text-5xl text-white'>SESSION HISTORY</h1>
            <p className='text-peach'>{sessions.length} STRIPS MADE</p>

            {sessions.length === 0 ? (
                <p className='text-white/60'>NOTHING HERE YET</p>
            ) : (
                <div className='grid grid-cols-3 gap-5 w-full max-w-4xl px-4'>
                    {sessions.map((s) => (
                        <div key={s._id} onClick={() => setSelectedSession(s)} className='w-64.5 mx-auto bg-maroon-card rounded-lg overflow-hidden shadow-lg cursor-pointer'>
                            <div className='grid grid-cols-2 bg-light-peach'>
                                {s.panels.map((panel, i) => (
                                    <div
                                        key={i}
                                        className={[
                                            i % 2 === 0 ? 'border-r-2' : '',
                                            i < 2 ? 'border-b-2' : '',
                                            'border-maroon-card',
                                        ].join(' ')}
                                    >
                                        <Stage width={128} height={96} scaleX={0.16} scaleY={0.16}>
                                            <Layer>
                                                <Rect x={0} y={0} width={800} height={600} fill='#FFF3E3' />
                                            </Layer>
                                            <Layer>
                                                {panel.strokes.map((line, j) => (
                                                    <Line
                                                        key={j}
                                                        points={line.points}
                                                        stroke={line.color}
                                                        strokeWidth={line.strokeWidth}
                                                        tension={0.5}
                                                        lineCap='round'
                                                        lineJoin='round'
                                                        globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
                                                    />
                                                ))}
                                            </Layer>
                                        </Stage>
                                    </div>
                                ))}
                            </div>
                            <p className='text-white text-center text-sm font-bold truncate px-3 py-3'>{s.comicTitle}</p>
                        </div>
                    ))}
                    {selectedSession && (
                        <div
                            className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6'
                            onClick={() => setSelectedSession(null)}
                        >
                            <div
                                className='flex flex-col items-center gap-6 max-h-full overflow-y-auto'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className='text-peach text-4xl tracking-wide text-center'>{selectedSession.comicTitle}</h2>
                                <div className='grid grid-cols-2 gap-4'>
                                    {selectedSession.panels.map((panel, i) => (
                                        <div key={i} className='flex flex-col bg-maroon-card rounded-lg overflow-hidden w-100'>
                                            <div className='h-12.5 flex items-center justify-center'>
                                                <p className='text-peach text-center py-2 wrap-break-word line-clamp-2 leading-snug'>{selectedSession.panelTitles[i]}</p>
                                            </div>
                                            <Stage width={400} height={300} scaleX={0.5} scaleY={0.5}>
                                                <Layer>
                                                    <Rect x={0} y={0} width={800} height={600} fill='#FFF3E3' />
                                                </Layer>
                                                <Layer>
                                                    {panel.strokes.map((line, j) => (
                                                        <Line
                                                            key={j}
                                                            points={line.points}
                                                            stroke={line.color}
                                                            strokeWidth={line.strokeWidth}
                                                            tension={0.5}
                                                            lineCap='round'
                                                            lineJoin='round'
                                                            globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
                                                        />
                                                    ))}
                                                </Layer>
                                            </Stage>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setSelectedSession(null)}
                                    className='bg-peach text-3xl text-maroon-card px-4 py-3 rounded-md'
                                >
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default History;