import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import siteRouter from '~/config';
import LoadingComponent from '~/components/LoadingComponent';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const countDown = setTimeout(() => {
            setLoading(false);
            navigate(siteRouter.home);
        }, 2000);
        return () => clearTimeout(countDown);
    }, []);

    return <>{loading && <LoadingComponent />}</>;
};

export default LoginSuccess;
