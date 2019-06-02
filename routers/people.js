var express = require('express');
var router = express.Router();

var People = require('../models/people');
var PeopleRemote = require('../models/peopleRemote');
var PeopleMssql = require('../models/PeopleMssql');
var Temp = require('../models/temp');
//统一返回格式
var responseData = {};

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

//项目列表
router.get('/allMs', function(req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    PeopleMssql.findAndCountAll({
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
    var idcard = (req.query.idcard || '').trim();
    var name = (req.query.name || '').trim();
    var status = (req.query.status || '').trim();

    var whereObj = {};
    if (idcard) {
        whereObj.idcard = {
            $like: '%' + idcard + '%'
        };
    }
    if (name) {
        whereObj.name = {
            $like: '%' + name + '%'
        };
    }
    if (status) {
        whereObj.status = status;
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

//项目查询接口
router.get('/isProjectManger', function(req, res) {
    var projectId = req.query.projectId;
    var userId = req.query.userId;
    var queryBody = {};
    if (projectId && userId) {
        queryBody._id = projectId;
        queryBody.manager = userId;
        People.findOne(queryBody).then(function(project) {
            if (project) {
                res.json({
                    isProjectManger: true
                })
            }
        });
    }

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
    var changeList = [];
    var len = idcardArr.length;
    idcardArr.forEach(function(idcard, index) {
        updateByCompare(idcard, index, len, res, changeList);
    });
});

function updateByCompare(idcard, index, len, res, changeList = []) {
    People.findOne({
        where: {
            idcard: idcard
        }
    }).then(function(people) {
        PeopleRemote.findOne({
            where: {
                idcard: idcard
            }
        }).then(function(peopleRemote) {
            if (peopleRemote) {
                //远程数据库有数据但是数据有出入的情况
                if (!isObjectValueEqual(people.dataValues, peopleRemote.dataValues)) {
                    changeList.push(idcard);
                }
            } else {
                //远程数据库没有数据的情况
                changeList.push(idcard);
            }
            //只有比较完最后一条数据才返回结果
            if (index == len - 1) {
                res.json({ changeList })
            }
        })
    })
}

function isObjectValueEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        var propA = a[propName];
        var propB = b[propName];
        if (propA !== propB) {
            return false;
        }
    }
    return true;
}

module.exports = router;