import { apiClient } from './client.js';

export const ticketApi = {
  createTicket: async ({ title, description }) => {
    return apiClient('/api/tickets', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  },

  getTickets: async () => {
    return apiClient('/api/tickets', {
      method: 'GET',
    });
  },

  getTicket: async (id) => {
    return apiClient(`/api/tickets/${id}`, {
      method: 'GET',
    });
  },

  updateTicket: async (id, data) => {
    return apiClient(`/api/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

