// validateDonations.js
const mongoose = require("mongoose");
const Joi = require("joi");

// ✅ Import your Mongoose Donation model
const Donation = require("../models/donation.model"); // adjust path if needed

// ✅ Import your Joi donation schema
const { donationSchema } = require("../utils/joiSchemas"); // adjust path if needed

// ✅ Connect to MongoDB
const MONGO_URI = "mongodb+srv://hardip:diphar81@mycluster.eom93jc.mongodb.net/annamitra?retryWrites=true&w=majority&appName=MyCluster"; // update with your DB name if different

async function validateAllDonations() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch all donations
    const donations = await Donation.find({});
    console.log(`🔍 Found ${donations.length} donations to validate\n`);

    for (const donation of donations) {
      try {
        // Validate using Joi
        const { error } = donationSchema.validate(
          { donation: donation.toObject() },
          { abortEarly: false }
        );

        if (error) {
          console.log(
            `❌ Donation ID: ${donation._id} failed validation:\n   - ${error.details
              .map((d) => d.message)
              .join("\n   - ")}\n`
          );
        } else {
          console.log(`✅ Donation ID: ${donation._id} passed validation.`);
        }
      } catch (err) {
        console.log(`⚠️ Error validating donation ${donation._id}:`, err.message);
      }
    }

    console.log("\n✨ Validation completed!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

validateAllDonations();
