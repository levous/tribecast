const webpack = require('webpack');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  
  plugins: [

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
    //, new BundleAnalyzerPlugin()
  ],
  mode: 'production',
  devtool: "source-map",

});
