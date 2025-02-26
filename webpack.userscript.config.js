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
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'eventuate.user.js',
    path: path.resolve(__dirname, 'docs'),
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('TampermonkeyPlugin', (compilation) => {
          const bundledCode = fs.readFileSync(
            path.resolve(__dirname, 'docs/eventuate.user.js'),
            'utf8'
          );
          const template = fs.readFileSync(
            path.resolve(__dirname, 'src/userscript.template.js'),
            'utf8'
          );
          const version = require('./package.json').version;
          const script = template
            .replace('${version}', version)
            .replace('${code}', bundledCode);

          fs.writeFileSync(
            path.resolve(__dirname, 'docs/eventuate.user.js'),
            script
          );
        });
      },
    },
  ],
};
