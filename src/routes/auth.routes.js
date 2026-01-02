const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Use memory storage on Vercel (read-only filesystem), disk storage locally
const isVercel = !!process.env.VERCEL;
const storage = isVercel 
    ? multer.memoryStorage() 
    : multer.diskStorage({
    destination: 'public/documents/ngos',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + uuidv4() + '.' + file.originalname.split('.').pop());
    }
});
const upload = multer({ storage });


// Route for logout
router.get('/logout', authMiddleware.isLoggedIn, authController.logoutUser);

// Handle change password form submission from accout page
router.post('/change-password', authMiddleware.isLoggedIn, authController.handleChangePassword);


router.use(authMiddleware.isLoggedOut);

// Route for the login page
router.get('/login', authController.renderLoginPage);

// Handle login form submission
// router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login', failureMessage: true }), authController.loginUser);
router.post('/login', authController.loginUser);

// Route for the register page
router.get('/register', authController.renderRegisterPage);

// Handle register form submission
router.post('/register', upload.any(), authMiddleware.validateRegistrationData, authController.registerUser);

// Route for the forgot password page
router.get('/forgot-password', authController.renderForgotPasswordPage);

// Handle forgot password form submission
router.post('/forgot-password', authController.handleForgotPassword);

// Route for the reset password page
router.get('/reset-password/:token', authController.renderResetPasswordPage);

// Handle reset password form submission
router.post('/reset-password/:token', authController.handleResetPassword);


module.exports = router;