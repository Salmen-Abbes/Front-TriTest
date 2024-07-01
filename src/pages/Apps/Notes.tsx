import PerfectScrollbar from 'react-perfect-scrollbar';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconNotes from '../../components/Icon/IconNotes';
import IconStar from '../../components/Icon/IconStar';
import IconSquareRotated from '../../components/Icon/IconSquareRotated';
import IconPlus from '../../components/Icon/IconPlus';
import IconMenu from '../../components/Icon/IconMenu';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconX from '../../components/Icon/IconX';
import axios from 'axios'
const Notes = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Scenarios'));
    });
    const [notesList, setNoteList] = useState([
    ]);

    const defaultParams = { idTypeValue:'', tagValue:'', scenarioId: null, testCaseId: '', commande: '', path: '', value: '', url: '' };
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [isDeleteNoteModal, setIsDeleteNoteModal] = useState<any>(false);
    const [isShowNoteMenu, setIsShowNoteMenu] = useState<any>(false);
    const [isViewNoteModal, setIsViewNoteModal] = useState<any>(false);
    const [filterdNotesList, setFilterdNotesList] = useState<any>([]);
    const [selectedTab, setSelectedTab] = useState<any>('');
    const [deletedNote, setDeletedNote] = useState<any>(null);
    const [testCases, setTestCases] = useState<any>(null)


    const fetchTest = () => {
        axios.get('http://localhost:7060/api/testcase')
            .then(response => {
                setTestCases(response.data);
                console.log(notesList);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const fetchScenarios = () => {
        axios.get('http://localhost:7060/api/scenario')
            .then(response => {
                console.log(response);
                setNoteList(response.data);
                setFilterdNotesList(response.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        fetchScenarios();
        fetchTest();
    }, [])

    const searchNotes = () => {
        let res = notesList;
        console.log(selectedTab)
        console.log(res)
        if (selectedTab !== '') {
            res = res.filter((d: any) => d.testCaseId == selectedTab);
        }
        console.log(res)
        setFilterdNotesList(res);
    };

    const saveNote = async () => {
        if (!params.testCaseId) {
            showMessage('Test Case Required.', 'error');
            return false;
        }
        if (params.scenarioId) {
            //update task
            let note: any = notesList.find((d: any) => d.scenarioId === params.scenarioId);
            note.testCaseId = params.testCaseId;
            note.commande = params.commande;
            note.path = params.path;
            note.value = params.value;
            note.url = params.url;
        } else {
            //add note
            //@ts-ignore
            let maxNoteId = notesList.reduce((max: any, character: any) => (character.scenarioId > max ? character.scenarioId : max), notesList[0].scenarioId);
            if (!maxNoteId) {
                maxNoteId = 0;
            }
            let note = {
                scenarioId: maxNoteId + 1,
                testCaseId: params.testCaseId,
                commande: params.commande,
                path: params.path,
                value: params.value,
                url: params.url,
            };
            await axios.post('http://localhost:7060/api/scenario', note).then(response => {
                if (response.status === 200) {
                    //@ts-ignore
                    fetchScenarios();
                }
            })

        }
        showMessage('Scenario has been saved successfully.');
        setAddContactModal(false);
        searchNotes();
    };

    const tabChanged = (type: string) => {
        setIsShowNoteMenu(false);
        searchNotes();
    };

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const deleteNoteConfirm = (note: any) => {
        setDeletedNote(note);
        setIsDeleteNoteModal(true);
    };

    const handleEditNote = (note:any = null)=>{
        setIsShowNoteMenu(false);
        if (note){
            setParams(note);
        }
        setAddContactModal(true);
    }
    const editNote = (note: any = null) => {
        

        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (note) {
            axios.put(`http://localhost:7060/api/scenario/${note?.scenarioId}`, note).then((response) => {
                if (response.status === 200) {
                    let json1 = JSON.parse(JSON.stringify(note));
                    setParams(json1);
                }
            }).catch((err) => {
                showMessage(err, 'error')
            })
        }
        setAddContactModal(true);
    };

    const deleteNote = () => {
        axios.delete(`http://localhost:7060/api/scenario/${deletedNote.scenarioId}`).then((res) => {
            if (res.status === 200) {
                fetchScenarios();
                showMessage('Scenario has been deleted successfully.');
                setIsDeleteNoteModal(false);
            }
        })
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

    useEffect(() => {
        searchNotes();
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [selectedTab]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div>
            <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
                <div className={`bg-black/60 z-10 w-full h-full rounded-md absolute hidden ${isShowNoteMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}></div>
                <div
                    className={`panel
                    p-4
                    flex-none
                    w-[240px]
                    absolute
                    xl:relative
                    z-10
                    space-y-4
                    h-full
                    xl:h-auto
                    hidden
                    xl:block
                    ltr:lg:rounded-r-md ltr:rounded-r-none
                    rtl:lg:rounded-l-md rtl:rounded-l-none
                    overflow-hidden ${isShowNoteMenu ? '!block h-full ltr:left-0 rtl:right-0' : 'hidden shadow'}`}
                >
                    <div className="flex flex-col h-full pb-16">
                        <div className="flex text-center items-center">
                            <div className="shrink-0">
                                <IconNotes />
                            </div>
                            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Scenarios</h3>
                        </div>

                        <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b] my-4"></div>
                        <PerfectScrollbar className="relative ltr:pr-3.5 rtl:pl-3.5 ltr:-mr-3.5 rtl:-ml-3.5 h-full grow">
                            <div className="space-y-1">
                                {testCases &&
                                    testCases.map((test: any) => (
                                        <button
                                            key={test?.testCaseId}
                                            type="button"
                                            className={`w-full flex items-center h-10 p-1 hover:bg-white-dark/10 rounded-md dark:hover:bg-[#181F32] font-medium text-success ltr:hover:pl-3 rtl:hover:pr-3 duration-300 ${selectedTab === test.testCaseeId && 'ltr:pl-3 rtl:pr-3 bg-gray-100 dark:bg-[#181F32]'
                                                }`}
                                            onClick={() => {
                                                tabChanged(test.testCaseId);
                                                setSelectedTab(test.testCaseId);
                                            }}
                                        >
                                            <IconSquareRotated className="fill-success shrink-0" />
                                            <div className="ltr:ml-3 rtl:mr-3">{test.testCaseName}</div>
                                        </button>
                                    ))}
                            </div>

                        </PerfectScrollbar>
                    </div>
                    <div className="ltr:left-0 rtl:right-0 absolute bottom-0 p-4 w-full">
                        <button className="btn btn-primary w-full" type="button" onClick={() => editNote()}>
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0" />
                            Add New Scenario
                        </button>
                    </div>
                </div>
                <div className="panel flex-1 overflow-auto h-full">
                    <div className="pb-5">
                        <button type="button" className="xl:hidden hover:text-primary" onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}>
                            <IconMenu />
                        </button>
                    </div>
                    {filterdNotesList.length > 0 ? (
                        <div className="sm:min-h-[300px] min-h-[400px]">
                            <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                                {filterdNotesList.map((note: any) => {
                                    return (
                                        <div
                                            className={`panel pb-12 bg-success-light shadow-success`}
                                            key={note.scenarioId}
                                        >
                                            <div className="min-h-[142px]">
                                                <div className="flex justify-between">
                                                    <div className="flex items-center w-max">

                                                        <div className="ltr:ml-2 rtl:mr-2">
                                                            <div className="font-semibold">{note.commande}</div>
                                                            <div className="text-sx text-white-dark">{note.path}</div>
                                                        </div>
                                                    </div>
                                                    <div className="dropdown">
                                                        <Dropdown
                                                            offset={[0, 5]}
                                                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                            btnClassName="text-primary"
                                                            button={<IconHorizontalDots className="rotate-90 opacity-70 hover:opacity-100" />}
                                                        >
                                                            <ul className="text-sm font-medium">
                                                                <li>
                                                                    <button type="button" onClick={() => handleEditNote(note)}>
                                                                        <IconPencil className="w-4 h-4 ltr:mr-3 rtl:ml-3 shrink-0" />
                                                                        Edit
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" onClick={() => deleteNoteConfirm(note)}>
                                                                        <IconTrashLines className="w-4.5 h-4.5 ltr:mr-3 rtl:ml-3 shrink-0" />
                                                                        Delete
                                                                    </button>
                                                                </li>

                                                            </ul>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-white-dark mt-2">{note.value}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white-dark mt-2">{note.url}</p>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center sm:min-h-[300px] min-h-[400px] font-semibold text-lg h-full">No data available</div>
                    )}

                    <Transition appear show={addContactModal} as={Fragment}>
                        <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
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
                                                onClick={() => setAddContactModal(false)}
                                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                            >
                                                <IconX />
                                            </button>
                                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                                {params.scenarioId ? 'Edit Scenario' : 'Add Scenario'}
                                            </div>
                                            <div className="p-5">
                                                <form>
                                                    <div className="mb-5">
                                                        <label htmlFor="testCaseId">Test Case</label>
                                                        <select id="testCaseId" className="form-select" value={params.testCaseId} onChange={(e) => changeValue(e)}>
                                                            <option value="">Select Test Case</option>
                                                            {testCases?.map((test: any) => <option key={test.testCaseId} value={test.testCaseId}>{test.testCaseName}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="commande">Commande</label>
                                                        <input id="commande" type="text" placeholder="Enter Commande" className="form-input" value={params.commande} onChange={(e) => changeValue(e)} />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="value">Value</label>
                                                        <input id="value" type="text" placeholder="Enter Value" className="form-input" value={params.value} onChange={(e) => changeValue(e)} />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="path">Path</label>
                                                        <input id="path" type="text" placeholder="Enter Path" className="form-input" value={params.path} onChange={(e) => changeValue(e)} />
                                                    </div>

                                                    <div className="mb-5">
                                                        <label htmlFor="tagValue">Tag Value</label>
                                                        <input id="tagValue" type="text" placeholder="Enter Tag Value" className="form-input" value={params.tagValue} onChange={(e) => changeValue(e)} />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="testCaseId">Type Value</label>
                                                        <select id="idTypeValue" className="form-select" value={params.idTypeValue} onChange={(e) => changeValue(e)}>
                                                            <option value="">Select Type Value</option>
                                                            <option value="1">Id</option>
                                                            <option value="2">Name</option>
                                                            <option value="3">ClassName</option>
                                                            <option value="4">CssSelector</option>
                                                            <option value="5">XPath</option>
                                                            <option value="6">TagName</option>
                                                            <option value="7">PartialLinkText</option>
                                                            <option value="8">LinkTexy</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex justify-end items-center mt-8">
                                                        <button type="button" className="btn btn-outline-danger gap-2" onClick={() => setAddContactModal(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveNote}>
                                                            {params.scenarioId ? 'Update Note' : 'Add Note'}
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

                    <Transition appear show={isDeleteNoteModal} as={Fragment}>
                        <Dialog as="div" open={isDeleteNoteModal} onClose={() => setIsDeleteNoteModal(false)} className="relative z-[51]">
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
                                                onClick={() => setIsDeleteNoteModal(false)}
                                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                            >
                                                <IconX />
                                            </button>
                                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Delete Notes</div>
                                            <div className="p-5 text-center">
                                                <div className="text-white bg-danger ring-4 ring-danger/30 p-4 rounded-full w-fit mx-auto">
                                                    <IconTrashLines className="w-7 h-7 mx-auto" />
                                                </div>
                                                <div className="sm:w-3/4 mx-auto mt-5">Are you sure you want to delete Scenario?</div>

                                                <div className="flex justify-center items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setIsDeleteNoteModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={deleteNote}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    <Transition appear show={isViewNoteModal} as={Fragment}>
                        <Dialog as="div" open={isViewNoteModal} onClose={() => setIsViewNoteModal(false)} className="relative z-[51]">
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
                                                onClick={() => setIsViewNoteModal(false)}
                                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                            >
                                                <IconX />
                                            </button>
                                            <div className="flex items-center flex-wrap gap-2 text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                                <div className="ltr:mr-3 rtl:ml-3">{params.title}</div>
                                                {params.tag && (
                                                    <button
                                                        type="button"
                                                        className={`badge badge-outline-primary rounded-3xl capitalize ltr:mr-3 rtl:ml-3 ${(params.tag === 'personal' && 'shadow-primary',
                                                            params.tag === 'work' && 'shadow-warning',
                                                            params.tag === 'social' && 'shadow-info',
                                                            params.tag === 'important' && 'shadow-danger')
                                                            }`}
                                                    >
                                                        {params.tag}
                                                    </button>
                                                )}
                                                {params.isFav && (
                                                    <button type="button" className="text-warning">
                                                        <IconStar className="fill-warning" />
                                                    </button>
                                                )}
                                            </div>

                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>
        </div>
    );
};

export default Notes;
