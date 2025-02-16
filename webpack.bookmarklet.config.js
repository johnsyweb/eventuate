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
          const bundledCode = fs.readFileSync(
            path.resolve(__dirname, 'dist/eventuate.bookmarklet.js'),
            'utf8'
          );

          // URL-encode the code
          const encodedCode = encodeURIComponent(bundledCode);

          // Check size limits
          const sizeKB = encodedCode.length / 1024;
          console.log(`Bookmarklet size: ${sizeKB.toFixed(2)}KB`);

          if (sizeKB > 30) {
            console.warn('Warning: Bookmarklet exceeds Chrome\'s size limit!');
          }

          const template = fs.readFileSync(
            path.resolve(__dirname, 'src/bookmarklet.template.js'),
            'utf8'
          );

          const version = require('./package.json').version;
          const script = `javascript:(function(){
            // Version ${version}
            ${bundledCode}
          })();`;

          // Create an HTML file for easy bookmarklet installation
          const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Eventuate Bookmarklet (${sizeKB.toFixed(2)}KB)</title>
        <style>
        body { font-family: system-ui; max-width: 800px; margin: 2em auto; padding: 0 1em; }
        .bookmarklet { background: #f0f0f0; padding: 1em; border-radius: 4px; }
        .warning { color: #d43; }
        </style>
      </head>
      <body>
        <h1>Eventuate Bookmarklet</h1>
        <div class="instructions">
        <p>Drag this link to your bookmarks bar:</p>
        <p class="bookmarklet">
          <a href="${encodeURIComponent(script)}">Eventuate</a>
        </p>
        ${sizeKB > 30 ? '<p class="warning">Warning: This bookmarklet may not work in Chrome due to size limitations.</p>' : ''}
        </div>
        <p>Version: ${version}</p>
        <p>Size: ${sizeKB.toFixed(2)}KB</p>
      </body>
      </html>`;

          fs.writeFileSync(
            path.resolve(__dirname, 'dist/bookmarklet.html'),
            html
          );
        });
      },
    },
  ],
};