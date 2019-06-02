var express = require('express');
var router = express.Router();
var People = require('../models/People');
var User = require('../models/User');
var formidable = require('formidable');
var fs = require('fs');
var xlsx = require('node-xlsx');


//统一返回格式
var responseData = {};

//初始化处理
router.use(function(req, res, next) {
    responseData = {
        code: 0,
        message: ''
    };
    next();
});

/**
 * @api {post} /login 用户登录
 * @apiDescription 用户登录
 * @apiName submit-login
 * @apiGroup User
 * @apiParam {string} username 用户名
 * @apiParam {string} password 密码
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "success" : "true",
 *      "result" : {
 *          "name" : "loginName",
 *          "password" : "loginPass"
 *      }
 *  }
 * @apiSampleRequest http://localhost:8003/login
 * @apiVersion 1.0.0
 */
router.post('/login', function(req, res) {
    if (req && req.body) {
        //查询数据库，验证用户名密码是否正确
        User.findOne({
            where: req.body
        }).then(function(userInfo) {
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

router.get('/logout', function(req, res, next) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
});

router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/peopleList', function(req, res, next) {
    res.render('manager/peopleList');
});

router.get('/dbSet', function(req, res, next) {
    res.render('manager/dbSet');
});


router.post('/upload', function(req, res) {

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

    form.on('field', function(field, value) {
        fields.push([field, value]);
    });
    form.on('file', function(field, file) {
        console.log('upload file: ' + file.name);
        //判断文件类型是否是xlsx
        if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            fileTypeError = true;
        }
        files.push([field, file]);
    });

    form.on('end', function() {

        //遍历上传文件
        var fileName = '';
        var obj = '';
        var folder_exists = fs.existsSync(target_path);
        if (folder_exists) {
            var dirList = fs.readdirSync(target_path);
            dirList.forEach(function(item) {
                if (!fs.statSync(target_path + '/' + item).isDirectory()) {
                    console.log('parse item:' + target_path + '/' + item);
                    fileName = target_path + '/' + item;
                    if (!fileTypeError) {
                        //解析excel
                        obj = xlsx.parse(fileName);
                        console.log(JSON.stringify(obj));
                        //插入数据
                        var arrPeople = [];
                        obj.forEach(item => {
                            if (item.name == "Sheet1") {
                                item.data.forEach(function(people, index) {
                                    //从第二行开始导入，第一行为表头
                                    if (index > 0) {
                                        arrPeople.push({
                                            'idcard': people[0],
                                            'name': people[1],
                                            'status': people[2] == '生' ? 1 : 0
                                        });
                                    }
                                })
                            }
                        })

                        People.bulkCreate(arrPeople).then(function(result) {
                            console.log("###########批量导入##########");
                            console.log(result);
                            //todo
                            res.send({
                                "Code": "0",
                                "message": "成功导入数据"
                            });
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
    form.on('error', function(err) {
        res.send({
            "rtnCode": "1",
            "rtnInfo": "上传出错"
        });
    });
    form.on('aborted', function() {
        res.send({
            "rtnCode": "1",
            "rtnInfo": "放弃上传"
        });
    });
    form.parse(req);


});



module.exports = router;