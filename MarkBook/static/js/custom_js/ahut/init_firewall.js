//白名单请求Top50
let white_in_gra = echarts.init(document.getElementById('line_access_preference_yx_in'));

//白名单被请求Top50
let white_out_gra = echarts.init(document.getElementById('line_access_preference_xh_top_out'));

//非白名单请求Top50
let not_white_in_gra = echarts.init(document.getElementById('line_access_not_preference_yx_in'));

//非白名单请求Top50
let not_white_out_gra = echarts.init(document.getElementById('line_access_not_preference_xh_top_out'));

//防火墙实时数据仪表盘
let dashFirewallCurrent = echarts.init(document.getElementById('dash_firewall_current'))

//某IP联动各端口访问次数TOP10/ 某端口联动各IP访问次数TOP10
let barIpOrPortDetail = echarts.init(document.getElementById('bar_ip_or_port_detail'))

let hostName = '/ahut'
requestFirewallRealTimeStatus(true);

requestIPPortTop50('ip')
// 每五分钟请求一次数据
setInterval(function () {
    requestFirewallRealTimeStatus(false)
}, 1000 * 60 * 5)

