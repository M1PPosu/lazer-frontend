import type { AxiosRequestConfig } from 'axios';

import { API_BASE_URL, api } from './client';

export const userAPI = {
  getMe: async (ruleset?: string) => {
    const url = ruleset ? `/api/v2/me/${ruleset}` : '/api/v2/me/';
    const response = await api.get(url);
    return response.data;
  },

  getUser: async (
    userIdOrName: string | number,
    ruleset?: string,
    config?: AxiosRequestConfig,
  ) => {
    const url = ruleset
      ? `/api/v2/users/${userIdOrName}/${ruleset}`
      : `/api/v2/users/${userIdOrName}`;
    const response = await api.get(url, config);
    return response.data;
  },

  getAvatarUrl: (userId: number, bustCache: boolean = false) => {
    const baseUrl = `${API_BASE_URL}/users/${userId}/avatar`;
    return bustCache ? `${baseUrl}?t=${Date.now()}` : baseUrl;
  },

  uploadAvatar: async (imageFile: File | Blob) => {
    console.log('开始上传头像，文件类型:', imageFile.type, '文件大小:', imageFile.size);

    const formData = new FormData();
    const isJpeg = imageFile.type === 'image/jpeg';
    const fileName = isJpeg ? 'avatar.jpg' : 'avatar.png';
    formData.append('content', imageFile, fileName);

    console.log('FormData内容:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
      if (value instanceof Blob) {
        console.log(`  类型: ${value.type}, 大小: ${value.size}`);
      }
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('未找到访问令牌，请重新登录');
    }

    console.log('准备发送请求到:', `${API_BASE_URL}/api/private/avatar/upload`);

    const response = await fetch(`${API_BASE_URL}/api/private/avatar/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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

  rename: async (newUsername: string) => {
    console.log('重命名用户名:', newUsername);

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('未找到访问令牌');
    }

    const response = await fetch(`${API_BASE_URL}/api/private/rename`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUsername),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      console.error('重命名失败响应:', errorData);
      throw new Error(errorData?.detail || errorData?.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('重命名响应:', result);
    return result;
  },

  uploadCover: async (imageFile: File | Blob) => {
    console.log('开始上传头图，文件类型:', imageFile.type, '文件大小:', imageFile.size);

    const formData = new FormData();
    const isJpeg = imageFile.type === 'image/jpeg';
    const fileName = isJpeg ? 'cover.jpg' : 'cover.png';
    formData.append('content', imageFile, fileName);

    console.log('FormData内容:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
      if (value instanceof Blob) {
        console.log(`  类型: ${value.type}, 大小: ${value.size}`);
      }
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('未找到访问令牌');
    }

    console.log('准备发送请求到:', `${API_BASE_URL}/api/private/cover/upload`);

    const response = await fetch(`${API_BASE_URL}/api/private/cover/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('响应状态:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      console.error('上传失败响应:', errorData);
      throw new Error(errorData?.detail || errorData?.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('上传响应:', result);
    return result;
  },

  getRecentActivity: async (
    userId: number,
    limit: number = 6,
    offset: number = 0
  ) => {
    console.log('获取用户最近活动:', { userId, limit, offset });

    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const url = `/api/v2/users/${userId}/recent_activity?${params.toString()}`;
    const response = await api.get(url);
    return response.data;
  },

  getUserPage: async (userId: number) => {
    console.log('获取用户页面内容（编辑用）:', { userId });
    const response = await api.get(`/api/v2/users/${userId}/page`);
    return response.data;
  },

  updateUserPage: async (userId: number, content: string) => {
    console.log('更新用户页面内容:', { userId, contentLength: content.length });
    const response = await api.put(`/api/v2/users/${userId}/page`, {
      body: content,
    });
    return response.data;
  },

  validateBBCode: async (content: string) => {
    console.log('验证BBCode内容:', { contentLength: content.length });
    const response = await api.post('/api/v2/me/validate-bbcode', {
      content: content,
    });
    return response.data;
  },

  getBestScores: async (
    userId: number,
    mode: string = 'osu',
    limit: number = 6,
    offset: number = 0
  ) => {
    console.log('获取用户最佳成绩:', { userId, mode, limit, offset });

    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    params.append('mode', mode);

    const url = `/api/v2/users/${userId}/scores/best?${params.toString()}`;
    const response = await api.get(url, {
      headers: {
        'x-api-version': '20220705',
      },
    });
    return response.data;
  },
};
