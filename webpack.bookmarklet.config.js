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
            console.warn('Warning: Bookmarklet exceeds Chrome\'s size limit!');
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

          const html = `
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Window-Target" content="_top" />
    <meta http-equiv="X-Clacks-Overhead" content="GNU Terry Pratchett" />
    <meta name="application-name" content="Eventuate" />
    <meta name="description" content="a tool for parkrun report writers" />
    <meta name="keywords" content="parkrun" />
    <meta
      name="msapplication-square150x150logo"
      content="https://johnsy.com/icons/mstile-150x150.png"
    />
    <meta
      name="msapplication-square310x310logo"
      content="https://johnsy.com/icons/mstile-310x310.png"
    />
    <meta
      name="msapplication-square70x70logo"
      content="https://johnsy.com/icons/mstile-70x70.png"
    />
    <meta name="msapplication-TileColor" content="#FFFFFF" />
    <meta
      name="msapplication-TileImage"
      content="https://johnsy.com/icons/mstile-144x144.png"
    />
    <meta
      name="msapplication-wide310x150logo"
      content="https://johnsy.com/icons/mstile-310x150.png"
    />
    <meta name="MSSmartTagsPreventParsing" content="TRUE" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      property="og:description"
      content="a tool for parkrun report writers"
    />
    <meta
      property="og:image"
      content="https://johnsy.com/icons/favicon-196x196.png"
    />
    <meta property="og:title" content="Eventuate" />
    <meta property="og:url" content="https://johnsy.com/eventuate/" />
    <link
      href="https://johnsy.com/assets/css/colors-dark.css"
      rel="alternate stylesheet"
      title="Dark"
    />
    <link
      href="https://johnsy.com/assets/css/colors-light.css"
      rel="stylesheet"
      title="Light"
    />
    <link
      href="https://johnsy.com/assets/css/style-20150308.css"
      rel="stylesheet"
    />
    <link href="./style.css" rel="stylesheet" />
    <link
      rel="apple-touch-icon"
      sizes="114x114"
      href="https://johnsy.com/icons/apple-touch-icon-114x114.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="120x120"
      href="https://johnsy.com/icons/apple-touch-icon-120x120.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="144x144"
      href="https://johnsy.com/icons/apple-touch-icon-144x144.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="152x152"
      href="https://johnsy.com/icons/apple-touch-icon-152x152.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="57x57"
      href="https://johnsy.com/icons/apple-touch-icon-57x57.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="60x60"
      href="https://johnsy.com/icons/apple-touch-icon-60x60.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="72x72"
      href="https://johnsy.com/icons/apple-touch-icon-72x72.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="76x76"
      href="https://johnsy.com/icons/apple-touch-icon-76x76.png"
    />
    <link
      rel="Help"
      href="https://johnsy.com/about/"
      title="What is the point of this website?"
    />
    <link
      rel="icon"
      type="image/png"
      href="https://johnsy.com/icons/favicon-128.png"
      sizes="128x128"
    />
    <link
      rel="icon"
      type="image/png"
      href="https://johnsy.com/icons/favicon-16x16.png"
      sizes="16x16"
    />
    <link
      rel="icon"
      type="image/png"
      href="https://johnsy.com/icons/favicon-196x196.png"
      sizes="196x196"
    />
    <link
      rel="icon"
      type="image/png"
      href="https://johnsy.com/icons/favicon-32x32.png"
      sizes="32x32"
    />
    <link
      rel="icon"
      type="image/png"
      href="https://johnsy.com/icons/favicon-96x96.png"
      sizes="96x96"
    />
    <link
      rel="shortcut icon"
      title="pajIcon"
      href="https://johnsy.com/favicon.ico"
    />
    <link rel="Start" href="https://johnsy.com/" title="Back to the start" />
    <title>johnsy.com/eventuate/bookmarklet --A tool for parkrun report writers</title>
  </head>
  <body>
    <div id="page">
      <div id="content">
        <h1><a href="http://johnsy.com/eventuate/">Eventuate</a></h1>
        <h1>Eventuate Bookmarklet</h1>
        <div class="instructions">
        <p>Drag this link to your bookmarks bar:</p>
        <p class="bookmarklet">
          <a href="javascript:${encodeURIComponent(script)}">Eventuate v${version}</a>
        </p>
        ${sizeKB > 30 ? '<p class="warning">Warning: This bookmarklet may not work in Chrome due to size limitations.</p>' : ''}
        </div>
         <p>Size: ${sizeKB.toFixed(2)}KB</p>
     </div>
    </div>
  </body>
</html>`;

          fs.writeFileSync(
            path.resolve(__dirname, 'docs/bookmarklet.html'),
            html
          );
        });
      },
    },
  ],
};