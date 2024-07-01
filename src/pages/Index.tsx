import axios from 'axios';
import { DataTable } from 'mantine-datatable';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import IconCreditCard from '../components/Icon/IconCreditCard';
import IconDollarSign from '../components/Icon/IconDollarSign';
import IconEdit from '../components/Icon/IconEdit';
import IconHorizontalDots from '../components/Icon/IconHorizontalDots';
import IconInbox from '../components/Icon/IconInbox';
import IconShoppingCart from '../components/Icon/IconShoppingCart';
import IconTag from '../components/Icon/IconTag';
import IconTrashLines from '../components/Icon/IconTrashLines';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
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
    const [loading] = useState(false);
    const [tasks, setTasks] = useState([])
    const navigate = useNavigate();
    //Revenue Chart

    //Daily Sales
    const dailySales: any = {
        series: [
            {
                name: 'Sales',
                data: [44, 55, 41, 67, 22, 43, 21],
            },
            {
                name: 'Last Week',
                data: [13, 23, 20, 8, 13, 27, 33],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
                stacked: true,
                stackType: '100%',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#e2a03f', '#e0e6ed'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                labels: {
                    show: false,
                },
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            },
            yaxis: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                },
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 10,
                    right: -20,
                    bottom: -20,
                    left: -20,
                },
            },
        },
    };

    //Total Orders
    const totalOrders: any = {
        series: [
            {
                name: 'Sales',
                data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40],
            },
        ],
        options: {
            chart: {
                height: 290,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#00ab55'] : ['#00ab55'],
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 125,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: 0.3,
                    opacityTo: 0.05,
                    stops: [100, 100],
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
            },
        },
    };

    const validateTask=(id:number)=>{
        axios.put(`http://localhost:7060/api/task/${id}`).then((response:any)=>{
            if(response.status===200){
                showMessage('Task Validated Successfully')
            }
        }).catch((err)=>{
            console.log(err)
            showMessage('Error Occured','error')
        })
    }
    const deleteTask = (id:number)=>{
        axios.delete(`http://localhost:7060/api/task/${id}`).then((response)=>{
            if(response.status===200){
                showMessage('Task Deleted Successfully')
            }
        }).catch((err)=>{
            console.error(err)
            showMessage('Error Deleting Task','error')
        })
    }
    const fetchTasks = (id:any)=>{
        axios.get(`http://localhost:7060/api/task/${id}`).then((response:any)=>{
            if(response.status===200){
                setTasks(response.data)
            }
        }).catch((err)=>{
            console.error(err)
        })
    }
    useEffect(()=>{
        const uid = localStorage.getItem('uid');
        if(uid){
            fetchTasks(uid);
        }else{
            //navigate('/login')
        }
    })
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Overview</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full sm:col-span-2 xl:col-span-1">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">
                                Daily Sales
                                <span className="block text-white-dark text-sm font-normal">Go to columns for details.</span>
                            </h5>
                            <div className="ltr:ml-auto rtl:mr-auto relative">
                                <div className="w-11 h-11 text-warning bg-[#ffeccb] dark:bg-warning dark:text-[#ffeccb] grid place-content-center rounded-full">
                                    <IconDollarSign />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={dailySales.series} options={dailySales.options} type="bar" height={160} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="panel h-full">
                        <div className="flex items-center justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Summary</h5>
                            <div className="dropdown">
                                <Dropdown
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    button={<IconHorizontalDots className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Mark as Done</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="space-y-9">
                            <div className="flex items-center">
                                <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                    <div className="bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light  rounded-full w-9 h-9 grid place-content-center">
                                        <IconInbox />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex font-semibold text-white-dark mb-2">
                                        <h6>Income</h6>
                                        <p className="ltr:ml-auto rtl:mr-auto">$92,600</p>
                                    </div>
                                    <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                        <div className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-11/12 h-full rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                    <div className="bg-success-light dark:bg-success text-success dark:text-success-light rounded-full w-9 h-9 grid place-content-center">
                                        <IconTag />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex font-semibold text-white-dark mb-2">
                                        <h6>Profit</h6>
                                        <p className="ltr:ml-auto rtl:mr-auto">$37,515</p>
                                    </div>
                                    <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                        <div className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                    <div className="bg-warning-light dark:bg-warning text-warning dark:text-warning-light rounded-full w-9 h-9 grid place-content-center">
                                        <IconCreditCard />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex font-semibold text-white-dark mb-2">
                                        <h6>Expenses</h6>
                                        <p className="ltr:ml-auto rtl:mr-auto">$55,085</p>
                                    </div>
                                    <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                        <div className="bg-gradient-to-r from-[#f09819] to-[#ff5858] w-full h-full rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full p-0">
                        <div className="flex items-center justify-between w-full p-5 absolute">
                            <div className="relative">
                                <div className="text-success dark:text-success-light bg-success-light dark:bg-success w-11 h-11 rounded-lg flex items-center justify-center">
                                    <IconShoppingCart />
                                </div>
                            </div>
                            <h5 className="font-semibold text-2xl ltr:text-right rtl:text-left dark:text-white-light">
                                3,192
                                <span className="block text-sm font-normal">Total Orders</span>
                            </h5>
                        </div>
                        <div className="bg-transparent rounded-lg overflow-hidden">
                            {/* loader */}
                            {loading ? (
                                <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                </div>
                            ) : (
                                <ReactApexChart series={totalOrders.series} options={totalOrders.options} type="area" height={290} />
                            )}
                        </div>
                    </div>
                </div>
                <div className="panel h-full w-full">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Tasks List</h5>
                    </div>
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
                            { accessor: 'id', title: 'N°', width: 80, textAlignment: 'center' },
                            { accessor: 'admin', title: 'Admin', width: 120, textAlignment: 'center' },
                            { accessor: 'taskDescription', title: 'Description', textAlignment: 'center' },
                            { accessor: 'state', title: 'State', textAlignment: 'center' },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                textAlignment: 'center',
                                render: ({ state,id }) => (
                                    <div className="flex gap-4 items-center justify-center">
                                        {state === 'Done' ? (
                                            <button
                                            type="button"
                                            className="flex hover:text-info"
                                            onClick={()=>validateTask(id)}
                                        >
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </button>) : (<button
                                            type="button"
                                            className="flex hover:text-danger"
                                            onClick={()=>deleteTask(id)}
                                        >
                                            <IconTrashLines className="w-4.5 h-4.5" />
                                        </button>)}


                                    </div>
                                ),
                            },
                        ]}
                        records={tasks}
                        highlightOnHover
                    />
                </div>

            </div>
        </div>
    );
};

export default Index;
