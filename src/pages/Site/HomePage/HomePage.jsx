import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import siteRouter from '~/config';
export default function HomePage() {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <>
            <section className="flex flex-col justify-center items-center py-20">
                <h2 className="text-3xl text-center font-extrabold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent animate-animate-gradient bg-[length:400%] leading-tight mb-6 ">
                    Hệ thống quản lý đề thi trắc nghiệm MAQUIZ
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                    Tạo, quản lý và thi trắc nghiệm dễ dàng chỉ với vài cú click chuột.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate(siteRouter.discover)}
                        className="bg-primary text-white animate-pulse px-6 py-3 rounded-xl text-lg hover:bg-primary-bold transition"
                    >
                        Bắt đầu ngay
                    </button>
                    <button className="bg-white border border-primary text-primary px-6 py-3 rounded-xl text-lg hover:bg-purple-50 transition">
                        Tìm hiểu thêm
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                <div data-aos="fade-up-right" className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <h3 className="text-xl font-bold text-primary-bold mb-2">Tạo đề nhanh chóng</h3>
                    <p className="text-gray-600">
                        Chỉ cần vài bước đơn giản là bạn đã có thể tạo đề thi trắc nghiệm của riêng mình.
                    </p>
                </div>
                <div data-aos="fade-up" className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <h3 className="text-xl font-bold text-primary-bold mb-2">Quản lý lớp học</h3>
                    <p className="text-gray-600">Tạo và quản lý lớp học dễ dàng, mời học sinh tham gia với mã lớp.</p>
                </div>
                <div data-aos="fade-up-left" className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <h3 className="text-xl font-bold text-primary-bold mb-2">Báo cáo kết quả</h3>
                    <p className="text-gray-600">Xem kết quả làm bài chi tiết.</p>
                </div>
            </section>

            <section className="text-center bg-gray-50 mt-24"></section>
        </>
    );
}
