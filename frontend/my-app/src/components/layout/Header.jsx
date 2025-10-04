import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";


import { 
  SearchIcon,      // <-- Use this instead of MagnifyingGlassIcon
  EyeIcon,
  UserIcon, 
  PlusIcon, 
  MoonIcon, 
  SunIcon 
} from "@heroicons/react/outline"; // Removed EyeSlashIcon
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');  // Persist dark mode

  // Load dark mode on init
  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);  // Bonus: Navigate to search (implement /search route if needed)
      toast('Searching books...');
    }
    setSearch('');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', newDarkMode);
    toast(newDarkMode ? 'Dark mode on' : 'Light mode on');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
          📚 BookHub
        </Link>
        
        {/* Search Form - Mobile-friendly */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 relative hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books by title or author..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            aria-label="Search books"
          />
        </form>

        <div className="flex items-center space-x-4">
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/add-book')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              aria-label="Add a new book"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Book</span>
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Toggle ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? <SunIcon className="h-5 w-5 text-yellow-500" /> : <MoonIcon className="h-5 w-5" />}
          </motion.button>
          
          {user ? (
            <div className="flex items-center space-x-2">
              <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
              <span className="hidden md:inline text-gray-700 dark:text-gray-300">{user.name}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  logout();
                  toast.success('Logged out successfully!');
                  navigate('/login');
                }}
                className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link 
                to="/login" 
                className="px-3 py-2 text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;