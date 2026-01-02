const axios = require("axios");
const User = require("../models/user.model");

const BASE_URL = "http://localhost:3000/auth/register"; // your backend POST route

// Array of 10 donors
const donors = [
  { firstName: "Sneha", lastName: "Kapoor", city: "Ahmedabad", state: "Gujarat", pincode: "380015", donorSourceName: "Restaurant" },
  { firstName: "Arjun", lastName: "Sharma", city: "Surat", state: "Gujarat", pincode: "395005", donorSourceName: "Hostel" },
  { firstName: "Tanvi", lastName: "Deshmukh", city: "Vadodara", state: "Gujarat", pincode: "390020", donorSourceName: "Event" },
  { firstName: "Vihaan", lastName: "Gupta", city: "Rajkot", state: "Gujarat", pincode: "360002", donorSourceName: "Restaurant" },
  { firstName: "Meera", lastName: "Joshi", city: "Bhavnagar", state: "Gujarat", pincode: "364005", donorSourceName: "Hostel" },
  { firstName: "Ayaan", lastName: "Rathi", city: "Gandhinagar", state: "Gujarat", pincode: "382011", donorSourceName: "Event" },
  { firstName: "Ira", lastName: "Patel", city: "Junagadh", state: "Gujarat", pincode: "362002", donorSourceName: "Restaurant" },
  { firstName: "Devansh", lastName: "Bansal", city: "Navsari", state: "Gujarat", pincode: "396450", donorSourceName: "Hostel" },
  { firstName: "Kiara", lastName: "Bhatt", city: "Anand", state: "Gujarat", pincode: "388005", donorSourceName: "Event" },
  { firstName: "Ritvik", lastName: "Mehta", city: "Valsad", state: "Gujarat", pincode: "396005", donorSourceName: "Restaurant" },
];


(async () => {
  for (const d of donors) {
    const email = `${d.firstName.toLowerCase()}.${d.lastName.toLowerCase()}@example.com`;
    const password = `${d.firstName}@1234`;
    const contact = "9876543210";

    const data = {
      user: {
        email,
        contact,
        role: "Donor",
        password,
      },
      donorProfile: {
        firstName: d.firstName,
        lastName: d.lastName,
        donorSourceName: d.donorSourceName,
        address: `${d.city} Main Road`,
        city: d.city,
        state: d.state,
        pincode: d.pincode,
        about: `Hello, I'm ${d.firstName} ${d.lastName}, a donor from ${d.city}.`,
        languagePreference: "en",
      },
    };

    try {
    //   await User.deleteOne({ email: data.user.email }); // Remove if user already exists
      const res = await axios.post(BASE_URL, data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(`✅ Registered Donor: ${d.firstName} ${d.lastName}`);
    } catch (err) {
      console.error(`❌ Failed: ${d.firstName} ${d.lastName}`, err.response?.data || err.message);
    }
  }
})();
