const Notification = require('../models/notification.model');

module.exports = function generateNotification(userId, title, message, type = 'info') {
    const newNotification = new Notification({
        userId,
        title,
        message,
        type
    });
    return newNotification.save();
}