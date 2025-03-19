import { lazy } from 'react';
import AdminGuard from '~/components/AdminGuard';
import AdminLayout from '~/layouts/AdminLayout';
const UserManagement = lazy(() => import('~/pages/Admin/UserManagement'));

const adminRoutes = {
    path: '/admin',
    element: (
        <AdminGuard>
            <AdminLayout />
        </AdminGuard>
    ),
    children: [{ path: 'users', element: <UserManagement /> }],
};
export default adminRoutes;
