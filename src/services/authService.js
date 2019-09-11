const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../schemas/user');
const bcrypt = require('bcrypt');

const authService = (() => {
  function login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
      User.findOne({username}, async (err, user) => {
        if (err) {
          res.statusCode = 500;
          return res.json({success: false, error: err});
        }
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const token = jwt.sign(
              {username},
              config.secret,
              {
                expiresIn: '24h'
              }
            );
            return res.json({
              success: true,
              message: 'Authentication successful!',
              token
            });
          }
        }
        res.statusCode = 403;
        return res.json({
          success: false,
          message: 'Incorrect username or password'
        });
      });
    } else {
      res.statusCode = 400;
      return res.json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }

  function register (req, res) {
    let user = new User();
    const {username, password} = req.body;
    if (username && password) {
      User.find({username}, (err, users) => {
        if (err) {
          res.statusCode = 500;
          return res.json({success: false, error: err});
        }
        if (users.length !== 0) {
          res.statusCode = 400;
          return res.json({
            success: false,
            message: 'Username already taken'
          });
        }
        user.username = username;
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.statusCode = 500;
            return res.json({success: false, error: err});
          }
          user.password = hash;
          user.save(err => {
            if (err) {
              res.statusCode = 500;
              return res.json({success: false, error: err});
            }
            return res.json({success: true});
          });
        });
      });
    }
  }

  async function getCurrentUser (req) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    return User.findOne({username: jwt.decode(token, config.secret).username}, (err, user) => {
      if (err) {
        return {success: false, error: err};
      }
      return {success: true, user};
    });
  }

  return {
    login,
    register,
    getCurrentUser
  };
})();

module.exports = authService;
