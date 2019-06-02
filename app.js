var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var Sequelize = require('sequelize');

//解析post请求的参数
var bodyParser = require('body-parser');
//处理cookie
var Cookies = require('cookies');
//创建app应用程序，相当于一个httpserver
var app = new express();

//设置静态文件托管，当用户访问的url匹配/public，name就会返回__dirname+'/public'
app.use('/public', express.static(__dirname + '/public'));
//配置应用模板
//定义当前应用所使用的的模板引擎
//第一个参数：模板引擎的名称也是模板文件的后缀，第二个为解析模板的方法
app.engine('html', swig.renderFile);
//设置模板存放的路径
app.set('views', './views');

//第一个参数必须是view engine，第二个参数必须是模板引擎的后缀app.engine('html',swig.renderFile);
app.set('view engine', 'html');

//开发过程中应该将设置模板不读取缓存，因为开发过程中经常修改模板，如果读取缓存不利于调试，需要经常重启服务
swig.setDefaults({ cache: false });
//bodyParser设置
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    req.cookies = new Cookies(req, res);
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))
        } catch (e) {

        }
    }
    next();
});

//设置允许跨域访问该服务.
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

app.use('/people', require('./routers/people'));
app.use('/', require('./routers/api'));

//启动监听
var server = app.listen(8003, function() {
    console.log('Express server listening on port ' + 8003);
});