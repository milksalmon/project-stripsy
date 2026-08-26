import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/useAuth.js';
import { signup } from '@/services/authService.js';
import LoadingIndicator from '@/components/LoadingIndicator';

const Register = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const user = await signup(email.trim(), password, username.trim());
            setUser(user);
            navigate('/');
        } catch (err) {
            setError(err.error ?? 'Could not create account.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex items-center justify-center pt-32'>
            <form onSubmit={handleSubmit} className='bg-maroon-card rounded-lg p-8 w-100 flex flex-col gap-4'>
                <h2 className='text-white text-3xl text-center mb-2'>CREATE YOUR ACCOUNT</h2>

                <div className='flex flex-col gap-1'>
                    <label className='text-peach text-sm tracking-[0.15em] text-center'>USERNAME</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='bg-maroon-slot rounded-md px-4 py-3 text-white text-center'
                    />
                </div>

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

                <div className='flex flex-col gap-1'>
                    <label className='text-peach text-sm tracking-[0.15em] text-center'>CONFIRM PASSWORD</label>
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='bg-maroon-slot rounded-md px-4 py-3 text-white text-center'
                    />
                </div>

                {error && <p className='text-orange-300 text-sm text-center'>{error}</p>}

                <button
                    type='submit'
                    disabled={!username.trim() || !email.trim() || !password || !confirmPassword || isSubmitting}
                    className='cursor-pointer rounded-md bg-peach text-maroon-card px-4 py-3 text-2xl disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? <LoadingIndicator/> : 'REGISTER'}
                </button>

                <p className='text-white text-center text-sm mt-2'>
                    ALREADY HAVE AN ACCOUNT? <Link to='/login' className='text-peach'>LOG IN</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;