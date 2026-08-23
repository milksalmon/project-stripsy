import { useRef } from 'react';

const ColorSwatch = ({ color, active, onClick, onColorChange }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (active) {
      inputRef.current.click();
    } else {
      onClick();
    }
  };

  return (
    <div className='relative'>
      <button
          onClick={handleClick}
          style={{ backgroundColor: color }}
          className={`w-12 h-12 rounded-md cursor-pointer border-2 border-black ${active ? 'ring-4 ring-peach' : ''}`}
      />
      <input
          ref={inputRef}
          type='color'
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className='absolute top-full left-0 w-full h-1 opacity-0 pointer-events-none'
      />
    </div>
  );
};

export default ColorSwatch;