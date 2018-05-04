const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
 
  module: {
    // apply loaders to files that meet given conditions
    rules:[]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  mode: 'development',
  devtool: 'cheap-module-eval-source-map'
});
