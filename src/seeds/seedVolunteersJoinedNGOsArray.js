
const mongoose = require("mongoose");
const User = require("../models/user.model");
const NGOProfile = require("../models/ngoprofile.model");
const VolunteerProfile = require("../models/volunteerprofile.model");

(async () => {
  try {
    await mongoose.connect("mongodb+srv://hardip:diphar81@mycluster.eom93jc.mongodb.net/annamitra?retryWrites=true&w=majority&appName=MyCluster", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Step 1: Find all volunteer users created on or after 2025-10-11
    const volunteers = await User.find({
      role: "Volunteer",
      createdAt: { $gte: new Date("2025-10-11") },
    });

    console.log(`Found ${volunteers.length} volunteer users.`);

    for (const volunteer of volunteers) {
      // Step 2: Find all NGOs where this volunteer is in ngoProfile.volunteers
      const ngos = await NGOProfile.find({
        volunteers: volunteer._id,
      }).select("_id");

      const ngoIds = ngos.map((ngo) => ngo._id);

      // Step 3: Update volunteer's joinedNGOs field
      await VolunteerProfile.updateOne(
        { userId: volunteer._id },
        { $set: { joinedNGOs: ngoIds } }
      );

      console.log(
        `✅ Updated volunteer ${volunteer.email} with ${ngoIds.length} joined NGOs`
      );
    }

    console.log("🎯 All volunteer joinedNGOs synchronized successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error syncing joinedNGOs:", err);
  }
})();
