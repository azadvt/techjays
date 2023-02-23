const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userProtect = async (req, res, next) => {
  let token;
    console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {

        token = req.headers.authorization.split(" ")[1];


      const decoded = jwt.verify(token, process.env.JWT_SECRET);
     console.log(decoded);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("not authorized, no token");
  }
};

module.exports = { userProtect };
