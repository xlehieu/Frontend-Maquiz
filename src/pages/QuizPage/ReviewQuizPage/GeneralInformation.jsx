import React, { memo, useEffect, useMemo } from 'react';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import {
    faBookOpenReader,
    faChartSimple,
    faHeart,
    faPlayCircle,
    faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { quizRouter } from '~/config';
import { message, Popover } from 'antd';
import LazyImage from '~/components/LazyImage';
import Modal from '~/components/Modal';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as UserService from '~/services/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { favoriteQuiz } from '~/redux/slices/user.slice';
const GeneralInformation = ({ quizDetail }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const handleCountQuestion = useMemo(() => {
        if (quizDetail?.quiz?.length > 0) {
            return quizDetail?.quiz?.reduce((accumulator, partCurrent) => {
                return accumulator + partCurrent?.questions?.length;
            }, 0);
        }
        return 0;
    }, [quizDetail]);
    const favoriteMutation = useMutationHooks((data) => UserService.favoriteQuiz(data));
    const handleFavoriteQuiz = () => {
        if (!quizDetail._id) return;
        if (user?.favoriteQuiz?.some((quiz) => quiz.slug === quizDetail.slug))
            return message.info('Đề thi đã có trong danh sách yêu thích! ❤️❤️❤️');
        favoriteMutation.mutate({ id: quizDetail._id });
        dispatch(favoriteQuiz({ slug: quizDetail.slug }));
    };
    useEffect(() => {
        if (favoriteMutation.isSuccess) {
            message.success('Đã thêm đề thi vào mục yêu thích! ❤️❤️❤️');
            favoriteMutation.reset();
        }
    }, [favoriteMutation.isSuccess]);
    const handleOpenModalStartQuiz = async () => {
        navigate(`${quizRouter.takeQuiz}/${quizDetail?.slug}`);
    };
    return (
        <>
            <div className="px-2 py-2 rounded-sm shadow-md border bg-white">
                <h6 className="font-semibold">Thông tin đề thi</h6>
                <div className="grid grid-cols-3 mt-2 gap-3">
                    <div className="col-span-1">
                        <LazyImage
                            alt={quizDetail?.name}
                            src={quizDetail?.thumb}
                            className="w-full h-full object-cover rounded border"
                        />
                    </div>
                    <div className="col-span-1">
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold text-lg">{quizDetail?.name}</p>
                            <div className="mt-2">
                                <LazyImage
                                    className="w-9 h-9 rounded-full overflow-hidden"
                                    src={quizDetail?.user?.avatar}
                                    alt={`avatar ${quizDetail?.user?.name}`}
                                />
                                <p className="inline ml-2">{quizDetail?.user?.name}</p>
                            </div>
                            {quizDetail?.createdAt && (
                                <div className="mt-2">
                                    <FontAwesomeIcon icon={faClock} className="text-lg inline" />
                                    <p className="inline ml-2">
                                        {quizDetail?.createdAt && dayjs(quizDetail?.createdAt).format('DD/MM/YYYY')}
                                    </p>
                                </div>
                            )}
                            <div className="mt-2 flex gap-4">
                                <Popover content={'Số câu hỏi'} trigger="hover">
                                    <>
                                        <FontAwesomeIcon icon={faQuestionCircle} className="mr-2 text-yellow-500" />
                                        {handleCountQuestion}
                                    </>
                                </Popover>
                                <Popover content={'Lượt thi'} trigger="hover">
                                    <FontAwesomeIcon icon={faBookOpenReader} className="mr-2 text-green-500" />
                                    {quizDetail?.examCount}
                                </Popover>
                                <Popover content={'Lượt truy cập'} trigger="hover">
                                    <FontAwesomeIcon icon={faChartSimple} className="mr-2 text-blue-500" />
                                    {quizDetail?.accessCount}
                                </Popover>
                            </div>
                            {quizDetail?.school && (
                                <div className="mt-2">
                                    <p className="font-medium">Trường học: {quizDetail?.school}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex flex-col gap-3">
                            {quizDetail.topic && (
                                <div className="mt-2">
                                    <p className="font-medium max-h-12 overflow-scroll">Chủ đề: {quizDetail.topic}</p>
                                </div>
                            )}
                            {quizDetail.schoolYear && (
                                <div className="mt-2">
                                    <p className="font-medium max-h-12 overflow-scroll">
                                        Năm học: {quizDetail.schoolYear}
                                    </p>
                                </div>
                            )}
                            {quizDetail.educationLevel && quizDetail?.educationLevel?.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium overflow-scroll">
                                        Trình độ:{' '}
                                        {quizDetail?.educationLevel?.map((level, index) => (
                                            <span>
                                                {level}
                                                {index < quizDetail?.educationLevel?.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            )}
                            {quizDetail.description && (
                                <div className="mt-2">
                                    <p className="font-medium max-h-16 overflow-scroll">
                                        Mô tả: {quizDetail.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-start-2 col-end-2">
                        <button
                            onClick={handleOpenModalStartQuiz}
                            // to={`${quizRouter.takeQuiz}/${quizDetail?.slug}`}
                            className="bg-gradient-to-r from-primary to-green-700 text-white rounded hover:opacity-60 duration-300 w-full py-1"
                        >
                            <FontAwesomeIcon icon={faPlayCircle} className="mr-2" />
                            Bắt đầu ôn thi
                        </button>
                    </div>
                    <div className="col-start-3 col-end-3">
                        <button
                            onClick={handleFavoriteQuiz}
                            // to={`${quizRouter.takeQuiz}/${quizDetail?.slug}`}
                            className="bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded hover:opacity-60 duration-300 w-full py-1"
                        >
                            <FontAwesomeIcon icon={faHeart} className="mr-2" />
                            Yêu thích
                        </button>
                    </div>
                </div>
            </div>
            <Modal />
        </>
    );
};

export default memo(GeneralInformation);
