import { api } from './client';

export const statsAPI = {
  getCurrentStats: async () => {
    const response = await api.get('/api/v2/stats');
    return response.data;
  },

  getOnlineHistory: async () => {
    const response = await api.get('/api/v2/stats/history');
    return response.data;
  },
};
