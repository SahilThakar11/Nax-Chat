import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const updateProfile = async (req, res) => {
  const { fullname, bio } = req.body;

  let { profileImg } = req.body;

  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    user.fullname = fullname || user.fullname;
    user.bio = bio || user.bio;
    user.profileImg = profileImg || user.profileImg;

    user = await user.save();
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.error("error in updateProfile: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  try {
    if (
      currentPassword.length < 6 ||
      newPassword.length < 6 ||
      confirmNewPassword.length < 6
    ) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "Passwords do not match for new Passwords" });
    }

    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid Current password" });
    }

    const isPasswordSame = await bcrypt.compare(newPassword, user.password);

    if (isPasswordSame) {
      return res.status(400).json({
        error: "New password cannot be the same as the current password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    user = await user.save();

    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.error("error in updatePassword: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getUserById: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
