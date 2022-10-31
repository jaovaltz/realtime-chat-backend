const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const auth = require("../middlewares/auth");

async function login({ username, password }) {
  const user = await User.findOne({ username });

  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateToken(username);
      return callback(null, { ...user.toJSON(), token });
    }
  }
  return callback({ message: "Invalid username or password" });
}

async function register(params, callback) {
  if (params.user === undefined) {
    return callback({ message: "Username is required" });
  }

  const user = new User(params);
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

module.exports = {
  login,
  register,
};
