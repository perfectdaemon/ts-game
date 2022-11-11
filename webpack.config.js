const path = require('path');
const copy = require('copy-webpack-plugin');

module.exports = env => {
  if (env.tools) {
    return {
      entry: {
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
        extensions: ['.tsx', '.ts', '.js']
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, `dist/tools`)
      },
      devServer: {
        static: 'dist',
        index: 'tools.html',
      },
      plugins: [
        new copy({
          patterns: [
            { from: 'app/tools.html' }
          ]
        })
      ]
    }
  }

  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? false : 'inline-source-map',
    entry: {
      game: `./app/game/${env.game}/index.ts`,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        }
      ]
    },
    devServer: {
      static: `dist/${env.game}`,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, `dist/${env.game}`)
    },
    plugins: [
      new copy({
        patterns: [
          { from: `./app/game/${env.game}/assets`, to: 'assets', globOptions: { ignore: ['.gitkeep'] } },
          { from: `./app/game/${env.game}/index.html` },
        ]
      })
    ]
  }
};
