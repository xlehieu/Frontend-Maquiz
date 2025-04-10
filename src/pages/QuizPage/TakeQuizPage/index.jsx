import { message, Select } from 'antd';
import React, { createContext, useContext, useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import congratsAnimation from '~/asset/animations/congratulations-2.json';
import Aos from 'aos';
import 'aos/dist/aos.css';
//component
import * as QuizService from '~/services/quiz.service';
import Timer from './Timer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { questionTypeContent } from '~/constants';
import HTMLReactParser from 'html-react-parser';
import LoadingComponent from '~/components/LoadingComponent';
import siteRouter from '~/config';
import { useQuery } from '@tanstack/react-query';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as QuizHistoryService from '~/services/quizHistory.service';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
//end

const TakeQuizContext = createContext();
const ANSWER_CHOICE_ACTION = {
    ADD_ANSWER_QUESTION_TYPE_1: 'addAnswerQuestionType1',
    ADD_ANSWER_QUESTION_TYPE_2: 'addAnswerQuestionType2',
};
const answerChoiceReducer = (state, action) => {
    switch (action.type) {
        case ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_1: {
            return {
                ...state,
                [action.payload.currentPartIndex]: {
                    ...state[action.payload.currentPartIndex],
                    [action.payload.currentQuestionIndex]: {
                        chooseIndex: action.payload.chooseIndex,
                        isCorrect: action.payload.isCorrect,
                    },
                },
            };
        }
        case ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_2: {
            const { currentPartIndex, currentQuestionIndex, chooseIndex, isCorrect } = action.payload;
            if (
                currentPartIndex !== undefined &&
                currentQuestionIndex !== undefined &&
                chooseIndex !== undefined &&
                isCorrect !== undefined
            ) {
                const choices = { ...state };
                // khi choices[currentPartIndex] là undefined thì phải set là một đối tượng không thì
                // kiểm tra choices[currentPartIndex][currentQuestionIndex] sẽ là đang truy cập đến thuộc tính của undefined nên lỗi
                // và đang là kiểm tra questionType = 1 nên sẽ kiểm tra là mảng
                if (typeof choices[currentPartIndex] === 'undefined') choices[currentPartIndex] = {};
                if (Array.isArray(choices[currentPartIndex][currentQuestionIndex])) {
                    // nếu câu hỏi vừa chọn có trong answer choice rồi thì return
                    if (
                        choices[currentPartIndex][currentQuestionIndex].some(
                            (choice) => choice.chooseIndex === chooseIndex,
                        )
                    ) {
                        return state;
                    }
                    choices[currentPartIndex] = {
                        ...choices[currentPartIndex],
                        [currentQuestionIndex]: [
                            ...choices[currentPartIndex][currentQuestionIndex],
                            {
                                chooseIndex: chooseIndex,
                                isCorrect: isCorrect,
                            },
                        ],
                    };
                } else {
                    choices[currentPartIndex] = {
                        ...choices[currentPartIndex],
                        [currentQuestionIndex]: [
                            {
                                chooseIndex: chooseIndex,
                                isCorrect: isCorrect,
                            },
                        ],
                    };
                }
                return choices;
            }
            return state;
        }
        default:
            return state;
    }
};
const checkQuestionCorrectQuestionType2 = (
    quizDetail,
    answerChoices,
    currentQuestionType,
    currentPartIndex,
    currentQuestionIndex,
) => {
    if (
        typeof quizDetail === 'undefined' &&
        typeof answerChoices === 'undefined' &&
        typeof currentQuestionType === 'undefined' &&
        typeof currentPartIndex === 'undefined' &&
        typeof currentQuestionIndex === 'undefined'
    )
        return;
    if (quizDetail.quiz && currentQuestionType === 2 && currentPartIndex in answerChoices) {
        if (currentQuestionIndex in answerChoices[currentPartIndex]) {
            const quiz = quizDetail.quiz;
            if (quiz[currentPartIndex].questions[currentQuestionIndex]) {
                const answers = quiz[currentPartIndex].questions[currentQuestionIndex].answers; // quiz detail
                const choices = answerChoices[currentPartIndex][currentQuestionIndex]; //answer choices
                if (Array.isArray(answers) && Array.isArray(choices)) {
                    let countAnswerCorrectInQuizDetail = 0;
                    answers.forEach((answer) => {
                        if (answer.isCorrect) return countAnswerCorrectInQuizDetail++;
                    }, 0);
                    let countAnswerCorrectInAnswerChoices = 0;
                    choices.forEach((choice) => {
                        if (choice.isCorrect) return countAnswerCorrectInAnswerChoices++;
                    }, 0);
                    const everyCorrect = choices.every((choice) => choice.isCorrect === true);
                    if (countAnswerCorrectInQuizDetail === countAnswerCorrectInAnswerChoices && everyCorrect) {
                        return true;
                    }
                    return false;
                }
            }
        }
    }
    return null;
};
// đếm số câu đúng trong 1 câu hỏi
const countCorrectAnswerQuizDetail = (question) => {
    if (!(question.answers.length > 0)) return 0;
    let count = 0;
    question.answers.forEach((answer) => {
        if (answer?.isCorrect) count++;
    });
    return count;
};
const countCorrectAnswerChoices = (answerChoices, quizDetail) => {
    let count = 0;
    //lặp qua từng phần
    Object.entries(answerChoices).forEach(([keyOfPart, valueOfPart]) => {
        if (typeof valueOfPart === 'object') {
            Object.entries(valueOfPart).forEach(([keyOfQuestion, valueOfQuestion]) => {
                if (typeof valueOfQuestion === 'object') {
                    if (valueOfQuestion.isCorrect) {
                        count++;
                    }
                } else if (Array.isArray(valueOfQuestion)) {
                    if (
                        countCorrectAnswerQuizDetail(quizDetail.quiz[keyOfPart].questions[keyOfQuestion]) ===
                        valueOfQuestion.length
                    ) {
                        if (valueOfQuestion.every((answer) => answer.isCorrect === true)) {
                            count++;
                        }
                    }
                }
            });
        }
    });
    return count;
};
const calculateScore = (answerChoices, countQuestionQuizDetail, quizDetail) => {
    if (typeof answerChoices === 'object' && typeof quizDetail === 'object' && quizDetail?.quiz?.length > 0) {
        let countCorrectAnswer = 0;
        //vào part
        Object.entries(answerChoices).forEach(([keyPart, value]) => {
            // entries trả về mảng, mảng đó lại chứa các mảng [key,value]
            if (typeof value === 'object') {
                //vào question và lấy được giá trị bằng value
                Object.entries(value).forEach(([keyQuestion, valueQuestion]) => {
                    if (
                        Array.isArray(valueQuestion) &&
                        countCorrectAnswerQuizDetail(quizDetail.quiz[keyPart].questions[keyQuestion]) ===
                            valueQuestion.length
                    ) {
                        if (valueQuestion.every((answer) => answer.isCorrect === true)) {
                            countCorrectAnswer++;
                        }
                    }
                    if (typeof valueQuestion === 'object') {
                        if (valueQuestion.isCorrect) {
                            countCorrectAnswer++;
                        }
                    }
                });
            }
        });
        return ((countCorrectAnswer / countQuestionQuizDetail) * 10).toFixed(2);
    }
};
const TakeQuizProvider = ({ children }) => {
    const { slug } = useParams();
    //region GET QUIZ DETAIL BY SLUG
    const queryQuizDetail = useQuery({
        queryKey: ['QueryQuizDetail', slug],
        queryFn: () => QuizService.getQuizForExamBySlug(slug),
    });
    const [timePass, setTimePass] = useState(2000);
    const [isEnded, setIsEnded] = useState(false);
    const [isTimeout, setIsTimeout] = useState(false);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerChoices, dispatchAnswerChoices] = useReducer(answerChoiceReducer, {});
    const [currentQuestionType, setCurrentQuestionType] = useState(null);
    const [countAnswerChoices, setCountAnswerChoices] = useState(0);
    const [countQuestionQuizDetail, setCountQuestionQuizDetail] = useState(0);
    // set cho current question type khi vào bài thi và đếm số câu hỏi trong bài
    useEffect(() => {
        if (!queryQuizDetail?.data) return;
        if (queryQuizDetail.data.quiz) {
            if (queryQuizDetail.data?.quiz[currentQuestionIndex]?.questions[currentQuestionIndex])
                setCurrentQuestionType(
                    queryQuizDetail.data?.quiz[currentQuestionIndex]?.questions[currentQuestionIndex]?.questionType ??
                        1,
                );
            if (Array.isArray(queryQuizDetail.data.quiz)) {
                setCountQuestionQuizDetail(() => {
                    return queryQuizDetail.data.quiz.reduce((accumulator, partDetail) => {
                        return (accumulator += partDetail.questions.length);
                    }, 0);
                });
            }
        }
    }, [queryQuizDetail.data]);
    //Đếm tất cả số câu hỏi trong câu trả lời (answer choices)
    useEffect(() => {
        if (answerChoices) {
            let count = 0;
            Object.entries(answerChoices).forEach(([keyOfPart, valueOfPart]) => {
                if (typeof valueOfPart === 'object') {
                    Object.entries(valueOfPart).forEach(() => {
                        count++;
                    });
                }
            });
            setCountAnswerChoices(count);
        }
    }, [answerChoices]);
    //

    //Khi get có lỗi
    useEffect(() => {
        if (queryQuizDetail.isError) {
            message.error('Lỗi');
        }
    }, [queryQuizDetail.isError]);
    //Set currentQuestionType khi thay đổi câu hỏi
    useEffect(() => {
        if (queryQuizDetail.data) {
            const quiz = queryQuizDetail.data.quiz;
            if (quiz) {
                if (quiz[currentPartIndex]?.questions[currentQuestionIndex]) {
                    setCurrentQuestionType(quiz[currentPartIndex].questions[currentQuestionIndex].questionType);
                }
                if (currentQuestionIndex === quiz[currentPartIndex].questions.length) {
                    if (currentPartIndex === quiz.length - 1) return;
                    setCurrentPartIndex(currentPartIndex + 1);
                    setCurrentQuestionIndex(0);
                }
            }
        }
    }, [currentQuestionIndex]);
    useEffect(() => {
        if (queryQuizDetail?.data) {
            const quiz = queryQuizDetail?.data?.quiz;
            if (quiz) {
                if (quiz[currentPartIndex]?.questions[currentQuestionIndex]) {
                    setCurrentQuestionType(quiz[currentPartIndex].questions[currentQuestionIndex].questionType);
                }
            }
        }
        setCurrentQuestionIndex(0);
    }, [currentPartIndex]);
    //END
    return (
        <TakeQuizContext.Provider
            value={{
                slug,
                quizDetail: queryQuizDetail.data,
                timePass,
                setTimePass,
                isEnded,
                setIsEnded,
                isTimeout,
                setIsTimeout,
                currentPartIndex,
                setCurrentPartIndex,
                currentQuestionIndex,
                setCurrentQuestionIndex,
                answerChoices,
                dispatchAnswerChoices,
                currentQuestionType,
                countAnswerChoices,
                countQuestionQuizDetail,
            }}
        >
            {queryQuizDetail.isLoading ? <LoadingComponent /> : <>{children}</>}
        </TakeQuizContext.Provider>
    );
};
//region phần bên trái của trang (hiển thị thông tin cơ bản bài thi)
const TakeQuizInfo = () => {
    const navigate = useNavigate();
    const {
        quizDetail,
        setIsEnded,
        setIsTimeout,
        timePass,
        setTimePass,
        currentPartIndex,
        setCurrentPartIndex,
        answerChoices,
    } = useContext(TakeQuizContext);
    const handleChangePartIndex = (partIndex) => {
        if (partIndex === currentPartIndex) return;
        setCurrentPartIndex(partIndex);
    };
    const handleBack = () => {
        navigate(-1);
    };
    return (
        <div className="flex flex-col w-full lg:max-w-72 gap-6">
            <div className="px-4 py-2 bg-white rounded shadow">
                <div className="border-b border-gray-300 font-medium py-2">
                    <p className="text-lg">{quizDetail?.name}</p>
                    <p className="font-normal mt-2">
                        Chế độ:<span className="font-bold ml-1">Ôn thi</span>
                    </p>
                </div>
                <div className="border-b border-gray-300 py-2">
                    <p>Thời gian làm bài</p>
                    <Timer setIsTimeout={setIsTimeout} />
                </div>
                <div className="pt-2">
                    <p className="font-medium pb-1 text-sm">Tự động chuyển câu sau</p>
                    <Select
                        onChange={(e) => {
                            setTimePass(e);
                        }}
                        defaultValue={timePass}
                        className="w-full md:w-1/2 mt-2"
                    >
                        <Select.Option value={1000}>1s</Select.Option>
                        <Select.Option value={2000}>2s</Select.Option>
                        <Select.Option value={3000}>3s</Select.Option>
                        <Select.Option value={4000}>4s</Select.Option>
                    </Select>
                </div>
                <div className="flex mt-3 gap-3">
                    <button
                        className="bg-red-500 block rounded-md px-3 py-1  duration-300 hover:opacity-65"
                        onClick={handleBack}
                    >
                        <p className="text-center text-white">Trở về</p>
                    </button>
                    <button
                        className="bg-yellow-500 block rounded-md px-3 py-1 duration-300 hover:opacity-65"
                        onClick={() => setIsEnded(true)}
                    >
                        <p className="text-center text-white">Kết thúc</p>
                    </button>
                </div>
            </div>
            <div className="px-4 py-2 bg-white rounded shadow">
                <p className="font-medium mb-4">Danh sách phần thi ({quizDetail?.quiz?.length})</p>
                {quizDetail?.quiz.map((part, index) => (
                    <button
                        key={index}
                        onClick={() => handleChangePartIndex(index)}
                        className={`w-full px-4 py-2 items-center rounded-sm flex justify-between opacity-95 duration-300 ease-linear ${
                            currentPartIndex === index
                                ? 'bg-blue-100 cursor-default'
                                : 'cursor-pointer hover:opacity-45 hover:bg-blue-100'
                        }`}
                    >
                        <div className="flex items-center">
                            <div
                                className={`w-7 h-7 flex items-center justify-center flex-wrap rounded-full ${
                                    currentPartIndex === index ? 'bg-pink-600' : ''
                                }`}
                            >
                                {currentPartIndex === index && (
                                    <FontAwesomeIcon className={`text-white text-sm`} icon={faBookOpen} />
                                )}
                            </div>
                            <span className="ml-3">{part?.partName}</span>
                        </div>
                        <div className="text-blue-500 font-medium text-right">
                            {index in answerChoices ? <>{Object.keys(answerChoices[index]).length}</> : 0}/
                            {quizDetail?.quiz[index]?.questions?.length}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
// region Choose answers
// Phần  giữa (chọn đáp án)
const sanitizeHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.querySelectorAll('p,span');

    elements.forEach((el) => {
        if (el.style && el.style.backgroundColor) {
            el.style.backgroundColor = ''; // Loại bỏ background-color
            el.style.color = ''; // Loại bỏ color
        }
    });

    return doc.body.innerHTML;
};
const ChooseAnswer = () => {
    const {
        quizDetail,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        currentPartIndex,
        answerChoices,
        dispatchAnswerChoices,
        timePass,
        currentQuestionType,
    } = useContext(TakeQuizContext);
    //hàm chuyển câu hỏi (tăng current question index)
    const NextQuestion = () => {
        const timeoutId = setTimeout(() => {
            if (quizDetail && typeof currentPartIndex === 'number' && typeof currentQuestionIndex === 'number') {
                if (quizDetail.quiz) {
                    const quiz = quizDetail.quiz;
                    // kiểm tra xem có phải câu cuối cùng khong
                    if (
                        currentQuestionIndex === quiz[currentPartIndex].questions.length - 1 &&
                        currentPartIndex === quiz.length - 1
                    )
                        return;
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
            }
        }, timePass ?? 2000);
        return () => clearTimeout(timeoutId);
    };
    // CHOOSE ANSWER HANDLING
    const handleChooseAnswer = (chooseIndex) => {
        // nếu không có current part index trong answer choice rồi thì xuống thực hiện code phía dưới
        // nếu có thì check xem có curent question index trong answer choice chưa nếu có thì return vì đã trả lời rồi thì không được làm lại nữa
        if (currentQuestionType == 1 && answerChoices[currentPartIndex])
            if (currentQuestionIndex in answerChoices[currentPartIndex]) return;
        if (currentQuestionType == 1) {
            dispatchAnswerChoices({
                type: ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_1,
                payload: {
                    currentPartIndex,
                    currentQuestionIndex,
                    chooseIndex: chooseIndex,
                    isCorrect:
                        quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.answers[chooseIndex]
                            ?.isCorrect,
                },
            });
            NextQuestion();
        } else if (currentQuestionType == 2) {
            dispatchAnswerChoices({
                type: ANSWER_CHOICE_ACTION.ADD_ANSWER_QUESTION_TYPE_2,
                payload: {
                    currentPartIndex,
                    currentQuestionIndex,
                    chooseIndex: chooseIndex,
                    isCorrect:
                        quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.answers[chooseIndex]
                            ?.isCorrect,
                },
            });
        }
    };
    //kiểm tra xem câu có question type = 2 đã đúng chưa, so sánh xem đáp án đúng trong quiz detail và answer choice câu hỏi hiện tại có bằng nhau không
    useEffect(() => {
        if (currentQuestionType !== 2) return;
        if (
            checkQuestionCorrectQuestionType2(
                quizDetail,
                answerChoices,
                currentQuestionType,
                currentPartIndex,
                currentQuestionIndex,
            )
        )
            NextQuestion();
        // ngược lại nếu chọn đủ các câu thì next
        else if (currentPartIndex in answerChoices && quizDetail?.quiz) {
            if (
                currentQuestionIndex in answerChoices[currentPartIndex] &&
                quizDetail?.quiz[currentPartIndex]?.questions
            ) {
                if (!Array.isArray(quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.answers))
                    return;
                const lengthAnswersCurrent =
                    quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.answers?.length;
                const lengthAnswerChoicesCurrent = answerChoices[currentPartIndex][currentQuestionIndex]?.length;
                if (lengthAnswersCurrent === lengthAnswerChoicesCurrent) {
                    NextQuestion();
                }
            }
        }
    }, [answerChoices]);
    // lặp mảng khi question type = 2 thì lấy ra choose index trong mảng answerChoices của câu hỏi hiện tại,
    // return về true hoặc false nếu đáp án render ở dưới có index === đáp án được chọn trong answerChoices[currentPartIndex][currentQuestionIndex]
    const handleGetIsCorrectAnswer = (indexInRenderAnswer) => {
        if (currentQuestionType == 2 && currentPartIndex in answerChoices) {
            const choices = answerChoices[currentPartIndex][currentQuestionIndex];
            if (Array.isArray(choices)) {
                // tìm xem trong answer choice có index render không? nếu có thì return về isCorrect của nó
                const foundChoice = choices.find((choice) => choice.chooseIndex === indexInRenderAnswer);
                return foundChoice ? foundChoice.isCorrect : null;
            }
        }
        return null;
    };
    const handleGetChooseIndexAnswer = (indexInRenderAnswer) => {
        if (currentQuestionType === 1 && currentPartIndex in answerChoices) {
            if (currentQuestionIndex in answerChoices[currentPartIndex]) {
                if (answerChoices[currentPartIndex][currentQuestionIndex].chooseIndex === indexInRenderAnswer)
                    return true;
            }
        }
        if (currentQuestionType === 2 && currentPartIndex in answerChoices) {
            const choices = answerChoices[currentPartIndex][currentQuestionIndex];
            if (Array.isArray(choices)) {
                // tìm xem trong answer choice có index render không? nếu có thì return về isCorrect của nó
                const foundChoice = choices.find((choice) => choice.chooseIndex == indexInRenderAnswer);
                return foundChoice ? true : false;
            }
        }
        return false;
    };
    // AOS EFFECT
    useEffect(() => {
        Aos.init({ duration: 1000, easing: 'linear' });
    }, []);
    useEffect(() => {
        Aos.refresh();
    }, [currentPartIndex, currentQuestionIndex]);
    // END
    return (
        <div className="px-2 py-2 flex-1 bg-white rounded shadow" key={currentQuestionIndex} data-aos="flip-left">
            {quizDetail?.quiz[currentPartIndex] && (
                <>
                    {quizDetail.quiz[currentPartIndex].questions instanceof Array && (
                        <>
                            {quizDetail.quiz[currentPartIndex].questions[currentQuestionIndex] && (
                                <>
                                    <div className="flex justify-between items-center">
                                        <p>Câu {currentQuestionIndex + 1}</p>
                                        <p className="text-sm text-gray-500">
                                            {/*lấy kiểu câu hỏi - Một đáp án or nhiều đáp án*/}
                                            {questionTypeContent[currentQuestionType]}
                                        </p>
                                    </div>
                                    <div className="my-2 font-medium">
                                        {/* Hiển thị nội dung câu hỏi */}
                                        {HTMLReactParser(
                                            quizDetail.quiz[currentPartIndex].questions[currentQuestionIndex]
                                                .questionContent,
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        {/* Render các câu trả lời và chọn */}
                                        {quizDetail.quiz[currentPartIndex].questions[currentQuestionIndex]
                                            .answers instanceof Array && (
                                            <>
                                                {quizDetail.quiz[currentPartIndex].questions[
                                                    currentQuestionIndex
                                                ].answers.map((answer, index) => (
                                                    <label
                                                        key={index}
                                                        className="flex items-center select-none space-x-2 cursor-pointer"
                                                    >
                                                        {/* Kiểm tra xem kiểu câu hỏi hiện tại là gì (hàm set ở trên provider)*/}
                                                        <input
                                                            type={currentQuestionType == 1 ? 'radio' : 'checkbox'}
                                                            onChange={() => handleChooseAnswer(index)}
                                                            checked={handleGetChooseIndexAnswer(index)}
                                                            className="w-5 h-5"
                                                        />
                                                        {/* Đây là render bằng mảng nên để tránh việc chưa trả lời mà đáp án đã tích thì phải đủ điều kiện
                                                        chỉ số phần thi hiện tại ở trong answerChoice(provider) và có thằng đáp án hiện tại sau khi chọn
                                                        tiếp theo thêm điều kiện đáp án đúng của câu hỏi

                                                        Khi trả lời sai thì tất render màu đỏ bằng cách chỉ số câu trả lời khi render và chỉ số câu trả lời đã lưu trong anserchoice phải bằng nhau
                                                        thứ 2 trong answerChoice isCorrect phải bằng false
                                                        */}
                                                        <div
                                                            className={
                                                                currentQuestionType == 1
                                                                    ? `${
                                                                          currentPartIndex in answerChoices &&
                                                                          answerChoices[currentPartIndex][
                                                                              currentQuestionIndex
                                                                          ] &&
                                                                          answer.isCorrect &&
                                                                          '!bg-green-700 text-white'
                                                                      } ${
                                                                          currentPartIndex in answerChoices &&
                                                                          answerChoices[currentPartIndex][
                                                                              currentQuestionIndex
                                                                          ]?.isCorrect === false &&
                                                                          answerChoices[currentPartIndex][
                                                                              currentQuestionIndex
                                                                          ]?.chooseIndex === index &&
                                                                          '!bg-red-600 !text-white'
                                                                      } px-2`
                                                                    : `${
                                                                          handleGetIsCorrectAnswer(index) === true &&
                                                                          '!bg-green-700 !text-white'
                                                                      }
                                                                      ${
                                                                          handleGetIsCorrectAnswer(index) === false &&
                                                                          '!bg-red-600 !text-white'
                                                                      }
                                                                      `
                                                            }
                                                        >
                                                            {HTMLReactParser(sanitizeHTML(answer.content))}
                                                        </div>
                                                    </label>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};
// region table of question
//Phàn bên phải chọn câu hỏi
const TableOfQuestion = () => {
    const {
        quizDetail,
        currentPartIndex,
        answerChoices,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        currentQuestionType,
    } = useContext(TakeQuizContext);
    return (
        <div className="px-2 py-2 bg-white rounded shadow lg:max-w-80 lg:min-w-72 w-full">
            <div className="mb-2 flex flex-row justify-between">
                <p>Mục lục câu hỏi</p>
                <p className="text-sm">{questionTypeContent[currentQuestionType]}</p>
            </div>
            <div className="flex flex-wrap gap-3">
                {quizDetail?.quiz[currentPartIndex]?.questions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`${
                            question.questionType === 1 &&
                            currentPartIndex in answerChoices &&
                            answerChoices[currentPartIndex][index]?.isCorrect === true &&
                            'bg-green-700 border-green-700 text-white'
                        } ${
                            question.questionType === 1 &&
                            currentPartIndex in answerChoices &&
                            currentQuestionIndex !== index &&
                            answerChoices[currentPartIndex][index]?.isCorrect === false &&
                            'bg-red-600 border-red-600 text-white'
                        } 
                        ${
                            currentQuestionIndex !== index &&
                            question.questionType === 2 &&
                            checkQuestionCorrectQuestionType2(quizDetail, answerChoices, 2, currentPartIndex, index) ===
                                true &&
                            'bg-green-700 border-green-700 text-white'
                        }
                        ${
                            currentQuestionIndex !== index &&
                            question.questionType === 2 &&
                            checkQuestionCorrectQuestionType2(quizDetail, answerChoices, 2, currentPartIndex, index) ===
                                false &&
                            'bg-red-600 border-red-600 text-white'
                        }
                        ${
                            currentQuestionIndex === index ? 'border-primary bg-primary text-white' : 'border-gray-300'
                        } border-2 rounded-lg min-w-10 h-10 font-medium`}
                    >
                        {Number(index + 1)}
                    </button>
                ))}
            </div>
        </div>
    );
};
const TakeQuizPageMain = () => {
    const { quizDetail, answerChoices, isEnded, isTimeout, countQuestionQuizDetail } = useContext(TakeQuizContext);
    const [score, setScore] = useState(0);
    const [answerCorrectCount, setAnswerCorrectCount] = useState(0);
    const handleSaveTakeQuizHistory = useMutationHooks((data) => QuizHistoryService.saveQuizHistory(data));
    useEffect(() => {
        if (!answerChoices || !quizDetail.id) return;
        if (isTimeout) {
            message.warning('Bạn đã hết giờ làm bài');
        }
        if (isEnded || isTimeout) {
            const score = calculateScore(answerChoices, countQuestionQuizDetail, quizDetail) || 0;
            setScore(score);
            handleSaveTakeQuizHistory.mutate({
                quizId: quizDetail.id,
                score: score,
                answerChoices,
            });
        }
        if (answerChoices) {
            const count = countCorrectAnswerChoices(answerChoices, quizDetail) || 0;
            setAnswerCorrectCount(count);
        }
    }, [isEnded, isTimeout]);
    useEffect(() => {
        if (handleSaveTakeQuizHistory.isSuccess) {
            handleSaveTakeQuizHistory.reset();
        }
    }, [handleSaveTakeQuizHistory.isSuccess]);
    return (
        <div className="w-full h-full flex justify-center items-center">
            {!handleSaveTakeQuizHistory.isPending ? (
                <>
                    {!isEnded ? (
                        <div className="flex w-full flex-col-reverse lg:flex-row gap-3 lg:items-start">
                            {quizDetail?.quiz && (
                                <>
                                    <TakeQuizInfo />
                                    <ChooseAnswer />
                                    <TableOfQuestion />
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="inset-0 w-full min-h-96 mx-5 my-5 md:mx-10 md:my-10">
                            <div className="text-black w-full bg-white shadow rounded px-5 py-5 flex flex-col items-center justify-center">
                                <div className="w-full flex flex-row gap-3">
                                    <div className="flex flex-col w-1/3 rounded-lg shadow-md border px-3 py-3 items-center">
                                        <h5 className="">Điểm của bạn là:</h5>
                                        <div className="w-1/2 mt-3">
                                            <CircularProgressbar
                                                styles={buildStyles({
                                                    textSize: '39px',
                                                    pathColor:
                                                        score < 5 ? '#ff0000' : score < 7 ? '#ffff00' : '#00ff00',
                                                    textColor: '#333',
                                                    trailColor: '#eee',
                                                })}
                                                value={score}
                                                maxValue={10}
                                                text={`${score}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-1/3 rounded-lg shadow-md border px-3 py-3 items-center">
                                        <h5>Số câu đúng</h5>
                                        <div className="mt-3 w-full flex flex-col items-center justify-center flex-1 gap-3">
                                            <LinearProgressBar
                                                answerCorrectCount={answerCorrectCount}
                                                max={countQuestionQuizDetail}
                                            />
                                            <h5 className="text-[#333]">
                                                <span className="font-bold">{answerCorrectCount}</span>/
                                                <span className="text-green-500 font-bold">
                                                    {countQuestionQuizDetail}
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={siteRouter.discover}
                                    className="bg-primary text-3xl px-3 py-3 mt-6 md:px-2 md:py-2 md:mt-10   z-20 text-white font-bold md:text-lg rounded-md"
                                >
                                    OK
                                </Link>
                            </div>
                            <Lottie
                                className="w-full md:w-2/3 absolute bottom-60 md:-bottom-24 z-10"
                                animationData={congratsAnimation}
                            />
                        </div>
                    )}
                </>
            ) : (
                <LoadingComponent />
            )}
        </div>
    );
};
const LinearProgressBar = ({ answerCorrectCount, max }) => {
    const percent = (answerCorrectCount / max) * 100;
    const getColor = (percent) => {
        if (percent < 50) return '#ff0000'; // đỏ
        if (percent < 70) return '#ffff00'; // vàng
        return '#00ff00'; // xanh
    };
    return (
        <div style={{ width: '100%', background: '#eee', borderRadius: '8px', overflow: 'hidden', height: '20px' }}>
            <div
                style={{
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: getColor(percent),
                    transition: 'width 0.5s ease',
                }}
            />
        </div>
    );
};

const TakeQuizPage = () => {
    return (
        <TakeQuizProvider>
            <TakeQuizPageMain />
        </TakeQuizProvider>
    );
};
export default TakeQuizPage;
