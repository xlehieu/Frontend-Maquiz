import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import FooterAdmin from '~/components/Footers/FooterAdmin';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import AdminNavbar from './AdminNavbar';
import LoadingComponent from '~/components/LoadingComponent';

const AdminLayout = ({ children, title = 'Maquiz' }) => {
    document.title = title;
    const user = useSelector((state) => state.user); // dùng selector để lấy thông tin từ reducer
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <AdminSidebar />
            <AdminNavbar user={user} />
            <div className="absolute top-0 md:top-14 right-0 left-0 md:left-64 px-4 bg-background">
                <div className="w-full mt-40 md:mt-0">
                    <Outlet/>
                </div>
                <div className="px-4 md:px-10 mx-auto w-full">
                    <FooterAdmin />
                </div>
            </div>
        </Suspense>
    );
};
export default AdminLayout;
