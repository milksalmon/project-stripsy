import { useNavigate } from 'react-router-dom';

const Reveal = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='font-nitw text-white text-5xl'>Reveal</div>
      <button onClick={() => navigate(-1)}>back</button>
    </>
  );
};

export default Reveal;
