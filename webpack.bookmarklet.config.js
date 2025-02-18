const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'eventuate.bookmarklet.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            passes: 2,
          },
          mangle: true,
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('BookmarkletPlugin', (compilation) => {
          const version = require('./package.json').version;
          const code = `javascript:(function(){${compilation.assets['eventuate.bookmarklet.js'].source()}})();`;
          require('fs').writeFileSync(
            path.resolve(__dirname, 'dist/eventuate.bookmarklet.js'),
            code
          );
        });
      },
    },
  ],
};