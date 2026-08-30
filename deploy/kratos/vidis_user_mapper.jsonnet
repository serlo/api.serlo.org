local claims = std.extVar('claims');

local enshortenUuid(uuid) = std.split(uuid, '-')[0];

local extractFromClaims = function(fieldName)
  if fieldName in claims then claims[fieldName] else null;

local uuid = extractFromClaims('sub');

local buildEmail = function()
  local email = extractFromClaims('email');

  if email != '' && email != null
  then email
  else enshortenUuid(uuid) + '@fakeemail.vidis';

local buildUsername = function()
  local preferredUsername = extractFromClaims('preferred_username');
  local truncatedUsername = if std.length(preferredUsername) > 23
  then std.substr(preferredUsername, 0, 23)
  else preferredUsername;

  if truncatedUsername != '' && truncatedUsername != null
  then truncatedUsername + '-' + enshortenUuid(uuid)
  else enshortenUuid(uuid);

local checkIfIsTeacher = function()
  local rawClaims = extractFromClaims('raw_claims');

  if 'rolle' in rawClaims then rawClaims.rolle == 'LEHR' else false;

if checkIfIsTeacher() then {
  identity: {
    traits: {
      email: buildEmail(),
      username: buildUsername(),
      interest: 'other',
    },
  },
} else error 'ERR_BAD_ROLE'
