import axios, { type AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// API base URL - adjust this to match your osu! API server
const API_BASE_URL = 'https://lazer-api.g0v0.top';
//const API_BASE_URL = 'http://127.0.0.1:8000';
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
    } catch (error) {
      const err = error as { response?: { data?: unknown }; message?: string };
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    }
  },

  register: async (username: string, email: string, password: string) => {
    console.log('Register attempt with:', { username, email }); // Debug log
    
    // 使用 URLSearchParams 来确保正确的 application/x-www-form-urlencoded 格式
    // 后端期望的字段名格式是 user[fieldname]
    const formData = new URLSearchParams();
    formData.append('user[username]', username);
    formData.append('user[user_email]', email);
    formData.append('user[password]', password);

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: unknown }; message?: string };
      console.error('Register error:', err.response?.data || err.message);
      throw err;
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

  // 获取用户头像URL
  getAvatarUrl: (userId: number, bustCache: boolean = false) => {
    // 根据osu_lazer_api-main的实现，构建头像URL
    // 如果用户有自定义头像，会返回完整URL；否则返回默认头像
    const baseUrl = `${API_BASE_URL}/users/${userId}/avatar`;
    // 在需要时添加时间戳破坏缓存
    return bustCache ? `${baseUrl}?t=${Date.now()}` : baseUrl;
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
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
      if (value instanceof Blob) {
        console.log(`  类型: ${value.type}, 大小: ${value.size}`);
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

  // 修改用户名
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

  // 上传用户头图
  uploadCover: async (imageFile: File | Blob) => {
    console.log('开始上传头图，文件类型:', imageFile.type, '文件大小:', imageFile.size);
    
    const formData = new FormData();
    // 根据blob类型确定文件扩展名
    const isJpeg = imageFile.type === 'image/jpeg';
    const fileName = isJpeg ? 'cover.jpg' : 'cover.png';
    formData.append('content', imageFile, fileName);
    
    // 验证FormData内容
    console.log('FormData内容:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
      if (value instanceof Blob) {
        console.log(`  类型: ${value.type}, 大小: ${value.size}`);
      }
    }

    // 获取token
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('未找到访问令牌');
    }

    console.log('准备发送请求到:', `${API_BASE_URL}/api/private/cover/upload`);

    // 直接使用fetch来避免axios的content-type处理问题
    const response = await fetch(`${API_BASE_URL}/api/private/cover/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // 不设置Content-Type，让浏览器自动设置
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

  // 获取用户最近活动
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

  // 获取用户页面内容（仅用于编辑时获取最新内容，显示时使用用户对象中的page字段）
  getUserPage: async (userId: number) => {
    console.log('获取用户页面内容（编辑用）:', { userId });
    const response = await api.get(`/api/v2/users/${userId}/page`);
    return response.data;
  },

  // 更新用户页面内容
  updateUserPage: async (userId: number, content: string) => {
    console.log('更新用户页面内容:', { userId, contentLength: content.length });
    const response = await api.put(`/api/v2/users/${userId}/page`, {
      body: content
    });
    return response.data;
  },

  // 验证BBCode内容
  validateBBCode: async (content: string) => {
    console.log('验证BBCode内容:', { contentLength: content.length });
    const response = await api.post('/api/v2/me/validate-bbcode', {
      content: content
    });
    return response.data;
  },

  // 获取用户最佳成绩
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
    
    // 添加 x-api-version 请求头，确保获取完整的 Best Performance 数据
    // 版本 >= 20220705 支持 weight 字段和其他扩展功能
    const response = await api.get(url, {
      headers: {
        'x-api-version': '20220705'
      }
    });
    return response.data;
  },
};

// Friends API functions - osu! 使用单向关注制
export const friendsAPI = {
  // 获取好友列表
  getFriends: async () => {
    const response = await api.get('/api/v2/friends');
    return response.data;
  },

  // 添加好友（单向关注）
  addFriend: async (targetUserId: number) => {
    const response = await api.post(`/api/v2/friends?target=${targetUserId}`);
    return response.data;
  },

  // 删除好友关系
  removeFriend: async (targetUserId: number) => {
    const response = await api.delete(`/api/v2/friends/${targetUserId}`);
    return response.data;
  },

  // 获取屏蔽列表
  getBlocks: async () => {
    const response = await api.get('/api/v2/blocks');
    return response.data;
  },

  // 屏蔽用户
  blockUser: async (targetUserId: number) => {
    const response = await api.post(`/api/v2/blocks?target=${targetUserId}`);
    return response.data;
  },

  // 取消屏蔽
  unblockUser: async (targetUserId: number) => {
    const response = await api.delete(`/api/v2/blocks/${targetUserId}`);
    return response.data;
  },

  // 检查与指定用户的关系状态
  checkRelationship: async (targetUserId: number) => {
    try {
      // 使用新的专用 API 端点来获取关系状态
      const response = await api.get(`/api/private/relationship/check/${targetUserId}`);
      return response.data;
    } catch (error) {
      console.error('检查用户关系失败:', error);
      // 如果新 API 不可用，回退到原来的方法
      try {
        const [friends, blocks] = await Promise.all([
          friendsAPI.getFriends(),
          friendsAPI.getBlocks()
        ]);

        const isFriend = friends.some((friend: { target_id: number; mutual?: boolean }) => friend.target_id === targetUserId);
        const isBlocked = blocks.some((block: { target_id: number }) => block.target_id === targetUserId);
        const isMutual = friends.some((friend: { target_id: number; mutual?: boolean }) => friend.target_id === targetUserId && friend.mutual === true);
        
        // 在 osu! 的好友系统中：
        // 1. isFriend = true 且 mutual = true: 双向关注，对方关注了我
        // 2. isFriend = true 且 mutual = false: 单向关注，我关注了对方，对方没关注我
        // 3. isFriend = false: 我没有关注对方，无法直接判断对方是否关注了我
        let followsMe = false;
        
        if (isFriend) {
          // 我们关注了对方，mutual 字段可以告诉我们是否双向
          followsMe = isMutual;
        } else {
          // 我们没有关注对方，暂时无法确定对方是否关注了我们
          // 在实际使用中，这种情况下 UI 应该显示"关注"而不是"回关"
          followsMe = false;
        }
        
        // 返回与新 API 格式一致的字段
        return {
          is_following: isFriend,   // 我是否关注对方
          isBlocked: isBlocked,     // 是否屏蔽
          mutual: isMutual,         // 是否互相关注
          is_followed: followsMe    // 对方是否关注我
        };
      } catch (fallbackError) {
        console.error('备用方法也失败:', fallbackError);
        // 返回与新 API 格式一致的默认值
        return {
          is_following: false,  // 我是否关注对方
          isBlocked: false,     // 是否屏蔽
          mutual: false,        // 是否互相关注
          is_followed: false    // 对方是否关注我
        };
      }
    }
  },

  // 获取用户的关注者列表
  getUserFollowers: async (userId: number) => {
    const response = await api.get(`/api/v2/relationship/followers/${userId}`);
    return response.data;
  },



  // 获取用户详情
  getUser: async (userId: number) => {
    const response = await api.get(`/api/v2/users/${userId}`);
    return response.data;
  }
};

// Error handler utility
export const handleApiError = (error: unknown) => {
  const err = error as {
    response?: { data?: { error_description?: string; message?: string } };
    message?: string;
  };
  if (err.response?.data?.error_description) {
    toast.error(err.response.data.error_description);
  } else if (err.response?.data?.message) {
    toast.error(err.response.data.message);
  } else if (err.message) {
    toast.error(err.message);
  } else {
    toast.error('发生意外错误');
  }
};

// Rankings API functions
export const rankingsAPI = {
  // 获取用户排行榜
  getUserRankings: async (
    ruleset: string, 
    type: 'performance' | 'score', 
    country?: string, 
    page: number = 1
  ) => {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    params.append('page', page.toString());
    
    const response = await api.get(`/api/v2/rankings/${ruleset}/${type}?${params}`);
    return response.data;
  },

  // 获取地区排行榜
  getCountryRankings: async (ruleset: string, page: number = 1) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    const response = await api.get(`/api/v2/rankings/${ruleset}/country?${params}`);
    return response.data;
  },

  // 获取战队排行榜
  getTeamRankings: async (
    ruleset: string, 
    sort: 'performance' | 'score', 
    page: number = 1
  ) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    const response = await api.get(`/api/v2/rankings/${ruleset}/team/${sort}?${params}`);
    return response.data;
  },
};

// Teams API functions
export const teamsAPI = {
  // 获取战队详情
  getTeam: async (teamId: number) => {
    const response = await api.get(`/api/private/team/${teamId}`);
    return response.data;
  },

  // 创建战队
  createTeam: async (teamData: FormData) => {
    const response = await api.post('/api/private/team', teamData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 修改战队
  updateTeam: async (teamId: number, teamData: FormData) => {
    const response = await api.patch(`/api/private/team/${teamId}`, teamData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 删除战队
  deleteTeam: async (teamId: number) => {
    const response = await api.delete(`/api/private/team/${teamId}`);
    return response.data;
  },

  // 请求加入战队
  requestJoinTeam: async (teamId: number) => {
    const response = await api.post(`/api/private/team/${teamId}/request`);
    return response.data;
  },

  // 接受加入请求
  acceptJoinRequest: async (teamId: number, userId: number) => {
    const response = await api.post(`/api/private/team/${teamId}/${userId}/request`);
    return response.data;
  },

  // 拒绝加入请求
  rejectJoinRequest: async (teamId: number, userId: number) => {
    const response = await api.delete(`/api/private/team/${teamId}/${userId}/request`);
    return response.data;
  },

  // 踢出成员 / 退出战队
  removeMember: async (teamId: number, userId: number) => {
    const response = await api.delete(`/api/private/team/${teamId}/${userId}`);
    return response.data;
  },
};

// Stats API functions
export const statsAPI = {
  // Get current server stats
  getCurrentStats: async () => {
    const response = await api.get('/api/v2/stats');
    return response.data;
  },

  // Get 24h online history
  getOnlineHistory: async () => {
    const response = await api.get('/api/v2/stats/history');
    return response.data;
  },
};

// Chat API functions
export const chatAPI = {
  // 获取频道列表
  getChannels: async () => {
    const response = await api.get('/api/v2/chat/channels');
    return response.data;
  },

  // 获取频道消息
  getChannelMessages: async (channelId: string | number, limit: number = 50, since: number = 0, until?: number) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('since', since.toString());
    if (until !== undefined) {
      params.append('until', until.toString());
    }
    
    const response = await api.get(`/api/v2/chat/channels/${channelId}/messages?${params}`);
    return response.data;
  },

  // 发送消息
  sendMessage: async (channelId: string | number, message: string, isAction: boolean = false, uuid?: string) => {
    const formData = new URLSearchParams();
    formData.append('message', message);
    formData.append('is_action', isAction.toString());
    if (uuid) {
      formData.append('uuid', uuid);
    }

    const response = await api.post(`/api/v2/chat/channels/${channelId}/messages`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // 标记消息为已读
  markAsRead: async (channelId: string | number, messageId: number) => {
    const response = await api.put(`/api/v2/chat/channels/${channelId}/mark-as-read/${messageId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 创建新的私聊
  createPrivateMessage: async (targetId: number, message: string, isAction: boolean = false, uuid?: string) => {
    const formData = new URLSearchParams();
    formData.append('target_id', targetId.toString());
    formData.append('message', message);
    formData.append('is_action', isAction.toString());
    if (uuid) {
      formData.append('uuid', uuid);
    }

    const response = await api.post('/api/v2/chat/new', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // 加入频道
  joinChannel: async (channelId: string | number) => {
    const response = await api.post(`/api/v2/chat/channels/${channelId}/join`);
    return response.data;
  },

  // 离开频道
  leaveChannel: async (channelId: string | number) => {
    const response = await api.post(`/api/v2/chat/channels/${channelId}/leave`);
    return response.data;
  },

  // 获取私聊频道（如果存在）
  getPrivateChannel: async (targetUserId: number) => {
    try {
      const response = await api.get(`/api/v2/chat/private/${targetUserId}`);
      return response.data;
    } catch (error: any) {
      // 如果私聊频道不存在，返回null
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // 保持连接活跃
  keepAlive: async (historySince?: number, since?: number) => {
    const params = new URLSearchParams();
    if (historySince !== undefined) {
      params.append('history_since', historySince.toString());
    }
    if (since !== undefined) {
      params.append('since', since.toString());
    }

    const response = await api.post(`/api/v2/chat/ack?${params}`);
    return response.data;
  },
};

// Notifications API functions
export const notificationsAPI = {
  // 获取通知列表和WebSocket端点
  getNotifications: async () => {
    const response = await api.get('/api/v2/notifications');
    return response.data;
  },

  // 标记单条通知为已读 (后端需要 {identities:[...]} 结构, 204 无内容)
  markAsRead: async (notificationId: number) => {
    await api.post('/api/v2/notifications/mark-read', {
      identities: [{ id: notificationId }],
      notifications: [],
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  // 批量标记通知为已读（后端 _IdentityReq 仅支持 id/object_id/category，object_type 被定义为 int 会与字符串冲突，故不发送）
  markMultipleAsRead: async (identities: Array<{ id?: number; object_id?: number; category?: string; object_type?: string }>) => {
    if (!identities || identities.length === 0) return;
    // 过滤/转换字段，去掉 object_type，object_id 确保为 number
    const safeIdentities = identities.map(i => ({
      ...(i.id !== undefined ? { id: i.id } : {}),
      ...(i.object_id !== undefined ? { object_id: Number(i.object_id) } : {}),
      ...(i.category ? { category: i.category } : {}),
    }));
    await api.post('/api/v2/notifications/mark-read', {
      identities: safeIdentities,
      notifications: [],
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  // 获取未读通知数量
  getUnreadCount: async () => {
    const response = await api.get('/api/v2/notifications/unread-count');
    return response.data;
  },

  // 获取团队加入请求通知
  getTeamRequests: async () => {
    const response = await api.get('/api/private/team-requests');
    return response.data;
  },

  // 通过 object_id 分组去重通知
  getGroupedNotifications: async () => {
    const response = await api.get('/api/v2/notifications');
    const notifications = response.data.notifications || [];
    
    // 使用 object_id 进行分组和去重
    const groupedMap = new Map<string, typeof notifications[0]>();
    
    notifications.forEach((notification: any) => {
      const key = `${notification.object_type}-${notification.object_id}`;
      
      // 如果已存在相同 object_id 的通知，保留时间最新的
      if (!groupedMap.has(key) || 
          new Date(notification.created_at) > new Date(groupedMap.get(key)!.created_at)) {
        groupedMap.set(key, notification);
      }
    });
    
    // 返回去重后的通知，按时间倒序排序
    const deduplicatedNotifications = Array.from(groupedMap.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return {
      ...response.data,
      notifications: deduplicatedNotifications
    };
  },
};

// Client credentials - in production, these should be environment variables
export const CLIENT_CONFIG = {
  osu_client_id: 6,
  osu_client_secret: '454532f3dba952663c8917ad15204d501ec2f28e41b3bce4b276b5d4a2a25823918f4711bb87a7fe',
  web_client_id: 6,
  web_client_secret: '454532f3dba952663c8917ad15204d501ec2f28e41b3bce4b276b5d4a2a25823918f4711bb87a7fe',
};
