var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var sequelize = new Sequelize('hhml', 'sa', 'sa', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        instanceName: "XBQ"
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    operatorsAliases: {
        $and: Op.and,
        $or: Op.or,
        $eq: Op.eq,
        $gt: Op.gt,
        $lt: Op.lt,
        $lte: Op.lte,
        $like: Op.like
    }
});

module.exports.sequelize = sequelize;