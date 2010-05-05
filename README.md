# node-email

A simple wrapper for the sendmail command

## Installation

[Sendmail](http://www.sendmail.org/) must be installed.

## Example
    var Email = require('path/to/email').Email
        myMsg = new Email({
          from: 'me@example.com',
          to:   'you@example.com',
          subject: 'Knock knock...',
          body: "Who's there?"
        })
    
    // callback is optional
    myMsg.send(function(err){
      ...
    })

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
  - timeout {number} 
    - Duration in milliseconds to wait before killing the process. 
      If not set, defaults to `exports.timeout` global setting.

  Global settings
  
  - exports.timeout {number} 
    - Duration in milliseconds to wait before killing the process. 
      Defaults to 3000. Used when `timeout` is not set on a message.
  - exports.from {string} 
    - Email address from which messages are sent. Used
      when `from` was not set on a message.

## Injection
Only minimal protection against injection attacks is being done now.
Use at your own risk. Or better yet, fork it and submit something 
better!
 
## License 

(The MIT License)

Copyright (c) 2010 [Aaron Heckmann](aaron.heckmann+github@gmail.com)

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