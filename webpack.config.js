const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {

        // /*start public js*/
        // 'public/plugins/jquery/jquery': './public/plugins/jquery/jquery.min.js',
        // 'public/plugins/layui/layui': './public/plugins/layui/layui.js',
        // 'public/js/login': './public/js/login.js',
        // 'public/js/manager/addProject': './public/js/manager/addProject.js',
        // 'public/js/manager/addUser': './public/js/manager/addUser.js',
        // 'public/js/manager/addWeekly': './public/js/manager/addWeekly.js',
        // 'public/js/manager/approveWeekly': './public/js/manager/approveWeekly.js',
        // 'public/js/manager/detailProject': './public/js/manager/detailProject.js',
        // 'public/js/manager/editProject': './public/js/manager/editProject.js',
        // 'public/js/manager/editUser': './public/js/manager/editUser.js',
        // 'public/js/manager/editUserByEmployee': './public/js/manager/editUserByEmployee.js',
        // 'public/js/manager/editWeekly': './public/js/manager/editWeekly',
        // 'public/js/manager/index': './public/js/manager/index.js',
        // 'public/js/manager/layout': './public/js/manager/layout.js',
        // 'public/js/manager/projectList': './public/js/manager/projectList.js',
        // 'public/js/manager/setPassword': './public/js/manager/setPassword.js',
        // 'public/js/manager/userList': './public/js/manager/userList.js',
        // 'public/js/manager/weeklyApproveList': './public/js/manager/weeklyApproveList.js',
        // 'public/js/manager/weeklyList': './public/js/manager/weeklyList.js',
        // /*end public js*/

        // /*start models*/
        // 'models/db': './models/db.js',
        // 'models/project': './models/project.js',
        // 'models/role': './models/role.js',
        // 'models/user': './models/user.js',
        // 'models/weekly': './models/weekly.js',
        // /*end models*/

        // /*start routers*/
        // 'routers/api': './routers/api.js',
        // 'routers/project': './routers/project.js',
        // 'routers/manager': './routers/manager.js',
        // 'routers/user': './routers/user.js',
        // 'routers/weekly': './routers/weekly.js',
        // /*end routers*/

        'app': './app.js'

    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: '[name].js',
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: './views/login.html',
        //     filename: './views/login.html',
        //     //避免自动加载js
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/addProject.html',
        //     filename: './views/manager/addProject.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/addUser.html',
        //     filename: './views/manager/addUser.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/addWeekly.html',
        //     filename: './views/manager/addWeekly.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/approveWeekly.html',
        //     filename: './views/manager/approveWeekly.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/detailProject.html',
        //     filename: './views/manager/detailProject.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/editProject.html',
        //     filename: './views/manager/editProject.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/editUser.html',
        //     filename: './views/manager/editUser.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/editUserByEmployee.html',
        //     filename: './views/manager/editUserByEmployee.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/editWeekly.html',
        //     filename: './views/manager/editWeekly.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/index.html',
        //     filename: './views/manager/index.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/layout.html',
        //     filename: './views/manager/layout.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/projectList.html',
        //     filename: './views/manager/projectList.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/setPassword.html',
        //     filename: './views/manager/setPassword.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/userList.html',
        //     filename: './views/manager/userList.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/weeklyApproveList.html',
        //     filename: './views/manager/weeklyApproveList.html',
        //     inject: 'false'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './views/manager/weeklyList.html',
        //     filename: './views/manager/weeklyList.html',
        //     inject: 'false'
        // })
    ],
    node: {
        fs: 'empty',
        setImmediate: false,
        drram: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['latest']
                }
            }]
        }]
    },
    externals: {
        'sequelize': "require('sequelize')"
    }
}