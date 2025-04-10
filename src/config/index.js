const siteRouter = {
    home: '/',
    contact: '/lien-he',
    news: '/tin-tuc',
    signIn: '/dang-nhap',
    signUp: '/dang-ky',
    profile: '/thong-tin',
    createQuiz: '/tao-de-thi',
    notFoundPage: '/*',
    discover: '/discovery',
    loginSuccess: '/login-success',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
};
export const userDashboardRouter = {
    myDashboard: '/my-dashboard',
    historyAccess: '/my-dashboard/truy-cap-gan-day',
    myQuiz: '/my-dashboard/de-thi-cua-toi',
    myQuizDetail: '/my-dashboard/de-thi-cua-toi/:id',
    editMyQuiz: '/my-dashboard/de-thi-cua-toi/chinh-sua/:id',
    classroom: '/my-dashboard/classroom',
    createClassroom: '/my-dashboard/classroom/tao-lop-hoc',
};
//có truyền reviewQuiz/:slug ok
export const quizRouter = {
    reviewQuiz: '/review-quiz',
    takeQuiz: '/take-quiz',
};
export const adminRouter = {
    userList: '/admin/users-management',
    userDetail: '/admin/users-management/detail',
    classroomList: '/admin/classrooms-management',
    quizList: '/admin/quizzes-management',
    quizDetail: '/admin/quizzes-management/detail',
};
export default siteRouter;
