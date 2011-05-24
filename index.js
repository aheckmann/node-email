
// - node-email Copyright Aaron Heckmann <aaron.heckmann+github@gmail.com> (MIT Licensed)

/**
 * Module dependencies.
 */

var exec = require('child_process').exec;

/**
 * Generates a boundry string.
 * @return {String}
 */

var boundryidx = 0;
function genBoundry () {
  return 'part_' + Date.now() + "_" + boundryidx++;
}

/**
 * Email : Sends email using the sendmail command.
 *
 * Note: sendmail must be installed: see http://www.sendmail.org/
 *
 * @param {Object} config - optional configuration object
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
 *    - altText {string} If `bodyType` is set to 'html', this will be sent
 *      as the alternative text.
 *    - timeout {number} Duration in milliseconds to wait before killing the
 *      process. If not set, defaults to `exports.timeout` global setting.
 *    - path {string} Optional path to the sendmail executable.
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
 *    var myMsg = new Email(
 *    { from: 'me@example.com'
 *    , to:   'you@example.com'
 *    , subject: 'Knock knock...'
 *    , body: "Who's there?"
 *    })
 *    myMsg.send(function(err){
 *      ...
 *    })
 */

function Email (config) {
  config = config || {};

  ; ['to'
    ,'from'
    ,'cc'
    ,'bcc'
    ,'replyTo'
    ,'subject'
    ,'body'
    ,'bodyType'
    ,'altText'
    ,'timeout' ].forEach(function (key) {
    this[key] = config[key];
  }, this);

  this.path = config.path || "sendmail";
}


Email.prototype = {

  send: function (callback) {
    if (!this.valid(callback)) return;
    exec(this.cmd, this.options, callback);
  }

, get cmd () {
    return 'echo "' + this.msg + '" | ' + this.path + ' -t';
  }

, get options () {
    return { timeout: this.timeout || exports.timeout };
  }

, get msg () {
    var msg = new Msg()
      , boundry = genBoundry()
      , to = formatAddress(this.to)
      , cc = formatAddress(this.cc)
      , bcc = formatAddress(this.bcc)
      , html = this.bodyType && 'html' === this.bodyType.toLowerCase()
      , plaintext = !html ? this.body
          : this.altText  ? this.altText
          : '';

    msg.line('To: ' + to);
    msg.line('From: '+ (this.from || exports.from));
    msg.line('Reply-To: ' + (this.replyTo || this.from || exports.from));
    msg.line('Subject: '+ this.subject);

    if (cc) msg.line('CC: ' + cc);

    if (bcc) msg.line('BCC: ' + bcc);

    msg.line('Mime-Version: 1.0');
    msg.line('Content-Type: multipart/alternative; boundary=' + boundry);
    msg.line();

    if (plaintext) {
      msg.line('--' + boundry);
      msg.line('Content-Type: text/plain; charset=utf-8');
      msg.line('Content-Disposition: inline');
      msg.line();
      msg.line(plaintext);
      msg.line();
    }

    if (html) {
      msg.line('--' + boundry);
      msg.line('Content-Type: text/html; charset=utf-8');
      msg.line('Content-Transfer-Encoding: Base64');
      msg.line('Content-Disposition: inline');
      msg.line();
      msg.line(this.encodedBody);
      msg.line();
    }

    return msg.toString();
  }

, get encodedBody () {
    var encoded = (new Buffer(this.body)).toString('base64')
      , len = encoded.length
      , size = 100
      , start = 0
      , ret = ''
      , chunk;

    while (chunk = encoded.substring(start, start + size > len ? len : start + size)) {
      ret += chunk + '\n';
      start += size;
    }

    return ret;
  }

, valid: function (callback) {
    if (!requiredFieldsExist(this, callback)) return false;
    if (!fieldsAreClean(this, callback)) return false;

    var validatedHeaders = ['to','from','cc','bcc','replyTo']
      , len = validatedHeaders.length
      , self = this
      , addresses
      , addLen
      , key;

    while (len--) {
      key = validatedHeaders[len];
      if (self[key]) {
        addresses = toArray(self[key]);
        addLen = addresses.length;
        while (addLen--) {
          if (!isValidAddress(addresses[addLen])) {
            return error("invalid email address : " + addresses[addLen], callback);
          }
        }
      }
    }

    return true;
  }
}


/**
 * Email message constructor.
 *
 * @return {Msg}
 */

function Msg () {
  this.lines = [];
}

Msg.prototype = {

  line: function (text) {
    this.lines.push(text || '');
  }

, toString: function () {
    return this.lines.join('\n').replace(/"/g, '\\"');
  }
}

/**
 * Validation helpers.
 */

var cleanHeaders = ['to','from','cc','bcc','replyTo','subject']
  , injectionrgx = new RegExp(cleanHeaders.join(':|') + ':|content\-type:', 'i');

/**
 * Determines if any email headers contain vulnerabilities.
 *
 * @param {Email} email
 * @param {Function} callback
 * @return {Bool}
 */

function fieldsAreClean (email, callback) {
  var len = cleanHeaders.length
    , header
    , vlen
    , vals
    , val;

  while (len--) {
    header = cleanHeaders[len];

    if (!email[header]) {
      continue;
    }

    vals = toArray(email[header]);
    vlen = vals.length;

    while (vlen--) {
      val = vals[vlen];
      if (val) {
        if (injectionrgx.test(val) || ~val.indexOf("%0a") || ~val.indexOf("%0d")) {
          return error("Header injection detected in [" + header + "]", callback);
        }
        vals[vlen] = val.replace(/\n|\r/ig, '');
      }
    }

    email[header] = 2 > vals.length
      ? vals[0]
      : vals;
  }

  return true;
}

/**
 * Determines if all required email fields exist.
 *
 * @param {Email} email
 * @param {Function} callback
 * @return {Bool}
 */

function requiredFieldsExist (email, callback) {
  if (!email.from && !exports.from) {
    return error('from is required', callback);
  }

  if (!email.to) {
    return error('to is required', callback);
  }

  if (!email.subject) {
    return error('subject is required', callback);
  }

  return true;
}

/**
 * Error helper that throws if no callback is passed. Else
 * executes the callback passing the err as the first argument.
 *
 * @param {String} msg
 * @param {Function} callback
 * @return {Bool|undefined}
 */

function error (msg, callback) {
  var err = new Error('node-email error: ' + msg);

  if (callback) {
    callback(err);
    return false;
  }

  throw err;
}

/**
 * Formats an array of addresses as a string.
 *
 * @param {Array|String} what
 * @return {String}
 */

function formatAddress (what) {
  return Array.isArray(what)
    ? what.join(', ')
    : what;
}

/**
 * Converts `what` to an array.
 *
 * @param {Mixed} what
 * @return {Array}
 */

function toArray (what) {
  return Array.isArray(what)
    ? what
    : [what];
}

/**
 * Email validation regexps.
 * @see http://fightingforalostcause.net/misc/2006/compare-email-regex.php
 */

var emailrgx = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-zрф]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

var capturergx = /<([^>].*)>$/;

/**
 * Determines if `rawAddress` is a valid email address.
 *
 * @param {String} rawAddress
 * @return {Bool}
 */

function isValidAddress (rawAddress) {
  // john smith <email@domain.com> | email@domain.com
  var address = capturergx.exec(rawAddress);
  return address && address[1]
    ? emailrgx.test(address[1])
    : emailrgx.test(rawAddress);
}

/**
 * Exports.
 */

exports.Email = Email;
exports.version = '0.2.4';
exports.from = undefined;
exports.timeout = 3000;
exports.isValidAddress = isValidAddress;

