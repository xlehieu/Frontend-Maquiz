import axiosCredentials from '../config/axios.credential';
export const createPost = async (data) => {
    try {
        const { content } = data;
        if (!content) {
            throw new Error('Lỗi');
        }
        const res = await axiosCredentials.post('/post', JSON.stringify(data));
        if (res.status === 200 && res.data) return res.data.data;
    } catch (err) {
        if (err.response) throw new Error(err.response.data.message || 'Thông báo thất bại');
    }
};
export const getPostsByClassroomId = async (data) => {
    try {
        const { classroomId } = data;
        const res = await axiosCredentials.get(`/post/${classroomId}/detail`);
        if (res.status === 200) return res?.data?.data;
    } catch (err) {
        throw new Error('Lấy bài thông báo thất bại');
    }
};
export const deletePostById = async (data) => {
    try {
        const { postIdToDelete } = data;
        if (!postIdToDelete) throw new Error('Lỗi');
        const res = await axiosCredentials.delete(`/post/${postIdToDelete}`);
        if (res.status === 200) return 'Xóa bài thành công';
    } catch (err) {}
};
