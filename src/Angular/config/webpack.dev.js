var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    resolve: {
        plugins: [
            new TsConfigPathsPlugin({ configFileName: "tsconfig.json" })
        ]
    },

    output: {
        path: helpers.root('wwwroot'),
        publicPath: 'http://localhost:8080/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: 'awesome-typescript-loader',
                    options: { configFileName: 'tsconfig.json' }
                }, 'angular2-template-loader']
            },
        ]
    },

    plugins: [
        new ExtractTextPlugin('[name].css')
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});
