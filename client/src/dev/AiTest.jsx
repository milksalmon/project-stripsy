import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react';


const AiTest = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      console.log('Fetching:', `${import.meta.env.VITE_SERVER_URL}/ai-test`);
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/ai-test`);
      const data = await res.json();
      setText(data.text);
    } catch (err) {
      console.error(err);
      setText("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-4">
        <button onClick={runTest} className="px-4 py-2 bg-blue-500 text-white rounded">
          {loading ? "Loading..." : "Run AI Test"}
        </button>
        {text && <p className="mt-4">{text}</p>}
      </div>
      <div>
        <button onClick={() => navigate('/t')} className="px-4 py-2 bg-blue-500 text-white rounded">Go to canvas</button>
      </div>
    </>
  );
};

export default AiTest;

