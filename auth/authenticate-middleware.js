/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const secret = (process.env.NODE_ENV === 'development' ? 'secret' : process.env.JWT_SECRET);
  if (token) {
    jwt.verify(token, secret, (err, decodedUser) => {
      if (err) {
        next({ message: err, status: 400 });
      } else {
        req.loggedInUser = decodedUser;
        next();
      }
    });
  } else {
    next({ message: "YOU SHALL NOT PASS!", status: 401 });
  }
};
