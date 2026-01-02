
const mongoos = require('mongoose');
const User = require('../models/user.model');
const NGOProfile = require('../models/ngoprofile.model');
const NGORequest = require('../models/ngorequest.model');
const VolunteerProfile = require('../models/volunteerprofile.model');
const Donation = require('../models/donation.model');
const Notification = require('../models/notification.model');
const { ngoProfileSchema } = require('../utils/joiSchemas');
const safeRender = require('../utils/safeRender');
const catchAsync = require('../utils/catchAsync');


// Create NGO Profile
module.exports.createNgoProfile = async (userId, ngoProfile) => {
    ngoProfile.userId = userId;
    console.log('Creating NGO Profile:', ngoProfile);
    const newNgoProfile = new NGOProfile(ngoProfile);
    const createdNgoProfile = await newNgoProfile.save();
    return createdNgoProfile;
}

// Render Dashboard Page
module.exports.renderDashboardPage = catchAsync(async (req, res, next) => {
    const ngoUserId = req.user._id;

    // NGO Profile
    const ngoProfile = await NGOProfile.findOne({ userId: ngoUserId });

    // NEW DONATIONS (status = "New")
    const newDonations = await Donation.find({ status: "New" })
        .sort({ createdAt: -1 })
        .limit(4);

    // ACTIVE DONATIONS (Assigned, Scheduled, Picked)
    const activeDonations = await Donation.find({
        assignedNgoId: ngoUserId,
        status: { $in: ["Assigned", "Scheduled", "Picked"] }
    })
        .sort({ updatedAt: -1 })
        .limit(4);

    // STATS
    const availableDonationsCount = await Donation.countDocuments({ status: "New" });
    const activeDonationsCount = await Donation.countDocuments({
        assignedNgoId: ngoUserId,
        status: { $in: ["Assigned", "Scheduled", "Picked"] }
    });
    const completedDonationsCount = await Donation.countDocuments({
        assignedNgoId: ngoUserId,
        status: "Completed"
    });

    // VOLUNTEER COUNT
    const totalVolunteers = ngoProfile ? ngoProfile.volunteers.length : 0;

    // VOLUNTEER JOIN REQUESTS
    const volunteerRequests = await NGORequest.find({
        ngoId: ngoProfile._id,
        status: "Pending"
    })
        .populate("volunteerId", "contact")
        .sort({ createdAt: -1 })
        .limit(5);

    res.render("ngo/dashboard", {
        activePage: "ngo-dashboard",
        pageTitle: "NGO Dashboard | AnnaMitra",
        messageType: null,
        message: null,

        availableDonationsCount,
        activeDonationsCount,
        completedDonationsCount,
        totalVolunteers,

        newDonations,
        activeDonations,
        volunteerRequests
    });
});


// Render Active Donations Page
module.exports.renderMyDonationsPage = catchAsync(async (req, res, next) => {
    // Find donations associated with this NGO
    const ngoId = req.user._id;
    const donations = await Donation.find({ assignedNgoId: ngoId }).sort({ createdAt: -1 });

    safeRender(res, 'ngo/my-donations', {
        activePage: 'ngo-my-donations',
        pageTitle: 'Active donations | AnnaMitra',
        messageType: null,
        message: null,
        donations
    }, next);
})

// Render Staff Page
module.exports.renderStaffPage = catchAsync(async (req, res, next) => {
    // Find volunteers associated with this NGO
    const ngoId = req.user._id;
    const ngoProfile = await NGOProfile.findOne({ userId: ngoId });

    const volunteers = await VolunteerProfile.find({
      userId: { $in: ngoProfile.volunteers }
    }).select('firstName lastName profilePicture participationHistory joinedNGOs _id userId').populate('userId', 'email contact');

    safeRender(res, 'ngo/staff', {
        activePage: 'ngo-staff',
        pageTitle: 'Staff | AnnaMitra',
        messageType: null,
        message: null,
        volunteers
    }, next);
})

// Render Joining Requests Page
module.exports.renderJoiningRequestsPage = catchAsync(async (req, res, next) => {
    const ngoId = req.user._id;
    const joiningRequests = await NGORequest.find({ ngoId, status: 'Pending' }).select('volunteerId requestedAt');
    let requests = [];
    for(const request of joiningRequests) {
        const volunteer = await VolunteerProfile.findOne({ userId: request.volunteerId }).select('firstName lastName profilePicture address city state');
        const vp = volunteer.toObject();
        vp.request = request;
        requests.push(vp);
    }
    safeRender(res, 'ngo/joining-requests', {
        activePage: 'ngo-joining-requests',
        pageTitle: 'Joining requests | AnnaMitra',
        messageType: null,
        message: null,
        requests
    }, next);
})

// Render Notifications Page
module.exports.renderNotificationsPage = catchAsync(async (req, res, next) => {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Mark all as read
    await Notification.updateMany({ userId: req.user._id, notReaded: true }, { notReaded: false });

    safeRender(res, 'ngo/notifications', {
        activePage: 'ngo-notifications',
        pageTitle: 'Notifications | AnnaMitra',
        messageType: null,
        message: null,
        notifications
    }, next);
})

// Render Manage Account Page
module.exports.renderManageAccountPage = catchAsync(async (req, res, next) => {
    const ngoProfile = await NGOProfile.findOne({ userId: req.user._id });

    safeRender(res, 'ngo/account', {
        activePage: 'ngo-account',
        pageTitle: 'NGO Account | AnnaMitra',
        messageType: null,
        message: null,
        ngoProfile
    }, next);
});

// Render Ngo Profile Page
module.exports.renderNgoProfilePage = catchAsync(async (req, res, next) => {
    const ngoUserId = req.params.id; // this is the `userId` inside NGOProfile

    // Fetch NGO profile
    const ngoProfile = await NGOProfile.findOne({ userId: ngoUserId });
    if (!ngoProfile) return res.status(404).send("NGO Profile not found-"+ngoUserId);

    // Fetch associated User data (email, contact, role)
    const userData = await User.findById(ngoUserId).select("email contact");
    ngoProfile.email = userData.email;
    ngoProfile.contact = userData.contact;

    ngoProfile.hasJoined = false;
    ngoProfile.hasRequested = false;

    if(req.user && req.user.role === 'Volunteer') {
        // Check if the logged-in volunteer has joined this NGO
        ngoProfile.hasJoined = ngoProfile.volunteers.some(volunteerId => volunteerId.equals(req.user._id));

        // Check if the logged-in volunteer has requested to join this NGO
        const existingRequest = await NGORequest.findOne({ ngoId: ngoUserId, volunteerId: req.user._id, status: 'Pending' });
        ngoProfile.hasRequested = existingRequest ? true : false;
    }

    // Count number of donations completed by ngo
    const donationsCompleted = await Donation.countDocuments({ngoId: ngoUserId, status: 'Completed'});
    ngoProfile.donationsCompleted = donationsCompleted;

    safeRender(res, 'ngo/profile', {
        activePage: 'ngo-profile',
        pageTitle: 'NGO Profile | AnnaMitra',
        messageType: null,
        message: null,
        ngo: ngoProfile
    }, next);
})

// Handle account update
module.exports.handleUpdateAccount = catchAsync(async (req, res, next) => {
    const ngoUserId = req.user._id;
    const { ngoProfileData, userData } = req;

    try {
        const updatedNGOProfile = await NGOProfile.findOneAndUpdate(
            { userId: ngoUserId },
            { $set: ngoProfileData },
            { new: true, runValidators: true }
        );
        if(!updatedNGOProfile) {
            res.json({success: false, message: "Failed to update NGO Profile"});
        }
        console.log("NGO profile updated:", updatedNGOProfile);

        const updatedUser = await User.findByIdAndUpdate(
            ngoUserId,
            { $set: userData },
            { new: true, runValidators: true }
        );
        if(!updatedUser) {
            res.json({success: false, message: "Failed to update NGO Profile"});
        }
        console.log("NGO User data updated:", updatedUser);

        return res.status(200).json({
            success: true,
            message: "NGO profile updated successfully.",
            ngoProfile: updatedNGOProfile,
            user: updatedUser
        });
    } catch(e) {
        console.log(e.message);
        res.json({success: false, message: "Error : "+e.message});
    }
})

// Handle Volunteer Request
module.exports.handleVolunteerRequest = catchAsync(async (req, res, next) => {
    // Implementation for handling volunteer request
    if (!req.user || req.user.role !== 'Volunteer') {
        return res.status(403).json({ success: false, message: 'Only volunteers can send join requests.' });
    }
    const ngoId = req.params.id;
    const volunteerId = req.user._id;
    // Check if a request already exists
    const existingRequest = await NGORequest.findOne({ ngoId, volunteerId, status: 'Pending' });
    if (existingRequest) {
        return res.status(400).json({ success: false, message: 'You have already sent a join request to this NGO.' });
    }
    // Create a new join request
    const newRequest = new NGORequest({ ngoId, volunteerId });
    await newRequest.save();

    const volunteer = await VolunteerProfile.findOne({ userId: volunteerId }).select('firstName lastName');

    const notification = await Notification.createIfAllowed({
        userId: ngoId,
        title: "New Join Request",
        message: `You have received a new join request from a volunteer "${volunteer.firstName} ${volunteer.lastName}". Click to view requests.`,
        type: "info",
        redirectUrl: "/ngo/joining-requests"
    });
    

    return res.status(200).json({ success: true, message: 'Join request sent successfully.' });
})

// Accept Volunteer Request
module.exports.acceptVolunteerRequest = catchAsync(async (req, res, next) => {
    // Implementation for accepting volunteer request
    const requestId = req.params.requestId;
    const request = await NGORequest.findById(requestId);
    if (!request) {
        return res.status(404).json({ success: false, message: 'Join request not found.' });
    }
    request.status = 'Accepted';
    request.respondedAt = new Date();
    await request.save();

    // Add volunteer to NGO's volunteer list
    const ngoProfile = await NGOProfile.findOne({ userId: request.ngoId });
    ngoProfile.volunteers.push(request.volunteerId);
    await ngoProfile.save();

    // Add ngoId to volunteer's joined NGOs list
    const volunteerProfile = await VolunteerProfile.findOne({ userId: request.volunteerId });
    volunteerProfile.joinedNGOs.push(request.ngoId);
    await volunteerProfile.save();

    const notification = await Notification.createIfAllowed({
        userId: request.volunteerId,
        title: "Join Request Approved",
        message: `Congratulations, your request to join "${ngoProfile.organizationName}" has been approved. 
                    Welcome to the team! Click to view the NGO profile.`,
        type: "success",
        redirectUrl: `/ngo/${request.ngoId.toString()}`
    });
    

    return res.status(200).json({ success: true, message: 'Join request accepted.' });
})

// Reject Volunteer Request
module.exports.rejectVolunteerRequest = catchAsync(async (req, res, next) => {
    // Implementation for rejecting volunteer request
    const requestId = req.params.requestId;
    const request = await NGORequest.findById(requestId).populate('ngoId', 'organizationName');
    if (!request) {
        return res.status(404).json({ success: false, message: 'Join request not found.' });
    }
    request.status = 'Rejected';
    request.respondedAt = new Date();
    await request.save();

    const ngoProfile = await NGOProfile.findOne({ userId: request.ngoId }, { organizationName: 1 });

    const notification = await Notification.createIfAllowed({
        userId: request.volunteerId,
        title: "Join Request Declined",
        message: `Unfortunately, your request to join "${ngoProfile.organizationName}" has been declined. Click to request again.`,
        type: "danger",
        redirectUrl: `/ngo/${request.ngoId._id.toString()}`
    });
    

    return res.status(200).json({ success: true, message: 'Join request rejected.' });
})

// Remove volunteer from ngo Request
module.exports.removeVolunteerFromNGO = catchAsync(async (req, res) => {
    const { id: ngoUserId, volunteerId } = req.params;

    // 1. SECURITY CHECK
    if (![ngoUserId.toString(), volunteerId.toString()].includes(req.user._id.toString())) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized request."
        });
    }

    // 2. REMOVE FROM NGO PROFILE
    const ngoProfile = await NGOProfile.findOneAndUpdate(
        { userId: ngoUserId },
        { $pull: { volunteers: volunteerId } },
        { new: true }
    );

    if (!ngoProfile) {
        return res.status(404).json({
            success: false,
            message: "NGO profile not found."
        });
    }

    // 3. REMOVE NGO FROM VOLUNTEER PROFILE
    const volunteerProfile = await VolunteerProfile.findOneAndUpdate(
        { userId: volunteerId },
        { $pull: { joinedNGOs: ngoUserId } }
    );

    await NGORequest.findOneAndDelete({ ngoId: ngoUserId, volunteerId });

    if(req.user.role === 'NGO') {
        const notification = await Notification.createIfAllowed({
            userId: volunteerId,
            title: "Removed from NGO",
            message: `You have been removed from the NGO "${ngoProfile.organizationName}".`,
            type: "danger"
        });
        
    }
    else if(req.user.role === 'Volunteer') {
        const notification = await Notification.createIfAllowed({
            userId: ngoUserId,
            title: "Volunteer Left NGO",
            message: `The volunteer "${volunteerProfile.firstName} ${volunteerProfile.lastName}" has left your NGO "${ngoProfile.organizationName}".`,
            type: "info"
        });
        
    }

    return res.status(200).json({
        success: true,
        message: "Volunteer removed successfully."
    });
});

module.exports.markAllNotificationsRead = catchAsync(async (req, res, next) => {
    const ngoId = req.user._id;
    await Notification.updateMany({ userId: ngoId, notReaded: true }, { notReaded: false });
    return res.status(200).send({ success: true, message: "All notifications marked as read." });
});