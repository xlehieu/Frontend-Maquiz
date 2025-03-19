import axios from 'axios';
import axiosCredentials from './axios.credential';
import axiosNoInterceptor from './axios.nointerceptor';
export const login = async (data) => {
    try {
        const { email, password } = data;
        if (!email || !password) {
            throw new Error('Vui lòng điền đầy đủ thông tin');
        }
        const res = await axiosNoInterceptor.post(`/user/sign-in`, JSON.stringify(data));
        return res.data;
    } catch (err) {
        if (err.response) {
            console.log(err);
            throw new Error(err.response.data.message); // Ném lỗi để xử lý ở nơi gọi hàm login
        }
    }
};
//sử dụng headers để truyền token và thằng middleware phía backend sẽ nhận được token
//để kiểm tra xem có quyền lấy data người dùng không
export const getUserDetail = async () => {
    try {
        const res = await axiosNoInterceptor.get(`/user/detail`);
        if (res.data) {
            return res.data?.data;
        }
        return null;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
export const register = async (data) => {
    try {
        const res = await axiosNoInterceptor.post(`/user/sign-up`, JSON.stringify(data));
        if (res.data) {
            return res.data;
        }
        return res;
    } catch (err) {
        if (err.response) {
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra';
            throw new Error(errorMessage);
        }
    }
};
export const refreshToken = async () => {
    try {
        const res = await axios.post(`/user/refresh-token`, { withCredentials: true });
        return res;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
export const logout = async () => {
    try {
        const res = await axiosCredentials.post(`/user/log-out`);
        return res;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
export const updateUser = async (data) => {
    try {
        const res = await axiosCredentials.patch(`/user/update`, JSON.stringify(data));
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
export const favoriteQuiz = async (data) => {
    try {
        const { id } = data;
        const res = await axiosCredentials.patch(`/user/favorite-quiz`, JSON.stringify({ quizId: id }));
        if (res.status === 200) return res.data;
        return null;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const getMyFavoriteQuiz = async () => {
    try {
        const res = await axiosCredentials.get(`/user/favorite-quiz`);
        if (res.statusCode === 200) return res.data;
        return null;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const getQuizzesAccessHistory = async (data)=>{
    try{
        const params = new URLSearchParams()
        Object.entries(data).forEach(([key,value])=>{
            if(value !==undefined){
                params.append(key,value)
            }
        })
        const res = await axiosCredentials.get(`/user/quizz-access-history?${params}`)
        if(res)
            return res?.data?.data
    }
    catch(err){
        throw new Error(err.response.data.message);
    }
}