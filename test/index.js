
var assert = require('assert')
  , lib = require('../')
  , gleak = require('gleak')()
  , Email = lib.Email

lib.timeout = 10000

var myMail = new Email(
{ to: 'mario@example.com'
, cc: 'luigi@example.com'
, bcc: 'toad@example.com'
, from: 'princess@bowsers-castle.com'
, replyTo:'koopa@bowsers-castle.com'
, subject:'save me mario!'
, altText: 'This is the text alternative.\n\nEnjoy.'
})

assert.doesNotThrow(function(){myMail.valid()}, "Email body is not required.")

assert.equal(myMail.options.timeout, lib.timeout, "email should use Email.timeout setting when not set on instance")

myMail.timeout = 5000

assert.equal(myMail.options.timeout, 5000, "email should use instance setting when set on instance")

myMail.body = '<html><body><b>this id bold</b><table><tbody><tr><td width="100%">'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'text text text text text text text text text text text text text text text text text text text text text text text'
+'</td></tr></tbody></table></body></html>'


var actualMsg = myMail.msg
  , lines = actualMsg.split("\n")

assert.equal(lines.length, 15, "Incorrect number of lines generated")
assert.equal(lines[0], "To: mario@example.com", "Unexpected To: header")
assert.equal(lines[1], "From: princess@bowsers-castle.com", "Unexpected From: header")
assert.equal(lines[2], "Reply-To: koopa@bowsers-castle.com", "Unexpected Reply-To: header")
assert.equal(lines[3], "Subject: save me mario!", "Unexpected Subject: header")
assert.equal(lines[4], "CC: luigi@example.com", "Unexpected CC: header")
assert.equal(lines[5], "BCC: toad@example.com", "Unexpected BCC: header")

assert.equal(lines[6], "Mime-Version: 1.0", "Unexpected Mime: header")
assert.ok(/^Content-Type\: multipart\/alternative; boundary=part_/.test(lines[7]), "Unexpected Content-Type: header (mail message)")
assert.equal(lines[10], "Content-Type: text/plain; charset=utf-8", "Unexpected Content-Type: header (plaintext)")
assert.equal(lines[11], "Content-Disposition: inline", "Unexpected Content-Disposition: header (plaintext)")

var expectedPlainTextMsg = '<html><body><b>this id bold</b><table><tbody><tr><td width=\\"100%\\">text text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text text text text text text text text text</td></tr></tbody></table></body></html>'

assert.equal(lines[13], expectedPlainTextMsg, "Unexpected message body (plaintext)")

myMail.to = ["mario@example.com","Luigi <luigi@example.com>"]
myMail.cc = ["Donkey Kong <donkeykong@example.com>","Gumba<gumba@example.com>"]
myMail.bcc = ["MegaMan <megaman@example.com>","contra@example.com"]
myMail.from = "Princess <princess@bowsers-castle.com>"
myMail.bodyType = "html"
myMail.altText = "This is the alt text. I hope you love it."

myMail.replyTo = "Koopa <koopa@badaddress>"
assert.throws(function(){myMail.valid()}, "Email addresses should not be valid")

myMail.replyTo = "Koopa <koopa@bowsers-castle.com>"
assert.doesNotThrow(function(){myMail.valid()}, "Email addresses should be valid")


var actualMsg = myMail.msg
  , lines = actualMsg.split("\n")

assert.equal(lines.length, 101, "Incorrect number of lines generated")
assert.equal(lines[0], "To: mario@example.com, Luigi <luigi@example.com>", "Unexpected To: header")
assert.equal(lines[1], "From: Princess <princess@bowsers-castle.com>", "Unexpected From: header")
assert.equal(lines[2], "Reply-To: Koopa <koopa@bowsers-castle.com>", "Unexpected Reply-To: header")
assert.equal(lines[3], "Subject: save me mario!", "Unexpected Subject: header")
assert.equal(lines[4], "CC: Donkey Kong <donkeykong@example.com>, Gumba<gumba@example.com>", "Unexpected CC: header")
assert.equal(lines[5], "BCC: MegaMan <megaman@example.com>, contra@example.com", "Unexpected BCC: header")
assert.equal(lines[6], "Mime-Version: 1.0", "Unexpected Mime: header")
assert.ok(/^Content-Type\: multipart\/alternative; boundary=part_/.test(lines[7]), "Unexpected Content-Type: header (mail message)")
assert.equal(lines[10], "Content-Type: text/plain; charset=utf-8", "Unexpected Content-Type: header (plaintext)")
assert.equal(lines[11], "Content-Disposition: inline", "Unexpected Content-Disposition: header (plaintext)")
assert.equal(lines[13], "This is the alt text. I hope you love it.", "Unexpected alt text message")
assert.equal(lines[16], "Content-Type: text/html; charset=utf-8", "Unexpected Content-Type: header (html)")
assert.equal(lines[17], "Content-Transfer-Encoding: Base64", "Unexpected Content-Transfer-Encoding: header (html)")
assert.equal(lines[18], "Content-Disposition: inline", "Unexpected Content-Disposition: header (html)")

assert.equal(lines[20], 'PGh0bWw+PGJvZHk+PGI+dGhpcyBpZCBib2xkPC9iPjx0YWJsZT48dGJvZHk+PHRyPjx0ZCB3aWR0aD0iMTAwJSI+dGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[21], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[22], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[23], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[24], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[25], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[26], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4', "Unexpected base64 encoding")
assert.equal(lines[27], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[28], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[29], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[30], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[31], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[32], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[33], 'ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[34], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[35], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[36], 'dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[37], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[38], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[39], 'dGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[40], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[41], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[42], 'eHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[43], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[44], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[45], 'IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[46], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[47], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[48], 'ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[49], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[50], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[51], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[52], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[53], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[54], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[55], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[56], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[57], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[58], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[59], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[60], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[61], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[62], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[63], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[64], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4', "Unexpected base64 encoding")
assert.equal(lines[65], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[66], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[67], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[68], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[69], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[70], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[71], 'ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[72], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[73], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[74], 'dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[75], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[76], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[77], 'dGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[78], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[79], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[80], 'eHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[81], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[82], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[83], 'IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[84], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[85], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[86], 'ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[87], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[88], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[89], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[90], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[91], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQg', "Unexpected base64 encoding")
assert.equal(lines[92], 'dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0', "Unexpected base64 encoding")
assert.equal(lines[93], 'ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[94], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRl', "Unexpected base64 encoding")
assert.equal(lines[95], 'eHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4', "Unexpected base64 encoding")
assert.equal(lines[96], 'dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0dGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[97], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0', "Unexpected base64 encoding")
assert.equal(lines[98], 'IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0PC90ZD48L3RyPjwvdGJvZHk+PC90YWJsZT48L2JvZHk+PC9odG1sPg==', "Unexpected base64 encoding")



// address validation tests
assert.ok(lib.isValidAddress("email@domain.com"), "Email address should be valid")
assert.ok(!lib.isValidAddress("email@.com"), "Email address should not be valid")
assert.ok(!lib.isValidAddress("@n.com"), "Email address should not be valid")
assert.ok(!lib.isValidAddress("domain.com"), "Email address should not be valid")
assert.ok(lib.isValidAddress("l3tt3rsAndNumb3rs@domain.com"), "Email address should be valid")
assert.ok(lib.isValidAddress("has-dash@domain.com"), "Email address should be valid (has dash)")
assert.ok(lib.isValidAddress("hasApostrophe.o'leary@domain.org"), "Email address should be valid (has apostrophe)")
assert.ok(lib.isValidAddress("email@domain.museum"), "Email address should be valid (uncommon TLD)")
assert.ok(lib.isValidAddress("email@domain.travel"), "Email address should be valid (uncommon TLD)")
assert.ok(lib.isValidAddress("email@domain.mobi"), "Email address should be valid (uncommon TLD)")
assert.ok(lib.isValidAddress("email@domain.uk"), "Email address should be valid (country code)")
assert.ok(lib.isValidAddress("email@domain.rw"), "Email address should be valid (country code)")
assert.ok(lib.isValidAddress("email@566.com"), "Email address should be valid (numbers in domain)")
assert.ok(lib.isValidAddress("ema_il@domain.com"), "Email address should be valid (underscore in local)")
assert.ok(lib.isValidAddress("email@127.0.0.1"), "Email address should be valid (IP instead of domain)")
assert.ok(lib.isValidAddress("email@127.0.0.1:25"), "Email address should be valid (IP and port)")
assert.ok(lib.isValidAddress("email@sub.domain.com"), "Email address should be valid (subdomain)")
assert.ok(lib.isValidAddress("email@dom-ain.com"), "Email address should be valid (dash in domain)")
assert.ok(lib.isValidAddress("e.mail@domain.com"), "Email address should be valid (dot in local)")
assert.ok(lib.isValidAddress("e@domain.com"), "Email address should be valid (single letter local)")
assert.ok(lib.isValidAddress("email@d.com"), "Email address should be valid (single letter domain)")
assert.ok(lib.isValidAddress("&*=?^+{}'~@validCharsInLocal.net"), "Email address should be valid (valid special chars in local)")
assert.ok(lib.isValidAddress("email@domain.newTLD"), "Email address should be valid (new TLD)")
assert.ok(lib.isValidAddress("email@domain.рф"), "Email address should be valid (puny Code)")

var leaks = gleak.detect();
assert.equal(leaks.length, 0);

console.log("\u001B[32mAll tests passed\u001B[0m")
