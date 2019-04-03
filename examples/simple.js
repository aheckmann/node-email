const Email = require('../index').Email;

const msg = new Email({
	to: 'you@example.com',
	subject: 'Knock knock...',
	body: 'Who\'s there?'
});

// if callback is provided, errors will be passed into it
// else errors will be thrown
msg.send((err) => err && console.error(err));