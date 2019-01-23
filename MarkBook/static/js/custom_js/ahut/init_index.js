let totalBrandnow = echarts.init(document.getElementById('now_broadband_pie'))
let totalBrandday_up = echarts.init(document.getElementById('day_broadband_line_up'))
let totalBrandday_down = echarts.init(document.getElementById('day_broadband_line_down'))
let totalBrandday_total = echarts.init(document.getElementById('day_broadband_line_total'))

var lineApInfoList = [lineApRealTime1, lineApRealTime2, lineApRealTime3]
var textTitleList = [textApRealTime1, textApRealTime2, textApRealTime3]

var buttonRealTimeList = [buttonApRealTime1, buttonApRealTime2, buttonApRealTime3]
var buttonHistoryList = [buttonApHistory1, buttonApHistory2, buttonApHistory3]


//设置AP数据
function initApCountData_Index(result) {
    var tempData = result.result.data[0]
    var online = tempData.ZXAPSL
    var offline = tempData.LXAPSL
    var totalCount = parseInt(tempData.ZXAPSL) + parseInt(tempData.LXAPSL) ;

    textAPTotalCount.innerText = totalCount

    var showData = [{value: online, name: '在线AP'}, {value: offline, name: '离线AP'}]
    var legendData = ['在线AP', '离线AP']

    var equipmentStatusOption = {

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'left',
            left: 20,
            y: 'bottom',
            top:120,
            data: legendData
        },
        //color: ['#4076e2', 'red',],
        color: ['#15dc80', '#dbbeda'],


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
                radius: '80%',
                center: ['70%', '50%'],
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

var TotalStreamCount = document.getElementById('total_stream_count')
//初始化上下行总流量数据
function initTotalStreamData_Index(result) {
    console.log(result, '上下行流量饼图')
    var upStream = result.result.data[0].ACDQSXLL
    var downStream = result.result.data[0].ACDQXXLL
    textUpStream.innerText = upStream + "(MB)"
    textDownStream.innerText = downStream + "(MB)"
    var total_count = parseInt(upStream) + parseInt(downStream);
    TotalStreamCount.innerText = total_count.toString() + '(MB)';
    var showData = [{value: upStream, name: '上行总流量'}, {value: downStream, name: '下行总流量'}]
    var legendData = ['上行总流量' , '下行总流量']

    var streamOption = {

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'left',
            left: 20,
            top:125,
            y: 'bottom',
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
                radius: '80%',
                center: ['70%', '50%'],
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
}

function initAPRealTimeDataIndex(result) {
    var structure = result.result.data_struct
    var dataList = result.result.data

    dataList.reverse()

    var onlineApList = []
    var offlineApList = []
    var apEquipmentCountList = []
    var timeList = []
    var structureList = ['在线AP数量', '离线AP数量', '在线终端数量']

    for (var i = 0; i < dataList.length; i++) {
        var tempData = dataList[i]
        onlineApList[i] = tempData.ZXAPSL
        offlineApList[i] = tempData.LXAPSL
        apEquipmentCountList[i] = tempData.ZXZDSL
        timeList[i] = tempData.JLSJ
    }

    apRealTimeList.push(
        structureList,
        onlineApList,
        offlineApList,
        apEquipmentCountList,
        timeList
    )

    buttonApStatusClick(true, 1)
    // buttonApStatusClick(true, 2)
    // buttonApStatusClick(true, 3)
}

//上行流量TOP 10
function requestUpStreamTop10_index() {
    $.get(hostName + '/charts/upTop10', function (result) {
        if (result.code === 10000) {
            initStreamTop10_index(result, true)
        }
    })
}

//下行流量TOP 10
function requestDownStreamTop10_index() {
    $.get(hostName + '/charts/downTop10', function (result) {
        if (result.code === 10000) {
            initStreamTop10_index(result, false)
        }
    })
}

//初始化上下行流量TOP 10
function initStreamTop10_index(result, isUp) {
    barGraphView.clear()
    barGraphView.setOption(getOptions(result.result, isUp), true)
}


var change_up_or_down_stream_index = function (flag) {
    if(flag===1){
        requestUpStreamTop10_index();
        $('#user_stream_top_his').removeClass('primary');
        $('#user_stream_top_now').addClass('primary');
    }else{
        requestDownStreamTop10_index()
        $('#user_stream_top_now').removeClass('primary');
        $('#user_stream_top_his').addClass('primary');
    }
}

function update_brand_pie(data){
        var mobile = (parseInt(data.YDSX) + parseInt(data.YDXX)).toString().split('.')[0],
            unicom = (parseInt(data.LTSX) + parseInt(data.LTXX)).toString().split('.')[0],
            elec = (parseInt(data.DXSX) + parseInt(data.DXXX)).toString().split('.')[0],
            teach = (parseInt(data.JYWSX) + parseInt(data.JYWXX)).toString().split('.')[0],
            total = (parseInt(data.ZCKXX) + parseInt(data.ZCKSX)).toString().split('.')[0];
        $('#total_brand').html(total.toString() + '(MB)')
        var showData = [{value: mobile, name: '移动总带宽'}, {value: unicom, name: '联通总带宽'},
            {value: elec, name: '电信总带宽'}, {value: teach, name: '教育网总带宽'}]
        var legendData = ['移动总带宽', '联通总带宽', '电信总带宽', '教育网总带宽']

        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                left: 20,
                top:120,
                y:'bottom',
                data:legendData
            },
            color: [
                '#5ac103',
                '#51bdff',
                '#0f8edd',
                '#ffce63',
                '#9f8cfe',
            ],
            series: [
                {
                    name:'近五分钟带宽使用',
                    type:'pie',
                    radius: ['50%', '70%'],
                    center:['70%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:showData
            }
        ]
    };

        totalBrandnow.clear()
        totalBrandnow.setOption(option)


}

function update_brand_line(data, flag) {

    if(flag === 0){
        var up_option = getBrandOption(data, flag)
        // totalBrandday_up.clear()
        totalBrandday_up.resize()
        totalBrandday_up.setOption(up_option)
    }else if(flag === 1){
        var down_option = getBrandOption(data, flag)
        // totalBrandday_down.clear()
        totalBrandday_down.resize()
        totalBrandday_down.setOption(down_option)
    }else{
        var total_option = getBrandOption(data, flag)
        // totalBrandday_total.clear()
        totalBrandday_total.resize()
        totalBrandday_total.setOption(total_option)

    }
    IS_FIRST = false
}


function getBrandOption(data, flag) {

    var mobile = [];
    var unicom = [];
    var elec = [];
    var teach = [];
    var total = [];
    // var title;
    var timeList = [];
    var dataList = data;

    if(flag === 0 && IS_FIRST){
           dataList.reverse();
    }

    for (var j = 0; j < dataList.length; j++) {
        var tempData = dataList[j];
        timeList[j] = tempData.JLSJ;
        if (flag === 0) {
            mobile[j] = parseInt(tempData.YDSX).toString().split('.')[0];
            unicom[j] = parseInt(tempData.LTSX).toString().split('.')[0];
            elec[j] = parseInt(tempData.DXSX).toString().split('.')[0];
            teach[j] = parseInt(tempData.JYWSX).toString().split('.')[0];
            total[j] = parseInt(tempData.ZCKSX).toString().split('.')[0];
            // title = '当日宽带使用情况(上行)';
        } else if(flag === 1) {
            mobile[j] = parseInt(tempData.YDXX).toString().split('.')[0];
            unicom[j] = parseInt(tempData.LTXX).toString().split('.')[0];
            elec[j] = parseInt(tempData.DXXX).toString().split('.')[0];
            teach[j] = parseInt(tempData.JYWXX).toString().split('.')[0];
            total[j] = parseInt(tempData.ZCKXX).toString().split('.')[0];
            // title = '当日宽带使用情况(下行)';
        }else{
            mobile[j] = (parseInt(tempData.YDXX) + parseInt(tempData.YDSX)).toString().split('.')[0];
            unicom[j] = (parseInt(tempData.LTXX) + parseInt(tempData.LTSX)).toString().split('.')[0];
            elec[j] = (parseInt(tempData.DXXX) + parseInt(tempData.DXSX)).toString().split('.')[0];
            teach[j] = (parseInt(tempData.JYWXX) + parseInt(tempData.JYWSX)).toString().split('.')[0];
            total[j] = (parseInt(tempData.ZCKXX) + parseInt(tempData.ZCKSX)).toString().split('.')[0];
            // title = '当日宽带使用情况(总)';
        }
    }

    var all_data = [mobile, unicom, elec, teach, total];
    var seriesList = [];
    var structureList;

    structureList = ['移动带宽', '联通带宽', '电信带宽', '教育网带宽', '总带宽'];
    for(var k = 0; k < structureList.length; k++){
        var item = {
                name:structureList[k],
                type: 'line',
                smooth: false,
                data: all_data[k]
            };
        seriesList.push(item)
    }


    var option = {

        // title:{
        //     text: title
        // },

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            x:'center',
            y: 'bottom',
            top:10,
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
    return option
}