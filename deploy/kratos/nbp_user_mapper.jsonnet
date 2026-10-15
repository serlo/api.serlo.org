local claims = std.extVar('claims');

local enshortenUuid(uuid) = std.split(uuid, '-')[0];

{
  identity: {
    traits: {
      email: enshortenUuid(claims.sub) + '@nbp',
      username: enshortenUuid(claims.sub),
      interest: '',
    },
  },
}
