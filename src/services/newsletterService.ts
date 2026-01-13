import api from '../config/api';

export interface NewsletterSubscription {
    email: string;
    source?: string;
}

export const newsletterService = {
    subscribe: async (data: NewsletterSubscription) => {
        const response = await api.post('/api/newsletter/subscribe', data);
        return response.data;
    },

    unsubscribe: async (email: string) => {
        const response = await api.post('/api/newsletter/unsubscribe', { email });
        return response.data;
    },

    getAllSubscribers: async (page = 1, limit = 50, active?: boolean) => {
        const response = await api.get('/api/newsletter/subscribers', {
            params: { page, limit, active }
        });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/api/newsletter/count');
        return response.data;
    },

    deleteSubscriber: async (id: string) => {
        const response = await api.delete(`/api/newsletter/subscribers/${id}`);
        return response.data;
    }
};
