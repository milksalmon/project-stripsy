import { useEffect, useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { useSession } from '@/context/useSession.js';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/context/useRoom.js';

const Reveal = () => {
  const navigate = useNavigate();
  const { setRoom, setCode, setIsHost } = useRoom();
  const { sessionId, setSessionId, setComicTitle, setPanelTitles, setMyPanelIndices } = useSession();
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`http://localhost:3000/sessions/${sessionId}`)
      .then((res) => res.json())
      .then(setSession);
  }, [sessionId]);

  const handleEndSession = () => {
    setRoom(null);
    setCode(null);
    setIsHost(false);
    setSessionId(null);
    setComicTitle(null);
    setPanelTitles([]);
    setMyPanelIndices([]);
    navigate('/');
  };

  if (!session) return null;

  return (
    <div className='flex flex-col items-center gap-6 pt-12 pb-12'>
      <h1 className='text-peach text-5xl tracking-wide'>{session.comicTitle}</h1>

      <div className='grid grid-cols-2 gap-4'>
        {session.panels.map((panel, i) => (
          <div key={i} className='flex flex-col bg-maroon-card rounded-lg overflow-hidden'>
            <p className='text-peach text-center py-2'>{session.panelTitles[i]}</p>
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
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        ))}
      </div>

        <button onClick={handleEndSession} className='bg-peach text-3xl text-maroon-card px-4 py-5 rounded-md'>
          END SESSION
        </button>
    </div>
  );
};

export default Reveal;