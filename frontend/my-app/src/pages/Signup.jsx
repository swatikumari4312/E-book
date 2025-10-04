import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

const Signup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      if (!isLogin && data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (!isLogin && !data.agreedToTerms) {
        toast.error('Please agree to Terms & Conditions');
        return;
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const res = await axios.post(`http://localhost:5000${endpoint}`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (!isLogin) {
        toast.success('Account created! Logging in...');
        await axios.post(`http://localhost:5000/api/auth/login`, {
          email: data.email,
          password: data.password
        });
      }

      toast.success(isLogin ? 'Logged in successfully!' : 'Account created!');
      console.log('User:', res.data.user);
      console.log('Token:', res.data.token);
      // You can now save token in localStorage or context
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-[#6B6B7E] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#2D2D3D] rounded-2xl shadow-2xl overflow-hidden flex">
        
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-white text-3xl font-bold tracking-wider">AMU</div>
            <div className="text-purple-200 text-xs mt-1">Beta Version ⓘ</div>
          </div>
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-white text-3xl font-semibold leading-tight">
              Capturing Moments<br />
              Creating Memories
            </h2>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto space-y-4">
            <div className="mb-6">
              <h1 className="text-white text-2xl font-semibold mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-gray-400 text-sm">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>

            {!isLogin && (
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 bg-[#3D3D4D] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
                className="w-full px-4 py-3 bg-[#3D3D4D] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' }
                })}
                className="w-full px-4 py-3 pr-10 bg-[#3D3D4D] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {!isLogin && (
              <>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    {...register('confirmPassword', { required: 'Please confirm password' })}
                    className="w-full px-4 py-3 bg-[#3D3D4D] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register('agreedToTerms')}
                    className="w-4 h-4 bg-[#3D3D4D] border-gray-600 rounded text-purple-500 focus:ring-purple-500"
                  />
                  <label htmlFor="terms" className="ml-2 text-gray-400 text-sm cursor-pointer">
                    I agree to Terms & Conditions
                  </label>
                </div>
              </>
            )}

            {isLogin && (
              <div className="text-right">
                <button className="text-purple-400 hover:text-purple-300 text-sm">
                  Forgot Password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50 shadow-lg"
            >
              {isSubmitting ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Log in' : 'Create account')}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
