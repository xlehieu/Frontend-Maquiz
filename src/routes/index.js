import siteRouter from '~/config';
import userDashboardRoutes from './userDashboardRoutes';
import quizRoutes from './quizRoutes';
import { lazy } from 'react';
import LoginSuccess from '~/pages/Site/LoginSuccess';
const SubLayout = lazy(() => import('~/layouts/SubLayout'));
const DefaultLayout = lazy(() => import('../layouts/DefaultLayout'));
const SignInUpLayout = lazy(() => import('~/layouts/SignInUpLayout'));
const NotFoundLayout = lazy(() => import('~/layouts/NotFoundLayout'));
const HomePage = lazy(() => import('../pages/Site/HomePage/HomePage'));
const ContactPage = lazy(() => import('../pages/Site/ContactPage'));
const NotFoundPage = lazy(() => import('../pages/Site/NotFoundPage/NotFoundPage'));
const SignInPage = lazy(() => import('~/pages/Site/SignInPage'));
const SignUpPage = lazy(() => import('~/pages/Site/SignUpPage'));
const ProfileUser = lazy(() => import('~/pages/Site/ProfileUser'));
const CreateQuizPage = lazy(() => import('~/pages/QuizPage/CreateQuizPage'));
const DiscoverPage = lazy(() => import('~/pages/Site/DiscoveryPage'));
export const publicRoutes = [
    { path: siteRouter.home, component: HomePage, layout: DefaultLayout },
    { path: siteRouter.contact, component: ContactPage, layout: DefaultLayout },
    { path: siteRouter.signIn, component: SignInPage, layout: SignInUpLayout, title: 'Đăng nhập' },
    { path: siteRouter.signUp, component: SignUpPage, layout: SignInUpLayout, title: 'Đăng ký' },
    { path: siteRouter.profile, component: ProfileUser, layout: DefaultLayout },
    { path: siteRouter.createQuiz, component: CreateQuizPage, layout: DefaultLayout, title: 'Tạo đề thi' },
    { path: siteRouter.discover, component: DiscoverPage, layout: SubLayout, title: 'Khám phá' },
    { path: siteRouter.loginSuccess, component: LoginSuccess },
    // { path: router.reviewQuiz, component: QuizPages.ReviewQuizPage, layout: DefaultLayout },
    //Admin
    //Dashboard
    ...userDashboardRoutes,
    ...quizRoutes,
    { path: siteRouter.notFoundPage, component: NotFoundPage, layout: NotFoundLayout },
];
