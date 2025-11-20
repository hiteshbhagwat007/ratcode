import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logoutUser } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, User as UserIcon, BarChart } from 'lucide-react';
import { ADMIN_EMAIL } from '../types';

interface NavbarProps {
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      alert("Login Failed");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <nav className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="text-3xl">⚡</span>
              InstaAudit
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && user.email === ADMIN_EMAIL && (
               <button 
               onClick={() => navigate('/admin')}
               className="text-gray-600 dark:text-gray-300 hover:text-primary flex items-center gap-1 text-sm font-medium"
             >
               <BarChart size={18} />
               Dashboard
             </button>
            )}

            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold dark:text-white">{user.displayName}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
                {user.photoURL ? (
                   <img 
                     src={user.photoURL} 
                     alt="Profile" 
                     className="h-9 w-9 rounded-full border-2 border-primary"
                   />
                ) : (
                   <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center">
                     <UserIcon size={18} />
                   </div>
                )}
                <button 
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/30"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;