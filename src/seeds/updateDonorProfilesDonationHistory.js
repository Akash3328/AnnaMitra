const mongoose = require("mongoose");
const User = require("../models/user.model"); // adjust path to your User model
const DonorProfile = require("../models/donorprofile.model");
const Donation = require("../models/donation.model");

const updateDonationHistory = async () => {
  try {
    await mongoose.connect("mongodb+srv://hardip:diphar81@mycluster.eom93jc.mongodb.net/annamitra?retryWrites=true&w=majority&appName=MyCluster", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // 1. Fetch all donor users
    const donors = await User.find({ role: "Donor" });
    console.log(`Found ${donors.length} donors.`);

    for (const donor of donors) {
      // 2. Find all donations by this donor
      const donations = await Donation.find({ donorId: donor._id }).select("_id");

      // 3. Extract donation IDs
      const donationIds = donations.map(d => d._id);

      // 4. Update DonorProfile donationHistory
      const updatedProfile = await DonorProfile.findOneAndUpdate(
        { userId: donor._id },
        { donationHistory: donationIds },
        { new: true }
      );

      console.log(`✅ Updated donor profile for ${donor.email}, donations: ${donationIds.length}`);
    }

    console.log("🎉 All donor profiles updated successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error updating donor profiles:", err);
  }
};

updateDonationHistory();
