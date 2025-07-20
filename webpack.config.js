//@ts-check
'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** 확장 프로그램용 (Node.js 환경) */
const extensionConfig = {
  target: 'node',
  mode: 'none',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2', // VSCode가 요구하는 방식
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: 'log',
  },
};

/** 웹뷰용 (브라우저 환경) */
const webviewConfig = {
  target: 'web',
  mode: 'none',
  entry: './src/webview/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // libraryTarget 생략 (브라우저 환경은 보통 IIFE or undefined)
    // experiments.outputModule: false 보장됨
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.module.css'],
    fallback: {
      process: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              jsx: 'react-jsx', // 최신 React JSX Transform
            },
          },
        },
      },
      {
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
  ],
  devtool: 'nosources-source-map',
};

module.exports = [extensionConfig, webviewConfig];
