const path = require('path');
const fs = require('fs');
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
      },
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
          const bundledCode = fs.readFileSync(
            path.resolve(__dirname, 'dist/eventuate.bookmarklet.js'),
            'utf8'
          );

          const template = fs.readFileSync(
            path.resolve(__dirname, 'src/bookmarklet.template.js'),
            'utf8'
          );

          const version = require('./package.json').version;
          const script = template
            .replaceAll('${version}', version)
            .replaceAll('${ code }', bundledCode);

          const encodedScript = encodeURIComponent(script);
          const sizeKB = encodedScript.length / 1024;

          if (sizeKB > 30) {
            console.warn("Warning: Bookmarklet exceeds Chrome's size limit!");
          }

          const markdownTemplate = fs.readFileSync(
            path.resolve(__dirname, 'src/bookmarklet.template.md'),
            'utf8'
          );

          const markdown = markdownTemplate
            .replaceAll('${version}', version)
            .replaceAll('${encodedScript}', encodedScript)
            .replaceAll(
              '${warning}',
              sizeKB > 30
                ? '> **Warning:** This bookmarklet may not work in Chrome due to size limitations.\n{: .warning}\n\n'
                : ''
            )
            .replaceAll('${sizeKB}', sizeKB.toFixed(2));

          fs.writeFileSync(
            path.resolve(__dirname, 'docs/bookmarklet.md'),
            markdown
          );
        });
      },
    },
  ],
};
