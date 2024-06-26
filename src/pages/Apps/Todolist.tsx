import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import Dropdown from '../../components/Dropdown';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconClipboardText from '../../components/Icon/IconClipboardText';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconListCheck from '../../components/Icon/IconListCheck';
import IconMenu from '../../components/Icon/IconMenu';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconPlus from '../../components/Icon/IconPlus';
import IconSearch from '../../components/Icon/IconSearch';
import IconSquareRotated from '../../components/Icon/IconSquareRotated';
import IconStar from '../../components/Icon/IconStar';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconX from '../../components/Icon/IconX';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
const Todolist = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Test Cases'));
    });
    const defaultParams = {
        testCaseId: null,
        versionTest:0,
        testCaseName: '',
        testCaseDescription: '',
        descriptionText: '',
        navigator: '',
        path: '',
        url: '',
        userId: null,
        testCaseUpdatedDate:'',
        testCaseCreatedDate:'',
        priority: 'low',
    };

    const [selectedTab, setSelectedTab] = useState('');
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [viewTaskModal, setViewTaskModal] = useState(false);
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const [allTasks, setAllTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState<any>(allTasks);


    useEffect(() => {
        setFilteredTasks(allTasks);
        setPagedTasks(filteredTasks);

    }, [allTasks])


    const [pagedTasks, setPagedTasks] = useState<any>(filteredTasks);
    const [searchTask, setSearchTask] = useState<any>('');
    const [selectedTask, setSelectedTask] = useState<any>(defaultParams);
    const [testSuites, setTestSuites] = useState<any>([]);
    const [pager] = useState<any>({
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
    });

    // console.log(pagedTasks);


    const fetchSuites = () => {
        try {
            axios.get('http://localhost:7060/api/testsuite').then((response) => {
                setTestSuites(response.data);
            });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTest = () => {
        try {
            axios.get('http://localhost:7060/api/TestCase').then((response) => {
                setAllTasks(response.data);
            });
        } catch (err) {
            console.error(err);
        }
    };

    const runTest = (task: any) => {
        try {
            const reqBody = { "testCase": task.testCaseId };
            axios.post('http://localhost:7060/api/testcase/execute', reqBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.status === 200) {
                    showMessage(`${task.testCaseName} runned Successfully`);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const deleteTask = async (task: any) => {
        try {
            await axios.delete(`http://localhost:7060/api/testcase/${task.testCaseId}`).then(response => {

                setAllTasks(allTasks.filter((d: any) => d.testCaseId !== task.testCaseId));
                searchTasks(false);
                console.log('Succès :', response.data);

            })
                .catch(error => {
                    console.log('Erreur :', error.message);
                });

        } catch (error: any) {
            console.error(`Error deleting test case with id ${task.testCaseId}: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchSuites();
        fetchTest();
    }, []);
    useEffect(() => {
        searchTasks();
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [selectedTab, searchTask, allTasks]);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const searchTasks = (isResetPage = true) => {
        if (isResetPage) {
            pager.currentPage = 1;
        }
        let res = allTasks;

        if (selectedTab !== '') {
            res = res.filter((d: any) => d.testSuiteId === selectedTab);
        }

        res = res.filter((d: any) =>
            d.testCaseName?.toLowerCase().includes(searchTask.toLowerCase()) ||
            d.testCaseDescription?.toLowerCase().includes(searchTask.toLowerCase()) ||
            d.testSuiteName?.toLowerCase().includes(searchTask.toLowerCase())
        );

        setFilteredTasks(res);
        getPager(res);
    };

    const getPager = (res: any) => {
        setTimeout(() => {
            if (res.length) {
                pager.totalPages = pager.pageSize < 1 ? 1 : Math.ceil(res.length / pager.pageSize);
                if (pager.currentPage > pager.totalPages) {
                    pager.currentPage = 1;
                }
                pager.startIndex = (pager.currentPage - 1) * pager.pageSize;
                pager.endIndex = Math.min(pager.startIndex + pager.pageSize - 1, res.length - 1);
                setPagedTasks(res.slice(pager.startIndex, pager.endIndex + 1));
            } else {
                setPagedTasks([]);
                pager.startIndex = -1;
                pager.endIndex = -1;
            }
        });
    };


    const tabChanged = () => {
        setIsShowTaskMenu(false);
    };

    const taskComplete = (task: any = null) => {
        let item = filteredTasks.find((d: any) => d.id === task.testCaseId);
        item.status = item.status === 'complete' ? '' : 'complete';
        searchTasks(false);
    };



    const viewTask = (item: any = null) => {
        setSelectedTask(item);
        setTimeout(() => {
            setViewTaskModal(true);
        });
    };

    const addEditTask = (task: any = null) => {
        setIsShowTaskMenu(false);
        let json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (task) {
            let json1 = JSON.parse(JSON.stringify(task));
            setParams(json1);
        }
        setAddTaskModal(true);
    };


    const saveTask = async () => {
        if (!params.testCaseName) {
            showMessage('Title is required.', 'error');
            return false;
        }
        if (params.testCaseId) {
            //update task
            try {
                axios.put(`http://localhost:7060/api/testcase/${params.testCaseId}`, params).then((response)=>{
                    if (response.status === 200) {
                        setAllTasks(
                            //@ts-ignore
                            allTasks.map((d: any) => {
                                if (d.testCaseId === params.testCaseId) {
                                    d = params;
                                }
                                return d;
                            })
                        );
                    }
                })
                
            } catch (err: any) {
                console.error(err)
            }
        } else {
            //@ts-ignore
            const maxId = allTasks?.length ? allTasks.reduce((max: any, obj: any) => (obj.testCaseId > max ? obj.testCaseId : max), allTasks[0].testCaseId) : 0;
            let task = params;
            task.testCaseId = maxId + 1;

            try {
                const test = {
                    testCaseName: task.testCaseName,
                    testCaseDescription: task.testCaseDescription,
                    descriptionText: task.descriptionText,
                    navigator: task.navigator,
                    path: task.path,
                    url: task.url,
                    userId: null,
                    priority: task.priority,
                    testSuiteId: parseInt(task.testSuiteId)

                };
                await axios.post('http://localhost:7060/api/TestCase', test).then(response => {
                    console.log('Succès :', response.data);
                    fetchTest()
                    //@ts-ignore
                    allTasks.unshift(task);
                })
                    .catch(error => {

                        // Autre erreur
                        console.log('Erreur :', error.message);

                    });

            } catch (err: any) {
                console.error(err)
            }
            searchTasks();
        }
        showMessage('Test has been saved successfully.');
        setAddTaskModal(false);
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 7060,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div>
            <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
                <div
                    className={`panel p-4 flex-none w-[240px] max-w-full absolute xl:relative z-10 space-y-4 xl:h-auto h-full xl:block ltr:xl:rounded-r-md ltr:rounded-r-none rtl:xl:rounded-l-md rtl:rounded-l-none hidden ${isShowTaskMenu && '!block'
                        }`}
                >
                    <div className="flex flex-col h-full pb-16">
                        <div className="pb-5">
                            <div className="flex text-center items-center">
                                <div className="shrink-0">
                                    <IconClipboardText />
                                </div>
                                <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Test Cases list</h3>
                            </div>
                        </div>
                        <PerfectScrollbar className="relative ltr:pr-3.5 rtl:pl-3.5 ltr:-mr-3.5 rtl:-ml-3.5 h-full grow">
                            <div className="space-y-1">
                                <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                                <div className="text-white-dark px-1 py-3">Test Suites</div>
                                {testSuites && testSuites.map((suite: any) => (
                                    <button
                                        key={suite?.testSuiteId}
                                        type="button"
                                        className={`w-full flex items-center h-10 p-1 hover:bg-white-dark/10 rounded-md dark:hover:bg-[#181F32] font-medium text-success ltr:hover:pl-3 rtl:hover:pr-3 duration-300 ${selectedTab === suite.testSuiteName && 'ltr:pl-3 rtl:pr-3 bg-gray-100 dark:bg-[#181F32]'
                                            }`}
                                        onClick={() => {
                                            tabChanged();
                                            setSelectedTab(suite.testSuiteId);
                                        }}
                                    >
                                        <IconSquareRotated className="fill-success shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">{suite.testSuiteName}</div>
                                    </button>
                                ))}
                            </div>
                        </PerfectScrollbar>
                        <div className="ltr:left-0 rtl:right-0 absolute bottom-0 p-4 w-full">
                            <button className="btn btn-primary w-full" type="button" onClick={() => addEditTask()}>
                                <IconPlus className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                Add New Test Case
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`overlay bg-black/60 z-[5] w-full h-full rounded-md absolute hidden ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div>
                <div className="panel p-0 flex-1 overflow-auto h-full">
                    <div className="flex flex-col h-full">
                        <div className="p-4 flex sm:flex-row flex-col w-full sm:items-center gap-4">
                            <div className="ltr:mr-3 rtl:ml-3 flex items-center">
                                <button type="button" className="xl:hidden hover:text-primary block ltr:mr-3 rtl:ml-3" onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}>
                                    <IconMenu />
                                </button>
                                <div className="relative group flex-1">
                                    <input
                                        type="text"
                                        className="form-input peer ltr:!pr-10 rtl:!pl-10"
                                        placeholder="Search Test Case..."
                                        value={searchTask}
                                        onChange={(e) => setSearchTask(e.target.value)}
                                        onKeyUp={() => searchTasks()}
                                    />
                                    <div className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                        <IconSearch />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center sm:justify-end sm:flex-auto flex-1">
                                <p className="ltr:mr-3 rtl:ml-3">{pager.startIndex + 1 + '-' + (pager.endIndex + 1) + ' of ' + filteredTasks.length}</p>
                                <button
                                    type="button"
                                    disabled={pager.currentPage === 1}
                                    className="bg-[#f4f4f4] rounded-md p-1 enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 ltr:mr-3 rtl:ml-3 disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => {
                                        pager.currentPage--;
                                        searchTasks(false);
                                    }}
                                >
                                    <IconCaretDown className="w-5 h-5 rtl:-rotate-90 rotate-90" />
                                </button>
                                <button
                                    type="button"
                                    disabled={pager.currentPage === pager.totalPages}
                                    className="bg-[#f4f4f4] rounded-md p-1 enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => {
                                        pager.currentPage++;
                                        searchTasks(false);
                                    }}
                                >
                                    <IconCaretDown className="w-5 h-5 rtl:rotate-90 -rotate-90" />
                                </button>
                            </div>
                        </div>
                        <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

                        {pagedTasks.length ? (
                            <div className="table-responsive grow overflow-y-auto sm:min-h-[300px] min-h-[400px]">
                                <table className="table-hover">
                                    <tbody>
                                        {pagedTasks.map((task: any) => {
                                            const testSuite = testSuites?.find((suite: any) => suite.testSuiteId == task.testSuiteId);

                                            return (
                                                <tr className={`group cursor-pointer `} key={task.testCaseId}>
                                                    <td className="w-1">
                                                        <input
                                                            type="checkbox"
                                                            id={`chk-${task.testCaseId}`}
                                                            className="form-checkbox"
                                                            disabled={selectedTab === 'trash'}
                                                            onClick={() => taskComplete(task)}

                                                        />
                                                    </td>
                                                    <td>
                                                        <div onClick={() => viewTask(task)}>
                                                            <div className={`group-hover:text-primary font-semibold text-base whitespace-nowrap `}>
                                                                {task.testCaseName}
                                                            </div>
                                                            <div className={`text-white-dark overflow-hidden min-w-[300px] line-clamp-1`}>
                                                                {task.testCaseDescription}
                                                            </div>
                                                        </div>

                                                    </td>
                                                    <td className="w-1">
                                                        <div className="flex items-center ltr:justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                                                            <span
                                                                className={`badge rounded-full capitalize hover:top-0 hover:text-white badge-outline-success hover:bg-success`}
                                                            >
                                                                {testSuite?.testSuiteName || "Nothing"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="w-1">
                                                        <p className={`whitespace-nowrap text-white-dark font-medium `}>{task.date}</p>
                                                    </td>
                                                    <td className="w-1">
                                                        <div className="flex items-center justify-between w-max ltr:ml-auto rtl:mr-auto">

                                                            <div className="dropdown">
                                                                <Dropdown
                                                                    offset={[0, 5]}
                                                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                                    btnClassName="align-middle"
                                                                    button={<IconHorizontalDots className="rotate-90 opacity-70" />}
                                                                >
                                                                    <ul className="whitespace-nowrap">
                                                                        {selectedTab !== 'trash' && (
                                                                            <>
                                                                                <li>
                                                                                    <button type="button" onClick={() => addEditTask(task)}>
                                                                                        <IconPencilPaper className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                                        Edit
                                                                                    </button>
                                                                                </li>
                                                                                <li>
                                                                                    <button type="button" onClick={() => deleteTask(task)}>
                                                                                        <IconTrashLines className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                                        Delete
                                                                                    </button>
                                                                                </li>
                                                                                <li>
                                                                                    <button type="button" onClick={() => runTest(task)}>
                                                                                        <IconStar className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                                        Run
                                                                                    </button>
                                                                                </li>
                                                                                <li>
                                                                                    <Link to={`/testcase/${task.testCaseId}`} >
                                                                                        <IconListCheck className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                                                        Consult
                                                                                    </Link>
                                                                                </li>
                                                                            </>
                                                                        )}

                                                                    </ul>
                                                                </Dropdown>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center sm:min-h-[300px] min-h-[400px] font-semibold text-lg h-full">No data available</div>
                        )}
                    </div>
                </div>
                {/* Edit + Create Modal */}
                <Transition appear show={addTaskModal} as={Fragment}>
                    <Dialog as="div" open={addTaskModal} onClose={() => setAddTaskModal(false)} className="relative z-[51]">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[black]/60" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center px-4 py-8">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                        <button
                                            type="button"
                                            onClick={() => setAddTaskModal(false)}
                                            className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        >
                                            <IconX />
                                        </button>
                                        <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                            {params.testCaseId ? 'Edit Test Case' : 'Add Test Case'}
                                        </div>
                                        <div className="p-5">
                                            <form>
                                                <div className="mb-5">
                                                    <label htmlFor="testCaseName">Title</label>
                                                    <input id="testCaseName" type="text" placeholder="Enter Test Title" className="form-input" value={params.testCaseName} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="navigator">Browser</label>
                                                    <select id="navigator" className="form-select" value={params.navigator} onChange={(e) => changeValue(e)}>
                                                        <option value="">Select Browser</option>
                                                        <option value="Chrome">Chrome</option>
                                                        <option value="Edge">Edge</option>
                                                        <option value="Firefox">Firefox</option>
                                                        <option value="Brave">Brave</option>
                                                        <option value="Tor">Tor</option>
                                                    </select>
                                                </div>
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="testsuite">Test Suite</label>
                                                        <select id="testSuiteId" className="form-select" value={params.testSuiteId} onChange={(e) => changeValue(e)}>
                                                            <option value='' selected>Select Test Suite</option>
                                                            {testSuites.map((suite: any) => (
                                                                <option key={suite.testSuiteId} value={suite.testSuiteId}>{suite.testSuiteName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="url">URL</label>
                                                        <input id="url" type="text" placeholder="Enter Test URL" className="form-input" value={params.url} onChange={(e) => changeValue(e)} />
                                                    </div>
                                                </div>
                                                <div className="mb-5">
                                                    <label>Description</label>
                                                    <textarea
                                                        value={params.testCaseDescription}
                                                        onChange={(e) => {
                                                            setParams({
                                                                ...params,
                                                                testCaseDescription: e.target.value,
                                                                descriptionText: e.target.value
                                                            });
                                                        }}
                                                        style={{ minHeight: '200px', width: '100%', backgroundColor: 'transparent', border: '1px solid #e5e5e5', padding: '10px' }}
                                                    />

                                                </div>
                                                <div className="ltr:text-right rtl:text-left flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddTaskModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => saveTask()}>
                                                        {params.testCaseId ? 'Update' : 'Add'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
                {/* Description Modal */}
                <Transition appear show={viewTaskModal} as={Fragment}>
                    <Dialog as="div" open={viewTaskModal} onClose={() => setViewTaskModal(false)} className="relative z-[51]">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[black]/60" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center px-4 py-8">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                        <button
                                            type="button"
                                            onClick={() => setViewTaskModal(false)}
                                            className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        >
                                            <IconX />
                                        </button>
                                        <div className="flex items-center flex-wrap gap-2 text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                            <div>{selectedTask.testCaseName}</div>
                                                        

                                        </div>
                                        <div className="p-5">
                                            <div>Description: {selectedTask.testCaseDescription}</div>
                                            <div>Test Version: {selectedTask.versionTest? 'Clicks':'Video'}</div>
                                            <div>Navigator: {selectedTask.navigator}</div>
                                            <div>URL: {selectedTask.url}</div>
                                            <div>Creation Date: {selectedTask.testCaseCreatedDate}</div>
                                            <div>Update Date: {selectedTask.testCaseUpdatedDate}</div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setViewTaskModal(false)}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default Todolist;
