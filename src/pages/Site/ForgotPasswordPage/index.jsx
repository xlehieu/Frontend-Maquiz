import { useState } from 'react';
import axios from 'axios';
import * as UserService from '~/services/user.service';
import useMutationHooks from '~/hooks/useMutationHooks';
import { LoadingOutlined } from '@ant-design/icons';
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const sendLinkMutation = useMutationHooks((data) => UserService.forgotPassword(data));
    const handleSubmit = async (e) => {
        sendLinkMutation.mutate({ email });
        e.preventDefault();
        try {
            setMessage('✅ Link đặt lại mật khẩu đã được gửi về email.');
        } catch {
            setMessage('❌ Không tìm thấy email.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Quên mật khẩu</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
                <input
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    {sendLinkMutation.isPending && <LoadingOutlined />}Gửi link
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
