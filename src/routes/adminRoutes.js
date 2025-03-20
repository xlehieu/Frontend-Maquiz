import { lazy } from 'react';
import AdminGuard from '~/components/AdminGuard';
import AdminLayout from '~/layouts/AdminLayout';
import ClassroomManagement from '~/pages/Admin/ClassroomManagement';
import QuizManagement from '~/pages/Admin/QuizManagement';
const UserManagement = lazy(() => import('~/pages/Admin/UserManagement'));

const adminRoutes = {
    path: 'admin',
    element: (
        <AdminGuard>
            <AdminLayout />
        </AdminGuard>
    ),
    children: [
        { path: 'users-management', element: <UserManagement /> },
        { path: 'quizzes-management', element: <QuizManagement /> },
        { path: 'classrooms-management', element: <ClassroomManagement /> },
    ],
};
export default adminRoutes;
