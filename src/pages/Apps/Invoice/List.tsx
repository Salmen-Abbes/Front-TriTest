import { Dialog, Transition } from '@headlessui/react';
import { useMantineTheme } from '@mantine/core';
import axios from 'axios';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import IconEdit from '../../../components/Icon/IconEdit';
import IconPlus from '../../../components/Icon/IconPlus';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconX from '../../../components/Icon/IconX';
import { setPageTitle } from '../../../store/themeConfigSlice';

const List = () => {
    const theme = useMantineTheme();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Test Suites'));
        fetchSuites();
    }, [dispatch]);

    const [items, setItems] = useState([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'testSuiteId',
        direction: 'asc',
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentSuite, setCurrentSuite] = useState<any>({ testSuiteName: '', testSuiteDescription: '' });

    const fetchSuites = async () => {
        try {
            const response = await axios.get('http://localhost:7060/api/testsuite');
            setItems(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteRow = async (id: number) => {
            try {
                await axios.delete(`http://localhost:7060/api/testsuite/${id}`);
                setItems(items.filter((item: any) => item.testSuiteId !== id));
            } catch (err) {
                console.error(err);
            }
        
    };

    const openModal = (type: string, suite: any = null) => {
        setModalType(type);
        if (type === 'edit' && suite) {
            setCurrentSuite(suite);
        } else {
            setCurrentSuite({ testSuiteName: '', testSuiteDescription: '' });
        }
        setModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setCurrentSuite((prev: any) => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        try {
            if (modalType === 'add') {
                await axios.post('http://localhost:7060/api/testsuite', currentSuite);
            } else {
                await axios.put(`http://localhost:7060/api/testsuite/${currentSuite.testSuiteId}`, currentSuite);
            }
            fetchSuites();
            setModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Test Suites</h1>
                <button onClick={() => openModal('add')} className="btn btn-primary flex items-center">
                    <IconPlus className="mr-2" />
                    Add Test Suite
                </button>
            </div>
            <div className="card">
                <DataTable
                    sx={{
                        '& tr': {
                            backgroundColor: 'transparent',
                            color: 'rgb(136, 142, 168)',
                        },
                        '& .mantine-Datatable-pagination, & .mantine-Datatable-footer': {
                            backgroundColor: 'transparent',
                            color: 'rgb(136, 142, 168)',
                        },
                        '& .mantine-Datatable-body, & .mantine-Datatable-header': {
                            backgroundColor: 'transparent',
                            color: 'rgb(136, 142, 168)',
                        },
                    }}
                    className="bg-transparent dark:bg-transparent"
                    withBorder={false}
                    columns={[
                        { accessor: 'testSuiteId', title: 'ID', width: 80 },
                        { accessor: 'testSuiteName', title: 'Name' },
                        { accessor: 'testSuiteDescription', title: 'Description' },
                        { accessor: 'testCases', title: 'TestCases' },
                        {
                            accessor: 'actions',
                            title: 'Actions',
                            textAlignment: 'center',
                            render: ({ testSuiteId, testSuiteName, testSuiteDescription }) => (
                                <div className="flex gap-4 items-center justify-center">
                                    <button
                                        type="button"
                                        className="flex hover:text-info"
                                        onClick={() =>
                                            openModal('edit', { testSuiteId, testSuiteName, testSuiteDescription })
                                        }
                                    >
                                        <IconEdit className="w-4.5 h-4.5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex hover:text-danger"
                                        onClick={() => deleteRow(testSuiteId)}
                                    >
                                        <IconTrashLines className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    records={items}
                    highlightOnHover
                />


            </div>
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog as="div" open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-[51]">
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
                                        onClick={() => setModalOpen(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {modalType === 'edit' ? 'Edit Test Suite' : 'Add Test Suite'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="testSuiteName">Name</label>
                                                <input
                                                    id="testSuiteName"
                                                    type="text"
                                                    placeholder="Enter Test Suite Name"
                                                    className="form-input"
                                                    value={currentSuite.testSuiteName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="testSuiteDescription">Description</label>
                                                <textarea
                                                    id="testSuiteDescription"
                                                    placeholder="Enter Test Suite Description"
                                                    className="form-input"
                                                    value={currentSuite.testSuiteDescription}
                                                    onChange={handleChange}
                                                    style={{ minHeight: '100px' }}
                                                />
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setModalOpen(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                    onClick={handleSave}
                                                >
                                                    {modalType === 'edit' ? 'Update' : 'Add'}
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
        </div>
    );
};

export default List;
