const mongoose = require('mongoose');

const donationTeamSchema = new mongoose.Schema({
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickupSchedule: {
        date: { type: Date, required: true },
        time: { type: String, required: true }
    },
    deliverySchedule: {
        date: { type: Date, required: false },
        time: { type: String, required: false },
        location: { type: String, required: false }
    },
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completionProof: [{ type: String, default: [] }]
}, {
    timestamps: true // adds createdAt and updatedAt
});

const DonationTeam = mongoose.model('DonationTeam', donationTeamSchema);
module.exports = DonationTeam;