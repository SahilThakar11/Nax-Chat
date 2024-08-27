import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const createConversation = async (req, res) => {
  const { rId } = req.params;
  const senderId = req.user._id;
  const receiverId = rId;
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (
      !sender.friends.includes(receiverId) ||
      !receiver.friends.includes(senderId)
    ) {
      return res
        .status(400)
        .json({ message: "You can only start conversation with friends" });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (conversation) {
      return res.status(200).json({ message: "Conversation already exists" });
    }
    let newConversation = new Conversation({
      participants: [senderId, receiverId],
    });
    await newConversation.save();
    return res.status(201).json({ conversation: newConversation });
  } catch (error) {
    console.error("Error creating conversation", error);
    return res.status(500).json({ error: error.message });
  }
};

export const fetchConversations = async (req, res) => {
  const senderId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: senderId,
    })
      .populate({
        path: "participants",
        select: "username fullname profileImg bio",
      })
      .populate({
        path: "messages",
        populate: {
          path: "senderId",
          select: "username fullname profileImg bio",
        },
      });
    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations", error);
    return res.status(500).json({ error: error.message });
  }
};

export const fetchConversationByUserName = async (req, res) => {
  const { query } = req.query;
  const senderId = req.user._id;

  try {
    const receivers = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    const receiverIds = receivers.map((receiver) => receiver._id);

    const conversations = await Conversation.find({
      participants: senderId,
    }).populate("participants");

    const filteredConversations = conversations.filter((conversation) => {
      const conversationParticipants = conversation.participants.map(
        (participant) => participant._id
      );
      return receiverIds.some((id) => conversationParticipants.includes(id));
    });

    if (filteredConversations.length === 0) {
      return res.status(200).json({ message: "No conversations found" });
    }

    return res.status(200).json({ conversations: filteredConversations });
  } catch (error) {
    console.error("Error fetching conversation by username", error);
    return res.status(500).json({ error: error.message });
  }
};
