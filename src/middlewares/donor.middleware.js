const DonorProfile = require('../models/donorprofile.model');
const User = require('../models/user.model');
const { donorProfileSchema, userSchema } = require('../utils/joiSchemas');
const catchAsync = require('../utils/catchAsync');

// Validate Donor Profile Data
module.exports.validateDonorProfileData = catchAsync(async (req, res, next) => {
    try {
        const { donorProfile, user } = req.body;
        if(!donorProfile || !user) {
            return res.status(400).send({ success: false, message: "Donor profile data or user data is missing." });
        }
        console.log("Validating donor profile data:", req.body);

        // check for profile image file
        if(req.file) {
            donorProfile.profilePicture = req.file.path.split('public\\')[1].replace(/\\/g, '/'); // Store relative path for easier access
        }

        await donorProfileSchema.validateAsync({ donorProfile }, { abortEarly: false });

        // Email validation (basic + common pattern)
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Contact validation (must be exactly 10 digits)
        const isValidContact = (contact) => {
            const contactRegex = /^[0-9]{10}$/;
            return contactRegex.test(contact);
        };

        // check for valid email format
        if(!isValidEmail(user.email)) {
            return res.status(400).send({ success: false, message: "Invalid email format." });
        }
        // check for valid contact format
        if(!isValidContact(user.contact)) {
            return res.status(400).send({ success: false, message: "Contact number must be exactly 10 digits." });
        }

        console.log("Donor profile data is valid.");
        req.validatedDonorProfile = donorProfile;
        req.validatedUser = user;
        next();
    }
    catch (error) {
        console.log("Error validating donor profile data:", error);
        return res.status(400).send({ success: false, message: error.message });
    }
});