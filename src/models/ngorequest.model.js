const mongoose = require('mongoose');

const ngoRequestSchema = new mongoose.Schema({
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date }
});

// make sure that there is only one request with same ngoId , volunteerId and status
// ngoRequestSchema.index({ ngoId: 1, volunteerId: 1, status: 1 }, { unique: true });

const NGORequest = mongoose.model('NGORequest', ngoRequestSchema);
module.exports = NGORequest;