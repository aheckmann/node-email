# node-email

A simple wrapper for the sendmail command

## Installation

First make sure [Sendmail](http://www.sendmail.org/) is installed.

then either

    npm install email

or 

    git clone git://github.com/aheckmann/node-email.git

## Examples
    var Email = require('path/to/email').Email
    var myMsg = new Email(
    { from: "me@example.com"
    , to:   "you@example.com"
    , subject: "Knock knock..."
    , body: "Who's there?"
    })
    
    // if callback is provided, errors will be passed into it
    // else errors will be thrown
    myMsg.send(function(err){ ... })

In this example we set the global `from` property so that all
email is sent from the same address.
    
    var lib = require('path/to/email')
      , Email = lib.Email;
        
    lib.from = 'someAddress@youAlwaysSendFrom.com'
    
    // no need to set the from property, already set
    var mail = new Email(
    { to: "you@example.com"
    , subject: "Knock knock..."
    , body: "Who's there?"
    })
    mail.send()

Note that no callback was passed into `send()`, therefore errors will throw.
    

## Options
 
    new Email(config)
    
  config options:
  
  - to {array|string} 
    - Email address(es) to which this msg will be sent
  - from {string} 
    - Email address from which this msg is sent. If not set
      defaults to the `exports.from` global setting.
  - replyTo {string} 
    - Email address to which replies will be sent. If not set 
      defaults to `from`
  - cc {array|string} 
    - Email address(es) who receive a copy
  - bcc {array|string} 
    - Email address(es) who receive a blind copy
  - subject {string} 
    - The subject of the email
  - body {string} 
    - The message of the email
  - bodyType {string} 
    - Content type of body. Only valid option is 'html' (for now). 
      Defaults to text/plain.
  - altText {string}
    - If `bodyType` is set to 'html', this will be sent as the text
      alternative.
  - timeout {number} 
    - Duration in milliseconds to wait before killing the process. 
      If not set, defaults to `exports.timeout` global setting.
  - path {string}
    - Optional path to the sendmail executable

  Global settings
  
  - exports.timeout {number} 
    - Duration in milliseconds to wait before killing the process. 
      Defaults to 3000. Used when `timeout` is not set on a message.
  - exports.from {string} 
    - Email address from which messages are sent. Used
      when `from` was not set on a message.

## Injection
Some protection against injection attacks is enabled. Use at your own 
risk. Or better yet, fork it and submit something better!

## Node version
Compatible with v0.1.92+
See the [node compatibility](http://wiki.github.com/ry/node/library-compatibility) page for working with earlier node versions.
 
## License 

(The MIT License)

Copyright (c) 2011 [Aaron Heckmann](aaron.heckmann+github@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
