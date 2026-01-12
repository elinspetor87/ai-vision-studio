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
    }
};
