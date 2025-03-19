import { lazy } from 'react';
import AdminGuard from '~/components/AdminGuard';
import AdminLayout from '~/layouts/AdminLayout';
const UserManagerment = lazy(()=>import('~/pages/Admin/UserManagerment'))

const adminRoutes = {
    path:'/admin',
    element:(<AdminGuard>
        <AdminLayout/>
    </AdminGuard>),
    children:[
        { path: "users", element: <UserManagerment/> },
    ]
}
export default adminRoutes;
