const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  // the entry file for the bundle
  entry: path.join(__dirname, '../client/src/app.jsx'),
  // the bundle file we will get in the result
  output: {
    path: path.join(__dirname, '../client/dist/js'),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css', '.scss'], //https://github.com/webpack/webpack/issues/3043
    modules: [
      'node_modules'
    ]
  },
  module: {
    // apply loaders to files that meet given conditions
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, '../client/src'),
        use: [

          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?(\?[a-z0-9]{0,6})?$/,
        loader: 'file-loader?publicPath=/&name=fonts/[name].[ext]'
      },
      {
        test: /\.(png|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ],
  },

  plugins: [

    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../server/static/index.html'),
      inject: true
    })

  ]

};
