var express = require('express');
var router = express.Router();
var request = require('request');

var People = require('../models/people');
var dbms = require('../models/dbMs');
var md5 = require('js-md5');
//统一返回格式
var responseData = {};

var signObj = {};

var appkey = 'ba5a7fb793d44a6aa28017beb2098bb2';
var appsecret = '10926f335f624ea3b67abdd419782c73';
var refreshSecret = signObj.refreshSecret;
var refreshSecretEndTime = signObj.refreshSecretEndTime;
var requestSecretEndTime = signObj.requestSecretEndTime;
var requestTime = new Date().getTime();


// (function(){
//         var sign = md5(appkey + appsecret + requestTime);
//         request.post({url:'http://59.202.58.68/gateway/app/refreshTokenByKey.htm', form:{
//                 appKey: appkey,
//                 sign: sign,
//                 requestTime: requestTime
//             }}, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         signObj = body;
//             setInterval(function() {
//                 var refreshSecret = signObj.refreshSecret;
//                 var sign = md5(appkey + refreshSecret + new Date().getTime());
//                 refreshRequireSecret(appkey, sign, requestTime)
//             }, 15 * 60 * 1000)

//     }else{
//         signObj = error;
//     }
// })();





(function() {
    //如果没有刷新秘钥或者刷新秘钥过期，重新通过refreshTokenByKey获取一组刷新秘钥和请求秘钥
    if (!refreshSecret || refreshSecretEndTime < requestTime) {
        var sign = md5(appkey + appsecret + requestTime);
        request.post({url:'http://59.202.58.68/gateway/app/refreshTokenByKey.htm', form:{
                appKey: appkey,
                sign: sign,
                requestTime: requestTime
            }}, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        signObj = body;
    }else{
        signObj = error;
    }
})
    } else {
        //请求秘钥过期
        if (requestSecretEndTime < requestTime) {
            var refreshSecret = signObj.refreshSecret;
            var sign = md5(appkey + refreshSecret + requestTime);
            //先通过refreshTokenBySec获取一组新的刷新秘钥和请求秘钥
            refreshRequireSecret(appkey, sign, requestTime);
            //然后启动定时器  15分钟刷新一次  保证请求秘钥是有效的
            setInterval(function() {
                var refreshSecret = signObj.refreshSecret;
                var sign = md5(appkey + refreshSecret + requestTime);
                refreshRequireSecret(appkey, sign, requestTime)
            }, 15 * 60 * 1000)
        }
    }
})();

router.get('/getSecret', function(req, res) {
    console.log(signObj);
    res.json(signObj);
});



function refreshRequireSecret(appkey, sign, requestTime) {

    request.post({url:'http://59.202.58.68/gateway/app/refreshTokenBySec.htm', form:{
            appKey: appkey,
            sign: sign,
            requestTime: requestTime
        }}, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        signObj = body;
    }else{
        signObj = error;
    }
})


}

//项目列表
router.get('/all', function(req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    People.findAndCountAll({
        limit: limit,
        offset: offset
    }).then(function(result) {
        res.json({
            code: 0,
            count: result.count,
            data: result.rows,
            message: ""
        });
    })
});

//项目查询接口
router.get('/find', function(req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    //var searchValue = (req.query.searchValue || '').trim();
    console.log(req.query);
    var whereObj = {};
    for (key in req.query) {
        if (key != 'limit' && key != 'page') {
            whereObj[key] = {
                $like: '%' + (req.query)[key] + '%'
            }
        }
    }



    People.findAndCountAll({
        where: whereObj,
        limit: limit,
        offset: offset
    }).then(function(result) {
        res.json({
            code: 0,
            count: result.count,
            data: result.rows,
            message: ""
        });
    })
});

//删除项目
router.get('/delete', function(req, res) {
    People.destroy({
        where: req.query
    }).then(function(people) {
        if (people) {
            responseData.message = "删除成功";
        } else {
            responseData.code = 1;
            responseData.message = "删除失败";
        }
        res.json(responseData);
    })
});

//添加项目
router.get('/add', function(req, res) {
    //将项目经理的人选传入页面
    res.render('manager/addPeople');
});


router.get('/getById', function(req, res) {
    People.findOne({
        where: {
            id: req.query.id
        }
    }).then(function(people) {
        if (people) {
            res.json({
                data: people
            })
        }
    })
});

//添加项目
router.post('/add', function(req, res) {
    People.findOne({
        where: {
            name: req.body.name
        }
    }).then(function(people) {
        if (people) {
            responseData.code = 1;
            responseData.message = "添加失败,项目名称已经存在";
            res.json(responseData);
        } else {
            People.create(req.body).then(function(newPeople) {
                if (newPeople) {
                    responseData.message = "添加成功";
                } else {
                    responseData.code = 2;
                    responseData.message = "添加失败";
                }
                res.json(responseData);
            });
        }
    });
});

//更新用户
router.post('/update', function(req, res) {
    People.update(req.body, {
        where: {
            id: req.body.id
        }
    }).then(function(people) {
        if (people) {
            responseData.message = "修改成功";
        } else {
            responseData.code = 1;
            responseData.message = "修改失败";
        }
        res.json(responseData);
    });
});

//编辑项目页面跳转
router.get('/edit', function(req, res) {
    res.render('manager/editPeople');
});

router.get('/getAllMs', (req, res) => {

    dbms.excute('select * from people').then(result => {
        res.json({ data: result })
    });
});

//编辑项目页面跳转
router.get('/findOneById', function(req, res) {
    People.findById(req.query.id).then(function(people) {
        res.json({
            data: people
        });
    });
});

//对比
router.post('/compare', function(req, res) {
    var idcardArr = req.body.idcardArr.split(',');
    var changeList = [],
        remoteList = [],
        remoteChangeList = [];
    var len = idcardArr.length;
    idcardArr.forEach(function(idcard, index) {
        updateByCompare(idcard, index, len, res, changeList, remoteList, remoteChangeList);
    });
});

function updateByCompare(idcard, index, len, res, changeList = [], remoteList = [], remoteChangeList = []) {
    People.findOne({
        where: {
            idcard: idcard
        }
    }).then(function(people) {
        var strSql = `select * from people where idcard = '${idcard}'`;
        dbms.excute(strSql).then(function(peopleRemote) {
            if (peopleRemote && peopleRemote.length == 1) {
                remoteList.push(peopleRemote[0]);
                //远程数据库有数据但是数据有出入的情况
                if (!isObjectValueEqual(people.dataValues, peopleRemote[0], ['id'])) {
                    changeList.push(idcard);
                    remoteChangeList.push(peopleRemote[0]);
                }
            } else {
                //远程数据库没有数据的情况
                changeList.push(idcard);
            }
            //只有比较完最后一条数据才返回结果
            if (index == len - 1) {
                res.json({
                    changeList,
                    remoteList,
                    remoteChangeList
                })
            }
        })
    })
}


function isObjectValueEqual(a, b, ignoreAttrs = []) {
    console.log(a);
    console.log(b);
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (propName.indexOf(ignoreAttrs) == -1) {
            var propA = a[propName];
            var propB = b[propName];
            if (propA !== propB) {
                return false;
            }
        }
    }
    return true;
}

router.get('/layuiUser', (req, res, next) => {
    request('https://www.layui.com/demo/table/user', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json({ data: body }) // Show the HTML for the baidu homepage.
        }
    })
})

router.post('/compareData', (req, res) => {
    console.log('req',req);
    request.post({url:'https://interface.zjzwfw.gov.cn/gateway/api/001003010/dataSharing/cremationInfo.htm', form:req.body}, function(error, response, body) {
    if (!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        } else {
            res.json({ error: error });
        }
})

})

module.exports = router;