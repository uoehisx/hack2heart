//@ts-check

'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // CSS를 별도의 파일로 추출하기 위한 플러그인

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context
  mode: 'none', // development 또는 production으로 설정 가능

  entry: './src/extension.ts', // 확장 프로그램의 진입점
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode', // VS Code 모듈은 번들링에서 제외
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: 'log', // 문제 매처에 필요한 로깅 활성화
  },
};

/** @type WebpackConfig */
const webviewConfig = {
  target: 'web', // 웹뷰는 브라우저 환경에서 실행되므로 'web'으로 설정
  mode: 'none', // development 또는 production으로 설정 가능

  entry: './src/webview/index.tsx', // React 앱의 진입점 (이 파일은 새로 생성해야 합니다)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // React 앱 번들 파일명
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.module.css'], // React 및 CSS Modules를 위한 확장자 추가
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // .ts 또는 .tsx 파일 처리
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                jsx: 'react', // JSX를 React로 변환하도록 설정
              },
            },
          },
        ],
      },
      {
        test: /\.module\.css$/, // CSS Modules 처리 (.module.css 확장자)
        use: [
          MiniCssExtractPlugin.loader, // CSS를 별도 파일로 추출
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]', // CSS 클래스 이름 규칙 설정
              },
              importLoaders: 1, // @import 규칙 처리
            },
          },
        ],
      },
      {
        test: /\.css$/, // 일반 CSS 파일 처리 (.module.css가 아닌 .css 확장자)
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 이미지 파일 처리
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css', // 추출된 CSS 번들 파일명
    }),
  ],
  devtool: 'nosources-source-map', // 개발 도구 설정
};

module.exports = [extensionConfig, webviewConfig]; // 두 개의 설정을 함께 내보냅니다.
