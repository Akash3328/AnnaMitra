const catchAsync = require('../utils/catchAsync');
const { volunteerProfileSchema } = require('../utils/joiSchemas');

module.exports.validateVolunteerProfile = catchAsync(async (req, res, next) => {
    try {
        let { volunteerProfile, user } = req.body;

        // FIX: Parse JSON coming from FormData
        if (typeof volunteerProfile === "string") {
            volunteerProfile = JSON.parse(volunteerProfile);
        }

        if (typeof user === "string") {
            user = JSON.parse(user);
        }

        if(!volunteerProfile || !user) {
            return res.status(400).send({ success: false, message: "Volunteer profile data or user data is missing." });
        }

        if(req.file) {
            volunteerProfile.profilePicture = req.file.path.split('public\\')[1].replace(/\\/g, '/');
        }

        await volunteerProfileSchema.validateAsync({ volunteerProfile }, { abortEarly: false });

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

        console.log("Volunteer profile data is valid.");
        req.validatedVolunteerProfile = volunteerProfile;
        req.validatedUser = user;
        next();
    } catch (err) {
        console.log("Error validating volunteer profile data:", err);
        return res.status(400).send({ success: false, message: err.message });
    }
});