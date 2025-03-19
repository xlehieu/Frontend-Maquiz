import React, { Fragment, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { publicRoutes } from './routes';
import { updateUser } from './redux/slices/user.slice';
import DefaultLayout from './layouts/DefaultLayout';
import * as UserService from './services/user.service';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './layouts/AdminLayout';
import adminRoutes from './routes/adminRoutes';
function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const handleUpdateUser = async () => {
        const res = await UserService.getUserDetail();
        if (res) {
            dispatch(updateUser({ ...res }));
        }
        return res;
    };
    const userQuery = useQuery({ queryKey: ['user'], queryFn: handleUpdateUser, enabled: !user.email });
    // useEffect(() => {
    //     const disableRightClick = (e) => e.preventDefault();
    //     document.addEventListener('contextmenu', disableRightClick);
    //     return () => document.removeEventListener('contextmenu', disableRightClick);
    // }, []);
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }
                        //nếu trang không là private thì hiển thị thì vế đầu sẽ là true => checkAuth true
                        //nếu trang là private thì vế đầu sẽ là false
                        //nhưng nếu là admin truy cập thì sẽ là điều kiện true thì sẽ hiển thị
                        const Page = route?.component;
                        return (
                            <Route
                                key={index}
                                path={route?.path}
                                element={
                                    <React.Suspense>
                                        <Layout key={index} header={route?.header} title={route?.title}>
                                            <Page />
                                        </Layout>
                                    </React.Suspense>
                                }
                            ></Route>
                        );
                    })}
                    {/* Route Admin */}
                    <Route path={adminRoutes.path} element={adminRoutes.element}>
                        {adminRoutes?.children?.map((child,idx)=>(
                            <Route key={idx} path={child.path} element={child.element} />
                        ))}
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
