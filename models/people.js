var Sequelize = require('sequelize');
var db = require('./db');
var People = db.sequelize.define('People', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    idcard: Sequelize.STRING,
    name: Sequelize.STRING,
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

module.exports = People;