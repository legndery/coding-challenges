const path = require('path'); 
// import { Configuration } from 'webpack';

/**
 * @type {Configuration}
 */
const config =  {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    mode: 'development',
    target: 'node',
}
module.exports = config;