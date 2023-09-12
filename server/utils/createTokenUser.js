const createTokenUser = (user) => {
  return { name: user.name, userId: user._id, role: user.role,phoneNo:user.phoneNo,country:user.country };
};

module.exports = createTokenUser;
