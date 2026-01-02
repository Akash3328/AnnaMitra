const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const donorController = require('../controllers/donor.controller');
const donorMiddleware = require('../middlewares/donor.middleware');
const { isLoggedIn, isDonor } = require('../middlewares/auth.middleware');

// Use memory storage on Vercel (read-only filesystem), disk storage locally
const isVercel = !!process.env.VERCEL;
const storage = isVercel 
    ? multer.memoryStorage() 
    : multer.diskStorage({
        destination: 'public/images/donors',
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + uuidv4() + '.' + file.originalname.split('.').pop());
        }
    });
const upload = multer({ storage });

// All routes here require user to be logged in and to be a donor
router.use(isLoggedIn, isDonor);

router.get('/', donorController.viewDonorDashboard);

router.put('/', upload.single('profileImage'), donorMiddleware.validateDonorProfileData, donorController.updateDonorProfile);

router.get('/account', donorController.renderDonorAccountPage);

router.get('/notifications', donorController.renderNotificationsPage);

router.post('/toggle-notifications', donorController.toggleDonorNotifications);

module.exports = router;