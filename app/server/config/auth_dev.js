// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'XXXXXXX', // your App ID Facebook
		'clientSecret' 	: 'XXXXXXX', // your App Secret Facebook
		'callbackURL' 	: 'http://127.0.0.1:8084/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'XXXXXXX', // your App ID Twitter
		'consumerSecret' 	: 'XXXXXXX', // your App Secret Twitter
		'callbackURL' 		: 'http://127.0.0.1:8084/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'XXXXXXX', // your App ID Google
		'clientSecret' 	: 'XXXXXXX', // your App Secret Google
		'callbackURL' 	: 'http://127.0.0.1:8084/auth/google/callback'
	}

};
