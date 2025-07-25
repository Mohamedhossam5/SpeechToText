const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwts = "yourSuperSecretKey";

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "Email doesn't exist" });
    }

    const passowrdMatchs = await bcrypt.compare(password, user.password);

    if (!passowrdMatchs) {
      return res.status(404).json({error: "Wrong password!"});
    }

    const loginToken = jwt.sign({id: user._id}, jwts, {expiresIn:"1h"});
    res.status(200).json({ Message: "Login successfully", loginToken });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldn't log in" });
  }
};

exports.register = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(404).json({ error: "Email already exists" });
    }

    const hashedPasword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      password: hashedPasword,
    });

    await user.save();

    res.status(201).json({ Message: "Account created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldn't create account" });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
};
