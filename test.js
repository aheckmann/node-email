
var lib = require('./email'),
    Email = lib.Email
var myMail = new Email({
  to: 'you@example.com',
  from: 'me@example.net',
  replyTo:'else@example.com',
  subject:'greetings',
  body:'This is the <b>message</b>, enjoy.',
  bodyType: 'html',
  altText: 'This is the text alternative.\n\nEnjoy.',
  timeout: 5000
})
myMail.send(function(err){if (err) require('sys').p(err)})
