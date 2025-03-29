import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as UserService from '~/services/user.service';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const resetPasswordMutation = useMutationHooks((data) => UserService.resetPassword(data));
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            resetPasswordMutation.mutate({ newPassword: password, token: token });
            setMessage('✅ Đổi mật khẩu thành công.');
        } catch {
            setMessage('❌ Token không hợp lệ hoặc đã hết hạn.');
        }
    };

    if (!token) return <p>❌ Token không hợp lệ.</p>;

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded">
                    Xác nhận
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
