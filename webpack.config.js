const path = require('path');
const copy = require('copy-webpack-plugin');

module.exports = {
  entry: {
    game: './app/main.ts',
    tools: './app/tools.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new copy([
      {from: 'assets', to: 'assets', ignore: '.gitkeep'},
      {from: 'index.html'},
      {from: 'tools.html'}
    ])
  ]
};
