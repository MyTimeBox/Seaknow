var brand_data; // 保存宽带相关的数据，切换上下行时使用
var IS_FIRST = true; // 是否是第一次请求宽带数据

//宽带相关图
requestBrandNow();
requestBrandDay();
// 防火墙数据轮播图初始化
requestFirewallData();
//AP总数量图和上下行总流量图初始化
requestApCountIndex();
//AP数据轮播图
requestApRealTimeDataIndex();
//用户流量Top10
requestUpStreamTop10_index();

setInterval(function () {
    console.log('刷新首页');
    //宽带相关图
    requestBrandNow();
    requestBrandDay();
    // 防火墙数据轮播图
    requestFirewallData();
    //AP总数量图和上下行总流量图
    requestApCountIndex();
    //AP数据轮播图
    requestApRealTimeDataIndex();
    //用户流量Top10
    requestUpStreamTop10_index();

}, 1000*60*5);

var flag1 = '0',
    flag2 = '0',
    flag3 = '0';

// 防火墙轮播图播放时，触发buttonFirewallStatusClick事件
$('#myTab a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        flag1 = $(this).data('id')
});

$('#myTab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        flag1 = $(this).data('id')
        firewallLineChartViewList[parseInt(flag1)].resize()
        buttonFirewallStatusClick(true, parseInt(flag1)+1)
});

// 当日带宽轮播图播放
$('#myTab1 a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        flag3 = $(this).data('id')
});

$('#myTab1 a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        flag3 = $(this).data('id')
        update_brand_line(brand_data, parseInt(flag3))
});


// AP轮播图播放
$('#myTab2 a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        flag2 = $(this).data('id')
});

$('#myTab2 a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        flag2 = $(this).data('id')
        lineApInfoList[parseInt(flag2)].resize();
        buttonApStatusClick(true, parseInt(flag2) + 1)
});




//请求防火墙实时信息
function requestFirewallData() {
    var hostName = '/ahut';
    $.get(hostName + '/charts/firewallStatus', function (result) {
        if (result.code = 10000) {

            let structure = result.result.data_struct
            let dataList = result.result.data
            let nearData = dataList[0]
            dataList.reverse()

            circle_set_data(structure, dataList)

            let cupUsedList = []
            let memoryUsedList = []
            let sessionUsedList = []
            let timeList = []
            // let structureList = [structure.CPU_USED, structure.MEMORY_USED, structure.SESSIONS_USED,]
            let structureList = ['CPU使用情况(%)', '内存使用情况(%)', '会话数量']

            for (let i = 0; i < dataList.length; i++) {
                var tempData = dataList[i]
                if(tempData.SBLX === 'Juniper SRX3400') {
                    cupUsedList.push(parseInt(tempData.CPU_USED)) ;
                    // 内存占用改为百分比显示
                    var per = (parseInt(tempData.MEMORY_USED) * 100 / parseInt(tempData.MEMORY_MAX)).toString();
                    var per_1 = per.split(".")[0]
                    var per_2 = per.split(".")[1].slice(0, 2)
                    memoryUsedList.push(per_1 + '.' + per_2);

                    sessionUsedList.push(tempData.SESSIONS_USED);

                    timeList.push(tempData.JLSJ)

                    if (i === 0) {
                        lineMaxValueRealTime[0] = 100

                        //lineMaxValueRealTime[1] = parseInt(nearData.MEMORY_MAX)
                        // 内存占用改为显示百分比
                        lineMaxValueRealTime[1] = 100
                        lineMaxValueHistory[1] = parseInt(nearData.MEMORY_MAX)
                        lineMaxValueRealTime[2] = parseInt(nearData.SESSIONS_MAX)
                        lineMaxValueHistory[2] = parseInt(nearData.SESSIONS_MAX)

                    }
                }
            }


            firewallRealTimeList.push(
                structureList,
                cupUsedList,
                memoryUsedList,
                sessionUsedList,
                timeList
            );

            buttonFirewallStatusClick(true, 1)
            buttonFirewallStatusClick(true, 2)
            buttonFirewallStatusClick(true, 3)
        }
    })
}


var circle_set_data = function (structure, dataList) {
    let count = 0;

    var interval = setInterval(function () {
        if (dataList.length === count) {  //循环结束
            clearInterval(interval);
            requestFirewallData(true);
            return
        }

        let tempData = dataList[count]

        firewallRealTimeList[1].push(parseInt(tempData.CPU_USED));
        firewallRealTimeList[2].push(parseInt(tempData.MEMORY_USED));
        firewallRealTimeList[3].push(tempData.SESSIONS_USED);
        firewallRealTimeList[4].push(tempData.JLSJ);

        updateFirewallRealTimeStatus()
        count++
    }, 5000*60)
}

function requestApCountIndex() {
    $.get(hostName + '/charts/APCountData', function (result) {
        console.log(result,'AP 相关数据');
        if (result.code === 10000) {
            initApCountData_Index(result);
            initTotalStreamData_Index(result)
        }
    })
}

//获取AP实时数据   十分钟刷新一次
function requestApRealTimeDataIndex() {
    $.get(hostName + '/charts/APRealTimeData', function (result) {
        if (result.code = 10000) {
            initAPRealTimeDataIndex(result)
        }
    })
}


//带宽实时数据
function requestBrandNow(){
    $.get(hostName + '/charts/broadband_now', function (result) {
        if(result.code === 10000){
            update_brand_pie(result.data)
        }
    })
}

function requestBrandDay(){
    $.get(hostName + '/charts/broadband_day', function (result) {
        if(result.code === 10000){
            brand_data = result.data;
            update_brand_line(brand_data, 0)
        }
    })
}

