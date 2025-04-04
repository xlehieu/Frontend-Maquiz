import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingComponent from '~/components/LoadingComponent';
import * as UserService from '~/services/user.service';
import UploadComponent from '~/components/UploadComponent';
import useMutationHooks from '~/hooks/useMutationHooks';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
const ProfileUser = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [imageUrl, setImageUrl] = useState(''); //Anh base64
    const updateUserMutation = useMutationHooks((data) => UserService.updateUser(data));
    const userDetailQuery = useQuery({
        queryKey: ['userDetailQueryToUpdate'],
        queryFn: () => UserService.getUserDetail(),
    });
    useEffect(() => {
        if (userDetailQuery.data) {
            setEmail(userDetailQuery.data.email);
            setName(userDetailQuery.data.name);
            setPhone(userDetailQuery.data.phone);
            setAddress(userDetailQuery.data.address);
            setImageUrl(userDetailQuery.data.avatar); //Anh base64
        }
    }, [userDetailQuery.data]);
    const handleClick = async () => {
        if (!email || !name || !phone || !address || !imageUrl)
            return message.warning('Vui lòng nhập đủ thông tin cá nhân');
        updateUserMutation.mutate({
            email,
            name,
            phone,
            address,
            avatar: imageUrl,
        });
    };
    const handleChangeAvatar = useCallback(
        (url) => {
            setImageUrl(url);
        },
        [imageUrl],
    );
    useEffect(() => {
        if (updateUserMutation.isPending) return;
        if (updateUserMutation.isError) {
            message.error('Sửa thông tin cá nhân thất bại');
        } else if (updateUserMutation.isSuccess) {
            message.success('Thay đổi thông tin thành công');
            navigate('/');
        }
    }, [updateUserMutation.isError, updateUserMutation.isSuccess]);
    return (
        <>
            {userDetailQuery.isLoading || updateUserMutation.isPending ? (
                <LoadingComponent />
            ) : (
                <div className="flex justify-center my-6">
                    <div className="w-full md:w-3/4 bg-white px-8 py-5 rounded-md shadow-sm">
                        <div className="border-b border-solid border-gray-200 pb-3">
                            <h5>Hồ sơ của tôi</h5>
                            <p className="text-slate-500">Quản lý hồ sơ để bảo mật tài khoản</p>
                        </div>
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-8">
                                <div className=" border-r mt-6 pr-5 border-gray-200">
                                    <table className="min-w-full">
                                        <tbody>
                                            <tr>
                                                <td className="py-4 w-1/4 px-3 whitespace-nowrap text-right text-slate-400">
                                                    Email
                                                </td>
                                                <td className="py-4 px-3 text-left">
                                                    <input
                                                        className="w-full outline-none px-2 py-2 border"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 px-3 whitespace-nowrap text-right text-slate-400">
                                                    Tên người dùng
                                                </td>
                                                <td className="py-4 px-3 text-left">
                                                    <input
                                                        className="w-full outline-none px-2 py-2 border"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 px-3 whitespace-nowrap text-right text-slate-400">
                                                    Số điện thoại
                                                </td>
                                                <td className="py-4 px-3 text-left">
                                                    <input
                                                        className="w-full outline-none px-2 py-2 border"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 px-3 whitespace-nowrap text-right text-slate-400">
                                                    Địa chỉ
                                                </td>
                                                <td className="py-4 px-3 text-left">
                                                    <input
                                                        className="w-full outline-none px-2 py-2 border"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 px-3"></td>
                                                <td className="py-4 px-3 text-left">
                                                    <button
                                                        className="bg-primary px-6 py-2 text-white rounded-sm"
                                                        onClick={handleClick}
                                                    >
                                                        Lưu
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <UploadComponent imageUrl={imageUrl} setImageUrl={handleChangeAvatar} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default ProfileUser;
