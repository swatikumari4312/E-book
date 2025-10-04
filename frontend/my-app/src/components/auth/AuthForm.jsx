import { useForm } from 'react-hook-form';
import { useState } from 'react'; // <-- Add this line
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthForm = ({ type, onSuccess }) => { // type: 'login' or 'signup'
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await axios.post(`http://localhost:5000${endpoint}`, data);
      if (type === 'signup') {
        toast.success('Account created! Logging in...');
        await axios.post(`http://localhost:5000/api/auth/login`, { email: data.email, password: data.password });
      }
      onSuccess(res.data.user, res.data.token);
      toast.success(type === 'login' ? 'Welcome back!' : 'Account created!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {type === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>
      {type === 'signup' && (
        <input
          {...register('name', { required: 'Name is required' })}
          placeholder="Full Name"
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
      )}
      {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>}
      
      <input
        {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
        aria-invalid={errors.email ? 'true' : 'false'}
      />
      {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}
      
      <div className="relative mb-4">
        <input
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500"
        >
          {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
      {errors.password && <p className="text-red-500 text-sm mb-6">{errors.password.message}</p>}
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Loading...' : type === 'login' ? 'Login' : 'Signup'}
      </motion.button>
    </motion.form>
  );
};

export default AuthForm;