$(function () {

    initProjectCharts('macarons');
    initMonthCharts('macarons');
    initWeekCharts('macarons');
    initTaskTypeCharts('macarons');
    initProjectAndTypeCharts('macarons');
});

function initProjectCharts(theme) {
    $.ajax({
        url: '/weekly/statisticByProject',
        success: function (res) {
            var data = res.data[0];
            var xAxisDate = [];
            var yAxisDate = [];
            data.forEach(function (item) {
                xAxisDate.push(item.name);
                yAxisDate.push(item.value);
            });
            var option = {
                backgroundColor:'rgb(247, 239, 239)',
                title: {
                    text: '按所属项目统计',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: xAxisDate
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                series: [
                    {
                        name: '工时',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: data
                    }
                ]
            };


            var projectChart = echarts.init(document.getElementById('div_project'),theme);
            projectChart.setOption(option);
        }
    });
}

function initTaskTypeCharts(theme) {
    $.ajax({
        url: '/weekly/statisticByTasktype',
        success: function (res) {
            var data = res.data[0];
            var xAxisDate = [];
            var yAxisDate = [];
            data.forEach(function (item) {
                xAxisDate.push(item.name);
                yAxisDate.push(item.value);
            });
            var option = {
                backgroundColor:'rgb(247, 239, 239)',
                title: {
                    text: '按任务类型统计',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: xAxisDate
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '工时',
                        type: 'bar',
                        itemStyle: {normal: {label: {show: true,position:'insideTop'}}},
                        data: yAxisDate,
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'},
                            ]
                        }
                    }
                ]
            };
            var taskTypeChart = echarts.init(document.getElementById('div_taskType'),theme);
            taskTypeChart.setOption(option);
            document.getElementById('div_taskType').style.backgroundColor='rgb(247, 239, 239)';
        }
    });
}


function initWeekCharts(theme) {
    $.ajax({
        url: '/weekly/statisticByWeek',
        success: function (res) {
            var data = res.data[0];
            var xAxisDate = [];
            var yAxisDate = [];
            data.forEach(function (item) {
                xAxisDate.push(item.name);
                yAxisDate.push(item.value);
            });
            var option = {
                backgroundColor:'rgb(247, 239, 239)',
                title: {
                    text: '按周统计',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: false, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: xAxisDate
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '工时',
                        type: 'bar',
                        data: yAxisDate,
                        itemStyle: {normal: {label: {show: true,position:'insideTop'}}},
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'},
                            ]
                        },
                    }
                ]
            };
            var weekChart = echarts.init(document.getElementById('div_week'),theme);
            weekChart.setOption(option);
            document.getElementById('div_week').style.backgroundColor='rgb(247, 239, 239)';
        }
    });
}


function initMonthCharts(theme) {
    $.ajax({
        url: '/weekly/statisticByMonth',
        success: function (res) {
            var data = res.data[0];
            var xAxisDate = [];
            var yAxisDate = [];
            data.forEach(function (item) {
                xAxisDate.push(item.name);
                yAxisDate.push(item.value);
            });
            var option = {
                backgroundColor:'rgb(247, 239, 239)',
                title: {
                    text: '按月统计',

                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: false, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: xAxisDate
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '工时',
                        type: 'bar',
                        data: yAxisDate,
                        itemStyle: {normal: {label: {show: true,position:'insideTop'}}},
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'},
                            ]
                        },
                    }
                ]
            };
            var monthChart = echarts.init(document.getElementById('div_month'),theme);
            monthChart.setOption(option);
            document.getElementById('div_month').style.backgroundColor='rgb(247, 239, 239)';
        }
    });
}

function initProjectAndTypeCharts(theme) {
    $.ajax({
        url: '/weekly/statisticByProject&Type',
        success: function (res) {
            var data = res.data[0];
            var yAxisDate = [];
            var legend = ["bug修改", "方案设计", "项目实施", "功能测试", "模块开发", "数据处理"];
            var series={
                "bug修改":[],
                "方案设计":[],
                "项目实施":[],
                "功能测试":[],
                "模块开发":[],
                "数据处理":[]
            }
            data.forEach(function (item) {
                yAxisDate.push(item.projectName);
                series["bug修改"].push(item["bug修改"]);
                series["方案设计"].push(item["方案设计"]);
                series["项目实施"].push(item["项目实施"]);
                series["功能测试"].push(item["功能测试"]);
                series["模块开发"].push(item["模块开发"]);
                series["数据处理"].push(item["数据处理"]);
            })

            var option = {
                backgroundColor:'rgb(247, 239, 239)',
                title : {
                    text: '项目中各种类型工时分布图',
                    x:'center'
                },
                tooltip: {

                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: legend,
                    y:'50'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: false, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'value'
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: yAxisDate
                    }
                ],
                grid: { // 控制画布的大小，调整下面这些值就可以
                    x: 200,
                    x2: 40,
                    y:90,
                    y2: 50,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                },
                series: [
                    {
                        name: 'bug修改',
                        type: 'bar',
                        stack: '工时',
                        itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                        data: series["bug修改"]
                    },
                    {
                        name: '方案设计',
                        type: 'bar',
                        stack: '工时',
                        itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                        data: series["方案设计"]
                    },
                    {
                        name: '项目实施',
                        type: 'bar',
                        stack: '工时',
                        itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                        data: series["项目实施"]
                    },
                    {
                        name: '功能测试',
                        type: 'bar',
                        stack: '工时',
                        itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                        data: series["功能测试"]
                    },
                    {
                        name: '模块开发',
                        type: 'bar',
                        stack: '工时',
                        itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                        data: series["模块开发"]
                    },
                    {
                        name: '数据处理',
                        type: 'bar',
                        stack: '工时',
                        itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                        data: series["数据处理"]
                    }
                ]
            };

            var projectAndTypeChart = echarts.init(document.getElementById('div_projectAndType'),theme);

            projectAndTypeChart.setOption(option);

            document.getElementById('div_projectAndType').style.backgroundColor='rgb(247, 239, 239)';
        }
    });


}