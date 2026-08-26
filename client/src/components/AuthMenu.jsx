import { useNavigate } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useAuth } from '@/context/useAuth.js';
import { logout } from '@/services/authService.js';
import profileIcon from '@/assets/icons/profile-icon.png';


const AuthMenu = () => {
    const navigate = useNavigate();
    const { user, setUser, loading } = useAuth();

    if (loading) return null;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        } finally {
            setUser(null);
        }
    };

    return (
        <Popover>
            <PopoverTrigger className='w-11 h-11 rounded-full bg-peach text-maroon-card flex items-center justify-center cursor-pointer'>
                {user ? (
                    <span className='font-bold text-lg'>{user.username.charAt(0).toUpperCase()}</span>
                ) : (
                    <img className='w-5.5' src={profileIcon} alt='ACCOUNT' />
                )}
            </PopoverTrigger>   
            <PopoverContent className='bg-maroon-card rounded-lg p-4 flex flex-col gap-2 w-48'>
                {user ? (
                    <>
                        <p className='text-white text-center text-sm truncate'>{user.username}</p>
                        <button
                            onClick={() => navigate('/history')}
                            className='cursor-pointer rounded-md bg-maroon-slot text-white px-4 py-2 text-sm'
                        >
                            HISTORY
                        </button>
                        <button
                            onClick={handleLogout}
                            className='cursor-pointer rounded-md bg-maroon-slot text-white px-4 py-2 text-sm'
                        >
                            LOG OUT
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate('/login')}
                            className='cursor-pointer rounded-md bg-peach text-maroon-card px-4 py-2 text-sm'
                        >
                            LOG IN
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className='cursor-pointer rounded-md bg-maroon-slot text-white px-4 py-2 text-sm'
                        >
                            REGISTER
                        </button>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default AuthMenu;
