/**
 * Webpack Core Configs
 * ----
 * 1. Entry
 * 2. Output
 * 3. Loaders
 * 4. Plugins
 */

const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/**
 * Configuration
 */
const config = {
    context: path.resolve(__dirname, "public/assets/js/es6"),
    entry: {
        app: './index.js',
        vendor: './two-binding.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/assets/js/src')

    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jquery: "jQuery",
            "window.jQuery": "jquery"
        }),
    ],
    module: {
      rules: [
            {
              test: /jquery[\\\/]src[\\\/]selector\.js$/,
              loader: 'amd-define-factory-patcher-loader'
            },
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                    loader: 'babel-loader',
                }
            }
        ]
    }
}
module.exports = config;
