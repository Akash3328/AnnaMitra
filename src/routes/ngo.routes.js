const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const ngoController = require('../controllers/ngo.controller');
const ngoMiddleware = require('../middlewares/ngo.middleware');
const { isLoggedIn, isNGO, isVolunteer } = require('../middlewares/auth.middleware');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         if (file.fieldname === 'profileImage' || file.fieldname === 'bannerImage') {
//             cb(null, 'public/images/ngos');
//         } else if (file.fieldname === 'documents') {
//             cb(null, 'public/donations/ngos');
//         } else {
//             cb(null, 'public/uploads'); // fallback
//         }
//     },
//     filename: (req, file, cb) => {
//         cb(
//             null,
//             file.fieldname + '-' + uuidv4() + '.' + file.originalname.split('.').pop()
//         );
//     }
// });

const fs = require('fs');
const path = require('path');

// Use memory storage on Vercel (read-only filesystem), disk storage locally
const isVercel = !!process.env.VERCEL;

let storage;
if (isVercel) {
    // Memory storage for Vercel (files will be in req.file.buffer)
    storage = multer.memoryStorage();
} else {
    // Disk storage for local development
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const ROOT_PUBLIC = path.join(process.cwd(), 'public');
            let uploadPath;

            if (file.fieldname === 'profileImage' || file.fieldname === 'bannerImage') {
                uploadPath = path.join(ROOT_PUBLIC, 'images', 'ngos');
            } 
            else if (file.fieldname === 'documents') {
                uploadPath = path.join(ROOT_PUBLIC, 'donations', 'ngos');
            }

            // AUTO-CREATE THE REAL FOLDERS (only in non-Vercel environments)
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(
                null,
                file.fieldname + '-' + uuidv4() + '.' + file.originalname.split('.').pop()
            );
        }
    });
}

const upload = multer({ storage });

// All routes here require user to be logged in 
router.use(isLoggedIn);

// Dashboard Route
router.get('/', isNGO, ngoController.renderDashboardPage);

// Active Donations Route
router.get('/my-donations', isNGO, ngoController.renderMyDonationsPage);

// Staff Route
router.get('/staff', isNGO, ngoController.renderStaffPage);

// Joining Requests Route
router.get('/joining-requests', isNGO, ngoController.renderJoiningRequestsPage);

// Accept Volunteer Request Route
router.post('/requests/:requestId/accept', isNGO, ngoController.acceptVolunteerRequest);

// Reject Volunteer Request Route
router.post('/requests/:requestId/reject', isNGO, ngoController.rejectVolunteerRequest);

// Notifications Route
router.get('/notifications', isNGO, ngoController.renderNotificationsPage);

// Manage Account Route
router.get('/account', isNGO, ngoController.renderManageAccountPage);

// Update Account Details
router.put('/account', 
    isNGO,
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 },
        { name: 'documents', maxCount: 10 }
    ]), 
    ngoMiddleware.constructProfileData, 
    ngoMiddleware.validateProfileData, 
    ngoController.handleUpdateAccount);

// View Ngo Profile Route
router.get('/:id', ngoController.renderNgoProfilePage);

// Handle Volunteer Request Route
router.post('/:id/request-join', isVolunteer, ngoController.handleVolunteerRequest);

// Remove volunteer from NGO
router.delete('/:id/volunteers/:volunteerId', ngoController.removeVolunteerFromNGO);

module.exports = router;