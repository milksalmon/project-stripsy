import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Stage, Layer, Line, Rect } from 'react-konva';
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
const LOGICAL_WIDTH = 800;
const LOGICAL_HEIGHT = 600;

const Canvas = () => {
  const navigate = useNavigate();
  // Read scale of canvas stage
  const [scale, setScale] = useState(1);
  const canvasWrapperRef = useRef(null);

  // For title
  const [comicTitle] = useState('Comic Title');
  const [panelTitle] = useState('Panel Title');
  
  // array of stroke objects
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTHS[1]);
  const [redoStack, setRedoStack] = useState([]);
  const [swatchColors, setSwatchColors] = useState(SWATCH_COLORS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const color = swatchColors[selectedIndex];
  const isDrawing = useRef(false);
  const mouseButtonDown = useRef(false);
  

  useEffect(() => {
    const container = canvasWrapperRef.current;
    if (!container)
      return;

    const updateScale = () => {
      const available = container.clientWidth;
      setScale(Math.min(1, available / LOGICAL_WIDTH));
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [])

  const undo = () => {
    if (isDrawing.current || lines.length === 0) return;

    const last = lines[lines.length - 1];
    setLines((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  }

  const redo = () => {
    if (isDrawing.current || redoStack.length === 0) return;

    const restored = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setLines((prev) => [...prev, restored]);
  }

  useEffect(() => {
    const handleWindowMouseUp = () => { mouseButtonDown.current = false; };
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => window.removeEventListener('mouseup', handleWindowMouseUp);
  }, []);

  // Undo Redo shortcut register
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.ctrlKey) return;

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
  }, [undo, redo]);
  
  const handleMouseDown = (e) => {
    mouseButtonDown.current = true;
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    // double position register to mark stroke immediately on mouse down.
    setLines([...lines, { tool, color, strokeWidth, points: [pos.x, pos.y, pos.x, pos.y] }]);
    setRedoStack([]);
  };

  const handleMouseEnter = (e) => {
    if (mouseButtonDown.current) {
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
      // add point and replace last
      const updated = { ...last, points: [...last.points, point.x, point.y]};
      return [...prev.slice(0, -1), updated];
    });
  };

  const handleMouseUp = () => {
    // mouse is not drawing anymore
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


  return (
    <div className='flex justify-center items-start gap-6 pt-12'>
        <button onClick={() => navigate(-1)}>back</button>

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

      <div ref={canvasWrapperRef} className='flex-1 min-w-0 max-w-200'>
        <div style={{width: LOGICAL_WIDTH * scale}} className='flex flex-col bg-maroon-card h-25 rounded-t-lg items-center justify-center'>
          <span className='text-peach text-lg tracking-wide'>{comicTitle}</span>
          <span className='text-peach text-3xl tracking-wide'>{panelTitle}</span>
        </div>
        <div className='overflow-hidden rounded-b-lg'>
          <Stage
            width={LOGICAL_WIDTH * scale}
            height={LOGICAL_HEIGHT * scale}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <Layer>
              <Rect x={0} y={0} width={LOGICAL_WIDTH * scale} height={LOGICAL_HEIGHT * scale} fill='#FFF3E3'/>
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
          </div>
      </div>

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

        <button onClick={() => navigate('/reveal')} className='bg-peach text-3xl text-maroon-card px-4 py-5 rounded-md'>
          DONE!
        </button>
      </div>



    </div>
    
  );
};

export default Canvas;

