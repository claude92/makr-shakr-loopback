'use strict';

const jwt = require('jsonwebtoken');
const {User} = require('loopback');

module.exports = {
  login: (req, res) => {
    const {email, password} = req.body;
    console.log(email);
    User.findOne({email}, (err, user) => {
      let result = {};
      let status = 200;
      if (!err && user) {
        user.hasPassword(password, (err, isMatch) => {
                    // password matched
          if (!err && isMatch === true) {
            status = 200;
            const payload = {user: user.email};
            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_LIFE});
            res.cookie('jwt', accessToken, {httpOnly: true});
            res.status(status).send({token: accessToken});
          } else {
                        // unauthorized
            res.status(401).send('WRONG_PASSWORD');
          }
        });
      } else {
        console.log('user not found');
                // unauthorized
        res.status(401).send();
      }
    });
  },
};
