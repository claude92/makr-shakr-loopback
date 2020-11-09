'use strict';
const jwt = require('jsonwebtoken');

module.exports = function (app) {
  var Role = app.models.Role;
  Role.registerResolver('JWTauthenticated', (role, context, cb) => {
    let accessToken = context.remotingContext.req.headers.authorization;
    if(accessToken){
      accessToken = accessToken.split(' ')[1];
    }
    console.log(accessToken);
    // Bearer <token>
    if (!accessToken) {
      return process.nextTick(() => cb(null, false));
    }
    let payload;
    try {
      console.log(process.env.ACCESS_TOKEN_SECRET);
      payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (e) {
      return process.nextTick(() => cb(null, false));
    }
    return process.nextTick(() => cb(null, true));
  });
};
