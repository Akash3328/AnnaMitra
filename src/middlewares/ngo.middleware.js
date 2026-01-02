
const NGOProfile = require('../models/ngoprofile.model');
const { ngoProfileSchema } = require('../utils/joiSchemas');
const catchAsync = require('../utils/catchAsync');

module.exports.constructProfileData = (req, res, next) => {
    console.log("✅ Account Body", req.body);

    const { ngoProfile, user } = req.body;

    // ✅ SAFETY CHECK
    if (!ngoProfile || !user) {
        return res.status(400).json({
            success: false,
            message: "Invalid account update payload."
        });
    }

    // ✅ BUILD NGO PROFILE DATA (CORRECT NESTED PATHS)
    req.ngoProfileData = {
        organizationName: ngoProfile.organizationName,
        registrationNumber: ngoProfile.registrationNumber,
        registeredUnder: ngoProfile.registeredUnder,
        website: ngoProfile.website || undefined,

        address: ngoProfile.address,
        city: ngoProfile.city,
        state: ngoProfile.state,
        pincode: ngoProfile.pincode,

        about: ngoProfile.about,
        missionStatement: ngoProfile.missionStatement || undefined,
        visionStatement: ngoProfile.visionStatement || undefined,

        areasOfOperation: typeof ngoProfile.areasOfOperation === "string"
            ? ngoProfile.areasOfOperation
                  .split(',')
                  .map(a => a.trim())
                  .filter(Boolean)
            : [],

        bankDetails: {
            accountNumber: ngoProfile.bankDetails?.accountNumber || undefined,
            ifscCode: ngoProfile.bankDetails?.ifscCode || undefined,
            upiId: ngoProfile.bankDetails?.upiId || undefined,
            isVisible: ngoProfile.bankDetails?.isVisible === "on"
        }
    };

    // ✅ HANDLE FILES (IMAGES + DOCUMENTS)
    if (req.files?.profileImage?.[0]) {
        let p = req.files.profileImage[0].path.replace(/\\/g, "/");
        req.ngoProfileData.profilePicture = p.split("public/")[1];
    }

    if (req.files?.bannerImage?.[0]) {
        let p = req.files.bannerImage[0].path.replace(/\\/g, "/");
        req.ngoProfileData.bannerPicture = p.split("public/")[1];
    }

    if (req.files?.documents?.length) {
        req.ngoProfileData.documents = req.files.documents.map(file => {
            let p = file.path.replace(/\\/g, "/");
            return p.split("public/")[1];
        });
    }

    // ✅ BUILD USER DATA
    req.userData = {
        email: user.email,
        contact: user.contact
    };

    console.log("✅ Constructed NGO Profile Data:", req.ngoProfileData);
    console.log("✅ Constructed User Data:", req.userData);

    next();
};


module.exports.validateProfileData = catchAsync(async (req, res, next) => {
    try {
        let { ngoProfileData, userData } = req;

        if (!ngoProfileData || !userData) {
            return res.status(400).send({
                success: false,
                message: "NGO profile data or user data is missing."
            });
        }

        console.log("Validating NGO profile data:", { ngoProfileData, userData });

        // LOAD EXISTING PROFILE FROM DB
        const existingProfile = await NGOProfile.findOne({ userId: req.user._id });

        if (!existingProfile) {
            return res.status(404).send({
                success: false,
                message: "NGO profile not found."
            });
        }

        // CRITICAL FIX: IF NO NEW DOCUMENTS, KEEP OLD ONES
        if (!ngoProfileData.documents || ngoProfileData.documents.length === 0) {
            ngoProfileData.documents = existingProfile.documents;
        }

        // ALSO MERGE BANK DETAILS SAFELY
        ngoProfileData.bankDetails = {
            ...existingProfile.bankDetails,
            ...ngoProfileData.bankDetails
        };

        // NOW VALIDATE FINAL MERGED DATA
        await ngoProfileSchema.validateAsync(
            { ngoProfile: ngoProfileData },
            { abortEarly: false }
        );

        // EMAIL VALIDATION
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // CONTACT VALIDATION
        const isValidContact = (contact) => /^[0-9]{10}$/.test(contact);

        if (!isValidEmail(userData.email)) {
            return res.status(400).send({
                success: false,
                message: "Invalid email format."
            });
        }

        if (!isValidContact(userData.contact)) {
            return res.status(400).send({
                success: false,
                message: "Contact number must be exactly 10 digits."
            });
        }

        console.log("NGO profile data is valid.");

        req.validatedNGOProfile = ngoProfileData;
        req.validatedUser = userData;

        next();

    } catch (error) {
        console.log("Error validating NGO profile data:", error.message);

        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
});
