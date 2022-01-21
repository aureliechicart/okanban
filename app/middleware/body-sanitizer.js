const sanitizer = require('sanitizer');

const bodySanitizer = (req, res, next) => {
  if (req.body) {
    for (let propName in req.body) {
      req.body[propName] = sanitizer.escape( req.body[propName] );
    }
  }
  next();
};

module.exports = bodySanitizer;