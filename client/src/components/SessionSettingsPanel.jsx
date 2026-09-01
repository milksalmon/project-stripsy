import { useState } from 'react';
import LoadingIndicator from './LoadingIndicator.jsx';

const TIMER_OPTIONS = [60, 90, 120];

const SessionSettingsPanel = ({ timerDuration, themePrompt, onApply }) => {
    const [timer, setTimer] = useState(timerDuration ?? TIMER_OPTIONS[0]);
    const [theme, setTheme] = useState(themePrompt ?? '');
    const [ isLoading, setIsLoading ] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    const handleApply = async () => {
        setIsLoading(true);
        try {
            await onApply({ timer, theme });
            setIsApplied(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='bg-[#411C1B] rounded-lg p-6 w-70'>
            <p className='text-orange-300 text-3xl text-center'>SESSION SETTINGS</p>
            
            <p className='text-orange-300 text-xl mb-3'>TIMER</p>

            <div className='flex gap-2 mb-5'>
                {TIMER_OPTIONS.map((option) => (
                    <button key={option} onClick={() => setTimer(option)} className={`cursor-pointer flex-1 rounded-md py-2 text-xl ${timer === option ? 'bg-orange-300 text-maroon-card' : 'bg-maroon-slot text-orange-300'}`}>
                        {option}S
                    </button>
                ))}
            </div>

            <p className='text-orange-300 text-xl mb-3'>AI PROMPTS</p>

            <textarea 
                maxLength={100}
                type='text' 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)} 
                placeholder='THEME (OPTIONAL)' 
                className='w-full rounded-md bg-maroon-slot text-white placeholder-white/40 px-3 py-2 mb-5 text-xl' 
            />

            <button onClick={handleApply} className='w-full rounded-md bg-orange-300 text-maroon-card py-2 cursor-pointer'>{isLoading? <LoadingIndicator/> :  isApplied ? 'APPLIED' : 'APPLY'}</button>
        </div>
    );

}

export default SessionSettingsPanel;