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
    </>
  );
};

export default Lobby;

