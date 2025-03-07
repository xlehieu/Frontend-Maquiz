import { faBookOpen, faEllipsisVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import { message } from 'antd';
import dayjs from 'dayjs';
import HTMLReactParser from 'html-react-parser';
import JoditEditor from 'jodit-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BlurBackground from '~/components/BlurBackground';
import LazyImage from '~/components/LazyImage';
import LoadingComponent from '~/components/LoadingComponent';
import Modal from '~/components/Modal';
import { quizRouter } from '~/config';
import configEditor from '~/config/editor';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as ClassroomService from '~/services/classroom.service';
import * as PostService from '~/services/post.service';
import * as QuizService from '~/services/quiz.service';
const ClassroomContext = createContext();
const ClassroomProvider = ({ children }) => {
    const { classCode } = useParams();
    const queryClassDetail = useQuery({
        queryKey: ['queryClassDetail', classCode],
        queryFn: () => ClassroomService.getClassroomDetail({ classCode }),
    });
    useEffect(() => {
        if (queryClassDetail.isError) {
            message.error(queryClassDetail?.error.message || 'Có lỗi xảy ra');
        }
    }, [queryClassDetail.isError]);
    return (
        <ClassroomContext.Provider value={{ classroom: queryClassDetail.data }}>
            {queryClassDetail.isLoading ? <LoadingComponent /> : <>{children}</>}
        </ClassroomContext.Provider>
    );
};
//chat gpt
function hasValidTextInHTML(html) {
    const strippedText = html.replace(/<\/?p>/g, '').trim(); // Xóa thẻ <p> nhưng giữ nội dung
    return strippedText.length > 0;
}
const ChooseQuizzes = ({ quizzes = [], selectedQuizzes, setSelectedQuizzes }) => {
    const handleSelectQuiz = (id) => {
        setSelectedQuizzes((prev) => {
            if (prev.includes(id)) {
                return prev.filter((q) => q !== id);
            }
            return [...prev, id];
        });
    };
    return (
        <>
            <div className="absolute z-30 w-2/3 gap-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white px-5 py-5 rounded-md">
                {quizzes?.length > 0 &&
                    quizzes.map((quiz, index) => (
                        <div
                            className={`border-2 ${
                                selectedQuizzes.includes(quiz._id) ? 'border-primary border-4' : 'border-gray-300'
                            } rounded shadow`}
                            onClick={() => handleSelectQuiz(quiz._id)}
                            key={index}
                        >
                            <LazyImage alt={quiz.name} src={quiz.thumb} />
                            <p className="mt-2">{quiz.name}</p>
                        </div>
                    ))}
            </div>
        </>
    );
};
const NewsFeedComponent = () => {
    const navigate = useNavigate();
    const { classroom } = useContext(ClassroomContext);
    const [isShowModal, setIsShowModal] = useState(false);
    const [isOpenQuizzes, setIsOpenQuizzes] = useState(false);
    const [notificationText, setNotificationText] = useState('');
    const user = useSelector((state) => state.user);
    const quizzesQuery = useQuery({
        queryKey: ['queryQuizzes', user.email],
        queryFn: () => QuizService.getQuizzes(),
        enabled: !!user.email,
    });
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);
    const uploadPostMutation = useMutationHooks((data) => PostService.createPost(data));
    const uploadPost = () => {
        if (!hasValidTextInHTML(notificationText))
            return message.warning('Vui lòng nhập nội dung thông báo cho lớp học');
        uploadPostMutation.mutate({ classroomId: classroom?._id, content: notificationText, quizzes: selectedQuizzes });
    };
    useEffect(() => {
        if (uploadPostMutation.isError) {
            message.error(uploadPostMutation.error.message);
        } else if (uploadPostMutation.isSuccess) {
            message.success('Thêm thông báo lớp học thành công');
            setNotificationText('');
            setSelectedQuizzes([]);
            setIsOpenQuizzes(false);
            uploadPostMutation.reset();
        }
    }, [uploadPostMutation.isError, uploadPostMutation.isSuccess]);

    //handle delete post by id
    const deletePostMutation = useMutationHooks((data) => PostService.deletePostById(data));
    const [currentId, setCurrentId] = useState(null);
    const handleOpenModal = (id) => {
        console.log(id);
        setIsShowModal(true);
        setCurrentId(id);
    };
    const handleDeletePost = () => {
        if (!currentId) return message.error('Lỗi');
        deletePostMutation.mutate({ postIdToDelete: currentId });
    };
    return (
        <>
            <div className="w-full">
                <div className="md:rounded-2xl md:overflow-hidden w-full h-56 relative">
                    <img className="w-full h-full object-cover opacity-80" src={classroom?.thumb} alt="class image" />
                    <h3 className="absolute bottom-4 left-4 text-4xl font-medium text-white line-clamp-1">
                        {classroom?.name}
                    </h3>
                </div>
                <div className="mt-5">
                    <div>
                        <JoditEditor
                            config={{ ...configEditor, minHeight: 150, placeholder: 'Thông báo cho lớp học' }}
                            value={notificationText}
                            onBlur={(text) => setNotificationText(text)} // preferred to use only this option to update the content for performance reasons
                            //onChange={setQuestionContent}
                        />
                        <div className="flex justify-between items-center mt-3">
                            <button
                                className="text-2xl md:text-base bg-primary text-white rounded px-3 py-1 "
                                onClick={() => setIsOpenQuizzes(!isOpenQuizzes)}
                            >
                                <FontAwesomeIcon className="mr-1" icon={faBookOpen} />
                                Thêm đề thi
                            </button>
                            <button
                                onClick={uploadPost}
                                className="text-2xl md:text-base bg-primary text-white rounded px-3 py-1"
                            >
                                Đăng
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    {classroom?.posts?.map((post, index) => (
                        <div key={index} className="w-full border rounded px-3 py-3">
                            <div className="flex justify-between border-b-2 border-gray-300 pb-2">
                                <div className="flex items-center">
                                    {post?.createdBy?.avatar && (
                                        <img
                                            className="w-12 h-12 border-2 rounded-full mr-2"
                                            src={post?.createdBy?.avatar}
                                            alt="avatar"
                                        />
                                    )}
                                    <div className="flex flex-col justify-center">
                                        <p className="text-md font-semibold text-gray-600">
                                            {post?.createdBy?.name || post?.createdBy?.email}
                                        </p>
                                        <span className="text-gray-400 text-xs">
                                            {post?.createdAt && dayjs(post?.createdAt).format('DD/MM/YYYY')}
                                        </span>
                                    </div>
                                </div>
                                {post?.createdBy?.email === user?.email && (
                                    <div>
                                        <Tippy
                                            interactive={true}
                                            trigger="click"
                                            placement="bottom-end"
                                            offset={[0, 0]}
                                            content={
                                                <div
                                                    className="flex flex-col shadow-md bg-white w-28 rounded-md overflow-hidden"
                                                    tabIndex="-1"
                                                >
                                                    <button
                                                        onClick={() => handleOpenModal(post._id)}
                                                        className="py-1 px-2 text-white bg-red-500 hover:opacity-80 transition-all"
                                                    >
                                                        <FontAwesomeIcon className="mr-1" icon={faTrash} />
                                                        Xóa
                                                    </button>
                                                </div>
                                            }
                                        >
                                            <button className="mr-3 px-2 py-2">
                                                <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                    className="text-3xl md:text-xl text-gray-700"
                                                />
                                            </button>
                                        </Tippy>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3">{HTMLReactParser(post.content)}</div>
                            {post?.quizzes && (
                                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 xl:grid-cols-5 pt-2 border-t-2 border-gray-300">
                                    <p className="text-xl text-emerald-900 col-span-2 md:col-span-4 xl:col-span-5">
                                        Đề thi:
                                    </p>
                                    {post?.quizzes?.map((quiz, index) => (
                                        <button
                                            key={index}
                                            onClick={() => navigate(`${quizRouter.reviewQuiz}/${quiz.slug}`)}
                                            className="rounded border pb-2 shadow hover:shadow-lg"
                                        >
                                            <LazyImage src={quiz.thumb} />
                                            {quiz.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {isOpenQuizzes && (
                    <>
                        <BlurBackground onClick={() => setIsOpenQuizzes(!isOpenQuizzes)} isActive={isOpenQuizzes} />
                        <ChooseQuizzes
                            quizzes={quizzesQuery?.data}
                            selectedQuizzes={selectedQuizzes}
                            setSelectedQuizzes={setSelectedQuizzes}
                        />
                    </>
                )}
            </div>
            <Modal
                isShow={isShowModal}
                onCancel={() => setIsShowModal(false)}
                onOk={() => handleDeletePost()}
                onLoading={deletePostMutation.isPending}
                title="Xóa thông báo lớp học"
                content="Bạn có chắc về quết định này?"
            />
        </>
    );
};
const EveryoneComponent = () => {
    const { classroom } = useContext(ClassroomContext);
    return (
        <div className="w-full bg-white">
            <div className="w-full">
                <div className="w-full border-b-2">
                    <h3>Giáo viên</h3>
                </div>
                <div>{/* <img src={classroom.}/> */}</div>
            </div>
            {classroom.students.map((student) => {})}
        </div>
    );
};
const tabContents = {
    0: {
        label: 'Bảng tin',
        content: <NewsFeedComponent />,
    },
    1: {
        label: 'Mọi người',
        content: <EveryoneComponent />,
    },
};
const ClassroomDetailMain = () => {
    const [tabKey, setTabKey] = useState(0);
    return (
        <div className="w-full mt-2 md:mt-0 min-h-screen bg-white px-8 py-4 rounded-xl shadow-lg flex flex-col">
            <div className="w-full flex flex-nowrap overflow-scroll gap-4">
                {Object.entries(tabContents).map(([key, value], index) => (
                    <button
                        key={index}
                        className={`border-b-2 px-2 py-1 ${
                            tabKey == key ? 'border-primary' : 'border-white'
                        } transition-all duration-300`}
                        onClick={() => setTabKey(key)}
                    >
                        <span
                            className={`font-medium text-gray-500 ${
                                tabKey == key ? 'text-primary' : ''
                            } transition-all duration-300`}
                        >
                            {value.label}
                        </span>
                    </button>
                ))}
            </div>
            <div className="flex-grow">{tabContents[tabKey]?.content}</div>
        </div>
    );
};
const ClassroomDetail = () => {
    return (
        <ClassroomProvider>
            <ClassroomDetailMain />
        </ClassroomProvider>
    );
};
export default ClassroomDetail;
