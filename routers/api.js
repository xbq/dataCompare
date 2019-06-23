var express = require('express');
var router = express.Router();
var People = require('../models/People');
var User = require('../models/User');
var formidable = require('formidable');
var fs = require('fs');
var xlsx = require('node-xlsx');
var mssql = require('mssql');

//统一返回格式
var responseData = {};

//初始化处理
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    };
    next();
});

router.post('/login', function (req, res) {
    if (req && req.body) {
        //查询数据库，验证用户名密码是否正确
        User.findOne({
            where: req.body
        }).then(function (userInfo) {
            if (!userInfo) {
                responseData.code = 3;
                responseData.message = "用户名或密码错误";
                res.json(responseData);
                return;
            } else {
                responseData.message = "登陆成功";
                req.cookies.set('userInfo', JSON.stringify({
                    id: userInfo.id,
                    username: new Buffer(userInfo.username).toString('base64'),
                    role: userInfo.role,
                    isAdmin: userInfo.isAdmin
                }));
                res.json(responseData);
                return;
            }
        });
    }
});

//mssql连接测试
router.post('/testConnect', function (req, res) {
    var dbConfig = {
        user: req.body.username,
        password: req.body.password,
        server: req.body.server,
        database: req.body.database,
        port: req.body.port,
        options: {
            instanceName: req.body.instanceName
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    };
    var testSql = 'select getdate() as date';
    new mssql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(testSql)
    }).then(result => {
        mssql.close();
        res.json(result.recordset);
    }).catch(err => {
        mssql.close();
        res.json(err);
    });

});

router.get('/logout', function (req, res, next) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
});

router.get('/', function (req, res, next) {
    res.render('login');
});

router.get('/peopleList', function (req, res, next) {
    res.render('manager/peopleList');
});

router.get('/peopleList1', function (req, res, next) {
    res.render('manager/peopleList1');
});

router.get('/dbSet', function (req, res, next) {
    res.render('manager/dbSet');
});


router.post('/upload', function (req, res) {

    console.log(" ########## POST /upload ####### ");
    var fileTypeError = false;
    var target_path = __dirname + "/upload";
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.uploadDir = target_path;

    var fields = [];
    var files = [];

    form.on('field', function (field, value) {
        fields.push([field, value]);
    });
    form.on('file', function (field, file) {
        console.log('upload file: ' + file.name);
        //判断文件类型是否是xlsx
        // if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        //     fileTypeError = true;
        // }
        files.push([field, file]);
    });

    form.on('end', function () {

        //遍历上传文件
        var fileName = '';
        var obj = '';
        var folder_exists = fs.existsSync(target_path);
        if (folder_exists) {
            var dirList = fs.readdirSync(target_path);
            dirList.forEach(function (item) {
                console.log('---------------' + target_path + '/' + item)
                if (!fs.statSync(target_path + '/' + item).isDirectory()) {
                    console.log('parse item:' + target_path + '/' + item);
                    fileName = target_path + '/' + item;
                    if (!fileTypeError) {
                        //解析excel
                        obj = xlsx.parse(fileName);
                        console.log(JSON.stringify(obj));
                        //插入数据
                        var arrPeople = [];
                        //从第二行开始导入，第一行为表头
                        var startRowIndex = 2;
                        //sheet名称
                        var sheetName = 'sheet1';
                        obj.forEach(item => {
                            if (item.name == sheetName) {
                                item.data.forEach(function (people, index) {
                                    //从第二行开始导入，第一行为表头
                                    if (index > startRowIndex - 2) {
                                        if (people[9]) {
                                            arrPeople.push({
                                                'name': people[1],
                                                'sex': people[2],
                                                'birthday': people[3],
                                                'age': people[4],
                                                'description': people[5],
                                                'retiretime': people[6],
                                                'subsidy': people[7],
                                                'address': people[8],
                                                'idnum': people[9],
                                                'tel': people[10],
                                                'isdead': 1
                                            });
                                        }
                                    }
                                })
                            }
                        })

                        People.bulkCreate(arrPeople).then(function (result) {
                            console.log("###########批量导入##########");
                            console.log(result);

                            People.destroy({
                                where: {
                                    idnum: {
                                        '$eq': null
                                    }
                                }
                            }).then(function () {
                                //todo
                                res.send({
                                    "Code": "0",
                                    "message": "成功导入数据"
                                });
                            })

                        });

                    } else {
                        res.send({
                            "Code": "1",
                            "message": "文件格式不正确"
                        });
                    }
                    //删除临时文件
                    fs.unlinkSync(fileName);

                }
            });
        } else {
            res.send({
                "Code": "1",
                "message": "系统错误"
            });
        }

    });
    form.on('error', function (err) {
        res.send({
            "rtnCode": "1",
            "rtnInfo": "上传出错"
        });
    });
    form.on('aborted', function () {
        res.send({
            "rtnCode": "1",
            "rtnInfo": "放弃上传"
        });
    });
    form.parse(req);


});



module.exports = router;