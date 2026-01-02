const mongoose = require('mongoose');

const ngoProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    organizationName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    registeredUnder: { type: String, required: true, trim: true },
    profilePicture: { type: String },
    languagePreference: { type: String, default: "en" },
    notificationsEnabled: { type: Boolean, default: true },
    bannerPicture: { type: String },
    website: { type: String },
    address: { type: String, maxlength: 300, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true },
    about: { type: String, required: true, maxlength: 1000 },
    missionStatement: { type: String, maxlength: 500 },
    visionStatement: { type: String, maxlength: 500 },
    areasOfOperation: [{ type: String }], // e.g., ["Food Distribution", "Education", "Healthcare"]
    documents: {
        type: [String],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'Minimum one document item is required.'
        }
    }, // verification docs
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    donationsHandled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
    financialDonations: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancialDonation" }],
    bankDetails: {
        accountNumber: { type: String },
        ifscCode: { type: String },
        upiId: { type: String },
        isVisible: { type: Boolean, default: false },
    },
    ngoFeedbackReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
});

const NGOProfile = mongoose.model("NGOProfile", ngoProfileSchema);
module.exports = NGOProfile;