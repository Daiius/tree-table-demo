const path = require('path');

module.exports = {
  entry: './src/main.tsx',
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
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

