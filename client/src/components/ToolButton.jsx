const ToolButton = ({ icon, activeIcon, active, onClick, flip }) => {
    const src = active ? activeIcon : icon;

    return (
      <button
        onClick={onClick}
        className={`p-3 rounded-md cursor-pointer ${
          active ? 'bg-peach text-maroon-card ring-2 ring-white border-2 border-black' : 'bg-maroon-slot text-peach'
        }`}
      >
        <img src={src} alt="tools" className={`select-none w-7.5 ${flip ? '-scale-x-100' : ''}`}/>
      </button>
    );
};

export default ToolButton;