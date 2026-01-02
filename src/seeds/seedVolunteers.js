const axios = require("axios");


const BASE_URL = "http://localhost:3000/auth/register";
const volunteers = [
    { firstName: "Aarav", lastName: "Shah", city: "Ahmedabad", state: "Gujarat", pincode: "380001" },
    { firstName: "Isha", lastName: "Patel", city: "Surat", state: "Gujarat", pincode: "395003" },
    { firstName: "Rohan", lastName: "Mehta", city: "Vadodara", state: "Gujarat", pincode: "390007" },
    { firstName: "Kavya", lastName: "Joshi", city: "Rajkot", state: "Gujarat", pincode: "360001" },
    { firstName: "Dev", lastName: "Desai", city: "Bhavnagar", state: "Gujarat", pincode: "364001" },
    { firstName: "Ananya", lastName: "Trivedi", city: "Gandhinagar", state: "Gujarat", pincode: "382010" },
    { firstName: "Krish", lastName: "Rathod", city: "Junagadh", state: "Gujarat", pincode: "362001" },
    { firstName: "Mihir", lastName: "Vyas", city: "Navsari", state: "Gujarat", pincode: "396445" },
    { firstName: "Riya", lastName: "Bhatt", city: "Anand", state: "Gujarat", pincode: "388001" },
    { firstName: "Dhruv", lastName: "Parikh", city: "Valsad", state: "Gujarat", pincode: "396001" },
    { firstName: "Neha", lastName: "Pandya", city: "Mehsana", state: "Gujarat", pincode: "384002" },
    { firstName: "Tanish", lastName: "Chaudhary", city: "Nadiad", state: "Gujarat", pincode: "387001" },
    { firstName: "Simran", lastName: "Kapadia", city: "Bhuj", state: "Gujarat", pincode: "370001" },
    { firstName: "Yash", lastName: "Modi", city: "Amreli", state: "Gujarat", pincode: "365601" },
    { firstName: "Meera", lastName: "Gandhi", city: "Patan", state: "Gujarat", pincode: "384265" },
    { firstName: "Arjun", lastName: "Acharya", city: "Vapi", state: "Gujarat", pincode: "396191" },
    { firstName: "Nisha", lastName: "Dave", city: "Jamnagar", state: "Gujarat", pincode: "361001" },
    { firstName: "Smit", lastName: "Bhagat", city: "Bharuch", state: "Gujarat", pincode: "392001" },
    { firstName: "Chirag", lastName: "Gohil", city: "Porbandar", state: "Gujarat", pincode: "360575" },
    { firstName: "Priya", lastName: "Rawal", city: "Palitana", state: "Gujarat", pincode: "364270" },
    { firstName: "Jay", lastName: "Zaveri", city: "Godhra", state: "Gujarat", pincode: "389001" },
    { firstName: "Tanvi", lastName: "Naik", city: "Veraval", state: "Gujarat", pincode: "362265" },
    { firstName: "Hardik", lastName: "Purohit", city: "Surendranagar", state: "Gujarat", pincode: "363001" },
    { firstName: "Rachit", lastName: "Soni", city: "Morbi", state: "Gujarat", pincode: "363641" },
    { firstName: "Mitali", lastName: "Bhakta", city: "Dahod", state: "Gujarat", pincode: "389151" },
];

const seedVolunteers = async () => {
    for (const v of volunteers) {
        const email = `${v.firstName.toLowerCase()}.${v.lastName.toLowerCase()}@example.com`;
        const password = `${v.firstName}@1234`;
        const contact = "9876543210";

        const data = {
            user: {
                email,
                contact,
                role: "Volunteer",
                password,
            },
            volunteerProfile: {
                firstName: v.firstName,
                lastName: v.lastName,
                address: `${v.city} Main Road`,
                city: v.city,
                state: v.state,
                pincode: v.pincode,
                about: `Hello, I'm ${v.firstName} ${v.lastName}, a volunteer from ${v.city}.`,
                isAvailable: true,
                languagePreference: "en",
            },
        };

        try {
            const res = await axios.post(BASE_URL, data, {
                headers: { "Content-Type": "application/json" },
            });
            console.log(`✅ Registered: ${v.firstName} ${v.lastName} - ${res.data.message}`);
        } catch (err) {
            console.error(`❌ Failed: ${v.firstName} ${v.lastName}`, err.response?.data || err.message);
        }
    }
};

seedVolunteers();