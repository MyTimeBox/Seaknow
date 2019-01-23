//按院系分类的各种请求类型 柱状图
let lineAccessPreferenceYX = echarts.init(document.getElementById('line_access_preference_yx'));

let lineAccessPreferenceXHTop = echarts.init(document.getElementById('line_access_preference_xh_top'));

//cpu占用率折线图
let lineFirewallCPU = echarts.init(document.getElementById('line_firewall_cpu'))

//cpu占用率折线图
let lineFirewallMemory = echarts.init(document.getElementById('line_firewall_memory'))

//cpu占用率折线图
let lineFirewallSession = echarts.init(document.getElementById('line_firewall_session'))

//防火墙实时数据仪表盘
let dashFirewallCurrent = echarts.init(document.getElementById('dash_firewall_current'))

let hostName = 'http://charts.yanlight.com'
// let hostName = 'http://127.0.0.1:8000'

requestAccessPreference('yx')
requestAccessPreference('xh')

requestFirewallRealTimeStatus(true)
requestFirewallHistoryStatus()

//每五分钟请求一次数据
// setInterval(function () {
//     requestFirewallRealTimeStatus(false)
// }, 1000 * 60 * 5)


//查询访问偏好 param：yx=按院系统计分布 xh=按学号列表访问量top 10
function requestAccessPreference(param) {
    $.get(hostName + '/charts/accessPreference?groupBy=' + param, function (result) {
        if (result.code == 0) {
            initAccessPreferenceData(result, param)
        }
    })
}

//折线图标题组
let firewallTitleList = [
    document.getElementById('title_firewall_cpu'),
    document.getElementById('title_firewall_memory'),
    document.getElementById('title_firewall_session')
]

//折线图控件组
let firewallLineChartViewList = [
    lineFirewallCPU,
    lineFirewallMemory,
    lineFirewallSession
]

//实时数据按钮组
let firewallButtonRealTimeList = [
    document.getElementById('button_firewall_cpu_real_time'),
    document.getElementById('button_firewall_memory_real_time'),
    document.getElementById('button_firewall_session_real_time'),
]

//历史数据按钮组
let firewallButtonHistoryList = [
    document.getElementById('button_firewall_cpu_history'),
    document.getElementById('button_firewall_memory_history'),
    document.getElementById('button_firewall_session_history'),
]

let firewallRealTimeList = []
let firewallHistoryList = []

let firewallRealTimeStatus = []
let firewallHistoryStatus = []
let lineMaxValueRealTime = []
let lineMaxValueHistory = []

function buttonFirewallStatusClick(isRealTime, param) {

    let position = param - 1
    if (isRealTime) {
        if (firewallRealTimeStatus[position]) {
            return
        }

        let title = firewallRealTimeList[0][position]
        let dataList = firewallRealTimeList[param]
        let timeList = firewallRealTimeList[firewallRealTimeList.length - 1]

        firewallTitleList[position].innerText = title
        firewallButtonRealTimeList[position].className = 'button primary'
        firewallButtonHistoryList[position].className = 'button'

        firewallLineChartViewList[position].clear()
        firewallLineChartViewList[position].setOption(setUpFirewallRealTimeCharts(title, dataList, timeList, false, false, lineMaxValueRealTime[position]))

        firewallRealTimeStatus[position] = true
        firewallHistoryStatus[position] = false

    } else {

        if (firewallHistoryStatus[position]) {
            return
        }

        let title = "历史" + firewallHistoryList[0][position]
        let dataList = firewallHistoryList[param]
        let timeList = firewallHistoryList[firewallHistoryList.length - 1]

        firewallTitleList[position].innerText = title
        firewallButtonHistoryList[position].className = 'button primary'
        firewallButtonRealTimeList[position].className = 'button'

        firewallLineChartViewList[position].clear()
        firewallLineChartViewList[position].setOption(setUpFirewallRealTimeCharts(title, dataList, timeList, true, false, lineMaxValueRealTime[position]))

        firewallRealTimeStatus[position] = false
        firewallHistoryStatus[position] = true
    }
}

function updateFirewallRealTimeStatus() {
    for (let position = 0; position < firewallLineChartViewList.length; position++) {

        if (!firewallRealTimeStatus[position]) {
            continue
        }

        let title = firewallRealTimeList[0][position]
        let dataList = firewallRealTimeList[position + 1]
        let timeList = firewallRealTimeList[firewallRealTimeList.length - 1]

        firewallLineChartViewList[position].setOption(setUpFirewallRealTimeCharts(title, dataList, timeList, false, false, lineMaxValueRealTime[position]))
    }

}

//请求防火墙历史信息
function requestFirewallHistoryStatus() {
    $.get(hostName + '/charts/firewallHistory', function (result) {
        if (result.code = 10000) {
            let structure = result.result.data_struct
            let dataList = result.result.data

            dataList.reverse()

            let cupUsedList = []
            let memoryUsedList = []
            let sessionUsedList = []
            let timeList = []
            let structureList = [structure.CPU_USED, structure.MEMORY_USED, structure.SESSION_USED,]

            for (let i = 0; i < dataList.length; i++) {
                let tempData = dataList[i]
                cupUsedList[i] = parseInt(tempData.CPU_USED);
                memoryUsedList[i] = parseInt(tempData.MEMORY_USED);
                sessionUsedList[i] = parseInt(tempData.SESSION_USED);

                timeList[i] = tempData.RQ
            }

            firewallHistoryList.push(
                structureList,
                cupUsedList,
                memoryUsedList,
                sessionUsedList,
                timeList
            )
        }
    });
}


//请求防火墙实时信息
function requestFirewallRealTimeStatus(isFirst) {
    $.get(hostName + '/charts/firewallStatus', function (result) {
        if (result.code = 10000) {

            let structure = result.result.data_struct
            let dataList = result.result.data

            dataList.reverse()

            testDynamicData(structure, dataList)

            let nearData = dataList[0]
            let memoryUsed = Math.round(nearData.MEMORY_USED / parseInt(nearData.MEMORY_MAX) * 100)
            let sessionUsed = Math.round(nearData.SESSIONS_USED / parseInt(nearData.SESSIONS_MAX) * 100)

            let dashData = [
                {name: '当前CUP占用率', value: nearData.CPU_USED, unit: '%', pos: ['20%', '50%'], range: [0, 100]},
                {name: '当前内存占用率', value: memoryUsed, unit: '%', pos: ['50%', '50%'], range: [0, 100]},
                {name: '当前会话占用率', value: sessionUsed, unit: '%', pos: ['80%', '50%'], range: [0, 100]},
            ]
            initFirewallCurrentDashData(nearData.SBLX, dashData)

            let cupUsedList = []
            let memoryUsedList = []
            let sessionUsedList = []
            let timeList = []
            let structureList = [structure.CPU_USED, structure.MEMORY_USED, structure.SESSIONS_USED,]

            for (let i = 0; i < dataList.length; i++) {
                let tempData = dataList[i]
                cupUsedList[i] = parseInt(tempData.CPU_USED);
                memoryUsedList[i] = parseInt(tempData.MEMORY_USED);

                sessionUsedList[i] = tempData.SESSIONS_USED;

                timeList[i] = tempData.JLSJ

                if (i == 0) {
                    lineMaxValueRealTime[0] = 100
                    lineMaxValueRealTime[1] = parseInt(nearData.MEMORY_MAX)
                    lineMaxValueRealTime[2] = parseInt(nearData.SESSIONS_MAX)
                }
            }


            firewallRealTimeList.push(
                structureList,
                cupUsedList,
                memoryUsedList,
                sessionUsedList,
                timeList
            )

            buttonFirewallStatusClick(true, 1)
            buttonFirewallStatusClick(true, 2)
            buttonFirewallStatusClick(true, 3)
        }
    })
}

function testDynamicData(structure, dataList) {
    let count = 0;

    if (dataList.length == count) {
        count = 0
    }

    setInterval(function () {

        let nearData = dataList[count]
        let memoryUsed = Math.round(nearData.MEMORY_USED / parseInt(nearData.MEMORY_MAX) * 100)
        let sessionUsed = Math.round(nearData.SESSIONS_USED / parseInt(nearData.SESSIONS_MAX) * 100)

        let dashData = [
            {name: '当前CUP占用率', value: nearData.CPU_USED, unit: '%', pos: ['20%', '50%'], range: [0, 100]},
            {name: '当前内存占用率', value: memoryUsed, unit: '%', pos: ['50%', '50%'], range: [0, 100]},
            {name: '当前会话占用率', value: sessionUsed, unit: '%', pos: ['80%', '50%'], range: [0, 100]},
        ]
        initFirewallCurrentDashData(nearData.SBLX, dashData)

        let tempData = dataList[count]

        firewallRealTimeList[1].push(parseInt(tempData.CPU_USED));
        firewallRealTimeList[2].push(parseInt(tempData.MEMORY_USED));
        firewallRealTimeList[3].push(tempData.SESSIONS_USED);
        firewallRealTimeList[4].push(tempData.JLSJ);

        updateFirewallRealTimeStatus()
        count++
    }, 5000)
}

/**
 *
 * @param structure
 * @param data Y轴刻度
 * @param timeList X轴刻度
 * @param isHistory 是否为历史数据
 * @param autoMinY 是否自动为Y轴设置最小值
 * @returns
 */
function setUpFirewallRealTimeCharts(structure, data, timeList, isHistory, autoMinY, maxNum) {

    let seriesList = [
        {
            name: structure,
            type: 'line',
            smooth: true,
            symbol: "none",
            areaStyle: {},
            data: data
        }
    ]

    let effectScatterUpData = [];
    let effectScatterDownData = [];

    for (let item in seriesList) {
        let singleSeriesData = seriesList[item].data
        for (let i = 0; i < singleSeriesData.length - 1; i++) {
            let dataPre = singleSeriesData[i]
            let dataNext = singleSeriesData[i + 1]

            //添加警告数据
            let temp = dataNext - dataPre
            if (temp > 0) {
                if (Math.abs(temp) > (dataPre * 0.3)) {
                    effectScatterUpData.push([timeList[i + 1], singleSeriesData[i + 1]])
                }
            } else {
                if (Math.abs(temp) > (dataPre * 0.3)) {
                    effectScatterDownData.push([timeList[i + 1], singleSeriesData[i + 1]])
                }
            }

        }
    }

    let minData = 0

    if (autoMinY) {
        for (let item in data) {
            if (item == 0) {
                minData = data[item]
            } else {
                if (minData > data[item]) {
                    minData = data[item]
                }
            }
        }

        if (minData > 100) {
            minData = minData - 100
        } else {
            minData = 0
        }
    }

    let effectScatterUp = {
        name: '异常上升警告',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: effectScatterUpData, //2d坐标系
        symbolSize: 8,
        showEffectOn: 'render',
        rippleEffect: {brushType: 'stroke'},
        hoverAnimation: true,
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            }
        },
        itemStyle: {
            normal: {
                color: 'red',
                shadowBlur: 5,
                shadowColor: 'red'
            }
        },
        zlevel: 1
    }

    let effectScatterDown = {
        name: '异常下降警告',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: effectScatterDownData, //2d坐标系
        symbolSize: 8,
        showEffectOn: 'render',
        rippleEffect: {brushType: 'stroke'},
        hoverAnimation: true,
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            }
        },
        itemStyle: {
            normal: {
                color: 'green',
                shadowBlur: 5,
                shadowColor: 'green'
            }
        },
        zlevel: 1
    }

    seriesList.push(effectScatterUp)
    seriesList.push(effectScatterDown)

    let color;
    if (isHistory) {
        color = [
            '#9f8cfe'
        ]
    } else {
        color = [
            '#0f8edd'
        ]
    }


    let lineOption = {

        tooltip: {
            trigger: 'axis'
        },

        color: color,

        axisLabel: {
            interval: 4,
        },

        dataZoom: [
            {
                type: 'inside',
                throttle: '50',
                minValueSpan: 4,
                start: 75,
                end: 100
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '3%',
            top: '2%',
            containLabel: true
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timeList
        },
        yAxis: {
            type: 'value',
            min: minData,
            max: maxNum
        },

        series: seriesList
    };

    return lineOption
}

function initFirewallCurrentDashData(title, dashData) {

    let highlight = '#51bdff';

    let dashOption = {
        // title: "测试",
        title: {
            show: true,
            text: "型号："+title,
            top: '10px',
        },
        series: (function () {
            let result = [];

            dashData.forEach(function (item) {
                result.push(
                    // 外围刻度
                    {
                        type: 'gauge',
                        center: item.pos,
                        radius: '70%',
                        splitNumber: item.splitNum || 10,
                        min: item.range[0],
                        max: item.range[1],
                        startAngle: 225,
                        endAngle: -405,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 2,
                                shadowBlur: 0,
                                color: [
                                    [1, highlight]
                                ]
                            }
                        },
                        axisTick: {
                            show: true,
                            lineStyle: {
                                color: highlight,
                                width: 1
                            },
                            length: -5,
                            splitNumber: 10
                        },
                        splitLine: {
                            show: true,
                            length: -14,
                            lineStyle: {
                                color: highlight,
                            }
                        },
                        axisLabel: {
                            distance: -20,
                            textStyle: {
                                color: highlight,
                                fontSize: '14',
                                fontWeight: 'bold'
                            }
                        },
                        pointer: {
                            show: 0
                        },
                        detail: {
                            show: 0
                        }
                    },

                    // 内侧指针、数值显示
                    {
                        name: item.name,
                        type: 'gauge',
                        center: item.pos,
                        radius: '67%',
                        startAngle: 225,
                        endAngle: -45,
                        min: item.range[0],
                        max: item.range[1],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 16,
                                color: [
                                    [1, 'rgba(255,255,255,.1)']
                                ]
                            }
                        },
                        axisTick: {
                            show: 0,
                        },
                        splitLine: {
                            show: 0,
                        },
                        axisLabel: {
                            show: 0
                        },
                        pointer: {
                            show: true,
                            length: '105%'
                        },
                        detail: {
                            show: true,
                            offsetCenter: [0, '100%'],
                            textStyle: {
                                fontSize: 20,
                                color: '#000'
                            },
                            formatter: [
                                '{value} ' + (item.unit || ''),
                                '{name|' + item.name + '}'
                            ].join('\n'),
                            rich: {
                                name: {
                                    fontSize: 14,
                                    lineHeight: 30,
                                    color: '#000000'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: highlight,
                            }
                        },
                        data: [{
                            value: item.value
                        }]
                    }
                );
            });

            return result;
        })()
    };

    dashFirewallCurrent.setOption(dashOption)
}


function initAccessPreferenceData(result, param) {
    let y_list = result.result.data.y_list
    let x_list = result.result.data.x_list

    let data_list = result.result.data.data_list
    let time = result.result.data.time


    //类型
    let legendData = []
    //院校
    let yAxisData = []

    for (let i = 0; i < y_list.length; i++) {
        yAxisData[i] = y_list[i].Y_ITEM
    }

    yAxisData.reverse()

    let seriesList = []

    for (let i = 0; i < x_list.length; i++) {
        let fwlx = x_list[i].FWLX
        legendData[i] = fwlx

        let itemShowData = new Array(legendData.length).fill(0)

        for (let n = 0; n < data_list.length; n++) {
            let item = data_list[n]

            let y_item = item.Y_ITEM
            let lx = item.FWLX

            if (fwlx == lx) {
                let tempIndex = yAxisData.indexOf(y_item)
                itemShowData[tempIndex] = item.TOTAL
            }
        }

        let seriesItem = {
            name: fwlx,
            type: 'bar',
            stack: 'sum',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            data: itemShowData
        }

        seriesList[i] = seriesItem
    }

    let title;
    let chartView;
    switch (param) {
        case 'yx':
            title = '各院系访问情况分布图'
            chartView = lineAccessPreferenceYX
            break;
        case 'xh':
            title = '个人访问分布TOP 10'
            chartView = lineAccessPreferenceXHTop
            break;
    }

    let accessPreferenceOption = {

        title: {
            text: title
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: [
            '#51bdff',
            '#0f8edd',
            '#0575c1',
            '#06ffdd',
            '#4f12dd',
            '#ffce63',
            '#d604ff',
            '#fe8808',
            '#9f8cfe',
            '#43adad',
            '#f46105',
            '#745af2',
            '#f5f44b',
            '#06c15b',
            '#5ac103',
        ],

        legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            right: 20,
            y: 'center',
            data: legendData
        },

        grid: {
            top: '10%',
            left: '3%',
            right: '18%',
            bottom: '3%',

            containLabel: true
        },
        xAxis: [{
            type: "value",
        }],
        yAxis: {
            type: 'category',
            data: yAxisData,
            axisTick: {
                show: !1
            },
            splitArea: {
                show: !1
            },
            splitLine: {
                show: !1
            },
        },
        series: seriesList,
        noDataLoadingOption: {
            text: "暂无数据",
            effect: "whirling"
        }
    };

    chartView.setOption(accessPreferenceOption)
}
