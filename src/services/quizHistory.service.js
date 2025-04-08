import axiosCredentials from '../config/axios.credential';

export const saveQuizHistory = async (data) => {
    try {
        const { score, quizId, answerChoices } = data;
        if (!score || !quizId || !answerChoices) throw new Error('Lỗi');
        const res = await axiosCredentials.post('/quiz-history', JSON.stringify(data));
        if (res.status === 200) return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Có lỗi xảy ra');
    }
};

export const getMyExamHistory = async (data) => {
    try {
        const { score, quizId, answerChoices } = data;
        if (!score || !quizId || !answerChoices) throw new Error('Lỗi');
        const res = await axiosCredentials.get('/quiz-history/mine');
        if (res.status === 200) return res?.data?.message;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Có lỗi xảy ra');
    }
};
