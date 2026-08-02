import { useNavigate } from 'react-router-dom'
import { fetchAiTest } from '../services/geminiService';

const Lobby = () => {
  const navigate = useNavigate();

  const startDrawing = async () => {
    await fetchAiTest();
    navigate('/canvas');
  };

  return (
    <>
      <div className='font-nitw text-white text-5xl'>Session Setup</div>
      <div>
        <button onClick={() => navigate('/canvas')} className='px-4 py-2 bg-blue-500 text-white rounded m-5'>canvas</button>
        <button onClick={() => navigate('/dev/ai-test') } className='px-4 py-2 bg-blue-500 text-white rounded m-5'>aitest</button>
      </div>
    </>
  );
};

export default Lobby;

