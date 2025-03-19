import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import router from '~/config';
import * as VerifyService from '~/services/verify.service';
const AdminGuard = ({ children }) => {
    const navigate = useNavigate();
    const isAdmin = useQuery({ queryKey: ['isAdminQuery'], queryFn: () => VerifyService.verify() });
    useEffect(() => {
        if (!isAdmin.data && isAdmin.isSuccess) {
            return navigate('/page-not-found');
        } else if (isAdmin.isError) {
            return navigate('/page-not-found');
        }
    }, [isAdmin]);
    //if (!isAdmin.data) return <Navigate to={'/page-not-found'} />;
    return <>{children}</>;
};

export default AdminGuard;
