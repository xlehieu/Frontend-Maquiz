import axiosCredentials from '../config/axios.credential';

export const verify = async () => {
    try {
        const res = await axiosCredentials.get('/admin/verify');
        if (res.data) return res?.data?.isAdmin;
        return false;
    } catch (err) {
        if (err.response) throw new Error(err.response?.data?.message);
    }
};
