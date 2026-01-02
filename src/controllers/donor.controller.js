const mongoose = require('mongoose');
const DonorProfile = require('../models/donorprofile.model');
const Donation = require('../models/donation.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const { donorProfileSchema } = require('../utils/joiSchemas');
const safeRender = require('../utils/safeRender');

const catchAsync = require('../utils/catchAsync');

// Create Donor Profile
module.exports.createDonorProfile = catchAsync(async (userId, donorProfile) => {
    donorProfile.userId = userId;
    const newDonorProfile = new DonorProfile(donorProfile);
    const createdDonorProfile = await newDonorProfile.save();
    return createdDonorProfile; 
});

// Update Donor Profile
module.exports.updateDonorProfile = catchAsync(async (req, res, next) => {
    const donorProfile = req.validatedDonorProfile;
    const user = req.validatedUser;
    const donorId = req.user._id;

    console.log("Updating donor profile for donor ID:", donorId);
    const updatedDonorProfile = await DonorProfile.findOneAndUpdate(
        { userId: donorId },
        { $set: donorProfile },
        { new: true, runValidators: true }
    );
    console.log("Donor profile updated:", updatedDonorProfile);
    const updatedUser = await User.findByIdAndUpdate(
        donorId,
        { $set: user },
        { new: true, runValidators: true }
    );
    console.log("User data updated:", updatedUser);
    return res.status(200).send({ success: true, message: "Donor profile updated successfully.", donorProfile: updatedDonorProfile, user: updatedUser });
});

// Toggle Notifications
module.exports.toggleDonorNotifications = catchAsync(async (req, res, next) => {
    const donorId = req.user._id;
    const donorProfile = await DonorProfile.findOne({ userId: donorId });
    if (!donorProfile) {
        return res.status(404).send({ success: false, message: "Donor profile not found." });
    }
    donorProfile.notificationsEnabled = !donorProfile.notificationsEnabled;
    await donorProfile.save();
    return res.status(200).send({ success: true, message: `Notifications ${donorProfile.notificationsEnabled ? 'enabled' : 'disabled'} successfully.`, notificationsEnabled: donorProfile.notificationsEnabled });
});

// View Donor Dashboard
module.exports.viewDonorDashboard = catchAsync(async (req, res, next) => {
    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    // find number of donations by this user which are new
    const newDonationsCount = donations.filter(d => d.status === 'New').length;
    // find number of donations by this user which are assigned
    const assignedDonationsCount = donations.filter(d => d.status === 'Assigned').length;
    // find number of donations by this user which are completed
    const completedDonationsCount = donations.filter(d => d.status === 'Completed').length;
    // find total number of donations
    const totalDonationsCount = donations.length;

    const donationStats = {
        assigned: assignedDonationsCount,
        new: newDonationsCount,
        completed: completedDonationsCount,
        total: totalDonationsCount
    };

    safeRender(res, 'donor/dashboard', {
        activePage: 'donor-dashboard',
        pageTitle: 'Donor Dashboard | AnnaMitra',
        messageType: null,
        message: null,
        donations: donations,
        donationStats: donationStats
    }, next);
});

// Render Donor Account Page
module.exports.renderDonorAccountPage = catchAsync(async (req, res, next) => {
    let donorProfile = await DonorProfile.findOne({ userId: req.user._id });
    safeRender(res, 'donor/account', {
        activePage: 'donor-account',
        pageTitle: 'Donor Account | AnnaMitra',
        messageType: null,
        message: null,
        donorProfile: donorProfile
    }, next);
});

// Render Notifications page
module.exports.renderNotificationsPage = catchAsync(async (req, res, next) => {
    const donorId = req.user._id;
    const notifications = await Notification.find({ userId: donorId }).sort({ createdAt: -1 });

    safeRender(res, 'donor/notifications', {
        activePage: 'donor-notifications',
        pageTitle: 'Donor Notifications | AnnaMitra',
        messageType: null,
        message: null,
        notifications: notifications
    }, next);
});