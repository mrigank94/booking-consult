const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/auth.config");

const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).send("No token provided!");
  }

  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(401).send("Invalid token");
    }

    req.userId = decoded.userId;
    req.isAdmin = decoded.userType === "ADMIN";
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).send("User is not an admin");
  } else {
    next();
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
