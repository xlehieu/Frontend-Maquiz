import React, { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import useMutationHooks from '~/hooks/useMutationHooks';
import { LoadingOutlined, DeleteOutlined, PlusOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';

import JoditEditor from 'jodit-react';
//Components
import UploadComponent from '~/components/UploadComponent';
import * as QuizService from '~/services/quiz.service';
import Button from '~/components/Button';
import CreateQuizPart from '~/components/CreateQuizPartCmp';
import BlurBackground from '~/components/BlurBackground';
//
import { Input, message, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { educationLevels, imageQuizThumbDefault } from '~/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faPlusCircle, faQuestionCircle, faReply, faSave } from '@fortawesome/free-solid-svg-icons';
import { Navigate, useNavigate } from 'react-router-dom';
import configEditor from '~/config/editor';
import { useSelector } from 'react-redux';
import siteRouter from '~/config';

const TabIndexContext = createContext();
const QuizIdContext = createContext();
const QuizContextProvider = ({ children }) => {
    //region Tab index context
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [quizId, setQuizId] = useState();
    return (
        <TabIndexContext.Provider value={{ currentTabIndex, setCurrentTabIndex }}>
            <QuizIdContext.Provider value={{ quizId, setQuizId }}>{children}</QuizIdContext.Provider>
        </TabIndexContext.Provider>
    );
};
const CreateQuizGeneralInfo = () => {
    const { currentTabIndex, setCurrentTabIndex } = useContext(TabIndexContext);
    const { setQuizId } = useContext(QuizIdContext);
    //region General information
    const [imageUrl, setImageUrl] = useState(''); //Anh base64
    const [quizName, setQuizName] = useState('');
    const [quizDesc, setQuizDesc] = useState('');
    const [quizSchool, setQuizSchool] = useState();
    const [quizSubject, setQuizSubject] = useState('');
    const [quizEducationLevel, setQuizEducationLevel] = useState([]);
    const [quizSchoolYear, setQuizSchoolYear] = useState(2025);
    const [quizTopic, setQuizTopic] = useState('');
    // ref vào các span để hiển  thị validate
    const refQuizName = useRef();
    const refQuizDesc = useRef();
    const refQuizSchool = useRef();
    const refQuizSubject = useRef();
    const refQuizEducationLevel = useRef();
    const refQuizSchoolYear = useRef();
    const refQuizTopic = useRef();
    const handleChangeImage = useCallback((url) => {
        setImageUrl(url);
    }, []); // ở đây phải sử dụng useCallback vì dùng hàm setImageUrl này truyền vào cmp Upload, bên trong cmp Upload phải sử dụng memo

    // Tạo thông tin chung về bài trắc nghiệm
    const createQuizGeneralInfoMutation = useMutationHooks((data) => QuizService.createQuiz(data));

    useEffect(() => {
        if (createQuizGeneralInfoMutation.isSuccess && createQuizGeneralInfoMutation.data) {
            setCurrentTabIndex(1);
            setQuizId(createQuizGeneralInfoMutation?.data?._id);
            message.success('Tạo bài trắc nghiệm thành công');
            createQuizGeneralInfoMutation.reset();
        } else if (createQuizGeneralInfoMutation.isError) {
            message.error('Tạo bài trắc nghiệm thất bại. Vui lòng thử lại');
            createQuizGeneralInfoMutation.reset();
        }
    }, [createQuizGeneralInfoMutation.isSuccess, createQuizGeneralInfoMutation.isError]);

    const handleCreateQuizClick = () => {
        if (!quizName || !quizDesc || !quizSchool || !quizSubject) {
            if (!quizName) {
                refQuizName.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizDesc) {
                refQuizDesc.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizSchool) {
                refQuizSchool.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizSubject) {
                refQuizSubject.current.textContent = 'Đây là trường bắt buộc';
            }
            if (quizEducationLevel.length <= 0) {
                refQuizEducationLevel.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizSchoolYear) {
                refQuizSchoolYear.current.textContent = 'Đây là trường bắt buộc';
            }
            if (!quizTopic) {
                refQuizTopic.current.textContent = 'Đây là trường bắt buộc';
            }
            return;
        }
        createQuizGeneralInfoMutation.mutate({
            name: quizName,
            description: quizDesc,
            school: quizSchool,
            subject: quizSubject,
            thumb: imageUrl,
            schoolYear: quizSchoolYear,
            topic: quizTopic,
            educationLevel: quizEducationLevel,
        });
    };
    //END
    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
            <div className="px-3 py-4 rounded-lg border-2 shadow-sm w-full md:max-w-96 bg-white">
                <p className="font-semibold pb-2">Ảnh đề thi</p>
                <UploadComponent setImageUrl={handleChangeImage} imageUrl={imageUrl} />
                <div className="flex flex-wrap mt-2">
                    {imageQuizThumbDefault.map((imageSrc, index) => (
                        <button key={index} onClick={() => setImageUrl(imageSrc)} className="w-1/2 px-1 py-1 border">
                            <img src={imageSrc} alt="image-default" className="object-cover w-full" />
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 px-6 py-4 rounded-lg border-2 shadow-sm bg-white">
                <div className="flex flex-col focus-within:text-primary">
                    <div className="mb-2">
                        <label htmlFor="quizName" className="font-semibold">
                            Tên đề thi
                        </label>
                    </div>
                    <Input
                        value={quizName}
                        onChange={(e) => {
                            setQuizName(e.target.value);
                            refQuizName.current.textContent = '';
                        }}
                        autoComplete="off"
                        placeholder="Tên đề thi"
                        type="text"
                        className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                    ></Input>
                    <span className="text-sm text-red-600" ref={refQuizName}></span>
                </div>
                <div className="flex flex-col focus-within:text-primary">
                    <div className="mb-2">
                        <label htmlFor="quizSubject" className="font-semibold">
                            Trình độ
                        </label>
                    </div>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Please select"
                        value={quizEducationLevel}
                        onChange={(e) => setQuizEducationLevel(e)}
                    >
                        {educationLevels?.map((level, index) => (
                            <Select.Option value={level} key={index}>
                                {level}
                            </Select.Option>
                        ))}
                    </Select>
                    <span className="text-sm text-red-600" ref={refQuizEducationLevel}></span>
                </div>
                <div className="columns-2 gap-4">
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="flex flex-col focus-within:text-primary">
                            <div className="mb-2">
                                <label htmlFor="quizSchool" className="font-semibold">
                                    Năm học
                                </label>
                            </div>
                            <Input
                                onChange={(e) => setQuizSchoolYear(e.target.value)}
                                value={quizSchoolYear}
                                type="number"
                                className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                                placeholder="Năm học"
                            ></Input>
                            <span className="text-sm text-red-600" ref={refQuizSchoolYear}></span>
                        </div>
                    </div>
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="mb-2">
                            <label htmlFor="quizName" className="font-semibold">
                                Chủ đề bài thi
                            </label>
                        </div>
                        <Input
                            value={quizTopic}
                            onChange={(e) => {
                                setQuizTopic(e.target.value);
                            }}
                            autoComplete="off"
                            placeholder="Chủ đề bài thi"
                            type="text"
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                        ></Input>
                        <span className="text-sm text-red-600" ref={refQuizTopic}></span>
                    </div>
                </div>
                <div className="flex flex-col focus-within:text-primary">
                    <div className="mb-2">
                        <label htmlFor="quizDescription" className="font-semibold">
                            Mô tả đề thi
                        </label>
                    </div>
                    <TextArea
                        onInput={(e) => {
                            setQuizDesc(e.target.value);
                            refQuizDesc.current.textContent = '';
                        }}
                        value={quizDesc}
                        rows={4}
                        autoComplete="off"
                        placeholder="Mô tả"
                        className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                    ></TextArea>
                    <span className="text-sm text-red-600" ref={refQuizDesc}></span>
                </div>
                <div className="columns-2 gap-4 ">
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="mb-2">
                            <label htmlFor="quizSchool" className="font-semibold">
                                Trường học
                            </label>
                        </div>
                        <Input
                            onChange={(e) => setQuizSchool(e.target.value)}
                            value={quizSchool}
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                            placeholder={'Tên trường học'}
                        ></Input>
                        <span className="text-sm text-red-600" ref={refQuizSchool}></span>
                    </div>
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="mb-2">
                            <label htmlFor="quizSubject" className="font-semibold">
                                Tên môn học
                            </label>
                        </div>

                        <Input
                            value={quizSubject}
                            onChange={(e) => {
                                setQuizSubject(e.target.value);
                                refQuizSubject.current.textContent = '';
                            }}
                            autoComplete="off"
                            placeholder="Tên môn học"
                            type="text"
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                        ></Input>
                        <span className="text-sm text-red-600" ref={refQuizSubject}></span>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleCreateQuizClick}
                        className="py-2 px-4 rounded-md bg-primary text-white font-semibold hover:bg-primary-bold transition"
                    >
                        {createQuizGeneralInfoMutation.isPending ? (
                            <LoadingOutlined />
                        ) : (
                            <FontAwesomeIcon icon={faPlusCircle} />
                        )}{' '}
                        Thêm đề thi mới
                    </button>
                </div>
            </div>
        </div>
    );
};
//region Create question
const CreateQuizQuestion = () => {
    const { quizId } = useContext(QuizIdContext);
    // region QUIZ
    const [currentQuizPartName, setCurrentQuizPartName] = useState('Phần 1'); //lấy sate này để lưu thông tin phần của câu hỏi
    const [arrQuizPartName, setArrQuizPartName] = useState([currentQuizPartName]); // chứ không phải cái này, cái này chỉ là mảng để render ra những phần mình đã thêm
    const [isActiveQuizPartNameDialog, setIsActiveQuizPartNameDialog] = useState(false);

    const [questionType, setQuestionType] = useState(1);
    const [questionContent, setQuestionContent] = useState('');
    const initAnswers = [
        {
            content: '',
            isCorrect: true,
        },
        {
            content: '',
            isCorrect: false,
        },
        {
            content: '',
            isCorrect: false,
        },
        {
            content: '',
            isCorrect: false,
        },
    ];
    const [answers, setAnswers] = useState(initAnswers);
    const handleAddAnswer = () => {
        setAnswers((preAnswers) => {
            preAnswers = [...preAnswers];
            preAnswers.push({ content: '', isCorrect: false });
            return preAnswers;
        });
    };
    const handleRemoveAnswers = (index) => {
        setAnswers((prevAnswers) => {
            prevAnswers = [...prevAnswers];
            prevAnswers.splice(index, 1);
            return prevAnswers;
        });
    };
    const handleChangeAnswer = (text, index) => {
        setAnswers((prevAnswers) => {
            prevAnswers = [...prevAnswers];
            prevAnswers[index].content = text;
            return prevAnswers;
        });
    };
    const handleChangeSingleChoice = (index) => {
        setAnswers((prevAnswers) => {
            prevAnswers = [...prevAnswers];
            prevAnswers.forEach((answers) => {
                answers.isCorrect = false;
            });
            prevAnswers[index].isCorrect = true;
            return prevAnswers;
        });
    };
    const handleChangeMultipleChoice = (index) => {
        setAnswers((prevAnswers) => {
            prevAnswers = [...prevAnswers];
            prevAnswers[index].isCorrect = !prevAnswers[index].isCorrect;
            return prevAnswers;
        });
    };
    //END

    // Xử lý lưu thông tin câu hỏi
    const createQuestionMutation = useMutationHooks((data) => QuizService.createQuestion(data));
    const handleCreateQuestionClick = () => {
        if (!quizId) {
            message.error('Lỗiiiiiii');
            return;
        }
        if (!currentQuizPartName || !Number.isInteger(questionType) || !questionContent || !answers) {
            message.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        createQuestionMutation.mutate({
            id: quizId,
            partName: currentQuizPartName,
            questionType: questionType,
            questionContent: questionContent,
            answers: answers,
        });
    };
    useEffect(() => {
        if (createQuestionMutation.isSuccess && createQuestionMutation.data) {
            message.success('Lưu thông tin câu hỏi thành công');
            setQuestionContent('');
            setAnswers(initAnswers);
            window.scrollTo({
                top: 250,
                behavior: 'smooth', // Lướt mượt mà
            });
        }
        if (createQuestionMutation.isError) {
            message.error('Lỗi, không thêm được câu hỏi');
        }
    }, [createQuestionMutation.isSuccess, createQuestionMutation.isError]);
    //end
    const handleAddQuizPartName = (partName) => {
        setArrQuizPartName((prevArr) => {
            if (!prevArr.includes(partName)) return [...prevArr, partName];
            else {
                message.error('Phần này đã có trong danh sách ');
                return prevArr;
            }
        });
    };
    return (
        <div className="flex flex-col w-full">
            <div className="gap-4 flex flex-col md:flex-row items-start">
                <div className="px-3 py-4 rounded-lg border-2 shadow-sm bg-white w-full md:max-w-96">
                    <div className="flex justify-between">
                        <p className="font-semibold flex-wrap content-center">Danh sách phần thi</p>
                        <Button onClick={() => setIsActiveQuizPartNameDialog(true)}>
                            <p className="text-primary font-bold">Thêm mới</p>
                        </Button>
                    </div>
                    <div className="grid grid-cols-3">
                        {arrQuizPartName.map((quizPartName, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuizPartName(quizPartName)}
                                className={`${
                                    quizPartName === currentQuizPartName
                                        ? 'bg-primary text-white font-semibold border-2 border-primary'
                                        : 'border-2 text-gray-500'
                                } rounded-xl py-2 w-11/12 m-auto mt-3`}
                            >
                                {quizPartName}
                            </button>
                        ))}
                    </div>
                </div>
                <CreateQuizPart
                    setCurrentQuizPartName={(quizPartName) => setCurrentQuizPartName(quizPartName)}
                    setArrQuizPartName={handleAddQuizPartName}
                    callback={(quizPartName) => {
                        setCurrentQuizPartName(quizPartName);
                        handleAddQuizPartName(quizPartName);
                    }}
                    isActiveQuizPartNameDialog={isActiveQuizPartNameDialog}
                    setIsActiveQuizPartNameDialog={setIsActiveQuizPartNameDialog}
                />
                <div className="flex w-full flex-col gap-4 px-6 py-4 rounded-lg border-2 shadow-sm bg-white">
                    <div className="flex justify-between h-10">
                        <p className="font-semibold flex-wrap content-center text-xl">Thêm câu hỏi mới</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <label htmlFor="questionType" className="font-semibold">
                                Loại câu hỏi
                            </label>
                        </div>
                        <div>
                            <select
                                id="questionType"
                                className="sm:w-full lg:w-56 px-2 py-2 border-2 rounded-lg outline-primary"
                                value={questionType}
                                onChange={(e) => setQuestionType(e.target.value)}
                            >
                                <option value={1}>Một đáp án</option>
                                <option value={2}>Nhiều đáp án</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <label className="font-semibold">Soạn câu hỏi</label>
                        </div>
                        <JoditEditor
                            config={{
                                ...configEditor,
                                placeholder: 'Nhập câu hỏi',
                                askBeforePasteHTML: false,
                                defaultActionOnPaste: 'insert_as_html',
                            }}
                            value={questionContent}
                            onBlur={(newContent) => setQuestionContent(newContent)} // preferred to use only this option to update the content for performance reasons
                            //onChange={setQuestionContent}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <p className="font-semibold">Câu trả lời</p>
                        </div>
                        {answers.map((answer, index) => (
                            <div key={index} className="flex flex-col mt-4">
                                <div className="flex justify-between content-center">
                                    <div className="flex">
                                        {questionType === 1 ? (
                                            <input
                                                name="isCorrect"
                                                checked={answer.isCorrect}
                                                onChange={(e) => handleChangeSingleChoice(index)}
                                                type="radio"
                                                className="mr-2"
                                                id={`${'answer' + index}`}
                                            />
                                        ) : (
                                            <input
                                                name="isCorrect"
                                                checked={answer.isCorrect}
                                                onChange={(e) => handleChangeMultipleChoice(index)}
                                                type="checkbox"
                                                className="mr-2"
                                                id={`${'answer' + index}`}
                                            />
                                        )}
                                        <label htmlFor={`${'answer' + index}`} className="flex-wrap content-center">
                                            Đáp án {`${index + 1}`}
                                        </label>
                                    </div>
                                    <Button onClick={() => handleRemoveAnswers(index)}>
                                        <p className="text-red-600">
                                            <DeleteOutlined className="mr-1" />
                                            Xóa đáp án
                                        </p>
                                    </Button>
                                </div>
                                <JoditEditor
                                    config={{
                                        ...configEditor,
                                        placeholder: `Nhập câu trả lời ${index + 1}`,
                                        askBeforePasteHTML: false,
                                        defaultActionOnPaste: 'insert_as_html',
                                    }}
                                    className="mt-2"
                                    value={answer.content}
                                    onBlur={(newContent) => handleChangeAnswer(newContent, index)} // preferred to use only this option to update the content for performance reasons
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleAddAnswer}
                        className={
                            'w-full py-3 rounded-md border-4 border-dashed border-primary hover:opacity-50 transition'
                        }
                    >
                        <span className="text-primary font-bold">
                            <PlusOutlined className="text-xl pr-2" />
                            Thêm đáp án
                        </span>
                    </button>
                    <div className="mt-4 rounded-lg flex justify-end gap-3">
                        <button
                            className="px-3 py-2 rounded bg-gradient-to-r from-primary  via-[#cc2b5e] to-[#F9D423] bg-[length:400%] animate-animate-gradient text-white hover:bg-primary-bold"
                            onClick={() => handleCreateQuestionClick()}
                        >
                            {createQuestionMutation.isPending ? <LoadingOutlined /> : <DeliveredProcedureOutlined />}{' '}
                            Lưu và tiếp tục tạo mới
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full items-end">
                <BlurBackground isActive={isActiveQuizPartNameDialog} />
            </div>
        </div>
    );
};
const CreateQuizPageMain = () => {
    const { currentTabIndex } = useContext(TabIndexContext);
    const navigate = useNavigate();
    const tabs = [
        {
            key: 0,
            label: 'Thông tin chung',
            icon: <FontAwesomeIcon icon={faClipboard} />,
        },
        {
            key: 1,
            label: 'Câu hỏi',
            icon: <FontAwesomeIcon icon={faQuestionCircle} />,
        },
    ];
    const tabContent = {
        0: <CreateQuizGeneralInfo />,
        1: <CreateQuizQuestion />,
    };

    return (
        <div className="bg-opacity-40 py-10">
            <div className="w-full m-auto flex justify-between">
                <h4 className="font-semibold">Tạo đề thi mới</h4>
                <button onClick={() => navigate(-1)} className="rounded-lg bg-red-500 px-2 py-1 text-white">
                    <FontAwesomeIcon icon={faReply} className="mr-1" />
                    Quay lại
                </button>
            </div>
            <div className="w-full m-auto mt-3 px-4 rounded-lg border-2 shadow-sm flex gap-4 bg-white py-3">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`${
                            currentTabIndex === tab.key
                                ? 'bg-primary text-white border-primary'
                                : 'border-slate-300 opacity-40'
                        } rounded-3xl px-3 py-2 border-2`}
                    >
                        {tab.icon}
                        <span className="ml-2">{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="w-full m-auto mt-3 flex justify-center ">{tabContent[currentTabIndex]}</div>
        </div>
    );
};
const CreateQuizPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    useEffect(() => {
        if (!user.email) {
            console.log(user.email);
            navigate(siteRouter.signIn);
        }
    }, [user]);
    return (
        <QuizContextProvider>
            <CreateQuizPageMain />
        </QuizContextProvider>
    );
};
export default CreateQuizPage;
