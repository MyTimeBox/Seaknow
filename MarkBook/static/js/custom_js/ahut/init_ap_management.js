
//折线图布局
let lineChartView = echarts.init(document.getElementById('line_chart_view'));

//AP型号分布 饼图
let pieAPEquipment = echarts.init(document.getElementById('pie_ap_equipment'));

//按地点统计AP数量 饼图
let pieAPAddressCount = echarts.init(document.getElementById('pie_ap_address_count'));
//AP终端数量排行TOP 10
let lineAPTerminalTop = echarts.init(document.getElementById('line_ap_top_view'));
//AP离线天数TOP 10
let lineAPOfflineTop = echarts.init(document.getElementById('line_ap_offline_top'));

//AP是实时图和历史图
let lineApRealTime4 = echarts.init(document.getElementById('line_ap_real_time_4'))
// let lineApRealTime5 = echarts.init(document.getElementById('line_ap_real_time_5'))


let textApRealTime4 = document.getElementById('title_ap_real_time_4')
let textApRealTime5 = document.getElementById('title_ap_real_time_5')


let buttonApRealTime4 = document.getElementById('button_real_time_4')
// let buttonApRealTime5 = document.getElementById('button_real_time_5')

let buttonApHistory4 = document.getElementById('button_history_4')
// let buttonApHistory5 = document.getElementById('button_history_5')


let lineApInfoList = [lineApRealTime1, lineApRealTime2, lineApRealTime3, lineApRealTime4]
let textTitleList = [textApRealTime1, textApRealTime2, textApRealTime3, textApRealTime4, textApRealTime5]

let buttonRealTimeList = [buttonApRealTime1, buttonApRealTime2, buttonApRealTime3, buttonApRealTime4]
let buttonHistoryList = [buttonApHistory1, buttonApHistory2, buttonApHistory3, buttonApHistory4]

// let textUpStream = document.getElementById("up_stream");
// let textDownStream = document.getElementById("down_stream");
//

//当前折线图里面的数据是否为总流量波动
let currentLineChartIsTotal = true
// let hostName = 'http://charts.yanlight.com'
// let hostName = 'http://127.0.0.1:8000'
requestApCount();
requestApRealTimeData();
// requestApHistoryData();

requestUpStreamTop10() ;// 页面刷新时，显示上行流量 Top10
// requestDownStreamTop10();//下行流量Top10
requestStreamDetailNear10(0);
requestAPGroupByModel();
requestAPGroupByAddress();
requestOfflineAPTop10();


setInterval(function () {
    requestApCount();
    requestApRealTimeData();
    // requestApHistoryData()
}, 1000 * 60 * 10);

