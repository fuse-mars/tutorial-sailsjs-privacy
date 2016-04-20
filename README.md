# Tutorial-sailsjs-privacy

Protecting your data using sails policy

# Prerequisite
* Intermediate Knowledge of [Nodejs](https://nodejs.org/en/)

# Inspiration
[An article](https://kev.inburke.com/kevin/dont-use-sails-or-waterline/) by [@ekrubnivek](https://twitter.com/ekrubnivek) brought to the table, all reasons for **NOT using Sailsjs in production**. However, at [Fusemachines](https://www.fusemachines.com), we have an application written in Sailsjs that handles third part information. So I did some digging and found out that the security concerns mentioned in this article, are no longer a great concern if you know what you are doing. 

Few key points that we followed to continue using Sailsjs (i came up with these by myself by the way).
* An internet application is supposed to be accessible by the public, so it makes sense for Sailsjs team to make **generated routes**, public by default.
* Sailsjs uses expressjs behind the scene, which is a well known nodejs web server!
* Sailsjs team has improved their security policy guidelines, a closed [github issue](https://github.com/balderdashy/sails/issues/2830) has more detail. 

# The good
[Sailsjs](sailsjs.org) is a great framework for building backend applications that serve information through REST API's.
Its [ORM](https://en.wikipedia.org/wiki/Object-role_modeling) makes it very very easy to manage data entry and retrieval. 

# The bad
The ease for data entry and retrieval is great for development and testing purposes, but really bad for production purposes.

# Sailsjs Policies
In short, a **sailsjs policy** is a javascript function that runs **before** any bound controller's action can get executed.
This function contains logic for *authorization* and *access control*.

More info can be found at [sailsjs site](http://sailsjs.org/documentation/concepts/policies)

# Goal
We are creating a **secured** app to manage different `teams` in a company.
A team can have a name, a description, and a list of members.

# Steps
0. Create a new sails app and go inside it.
Make sure your nodejs version is at least v4.4.2 and sailjs is v0.12.1
```
sails new sailsjs-privacy; cd sailsjs-privacy
```
1. Create a team API
```
sails generate api team
```

2. add some attributes
```javascript
module.exports = {

  attributes: {
  	name: {
    	type: 'string',
        required: true,
    	unique: true
  	},
  	description: {
  		type: 'string',
        required: true,
      	minLength: 5
  	},
  	members: {
  		type: 'array',
        required: true
  	}
  }

};
```

3. run the app and make sure you can access the team API
```
sails lift
```

4. save some data 
```
http://localhost:1337/team/create?name=team&description=hi%20there&members[]=mars1&members[]=mars2
```

5. make sure that the data has ben saved
```
http://localhost:1337/team/find
```

6. create a policy that restrict access to team API
 * can only be viewed locally i.e. the calling host is localhost
 * can only be viewed if you provide the right authorization code
```
// <root-folder>/api/policies/isAuthenticated.js
module.exports = function isAuthenticated(req, res, next) {
	const secretCode = 'bearer fusemachines';
	const allowedOrigin = 'localhost';

	if (req.headers && req.headers.authorization === secretCode &&
	    req.host === allowedOrigin) {
	    // user is allowed
    	return next();
	}

	// User is not allowed
	return res.forbidden('You are not permitted to perform this action.');
};
```
7. use the policy
```javascript
// <root-folder>/config/policies.js
module.exports.policies = {
  TeamController: {
    '*': 'isAuthenticated'
  }
};
```
8. restart the app

9. make sure that you cannot access the team API unless you provide the `authorization code`
```bash
# using curl
# unauthorized access
curl http://localhost:1337/team

# authorized access
curl --header "authorization: bearer fusemachines" http://localhost:1337/team
```

10. We did it!
