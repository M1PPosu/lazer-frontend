import axios from 'axios';
import toast from 'react-hot-toast';

// API base URL - adjust this to match your osu! API server
const API_BASE_URL = 'https://lazer.gu-osu.gmoe.cc';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // 确保不发送cookies避免CORS问题
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (username: string, password: string, clientId: number, clientSecret: string) => {
    console.log('Login attempt with:', { username, clientId }); // Debug log
    
    const formData = new FormData();
    formData.append('grant_type', 'password');
    formData.append('client_id', clientId.toString());
    formData.append('client_secret', clientSecret);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('scope', '*');

    try {
      const response = await axios.post(`${API_BASE_URL}/oauth/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    console.log('Register attempt with:', { username, email }); // Debug log
    
    const formData = new FormData();
    formData.append('user_username', username);
    formData.append('user_email', email);
    formData.append('user_password', password);

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string, clientId: number, clientSecret: string) => {
    const formData = new FormData();
    formData.append('grant_type', 'refresh_token');
    formData.append('client_id', clientId.toString());
    formData.append('client_secret', clientSecret);
    formData.append('refresh_token', refreshToken);

    const response = await axios.post(`${API_BASE_URL}/oauth/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};

// User API functions
export const userAPI = {
  getMe: async (ruleset?: string) => {
    const url = ruleset ? `/api/v2/me/${ruleset}` : '/api/v2/me/';
    const response = await api.get(url);
    return response.data;
  },

  getUser: async (userIdOrName: string | number, ruleset?: string) => {
    const url = ruleset ? `/api/v2/users/${userIdOrName}/${ruleset}` : `/api/v2/users/${userIdOrName}`;
    const response = await api.get(url);
    return response.data;
  },

  // 获取用户头像URL
  getAvatarUrl: (userId: number) => {
    // 根据osu_lazer_api-main的实现，构建头像URL
    // 如果用户有自定义头像，会返回完整URL；否则返回默认头像
    return `${API_BASE_URL}/users/${userId}/avatar`;
  },

  // 上传用户头像
  uploadAvatar: async (imageFile: File | Blob) => {
    console.log('开始上传头像，文件类型:', imageFile.type, '文件大小:', imageFile.size);
    
    const formData = new FormData();
    // 根据blob类型确定文件扩展名
    const isJpeg = imageFile.type === 'image/jpeg';
    const fileName = isJpeg ? 'avatar.jpg' : 'avatar.png';
    formData.append('content', imageFile, fileName);
    
    // 验证FormData内容
    console.log('FormData内容:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
      if (value && typeof value === 'object' && ('size' in value) && ('type' in value)) {
        console.log(`  类型: ${(value as any).type}, 大小: ${(value as any).size}`);
      }
    }

    // 获取token
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('未找到访问令牌，请重新登录');
    }

    console.log('准备发送请求到:', `${API_BASE_URL}/api/private/avatar/upload`);

    // 直接使用fetch来避免axios的content-type处理问题
    const response = await fetch(`${API_BASE_URL}/api/private/avatar/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // 不设置Content-Type，让浏览器自动设置
      },
      body: formData,
    });

    console.log('响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('上传失败响应:', errorData);
      throw new Error(errorData?.detail || errorData?.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('上传响应:', result);
    return result;
  },
};

// Error handler utility
export const handleApiError = (error: any) => {
  if (error.response?.data?.error_description) {
    toast.error(error.response.data.error_description);
  } else if (error.response?.data?.message) {
    toast.error(error.response.data.message);
  } else if (error.message) {
    toast.error(error.message);
  } else {
    toast.error('发生意外错误');
  }
};

// Client credentials - in production, these should be environment variables
export const CLIENT_CONFIG = {
  osu_client_id: 6,
  osu_client_secret: '454532f3dba952663c8917ad15204d501ec2f28e41b3bce4b276b5d4a2a25823918f4711bb87a7fe',
  web_client_id: 6,
  web_client_secret: '454532f3dba952663c8917ad15204d501ec2f28e41b3bce4b276b5d4a2a25823918f4711bb87a7fe',
};
