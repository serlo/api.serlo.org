// eslint-disable-next-line import/no-commonjs
module.exports = {
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '~': './src',
        },
      },
    ],
  ],
}
