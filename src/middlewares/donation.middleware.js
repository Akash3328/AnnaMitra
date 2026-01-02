const { constructDonationData } = require('../helpers/donation.helpers');
const joiSchemas = require('../utils/joiSchemas');
const userController = require('../controllers/user.controller');

module.exports.validateDonationData = async (req, res, next) => {
    console.log("Validating donation data...");
    try {
        const donorId = req.user._id;
        let donation, oldImages = [];
        if(req.method === 'PUT' && req.params.id) {
            const result = constructDonationData(req.body, req.files, donorId, res, req.params.id);
            donation = result.donationData;
            oldImages = result.oldImages;
        }
        else {
            donation = constructDonationData(req.body, req.files, donorId, res);
        }
        
        console.log('Donation data to validate:', donation);
        await joiSchemas.donationSchema.validateAsync({donation}, { abortEarly: false });
        console.log("Donation data is valid.");
        req.donation = donation; // Attach validated donation data to request object
        if(req.method === 'PUT' && req.params.id) {
            req.oldImages = oldImages; // Attach old images to delete to request object
        }
    }
    catch (error) {
        console.log("Error validating donation data:", error);
        return res.status(400).send({ success: false, message: error.message });
    }

    next();
}