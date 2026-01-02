
// -------------------------  Imports  -------------------------
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user.model');
const Donation = require('../models/donation.model');
const DonationRequest = require('../models/donationrequest.model');

const donorController = require('./donor.controller');
const ngoController = require('./ngo.controller');
const volunteerController = require('./volunteer.controller');

const safeRender = require('../utils/safeRender');
const catchAsync = require('../utils/catchAsync');



// Render login page
module.exports.renderLoginPage = (req, res, next) => {
    if (req.session) {
        console.log('Session data:', req.session);
    }
    return safeRender(res, 'login', {
        activePage: 'login',
        pageTitle: 'Login now | AnnaMitra',
        messageType: null,
        message: null
    }, next);
}

// Render register page
module.exports.renderRegisterPage = (req, res, next) => {
    return safeRender(res, 'register', {
        activePage: 'register',
        pageTitle: 'Register now | AnnaMitra',
        formData: {},
        messageType: null,
        message: null
    }, next);
}

// Render forgot password page
module.exports.renderForgotPasswordPage = (req, res, next) => {
    return safeRender(res, 'forgot-password', {
        activePage: 'forgot-password',
        pageTitle: 'Forgot password | AnnaMitra',
        messageType: null,
        message: null
    }, next);
}

// Render reset password page
module.exports.renderResetPasswordPage = (req, res, next) => {
    return safeRender(res, 'reset-password', {
        activePage: 'reset-password',
        pageTitle: 'Reset password | AnnaMitra',
        messageType: null,
        message: null,
        token: req.params.token
    }, next);
};

// Handle user login
module.exports.loginUser = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        // if (err) return next(err);
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'An error occurred during authentication.' });
        }

        if (!user) {
            // Authentication failed
            // `info.message` comes from passport-local (e.g. "Missing credentials", "Incorrect password")
            return res.status(400).json({ success: false, message: info.message || "Login failed" });
        }

        // Log the user in
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                // return next(err);
                return res.status(500).json({ success: false, message: 'An error occurred during login.' });
            }

            // 🔑 Custom role-based redirect logic
            console.log('User logged in:', user);
            return res.status(200).json({ success: true, message: "Login successful!", role: user.role.toLowerCase() });
        });
    })(req, res, next);
}

// Handle user registration
module.exports.registerUser = async (req, res, next) => {
    try {
        const { user } = req.body;
        // register the user and if successful, create profile based on role
        const registeredUser = await User.register(user, user.password)
        console.log('User registered:', registeredUser);
        if (user.role === 'Donor') {
            donorController.createDonorProfile(registeredUser._id, req.body.donorProfile);
        } else if (user.role === 'NGO') {
            ngoController.createNgoProfile(registeredUser._id, req.body.ngoProfile);
        } else if (user.role === 'Volunteer') {
            volunteerController.createVolunteerProfile(registeredUser._id, req.body.volunteerProfile);
        }
        req.login(registeredUser, err => {
            if (err) {
                console.log(err);
                next(err);
            }
            return res.status(200).json({ success: true, message: 'Registration successful!', role: registeredUser.role.toLowerCase() });
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

// Handle logout
module.exports.logoutUser = (req, res) => {
    req.logout(err => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Error logging out.' });
        }
        res.status(200).json({ success: true, message: 'Logged out successfully.' });
    });
}

// Handle forgot password
module.exports.handleForgotPassword = catchAsync(async (req, res, next) => {
    console.log('Forgot password request body:', req.body);
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'No account with that email address exists.' });
    }

    return res.status(400).json({ success: false, message: 'Forgot password functionality is not yet implemented.' });

    // Generate a reset token and its expiration
    const crypto = require('crypto');
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Send email with the reset link (pseudo-code, implement actual email sending)
    const resetLink = `http://${req.headers.host}/auth/reset-password/${token}`;
    console.log(`Password reset link (send this via email): ${resetLink}`);
});

// Handle reset password
module.exports.handleResetPassword = catchAsync(async (req, res, next) => {
    console.log('Reset password request body:', req.body);
    const { token } = req.params;
    const { password, cpassword } = req.body;

    // check password is "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.' });
    }
    if (password !== cpassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // token is not expired
    });

    if (!user) {
        return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
    }

    // Update the user's password
    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
});

// Handle change password 
module.exports.handleChangePassword = catchAsync(async (req, res, next) => {
    console.log('Change password request body:', req.body);
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }
    // Verify current password
    const isMatch = await user.authenticate(currentPassword);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long and include uppercase, lowercase, number, and special character.' });
    }
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }
    // Update password
    await user.setPassword(newPassword);
    await user.save();
    return res.status(200).json({ success: true, message: 'Password changed successfully.' });
});