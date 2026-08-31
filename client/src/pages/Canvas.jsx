import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { Stage, Layer, Line, Rect } from 'react-konva';
import { useSession } from '@/context/useSession.js';
import { submitPanel } from '@/services/sessionService.js';
import ColorSwatch from '@/components/ColorSwatch';
import StrokeWidthButton from '@/components/StrokeWidthButton';
import EyeDropper from '@/assets/icons/eyedropper.png';
import PaintBrush from '@/assets/icons/paintbrush.png';
import PaintBrushSelected from '@/assets/icons/paintbrush-selected.png';
import Eraser from '@/assets/icons/eraser.png';
import EraserSelected from '@/assets/icons/eraser-selected.png';
import UndoRedo from '@/assets/icons/undo-redo.png';

import ToolButton from '@/components/ToolButton.jsx';

const SWATCH_COLORS = ['#000000', '#FFFFFF', '#7A7A7A', '#C0C0C0', '#2F5FBF', '#8FC1E8', '#C23B6B', '#7A4A2E'];
const STROKE_WIDTHS = [4, 10, 18, 26];

const Canvas = () => {
  const navigate = useNavigate();
  const { sessionId, comicTitle, panelTitles, myPanelIndices, timerDuration } = useSession();
  const [ownedPanelPointer, setOwnedPanelPointer] = useState(0);
  const [waitingForOthers, setWaitingForOthers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const prevTimeLeftRef = useRef(timeLeft);

  useEffect(() => {
    if (!myPanelIndices.length) navigate('/lobby');
  }, [myPanelIndices, navigate]);

  const currentPanelIndex = myPanelIndices[ownedPanelPointer];
  const panelTitle = panelTitles[currentPanelIndex];
  const [tool, setTool] = useState('pen');
  // array of stroke objects
  const [lines, setLines] = useState([]);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTHS[1]);
  const [redoStack, setRedoStack] = useState([]);
  const [swatchColors, setSwatchColors] = useState(SWATCH_COLORS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const color = swatchColors[selectedIndex];
  const isDrawing = useRef(false);
  const isSubmittingRef = useRef(false);
  

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  
  const undo = useCallback(() => {
    if (isDrawing.current || lines.length === 0) return;

    const last = lines[lines.length - 1];
    setLines((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  }, [lines])

  const redo = useCallback(() => {
    if (isDrawing.current || redoStack.length === 0) return;

    const restored = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setLines((prev) => [...prev, restored]);
  }, [redoStack])

  // Undo redo ctrl shortcut register
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.ctrlKey || waitingForOthers) return;

      if (e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, waitingForOthers]);
  
  const handleMouseDown = (e) => {
    if (e.evt.pointerType === 'pen' && e.evt.pressure === 0) return;
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    // double position register to mark stroke immediately on mouse down.
    setLines([...lines, { tool, color, strokeWidth, points: [pos.x, pos.y, pos.x, pos.y] }]);
    setRedoStack([]);
  };

  const handleMouseEnter = (e) => {
    const isPressed = e.evt.pointerType === 'pen' ? e.evt.pressure > 0 : e.evt.buttons === 1;
    if (isPressed) {
      handleMouseDown(e);
    }
  };

  const handleMouseMove = (e) => {
    // No drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    // immutability to implement undo / redo function, where each strokes are independent.
    setLines((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      // add point and replace last
      const updated = { ...last, points: [...last.points, point.x, point.y]};
      return [...prev.slice(0, -1), updated];
    });
  };

  const handleMouseUp = () => {
    // pointer is not drawing anymore
    isDrawing.current = false;
  };

  const handleMouseLeave = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const rect = stage.container().getBoundingClientRect();
    const x = Math.max(0, Math.min(e.evt.clientX - rect.left, stage.width()));
    const y = Math.max(0, Math.min(e.evt.clientY - rect.top, stage.height()));

    setLines((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      const updated = { ...last, points: [...last.points, x, y] };
      return [...prev.slice(0, -1), updated];
    });

    isDrawing.current = false;
    
  }

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) {
      alert('Eyedropper isn\'t supported in this browser.');
      return;
    }

    const eyeDropper = new window.EyeDropper();

    try {
      const result = await eyeDropper.open();
      setSwatchColors((prev) => {
        const updated = [...prev];
        updated[selectedIndex] = result.sRGBHex;
        return updated
      })
    } catch {
      // Handle error logs when user cancels.
    }
  };

  const handleDone = useCallback(async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    isDrawing.current = false;

    try {
      await submitPanel(sessionId, currentPanelIndex, lines);
    } catch (err) {
      console.error(err.error ?? 'Could not submit panel.');
      return;
    } finally {
      isSubmittingRef.current = false;
    }

    if (ownedPanelPointer < myPanelIndices.length - 1) {
      setLines([]);
      setRedoStack([]);
      setOwnedPanelPointer((i) => i + 1);
    } else {
      setWaitingForOthers(true);
    }
  }, [sessionId, currentPanelIndex, lines, ownedPanelPointer, myPanelIndices.length]);

  useEffect(() => {
    if (waitingForOthers || !timerDuration) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(timerDuration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [ownedPanelPointer, waitingForOthers, timerDuration]);

  useEffect(() => {
    if (timeLeft === 0 && !waitingForOthers && prevTimeLeftRef.current !== 0) {
      handleDone();
    }
    prevTimeLeftRef.current = timeLeft;
  }, [handleDone, timeLeft, waitingForOthers]);


  return (
    <div className='flex justify-center items-start gap-6 pt-12 pb-12'>
      {!waitingForOthers && (
        <div className='bg-maroon-slot rounded-lg p-4 grid grid-cols-2 gap-3 self-center'>
          {swatchColors.map((swatch, i) => (
            <ColorSwatch
              key={i}
              color={swatch}
              active={selectedIndex === i}
              onClick={() => setSelectedIndex(i)}
              onColorChange={(newColor) => {
                setSwatchColors((prev) => {
                  const updated = [...prev];
                  updated[i] = newColor;
                  return updated;
                });
                setSelectedIndex(i);
              }}
            />
          ))}

          <button onClick={handleEyeDropper} className='col-span-2 flex items-center justify-center bg-maroon-card rounded-md p-3 cursor-pointer text-2xl'>
            <img className='select-none w-7.5' src={EyeDropper} alt="EYEDROPPER" />
          </button>
        </div>
      )}


      <div>
        <div className='flex flex-col bg-maroon-card w-200 h-25 rounded-t-lg items-center justify-center'>
          <span className='absolute top-2 right-3 text-peach text-4xl tracking-widest'>
            {formatTime(timeLeft)}
          </span>
          <span className='absolute top-2 left-3 text-peach text-4xl tracking-widest'>
            PANEL {currentPanelIndex + 1}/{panelTitles.length}
          </span>
          <span className='text-light-peach text-lg tracking-wide'>{comicTitle}</span>
          <span className='text-peach text-3xl tracking-wide text-center wrap-break-word line-clamp-2'>{panelTitle}</span>
        </div>
        <div className='overflow-hidden rounded-b-lg relative'>
          <Stage
            width={800}
            height={600}
            onPointerDown={waitingForOthers ? undefined : handleMouseDown}
            onPointerMove={waitingForOthers ? undefined : handleMouseMove}
            onPointerUp={waitingForOthers ? undefined : handleMouseUp}
            onPointerLeave={waitingForOthers ? undefined : handleMouseLeave}
            onPointerEnter={waitingForOthers ? undefined : handleMouseEnter}
          >
            <Layer>
              <Rect x={0} y={0} width={800} height={600} fill='#FFF3E3'/>
            </Layer>

            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
            </Layer>
          </Stage>
              {waitingForOthers && (
                <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                  <p className='text-peach text-xl text-center px-8'>
                    Waiting for other participants to finish…
                  </p>
                </div>
              )}
          </div>
      </div>
      {!waitingForOthers && (
        <div className='flex flex-col items-center gap-6 self-center'>
          <div className='bg-maroon-card rounded-lg p-4 flex flex-col gap-3'>
            <ToolButton icon={UndoRedo} onClick={undo}/>
            <ToolButton icon={UndoRedo} flip onClick={redo}/>
            <ToolButton icon={PaintBrush} activeIcon={PaintBrushSelected} active={tool === 'pen'} onClick={() => setTool('pen')}/>
            <ToolButton icon={Eraser} activeIcon={EraserSelected} active={tool === 'eraser'} onClick={() => setTool('eraser')}/>
          </div>

          <div className='flex gap-2 flex-col bg-maroon-card rounded-lg p-4'>
            {STROKE_WIDTHS.map((width) => (
              <StrokeWidthButton
                key={width}
                width={width}
                active={strokeWidth === width}
                onClick={() => setStrokeWidth(width)}
              />
            ))}
          </div>

          <button onClick={handleDone} className='bg-peach text-3xl text-maroon-card px-4 py-5 rounded-md'>
            DONE!
          </button>
        </div>
      )}
    </div>
    
  );
};

export default Canvas;

