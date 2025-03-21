import { faBookOpen, faClockRotateLeft, faHeart, faHouse, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import QuizCard from '~/components/QuizCard';
import { userDashboardRouter } from '~/config';
import useDebounce from '~/hooks/useDebounce';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as QuizService from '~/services/quiz.service';
import * as UserService from '~/services/user.service';
import { useDispatch } from 'react-redux';
import { handleCountQuestion } from '~/utils';
import { favoriteQuiz } from '~/redux/slices/user.slice';
import LoadingComponent from '~/components/LoadingComponent';
import { Pagination } from 'antd';
import { PAGE_SIZE } from '~/constants';
const items = [
    {
        label: 'Cá nhân',
        children: [
            {
                label: 'Thư viện của tôi',
                icon: faHouse,
                to: userDashboardRouter.myDashboard,
            },
            {
                label: 'Truy cập gần đây',
                icon: faClockRotateLeft,
                to: userDashboardRouter.historyAccess,
            },
            {
                label: 'Đề thi yêu thích ',
                icon: faHeart,
            },
        ],
    },
    {
        label: 'Quản lý',
        children: [
            {
                label: 'Đề thi',
                icon: faBookOpen,
                to: userDashboardRouter.myQuiz,
            },
        ],
    },
];
const QuizzesContext = createContext();
const QuizzesProvider = ({ children }) => {
    const [quizzes, setQuizzes] = useState([]);
    return (
        <QuizzesContext.Provider value={{ quizzes,setQuizzes}}>
            {children}
        </QuizzesContext.Provider>
    );
};
const SideBar = () => {
    return (
        <aside className="z-10 bg-white w-56 shadow-lg hidden md:block rounded">
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="text-sm pl-2 text-gray-400 py-2">{item.label}</div>
                        <div>
                            <ul className="flex flex-col">
                                {item.children.map((child, i) => (
                                    <li className="flex" key={i}>
                                        <Link
                                            key={i}
                                            to={child.to}
                                            className="pl-8 text-gray-700 flex-1 text-base py-3 px-2 hover:text-primary ease-linear duration-200 transition-all hover:bg-opacity-10 hover:bg-slate-600 hover:rounded-3xl"
                                        >
                                            <FontAwesomeIcon className="mr-2" icon={child.icon} />
                                            {child.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
};
const MainResult = () => {
    const { quizzes ,setQuizzes} = useContext(QuizzesContext);
    const [searchValue, setSearchValue] = useState('');
    const debouncedValueSearch = useDebounce(searchValue);
    const findQuizMutation = useMutationHooks((data) => QuizService.getDiscoveryQuizzes(data));
    useEffect(() => {
        if (debouncedValueSearch.trim()) findQuizMutation.mutate({ name: debouncedValueSearch });
    }, [debouncedValueSearch]);
    useEffect(() => {
        setQuizzes(findQuizMutation.data ?? []);
    }, [findQuizMutation.data]);
    useEffect(()=>{
        findQuizMutation.mutate({skip:0,limit:1})
    },[])
    const handleChangePage = (e)=>{
        findQuizMutation.mutate({skip:e-1,limit:1})
    }
    return (
        <section className="rounded-lg px-3 py-4 flex-1 bg-white shadow-xl">
                {findQuizMutation.isPending ? <LoadingComponent/>:<>  
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
                            />
                        ))}
                    </>
                )}
            </div>
            </>}
            <Pagination align='end' onChange={(e)=>handleChangePage(e)} defaultCurrent={1} defaultPageSize={1} total={quizzes?.total ||PAGE_SIZE}/>
            
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
