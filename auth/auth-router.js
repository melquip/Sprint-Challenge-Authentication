const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./auth-model');

router.post('/register', validateUserBody, (req, res, next) => {
  // implement registration
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 11);
  Users.add({ username, password: hashedPassword }).then(user => {
    res.status(201).json({ id: user.id, username: user.username });
  }).catch(next);
});

router.post('/login', validateUserBody, (req, res, next) => {
  // implement login
  const { username, password } = req.body;
  Users.getUser({ username }).then(user => {
    if (!user) {
      next({ message: "Invalid credentials", status: 400 });
    } else {
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        next({ message: "Invalid credentials", status: 400 });
      } else {
        const token = generateToken(user);
        res.status(200).json({ token });
      }
    }
  }).catch(next);
});

// validate the user register and login post req.body
function validateUserBody(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    next({ message: 'Missing one of the required `username` or `password` fields!', status: 401 });
  } else {
    req.body = { username, password };
    next();
  }
}

// error middleware
router.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    file: 'auth-router',
    method: req.method,
    url: req.url,
    status: error.status || 500,
    message: error.message
  }).end();
})

function generateToken(user) {
  return jwt.sign(
    {
      subject: user.id,
      username: user.username,
    },
    (process.env.NODE_ENV === 'development' ? 'secret' : process.env.JWT_SECRET),
    {
      expiresIn: '1d',
    }
  );
}

module.exports = router;
