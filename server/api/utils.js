const requireUser = (req, res, next) => {
  // if user is logged in, pass through
  if (req.userId) {
    next();
  } else {
    // else send them back
    res.status(401).send({ message: `user unauthorized` });
  }
};

module.exports = {
  requireUser,
};
