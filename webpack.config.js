var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: __dirname+'/app/app.tsx',
    output: {
        path: __dirname+'/app',
        library: 'EntryPoint',
        filename: 'app.bundle.js'  },
    module: {
        rules: [      {
            test: /\.(ts|tsx)$/,
            loader: 'awesome-typescript-loader' }
            ]

    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './app/index.template',
            filename: './index.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: './app/trevisane.template',
            filename: './trevisane.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: './app/napoletane.template',
            filename: './napoletane.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: './app/info_de.template',
            filename: './info_de.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: './app/info_it.template',
            filename: './info_it.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: './app/info_en.template',
            filename: './info_en.html' //relative to root of the application
        })
    ]
};
