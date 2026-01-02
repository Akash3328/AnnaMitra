const mongoose = require('mongoose');

const donorProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    donorSourceName: { type: String, trim: true },
    profilePicture: { type: String },
    languagePreference: { type: String, default: "en" },
    notificationsEnabled: { type: Boolean, default: true },
    about: { type: String, maxlength: 1000 },
    address: { type: String, maxlength: 300, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true },
    donationHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
    feedbackReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
});

const DonorProfile = mongoose.model("DonorProfile", donorProfileSchema);
module.exports = DonorProfile;