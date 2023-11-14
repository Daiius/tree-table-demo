const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/main.tsx',
    login_bundle: './src/login/main.tsx',
  },
  mode: 'development',
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modues/,
      }, {
        test: /\.(scss)$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: () => require('autoprefixer')
            }
          }
        }, {
          loader: 'sass-loader'
        }]
      }, {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        type: "asset/inline"
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.woff', '.woff2', '.css', '.scss'],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};

