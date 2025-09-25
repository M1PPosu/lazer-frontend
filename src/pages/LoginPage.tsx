import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/profile');
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="
        relative min-h-screen overflow-hidden
        flex items-center justify-center
        px-4 sm:px-6 lg:px-8
        bg-gray-50 dark:bg-[#0b101b]
      "
    >
      {/* soft grid + vignette */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 -z-10 opacity-[0.18]
          dark:opacity-[0.12]
          [background-image:linear-gradient(to_right,rgba(255,255,255,.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.10)_1px,transparent_1px)]
          [background-size:42px_42px]
          [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]
        "
      />

      <div className="w-full max-w-md">
        <div className="relative rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-2xl dark:border-white/10 dark:bg-white/[0.06]">
          <div
            aria-hidden
            className="
              pointer-events-none absolute left-1/2 -translate-x-1/2
              -top-8 h-32 w-32 rounded-full
              bg-pink-500/40 blur-2xl dark:bg-pink-500/35
            "
          />
          <div className="px-5 py-6 sm:px-6">
            <LoginForm />
          </div>
        </div>

        {/* helper text */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Trouble signing in? Open a ticket in our discord!
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
