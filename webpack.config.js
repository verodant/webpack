const path = require('path');

module.exports = {
    entry: {
        "main-top-async": './src/main-top-async.js',
        "main-top-sync": './src/main-top-sync.js',
        "main-bottom-async": './src/main-bottom-async.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets = ['@babel/preset-env'],

                    }
                }
            }
        ]
    },
    devServer: {
        open: true
    }
};