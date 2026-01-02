const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const volunteerController = require('../controllers/volunteer.controller');
const volunteerMiddleware = require('../middlewares/volunteer.middleware');
const { isLoggedIn, isVolunteer } = require('../middlewares/auth.middleware');

// Use memory storage on Vercel (read-only filesystem), disk storage locally
const isVercel = !!process.env.VERCEL;
const storage = isVercel 
    ? multer.memoryStorage() 
    : multer.diskStorage({
        destination: 'public/images/volunteers',
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + uuidv4() + '.' + file.originalname.split('.').pop());
        }
    });
const upload = multer({ storage });

// All routes here require user to be logged in and to be a volunteer
router.use(isLoggedIn);

// All routes here require user to be a volunteer
router.use(isVolunteer);

// Dashboard Route
router.get('/', volunteerController.renderDashboardPage);

// Update Profile Route
router.put('/', upload.single('profileImage'), volunteerMiddleware.validateVolunteerProfile, volunteerController.updateVolunteerProfile);

// Assigned Tasks Route
router.get('/assigned-tasks', volunteerController.renderAssignedTasksPage);

// Donation History Route
router.get('/donation-history', volunteerController.renderDonationHistoryPage);

// Notifications Route
router.get('/notifications', volunteerController.renderNotificationsPage);

// NGOs Route
router.get('/ngos', volunteerController.renderNgosPage);

// Joined NGOs Route
router.get('/joined-ngos', volunteerController.renderJoinedNgosPage);

// Manage Account Route
router.get('/account', volunteerController.renderManageAccountPage);

// Toggle Notifications Route
router.post('/toggle-notifications', volunteerController.toggleVolunteerNotifications);

// Toggle Availability Route
router.post('/toggle-availability', volunteerController.toggleVolunteerAvailability);


module.exports = router;