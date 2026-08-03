const StrokeWidthButton = ({ width, active, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`w-12 h-12 rounded-md flex items-center justify-center cursor-pointer ${
          active ? 'bg-peach' : 'bg-maroon-slot'
        }`}
      >
        <span
          style={{ width: width, height: width }}
          className={`rounded-full ${active ? 'bg-maroon-card' : 'bg-peach'}`}
        />
      </button>
    );
  };

  export default StrokeWidthButton;