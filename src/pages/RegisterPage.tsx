import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import type { RegisterForm } from '../types';

const RegisterPage: React.FC = () => {
  const { register, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 15) {
      newErrors.username = 'Username must be at most 15 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
    } else if (/^\d/.test(formData.username)) {
      newErrors.username = 'Username cannot start with a number';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase letters, and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const success = await register(
      formData.username,
      formData.email,
      formData.password
    );

    if (success) {
      navigate('/profile');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof RegisterForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 bg-gradient-to-b from-gray-50 to-white dark:from-[#0b101b] dark:to-[#0b101b] flex items-stretch lg:items-center justify-center px-4 sm:px-6 lg:px-8 overflow-auto py-10 lg:py-0">
      <div className="w-full max-w-md space-y-5">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto flex items-center justify-center mb-3 rounded-2xl bg-white/70 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
            <img
              src="/image/logos/logo.svg"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Register
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create Your M1Lazer Account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-xl p-5 sm:p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`w-full h-11 rounded-xl pl-10 pr-3 bg-white dark:bg-white/5 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/60 focus:border-transparent transition ${
                    errors.username ? 'border-red-500 focus:ring-red-400/70' : 'border-gray-300/70 dark:border-white/10'
                  }`}
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`w-full h-11 rounded-xl pl-10 pr-3 bg-white dark:bg-white/5 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/60 focus:border-transparent transition ${
                    errors.email ? 'border-red-500 focus:ring-red-400/70' : 'border-gray-300/70 dark:border-white/10'
                  }`}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`w-full h-11 rounded-xl pl-10 pr-10 bg-white dark:bg-white/5 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/60 focus:border-transparent transition ${
                    errors.password ? 'border-red-500 focus:ring-red-400/70' : 'border-gray-300/70 dark:border-white/10'
                  }`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`w-full h-11 rounded-xl pl-10 pr-10 bg-white dark:bg-white/5 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/60 focus:border-transparent transition ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-400/70' : 'border-gray-300/70 dark:border-white/10'
                  }`}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 inline-flex items-center justify-center rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-pink-500/20 hover:opacity-95 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Register'
                )}
              </button>
            </div>

            {/* Switch to login */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account{' '}
                <Link
                  to="/login"
                  className="font-semibold text-pink-500 hover:text-pink-400 underline underline-offset-2"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Legal */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By using our service, you agree to our{' '}
            <a
              href="https://m1pposu.dev/docs/terms-of-service"
              className="text-blue-500 hover:text-blue-400 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://m1pposu.dev/docs/privacy-policy"
              className="text-blue-500 hover:text-blue-400 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
