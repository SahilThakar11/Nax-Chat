import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { getRecieverSocket, io } from "../socket/socket.js";

export const sendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    const userToSendRequest = await User.findById(id);

    if (userToSendRequest._id === currentUser._id) {
      return res
        .status(400)
        .json({ error: "You can't send request to yourself" });
    }

    if (!userToSendRequest) {
      return res.status(404).json({ error: "User not found" });
    }

    if (currentUser.friends.includes(id)) {
      return res
        .status(400)
        .json({ error: "You are already friend with this user" });
    }

    if (currentUser.sentRequests.includes(id)) {
      return res.status(400).json({ error: "Request already sent" });
    }

    if (currentUser.receivedRequests.includes(id)) {
      return res
        .status(400)
        .json({ message: "You have already received request from this user" });
    }

    currentUser.sentRequests.push(userToSendRequest._id);
    userToSendRequest.receivedRequests.push(currentUser._id);

    const userToNotifyId = getRecieverSocket(userToSendRequest._id);
    if (userToNotifyId) {
      io.to(userToNotifyId).emit("newRequest", userToNotifyId.receivedRequests);
    }

    await Promise.all([currentUser.save(), userToSendRequest.save()]);

    res.status(200).json({ message: "Friend Request sent successfully" });
  } catch (error) {
    console.error("Error in sendRequest: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const userToCancelRequest = await User.findById(id);

    if (id.toString() === currentUser._id.toString()) {
      return res
        .status(400)
        .json({ message: "You can't cancel request to yourself" });
    }

    if (!userToCancelRequest) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.sentRequests.includes(id)) {
      return res.status(400).json({ message: "Request not found" });
    }

    currentUser.sentRequests = currentUser.sentRequests.filter(
      (request) => request.toString() !== id.toString()
    );

    userToCancelRequest.receivedRequests =
      userToCancelRequest.receivedRequests.filter(
        (request) => request.toString() !== currentUser._id.toString()
      );

    await Promise.all([currentUser.save(), userToCancelRequest.save()]);

    const userToNotifyId = getRecieverSocket(userToCancelRequest._id);
    if (userToNotifyId) {
      io.to(userToNotifyId).emit("friendRequestCancelled", currentUser._id);
    }

    res.status(200).json({ message: "Friend Request cancelled successfully" });
  } catch (error) {
    console.error("Error in cancelRequest: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = req.user;
    const userToAcceptRequest = await User.findById(id);

    if (id.toString() === currentUser._id.toString()) {
      return res
        .status(400)
        .json({ message: "You can't accept request from yourself" });
    }

    if (!userToAcceptRequest) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.receivedRequests.includes(id)) {
      return res.status(400).json({ message: "Friend Request not found" });
    }

    currentUser.friends.push(userToAcceptRequest._id);
    userToAcceptRequest.friends.push(currentUser._id);

    currentUser.receivedRequests = currentUser.receivedRequests.filter(
      (request) => request.toString() !== id.toString()
    );

    userToAcceptRequest.sentRequests = userToAcceptRequest.sentRequests.filter(
      (request) => request.toString() !== currentUser._id.toString()
    );

    await Promise.all([currentUser.save(), userToAcceptRequest.save()]);

    const notification = new Notification({
      senderId: currentUser._id,
      receiverId: userToAcceptRequest._id,
      type: "accept-friend",
      message: `${currentUser.fullname} accepted your friend request`,
    });

    await notification.save();

    const userToNotifyId = getRecieverSocket(userToAcceptRequest._id);
    if (userToNotifyId) {
      io.to(userToNotifyId).emit("friendRequestAccepted", currentUser._id);
      io.to(userToNotifyId).emit("Notification", notification);
    }

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.error("Error in acceptRequest: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = req.user;
    const userToRejectRequest = await User.findById(id);

    if (id.toString() === currentUser._id.toString()) {
      return res
        .status(400)
        .json({ message: "You can't reject request from yourself" });
    }

    if (!userToRejectRequest) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.receivedRequests.includes(id)) {
      return res.status(400).json({ message: "Friend Request not found" });
    }

    currentUser.receivedRequests = currentUser.receivedRequests.filter(
      (request) => request.toString() !== id.toString()
    );

    userToRejectRequest.sentRequests = userToRejectRequest.sentRequests.filter(
      (request) => request.toString() !== currentUser._id.toString()
    );

    await Promise.all([currentUser.save(), userToRejectRequest.save()]);

    const notification = new Notification({
      senderId: currentUser._id,
      receiverId: userToRejectRequest._id,
      type: "reject-friend",
      message: `${currentUser.fullname} rejected your friend request`,
    });

    await notification.save();

    const userToNotifyId = getRecieverSocket(userToRejectRequest._id);
    if (userToNotifyId) {
      io.to(userToNotifyId).emit("friendRequestRejected", currentUser._id);
      io.to(userToNotifyId).emit("Notification", notification);
    }

    res.status(200).json({ message: "Friend Request rejected successfully" });
  } catch (error) {
    console.error("Error in rejectRequest: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unfriend = async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = req.user;
    const userToUnfriend = await User.findById(id);

    if (id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "You can't unfriend yourself" });
    }

    if (!userToUnfriend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.friends.includes(id)) {
      return res.status(400).json({ message: "User is not your friend" });
    }

    currentUser.friends = currentUser.friends.filter(
      (friend) => friend.toString() !== id.toString()
    );

    userToUnfriend.friends = userToUnfriend.friends.filter(
      (friend) => friend.toString() !== currentUser._id.toString()
    );

    await Promise.all([currentUser.save(), userToUnfriend.save()]);

    const notification = new Notification({
      senderId: currentUser._id,
      receiverId: userToUnfriend._id,
      type: "unfriend",
      message: `${currentUser.fullname} has unfriended you.`,
    });

    await notification.save();

    const userToNotifyId = getRecieverSocket(userToUnfriend._id);
    if (userToNotifyId) {
      io.to(userToNotifyId).emit("unfriend", currentUser._id);
      io.to(userToNotifyId).emit("Notification", notification);
    }

    res.status(200).json({ message: "User unfriended successfully" });
  } catch (error) {
    console.error("Error in unfriend: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { search } = req.query;

    const users = await User.find({
      $or: [
        { fullname: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in searchUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
