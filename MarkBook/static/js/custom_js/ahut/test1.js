//AP设备分布 饼图
let pieApCount = echarts.init(document.getElementById('pie_ap_count'));
//上下行总流量 饼图
let pieSteamCount = echarts.init(document.getElementById('pie_steam_count'));
//TOP 10数据 柱状图 默认上行流量排行TOP 10
let barGraphView = echarts.init(document.getElementById('bar_graph_view'));

//AP是实时图和历史图
let lineApRealTime1 = echarts.init(document.getElementById('line_ap_real_time_1'))
let lineApRealTime2 = echarts.init(document.getElementById('line_ap_real_time_2'))
let lineApRealTime3 = echarts.init(document.getElementById('line_ap_real_time_3'))

let textApRealTime1 = document.getElementById('title_ap_real_time_1')
let textApRealTime2 = document.getElementById('title_ap_real_time_2')
let textApRealTime3 = document.getElementById('title_ap_real_time_3')

let buttonApRealTime1 = document.getElementById('button_real_time_1')
let buttonApRealTime2 = document.getElementById('button_real_time_2')
let buttonApRealTime3 = document.getElementById('button_real_time_3')

let buttonApHistory1 = document.getElementById('button_history_1')
let buttonApHistory2 = document.getElementById('button_history_2')
let buttonApHistory3 = document.getElementById('button_history_3')

//AP设备总数量
let textAPTotalCount = document.getElementById("ap_total_count");
let textUpStream = document.getElementById("up_stream");
let textDownStream = document.getElementById("down_stream");


let hostName = '/ahut';

//查询离线AP天数TOP 10
function requestOfflineAPTop10() {
    var hostName='http://charts.yanlight.com'
    $.get(hostName + '/charts/offLineApTop10', function (result) {
        if (result.code === 10000) {
            initAPOfflineTop10Data(result)
        }
    })
}

//获取AP总数和在线离线数量  十分钟刷新一次
function requestApCount() {
    $.get(hostName + '/charts/APCountData', function (result) {
        if (result.code = 10000) {
            initApCountData(result);
            initTotalStreamData(result)
        }
    })
}

//获取AP实时数据   十分钟刷新一次
function requestApRealTimeData() {
    $.get(hostName + '/charts/APRealTimeData', function (result) {
        if (result.code = 10000) {
            initAPRealTimeData(result)
        }
    })
}


// 选择日期显示当天的曲线图
$('.select_date').on('change', function () {
    var role = $(this).data('role').toString(),
        time = $(this).val();
    $(this).addClass('active');
    $.get(hostName + '/charts/APHistoryData/' + time, function (result) {
        console.log(result);
        if (result.code === 10000) {
            let data_struct = result.result.data_struct
            let dataList = result.result.data
            dataList.reverse();

            let structure = ''
            let data = []
            let times = []
            let up_list = [],
                down_list = [];
            switch(role)
            {
                case '1':
                    structure = '历史在线AP数量';
                    for (let i = 0; i < dataList.length; i++) {
                        let tempData = dataList[i]
                        data[i] = tempData.ZXAPSL
                        times[i] = tempData.JLSJ
                    }
                    break;

                case '2':
                    structure = '历史离线AP数量';
                    for (let i = 0; i < dataList.length; i++) {
                        let tempData = dataList[i]
                        data[i] = tempData.LXAPSL
                        times[i] = tempData.JLSJ
                    };
                    break;

                case '3':
                    structure = '历史在线终端数量';
                    for (let i = 0; i < dataList.length; i++) {
                        let tempData = dataList[i]
                        data[i] = tempData.ZXZDSL
                        times[i] = tempData.JLSJ
                    };
                    break;
                case '4':
                    structure = '历史无线AC上下行流量'

                    for (let i = 0; i < dataList.length; i++) {
                        let tempData = dataList[i]
                        up_list[i] = tempData.ACDQSXLL
                        down_list[i] = tempData.ACDQXXLL
                        times[i] = tempData.JLSJ
                    };
            }
            if(role !== '4'){
                textTitleList[parseInt(role) - 1].innerText = structure
                buttonRealTimeList[parseInt(role) - 1].className = 'button primary'
                buttonHistoryList[parseInt(role) - 1].className = 'button'
                lineApInfoList[parseInt(role) - 1].clear()
                lineApInfoList[parseInt(role) - 1].setOption(setUpAPRealTimeCharts(structure, data, times, true, true))
                apHistoryStatus[parseInt(role) - 1] = true
                apRealTimeStatus[parseInt(role) - 1] = false
            }else{
                let structureList = ['无线AC上行流量', '无线AC下行流量']
                let seriesList = [
                    {
                        //name: data.result.data_struct.SXZLL,
                        name:structureList[0],
                        type: 'line',
                        smooth: true,
                        // areaStyle: {},
                        data: up_list
                    },
                    {
                        //name: data.result.data_struct.XXZLL,
                        name: structureList[1],
                        type: 'line',
                        smooth: true,
                        // areaStyle: {},
                        data: down_list
                    },
                ]
                let lineOption = {

                    // title: {
                    //     text: structure
                    // },

                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: structureList
                    },

                    color: [
                        '#5ac103',
                        '#9f8cfe',
                        '#0f8edd',
                        '#ffce63'],

                    axisLabel: {
                        interval: 4,
                    },
                    grid: {
                        left: '2%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: times
                    },
                    yAxis: {
                        type: 'value'
                    },

                    series: seriesList
                };
                lineApRealTime4.clear()
                lineApRealTime4.setOption(lineOption)
            }
            // initAPHistoryData(result)
        }
    })
})



//上行流量TOP 10
function requestUpStreamTop10() {
    // debugger;
    $.get(hostName + '/charts/upTop10', function (result) {
        // console.log(result, '###');
        if (result.code === 10000) {
            // initTotalStreamData(result)
            initStreamTop10(result, true)
        }
    })
}

//下行流量TOP 10
function requestDownStreamTop10() {
    $.get(hostName + '/charts/downTop10', function (result) {
        if (result.code === 10000) {
            initStreamTop10(result, false)
        }
    })
}

//根据地点查询AP数量
function requestAPGroupByAddress() {
    // var hostName='http://charts.yanlight.com'
    $.get(hostName + '/charts/apAddressCount', function (result) {
        if (result.code === 10000) {
            initApAddressData(result)
        }
    })
}

//按条件筛选AP的终端数量Top 10
//type : 1->设备地点 2->AP型号
function requestAPTerminalTop10(type, param, time) {
    let url
    // var hostName='http://charts.yanlight.com'
    switch (type) {
        case 1:
            url = hostName + '/charts/apAddressInfo?address=' + param + "&time=" + time
            break
        case 2:
            url = hostName + '/charts/apAddressInfo?equipment=' + param + "&time=" + time
            break
    }
    $.get(url, function (result) {
        if (result.code === 10000) {
            initAPTerminalTopData(type, result, param)
        }
    })
}


//查询近10天的流量波动情况
function requestStreamDetailNear10(number) {
    var hostName='/ahut';
    if (number ===0) {
        $.get(hostName + '/charts/totalNear10', function (result) {
            console.log(result, 'Near10')
            if (result.code === 10000) {
                // alert(111)
                initStreamNear10Data(result, true)
            }
        })
    } else {
        $.get(hostName + '/charts/userNear10?number=' + number, function (result) {
            if (result.code === 10000) {
                initStreamNear10Data(result, false)
            }
        })
    }
}

//查询不同型号AP数量
function requestAPGroupByModel() {
    $.get(hostName + '/charts/apEquipment', function (result) {
        console.log(result, 'equip');
        if (result.code === 10000) {
            initApEquipmentData(result)
        }
    })
}


let apRealTimeList = []
let apHistoryList = []

let apRealTimeStatus = []
let apHistoryStatus = []

function buttonApStatusClick(isRealTime, param) {

    if (isRealTime) {

        if (apRealTimeStatus[param - 1]) {
            return
        }

        let title = "实时" + apRealTimeList[0][param - 1]

        if(param === 4){
            title = title + '(MB)'
        }
        let timeList = apRealTimeList[apRealTimeList.length - 1]
        if(param !== 4){
            let dataList = apRealTimeList[param];

            textTitleList[param - 1].innerText = title
            buttonRealTimeList[param - 1].className = 'button primary'
            // buttonHistoryList[param - 1].className = 'button'

            lineApInfoList[param - 1].clear()
            lineApInfoList[param - 1].setOption(setUpAPRealTimeCharts(title, dataList, timeList, false, true))
            apRealTimeStatus[param - 1] = true
            apHistoryStatus[param - 1] = false
        }else{
            let up_list = apRealTimeList[4],
                down_list = apRealTimeList[5],
                structureList = ['无线AC上行流量', '无线AC下行流量'];
                let seriesList = [
                    {
                        //name: data.result.data_struct.SXZLL,
                        name:structureList[0],
                        type: 'line',
                        smooth: true,
                        // areaStyle: {},
                        data: up_list
                    },
                    {
                        //name: data.result.data_struct.XXZLL,
                        name: structureList[1],
                        type: 'line',
                        smooth: true,
                        // areaStyle: {},
                        data: down_list
                    },
                ]
                let lineOption = {

                    // title: {
                    //     text: title
                    // },

                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: structureList
                    },

                    color: [
                        '#5ac103',
                        '#9f8cfe',
                        '#0f8edd',
                        '#ffce63'],

                    axisLabel: {
                        interval: 4,
                    },
                    grid: {
                        left: '2%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: timeList
                    },
                    yAxis: {
                        type: 'value'
                    },

                    series: seriesList
                };
                lineApRealTime4.clear()
                lineApRealTime4.setOption(lineOption)
        }


    }
}


function initAPHistoryData(result) {

    let structure = result.result.data_struct
    let dataList = result.result.data

    dataList.reverse()

    let onlineApList = []
    let offlineApList = []
    let apEquipmentCountList = []
    let upStreamList = []
    let downStreamList = []
    let timeList = []
    let structureList = [structure.ZXAPSL, structure.LXAPSL, structure.ZXZDSL, structure.ACDQSXLL, structure.ACDQXXLL]

    for (let i = 0; i < dataList.length; i++) {
        let tempData = dataList[i]

        onlineApList[i] = parseInt(tempData.ZXAPSL);
        offlineApList[i] = parseInt(tempData.LXAPSL)
        apEquipmentCountList[i] = parseInt(tempData.ZXZDSL)
        upStreamList[i] = parseInt(tempData.ACDQSXLL)
        downStreamList[i] = parseInt(tempData.ACDQXXLL)
        timeList[i] = tempData.RQ
    }

    apHistoryList.push(
        structureList,
        onlineApList,
        offlineApList,
        apEquipmentCountList,
        upStreamList,
        downStreamList,
        timeList
    )
}

function initAPRealTimeData(result) {

    let structure = result.result.data_struct
    let dataList = result.result.data

    dataList.reverse()

    let onlineApList = []
    let offlineApList = []
    let apEquipmentCountList = []
    let upStreamList = []
    let downStreamList = []
    let timeList = []
    let structureList = ['在线AP数量', '离线AP数量', '在线终端数量', '在线AC上下行流量']

    for (let i = 0; i < dataList.length; i++) {
        let tempData = dataList[i]

        onlineApList[i] = tempData.ZXAPSL
        offlineApList[i] = tempData.LXAPSL
        apEquipmentCountList[i] = tempData.ZXZDSL
        upStreamList[i] = tempData.ACDQSXLL
        downStreamList[i] = tempData.ACDQXXLL
        timeList[i] = tempData.JLSJ
    }

    apRealTimeList.push(
        structureList,
        onlineApList,
        offlineApList,
        apEquipmentCountList,
        upStreamList,
        downStreamList,
        timeList
    )

    buttonApStatusClick(true, 1)
    buttonApStatusClick(true, 2)
    buttonApStatusClick(true, 3)
    buttonApStatusClick(true, 4)
    // buttonApStatusClick(true, 5)

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
function setUpAPRealTimeCharts(structure, data, timeList, isHistory, autoMinY) {

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
            if (item === 0) {
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
        },

        series: seriesList
    };

    return lineOption
}


function initAPOfflineTop10Data(result) {

    let data = result.result.data
    let categoryList = []
    let dataList = []
    let showData = []

    for (let i = 0; i < data.length; i++) {
        let item = data[i]

        categoryList[i] = item.APNAME
        dataList[i] = item.APNAME__count

        showData[i] = {value: item.APNAME__count, name: item.APNAME}
    }

    let title = "AP离线天数TOP 10"

    let optionApOffline = {

        title: {
            text: title
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '12%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: categoryList
        },
        series: [
            {
                name: '离线天数',
                type: 'bar',
                data: dataList,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                            offset: 0,
                            color: "#f38832" // 0% 处的颜色
                        }, {
                            offset: 0.6,
                            color: "#f3833a" // 60% 处的颜色
                        }, {
                            offset: 1,
                            color: '#f3773e' // 100% 处的颜色
                        }], false)
                    }
                }
            },
        ]
    };
    lineAPOfflineTop.clear()
    lineAPOfflineTop.setOption(optionApOffline)

}


function initAPTerminalTopData(type, result, address) {

    let addressInfoData = result.result.data
    let categoryList = []
    let dataList = []

    let structure = result.result.data_struct  //structure


    addressInfoData.reverse()
    for (let i = 0; i < addressInfoData.length; i++) {
        let item = addressInfoData[i]
        categoryList[i] = item.APNAME
        dataList[i] = item.ZDSL_COUNT  //item.ZDSL
    }

    let title
    switch (type) {
        case 1:
            title = address + " AP终端数量TOP 10"
            break;
        case 2:
            title = address + "终端数量TOP 10"
            break;
    }

    let optionAddressInfo = {

        title: {
            text: title
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '3%',
            right: '3%',
            bottom: '0%',
            top: '13%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: categoryList
        },
        series: [
            {
                name: structure.ZDSL_COUNT, //ZDSL
                type: 'bar',
                data: dataList,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                            offset: 0,
                            color: "#51bdff" // 0% 处的颜色
                        }, {
                            offset: 0.6,
                            color: "#3ca7df" // 60% 处的颜色
                        }, {
                            offset: 1,
                            color: '#0f8edd' // 100% 处的颜色
                        }], false)
                    }
                }
            },
        ]
    };
    lineAPTerminalTop.clear()
    lineAPTerminalTop.setOption(optionAddressInfo)
}


//初始化上下行流量TOP 10
function initStreamTop10(result, isUp) {
    barGraphView.clear()
    barGraphView.setOption(getOptions(result.result, isUp), true)
    barGraphView.on('click', function (param) {
        requestStreamDetailNear10(param.name)
    });
}


//楼宇AP设备饼图
function initApAddressData(result) {
    console.log(result, 'Ap地址饼图')
    let addressData = result.result.data

    let legendData = []
    let dataList = []
    let showData = []
    let time = result.result.time


    requestAPTerminalTop10(1, addressData[addressData.length - 1].SBDD, time)

    addressData.sort(function (a, b) {
        return a.SBDD__count - b.SBDD__count
    })

    for (let i = 0; i < addressData.length; i++) {
        let item = addressData[i]
        legendData[i] = item.SBDD
        dataList[i] = item.SBDD__count

        showData[i] = {value: item.SBDD__count, name: item.SBDD}
    }

    let optionAddressPie = {

        title: {
            text: '各楼宇AP分布'
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            right: 20,
            y: 'center',
            data: legendData
        },

        color: [
            '#5ac103',
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
        ],

        series: [

            {
                name: 'AP信息',
                type: 'pie',
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },

                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    }
                },
                lableLine: {
                    normal: {
                        show: false
                    },
                },
                radius: ['55%', '70%'],
                center: ['40%', '50%'],
                data: showData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }],

    }
    pieAPAddressCount.clear()
    pieAPAddressCount.setOption(optionAddressPie)
    pieAPAddressCount.on('click', function (param) {
        requestAPTerminalTop10(1, param.name, time)
    });
}

function initApEquipmentData(result) {

    let showData = [];
    let legendData = [];
    let time = result.result.time;


    let data = result.result.data;

    let structure = result.result.data_struct;

    data.sort(function (a, b) {
        return b.APXH__count - a.APXH__count
    });

    for (let i = 0; i < data.length; i++) {
        let tempData = data[i];

        let name = tempData.APXH;
        let count = tempData.APXH__count;
        console.log(tempData.APXH__count)

        if (name != null && count !== 0) {
            legendData[i] = name;
            showData[i] = {value: count, name: name}
        }
    }


    let equipmentOption = {
        title: {
            text: structure.APXH + '分布'
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: legendData
        },

        // color: [
        //     '#5ac103',
        //     '#51bdff',
        //     '#0f8edd',
        //     '#ffce63',
        //     '#9f8cfe',
        // ],
        color: [
            '#5ac103',
            '#f38832',
            '#ccc',
            '#3ca7df',
            '#9f8cfe',
        ],

        series: [

            {
                name: structure.APXH,
                type: 'pie',
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                lableLine: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                radius: ['40%', '60%'],
                center: ['50%', '50%'],
                data: showData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],

    };
    pieAPEquipment.clear()
    pieAPEquipment.setOption(equipmentOption)
    pieAPEquipment.on('click', function (param) {
        requestAPTerminalTop10(2, param.name, time)
    });
}


//设置流量折线图 isTotal是否为总流量波动
function initStreamNear10Data(data, isTotal) {

    currentLineChartIsTotal = isTotal

    lineChartView.clear()

    let structure = data.result.data_struct

    let timeList = []

    let SXZLL = []
    let XXZLL = []


    let YHSXLL = []
    let YHXXLL = []

    // let SXPJLL = []
    // let XXPJLL = []

    let XH = null

    let dataList = data.result.data

    dataList.reverse()

    for (let i = 0; i < dataList.length; i++) {
        let tempData = data.result.data[i]
        timeList[i] = tempData.RQ.split(" ")[0]

        if (isTotal) {
            SXZLL[i] = tempData.SXZLL
            XXZLL[i] = tempData.XXZLL
        } else {
            YHSXLL[i] = tempData.YHSXLL
            YHXXLL[i] = tempData.YHXXLL

        }

        if (XH == null) {
            XH = tempData.XH
        }

    }

    let title
    let seriesList
    let structureList


    if (isTotal) {
        title = "上下行总流量曲线"
        //structureList = [data.result.data_struct.SXZLL, data.result.data_struct.XXZLL]
        structureList = ['上行总流量', '下行总流量'];
        seriesList = [
            {
                //name: data.result.data_struct.SXZLL,
                name:structureList[0],
                type: 'line',
                smooth: true,
                // areaStyle: {},
                data: SXZLL
            },
            {
                //name: data.result.data_struct.XXZLL,
                name: structureList[1],
                type: 'line',
                smooth: true,
                // areaStyle: {},
                data: XXZLL
            },
        ]
    } else {
        title = XH + ' 流量曲线'
        //structureList = [structure.YHSXLL, structure.YHXXLL, structure.SXPJLL, structure.XXPJLL]
        structureList = ['用户上行流量', '用户下行流量']
        seriesList = [
            {
                name: structureList[0],
                type: 'line',
                smooth: true,
                // areaStyle: {},
                data: YHSXLL
            },
            {
                name: structureList[1],
                type: 'line',
                smooth: true,
                // areaStyle: {},
                data: YHXXLL
            },
            // {
            //     name: structureList[2],
            //     type: 'line',
            //     smooth: true,
            //     areaStyle: {},
            //     data: SXPJLL
            // },
            // {
            //     name: structureList[3],
            //     type: 'line',
            //     smooth: true,
            //     areaStyle: {},
            //     data: XXPJLL
            // },
        ]
    }


    let lineOption = {

        title: {
            text: title
        },

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: structureList
        },

        color: [
            '#5ac103',
            '#9f8cfe',
            '#0f8edd',
            '#ffce63'],

        axisLabel: {
            interval: 4,
        },
        grid: {
            left: '2%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timeList
        },
        yAxis: {
            type: 'value'
        },

        series: seriesList
    };
    lineChartView.clear()
    lineChartView.setOption(lineOption)
}


//初始化上下行总流量数据
function initTotalStreamData(result) {
    console.log(result, '上下行流量饼图')
    let upStream = result.result.data[0].ACDQSXLL
    let downStream = result.result.data[0].ACDQXXLL
    textUpStream.innerText = upStream + "(MB)"
    textDownStream.innerText = downStream + "(MB)"

    let showData = [{value: upStream, name: '上行总流量'}, {value: downStream, name: '下行总流量'}]
    let legendData = ['上行总流量', '下行总流量']

    let streamOption = {

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            right: 10,
            y: 'center',
            data: legendData
        },

        //color: ['#0f8edd', '#FFCE63',],
        color: ['#f38832', '#5ac103'],

        series: [
            {
                name: "流量统计",
                type: 'pie',
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                    }
                },
                lableLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                radius: ['50%', '70%'],
                center: ['60%', '50%'],
                data: showData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
    };
    pieSteamCount.clear()
    pieSteamCount.setOption(streamOption)
    pieSteamCount.on('click', function (param) {
        if (!currentLineChartIsTotal) {
            requestStreamDetailNear10(0)
        }

        switch (param.name) {
            case legendData[0]:
                requestUpStreamTop10()
                break;
            case legendData[1]:
                requestDownStreamTop10()
                break;
        }
    });
}

//设置AP数据
function initApCountData(result) {
    let tempData = result.result.data[0]
    let online = tempData.ZXAPSL
    let offline = tempData.LXAPSL

    // for(var i=0; i<result.result.data.length; i++){
    //     let totalCount = parseInt(tempData.APZSL);
    //     if(totalCount!=NaN){
    //         break;
    //     }
    // }
    let totalCount = parseInt(tempData.ZXAPSL) + parseInt(tempData.LXAPSL) ;


    textAPTotalCount.innerText = totalCount

    let showData = [{value: online, name: '在线AP'}, {value: offline, name: '离线AP'}]
    let legendData = ['在线AP', '离线AP']

    let equipmentStatusOption = {

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            right: 20,
            y: 'center',
            data: legendData
        },
        //color: ['#4076e2', 'red',],
        color: ['#3ca7df', '#ccc'],


        series: [

            {
                name: "AP状态",
                type: 'pie',
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                    }
                },
                lableLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                radius: ['50%', '70%'],
                center: ['60%', '50%'],
                data: showData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
    };
    pieApCount.clear()
    pieApCount.setOption(equipmentStatusOption)
}

function getOptions(result, isUp) {
    let categoryList = []
    let dataList = []

    let data = result.data

    for (let i = 0; i < data.length; i++) {

        let item = data[i]

        categoryList[i] = item.XH
        if (isUp) {
            dataList[i] = item.YHSXLL
        } else {
            dataList[i] = item.YHXXLL
        }
    }

    dataList.reverse()
    categoryList.reverse()

    let title, desc
    if (isUp) {
        title = ""
        desc = "上行流量"
    } else {
        title = ""
        desc = "下行流量"
    }

    let optionUp = {

        title: {
            text: title
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        color: ['#0f8edd', '#3ca7df', '#51bdff'],

        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: categoryList
        },
        series: [
            {
                name: desc,
                type: 'bar',
                data: dataList,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                            offset: 0,
                            color: "#51bdff" // 0% 处的颜色
                        }, {
                            offset: 0.6,
                            color: "#3ca7df" // 60% 处的颜色
                        }, {
                            offset: 1,
                            color: '#0f8edd' // 100% 处的颜色
                        }], false)
                    }
                }
            },
        ]
    };
    return optionUp
}


var change_up_or_down_stream = function (flag) {
    if(flag===1){
        requestUpStreamTop10();
        $('#user_stream_top_his').removeClass('primary');
        $('#user_stream_top_now').addClass('primary');
    }else{
        requestDownStreamTop10()
        $('#user_stream_top_now').removeClass('primary');
        $('#user_stream_top_his').addClass('primary');
    }
}