const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/** @param {import('webpack').Configuration} config */
module.exports = config => {
  /** @type {import('webpack').Configuration} */
  return {
    ...config,
    externals: [
      // copy all existing external deps from nest
      ...(Array.isArray(config.externals)
        ? config.externals
        : typeof config.externals === 'function'
          ? [config.externals]
          : [config.externals]),
      // ! solving error over "css-inline" dependency on windows
      {
        '@css-inline/css-inline-win32-x64-msvc': 'commonjs @css-inline/css-inline-win32-x64-msvc',
        '@css-inline/css-inline-linux-x64-gnu': 'commonjs @css-inline/css-inline-linux-x64-gnu',
        '@css-inline/css-inline-linux-x64-musl': 'commonjs @css-inline/css-inline-linux-x64-musl',
      },
    ],
    plugins: [
      // copy all existing plugins from nestjs
      ...(config.plugins ?? []),
      // ? used to generate only one file
      new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
      // ? used to solve problem over "pg" lib now depending of "cloudflare" lib
      new webpack.IgnorePlugin({resourceRegExp: /^cloudflare:sockets$/}),
      // ? copying mailer templates to builded directory
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'libs/mailer/src/templates'),
            to: path.resolve(__dirname, 'dist', path.dirname(config.output.filename), 'templates'),
          },
        ],
      }),
    ],
  };
};
