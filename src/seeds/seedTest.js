const DonationRequest = require('../models/donationrequest.model');
const User = require('../models/user.model');
const NGOProfile = require("../models/ngoprofile.model");
const VolunteerProfile = require("../models/volunteerprofile.model");
const mongoose = require('mongoose');


// async function countInvalidDonationRequests() {
//     try {
//         const conn = await mongoose.connect('mongodb+srv://hardip:diphar81@mycluster.eom93jc.mongodb.net/annamitra?retryWrites=true&w=majority&appName=MyCluster');
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`Mongo connection error: ${error.message}`);
//         process.exit(1); // Exit with a failure code
//     }
//   try {
//     // 1. Total donation requests
//     const totalRequests = await DonationRequest.countDocuments();

//     // 2. Get all donation requests (only ngoId needed)
//     const requests = await DonationRequest.find({}, { ngoId: 1 }).lean();

//     let invalidCount = 0;

//     // 3. Check each ngoId against User collection
//     for (const req of requests) {
//       const userExists = await User.exists({ _id: req.ngoId });
//       if (!userExists) {
//         invalidCount++;
//       }
//     }

//     console.log("✅ Total Donation Requests:", totalRequests);
//     console.log("❌ Donation Requests with INVALID NGO IDs:", invalidCount);

//   } catch (error) {
//     console.error("Error counting invalid donation requests:", error);
//   }
// }

// countInvalidDonationRequests();


// async function syncNgoVolunteers() {
//     try {
//         const conn = await mongoose.connect('mongodb+srv://hardip:diphar81@mycluster.eom93jc.mongodb.net/annamitra?retryWrites=true&w=majority&appName=MyCluster');
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`Mongo connection error: ${error.message}`);
//         process.exit(1); // Exit with a failure code
//     }
//   try {
//     const ngoProfiles = await NGOProfile.find({}).lean();

//     let totalChecked = 0;
//     let totalUpdated = 0;
//     let skippedVolunteers = 0;

//     for (const ngo of ngoProfiles) {
//       const ngoUserId = ngo.userId; // ✅ This is what must be added to joinedNGOs

//       for (const volunteerUserId of ngo.volunteers) {
//         totalChecked++;

//         const volunteerProfile = await VolunteerProfile.findOne({
//           userId: volunteerUserId
//         });

//         // ✅ Skip if volunteer profile does not exist
//         if (!volunteerProfile) {
//           skippedVolunteers++;
//           continue;
//         }

//         // ✅ If NGO is missing in joinedNGOs → push it
//         const alreadyExists = volunteerProfile.joinedNGOs.some(
//           existingNgoId => existingNgoId.toString() === ngoUserId.toString()
//         );

//         if (!alreadyExists) {
//           volunteerProfile.joinedNGOs.push(ngoUserId);
//           await volunteerProfile.save();
//           totalUpdated++;
//         }
//       }
//     }

//     console.log("✅ Sync Completed Successfully");
//     console.log("🔍 Total Volunteer References Checked:", totalChecked);
//     console.log("🛠️ Volunteer Profiles Updated:", totalUpdated);
//     console.log("⚠️ Missing Volunteer Profiles Skipped:", skippedVolunteers);

//     process.exit(0);

//   } catch (err) {
//     console.error("❌ Sync Failed:", err);
//     process.exit(1);
//   }
// }

// syncNgoVolunteers();


// make all volunteers available

async function makeAllVolunteersAvailable() {
  try {
        const conn = await mongoose.connect('mongodb+srv://hardip:diphar81@mycluster.eom93jc.mongodb.net/annamitra?retryWrites=true&w=majority&appName=MyCluster');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Mongo connection error: ${error.message}`);
        process.exit(1); // Exit with a failure code
    }
    try {
    const result = await VolunteerProfile.updateMany(
      { isAvailable: { $ne: true } }, // Only update if isAvailable is not true
      { $set: { isAvailable: true } }
    );

  } catch (err) {
    console.error("❌ Sync Failed:", err);
    process.exit(1);
  }
}

makeAllVolunteersAvailable();