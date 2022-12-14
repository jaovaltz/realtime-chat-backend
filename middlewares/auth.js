const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401, "Token can't be null");

  jwt.verify(token, "Snipppet_SECRETKEY", async (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = await User.findOne({ username: user.data });
    next();
  });
}

async function quickAuth(token) {
  const user = await jwt.verify(
    token,
    "Snipppet_SECRETKEY",
    async (err, user) => {
      if (err) return null;
      return await User.findOne({ username: user.data });
    }
  );
  return user;
}

function generateAcessToken(username) {
  return jwt.sign({ data: username }, "Snipppet_SECRETKEY", {
    expiresIn: "1h",
  });
}

module.exports = {
  authenticateToken,
  generateAcessToken,
  quickAuth,
};
