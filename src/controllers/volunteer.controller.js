
const mongoos = require('mongoose');
const User = require('../models/user.model');
const VolunteerProfile = require('../models/volunteerprofile.model');
const Donation = require('../models/donation.model');
const DonationTeam = require('../models/donationteam.model');
const NGOProfile = require('../models/ngoprofile.model');
const Notification = require('../models/notification.model');
const { volunteerProfileSchema } = require('../utils/joiSchemas');
const safeRender = require('../utils/safeRender');
const catchAsync = require('../utils/catchAsync');


// Create Volunteer Profile
module.exports.createVolunteerProfile = async (userId, volunteerProfile) => {
    volunteerProfile.userId = userId;
    const newVolunteerProfile = new VolunteerProfile(volunteerProfile);
    const createdVolunteerProfile = await newVolunteerProfile.save();
    return createdVolunteerProfile;
}

// Update Volunteer Profile
module.exports.updateVolunteerProfile = catchAsync(async (req, res, next) => {
    const volunteerProfile = req.validatedVolunteerProfile;
    const user = req.validatedUser;
    const volunteerId = req.user._id;

    console.log("Updating volunteer profile for volunteer ID:", volunteerId);
    const updatedVolunteerProfile = await VolunteerProfile.findOneAndUpdate(
        { userId: volunteerId },
        { $set: volunteerProfile },
        { new: true, runValidators: true }
    );
    console.log("Volunteer profile updated:", updatedVolunteerProfile);

    const updatedUser = await User.findByIdAndUpdate(
        volunteerId,
        { $set: user },
        { new: true, runValidators: true }
    );
    console.log("User data updated:", updatedUser);
    return res.status(200).send({ success: true, message: "Volunteer profile updated successfully.", volunteerProfile: updatedVolunteerProfile, user: updatedUser });
});

// Render Dashboard Page
module.exports.renderDashboardPage = catchAsync(async (req, res, next) => {
    const volunteerUserId = req.user._id;

    // 1. Find all teams that include this volunteer
    const teams = await DonationTeam.find({
        volunteers: volunteerUserId
    })
        .populate('donationId')
        .sort({ createdAt: -1 });

    // 2. Keep only teams where donation still matched the status filter
    const assignedTeams = teams.filter(team => ['Scheduled', 'Picked'].includes(team.donationId.status));

    const pendingPickups = teams.filter(team => team.donationId.status === "Scheduled").length;
    const pendingDeliveries = teams.filter(team => team.donationId.status === "Picked").length;
    const completedDonations = teams.filter(team => team.donationId.status === "Completed").length;

    const volunteerProfile = await VolunteerProfile.findOne({ userId: volunteerUserId });
    const ngosJoined = volunteerProfile?.joinedNGOs?.length || 0;

    let topNGOs = await NGOProfile.find({volunteers: { $ne: volunteerUserId }}).populate("userId", "contact").lean();

    // ✅ Sort by donationsHandled array length (descending)
    topNGOs.sort(
        (a, b) =>
            (b.donationsHandled?.length || 0) -
            (a.donationsHandled?.length || 0)
    );

    // ✅ Take only Top 5
    topNGOs = topNGOs.slice(0, 5);

    safeRender(res, 'volunteer/dashboard', {
        activePage: 'volunteer-dashboard',
        pageTitle: 'Volunteer Dashboard | AnnaMitra',
        messageType: null,
        message: null,
        assignedTeams,
        stats: { pendingPickups, pendingDeliveries, completedDonations, ngosJoined },
        topNGOs,
        volunteerProfile
    }, next);
})

// Render Assigned Tasks Page
module.exports.renderAssignedTasksPage = catchAsync(async (req, res, next) => {
    const volunteerUserId = req.user._id;
    
    // 1. Find all teams that include this volunteer
    const teams = await DonationTeam.find({
        volunteers: volunteerUserId
    })
        .populate({
            path: 'donationId',
            match: { status: { $in: ['Scheduled', 'Picked'] } }, // only these
            // optionally populate donor etc. here if needed
            // populate: { path: 'donorId', select: 'email contact' }
        })
        .sort({ createdAt: -1 });

    // 2. Keep only teams where donation still matched the status filter
    const assignedTeams = teams.filter(team => team.donationId);

    safeRender(res, 'volunteer/assigned-tasks', {
        activePage: 'volunteer-assigned-tasks',
        pageTitle: 'Assigned tasks | AnnaMitra',
        messageType: null,
        message: null,
        assignedTeams
    }, next);
})

// Render Donation History Page
module.exports.renderDonationHistoryPage = catchAsync(async (req, res, next) => {
    const volunteerUserId = req.user._id;
    
    // 1. Find all teams that include this volunteer
    const teams = await DonationTeam.find({
        volunteers: volunteerUserId
    })
        .populate({
            path: 'donationId',
            match: { status: "Completed"}, // only these
            // optionally populate donor etc. here if needed
            // populate: { path: 'donorId', select: 'email contact' }
        })
        .sort({ createdAt: -1 });

    // 2. Keep only teams where donation still matched the status filter
    const assignedTeams = teams.filter(team => team.donationId);
    
    safeRender(res, 'volunteer/donation-history', {
        activePage: 'volunteer-donation-history',
        pageTitle: 'Donation history | AnnaMitra',
        messageType: null,
        message: null,
        assignedTeams
    }, next);
})

// Render Notifications Page
module.exports.renderNotificationsPage = catchAsync(async (req, res, next) => {
    let notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Mark all as read
    await Notification.updateMany({ userId: req.user._id, notReaded: true }, { notReaded: false });
    
    safeRender(res, 'volunteer/notifications', {
        activePage: 'volunteer-notifications',
        pageTitle: 'Notifications | AnnaMitra',
        messageType: null,
        message: null,
        notifications
    }, next);
})

// Render NGOs Page
module.exports.renderNgosPage = catchAsync(async (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    const volunteerId = req.user._id;
    // Find NGOs where the volunteer is part of the volunteers array
    const NGOs = await NGOProfile.find({ volunteers: { $ne: volunteerId } });

    safeRender(res, 'volunteer/ngos', {
        activePage: 'volunteer-ngos',
        pageTitle: 'Available NGOs | AnnaMitra',
        messageType: null,
        message: null,
        NGOs: NGOs
    }, next);
})

// Render Joined NGOs Page
module.exports.renderJoinedNgosPage = catchAsync(async (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    const volunteerId = req.user._id;
    // Find NGOs where the volunteer is part of the volunteers array
    const joinedNGOs = await NGOProfile.find({ volunteers: volunteerId });

    safeRender(res, 'volunteer/joined-ngos', {
        activePage: 'volunteer-joined-ngos',
        pageTitle: 'My NGOs | AnnaMitra',
        messageType: null,
        message: null,
        joinedNGOs: joinedNGOs
    }, next);
})

// Render Manage Account Page
module.exports.renderManageAccountPage = catchAsync(async (req, res, next) => {
    const volunteerId = req.user._id;
    const volunteer = await VolunteerProfile.findOne({ userId: volunteerId }).populate('userId', 'email contact');

    safeRender(res, 'volunteer/account', {
        activePage: 'volunteer-account',
        pageTitle: 'Manage account | AnnaMitra',
        messageType: null,
        message: null,
        volunteer
    }, next);
})

// Render Volunteer Profile Page
module.exports.renderVolunteerProfilePage = catchAsync(async (req, res, next) => {
    const { id } = req.params;
});

// Toggle Notifications
module.exports.toggleVolunteerNotifications = catchAsync(async (req, res, next) => {
    const volunteerId = req.user._id;
    try {
        const volunteer = await VolunteerProfile.findOne({ userId: volunteerId });
        if (!volunteer) {
            return res.status(404).send({ success: false, message: "Donor profile not found." });
        }
        volunteer.notificationsEnabled = !volunteer.notificationsEnabled;
        await volunteer.save();
        return res.status(200).send({ success: true, message: `Notifications ${volunteer.notificationsEnabled ? 'enabled' : 'disabled'} successfully.`, notificationsEnabled: volunteer.notificationsEnabled });
    }
    catch (err) {
        return res.status(500).send({ success: false, message: "An error occurred while toggling notifications." });
    }
});

// Toggle Availability
module.exports.toggleVolunteerAvailability = catchAsync(async (req, res, next) => {
    const volunteerId = req.user._id;
    try {
        const volunteer = await VolunteerProfile.findOne({ userId: volunteerId });
        if (!volunteer) {
            return res.status(404).send({ success: false, message: "Volunteer profile not found." });
        }
        if(!volunteer.isAvailable) {
            // If available, check if they have any assigned tasks
            const teams = await DonationTeam.find({
                volunteers: volunteerId
            })
            .populate('donationId', 'status');
            const hasAssignedTasks = teams.some(team => ['Scheduled', 'Picked'].includes(team.donationId.status));
            if(hasAssignedTasks) {
                return res.status(400).send({ success: false, message: "Cannot set available while having assigned tasks." });
            }
        }
        volunteer.isAvailable = !volunteer.isAvailable;
        await volunteer.save();
        return res.status(200).send({ success: true, message: `Availability ${volunteer.isAvailable ? 'enabled' : 'disabled'} successfully.`, isAvailable: volunteer.isAvailable });
    }
    catch (err) {
        return res.status(500).send({ success: false, message: "An error occurred while toggling availability." });
    }
});

module.exports.markAllNotificationsRead = catchAsync(async (req, res, next) => {
    const volunteerId = req.user._id;
    await Notification.updateMany({ userId: volunteerId, notReaded: true }, { notReaded: false });
    return res.status(200).send({ success: true, message: "All notifications marked as read." });
});