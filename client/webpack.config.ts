import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import path from "path";
import webpack from "webpack";
import Dotenv from 'dotenv-webpack'

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: "./src/index.tsx",
  target: "web",
  output: {
    filename: "bundle.[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath:"/",
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new Dotenv(),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: [".*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$|tsx/, 
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
        options: {
          plugins: [
            isDevelopment && require.resolve("react-refresh/babel"),
          ].filter(Boolean),
        },
      },
      {
        test: /\.png|svg|jpg|gif$/,
        use: ["file-loader"],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      }, {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
    ],
  },
};