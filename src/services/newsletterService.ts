import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

export interface NewsletterSubscription {
    email: string;
    source?: string;
}

export const newsletterService = {
    subscribe: async (data: NewsletterSubscription) => {
        try {
            const response = await axios.post(`${API_URL}/newsletter/subscribe`, data);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to subscribe to newsletter');
        }
    },

    unsubscribe: async (email: string) => {
        try {
            const response = await axios.post(`${API_URL}/newsletter/unsubscribe`, { email });
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to unsubscribe from newsletter');
        }
    }
};
