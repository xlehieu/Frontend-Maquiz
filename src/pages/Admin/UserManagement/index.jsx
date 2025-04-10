import { useQuery } from '@tanstack/react-query';
import { message, Pagination } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRouter } from '~/config';
import { PAGE_SIZE } from '~/constants';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as UserManagementService from '~/services/admin/user.management.service';
const active_type = {
    CHANGE_ACTIVE: 'CHANGE_ACTIVE',
    SET_USER_LIST: 'SET_USER_LIST',
};
const userManageReducer = (state, action) => {
    switch (action.type) {
        case active_type.SET_USER_LIST: {
            if (action.payload.users) return action.payload.users;
            return state;
        }
        case active_type.CHANGE_ACTIVE: {
            const users = [...state];
            if (action.payload.id) {
                users.forEach((user) => {
                    if (user._id == action.payload.id) {
                        user.isActive = !user.isActive;
                    }
                });
                return users;
            }
            return state;
        }
        default:
            return state;
    }
};
const UserManagement = () => {
    const navigate = useNavigate();
    const [userList, dispatchUserList] = useReducer(userManageReducer, []);
    const [totalUser, setTotalUser] = useState(0);
    const userListQuery = useQuery({
        queryKey: ['userListQuery'],
        queryFn: () => UserManagementService.getUserList({}),
    });
    const getUserListMutation = useMutationHooks((data) => UserManagementService.getUserList(data));
    useEffect(() => {
        if (userListQuery.data) {
            setTotalUser(userListQuery.data?.total);
            dispatchUserList({
                type: active_type.SET_USER_LIST,
                payload: {
                    users: userListQuery.data?.users,
                },
            });
        } else if (userListQuery.isError) {
            message.error('đã có lỗi xảy ra');
        }
    }, [userListQuery]);
    useEffect(() => {
        if (getUserListMutation.isSuccess) {
            dispatchUserList({
                type: active_type.SET_USER_LIST,
                payload: {
                    users: getUserListMutation.data?.users,
                },
            });
        }
    }, [getUserListMutation]);
    const handlePageChange = (page) => {
        getUserListMutation.mutate({ skip: (Number(page - 1) || 0) * PAGE_SIZE });
    };

    const changeActiveUserMutation = useMutationHooks((data) => UserManagementService.changeActiveUser(data));
    const handleChangeActiveUser = (id) => {
        if (!id) return;
        changeActiveUserMutation.mutate({ id });
        dispatchUserList({
            type: active_type.CHANGE_ACTIVE,
            payload: {
                id,
            },
        });
    };
    const handleClickUser = (userId) => {
        if (!userId) return;
        navigate(`${adminRouter.userDetail}/${userId}`);
    };
    return (
        <>
            <section className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl my-5 text-gray-700">DANH SÁCH NGƯỜI DÙNG</h1>
                    <p className="text-lg">
                        Tổng số: <span className="text-primary text-xl">{totalUser}</span>
                    </p>
                </div>
                <table className="w-full min-w-[640px] table-auto">
                    <thead>
                        <tr>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                <p className="block antialiased text-[13px] font-bold uppercase text-blue-gray-400">
                                    Người dùng
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased text-[13px] font-bold uppercase text-blue-gray-400">
                                    SĐT
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased text-[13px] font-bold uppercase text-blue-gray-400">
                                    Thời điểm đăng ký
                                </p>
                            </th>
                            <th className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                <p className="block antialiased text-[13px] font-bold uppercase text-blue-gray-400">
                                    Hoạt động
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList?.map((user, idx) => (
                            <tr key={idx} className="hover:cursor-pointer" onClick={() => handleClickUser(user._id)}>
                                <td className="py-3 px-5 border-b border-lime-800 text-center">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={user.avatar}
                                            alt="Avatar"
                                            className="inline-block relative object-cover object-center w-9 h-9 rounded-md"
                                        />
                                        <div>
                                            <p className="block antialiased text-base leading-normal text-blue-gray-900 font-semibold">
                                                {user.name || ''}
                                            </p>
                                            <p className="block antialiased text-base font-normal text-blue-gray-500">
                                                {user.email || ''}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-5 border-b border-lime-800 text-center">
                                    <p className="block antialiased text-base font-semibold text-blue-gray-600">
                                        {user.phone || ''}
                                    </p>
                                </td>
                                <td className="py-3 px-5 border-b border-lime-800 text-center">
                                    <p className="block antialiased text-base font-semibold text-blue-gray-600">
                                        {user.createdAt ? dayjs(user.createdAt).format('DD/MM/YYYY') : 'null'}
                                    </p>
                                </td>
                                <td className="py-3 px-5 border-b border-lime-800 text-center">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            onChange={() => handleChangeActiveUser(user._id)}
                                            checked={user.isActive}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-primary dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                                        <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-300"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    className="mt-3"
                    align="end"
                    onChange={(e) => handlePageChange(e)}
                    defaultCurrent={1}
                    defaultPageSize={PAGE_SIZE}
                    total={totalUser || PAGE_SIZE}
                />
            </section>
        </>
    );
};

export default UserManagement;
