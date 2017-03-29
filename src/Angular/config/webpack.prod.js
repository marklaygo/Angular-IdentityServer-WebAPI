var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('./helpers');

const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    resolve: {
        plugins: [
            new TsConfigPathsPlugin({ configFileName: "tsconfig.prod.json" })
        ]
    },

    output: {
        path: helpers.root('wwwroot'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader?configFileName=tsconfig.prod.json', 'angular2-template-loader']
            },
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
            mangle: {
                keep_fnames: true
            }
        }),
        new ExtractTextPlugin('[name].[hash].css'),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new CopyWebpackPlugin([
            { from: helpers.root('angular', 'assets/images/favicon.ico') }
        ]),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        })
    ]
});
