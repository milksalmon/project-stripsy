import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/useAuth.js';
import { login } from '@/services/authService.js';
import LoadingIndicator from '@/components/LoadingIndicator';
import arrowIcon from '@/assets/icons/arrow.png';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const user = await login(email.trim(), password);
            setUser(user);
            navigate('/');
        } catch (err) {
            setError(err.error ?? 'Could not log in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex items-center justify-center pt-32'>
            <button onClick={() => navigate('/')} className='cursor-pointer absolute top-6 left-6 text-white text-3xl flex flex-row gap-3'>
                <img className='w-7.5' src={arrowIcon} alt="Arrow" />
                <p>Back to Join</p>
            </button>
            <form onSubmit={handleSubmit} className='bg-maroon-card rounded-lg p-8 w-100 flex flex-col gap-4'>
                <h2 className='text-white text-3xl text-center mb-2'>LOG INTO YOUR ROOM</h2>

                <div className='flex flex-col gap-1'>
                    <label className='text-peach text-sm tracking-[0.15em] text-center'>EMAIL</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='bg-maroon-slot rounded-md px-4 py-3 text-white text-center'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='text-peach text-sm tracking-[0.15em] text-center'>PASSWORD</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='bg-maroon-slot rounded-md px-4 py-3 text-white text-center'
                    />
                </div>

                {error && <p className='text-orange-300 text-sm text-center'>{error}</p>}

                <button
                    type='submit'
                    disabled={!email.trim() || !password || isSubmitting}
                    className='cursor-pointer rounded-md bg-peach text-maroon-card px-4 py-3 text-2xl disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? <LoadingIndicator/> : 'LOG IN'}
                </button>

                <p className='text-white text-center text-sm mt-2'>
                    NO ACCOUNT? <Link to='/register' className='text-peach'>REGISTER</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;