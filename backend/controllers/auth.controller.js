import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors = {};

    if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
    }
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      errors.username = "This username already exists. Please try another one.";
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      errors.email = "This email already exists. Please try another one.";
    }

    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (username.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (fullname.length < 3) {
      errors.fullname = "Full name must be at least 3 characters.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: errors });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);

      await newUser.save();
      res.status(200).json({
        message: "User Created Successfully! Please verify your email.",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          username: newUser.username,
          email: newUser.email,
          profileImg: newUser.profileImg,
          bio: newUser.bio,
          isEmailVerified: newUser.isEmailVerified,
          lastSeen: newUser.lastSeen,
          friends: newUser.friends,
          friendRequests: newUser.friendRequests,
          sentRequests: newUser.sentRequests,
        },
      });
    } else {
      res
        .status(400)
        .json({ message: "User could not be created. Internal Server Error!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!: " + error });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("error in logout: ", error);
    res.status(500).json({ error: "Internal server error: " + error });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("error in getMe: ", error.message);
    res.status(500).json({ error: "Internal server error: " + error });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    let errors = {};

    const user = await User.findOne({ username });

    if (!user) {
      errors.username = "User not found.";
    } else {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        errors.password = "Invalid Password.";
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: errors });
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful.",
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
        bio: user.bio,
        isEmailVerified: user.isEmailVerified,
        lastSeen: user.lastSeen,
        friends: user.friends,
        friendRequests: user.friendRequests,
        sentRequests: user.sentRequests,
      },
    });
  } catch (error) {
    console.error("error in login: ", error);
    res.status(500).json({ error: "Internal server error: " + error });
  }
};
