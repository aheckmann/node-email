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
  ['to','from','cc','bcc','replyTo','subject','body','bodyType','timeout'].forEach(function(key){
    self[key] = config[key]
  })  
}

Email.prototype.send = function(callback) {
  if (!this.valid(callback)) return
  exec('echo "' + this.msg + '" | sendmail -t', 
    { timeout: this.timeout || exports.timeout }, callback)
}

Email.prototype.__defineGetter__("msg", function() {  
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
  
  return mail.replace(/"/g, '\\"')
})

Email.prototype.valid = function(callback) {
  if (!requiredFieldsExist(this, callback)) return false
  if (!fieldsAreClean(this, callback)) return false
  var validatedHeaders = ['to','from','cc','bcc','replyTo'],
      len = validatedHeaders.length,
      self = this,
      addresses,
      addLen,
      key
  while (len--) {
    key = validatedHeaders[len]
    if (self[key]) {
      addresses = Array.isArray(self[key])
        ? self[key]
        : [self[key]]
      addLen = addresses.length
      while (addLen--) 
        if (!isValidAddress(addresses[addLen])) 
          return error("invalid email address : " + addresses[addLen], callback);       
    }
  }
  return true
}

function requiredFieldsExist(email, callback) { 
  if (!email.from && !exports.from)
    return error('from is required', callback)
 
  if (!email.to)
    return error('to is required', callback)
    
  if (!email.subject)
    return error('subject is required', callback) 
     
  if (!email.body)
    return error('body is required', callback) 
    
  return true
}

var cleanHeaders = ['to','from','cc','bcc','replyTo','subject'],
    injectionrgx = new RegExp( cleanHeaders.join(':|') + ':|content\-type:', 'i' )
    
function fieldsAreClean(email, callback) {
  var len = cleanHeaders.length,
      key
  while (len--) {
    key = cleanHeaders[len]
    if (email[key]) {
      if (injectionrgx.test(email[key])) 
        return error("Header injection detected in [" + key + "]", callback)
      email[key] = email[key].replace(/\n|\r/ig,'')
    }
  }
  return true
}

function error(msg, callback) {
  var err = new Error('node-email error: ' + msg)
  if (callback) {
    callback(err)
    return false
  }
  else
    throw err
}

function formatAddress(what) {
  return Array.isArray(what)
    ? what.join(', ')
    : what
}

// http://bassistance.de/jquery-plugins/jquery-plugin-validation/
var emailrgx = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
    capturergx = /<([^>].*)>$/
    
function isValidAddress(rawAddress) {
  // john smith <email@domain.com> | email@domain.com
  var address = capturergx.exec(rawAddress)
  return address && address[1]
    ? emailrgx.test(address[1])
    : emailrgx.test(rawAddress)
}


exports.timeout = 3000
exports.from = undefined
exports.isValidAddress = isValidAddress
exports.Email = Email
