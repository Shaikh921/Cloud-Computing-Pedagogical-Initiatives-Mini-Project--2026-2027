import { apiClient } from './client.js';

export const authApi = {
  signup: async ({ name, email, password }) => {
    return apiClient('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async ({ email, password }) => {
    return apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiClient('/api/auth/logout', {
      method: 'POST',
    });
  },

  getUsers: async () => {
    return apiClient('/api/auth/user', {
      method: 'GET',
    });
  },

  updateUser: async ({ email, role, skills }) => {
    return apiClient('/api/auth/update-user', {
      method: 'POST',
      body: JSON.stringify({ email, role, skills }),
    });
  },
};

