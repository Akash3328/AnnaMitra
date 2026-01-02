const Joi = require('joi');
const mongoose = require('mongoose');





//  ------------------------------  Donation Schema  ------------------------------


// Enum options
const foodSourceOptions = [
    "Restaurant", "Event", "Home", "Caterer", "Supermarket", "Bakery", "Corporate",
    "Religious Place", "Hostel", "Canteen", "NGO", "Other"
];

const donationStatusOptions = [
    "New", "Assigned", "Scheduled", "Picked", "Completed", "Failed"
];

const quantityUnitOptions = [
    "Kilograms", "Grams", "Liters", "Milliliters", "Pieces", "Packets", "Boxes", "Cans", "Bottles", "Other"
];

const foodTypeOptions = [
    "Cooked Food", "Raw Food", "Packaged Food", "Fruits & Vegetables", "Spices & Condiments",
    "Canned or Tinned Food", "Bakery Products", "Dairy Products",
    "Beverages", "Nutritional Supplements", "Other"
];

const foodConditionOptions = [
    "Fresh", "Leftover", "Near Expiry", "Preserved", "Slightly Used", "Other"
];

// Sub-schema for food items
const foodItemSchema = Joi.object({
    name: Joi.string().trim().required(),
    quantity: Joi.number().min(1).required(),
    unit: Joi.string().valid(...quantityUnitOptions).required(),
    type: Joi.string().valid(...foodTypeOptions).required(),
    condition: Joi.string().valid(...foodConditionOptions).required(),
    expiryDate: Joi.date().optional().allow(null),
    expiryTime: Joi.string().optional().allow(null),
    cookedDate: Joi.date().required(),
    cookedTime: Joi.string().required(),
    itemImages: Joi.array().items(Joi.string()).min(1).max(3).required()
}).unknown(true);

// Main donation schema
module.exports.donationSchema = Joi.object({
    donation: Joi.object({
        donorId: Joi.custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            }).required(),

        title: Joi.string().trim().max(100).required(),
        items: Joi.array().items(foodItemSchema).min(1).required(),
        source: Joi.string().valid(...foodSourceOptions).required(),
        items: Joi.array().items(foodItemSchema).min(1).required(),
        numberOfPeopleFed: Joi.number().min(1).required(),
        description: Joi.string().trim().allow('', null).optional(),
        images: Joi.array().items(Joi.string()).min(1).max(5).required(),
        status: Joi.string().valid(...donationStatusOptions).default('New'),
        address: Joi.string().max(300).required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().pattern(/^\d{6}$/).required(),
        location: Joi.object({
            longitude: Joi.number().required(),
            latitude: Joi.number().required()
        }).required(),
        contact: Joi.string().pattern(/^\d{10}$/).required(),
        email: Joi.string().email().required(),
        personName: Joi.string().required(),
        assignedNgoId: Joi.custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            }).allow(null).optional(),

        otp: Joi.string().allow(null).optional(),
        otpExpiry: Joi.date().allow(null).optional(),
        otpGeneratedAt: Joi.date().allow(null).optional(),

        pickedAt: Joi.date().allow(null).optional()
    }).unknown(true).required()
});



//  ------------------------------  User Schema  ------------------------------

const userRoleOptions = [
    "Donor", "NGO", "Volunteer"
];

module.exports.userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        // password min 8 chars, one lowercase, one uppercase, one number, one special char
        password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required(),
        contact: Joi.string().pattern(/^\d{10}$/).required(),
        role: Joi.string().valid(...userRoleOptions).required(),
        resetPasswordToken: Joi.string().optional(),
        resetPasswordExpires: Joi.date().optional()
    }).unknown(true).required()
}).unknown(true);




//  ------------------------------  DonorProfile Schema  ------------------------------

module.exports.donorProfileSchema = Joi.object({
    donorProfile: Joi.object({
        userId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .optional(),

        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        donorSourceName: Joi.string().trim().optional(),
        profilePicture: Joi.string().optional(),
        languagePreference: Joi.string().default("en"),
        notificationsEnabled: Joi.boolean().default(true),
        about: Joi.string().max(1000).optional(),
        address: Joi.string().max(300).trim().required(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        pincode: Joi.string().pattern(/^\d{6}$/).required(),
        donationHistory: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
        ).optional(),
        feedbackReceived: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
        ).optional()
    }).required()
}).unknown(true);




//  ------------------------------  NGOProfile Schema  ------------------------------

module.exports.ngoProfileSchema = Joi.object({
    ngoProfile: Joi.object({
        userId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .optional(),

        organizationName: Joi.string().trim().required(),
        registrationNumber: Joi.string().trim().required(),
        registeredUnder: Joi.string().trim().required(),
        profilePicture: Joi.string().optional(),
        languagePreference: Joi.string().default("en"),
        notificationsEnabled: Joi.boolean().default(true),
        bannerPicture: Joi.string().optional(),
        website: Joi.string().uri().optional(),
        address: Joi.string().max(300).trim().required(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        pincode: Joi.string().pattern(/^\d{6}$/).required(),
        about: Joi.string().max(1000).required(),
        missionStatement: Joi.string().max(500).optional(),
        visionStatement: Joi.string().max(500).optional(),
        areasOfOperation: Joi.array().items(Joi.string().trim()).min(1).optional(),
        documents: Joi.array().items(Joi.string()).min(1).required(),
        volunteers: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
        ).optional(),
        donationsHandled: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
        ).optional(),
        financialDonations: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
        ).optional(),
        bankDetails: Joi.object({
            accountNumber: Joi.string().optional(),
            ifscCode: Joi.string().optional(),
            upiId: Joi.string().optional(),
            isVisible: Joi.boolean().default(false)
        }).optional(),
        ngoFeedbackReceived: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
        ).optional()
    }).required()
}).unknown(true);




//  ------------------------------  VolunteerProfile Schema  ------------------------------

module.exports.volunteerProfileSchema = Joi.object({
    volunteerProfile: Joi.object({
        userId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .optional(),

        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        profilePicture: Joi.string().optional(),
        languagePreference: Joi.string().default("en"),
        notificationsEnabled: Joi.boolean().default(true),
        isAvailable: Joi.boolean().default(true),
        about: Joi.string().max(1000).optional(),
        address: Joi.string().max(300).trim().required(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        pincode: Joi.string().pattern(/^\d{6}$/).required(),
        joinedNGOs: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
        ).optional(),
        participationHistory: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
        ).optional()
    }).required()
}).unknown(true);



//  ------------------------------  DonationTeam Schema  ------------------------------

module.exports.donationTeamSchema = Joi.object({
    donationTeam: Joi.object({
        donationId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .required(),

        ngoId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .required(),

        pickupSchedule: Joi.object({
            date: Joi.date().required(),
            time: Joi.string().required()
        }).required(),

        deliverySchedule: Joi.object({
            date: Joi.date().optional(),
            time: Joi.string().optional()
        }).optional(),

        volunteers: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (!mongoose.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
            )
            .min(1)
            .required(),

        leaderId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .required(),

        completionProof: Joi.array().items(Joi.string()).default([])
    }).required()
});




//  ------------------------------  DonationRequest Schema  ------------------------------

const donationRequestStatusOptions = [
    "New", "Accepted", "Rejected", "Cancelled"
];

module.exports.donationRequestSchema = Joi.object({
    donationRequest: Joi.object({
        donationId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .required(),

        donorId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .required(),

        ngoId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .required(),

        requestDate: Joi.date().optional(),
        status: Joi.string().valid(...donationRequestStatusOptions).default("New"),
        message: Joi.string().trim().max(500).required(),
        respondedAt: Joi.date().optional(),
        completedAt: Joi.date().optional()
    }).required()
});
