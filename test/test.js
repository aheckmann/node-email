
var assert = require('assert')
  , lib = require('../')
  , Email = lib.Email

var myMail = new Email(
{ to: 'mario@example.com'
, from: 'princess@bowsers-castle.com'
, replyTo:'koopa@bowsers-castle.com'
, subject:'save me mario!'
, altText: 'This is the text alternative.\n\nEnjoy.'
, timeout: 5000
})

assert.doesNotThrow(function(){myMail.valid()}, "Email body is not required.")
   
myMail.body = 'I need saving... <b>again</b>.'
myMail.bodyType = 'html'

myMail.send(function(err){
  assert.ifError(err)
})
