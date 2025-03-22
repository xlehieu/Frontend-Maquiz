const siteRouter = {
    home: '/',
    contact: '/lien-he',
    signIn: '/dang-nhap',
    signUp: '/dang-ky',
    profile: '/thong-tin',
    createQuiz: '/tao-de-thi',
    notFoundPage: '/*',
    discover: '/discovery',
    loginSuccess: '/login-success',
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
    classroomList: '/admin/classrooms-management',
    quizList: '/admin/quizzes-management',
};
export default siteRouter;
