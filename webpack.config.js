
const path = require('path');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/, new RegExp(path.resolve(__dirname, 'lib'))],
                use: 'babel-loader'
            },
            {
                test: /\.(ts|tsx)?$/,
                use: 'ts-loader',
                exclude: [/node_modules/, new RegExp(path.resolve(__dirname, 'lib'))]
            }
        ]
    },
    resolve: {
        alias: {
            three: path.resolve(__dirname, 'lib/three.js')
        },
        extensions: ['.ts', '.tsx', '.jsx', '.js']
    }
};
