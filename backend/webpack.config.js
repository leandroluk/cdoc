const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

/** @param {import('webpack').Configuration} config */
module.exports = config => {
  /** @type {import('webpack').Configuration} */
  return {
    ...config,
    externals: {
      '@css-inline/css-inline-win32-x64-msvc': 'commonjs @css-inline/css-inline-win32-x64-msvc',
    },
    plugins: [
      ...config.plugins ?? [],
      new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
      new webpack.IgnorePlugin({resourceRegExp: /^cloudflare:sockets$/}),
    ]
  }
}
