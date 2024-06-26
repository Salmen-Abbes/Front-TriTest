import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { Fragment, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CodeHighlight from '../../../components/Highlight';
import IconDownload from '../../../components/Icon/IconDownload';
import IconEdit from '../../../components/Icon/IconEdit';
import IconSend from '../../../components/Icon/IconSend';
import IconX from '../../../components/Icon/IconX';
import { IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';
const Preview = () => {
    const { id } = useParams();
    const [testCaseId, setTestCaseId] = useState('');
    const fetchSuites = () => {
        try {
            axios.get('http://localhost:7060/api/testsuite').then((response) => {
                setTestSuites(response.data);
            });
        } catch (err) {
            console.error(err);
        }
    };
    const fetchData = ()=>{
        axios.get(`http://localhost:7060/api/testcasedata/${id}`).then((response:any)=>{
            if(response.status===200){
                setItems(response.data.jsonFileContent.map((record:any,index:number)=>({id:index+1,...record})))
                setCode(response.data.specFlowFileContent)
            }
        }).catch((err)=>{
            console.error(err)
        })
    }
    const fetchTestCase  = (id:any)=>{
        axios.get(`http://localhost:7060/api/testcase/${id}`).then((response:any)=>{
            if(response.status===200){
                setParams(response.data)
                setView(response.data.versionTest)
            }
        }).catch((error)=>{
            console.error(error);
            alert('Failed to fetch test Case')
        })
    }
    const runTest = () => {
        try {
            const reqBody = { "testCase": testCaseId };
            axios.post('http://localhost:7060/api/testcase/execute', reqBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.status === 200) {
                    showMessage('TestCase runned Successfully');
                }
            });
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (id !== undefined) {
            setTestCaseId(id);
            fetchTestCase(id);
            fetchSuites();
            fetchData();
        }
    }, [id]);
    const defaultParams = {
        testCaseId: null,
        testCaseName: '',
        testCaseDescription: '',
        descriptionText: '',
        navigator: '',
        path: '',
        url: '',
        userId: null,
        priority: 'low',
    };
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
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
    const saveTask = () => {
        axios.put(`http://localhost:7060/api/testcase/${params.testCaseId}`, params)
        .then((response)=>{
            if(response.status===200){
                showMessage('TestCase has been updated.');
            }else{
                showMessage('Failed to update TestCase.','error');
            }
            setAddTaskModal(false);
        }).catch((err)=>{
            console.error(err)
        })
    }
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [testSuites, setTestSuites] = useState<any>([]);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const videoId = 'w7aVy00oLEs';
    const [code, setCode] = useState(`<div className="mb-5 flex items-center justify-center">
        <div className="max-w-[19rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
            <div className="py-7 px-6">
                <div className="bg-[#3b3f5c] mb-5 inline-block p-3 text-[#f1f2f3] rounded-full">
                    <svg>...</svg>
                </div>
                <h5 className="text-[#3b3f5c] text-xl font-semibold mb-4 dark:text-white-light">Simple</h5>
                <p className="text-white-dark">Mauris nisi felis, placerat in volutpat id, varius et sapien.</p>
            </div>
        </div>
    </div>`)
    const handleDownload = () => {
        const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `TestCase_${testCaseId}_code.cs`);
    };
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const donutChart: any = {
        series: [44, 55, 13],
        options: {
            chart: {
                height: 300,
                type: 'donut',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                show: false,
            },
            labels: ['Team A', 'Team B', 'Team C'],
            colors: ['#4361ee', '#805dca', '#e2a03f'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            legend: {
                position: 'bottom',
            },
        },
    };
    const radialBarChart: any = {
        series: [44, 55, 41],
        options: {
            chart: {
                height: 300,
                type: 'radialBar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee', '#805dca', '#e2a03f'],
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w: any) {
                                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                return 249;
                            },
                        },
                    },
                },
            },
            labels: ['Apples', 'Oranges', 'Bananas'],
            fill: {
                opacity: 0.85,
            },
        },
    };
    const columnChart: any = {
        series: [
            {
                name: 'Net Profit',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
            },
            {
                name: 'Revenue',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#805dca', '#e7515a'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: function (val: any) {
                        return val;
                    },
                },
            },
        },
    };
    const [view, setView] = useState(true)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Testcase Preview'));
    });
    //function to fetch data (json and code)
    
    const [items,setItems] =useState<any>([]);

    const columns = [
        {
            key: 'id',
            label: 'N°',
        },
        {
            key: 'Timestamp',
            label: 'Timestamp',
        },
        {
            key: 'ActionDescription',
            label: 'Description',
        },
        {
            key: 'XPath',
            label: 'XPath',
            class: 'ltr:text-right rtl:text-left',
        },
    ];

    return (
        <div>
            {view ? 

                (<div>
                    <div className="flex items-center lg:justify-start justify-center flex-wrap gap-4 mb-6">
                        <button type="button" className="btn btn-info gap-2" onClick={()=> runTest()}>
                            <IconSend />
                            Run Test Case
                        </button>

                        <button type="button" className="btn btn-success gap-2" onClick={() => handleDownload()}>
                            <IconDownload />
                            Download Code
                        </button>

                        <button type="button" className="btn btn-warning gap-2" onClick={()=> setAddTaskModal(!addTaskModal)}>
                            <IconEdit />
                            Edit
                        </button>

                    </div>
                    <div className="panel">
                        <div className="flex justify-between flex-wrap gap-4 px-4">
                            <div className="text-2xl font-semibold uppercase">Testcase </div>
                            <div className="shrink-0">
                                <img src="/assets/images/logo.svg" alt="img" className="w-14 ltr:ml-auto rtl:mr-auto" />
                            </div>
                        </div>
                        <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                        <div className="text-black dark:text-white font-semibold">Testcase Code</div>
                        <br />
                        <CodeHighlight>
                            <pre className="language-xml" style={{maxHeight:'300px',overflowY:'auto'}}>
                               {code}
                            </pre>
                        </CodeHighlight>
                        <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                        <div className="text-black dark:text-white font-semibold">Testcase clicks</div>
                        <div className="table-responsive mt-6">
                            <table className="table-striped">
                                <thead>
                                    <tr>
                                        {columns.map((column) => {
                                            return (
                                                <th key={column.key} className={column?.class}>
                                                    {column.label}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item:any) => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.Timestamp}</td>
                                                <td>{item.ActionDescription}</td>
                                                <td className="ltr:text-right rtl:text-left">${item.XPath}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>):(
                <div>
                    <div className="text-black dark:text-white font-semibold">Chart 1 </div>
                    <br />
                    <div className="panel flex items-center  justify-center flex-wrap gap-4 mb-6">

                        <div className="mb-5">
                            <ReactApexChart series={donutChart.series} options={donutChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="donut" height={300} />
                        </div>
                        <div className="mb-5">
                            <ReactApexChart series={radialBarChart.series} options={radialBarChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="radialBar" height={300} />
                        </div>
                    </div>
                    <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                    <div className="text-black dark:text-white font-semibold">Chart 2 </div>
                    <br />
                    <div className="panel mb-5">
                        <ReactApexChart series={columnChart.series} options={columnChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={300} />
                    </div>
                    <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                    <div className="text-black dark:text-white font-semibold">Video of Testcase</div>
                    <br />
                    <div className="panel mb-5">
                        <iframe
                            width="1110"
                            height="315"
                            src={embedUrl}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>) }
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
                                        Edit Test Case
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
                                                    Update
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

export default Preview;
