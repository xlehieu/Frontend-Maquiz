import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import * as UserService from '~/services/user.service';
import QuizCard from '~/components/QuizCard';
import { handleCountQuestion } from '~/utils';

const HistoryAccessPage = () => {
    const userQuery = useQuery({ queryKey: ['userQuery'], queryFn: () => UserService.getUserDetail() });
    return (
        <section className="pb-5">
            <h1 className="text-3xl font-bold text-gray-500 text-center my-5">Lịch sử truy cập bài thi</h1>
            <div className="bg-white px-3 pt-3 pb-10 border rounded-lg shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {userQuery?.data?.quizAccessHistory?.length > 0 &&
                        userQuery?.data?.quizAccessHistory?.map((quiz, index) => (
                            <QuizCard
                                key={index}
                                time={quiz.createdAt}
                                questionCount={quiz.questionCount || handleCountQuestion(quiz) || 0}
                                imageSrc={quiz.thumb}
                                accessCount={quiz.accessCount}
                                examCount={quiz.examCount}
                                slug={quiz.slug}
                                title={quiz.name}
                            />
                        ))}
                </div>
            </div>
        </section>
    );
};

export default HistoryAccessPage;
