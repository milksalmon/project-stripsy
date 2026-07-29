import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { Stage, Layer, Line, Text } from 'react-konva';

const Canvas = () => {
  const navigate = useNavigate();
  const [tool, setTool] = useState('pen');
  // array of stroke objects
  // UNDO is just setLines(lines.slice(0, -1))
  const [lines, setLines] = useState([]);
  const [redoStack, setRedoStack] = useState([])
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    // position, where mouse down is fetched.
    const pos = e.target.getStage().getPointerPosition();
    // set line by position of mouse down.
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
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

  const undo = () => {
    if (lines.length === 0) return;

    const last = lines[lines.length - 1];
    setLines((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  }

  const redo = () => {
    if (redoStack.length === 0) return;

    const restored = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setLines((prev) => [...prev, restored]);
  }

  return (
    <>
      <div>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-500 text-white rounded m-5">Go to AI</button>
      </div>
      <div>
        <button onClick={undo} className="px-4 py-2 bg-blue-500 text-white rounded m-5">Undo</button>
        <button onClick={redo} className="px-4 py-2 bg-blue-500 text-white rounded m-5">Redo</button>
      </div>
      <div>
        <select
          value={tool}
          onChange={(e) => {
            setTool(e.target.value);
          }}
        >
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
        </select>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={10}
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
    </>
    
  );
};

export default Canvas;

