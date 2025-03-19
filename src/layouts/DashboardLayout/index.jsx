import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import UserSidebar from '~/layouts/DashboardLayout/UserSidebar';
import UserNavbar from '~/layouts/DashboardLayout/UserNavbar';
import FooterAdmin from '~/components/Footers/FooterAdmin';

const DashboardLayout = ({ children, title = 'Maquiz' }) => {
    document.title = title;
    const user = useSelector((state) => state.user); // dùng selector để lấy thông tin từ reducer
    return (
        <>
            <UserSidebar />
            <UserNavbar user={user} />
            <div className="absolute top-0 md:top-14 right-0 left-0 md:left-64 px-4 bg-background">
                <div className="w-full mt-40 md:mt-0">{children}</div>
                <div className="px-4 md:px-10 mx-auto w-full">
                    <FooterAdmin />
                </div>
            </div>
        </>
    );
};
export default memo(DashboardLayout);
