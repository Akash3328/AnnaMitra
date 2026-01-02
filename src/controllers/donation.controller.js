const e = require('express');
const fs = require('fs');
const Donation = require('../models/donation.model');
const DonationRequest = require('../models/donationrequest.model');
const DonationTeam = require('../models/donationteam.model');
const NGOProfile = require('../models/ngoprofile.model');
const VolunteerProfile = require('../models/volunteerprofile.model');
const Notification = require('../models/notification.model');
const userController = require('./user.controller');
const mongoose = require('mongoose');
const safeRender = require('../utils/safeRender');
const catchAsync = require('../utils/catchAsync');

const { deleteFiles } = require('../helpers/donation.helpers'); // Import the new helpers

// Render the donation form
module.exports.renderDonationForm = (req, res, next) => {
    return safeRender(res, 'donations/new', {
        activePage: 'donate',
        pageTitle: 'Donate food | AnnaMitra',
        messageType: null,
        message: null
    }, next);
}

// Handle the donation form submission
module.exports.submitDonationForm = catchAsync(async (req, res, next) => {

    if (mongoose.connection.readyState !== 1) {
        console.error('Database connection is not ready');
        return res.json({ success: false, message: 'Database connection error! Faild to upload donation.' });
    }

    try {
        console.log('-----------------------------------------');
        // console.log('Donation:', req.donation);

        const donation = new Donation(req.donation);
        await donation.save();

        // Notify NGOs in the same city as donation
        try {
            if (donation.city) {
                const ngos = await NGOProfile.find({ city: donation.city }).select('userId organizationName').lean();
                if (ngos && ngos.length) {
                    const notifications = ngos.map(ngo => ({
                        userId: ngo.userId,
                        title: 'New donation in your city',
                        message: `A new donation "${donation.title || ''}" is available in ${donation.city}. Click to view.`,
                        type: 'info',
                        redirectUrl: `/donations/${donation._id}`
                    }));
                    await Notification.insertManyIfAllowed(notifications);
                }
            }
        } catch (notifyErr) {
            console.error('Error creating notifications for NGOs:', notifyErr);
        }

        return res.status(201).json({
            success: true,
            message: 'Donation created successfully.',
            donationId: donation._id
        });
    } catch (error) {
        console.error('Error creating donation:', error);
        return res.status(500).json({ success: false, message: 'Server error while saving donation.' });
    }
})

// View donation details
module.exports.viewDonationDetails = catchAsync(async (req, res, next) => {
    const donationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(donationId)) {
        res.status(400);
        return safeRender(res, 'donations/show', {
            activePage: 'donation-details',
            pageTitle: 'Donation not found | AnnaMitra',
            messageType: 'danger',
            message: 'Invalid donation ID!'
        }, next);
    }

    try {
        const donation = await Donation.findById(donationId).populate('donorId', 'firstName lastName email contact');
        if (!donation) {
            res.status(404);
            return safeRender(res, 'donations/show', {
                activePage: 'donation-details',
                pageTitle: 'Donation not found | AnnaMitra',
                messageType: 'danger',
                message: 'Donation not found!'
            }, next);
        }

        // check if logged in user is donor of this donation
        const isDonor = req.user && donation.donorId._id.equals(req.user._id);

        // Fetch donation requests for this donation with status 'New'
        const donationRequests = await DonationRequest.find({ 
            donationId: donationId, 
            status: 'New' 
        }).populate('ngoId', 'contact').sort({ requestDate: -1 });

        const enrichedRequests = await Promise.all(
            donationRequests.map(async (reqItem) => {
                const ngoProfile = await NGOProfile.findOne({ userId: reqItem.ngoId._id }).lean();

                return {
                    _id: reqItem._id,
                    message: reqItem.message,
                    requestDate: reqItem.requestDate,

                    ngo: {
                        name: ngoProfile?.organizationName || "Unknown NGO",
                        profilePicture: ngoProfile?.profilePicture || null,
                        contact: reqItem.ngoId.contact
                    }
                };
            })
        );

        // Check if logged in NGO has already requested this donation
        let isRequested = false;
        if (req.user && req.user.role === 'NGO') {
            const existingRequest = await DonationRequest.findOne({ 
                donationId: donationId,
                ngoId: req.user._id,
                status: 'New'
            });
            isRequested = existingRequest ? true : false;
        }

        // Find available volunteers of loggedin NGO for scheduling pickup (for NGOs)
        let availableVolunteers = [];
        if (req.user && req.user.role === 'NGO') {
            availableVolunteers = await VolunteerProfile.find({
                joinedNGOs: req.user._id,
                isAvailable: true
            }).select('userId firstName lastName');
        }

        // find donation schedule if scheduled
        if (donation.status === 'Scheduled') {
            const donationTeam = await DonationTeam.findOne({ donationId: donation._id });
            if (donationTeam) {
                donation.pickupSchedule = donationTeam.pickupSchedule;
                donation.deliverySchedule = donationTeam.deliverySchedule;
            }
        }

        // Check if logged in volunteer is leader of the donation team for this donation
        let isLeader = false;
        if (req.user && req.user.role === 'Volunteer') {
            const donationTeam = await DonationTeam.findOne({
                donationId: donation._id,
                leaderId: req.user._id
            });
            isLeader = donationTeam ? true : false;
        }
        
        // Find completion images from donation teams 
        let donationTeam = await DonationTeam.findOne({ donationId: donation._id }).select('completionProof');

        return safeRender(res, 'donations/show', {
            activePage: 'donation-details',
            pageTitle: `${donation.title} | AnnaMitra`,
            messageType: null,
            message: null,
            donation,
            isDonor,
            isRequested,
            isLeader,
            donationRequests: enrichedRequests,
            availableVolunteers,
            donationTeam
        }, next);
    } catch (error) {
        console.error('Error fetching donation details:', error);
        res.status(500);
        return safeRender(res, 'donations/show', {
            activePage: 'donation-details',
            pageTitle: 'Error | AnnaMitra',
            messageType: 'danger',
            message: 'Server error while fetching donation details.'
        }, next);
    }
})

// Render edit donation form
module.exports.renderEditDonationForm = catchAsync(async (req, res, next) => {
    const donationId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
        res.status(400);
        return safeRender(res, 'donations/edit', {
            activePage: 'edit-donation',
            pageTitle: 'Donation not found | AnnaMitra',
            messageType: 'danger',
            message: 'Invalid donation ID.'
        }, next);
    }

    try {
        const donation = await Donation.findById(donationId).populate('donorId', 'firstName lastName email contact');
        if (!donation) {
            res.status(404);
            return safeRender(res, 'donations/edit', {
                activePage: 'edit-donation',
                pageTitle: 'Donation not found | AnnaMitra',
                messageType: 'danger',
                message: 'Donation not found.'
            }, next);
        }

        // Ensure that only the donor who created the donation can edit it
        if (!donation.donorId._id.equals(req.user._id)) {
            return safeRender(res, '404', {
                activePage: '404',
                pageTitle: 'Unauthorized | AnnaMitra',
                messageType: 'danger',
                message: 'You are not authorized to edit this donation.'
            }, next);
        }

        console.log('Donation found for edit:', donation);
        return safeRender(res, 'donations/edit', {
            activePage: 'edit-donation',
            pageTitle:'Edit donation | AnnaMitra', 
            messageType: null,
            message: null,
            donation
        }, next);
    } catch (error) {
        console.error('Error fetching donation for edit:', error);
        res.status(500);
        return safeRender(res, 'donations/edit', {
            activePage: 'edit-donation',
            pageTitle: 'Error | AnnaMitra',
            messageType: 'danger',
            message: 'Server error while fetching donation for edit.'
        }, next);
    }
})

module.exports.submitEditDonationForm = catchAsync(async (req, res) => {
    // return res.status(400).json({success: false, message: 'failll'});

    if (mongoose.connection.readyState !== 1) {
        console.error('Database connection is not ready');
        return res.json({ success: false, message: 'Database connection error! Faild to upload donation.' });
    }

    try {
        const { donation, oldImages } = req;
        const donationId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(donationId)) {
            return res.status(400).json({ success: false, message: 'Invalid donation ID.' });
        }

        const newDonation = await Donation.findByIdAndUpdate(donationId, donation, { new: true });

        if (!newDonation) {
            return res.status(404).json({ success: false, message: 'Donation not found! Failed to update.' });
        }

        deleteFiles(oldImages);

        return res.status(200).json({
            success: true,
            message: 'Donation updated successfully.',
            donationId: newDonation._id
        });
    } catch (error) {
        console.error('Error updating donation:', error);
        return res.status(500).json({ success: false, message: 'Server error while updating donation.' });
    }
});

// Delete a donation
module.exports.deleteDonation = catchAsync(async (req, res) => {
    const donationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(donationId)) {
        return res.status(400).json({ success: false, message: 'Invalid donation ID.' });
    }

    if (mongoose.connection.readyState !== 1) {
        console.error('Database connection is not ready');
        return res.json({ success: false, message: 'Database connection error! Faild to upload donation.' });
    }

    try {
        console.log('Deleting donation with ID:', donationId);
        const donation = await Donation.findByIdAndDelete(donationId);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found.' });
        }

        return res.status(200).json({ success: true, message: 'Donation deleted successfully.' });
    } catch (error) {
        console.error('Error deleting donation:', error);
        return res.status(500).json({ success: false, message: 'Server error while deleting donation.' });
    }
})

// List all donations
module.exports.listDonations = catchAsync(async (req, res, next) => {
    try {
        if(!mongoose.connection.readyState) {
            console.error('Database connection is not ready');
            res.status(500);
            return safeRender(res, 'donations/index', {
                activePage: 'donations',
                pageTitle: 'Connection error | AnnaMitra',
                messageType: 'danger',
                message: 'Database connection error! Failed to fetch donations.',
                donations: [],
            }, next);
        }

        const donations = await Donation.find().populate('donorId', 'firstName lastName email contact').sort({ createdAt: -1 });
        return safeRender(res, 'donations/index', {
            activePage: 'donations',
            pageTitle: `${donations.length} - Donations found | AnnaMitra`,
            messageType: null,
            message: null,
            donations
        }, next);
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500);
        return safeRender(res, 'donations/index', {
            activePage: 'donations',
            pageTitle: 'Error | AnnaMitra',
            messageType: 'danger',
            message: 'Server error while fetching donations.',
            donations: []
        }, next);
    }
})



// Add to src/controllers/donation.controller.js

// Handle donation request
module.exports.handleDonationRequest = catchAsync(async (req, res) => {  
    console.log('Handling donation request:', req.body);  
    try {
        const { donationId, donorId, message } = req.body;
        const ngoId = req.user._id; 

        // Check if a request from this ngoId for this donationId already exists
        const existingRequest = await DonationRequest.findOne({ donationId, ngoId, status: 'New' });
        if (existingRequest) {
            return res.json({ success: false, message: 'You have already requested this donation.' });
        }
        const request = new DonationRequest({
            donationId,
            donorId,
            ngoId,
            message
        });
        
        await request.save();

        // Notify donor that an NGO requested their donation
        try {
            const donationDoc = await Donation.findById(donationId).select('donorId title');
            const donorUserId = donationDoc?.donorId;
            if (donorUserId) {
                await Notification.createIfAllowed({
                    userId: donorUserId,
                    title: 'New request for your donation',
                    message: `An NGO has requested your donation "${donationDoc.title || ''}". Review the request.`,
                    type: 'info',
                    redirectUrl: `/donations/${donationId}`
                });
            }
        } catch (notifyErr) {
            console.error('Error creating notification for donor on request:', notifyErr);
        }
        
        res.json({ success: true, message: 'Request sent successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ success: false, message: "You have already requested this donation." });
        }
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Failed to send request' });
    }
});

// Approve donation request
module.exports.approveRequest = catchAsync(async (req, res) => {
    const { requestId } = req.params;
    
    try {
        const request = await DonationRequest.findById(requestId);

        // check if logged in donor owns the donation for this request
        if (request.user && !request.donorId.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'You are not authorized to approve this request.' });
        }
        
        request.status = 'Accepted';
        request.respondedAt = new Date();
        await request.save();
        
        // Update donation status to 'Assigned'
        const approvedDonation = await Donation.findByIdAndUpdate(request.donationId, { status: 'Assigned', assignedNgoId: request.ngoId });

        // Add donation id to ngo's donationsHandled
        const ngoProfile = await NGOProfile.findOne({ userId: request.ngoId });
        ngoProfile.donationsHandled.push(request.donationId);
        await ngoProfile.save();

        // Notify the NGO that their request was approved
        try {
            await Notification.createIfAllowed({
                userId: request.ngoId,
                title: 'Donation request approved',
                message: `Your request for donation ${approvedDonation.title || ''} has been approved.`,
                type: 'success',
                redirectUrl: `/donations/${approvedDonation._id}`
            });
        } catch (notifyErr) {
            console.error('Error notifying NGO about approval:', notifyErr);
        }
        
        res.json({ success: true, message: 'Request approved' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to approve request' });
    }
});

// Reject donation request
module.exports.rejectRequest = catchAsync(async (req, res) => {
    const { requestId } = req.params;
    
    try {
        const reqDoc = await DonationRequest.findByIdAndUpdate(requestId, {
            status: 'Rejected',
            respondedAt: new Date()
        }, { new: true });

        const donation = await Donation.findById(reqDoc.donationId).select('title');

        // Notify the NGO that their request was rejected
        try {
            if (reqDoc) {
                await Notification.createIfAllowed({
                    userId: reqDoc.ngoId,
                    title: 'Donation request rejected',
                    message: `Your request for donation ${donation.title} was rejected by the donor.`,
                    type: 'danger',
                    redirectUrl: `/donations/${reqDoc.donationId}`
                });
            }
        } catch (notifyErr) {
            console.error('Error notifying NGO about rejection:', notifyErr);
        }
        
        res.json({ success: true, message: 'Request rejected' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to reject request' });
    }
});

// Cancel Donation Pickup
module.exports.cancelDonationPickup = catchAsync(async (req, res) => {
    const { id } = req.params; // donation ID
    
    try {
        // Find the donation and check if it's assigned
        const donation = await Donation.findById(id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        
        if (donation.status === 'New') {
            return res.status(400).json({ success: false, message: 'Donation is not currently assigned' });
        }
        
        if (!donation.assignedNgoId) {
            return res.status(400).json({ success: false, message: 'No NGO is currently assigned to this donation' });
        }
        
        // Mark the donation request from the assigned NGO as rejected
        await DonationRequest.findOneAndUpdate(
            { 
                donationId: id, 
                ngoId: donation.assignedNgoId,
                status: 'Accepted'
            },
            { 
                status: 'Rejected',
                respondedAt: new Date()
            }
        );
        
        // Reset the donation status to 'New' and remove assigned NGO
        await Donation.findByIdAndUpdate(id, {
            status: 'New',
            assignedNgoId: null
        });

        // Make all volunteers of any existing donation team available again
        const donationTeam = await DonationTeam.findOne({ donationId: id });
        if (donationTeam) {
            await VolunteerProfile.updateMany(
                { userId: { $in: donationTeam.volunteers } },
                { isAvailable: true }
            );
            // Optionally, you might want to delete the donation team as well
            await DonationTeam.deleteOne({ donationId: id });
        }
        
        res.json({ 
            success: true, 
            message: 'Donation pickup cancelled successfully. The donation is now available for other NGOs.' 
        });
        
    } catch (error) {
        console.error('Error cancelling donation pickup:', error);
        res.status(500).json({ success: false, message: 'Failed to cancel donation pickup' });
    }
});

// Schedule Donation Pickup
module.exports.schedulePickup = catchAsync(async (req, res) => {
    const { id } = req.params; // donation ID
    const ngoId = req.user._id; // logged-in NGO user ID

    const {
        pickupSchedule,
        deliverySchedule,
        volunteers,
        leaderId
    } = req.body;

    // 1. BASIC VALIDATION
    if (!pickupSchedule?.date || !pickupSchedule?.time) {
        return res.status(400).json({
            success: false,
            message: "Pickup date and time are required."
        });
    }

    if (!volunteers || !Array.isArray(volunteers) || volunteers.length < 2) {
        return res.status(400).json({
            success: false,
            message: "At least two volunteer must be selected."
        });
    }

    // 2. FETCH DONATION
    const donation = await Donation.findById(id);

    if (!donation) {
        return res.status(404).json({
            success: false,
            message: "Donation not found."
        });
    }

    // 3. ENSURE NGO OWNS THIS DONATION
    if (!donation.assignedNgoId || donation.assignedNgoId.toString() !== ngoId.toString()) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized to schedule this donation."
        });
    }

    // 4. ENSURE VALID DONATION STATUS
    if (donation.status !== "Assigned") {
        return res.status(400).json({
            success: false,
            message: "This donation cannot be scheduled at this stage."
        });
    }

    // 5. ENSURE VOLUNTEERS ARE VALID & AVAILABLE
    const volunteerProfiles = await VolunteerProfile.find({
        userId: { $in: volunteers },
        isAvailable: true
    });

    if (volunteerProfiles.length !== volunteers.length) {
        return res.status(400).json({
            success: false,
            message: "One or more selected volunteers are not available."
        });
    }

    // 6. ENSURE NONE OF THEM IS ALREADY IN AN ACTIVE TEAM
    for (let volId of volunteers) {
        const isAlreadyAssigned = await DonationTeam.exists({
            volunteers: volId,
            completionProof: { $size: 0 } // active team
        });

        if (isAlreadyAssigned) {
            return res.status(400).json({
                success: false,
                message: "One or more volunteers are already assigned to another donation."
            });
        }
    }

    // 7. VALIDATE LEADER (IF PROVIDED)
    if (leaderId && !volunteers.includes(leaderId)) {
        return res.status(400).json({
            success: false,
            message: "Leader must be selected from chosen volunteers."
        });
    }

    // 8. CREATE DONATION TEAM
    const donationTeam = new DonationTeam({
        donationId: donation._id,
        ngoId,
        pickupSchedule: {
            date: pickupSchedule.date,
            time: pickupSchedule.time
        },
        deliverySchedule: {
            date: deliverySchedule?.date || null,
            time: deliverySchedule?.time || null,
            location: deliverySchedule?.location || ""
        },
        volunteers,
        leaderId: leaderId || null
    });

    await donationTeam.save();

    // 9. UPDATE DONATION STATUS → SCHEDULED
    donation.status = "Scheduled";
    await donation.save();

    // 10. LOCK ALL SELECTED VOLUNTEERS
    await VolunteerProfile.updateMany(
        { userId: { $in: volunteers } },
        { isAvailable: false }
    );

    // Notify donor and volunteers about scheduling
    try {
        // notify donor
        if (donation.donorId) {
            await Notification.createIfAllowed({
                userId: donation.donorId,
                title: 'Pickup scheduled for your donation',
                message: `Pickup for "${donation.title || ''}" is scheduled on ${pickupSchedule.date} at ${pickupSchedule.time}.`,
                type: 'info',
                redirectUrl: `/donations/${donation._id}`
            });
        }

        // notify volunteers (bulk)
        if (Array.isArray(volunteers) && volunteers.length) {
            const volNotifications = volunteers.map(vId => ({
                userId: vId,
                title: 'You have been assigned to a pickup',
                message: `You are assigned for pickup of donation "${donation.title || ''}" on ${pickupSchedule.date} at ${pickupSchedule.time}.`,
                type: 'info',
                redirectUrl: `/donations/${donation._id}`
            }));
            await Notification.insertManyIfAllowed(volNotifications);
        }

        // notify leader with a distinct message
        if (leaderId) {
            await Notification.createIfAllowed({
                userId: leaderId,
                title: 'You are the leader for an upcoming pickup',
                message: `You are assigned as leader for pickup of "${donation.title || ''}" on ${pickupSchedule.date} at ${pickupSchedule.time}.`,
                type: 'info',
                redirectUrl: `/donations/${donation._id}`
            });
        }
    } catch (notifyErr) {
        console.error('Error creating schedule notifications:', notifyErr);
    }

    // 11. SUCCESS RESPONSE
    res.status(201).json({
        success: true,
        message: "Pickup scheduled successfully.",
        donationTeam
    });
});


// Mark Donation as Completed
module.exports.markDonationCompleted = catchAsync(async (req, res) => {
    const { id } = req.params; // donation ID

    // 1. ENSURE FILES EXIST
    if (!req.files || req.files.length > 10) {
        return res.status(400).json({
            success: false,
            message: "Maximum 10 completion images are required."
        });
    }

    // 2. FIND DONATION TEAM
    const donationTeam = await DonationTeam.findOne({
        donationId: id
    });

    if (!donationTeam) {
        return res.status(404).json({
            success: false,
            message: "Donation team not found."
        });
    }

    // 3. SAVE IMAGE PATHS
    const imageUrls = req.files.map(file => {
        let imgPath = file.path.replace(/\\/g, '/');

        if (imgPath.includes('public/')) {
            imgPath = '/' + imgPath.split('public/')[1];
        } else {
            imgPath = '/' + imgPath;
        }

        return imgPath;
    });
    donationTeam.completionProof = imageUrls;
    await donationTeam.save();

    // 4. UPDATE DONATION STATUS → COMPLETED
    const donation = await Donation.findById(id);

    if (!donation) {
        return res.status(404).json({
            success: false,
            message: "Donation not found."
        });
    }

    donation.status = "Completed";
    donation.completedAt = new Date();
    await donation.save();

    // 5. UNLOCK ALL VOLUNTEERS
    await VolunteerProfile.updateMany(
        { userId: { $in: donationTeam.volunteers } },
        { isAvailable: true }
    );

    // Notify donor that donation is completed
    try {
        if (donation.donorId) {
            await Notification.createIfAllowed({
                userId: donation.donorId,
                title: 'Donation completed',
                message: `Your donation "${donation.title || ''}" has been marked as completed. Click to rate the NGO. Thank you!`,
                type: 'success',
                redirectUrl: `/donations/${donation._id}`
            });
        }
    } catch (notifyErr) {
        console.error('Error notifying donor about completion:', notifyErr);
    }

    res.status(200).json({
        success: true,
        message: "Donation marked as completed successfully."
    });
});



// Generate and send OTP to donor
module.exports.sendOTP = catchAsync(async (req, res) => {
    const { id } = req.params; // donation ID
    
    try {
        // Find the donation and check if it's assigned
        const donation = await Donation.findById(id).populate('donorId');
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        
        if (donation.status !== 'Scheduled') {
            return res.status(400).json({ success: false, message: 'Donation is not currently scheduled' });
        }
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in donation document (you might want to create a separate OTP model)
        await Donation.findByIdAndUpdate(id, { 
            otp: otp,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
            otpGeneratedAt: new Date()
        });
        
        // In a real application, you would send SMS here
        // For now, we'll just log it and return success
        console.log(`OTP ${otp} sent to donor ${donation.donorId.contact} for donation ${donation.title}`);
        
        // Create notification for donor with OTP (for testing; remove OTP in production)
        try {
            if (donation.donorId) {
                await Notification.createIfAllowed({
                    userId: donation.donorId._id ? donation.donorId._id : donation.donorId,
                    title: 'OTP for donation pickup',
                    message: `Your OTP for donation ${donation.title} pickup is: ${otp}. It expires in 10 minutes.`,
                    type: 'info',
                    redirectUrl: `/donations/${id}`
                });
            }
        } catch (notifyErr) {
            console.error('Error notifying donor with OTP:', notifyErr);
        }
        
        res.json({ 
            success: true, 
            message: 'OTP sent successfully to donor',
            otp: otp // Remove this in production - only for testing
        });
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});


// Verify OTP and mark donation as picked
module.exports.verifyOTP = catchAsync(async (req, res) => {
    const { id } = req.params; // donation ID
    const { otp } = req.body;
    
    try {
        // Find the donation
        const donation = await Donation.findById(id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        
        if (donation.status !== 'Scheduled') {
            return res.status(400).json({ success: false, message: 'Donation is not currently scheduled' });
        }
        
        // Check if OTP exists and is valid
        if (!donation.otp || !donation.otpExpiry) {
            return res.status(400).json({ success: false, message: 'No OTP found for this donation' });
        }
        
        // Check if OTP has expired
        if (new Date() > donation.otpExpiry) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }
        
        // Verify OTP
        if (donation.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
        }
        
        // Update donation status to 'Picked'
        await Donation.findByIdAndUpdate(id, {
            status: 'Picked',
            pickedAt: new Date(),
            otp: null, // Clear OTP after successful verification
            otpExpiry: null,
            otpGeneratedAt: null
        });

        // Notify donor that pickup was verified / marked as picked
        try {
            if (donation.donorId) {
                await Notification.createIfAllowed({
                    userId: donation.donorId,
                    title: 'Donation picked up',
                    message: `Pickup verified for your donation "${donation.title || ''}".`,
                    type: 'success',
                    redirectUrl: `/donations/${id}`
                });
            }
        } catch (notifyErr) {
            console.error('Error notifying donor after OTP verify:', notifyErr);
        }
        
        res.json({ 
            success: true, 
            message: 'OTP verified successfully! Donation marked as picked up.' 
        });
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
});

