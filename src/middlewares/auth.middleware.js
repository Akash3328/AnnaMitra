const e = require('express');
const joiSchemas = require('../utils/joiSchemas');

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

// Middleware to check if user is logged out
module.exports.isLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect(req.get('Referer') || '/');
}

// Middleware to check if user is an admin
module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.redirect('/');
    }
    next();
}

// Middleware to check if user is a super admin
module.exports.isSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Super Admin') {
        return res.redirect('/');
    }
    next();
}

// Middleware to check if user is a donor
module.exports.isDonor = (req, res, next) => {
    if (!req.user || req.user.role !== 'Donor') {
        return res.redirect('/');
    }
    next();
}

// Middleware to check if user is an NGO
module.exports.isNGO = (req, res, next) => {
    if (!req.user || req.user.role !== 'NGO') {
        return res.redirect('/');
    }
    next();
}

// Middleware to check if user is a volunteer
module.exports.isVolunteer = (req, res, next) => {
    if (!req.user || req.user.role !== 'Volunteer') {
        return res.redirect('/');
    }
    next();
}

// Middleware to check if user is not Admin or Super Admin
module.exports.isNotAdminOrSuperAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Super Admin')) {
        return res.redirect('/');
    }
    next();
}

// Middleware to validate registration data
module.exports.validateRegistrationData = async (req, res, next) => {
    try {
        console.log('Request Body at Middleware Start:', req.body);
        if (!req.body || !req.body.user) {
            return res.status(400).send({ success: false, message: 'Invalid request data' });
        }
        // validateAsync returns the validated value
        const value = await joiSchemas.userSchema.validateAsync(req.body);
        const { user } = value; // safe to destructure now
        if (user.role === 'NGO') {
            if (!req.body.ngoProfile) {
                return res.status(400).send({ success: false, message: 'NGO profile data is required' });
            }

            // Handle file uploads / get document file paths
            const ngoDocuments = [];
            if (!req.files || req.files.length === 0) {
                return res.status(400).send({ success: false, message: 'NGO documents are required' });
            }
            req.files.forEach(file => {
                const { fieldname, path } = file;

                // Store ngo documents
                if (fieldname.startsWith('ngoProfile')) {
                    ngoDocuments.push('/' + path.replace(/\\/g, '/').split('public/')[1]);
                }
            });
            req.body.ngoProfile.documents = ngoDocuments;
            
            console.log('Validating NGO Profile Schema');
            await joiSchemas.ngoProfileSchema.validateAsync(req.body);
        } else if (user.role === 'Volunteer') {
            if (!req.body.volunteerProfile) {
                return res.status(400).send({ success: false, message: 'Volunteer profile data is required' });
            }
            console.log('Validating Volunteer Profile Schema');
            await joiSchemas.volunteerProfileSchema.validateAsync(req.body);
        } else if (user.role === 'Donor') {
            if (!req.body.donorProfile) {
                return res.status(400).send({ success: false, message: 'Donor profile data is required' });
            }
            console.log('Validating Donor Profile Schema');
            await joiSchemas.donorProfileSchema.validateAsync(req.body);
        }

        next();
    } catch (error) {
        console.log(error);
        const msg = error.details
            ? error.details.map(el => el.message).join(',')
            : error.message;
        res.status(400).send({ success: false, message: msg });
    }
};


