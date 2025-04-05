import axiosCredentials from '../config/axios.credential';

export const getNews = async () => {
    try {
        const response = await axiosCredentials.get('/news');
        if (response.data && response.status === 200) {
            return response.data.data;
        }
        throw new Error('Failed to fetch news');
    } catch (error) {
        throw error;
    }
};

export const createNews = async ({ title, content }) => {
    try {
        const response = await axiosCredentials.post('/news', { title, content });
        if (response.data && response.status === 200) {
            return response.data.data;
        }
        throw new Error('Failed to create news');
    } catch (error) {
        throw error;
    }
};

export const updateNews = async ({ id, title, content }) => {
    try {
        const response = await axiosCredentials.put(`/news/${id}`, { title, content });
        if (response.data && response.status === 200) {
            return response.data.data;
        }
        throw new Error('Failed to update news');
    } catch (error) {
        throw error;
    }
};
export const deleteNews = async (id) => {
    try {
        const response = await axiosCredentials.delete(`/news/${id}`);
        if (response.data && response.status === 200) {
            return response.data.data;
        }
        throw new Error('Failed to delete news');
    } catch (error) {
        throw error;
    }
};
