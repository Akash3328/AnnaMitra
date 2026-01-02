const axios = require("axios");

const BASE_URL = "http://localhost:3000/auth/register";

// Volunteer IDs from your database
const volunteerIds = [
  "68ea72bcdedeb9632a632a44","68ea72bcdedeb9632a632a3f","68ea72bbdedeb9632a632a3a",
  "68ea72bbdedeb9632a632a35","68ea72bbdedeb9632a632a30","68ea72badedeb9632a632a2b",
  "68ea72badedeb9632a632a26","68ea72badedeb9632a632a21","68ea72b9dedeb9632a632a1c",
  "68ea72b9dedeb9632a632a17","68ea72b9dedeb9632a632a12","68ea72b8dedeb9632a632a0d",
  "68ea72b8dedeb9632a632a08","68ea72b8dedeb9632a632a03","68ea72b7dedeb9632a6329fe",
  "68ea72b7dedeb9632a6329f9","68ea72b6dedeb9632a6329f4","68ea72b6dedeb9632a6329ef",
  "68ea72b6dedeb9632a6329ea","68ea72b5dedeb9632a6329e5","68ea72b5dedeb9632a6329e0",
  "68ea72b5dedeb9632a6329db","68ea72b4dedeb9632a6329d6","68ea72b3dedeb9632a6329cf"
];

// Function to get random volunteers (4–8)
function getRandomVolunteers() {
  const shuffled = [...volunteerIds].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 5) + 4;
  return shuffled.slice(0, count);
}

// Function to generate random bank details
function generateBankDetails() {
  const randomAcc = Math.floor(100000000000 + Math.random() * 900000000000).toString();
  const randomIFSC = "SBIN0" + Math.floor(10000 + Math.random() * 90000);
  const randomUPI = `ngo${Math.floor(Math.random() * 1000)}@upi`;
  const isVisible = Math.random() > 0.5;
  return { accountNumber: randomAcc, ifscCode: randomIFSC, upiId: randomUPI, isVisible };
}

// Function to generate random document URLs
function generateDocuments(orgName) {
  const base = orgName.toLowerCase().replace(/\s+/g, "_");
  return [
    `https://docs.example.com/${base}_registration.pdf`,
    `https://docs.example.com/${base}_license.pdf`
  ];
}

// Array of 10 NGO users
const ngos = [
  { orgName: "Helping Hands", regNo: "NGO001", registeredUnder: "Society Act", city: "Ahmedabad", state: "Gujarat", pincode: "380015" },
  { orgName: "Food for All", regNo: "NGO002", registeredUnder: "Trust Act", city: "Surat", state: "Gujarat", pincode: "395005" },
  { orgName: "Care & Share", regNo: "NGO003", registeredUnder: "Society Act", city: "Vadodara", state: "Gujarat", pincode: "390020" },
  { orgName: "Feed the Needy", regNo: "NGO004", registeredUnder: "Trust Act", city: "Rajkot", state: "Gujarat", pincode: "360002" },
  { orgName: "Hope Foundation", regNo: "NGO005", registeredUnder: "Society Act", city: "Bhavnagar", state: "Gujarat", pincode: "364005" },
  { orgName: "Smile India", regNo: "NGO006", registeredUnder: "Trust Act", city: "Gandhinagar", state: "Gujarat", pincode: "382011" },
  { orgName: "Bright Future", regNo: "NGO007", registeredUnder: "Society Act", city: "Junagadh", state: "Gujarat", pincode: "362002" },
  { orgName: "Food Relief", regNo: "NGO008", registeredUnder: "Trust Act", city: "Navsari", state: "Gujarat", pincode: "396450" },
  { orgName: "Care & Comfort", regNo: "NGO009", registeredUnder: "Society Act", city: "Anand", state: "Gujarat", pincode: "388005" },
  { orgName: "Serve Humanity", regNo: "NGO010", registeredUnder: "Trust Act", city: "Valsad", state: "Gujarat", pincode: "396005" },
];

(async () => {
  for (const ngo of ngos) {
    const email = `${ngo.orgName.toLowerCase().replace(/\s+/g, '')}@example.com`;
    const password = `${ngo.orgName.split(' ')[0]}@1234`;
    const contact = "9876543210";

    const data = {
      user: {
        email,
        contact,
        role: "NGO",
        password,
      },
      ngoProfile: {
        organizationName: ngo.orgName,
        registrationNumber: ngo.regNo,
        registeredUnder: ngo.registeredUnder,
        address: `${ngo.city} Main Street`,
        city: ngo.city,
        state: ngo.state,
        pincode: ngo.pincode,
        about: `We are ${ngo.orgName}, working for the betterment of the community in ${ngo.city}.`,
        missionStatement: "To serve the needy and reduce hunger.",
        visionStatement: "A world without hunger.",
        areasOfOperation: ["Food Distribution", "Healthcare", "Education"],
        volunteers: getRandomVolunteers(),
        documents: generateDocuments(ngo.orgName),
        bankDetails: generateBankDetails(),
        languagePreference: "en",
      },
    };

    try {
      await axios.post(BASE_URL, data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(`✅ Registered NGO: ${ngo.orgName}`);
    } catch (err) {
      console.error(`❌ Failed: ${ngo.orgName}`, err.response?.data || err.message);
    }
  }
})();
