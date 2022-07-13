const webpack = require('webpack');
const ejs = require('ejs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { version } = require('./package.json');


const config = {
  mode: process.env.NODE_ENV,
  context: __dirname + '/src',
  entry: {
    'background': './background.js',
    'editor': './editor.js',
    'insert': './insert.js'
  },
  output: {
    path: __dirname + '/gjeditor',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      global: 'window',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'res', to: 'res' },
        { from: 'editor.html', to: 'editor.html' },
        { from: 'thanks.html', to: 'thanks.html' },
        {
          from: 'manifest.json',
          to: 'manifest.json',
          transform: (content) => {
            const jsonContent = JSON.parse(content);
            jsonContent.version = version;
            return JSON.stringify(jsonContent, null, 2);
          },
        },
      ]
    })
  ],
  devtool: false,
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
}

if (config.mode === 'production') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
  ]);
}


function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}


module.exports = config;