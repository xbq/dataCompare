var mssql = require('mssql');
var dbConfig = {
    user: 'sa',
    password: 'sa',
    server: 'localhost',
    database: 'hhml',
    port: 1433,
    options: {
        instanceName: 'XBQ'
    },
    pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 3000
    }
};

function excute(query) {
    return new Promise((resolve, reject) => {
        new mssql.ConnectionPool(dbConfig).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {

            resolve(result.recordset);

            mssql.close();
        }).catch(err => {

            reject(err)
            mssql.close();
        });
    });
}


module.exports = { excute };