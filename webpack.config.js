const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[contenthash].js',
      clean: true
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode)
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      hot: true,
      port: 3000,
      open: true
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    mode: argv.mode || 'development'
  };
};