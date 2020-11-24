const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  entry: './src/index.ts',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      // cacheGroups: {
      //   test: /[\\/]node_modules[\\/]/,
      //   name: 'vendors',
      //   chunks: 'all'
      // }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css"
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.pug",
      inject: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        include: path.resolve(__dirname, 'src'),
        use: 'pug-loader'
      },
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        use: "ts-loader"
      },
      {
        test: /\.scss$/i,
        include: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
}
