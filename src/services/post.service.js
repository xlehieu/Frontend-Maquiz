import axiosCredentials from './axios.credential';
export const createPost = async (data) => {
    try {
        const { content } = data;
        if (!content) {
            throw 'Phải có nội dung thông báo cho lớp học';
        }
        const res = await axiosCredentials.post('/post', JSON.stringify(data));
        if (res.status === 200) return 'Đăng bài thành công';
    } catch (err) {
        console.log(err);
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
        if (!postIdToDelete) throw 'Lỗi';
        const res = await axiosCredentials.delete(`/post/${postIdToDelete}`);
        if (res.status === 200) return 'Xóa bài thành công';
    } catch (err) {}
};
