import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ receiverId: userId }).sort({
      createdAt: -1,
    });

    notifications.forEach((notification) => {
      notification.read = true;
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error in getNotifications: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this notification",
      });
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotification: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
