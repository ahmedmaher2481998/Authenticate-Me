const { validationResult } = require("express-validator");
exports.validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const err = new Error();
    err.title = "Bad request.'";
    err.message = errors.errors.map((error) => `${error.msg}`);
    err.errors = [...errors.errors];
    err.status = 400;
    next(err);
  } else {
    next();
  }
};
