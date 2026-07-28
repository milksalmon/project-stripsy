import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import React from 'react';

const App = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/ai-test");
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

export default App;

