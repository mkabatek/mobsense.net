// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'XXXXXX', // your App ID Facebook
		'clientSecret' 	: 'XXXXXX', // your App Secret Facebook
		'callbackURL' 	: 'https://mobsense.net/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'XXXXXX', // your App ID Twitter
		'consumerSecret' 	: 'XXXXXX', // your App Secret Twitter
		'callbackURL' 		: 'https://mobsense.net/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'XXXXXX', // your App ID Google
		'clientSecret' 	: 'XXXXXX', // your App Secret Google
		'callbackURL' 	: 'https://mobsense.net/auth/google/callback'
	}

};
