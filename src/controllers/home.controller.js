const User = require('../models/user.model');
const VolunteerProfile = require('../models/volunteerprofile.model');
const DonorProfile = require('../models/donorprofile.model');
const NGOProfile = require('../models/ngoprofile.model');
const Donation = require('../models/donation.model');
const Notification = require('../models/notification.model');
const catchAsync = require('../utils/catchAsync');
const safeRender = require('../utils/safeRender');


// Render home page
module.exports.renderHomePage = (req, res, next) => {
    safeRender(res, 'home', {
        activePage: 'home',
        pageTitle: 'Welcome to AnnaMitra',
        messageType: null,
        message: null
    }, next);
}

// Render about page
module.exports.renderAboutPage = (req, res, next) => {
    safeRender(res, 'about', {
        activePage: 'about',
        pageTitle: 'About | AnnaMitra',
        messageType: null,
        message: null
    }, next);
}

// Render contact page
module.exports.renderContactPage = (req, res, next) => {
    safeRender(res, 'contact', {
        activePage: 'contact',
        pageTitle: 'Contact us now | AnnaMitra',
        messageType: null,
        message: null
    }, next);
}

module.exports.markAllNotificationsRead = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    const userId = req.user._id;
    await Notification.updateMany({ userId: userId, notReaded: true }, { notReaded: false });
    return res.status(200).send({ success: true, message: "All notifications marked as read." });
});

module.exports.deleteNotification = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    const notificationId = req.params.id;
    const deletedNotification = await Notification.deleteOne({ _id: notificationId });
    if (!deletedNotification) {
        return res.status(404).send({ success: false, message: "Notification not found." });
    }
    return res.status(200).send({ success: true, message: "Notification deleted successfully." });
});

module.exports.testRoute = catchAsync(async (req, res) => {
    // throw new Error('testing error');
    try {
        // fetch donations sorted by date - newest first
        // const donations = await Donation.find({}).sort({ createdAt: -1 });
        // res.json(donations);

        const users = await User.find({role : 'Donor', createdAt: {$gte: new Date('2025-10-11')}}).sort({ createdAt: -1 });
        let ud = [];
        for(let user of users) {
            const userprofile = await DonorProfile.findOne({userId: user._id});
            ud.push({user, userprofile});
        }
        res.json(ud);


        // const users = await User.find({role: 'Donor'}).sort({ createdAt: -1 });
        // res.json(users);
    }
    catch (error) {
        console.error('Error in testRoute:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})