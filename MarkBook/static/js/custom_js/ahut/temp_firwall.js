//cpu占用率折线图
let lineFirewallCPU1 = echarts.init(document.getElementById('line_firewall_cpu1'))

//内存占用率折线图
let lineFirewallMemory1 = echarts.init(document.getElementById('line_firewall_memory1'))

//会话数占用率折线图
let lineFirewallSession1 = echarts.init(document.getElementById('line_firewall_session1'))

let line_firewall_charts = [lineFirewallCPU1, lineFirewallMemory1, lineFirewallSession1]

let line_firewall_options = []
let lineMaxValueRealTime1 = []
let flag4;

//请求防火墙实时信息
function requestFirewallData1() {
    var hostName = '/ahut';
    $.get(hostName + '/charts/firewallStatus', function (result) {
        if (result.code = 10000) {

            // let structure = result.result.data_struct
            var dataList = result.result.data
            var nearData = dataList[0]
            dataList.reverse();

            // circle_set_data(structure, dataList)

            var cupUsedList = [];
            var memoryUsedList = [];
            var sessionUsedList = [];
            var timeList = [];
            var structureList = ['CPU使用情况(%)', '内存使用情况(%)', '会话数量']

            for (var i = 0; i < dataList.length; i++) {
                var tempData = dataList[i]
                if(tempData.SBLX === 'Juniper STX1400') {

                    cupUsedList.push(parseInt(tempData.CPU_USED)) ;
                    // 内存占用改为百分比显示
                    var per = (parseInt(tempData.MEMORY_USED) * 100 / parseInt(tempData.MEMORY_MAX)).toString();
                    var per_1 = per.split(".")[0]
                    var per_2 = per.split(".")[1].slice(0, 2)
                    memoryUsedList.push(per_1 + '.' + per_2);

                    sessionUsedList.push(tempData.SESSIONS_USED);

                    timeList.push(tempData.JLSJ);

                    if (i === 0) {
                        lineMaxValueRealTime1[0] = 100
                        lineMaxValueRealTime1[1] = 100
                        lineMaxValueRealTime1[2] = parseInt(nearData.SESSIONS_MAX)

                    }
                }
            }

            var cpu_title = structureList[0]
            var ram_title = structureList[1]
            var session_title = structureList[2]

            var cpu_option = setUpFirewallRealTimeCharts(cpu_title, cupUsedList, timeList, false, false, lineMaxValueRealTime1[0])
            var ram_option = setUpFirewallRealTimeCharts(ram_title, memoryUsedList, timeList, false, false, lineMaxValueRealTime1[1])
            var session_option = setUpFirewallRealTimeCharts(session_title, sessionUsedList, timeList, false, false, lineMaxValueRealTime1[2])

            line_firewall_options = [cpu_option, ram_option, session_option]

            lineFirewallCPU1.clear()
            lineFirewallCPU1.setOption(cpu_option)


        }
    })
}

requestFirewallData1()

// 防火墙轮播图播放时，触发buttonFirewallStatusClick事件
$('#myTab3 a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        flag4 = $(this).data('id')
});

$('#myTab3 a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        flag4 = $(this).data('id')
        line_firewall_charts[parseInt(flag4)].resize();
        var option = line_firewall_options[flag4];
        line_firewall_charts[parseInt(flag4)].setOption(option)
});