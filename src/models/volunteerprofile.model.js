const mongoose = require('mongoose');

const volunteerProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    profilePicture: { type: String },
    languagePreference: { type: String, default: "en" },
    notificationsEnabled: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    about: { type: String, maxlength: 1000 },
    address: { type: String, maxlength: 300, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true },
    joinedNGOs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // NGOs this volunteer joined
    participationHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "DonationTeam" }],
});

const VolunteerProfile = mongoose.model("VolunteerProfile", volunteerProfileSchema);
module.exports = VolunteerProfile;