const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to my server");
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { username, email, phone, password } = req.body;

    // To check that email id is present or not in database
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "email already exists" });
    }

    //Create a new user
    const userCreated = await User.create({ username, email, phone, password });

    res.status(200).json({
      message: "registration sucessful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error(error); //log error
    res.status(500).json("internal server error");
  }
};

//User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Email is valid or not
    const userExist = await User.findOne({ email });
    console.log(userExist);
    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //Compare Password
    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if (isPasswordValid) {
      res.status(200).json({
        message: "login successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { home, register, login };
