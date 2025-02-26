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
    path: path.resolve(__dirname, 'docs'),
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
            path.resolve(__dirname, 'docs/eventuate.bookmarklet.js'),
            'utf8'
          );

          // URL-encode the code
          const encodedCode = encodeURIComponent(bundledCode);

          // Check size limits
          const sizeKB = encodedCode.length / 1024;
          console.log(`Bookmarklet size: ${sizeKB.toFixed(2)}KB`);

          if (sizeKB > 30) {
            console.warn("Warning: Bookmarklet exceeds Chrome's size limit!");
          }

          const template = fs.readFileSync(
            path.resolve(__dirname, 'src/bookmarklet.template.js'),
            'utf8'
          );

          const version = require('./package.json').version;
          const script = `(function(){
            // Version ${version}
            ${bundledCode}
          })();`;

          const markdownTemplate = fs.readFileSync(
            path.resolve(__dirname, 'src/bookmarklet.template.md'),
            'utf8'
          );

          const markdown = markdownTemplate
            .replaceAll('${version}', version)
            .replaceAll('${script}', encodeURIComponent(script))
            .replaceAll(
              '${warning}',
              sizeKB > 30
                ? ' ** Warning:** This bookmarklet may not work in Chrome due to size limitations.\n'
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
