var Sequelize = require('sequelize');
var db = require('./db');
var People = db.sequelize.define('People', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    sex:Sequelize.STRING,
    birthday:Sequelize.STRING,
    age:Sequelize.INTEGER,
    description:Sequelize.STRING,
    retiretime:Sequelize.STRING,
    subsidy:Sequelize.STRING,
    address:Sequelize.STRING,
    idnum:Sequelize.STRING,
    tel:Sequelize.STRING,
    isdead:Sequelize.INTEGER
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