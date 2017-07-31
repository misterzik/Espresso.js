module.exports = {
    entry: './public/assets/js/es6/two-binding.js',
    output: {
        filename: './public/assets/js/bundle.js'
    },
    module: {
      rules: [

            {
              test: /jquery[\\\/]src[\\\/]selector\.js$/,
              loader: 'amd-define-factory-patcher-loader'
            },
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel-loader',
            }
        ]
    }
};
