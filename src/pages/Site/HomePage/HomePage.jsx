import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Aos from 'aos';
import 'aos/dist/aos.css';
import siteRouter, { userDashboardRouter } from '~/config';
import searchIcon from '~/asset/image/search.png';
import knowledgeIcon from '~/asset/image/knowledge.png';
import quizIcon from '~/asset/image/qna.png';
import classroomIcon from '~/asset/image/classroom.png';
import newsIcon from '~/asset/image/megaphone.png';

export default function HomePage() {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <>
            <section className="flex flex-col md:flex-row justify-center items-center py-20">
                <div className="w-full md:w-2/5 text-center">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#FFAFBD] via-primary to-[#ffc3a0] bg-clip-text text-transparent animate-animate-gradient bg-[length:400%] leading-tight mb-6 ">
                        Hệ thống quản lý đề thi trắc nghiệm MAQUIZ
                    </h2>
                    <p className="text-lg text-gray-600 mb-10">
                        Tạo, quản lý và thi trắc nghiệm dễ dàng chỉ với vài cú click chuột.
                    </p>
                </div>
                <div className="w-full md:w-3/5 flex flex-col gap-14 justify-center items-center">
                    <div className="grid grid-cols-2 w-full">
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate(siteRouter.discover)}
                                className="bg-primary relative -rotate-3 text-white px-10 py-3 border border-black rounded-full text-lg hover:bg-primary-bold transition"
                            >
                                Khám phá ngay
                                <img src={searchIcon} className="absolute left-2 -top-7 w-10 h-10" />
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button className="bg-primary relative rotate-3 text-white px-10 py-3  border border-black  rounded-full text-lg hover:bg-primary-bold transition">
                                Tìm hiểu thêm
                                <img src={knowledgeIcon} className="absolute -right-2 -bottom-4 w-10 h-10" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 w-full">
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate(siteRouter.createQuiz)}
                                className="bg-primary relative rotate-6 text-white px-10 py-3 border border-black rounded-full text-lg hover:bg-primary-bold transition"
                            >
                                Tạo đề thi
                                <img src={quizIcon} className="absolute right-0 -top-7 w-10 h-10" />
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate(userDashboardRouter.classroom)}
                                className="bg-primary -rotate-1 text-white px-10 py-3  border border-black  rounded-full text-lg hover:bg-primary-bold transition"
                            >
                                Lớp học
                                <img src={classroomIcon} className="absolute -left-2 top-0 w-10 h-10" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 w-full">
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate(siteRouter.news)}
                                className="bg-primary rotate-1 relative text-white px-10 py-3 border border-black rounded-full text-lg hover:bg-primary-bold transition"
                            >
                                Xem tin
                                <img src={newsIcon} className="absolute -bottom-3 left-0 w-10 h-10" />
                            </button>
                        </div>
                        <div className="flex justify-center"></div>
                    </div>
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
