import { faBookOpen, faClockRotateLeft, faFilter, faHeart, faHouse, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizCard from '~/components/QuizCard';
import { userDashboardRouter } from '~/config';
import useDebounce from '~/hooks/useDebounce';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as QuizService from '~/services/quiz.service';
import LoadingComponent from '~/components/LoadingComponent';
import { Pagination, Slider } from 'antd';
import { PAGE_SIZE } from '~/constants';
const QuizzesContext = createContext();
const marks = {
    2000: '2000',
};
const nowYear = new Date().getFullYear();
marks[nowYear] = nowYear;
const QuizzesProvider = ({ children }) => {
    const [quizzes, setQuizzes] = useState([]);
    return <QuizzesContext.Provider value={{ quizzes, setQuizzes }}>{children}</QuizzesContext.Provider>;
};
const SideBar = () => {
    const { quizzes, setQuizzes } = useContext(QuizzesContext);
    const [filterYear, setFilterYear] = useState([2000, nowYear]);
    const filterYearDebounce = useDebounce(filterYear);
    useEffect(() => {
        console.log(filterYear);
    }, [filterYearDebounce]);
    return (
        <aside className="z-10 bg-white w-56 shadow-lg hidden md:block rounded">
            <div>
                <FontAwesomeIcon icon={faFilter} className="mt-4 ml-4 text-orange-300 text-xl" />
            </div>
            <div className="flex flex-col mx-4 mt-3">
                <p>Năm học</p>
                <Slider
                    value={filterYear}
                    range
                    marks={marks}
                    defaultValue={filterYear}
                    onChange={(value) => setFilterYear(value)}
                    min={2000}
                    max={nowYear}
                />
            </div>
        </aside>
    );
};
const MainResult = () => {
    const { quizzes, setQuizzes } = useContext(QuizzesContext);
    const [searchValue, setSearchValue] = useState('');
    const debouncedValueSearch = useDebounce(searchValue);
    const findQuizMutation = useMutationHooks((data) => QuizService.getDiscoveryQuizzes(data));
    useEffect(() => {
        if (debouncedValueSearch.trim()) findQuizMutation.mutate({ name: debouncedValueSearch });
    }, [debouncedValueSearch]);
    useEffect(() => {
        setQuizzes(findQuizMutation.data ?? []);
    }, [findQuizMutation.data]);
    useEffect(() => {
        findQuizMutation.mutate({ skip: 0, limit: PAGE_SIZE });
    }, []);
    const handleChangePage = (e) => {
        findQuizMutation.mutate({ skip: e - 1, limit: PAGE_SIZE });
    };
    return (
        <section className="rounded-lg px-3 py-4 flex-1 bg-white shadow-xl">
            {findQuizMutation.isPending ? (
                <LoadingComponent />
            ) : (
                <>
                    <div className="flex justify-between border-b pb-2">
                        <div className="flex items-center rounded-md px-2 py-1 border border-gray-400 text-gray-700 focus-within:border-primary focus-within:shadow">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-700" />
                            <input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="min-w-52 ml-2 outline-none caret-primary"
                                placeholder="Nhập từ khóa tìm kiếm"
                            />
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-4 px-0 py-10 sm:grid-cols-3 md:grid-cols-4  2xl:grid-cols-5">
                        {quizzes?.quizzes?.length > 0 && (
                            <>
                                {quizzes?.quizzes?.map((quiz, index) => (
                                    <QuizCard
                                        key={index}
                                        title={quiz.name}
                                        accessCount={quiz.accessCount}
                                        examCount={quiz.examCount}
                                        imageSrc={quiz.thumb}
                                        id={quiz._id}
                                        slug={quiz.slug}
                                        questionCount={quiz.questionCount}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}
            <Pagination
                align="end"
                onChange={(e) => handleChangePage(e)}
                defaultCurrent={1}
                defaultPageSize={1}
                total={quizzes?.total || PAGE_SIZE}
            />
        </section>
    );
};
const DiscoverPage = () => {
    return (
        <QuizzesProvider>
            <div className="relative">
                <h1 className="text-xl font-medium text-gray-700 pb-3">Khám phá đề thi</h1>
                <div className="flex flex-row space-x-4">
                    <SideBar />
                    <MainResult />
                </div>
            </div>
        </QuizzesProvider>
    );
};

export default DiscoverPage;
