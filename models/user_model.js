const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//Secure the password with bcrypt using pre=save hook method
userSchema.pre("save", async function (next) {
  //   console.log("pre method", this);
  const user = this;

  // Only hash password if it has been modified or is new
  if (!user.isModified("password")) {
    return next();
  }
  try {
    // USing to Generate Salt bcrypt for secure password
    const salt = await bcrypt.genSalt(10);
    //Hash the Password
    user.password = await bcrypt.hash(user.password, salt);
    next(); // Proceed to save
  } catch (error) {
    next(error); // Pass the error to MOngose
  }
});

//compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

//JSON web Token
userSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error(error);
  }
}; //Instance Method

//Define the model or the collection name
const User = mongoose.model("User", userSchema);

module.exports = User;
