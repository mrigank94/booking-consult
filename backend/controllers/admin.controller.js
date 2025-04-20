const User = require("../models/user.model");

const getAllUsers = async (req, res) => {
  const status = req.query.status;

  const filter = status ? { userStatus: status } : undefined;
  console.log(status);
  const users = await User.find(filter).select("-password");

  res.status(200).send(users);
};

const approveUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    userStatus: "APPROVED",
  }).select("-password");
  res.send(user);
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id).select("-password");
  res.send("User Deleted Succedully");
};

module.exports = {
  deleteUser,
  approveUser,
  getAllUsers,
};
