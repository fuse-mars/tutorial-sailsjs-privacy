'use strict';
/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function isAuthenticated(req, res, next) {
	const secretCode = 'bearer fusemachines';
	const allowedOrigin = 'localhost'; // || '127.0.0.1';

	console.log(req.ip, req.host, req.url, req.method, req.headers.host, req.headers.authorization);

	// User is allowed, proceed to the next policy, 
	// or if this is the last policy, the controller
	if (req.headers && req.headers.authorization === secretCode &&
		req.host === allowedOrigin) {

    	return next();

	}

	// User is not allowed
	// (default res.forbidden() behavior can be overridden in `config/403.js`)
	return res.forbidden('You are not permitted to perform this action.');
};
