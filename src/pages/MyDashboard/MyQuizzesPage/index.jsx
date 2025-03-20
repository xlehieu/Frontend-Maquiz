import { useQuery } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import * as QuizService from '~/services/quiz.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { message, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import router from '~/config';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOneQuiz, setQuiz } from '~/redux/slices/quiz.slice';
import LoadingComponent from '~/components/LoadingComponent';
import useMutationHooks from '~/hooks/useMutationHooks';
import QuizCard from '~/components/QuizCard';
import { handleCountQuestion } from '~/utils';
import Modal from '~/components/Modal';
import { PAGE_SIZE } from '~/constants';
const QuizzesContext = createContext();
const QuizzesProvider = ({ children }) => {
    const [quizzesData, setQuizzesData] = useState([]);
    const quizDispatch = useDispatch();
    const quizzesSelector = useSelector((state) => state.quiz);
    const handleGetQuizzes = async () => {
        if (quizzesSelector.quiz.length <= 0) {
            const quizSer = await QuizService.getQuizzes({});
            setQuizzesData(quizSer);
            quizDispatch(setQuiz(quizSer));
            return quizSer;
        } else {
            if (!(quizzesSelector.quiz === quizzesData)) {
                setQuizzesData(quizzesSelector.quiz);
            }
            return quizzesSelector;
        }
    };
    const quizQuery = useQuery({ queryKey: [''], queryFn: () => handleGetQuizzes() });
    return (
        <QuizzesContext.Provider value={{ quizzesData, setQuizzesData, isLoading: quizQuery.isLoading }}>
            {children}
        </QuizzesContext.Provider>
    );
};

const MyQuizPageMain = () => {
    const { quizzesData, setQuizzesData, isLoading } = useContext(QuizzesContext);
    const navigate = useNavigate();
    const [isShowModal, setIsShowModal] = useState(false);
    const [deleteQuizId, setDeleteQuizId] = useState(null);
    const dispatch = useDispatch();
    const deleteQuizMutation = useMutationHooks((data) => QuizService.deleteQuiz(data));
    //Hiển thị modal và set id quiz muốn xóa
    const handleDeleteQuizModal = (id) => {
        setIsShowModal(true);
        setDeleteQuizId(id);
    };
    //Hàm xử lý đóng modal
    const handleCancelDeleteQuiz = useCallback(() => {
        setIsShowModal(false);
        setDeleteQuizId(null);
    }, []);
    // Hàm xử lý xóa quiz
    const handleOkDeleteQuiz = useCallback(() => {
        if (deleteQuizId) {
            deleteQuizMutation.mutate({ id: deleteQuizId });
        }
    }, [deleteQuizId]);
    const getQuizzesMutation = useMutationHooks((data) => QuizService.getQuizzes(data));
    const handleGetQuizzes = (skip) => {
        if (!isNaN(Number(skip))) {
            getQuizzesMutation.mutate({ skip });
        }
    };
    // Khi xóa lỗi hoặc xóa thành công bằng mutation
    useEffect(() => {
        if (deleteQuizMutation.isSuccess && deleteQuizMutation.data) {
            const { id } = deleteQuizMutation.data;
            if (id) {
                dispatch(deleteOneQuiz({ id }));
                setQuizzesData((prevQuizzes) => {
                    prevQuizzes = [...prevQuizzes];
                    return prevQuizzes.filter((q) => q._id !== id);
                });
                handleCancelDeleteQuiz();
                message.success('Xóa bài trắc nghiệm thành công');
            } else {
                message.error('Xóa bài trắc nghiệm thất bại, vui lòng thử lại');
            }
        } else if (deleteQuizMutation.isError) {
            message.error('Xóa bài trắc nghiệm thất bại, vui lòng thử lại');
        }
    }, [deleteQuizMutation]);
    useEffect(() => {
        if (getQuizzesMutation.isSuccess) {
            setQuizzesData(getQuizzesMutation.data);
        } else if (getQuizzesMutation) {
        }
    }, [getQuizzesMutation]);
    useLayoutEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);
    return (
        <>
            <div className="flex justify-between my-5">
                <h4 className="font-semibold text-gray-500">Danh sách đề thi</h4>
            </div>
            <section className="rounded-xl bg-white px-8 py-8 flex gap-10 flex-wrap shadow">
                <>
                    {isLoading || getQuizzesMutation.isPending ? (
                        <LoadingComponent />
                    ) : (
                        <>
                            <div className="w-full border-b-2 px-9 py-1 flex justify-between">
                                <p className="font-semibold text-xl">
                                    <span className="text-primary mr-2">{quizzesData?.total || 0}</span>
                                    <span className="text-slate-600">Đề thi</span>
                                </p>
                                <button
                                    onClick={() => navigate(router.createQuiz)}
                                    className="px-2 py-1 text-primary font-semibold rounded border-primary border-2 hover:text-primary hover:opacity-55 transition-all duration-200"
                                >
                                    <FontAwesomeIcon icon={faPlusSquare} className="mr-1" />
                                    Tạo đề thi
                                </button>
                            </div>
                            <div className="grid w-full h-full grid-cols-2 gap-4 px-0 pb-4 sm:grid-cols-3 md:grid-cols-4  2xl:grid-cols-5">
                                {quizzesData?.quizzes?.length > 0
                                    ? quizzesData?.quizzes?.map((quiz, index) => (
                                          <QuizCard
                                              key={index}
                                              title={quiz.name}
                                              accessCount={quiz.accessCount}
                                              examCount={quiz.examCount}
                                              questionCount={quiz?.questionCount || handleCountQuestion(quiz.quiz)}
                                              imageSrc={quiz.thumb}
                                              id={quiz._id}
                                              slug={quiz.slug}
                                              onDelete={() => handleDeleteQuizModal(quiz._id)}
                                          />
                                      ))
                                    : 'Không thấy đề thi nào 😟😟😟😟'}
                            </div>
                        </>
                    )}
                </>
                <Pagination
                    align="end"
                    onChange={(e) => handleGetQuizzes(e)}
                    defaultCurrent={1}
                    defaultPageSize={PAGE_SIZE}
                    total={quizzesData?.total || PAGE_SIZE}
                />
            </section>
            <Modal
                isShow={isShowModal}
                onCancel={handleCancelDeleteQuiz}
                onLoading={deleteQuizMutation.isPending}
                onOk={handleOkDeleteQuiz}
            />
        </>
    );
};
const MyQuizPage = () => {
    return (
        <QuizzesProvider>
            <MyQuizPageMain />
        </QuizzesProvider>
    );
};
export default MyQuizPage;
