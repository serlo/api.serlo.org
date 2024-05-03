local getInterestsKey = function(interest)
  if interest == 'parent' then 'dec9a97288'
  else if interest == 'teacher' then '05a5ab768a'
  else if interest == 'pupil' then 'bbffc7a064'
  else if interest == 'student' then 'ebff3b63f6'
  else if interest == 'other' then 'd251aad97e';

function(ctx) {
  email_address: if 'subscribedNewsletter' in ctx.identity.traits && ctx.identity.traits.subscribedNewsletter == true then
    ctx.identity.traits.email
  else
    error 'User did not subscribed to newsletter. Aborting!',
  merge_fields: {
    UNAME: ctx.identity.traits.username,
  },
  status: 'subscribed',
  [if 'interest' in ctx.identity.traits then 'interests' else null]: { [getInterestsKey(ctx.identity.traits.interest)]: true },
}
