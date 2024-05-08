local claims = std.extVar('claims');

{
  identity: {
    traits: {
      [if "email" in claims then "email" else null]: claims.email,
      username: claims.preferred_username + "-1232kjl",
      interest: "",
    },
  },
}