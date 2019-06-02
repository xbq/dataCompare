var Sequelize = require('sequelize');
var db = require('./db');
var Temp = db.sequelize.define('Temp', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    idcard: Sequelize.TEXT
}, {
    underscored: true,
    timestamps: false,
    tableName: 'temp',
    comment: '个人信息',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

/*//初始化表的时候用
Project.sync().then(function (result) {
    // 同步了'User'一个模型
});*/

module.exports = Temp;