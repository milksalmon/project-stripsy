import { useEffect, useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { useSession } from '@/context/useSession.js';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/context/useRoom.js';
import { useAuth } from '@/context/useAuth.js';

const Reveal = () => {
  const navigate = useNavigate();
  const { setRoom, setCode, setIsHost } = useRoom();
  const { sessionId, setSessionId, setComicTitle, setPanelTitles, setMyPanelIndices } = useSession();
  const [session, setSession] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!sessionId) return;
    fetch(`${import.meta.env.VITE_SERVER_URL}/sessions/${sessionId}`)
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

  const drawWrappedText = (ctx, text, centerX, centerY, maxWidth, lineHeight) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    const shown = lines.slice(0, 2);
    if (lines.length > 2) {
      shown[1] = `${shown[1].slice(0, -1)}…`;
    }

    const startY = centerY - ((shown.length - 1) * lineHeight) / 2;
    shown.forEach((line, i) => {
      ctx.fillText(line, centerX, startY + i * lineHeight);
    });
  };

  const handleSavePng = async () => {
    await Promise.all([
      document.fonts.load('44px NitwFont'),
      document.fonts.load('28px NitwFont'),
    ]);

    const panelW = 800;
    const panelH = 600;
    const titleBarH = 70;
    const headerH = 90;
    const gap = 16;

    const canvasEl = document.createElement('canvas');
    canvasEl.width = panelW * 2 + gap * 3;
    canvasEl.height = headerH + (titleBarH + panelH) * 2 + gap * 3;
    const ctx = canvasEl.getContext('2d');

    ctx.fillStyle = '#935247';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    ctx.fillStyle = '#FFB97B';
    ctx.font = '80px NitwFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(session.comicTitle, canvasEl.width / 2, headerH / 2);

    session.panels.forEach((panel, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cellX = gap + col * (panelW + gap);
      const cellY = headerH + gap + row * (titleBarH + panelH + gap);

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cellX, cellY, panelW, titleBarH + panelH, 16);
      ctx.clip();

      ctx.fillStyle = '#40080B';
      ctx.fillRect(cellX, cellY, panelW, titleBarH);

      ctx.fillStyle = '#FFB97B';
      ctx.font = '28px NitwFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawWrappedText(ctx, session.panelTitles[i] ?? '', cellX + panelW / 2, cellY + titleBarH / 2, panelW - 40, 32);

      ctx.fillStyle = '#FFF3E3';
      ctx.fillRect(cellX, cellY + titleBarH, panelW, panelH);

      const strokeCanvas = document.createElement('canvas');
      strokeCanvas.width = panelW;
      strokeCanvas.height = panelH;
      const strokeCtx = strokeCanvas.getContext('2d');

      panel.strokes.forEach((line) => {
        const points = line.points;
        if (points.length < 4) return;

        strokeCtx.save();
        strokeCtx.globalCompositeOperation = line.tool === 'eraser' ? 'destination-out' : 'source-over';
        strokeCtx.strokeStyle = line.color;
        strokeCtx.lineWidth = line.strokeWidth;
        strokeCtx.lineCap = 'round';
        strokeCtx.lineJoin = 'round';

        strokeCtx.beginPath();
        strokeCtx.moveTo(points[0], points[1]);
        for (let p = 2; p < points.length; p += 2) {
          strokeCtx.lineTo(points[p], points[p + 1]);
        }
        strokeCtx.stroke();
        strokeCtx.restore();
      });
      ctx.drawImage(strokeCanvas, cellX, cellY + titleBarH);
      ctx.restore();
    });

    const link = document.createElement('a');
    const safeTitle = session.comicTitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    link.download = `${safeTitle || 'stripsy-comic'}.png`;
    link.href = canvasEl.toDataURL('image/png');
    link.click();
  };

  if (!session) return null;

  return (
    <div className='flex flex-col items-center gap-6 pt-12 pb-12'>
      <h1 className='text-peach text-5xl tracking-wide'>{session.comicTitle}</h1>
      <div className='grid grid-cols-2 gap-4'>
        {session.panels.map((panel, i) => (
          <div key={i} className='flex flex-col bg-maroon-card rounded-lg overflow-hidden w-100'>
            <div className='h-12.5 flex items-center justify-center'>
              <p className='text-peach text-center py-2 wrap-break-word line-clamp-2 leading-snug'>{session.panelTitles[i]}</p>
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

      <div className='flex gap-4'>
        <button onClick={handleSavePng} className='bg-maroon-card text-3xl text-peach px-4 py-5 rounded-md'>
          SAVE AS PNG
        </button>
        <button onClick={handleEndSession} className='bg-peach text-3xl text-maroon-card px-4 py-5 rounded-md'>
          END SESSION
        </button>
      </div>
      {!user && (
        <span className='absolute bottom-7 right-7 text-gray-400  text-2xl'>
          Use an account to save future sessions!
        </span>
      )}
    </div>
  );
};

export default Reveal;