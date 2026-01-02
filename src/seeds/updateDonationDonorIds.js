const mongoose = require("mongoose");
const Donation = require("../models/donation.model"); // adjust path to your Donation model

const donorIds = [
  new mongoose.Types.ObjectId("68ea78e38323dd70cbea6b25"),
  new mongoose.Types.ObjectId("68ea78e38323dd70cbea6b20"),
  new mongoose.Types.ObjectId("68ea78e38323dd70cbea6b1b"),
  new mongoose.Types.ObjectId("68ea78e28323dd70cbea6b16"),
  new mongoose.Types.ObjectId("68ea78e28323dd70cbea6b11"),
  new mongoose.Types.ObjectId("68ea78e28323dd70cbea6b0c"),
  new mongoose.Types.ObjectId("68ea78e18323dd70cbea6b05"),
  new mongoose.Types.ObjectId("68ea78e18323dd70cbea6b00"),
  new mongoose.Types.ObjectId("68ea78e18323dd70cbea6afb"),
  new mongoose.Types.ObjectId("68e94dcf4899fb07278f840b"),
];

const updateDonations = async () => {
  try {
    await mongoose.connect("mongodb+srv://hardip:diphar81@mycluster.eom93jc.mongodb.net/annamitra?retryWrites=true&w=majority&appName=MyCluster"); // change DB name

    const donations = await Donation.find();
    console.log(`Found ${donations.length} donations.`);

    for (const donation of donations) {
      const randomDonorId = donorIds[Math.floor(Math.random() * donorIds.length)];
      donation.donorId = randomDonorId;
      await donation.save();
    }

    console.log("✅ Successfully updated donorId for all donations!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error updating donations:", err);
  }
};

updateDonations();
