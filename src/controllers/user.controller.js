
const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.findOneUserId = async (role) => {
    let u_id = null;

    try {
        const user = await User.findOne({ role: role }, { _id:1 });
        if(user) {
            u_id = user._id;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }

    return u_id;
}
