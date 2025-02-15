const path = require('path');
const fs = require('fs');

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
    minimize: true
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
            .replace('${version}', version)
            .replace('${code}', bundledCode)
            .replace(/\s+/g, ' ') // Minimize whitespace
            .trim();
          
          fs.writeFileSync(
            path.resolve(__dirname, 'dist/eventuate.bookmarklet.js'),
            script
          );

          // Create an HTML file for easy bookmarklet installation
          const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Eventuate Bookmarklet</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 2em auto; padding: 0 1em; }
    .bookmarklet { background: #f0f0f0; padding: 1em; border-radius: 4px; }
    .instructions { margin: 2em 0; }
  </style>
</head>
<body>
  <h1>Eventuate Bookmarklet</h1>
  <div class="instructions">
    <p>Drag this link to your bookmarks bar:</p>
    <p class="bookmarklet">
      <a href="${script}">Eventuate</a>
    </p>
  </div>
  <p>Version: ${version}</p>
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