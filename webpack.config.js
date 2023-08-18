const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');
const MiniCssExtractPlugin=require('mini-css-extract-plugin');
const {ESLint}=require('eslint');
const ESLintPlugin=require('eslint-webpack-plugin');
const CopyPlugin=require('copy-webpack-plugin');
const dotenv=require('dotenv').config({path: __dirname+'/.env'});
const isDevelopment=process.env.NODE_ENV!=='production';
const webpack=require('webpack');
const devServer=(isDev) =>
  !isDev
    ? {}
    :{
      devServer: {
        open: true,
        port: 8080,
        historyApiFallback: true,
      },
    };

const esLintPlugin=(isDev) => (isDev? []:[new ESLintPlugin({extensions: ['ts', 'js']})]);

module.exports=({develop}) => ({
  mode: develop? 'development':'production',
  devtool: develop? 'source-map':false,

  entry: {
    main: path.resolve(__dirname, './src/index.ts'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {crypto: false},
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new CopyPlugin({
      patterns: [
        {from: 'src/assets/image', to: 'image'},
        {from: 'src/assets/fonts', to: 'fonts'},
      ],
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
      'process.env.NODE_ENV': JSON.stringify(isDevelopment? 'development':'production'),
    }),
    ...esLintPlugin(develop),
  ],
  ...devServer(develop),
});
