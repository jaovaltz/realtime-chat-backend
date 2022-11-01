const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const auth = require("../middlewares/auth");

async function login({ username, password }, callback) {
  try {
    const user = await User.findOne({ username });

    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = auth.generateAcessToken(username);
        return callback(null, { ...user.toJSON(), token });
      }
    }
    return callback({ message: "Invalid username or password" });
  } catch (error) {
    console.log(error);
  }
}

async function register(params, callback) {
  try {
    if (params.username === undefined) {
      return callback({ message: "Username is required" });
    }

    const user = new User(params);
    user
      .save()
      .then((response) => {
        const token = auth.generateAcessToken(params.username);
        return callback(null, { ...response.toJSON(), token });
      })
      .catch((error) => {
        return callback(error);
      });
  } catch (error) {
    console.log(error);
  }
}

async function changeUserProfilePicture(id, profilePicture, callback) {
  try {
    User.findByIdAndUpdate(
      id,
      { profilePicture },
      { new: true },
      (error, result) => {
        if (error) {
          return callback(error);
        }
        return callback(null, result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function getAllOtherUsers(userId, callback) {
  try {
    const users = await User.find({ _id: { $ne: userId } });
    return callback(null, users);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  login,
  register,
  changeUserProfilePicture,
  getAllOtherUsers,
};
