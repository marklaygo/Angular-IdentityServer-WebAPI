var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        'polyfills': './angular/polyfills.ts',
        'vendor': './angular/vendor.ts',
        'app': './angular/main.ts'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                use: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('angular', 'app'),
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap' })
            },
            {
                test: /\.css$/,
                include: helpers.root('angular', 'app'),
                use: 'raw-loader'
            },
            {
                test: /\.scss$/,
                exclude: [helpers.root('src', 'app')],
                use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader?sourceMap', 'sass-loader?sourceMap']})
            },
            {
                test: /\.scss$/,
                include: [helpers.root('src', 'app')],
                use: ['raw-loader', 'sass-loader']
            }
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./angular'), // location of your src
            {} // a map of your routes
        ),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: 'angular/index.html'
        })
    ]
};
