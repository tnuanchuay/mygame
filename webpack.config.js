const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
        }
      ]
    })
  ],
  devServer: {
    devMiddleware: {
      writeToDisk: true
    },
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 8000,
    open: true,
  }
};