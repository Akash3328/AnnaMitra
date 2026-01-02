const mongoose = require('mongoose');

const notificationTypeOptions = [
    "success",
    "danger",
    "info"
];

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },

    redirectUrl: {
        type: String,
        trim: true
    },

    type: {
        type: String,
        enum: notificationTypeOptions,
        default: "info",
        required: true
    },

    notReaded: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});


async function isNotificationAllowed(userId) {
    const VolunteerProfile = mongoose.model("VolunteerProfile");
    const DonorProfile = mongoose.model("DonorProfile");
    const NGOProfile = mongoose.model("NGOProfile");

    const volunteer = await VolunteerProfile.findOne({ userId }).select("notificationsEnabled");
    if (volunteer) return volunteer.notificationsEnabled;

    const donor = await DonorProfile.findOne({ userId }).select("notificationsEnabled");
    if (donor) return donor.notificationsEnabled;

    const ngo = await NGOProfile.findOne({ userId }).select("notificationsEnabled");
    if (ngo) return ngo.notificationsEnabled;

    return true;
}


notificationSchema.statics.createIfAllowed = async function (data) {
    const allowed = await isNotificationAllowed(data.userId);
    if (!allowed) return null;

    return this.create(data);
};

notificationSchema.statics.insertManyIfAllowed = async function (dataArray) {
    const filtered = [];

    for (const data of dataArray) {
        const allowed = await isNotificationAllowed(data.userId);
        if (allowed) filtered.push(data);
    }

    if (!filtered.length) return [];

    return this.insertMany(filtered);
};



notificationSchema.post("save", function (doc) {
    try {
        const io = global.io;
        const onlineUsers = global.onlineUsers;

        const receiverSocketId = onlineUsers.get(doc.userId.toString());

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-notification", doc);
            console.log("Live notification sent to user:", doc.userId);
        }
    } catch (err) {
        console.error("Socket emit failed:", err);
    }
});

notificationSchema.post("insertMany", function (docs) {
    try {
        const io = global.io;
        const onlineUsers = global.onlineUsers;

        docs.forEach(doc => {
            const receiverSocketId = onlineUsers.get(doc.userId.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("new-notification", doc);
                console.log("Live notification sent to user:", doc.userId);
            }
        });

    } catch (err) {
        console.error("Socket emit failed for insertMany:", err);
    }
});


const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
