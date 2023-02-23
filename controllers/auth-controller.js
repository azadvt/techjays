const jwt = require("jsonwebtoken");
const User = require("../models/user");  

const generateToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
  } catch (error) {
    res.status(500).json({ Err: error });
  }
};

const login = async (req, res,next) => {
    try {   
        const { email, password } = req.body;
        let user = await User.findOne({ email});
        if (!user || !user.comparePassword(password)) {
          return res.status(400).json({
            success: false,
            message: "Invalid username or password",
          });
        }
        await user.save();
        user = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: generateToken(user._id),
        };
    
        res.status(200).json({
          success: true,
          user,
          message: "User logged in successfully",
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: err.message,
        });
      }
};
const signup = async (req, res,next) => {
  try {
    let user = new User(req.body);
    await user.save()
    user = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id),
    };
    res
      .status(201)
      .json({ success: true, user, message: "User signed up successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
        let errors = {};
        Object.keys(err.errors).forEach((key) => {
          errors[key] = err.errors[key].message;
        });
        return res.status(400).json({ success: false, message: errors });
      }
      if (err && err.code === 11000) {
        return res
          .status(409)
          .json({ success: false, message: "User already exist" });
      }
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
  }
};
module.exports = { login, signup };
