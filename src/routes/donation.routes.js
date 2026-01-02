const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const donationController = require('../controllers/donation.controller');
const donationMiddleware = require('../middlewares/donation.middleware');
const { isLoggedIn, isDonor, isNGO } = require('../middlewares/auth.middleware');

// Multer setup for file uploads
// Use memory storage on Vercel (read-only filesystem), disk storage locally
const isVercel = !!process.env.VERCEL;
const storage = isVercel 
    ? multer.memoryStorage() 
    : multer.diskStorage({
        destination: 'public/images/donations',
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + uuidv4() + '.' + file.originalname.split('.').pop());
        }
    });
const upload = multer({ storage });


// All routes here require user to be logged in
router.use(isLoggedIn);

router.get('/', donationController.listDonations);

router.get('/new', isDonor, donationController.renderDonationForm);

router.get('/:id', donationController.viewDonationDetails);

router.post('/:id/requests', isNGO, donationController.handleDonationRequest);

router.post('/:id/cancel-pickup', donationController.cancelDonationPickup);

router.post('/:id/schedule-pickup', isNGO, donationController.schedulePickup);

router.post('/:id/mark-completed', upload.any(), donationController.markDonationCompleted);

// OTP routes
router.post('/:id/send-otp', donationController.sendOTP);
router.post('/:id/verify-otp', donationController.verifyOTP);

// Only donors can create, edit, or delete donations
router.use(isDonor);

router.post('/', upload.any(), donationMiddleware.validateDonationData, donationController.submitDonationForm);

router.get('/:id/edit', donationController.renderEditDonationForm);

router.put('/:id/', upload.any(), donationMiddleware.validateDonationData, donationController.submitEditDonationForm);

router.delete('/:id', donationController.deleteDonation);

router.post('/:id/requests/:requestId/approve', donationController.approveRequest);

router.post('/:id/requests/:requestId/reject', donationController.rejectRequest);




module.exports = router;