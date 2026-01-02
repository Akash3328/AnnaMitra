const mongoose = require('mongoose');

// Define enums
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

// Food Item sub-schema
const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, enum: quantityUnitOptions, required: true },
    type: { type: String, enum: foodTypeOptions, required: true },
    condition: { type: String, enum: foodConditionOptions, required: true },
    expiryDate: { type: Date },
    expiryTime: { type: String },
    cookedDate: { type: Date, required: true },
    cookedTime: { type: String, required: true },
    itemImages: {
        type: [String],
        required: true,
        validate: {
            validator: v => Array.isArray(v) && v.length > 0 && v.length <= 3,
            message: 'Food item must have between 1 and 3 images.'
        }
    } // array of image URLs or paths
});

// Main Donation schema
const donationSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true, trim: true },

    source: { type: String, enum: foodSourceOptions, required: true },

    items: {
        type: [foodItemSchema],
        required: true,
        validate: {
            validator: v => Array.isArray(v) && v.length > 0,
            message: 'Minimum one food item is required.'
        }
    },

    numberOfPeopleFed: { type: Number, required: true, min: 1 },

    description: { type: String, trim: true },

    images: {
        type: [String],
        required: true,
        validate: {
            validator: v => Array.isArray(v) && v.length > 0 && v.length <= 5,
            message: 'Food donation must have between 1 and 5 images.'
        }
    }, // general images for the donation

    status: {
        type: String,
        enum: donationStatusOptions,
        default: 'New'
    },

    address: { type: String, required: true, maxlength: 300 },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },

    location: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },

    contact: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Contact number must be 10 digits']
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },

    personName: { type: String, required: true },

    assignedNgoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    
    // OTP fields for pickup verification
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpGeneratedAt: { type: Date, default: null },
    
    // Pickup tracking
    pickedAt: { type: Date, default: null },

    // Completion tracking
    completedAt: { type: Date, default: null }
}, {
    timestamps: true // adds createdAt and updatedAt
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
