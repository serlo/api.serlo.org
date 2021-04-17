/* eslint-disable import/no-commonjs */
module.exports = function (api) {
  return {
    plugins: [
      'babel-plugin-import-graphql',
      [
        'babel-plugin-module-resolver',
        {
          alias: {
            '~': './src',
            ...(api.env(['development', 'test'])
              ? {
                  '@serlo/api': '@serlo/api/src',
                  '@serlo/authorization': '@serlo/authorization/src',
                }
              : {}),
          },
        },
      ],
    ],
  }
}
