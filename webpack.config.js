/**
 * EspressoJS - Powered by Vimedev.com Labs
 * ---
 * Basic Web-Pack Configuration Declarations
 * ---
 * 
 */

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * EspressoJS - Powered by Vimedev.com Labs
 * ---
 * Configuration Usage
 */
const config = {
    context: path.resolve(__dirname, "./public/assets/js/jQuery"),
    entry: {
        app: './index.js',
        vendor: './other-file.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './public/assets/src')

    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jquery: "jQuery",
            "window.jQuery": "jquery"
        }),
    ],
    module: {
        rules: [{
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