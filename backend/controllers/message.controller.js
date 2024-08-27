import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { getRecieverSocket, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
import LinkifyIt from "linkify-it";

const linkify = new LinkifyIt();

export const sendMessage = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  let { file } = req.body;
  const senderId = req.user._id;
  let mediaUrl = null;
  let linkUrl = null;

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [id, senderId] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (file) {
      const uploadedResponse = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
      });
      mediaUrl = uploadedResponse.secure_url;
    }

    const links = linkify.match(message);
    if (links && links.length > 0) {
      linkUrl = links[0].url;
    }

    const newMessage = new Message({
      senderId,
      receiverId: id,
      message: message,
      media: mediaUrl,
      link: linkUrl,
    });

    if (newMessage) {
      conversation.messages.push(newMessage);
      newMessage.readBy.push(senderId);
    }

    await Promise.all([newMessage.save(), conversation.save()]);

    const receiverSocketId = getRecieverSocket(id);
    const senderSocketId = getRecieverSocket(senderId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage, conversation);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage, conversation);
    }

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error("Error sending message", error);
    return res.status(500).json({ error: error.message });
  }
};

export const fetchMessages = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = conversation.messages;

    const unreadMessages = messages.filter(
      (message) => !message.readBy.includes(senderId)
    );

    unreadMessages.forEach((message) => {
      message.readBy.push(senderId);
    });

    await Promise.all(unreadMessages.map((message) => message.save()));

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages", error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const senderId = req.user._id;

  try {
    const message = await Message.findOneAndDelete({
      _id: id,
      senderId,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const conversation = await Conversation.findOne({
      messages: { $all: [id] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation) {
      conversation.messages = conversation.messages.filter(
        (msg) => msg.toString() !== id.toString()
      );
      await conversation.save();
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message", error);
    return res.status(500).json({ error: error.message });
  }
};

export const lastMessage = async (req, res) => {
  const { id } = req.params;
  const senderId = req.user._id;

  try {
    const conversation = await Conversation.findById(id).populate({
      path: "messages",
      select: "message updatedAt media",
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = conversation.messages;

    if (messages.length === 0) {
      return res.status(200).json({ message: "" });
    }
    const lastMessage = messages[messages.length - 1];

    res.status(200).json({ message: lastMessage });
  } catch (error) {
    console.error("Error fetching last message", error);
    return res.status(500).json({ error: error.message });
  }
};

export const unreadMessageById = async (req, res) => {
  const { id } = req.params;
  const senderId = req.user._id;

  try {
    const conversation = await Conversation.findById(id).populate({
      path: "messages",
      select: "readBy",
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = conversation.messages;

    const unreadMessages = messages.filter(
      (message) => !message.readBy.includes(senderId)
    );

    res.status(200).json({ unreadMessages });
  } catch (error) {
    console.error("Error fetching unread messages", error);
    return res.status(500).json({ error: error.message });
  }
};
