var sys = require('sys'),
    exec = require('child_process').exec

exports.version = '0.0.1'

/**
 * Email : Sends email using the sendmail command.
 *
 * Note: sendmail must be installed: see http://www.sendmail.org/
 *
 * @param {object} config - optional configuration object 
 *    - to {array|string} Email address(es) to which this msg will be sent
 *    - from {string} Email address from which this msg is sent. If not set
 *      defaults to the `exports.from` global setting.
 *    - replyTo {string} Email address to which replies will be sent. If not
 *      set defaults to `from`
 *    - cc {array|string} Email address(es) who receive a copy
 *    - bcc {array|string} Email address(es) who receive a blind copy
 *    - subject {string} The subject of the email
 *    - body {string} The message of the email
 *    - bodyType {string} Content type of body. Only valid option is 
 *      'html' (for now). Defaults to text/plain.
 *    - timeout {number} Duration in milliseconds to wait before killing the 
 *      process. If not set, defaults to `exports.timeout` global setting.
 *
 * Global settings
 *    - exports.timeout {number} Duration in milliseconds to wait before 
 *      killing the process. Defaults to 3000. Used when `timeout` is not set
 *      on a message.
 *    - exports.from {string} Email address from which messages are sent. Used
 *      when `from` was not set on a message.
 *
 * Example:
 *    var Email = require('path/to/email').Email
 *        myMsg = new Email({
 *          from: 'me@example.com',
 *          to:   'you@example.com',
 *          subject: 'Knock knock...',
 *          body: "Who's there?"
 *        })
 *    myMsg.send(function(err){
 *      ...
 *    })
 *
 **/
 
function Email(config) {
  var self = this
  config = config || {};
  ['to','from','cc','bcc','replyTo','subject','body','bodyType','timeout'].forEach(function(val){
    self[val] = config[val]
  })  
}

Email.prototype.send = function(callback) {
  exec('echo "' + this._buildMsg() + '" | sendmail -t', 
    { timeout: this.timeout || exports.timeout }, callback)
}

Email.prototype._buildMsg = function() {
  if (!this.from && !exports.from)
    error('from is required')
    
  if (!this.to)
    error('to is required')

  if (!this.subject)
    error('subject is required')
  
  if (!this.body)
    error('body is required')
    
  var bcc = formatAddress(this.bcc),
      cc = formatAddress(this.cc),
      to = formatAddress(this.to),
      mail = ''
      
  mail += 'To:' + to + '\n'
  mail += 'From:'+ (this.from || exports.from) +'\n' 
  mail += 'Reply-To:' + (this.replyTo || this.from || exports.from) +'\n'   
  
  if (cc) 
    mail += 'CC:'+ cc +'\n'
    
  if (bcc) 
    mail += 'BCC:'+ bcc +'\n' 
  
  if (this.bodyType && 'html' === this.bodyType.toLowerCase()) {
    mail += 'MIME-Version: 1.0\n'
    mail += 'Content-Type: text/html; charset=UTF-8\n'
    mail += 'Content-Transfer-Encoding: 8bit\n'
  }
  
  mail += 'Subject:'+ this.subject +'\n'
  mail += '\n' + this.body + '\n'
  
  return mail
  
}
exports.timeout = 3000
exports.from = undefined
exports.Email = Email



function error(msg) {
  throw new Error('node-email error: ' + msg)
}

function formatAddress(what) {
  return Array.isArray(what)
    ? what.join(', ')
    : what
}