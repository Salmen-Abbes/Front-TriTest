import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import ReactApexChart from 'react-apexcharts';
import IconDownload from '../../../components/Icon/IconDownload';
import CodeHighlight from '../../../components/Highlight';
import IconEdit from '../../../components/Icon/IconEdit';
import IconSend from '../../../components/Icon/IconSend';
import { setPageTitle } from '../../../store/themeConfigSlice';

const Preview = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const videoId = 'w7aVy00oLEs';
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

    const items = [
        {
            id: 1,
            title: 'Calendar App Customization',
            quantity: 1,
            price: '120',
            amount: '120',
        },
        {
            id: 2,
            title: 'Chat App Customization',
            quantity: 1,
            price: '230',
            amount: '230',
        },
        {
            id: 3,
            title: 'Laravel Integration',
            quantity: 1,
            price: '405',
            amount: '405',
        },
        {
            id: 4,
            title: 'Backend UI Design',
            quantity: 1,
            price: '2500',
            amount: '2500',
        },
    ];

    const columns = [
        {
            key: 'id',
            label: 'S.NO',
        },
        {
            key: 'title',
            label: 'ITEMS',
        },
        {
            key: 'quantity',
            label: 'QTY',
        },
        {
            key: 'price',
            label: 'PRICE',
            class: 'ltr:text-right rtl:text-left',
        },
        {
            key: 'amount',
            label: 'AMOUNT',
            class: 'ltr:text-right rtl:text-left',
        },
    ];

    return (
        <div>
            <div className="flex items-center lg:justify-start justify-center flex-wrap gap-4 mb-6">
                <button className='btn btn-secondary gap-2' onClick={() => setView(true)}>
                    Video & Reports
                </button>
                <button className='btn btn-secondary gap-2' onClick={() => setView(false)}>
                    Code & Clicks
                </button>
            </div>
            {view ? (
                <div>
                    <div className="panel flex items-center  justify-center flex-wrap gap-4 mb-6">

                        <div className="mb-5">
                            <ReactApexChart series={donutChart.series} options={donutChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="donut" height={300} />
                        </div>
                        <div className="mb-5">
                            <ReactApexChart series={radialBarChart.series} options={radialBarChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="radialBar" height={300} />
                        </div>
                    </div>
                    <div className="panel mb-5">
                        <ReactApexChart series={columnChart.series} options={columnChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={300} />
                    </div>
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
                </div>) :

                (<div>
                    <div className="flex items-center lg:justify-start justify-center flex-wrap gap-4 mb-6">
                        <button type="button" className="btn btn-info gap-2">
                            <IconSend />
                            Run Test Case
                        </button>

                        <button type="button" className="btn btn-success gap-2">
                            <IconDownload />
                            Download Code
                        </button>

                        <Link to="/apps/invoice/edit" className="btn btn-warning gap-2">
                            <IconEdit />
                            Edit
                        </Link>
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
                            <pre className="language-xml">
                                {`<div className="mb-5 flex items-center justify-center">
    <div className="max-w-[19rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
        <div className="py-7 px-6">
            <div className="bg-[#3b3f5c] mb-5 inline-block p-3 text-[#f1f2f3] rounded-full">
                <svg>...</svg>
            </div>
            <h5 className="text-[#3b3f5c] text-xl font-semibold mb-4 dark:text-white-light">Simple</h5>
            <p className="text-white-dark">Mauris nisi felis, placerat in volutpat id, varius et sapien.</p>
        </div>
    </div>
</div>`}
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
                                    {items.map((item) => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.title}</td>
                                                <td>{item.quantity}</td>
                                                <td className="ltr:text-right rtl:text-left">${item.price}</td>
                                                <td className="ltr:text-right rtl:text-left">${item.amount}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>)}
        </div>
    );
};

export default Preview;
