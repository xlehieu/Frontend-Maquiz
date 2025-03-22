import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import siteRouter from '~/config';
import LoadingComponent from '~/components/LoadingComponent';

const LoginSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('access_token');

        if (token) {
            // Lưu token vào cookie
            Cookies.set('access_token', token, { expires: 7, secure: true });

            // Chuyển hướng đến trang Profile
            navigate(siteRouter.home);
        } else {
            navigate(siteRouter.signIn);
        }
    }, [location, navigate]);

    return <LoadingComponent />;
};

export default LoginSuccess;
