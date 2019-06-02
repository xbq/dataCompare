var Sequelize = require('sequelize');
var db = require('./dbRemote');
var PeopleRemote = db.sequelize.define('PeopleRemote', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    idcard: Sequelize.STRING,
    status: Sequelize.STRING
}, {
    underscored: true,
    timestamps: false,
    tableName: 'people',
    comment: '个人信息',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

/*//初始化表的时候用
Project.sync().then(function (result) {
    // 同步了'User'一个模型
});*/

module.exports = PeopleRemote;