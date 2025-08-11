import { useState, useEffect } from 'react';
import { authAPI, userAPI, handleApiError, CLIENT_CONFIG } from '../utils/api';
import type { User, TokenResponse } from '../types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await userAPI.getMe();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token might be expired, try to refresh
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              await refreshAccessToken();
            } catch (refreshError) {
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const tokenResponse: TokenResponse = await authAPI.login(
        username,
        password,
        CLIENT_CONFIG.web_client_id,
        CLIENT_CONFIG.web_client_secret
      );

      // Store tokens
      localStorage.setItem('access_token', tokenResponse.access_token);
      localStorage.setItem('refresh_token', tokenResponse.refresh_token);

      // Get user data
      const userData = await userAPI.getMe();
      setUser(userData);
      setIsAuthenticated(true);

              toast.success(`欢迎回来，${userData.username}！`);
      return true;
    } catch (error: any) {
      handleApiError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await authAPI.register(username, email, password);
      
      // After successful registration, automatically log in
      const loginSuccess = await login(username, password);
      if (loginSuccess) {
        toast.success('账户创建成功！');
      }
      return loginSuccess;
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.form_error) {
        const formError = error.response.data.form_error;
        if (formError.user) {
          const { username: usernameErrors, user_email: emailErrors, password: passwordErrors } = formError.user;
          
          if (usernameErrors?.length > 0) {
            toast.error(`用户名：${usernameErrors[0]}`);
          } else if (emailErrors?.length > 0) {
            toast.error(`邮箱：${emailErrors[0]}`);
          } else if (passwordErrors?.length > 0) {
            toast.error(`密码：${passwordErrors[0]}`);
          }
        } else if (formError.message) {
          toast.error(formError.message);
        }
      } else {
        handleApiError(error);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('成功退出登录');
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('没有可用的刷新令牌');

    const tokenResponse: TokenResponse = await authAPI.refreshToken(
      refreshToken,
      CLIENT_CONFIG.web_client_id,
      CLIENT_CONFIG.web_client_secret
    );

    localStorage.setItem('access_token', tokenResponse.access_token);
    localStorage.setItem('refresh_token', tokenResponse.refresh_token);

    // Get updated user data
    const userData = await userAPI.getMe();
    setUser(userData);
    setIsAuthenticated(true);
  };

  const updateUserMode = async (mode?: string) => {
    if (!isAuthenticated) return;
    
    try {
      const userData = await userAPI.getMe(mode);
      setUser(userData);
    } catch (error) {
      handleApiError(error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserMode,
  };
};
