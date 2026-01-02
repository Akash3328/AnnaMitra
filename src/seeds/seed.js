const axios = require("axios");


testSeed = async (req, res) => {
  // try {
  //     const user = await User.findOne({ email: '202412021@daiict.ac.in' });
  //     if (user) {
  //         const pass = "MyPass@123";
  //         const salt = await bcrypt.genSalt(10);
  //         const passwordHash = await bcrypt.hash(pass, salt);

  //         user.passwordHash = passwordHash;
  //         await user.save();
  //         res.json({ message: 'Password updated successfully', user });
  //     }
  //     else {
  //         res.status(404).json({ error: 'User not found' });
  //     }
  // } catch (error) {
  //     console.error('Error in testRoute:', error.message);
  //     res.status(500).json({ error: 'Internal server error' });
  // }

  // const pass = "MyPass@123";
  // try {
  //     const users = await User.findOne({ email: '202412021@daiict.ac.in' }, {_id:0, passwordHash:1});
  //     if (users && users.passwordHash) {
  //         console.log('User found:', users);
  //         const isMatch = await bcrypt.compare(pass, users.passwordHash);
  //         res.json({ passwordMatch: isMatch });
  //     } else {
  //         res.json({ error: 'User not found or password hash missing' });
  //     }
  // }
  // catch(err) {
  //     console.log(err.message);
  // }

  // try {
  //     // Sample realistic NGO users
  //     const sampleUsers = [
  //         { firstName: 'Helping', lastName: 'Hands', email: 'contact@helpinghands.org', contact: '9811112233', address: '12 MG Road, Bengaluru, Karnataka', password: 'Help@1234' },
  //         { firstName: 'Food', lastName: 'ForAll', email: 'info@foodforall.org', contact: '9822223344', address: '88 Park Street, Kolkata, West Bengal', password: 'Food#2025' },
  //         { firstName: 'Care', lastName: 'Trust', email: 'support@caretrust.org', contact: '9833334455', address: '56 Anna Salai, Chennai, Tamil Nadu', password: 'Care@999' },
  //         { firstName: 'Green', lastName: 'Hope', email: 'hello@greenhope.org', contact: '9844445566', address: '22 Ashram Road, Ahmedabad, Gujarat', password: 'GreenHope1!' },
  //         { firstName: 'Smile', lastName: 'Foundation', email: 'contact@smilefoundation.org', contact: '9855556677', address: '15 Connaught Place, New Delhi', password: 'Smile#Help' },
  //         { firstName: 'Bright', lastName: 'Future', email: 'team@brightfuture.org', contact: '9866667788', address: '34 Jubilee Hills, Hyderabad, Telangana', password: 'Bright@2025' },
  //         { firstName: 'Seva', lastName: 'Trust', email: 'info@sevatrust.org', contact: '9877778899', address: '78 MG Marg, Thiruvananthapuram, Kerala', password: 'Seva$Life' },
  //         { firstName: 'Hope', lastName: 'Charity', email: 'contact@hopecharity.org', contact: '9888889900', address: '90 Civil Lines, Jaipur, Rajasthan', password: 'Hope_Charity' },
  //         { firstName: 'Food', lastName: 'Relief', email: 'relief@foodrelief.org', contact: '9899990011', address: '5 Salt Lake, Kolkata, West Bengal', password: 'FoodRelief@1' },
  //         { firstName: 'Serve', lastName: 'Nation', email: 'team@servenation.org', contact: '9800001122', address: '11 Park Street, Pune, Maharashtra', password: 'Serve!2023' },
  //         { firstName: 'Helping', lastName: 'Hearts', email: 'help@helpinghearts.org', contact: '9810101234', address: '50 MG Road, Indore, Madhya Pradesh', password: 'Hearts@456' },
  //         { firstName: 'Food', lastName: 'Smile', email: 'info@foodsmile.org', contact: '9820202345', address: '99 Nehru Place, New Delhi', password: 'FoodSmile#1' },
  //         { firstName: 'Life', lastName: 'Saver', email: 'lifesaver@ngo.org', contact: '9830303456', address: '24 Baner Road, Pune, Maharashtra', password: 'LifeSaver_22' },
  //         { firstName: 'Annapurna', lastName: 'Trust', email: 'info@annapurnatrust.org', contact: '9840404567', address: '16 Residency Road, Mumbai, Maharashtra', password: 'Anna@Trust1' },
  //         { firstName: 'Hunger', lastName: 'Free', email: 'team@hungerfree.org', contact: '9850505678', address: '7 Sector 17, Chandigarh', password: 'HungerFree@2' }
  //     ];

  //     // Hash passwords & add NGO role
  //     const usersWithHash = await Promise.all(
  //         sampleUsers.map(async user => ({
  //             ...user,
  //             role: 'NGO',
  //             passwordHash: await bcrypt.hash(user.password, 10),
  //             password: undefined
  //         }))
  //     );

  //     // Insert into DB
  //     const u = await User.insertMany(usersWithHash);
  //     console.log(u);

  //     console.log('15 NGO users inserted successfully');
  //     res.send('15 NGO users inserted successfully');
  // } catch (error) {
  //     console.error('Error inserting NGO users:', error);
  //     res.status(500).send('Failed to insert NGO users');
  // }

  // try {
  //   const salt = await bcrypt.genSalt(10);

  //   const volunteersData = [
  //     {
  //       firstName: "Amit",
  //       lastName: "Sharma",
  //       email: "amit.sharma01@example.com",
  //       contact: "9876543210",
  //       role: "Volunteer",
  //       address: "201 Green Residency, Pune, Maharashtra",
  //       password: "Amit@1234"
  //     },
  //     {
  //       firstName: "Sneha",
  //       lastName: "Patil",
  //       email: "sneha.patil02@example.com",
  //       contact: "9123456780",
  //       role: "Volunteer",
  //       address: "12 Orchid Apartments, Andheri East, Mumbai",
  //       password: "Sneha#456"
  //     },
  //     {
  //       firstName: "Rohit",
  //       lastName: "Verma",
  //       email: "rohit.verma03@example.com",
  //       contact: "9988776655",
  //       role: "Volunteer",
  //       address: "4 Sunrise Tower, Salt Lake, Kolkata",
  //       password: "Rohit$2024"
  //     },
  //     {
  //       firstName: "Priya",
  //       lastName: "Nair",
  //       email: "priya.nair04@example.com",
  //       contact: "9765432109",
  //       role: "Volunteer",
  //       address: "56 Lake View Villa, Kochi, Kerala",
  //       password: "Priya*890"
  //     },
  //     {
  //       firstName: "Karan",
  //       lastName: "Gupta",
  //       email: "karan.gupta05@example.com",
  //       contact: "9345678901",
  //       role: "Volunteer",
  //       address: "10 Park Avenue, Civil Lines, Delhi",
  //       password: "Karan@990"
  //     },
  //     {
  //       firstName: "Neha",
  //       lastName: "Reddy",
  //       email: "neha.reddy06@example.com",
  //       contact: "9234567810",
  //       role: "Volunteer",
  //       address: "88 Rosewood Heights, Hyderabad",
  //       password: "Neha#7722"
  //     },
  //     {
  //       firstName: "Vikram",
  //       lastName: "Mehta",
  //       email: "vikram.mehta07@example.com",
  //       contact: "9012345678",
  //       role: "Volunteer",
  //       address: "11 Galaxy Towers, Navrangpura, Ahmedabad",
  //       password: "Vikram!2025"
  //     },
  //     {
  //       firstName: "Ayesha",
  //       lastName: "Khan",
  //       email: "ayesha.khan08@example.com",
  //       contact: "9098765432",
  //       role: "Volunteer",
  //       address: "Sunflower Enclave, Bandra West, Mumbai",
  //       password: "Ayesha@55"
  //     },
  //     {
  //       firstName: "Manish",
  //       lastName: "Joshi",
  //       email: "manish.joshi09@example.com",
  //       contact: "9345098765",
  //       role: "Volunteer",
  //       address: "Hilltop Residency, Jaipur, Rajasthan",
  //       password: "Manish#778"
  //     },
  //     {
  //       firstName: "Divya",
  //       lastName: "Iyer",
  //       email: "divya.iyer10@example.com",
  //       contact: "9445567890",
  //       role: "Volunteer",
  //       address: "Skyline Apartments, Thiruvananthapuram, Kerala",
  //       password: "Divya*1010"
  //     },
  //     {
  //       firstName: "Rakesh",
  //       lastName: "Mishra",
  //       email: "rakesh.mishra11@example.com",
  //       contact: "9654321780",
  //       role: "Volunteer",
  //       address: "Garden Homes, Lucknow, Uttar Pradesh",
  //       password: "Rakesh@889"
  //     },
  //     {
  //       firstName: "Anjali",
  //       lastName: "Desai",
  //       email: "anjali.desai12@example.com",
  //       contact: "9753186420",
  //       role: "Volunteer",
  //       address: "Spring Field, Baroda, Gujarat",
  //       password: "Anjali#982"
  //     },
  //     {
  //       firstName: "Siddharth",
  //       lastName: "Kapoor",
  //       email: "siddharth.kapoor13@example.com",
  //       contact: "9812345609",
  //       role: "Volunteer",
  //       address: "Lotus Residency, Bhopal, Madhya Pradesh",
  //       password: "Sid@321"
  //     },
  //     {
  //       firstName: "Meena",
  //       lastName: "Choudhary",
  //       email: "meena.choudhary14@example.com",
  //       contact: "9021345678",
  //       role: "Volunteer",
  //       address: "Blue Hills, Nagpur, Maharashtra",
  //       password: "Meena#143"
  //     },
  //     {
  //       firstName: "Nikhil",
  //       lastName: "Arora",
  //       email: "nikhil.arora15@example.com",
  //       contact: "9305678912",
  //       role: "Volunteer",
  //       address: "Palm Springs, Chandigarh",
  //       password: "Nikhil@909"
  //     },
  //     {
  //       firstName: "Shweta",
  //       lastName: "Singh",
  //       email: "shweta.singh16@example.com",
  //       contact: "9172638490",
  //       role: "Volunteer",
  //       address: "Central Plaza, Indore, Madhya Pradesh",
  //       password: "Shweta#786"
  //     },
  //     {
  //       firstName: "Rajesh",
  //       lastName: "Thakur",
  //       email: "rajesh.thakur17@example.com",
  //       contact: "9645281730",
  //       role: "Volunteer",
  //       address: "City Heights, Dehradun, Uttarakhand",
  //       password: "Rajesh@555"
  //     },
  //     {
  //       firstName: "Pooja",
  //       lastName: "Malhotra",
  //       email: "pooja.malhotra18@example.com",
  //       contact: "9345678120",
  //       role: "Volunteer",
  //       address: "Orchid Homes, Ludhiana, Punjab",
  //       password: "Pooja*777"
  //     },
  //     {
  //       firstName: "Aditya",
  //       lastName: "Rana",
  //       email: "aditya.rana19@example.com",
  //       contact: "9012837465",
  //       role: "Volunteer",
  //       address: "Victory Apartments, Shimla, Himachal Pradesh",
  //       password: "Adi#1998"
  //     },
  //     {
  //       firstName: "Kavita",
  //       lastName: "Bose",
  //       email: "kavita.bose20@example.com",
  //       contact: "9473829102",
  //       role: "Volunteer",
  //       address: "Rose Garden Flats, Siliguri, West Bengal",
  //       password: "Kavita@2025"
  //     },
  //     {
  //       firstName: "Harsh",
  //       lastName: "Reddy",
  //       email: "harsh.reddy21@example.com",
  //       contact: "9012839405",
  //       role: "Volunteer",
  //       address: "Maple Residency, Secunderabad, Telangana",
  //       password: "Harsh#2020"
  //     },
  //     {
  //       firstName: "Sunita",
  //       lastName: "Yadav",
  //       email: "sunita.yadav22@example.com",
  //       contact: "9182736450",
  //       role: "Volunteer",
  //       address: "Royal Green Apartments, Gurgaon, Haryana",
  //       password: "Sunita*123"
  //     },
  //     {
  //       firstName: "Deepak",
  //       lastName: "Saxena",
  //       email: "deepak.saxena23@example.com",
  //       contact: "9364782910",
  //       role: "Volunteer",
  //       address: "Riverfront Towers, Varanasi, UP",
  //       password: "Deepak@888"
  //     },
  //     {
  //       firstName: "Anita",
  //       lastName: "Kulkarni",
  //       email: "anita.kulkarni24@example.com",
  //       contact: "9543218760",
  //       role: "Volunteer",
  //       address: "Green Park Colony, Nashik, Maharashtra",
  //       password: "Anita#909"
  //     },
  //     {
  //       firstName: "Arjun",
  //       lastName: "Menon",
  //       email: "arjun.menon25@example.com",
  //       contact: "9745612390",
  //       role: "Volunteer",
  //       address: "Sunset Apartments, Kochi, Kerala",
  //       password: "Arjun@444"
  //     },
  //     {
  //       firstName: "Preeti",
  //       lastName: "Garg",
  //       email: "preeti.garg26@example.com",
  //       contact: "9654321789",
  //       role: "Volunteer",
  //       address: "Lakeview Residency, Kanpur, UP",
  //       password: "Preeti*222"
  //     },
  //     {
  //       firstName: "Rahul",
  //       lastName: "Bhatia",
  //       email: "rahul.bhatia27@example.com",
  //       contact: "9032156789",
  //       role: "Volunteer",
  //       address: "Greenwoods Residency, Amritsar, Punjab",
  //       password: "Rahul#777"
  //     },
  //     {
  //       firstName: "Sonia",
  //       lastName: "Aggarwal",
  //       email: "sonia.aggarwal28@example.com",
  //       contact: "9234517890",
  //       role: "Volunteer",
  //       address: "Hillcrest Apartments, Noida, UP",
  //       password: "Sonia@1122"
  //     },
  //     {
  //       firstName: "Varun",
  //       lastName: "Chopra",
  //       email: "varun.chopra29@example.com",
  //       contact: "9471826350",
  //       role: "Volunteer",
  //       address: "Elite Residency, Faridabad, Haryana",
  //       password: "Varun#1234"
  //     },
  //     {
  //       firstName: "Ritu",
  //       lastName: "Mohan",
  //       email: "ritu.mohan30@example.com",
  //       contact: "9354782910",
  //       role: "Volunteer",
  //       address: "Dream Homes, Patna, Bihar",
  //       password: "Ritu*555"
  //     },
  //   ];

  //   // Hash passwords
  //   for (let user of volunteersData) {
  //     user.passwordHash = await bcrypt.hash(user.password, salt);
  //     delete user.password;
  //   }

  //   // Insert into DB
  //   const inserted = await User.insertMany(volunteersData);

  //   res.status(201).json({
  //     message: "30 Volunteers inserted successfully!",
  //     users: inserted
  //   });
  // } catch (error) {
  //   console.error("Error inserting volunteers:", error);
  //   res.status(500).json({ message: "Error inserting volunteers", error });
  // }


  try {
    const users = await User.find({ role: 'Volunteer' }, { _id: 1, firstName: 1 });
    res.json(users);
    // console.log(users);

    // const donations = await Donation.find({});
    // res.json(donations);
  }
  catch (error) {
    console.error('Error in testRoute:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// --- Paste the donationsData Array from above here ---
const donationsData = [
  // Donations for Donor 3: Care Trust (689f2efb48fd1c6763401a3f)
  {
    "donorId": "689f2efb48fd1c6763401a3f",
    "title": "South Indian Restaurant's Daily Surplus",
    "source": "Restaurant",
    "items": [
      {
        "name": "Idli",
        "quantity": 200,
        "unit": "Pieces",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "07:00",
        "itemImages": ["https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Sambar",
        "quantity": 15,
        "unit": "Liters",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "07:30",
        "itemImages": ["https://media.istockphoto.com/id/526941758/photo/sambar-south-indian-curry.jpg?s=612x612&w=0&k=20&c=6gL3YtOSu42d5TCu43a57H4s5w57y6V1-t-2-d2TqhA="]
      },
      {
        "name": "Coconut Chutney",
        "quantity": 5,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "06:30",
        "itemImages": ["https://media.istockphoto.com/id/1157588863/photo/coconut-chutney-in-a-bowl.jpg?s=612x612&w=0&k=20&c=L_dO-Hj_rqy_ubDQSb9y5mBynJv5E74JgJ2Qhqb30i4="]
      },
      {
        "name": "Medu Vada",
        "quantity": 150,
        "unit": "Pieces",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "08:00",
        "itemImages": ["https://media.istockphoto.com/id/1322230424/photo/medu-vada-a-south-indian-snack.jpg?s=612x612&w=0&k=20&c=q_3X-7xXt1yZsh2Xac555iVpvgx-r-qEPDDWeAqsIWY="]
      }
    ],
    "numberOfPeopleFed": 75,
    "description": "Daily unsold but fresh South Indian breakfast items from our restaurant on Anna Salai. Stored hygienically.",
    "images": ["https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "56 Anna Salai",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600002",
    "location": { "longitude": 80.2707, "latitude": 13.0827 },
    "contact": "9833334455",
    "email": "support@caretrust.org",
    "personName": "Karthik Raja",
    "assignedNgoId": null
  },
  {
    "donorId": "689f2efb48fd1c6763401a3f",
    "title": "Bulk Grains and Pulses Donation Drive",
    "source": "NGO",
    "items": [
      {
        "name": "Raw Rice",
        "quantity": 100,
        "unit": "Kilograms",
        "type": "Raw Food",
        "condition": "Fresh",
        "expiryDate": "2027-01-01T00:00:00.000Z",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "10:00",
        "itemImages": ["https://images.pexels.com/photos/7708805/pexels-photo-7708805.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Urad Dal",
        "quantity": 50,
        "unit": "Kilograms",
        "type": "Raw Food",
        "condition": "Fresh",
        "expiryDate": "2026-08-01T00:00:00.000Z",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "10:00",
        "itemImages": ["https://media.istockphoto.com/id/1294488337/photo/urad-dal-split-black-gram-in-a-white-bowl-on-a-wooden-background.jpg?s=612x612&w=0&k=20&c=6n-zL4j-b9oJ-2A3s-jT7hD_hL7Wk1YV5c2h_lF21gY="]
      },
      {
        "name": "Cooking Oil",
        "quantity": 20,
        "unit": "Liters",
        "type": "Packaged Food",
        "condition": "Fresh",
        "expiryDate": "2026-06-01T00:00:00.000Z",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "10:00",
        "itemImages": ["https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      }
    ],
    "numberOfPeopleFed": 300,
    "description": "Collected from a community donation drive. Large quantities of essential raw materials for cooking meals.",
    "images": ["https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "15, Mylapore Tank Road",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600004",
    "location": { "longitude": 80.2642, "latitude": 13.0339 },
    "contact": "9833334455",
    "email": "support@caretrust.org",
    "personName": "Lakshmi Iyer",
    "assignedNgoId": null
  },
  {
    "donorId": "689f2efb48fd1c6763401a3f",
    "title": "Fresh Vegetables from Local Market Vendor",
    "source": "Other",
    "items": [
      {
        "name": "Tomatoes",
        "quantity": 25,
        "unit": "Kilograms",
        "type": "Fruits & Vegetables",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "08:30",
        "itemImages": ["https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Onions",
        "quantity": 30,
        "unit": "Kilograms",
        "type": "Fruits & Vegetables",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "08:30",
        "itemImages": ["https://images.pexels.com/photos/1759367/pexels-photo-1759367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Brinjal (Eggplant)",
        "quantity": 20,
        "unit": "Kilograms",
        "type": "Fruits & Vegetables",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "08:30",
        "itemImages": ["https://images.pexels.com/photos/1459330/pexels-photo-1459330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      }
    ],
    "numberOfPeopleFed": 150,
    "description": "Unsold fresh vegetables from a Koyambedu Market vendor at the end of the day. All produce is high quality.",
    "images": ["https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "Koyambedu Market",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600107",
    "location": { "longitude": 80.1982, "latitude": 13.0712 },
    "contact": "9833334455",
    "email": "support@caretrust.org",
    "personName": "Murali Krishnan",
    "assignedNgoId": null
  },
  {
    "donorId": "689f2efb48fd1c6763401a3f",
    "title": "Surplus Lunch from a Family Function",
    "source": "Home",
    "items": [
      {
        "name": "Lemon Rice",
        "quantity": 8,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "13:00",
        "itemImages": ["https://media.istockphoto.com/id/1303248532/photo/lemon-rice.jpg?s=612x612&w=0&k=20&c=Xp-S-1t2hVn4Tfj-5-1L6_7h0lqaq1lTvsC1G7h_AFA="]
      },
      {
        "name": "Avial (Mixed vegetable stew)",
        "quantity": 6,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "12:30",
        "itemImages": ["https://media.istockphoto.com/id/1390457134/photo/avial-a-popular-kerala-dish-made-with-mixed-vegetables-cooked-in-a-coconut-and-yogurt-gravy.jpg?s=612x612&w=0&k=20&c=6_n-uO3z-z2lJp4r-1C7j5B7o-s2M6v1A8k8h3P1V5Q="]
      },
      {
        "name": "Potato Fry",
        "quantity": 5,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "12:00",
        "itemImages": ["https://media.istockphoto.com/id/1304561763/photo/potato-fry.jpg?s=612x612&w=0&k=20&c=7B3y6Pqj4zL5e-v-T-eJ3b7U2-f3rX7w9Y-2yQ5M5F8="]
      },
      {
        "name": "Semiya Payasam (Vermicelli Kheer)",
        "quantity": 4,
        "unit": "Liters",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "11:00",
        "itemImages": ["https://media.istockphoto.com/id/1402283023/photo/semiya-payasam-or-vermicelli-kheer-a-popular-indian-sweet-dish.jpg?s=612x612&w=0&k=20&c=6k1l-t-e-Q8E8i_9w2x-2f_8R_X3m_k_Q4g2o8R4E1M="]
      }
    ],
    "numberOfPeopleFed": 40,
    "description": "Delicious homemade food left over from a small family gathering. Hygienically packed and ready for pickup.",
    "images": ["https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "33 Adyar Gandhi Nagar",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600020",
    "location": { "longitude": 80.2558, "latitude": 13.0064 },
    "contact": "9833334455",
    "email": "support@caretrust.org",
    "personName": "Anitha Subramanian",
    "assignedNgoId": null
  },
  // Donations for Donor 4: Green Hope (689f2efb48fd1c6763401a40)
  {
    "donorId": "689f2efb48fd1c6763401a40",
    "title": "Gujarati Thali Surplus from Restaurant",
    "source": "Restaurant",
    "items": [
      {
        "name": "Thepla",
        "quantity": 300,
        "unit": "Pieces",
        "type": "Cooked Food",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "11:00",
        "itemImages": ["https://media.istockphoto.com/id/1328228555/photo/methi-thepla.jpg?s=612x612&w=0&k=20&c=e-6j5wV-G1X-5C7z9Z5q3b8k-g6e-6F7_y9j5b3k_mQ="]
      },
      {
        "name": "Undhiyu",
        "quantity": 15,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "12:00",
        "itemImages": ["https://media.istockphoto.com/id/1349580424/photo/undhiyu-a-traditional-gujarati-dish.jpg?s=612x612&w=0&k=20&c=6-6q8y-f-Q6l-1j-k-c-h-4b-6z-2J-1l-f6e-6g-1E="]
      },
      {
        "name": "Gujarati Kadhi",
        "quantity": 10,
        "unit": "Liters",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "11:30",
        "itemImages": ["https://media.istockphoto.com/id/1318228038/photo/gujarati-kadhi.jpg?s=612x612&w=0&k=20&c=2e-6l-7Z-q-h-1k-e-Q9i-8z-7b-9f-1l-3k-8g-7h-I="]
      },
      {
        "name": "Basundi",
        "quantity": 5,
        "unit": "Liters",
        "type": "Dairy Products",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "10:00",
        "itemImages": ["https://media.istockphoto.com/id/1301499532/photo/famous-bengali-food-bhog-er-khichuri-made-of-rice-and-lentils-mixed-with-vegetables-served.jpg?s=612x612&w=0&k=20&c=p727fD7n5wI2mQ6w2gqg9ZzG-oGjvESt3LpC5Y_G5jY="]
      }
    ],
    "numberOfPeopleFed": 90,
    "description": "Authentic Gujarati thali items remaining from today's lunch service at our restaurant on Ashram Road.",
    "images": ["https://media.istockphoto.com/id/1302775234/photo/gujarati-thali.jpg?s=612x612&w=0&k=20&c=7d-x-7b-9f-1l-3k-8g-7h-I-6e-6F7_y9j5b3k_mQ="],
    "status": "New",
    "address": "22 Ashram Road",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380009",
    "location": { "longitude": 72.5714, "latitude": 23.0225 },
    "contact": "9844445566",
    "email": "hello@greenhope.org",
    "personName": "Jignesh Patel",
    "assignedNgoId": null
  },
  {
    "donorId": "689f2efb48fd1c6763401a40",
    "title": "Unused Catering Supplies from Event",
    "source": "Caterer",
    "items": [
      {
        "name": "Packaged Water Bottles (250ml)",
        "quantity": 200,
        "unit": "Bottles",
        "type": "Beverages",
        "condition": "Fresh",
        "expiryDate": "2026-05-01T00:00:00.000Z",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "14:00",
        "itemImages": ["https://images.pexels.com/photos/3908803/pexels-photo-3908803.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Assorted Biscuits",
        "quantity": 50,
        "unit": "Packets",
        "type": "Packaged Food",
        "condition": "Fresh",
        "expiryDate": "2026-02-01T00:00:00.000Z",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "14:00",
        "itemImages": ["https://images.pexels.com/photos/237336/pexels-photo-237336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Instant Tea/Coffee Sachets",
        "quantity": 500,
        "unit": "Pieces",
        "type": "Beverages",
        "condition": "Fresh",
        "expiryDate": "2026-07-01T00:00:00.000Z",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "14:00",
        "itemImages": ["https://media.istockphoto.com/id/1154569552/photo/coffee-and-sugar-in-a-sachet-on-a-white-background.jpg?s=612x612&w=0&k=20&c=8e-x-7b-9f-1l-3k-8g-7h-I-6e-6F7_y9j5b3k_mQ="]
      }
    ],
    "numberOfPeopleFed": 200,
    "description": "After a large corporate event, we have a significant amount of unused, sealed packaged items like water, biscuits, and beverage sachets.",
    "images": ["https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "45, C.G. Road",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380006",
    "location": { "longitude": 72.5577, "latitude": 23.0258 },
    "contact": "9844445566",
    "email": "hello@greenhope.org",
    "personName": "Rina Desai",
    "assignedNgoId": null
  },
  {
    "donorId": "689f2efb48fd1c6763401a40",
    "title": "Hostel Mess Surplus - Dinner",
    "source": "Hostel",
    "items": [
      {
        "name": "Dal Tadka",
        "quantity": 12,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "19:00",
        "itemImages": ["https://images.pexels.com/photos/11111451/pexels-photo-11111451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Jeera Rice",
        "quantity": 15,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "19:30",
        "itemImages": ["https://media.istockphoto.com/id/1303248532/photo/lemon-rice.jpg?s=612x612&w=0&k=20&c=Xp-S-1t2hVn4Tfj-5-1L6_7h0lqaq1lTvsC1G7h_AFA="]
      },
      {
        "name": "Aloo Gobi",
        "quantity": 10,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "18:30",
        "itemImages": ["https://media.istockphoto.com/id/1304561763/photo/potato-fry.jpg?s=612x612&w=0&k=20&c=7B3y6Pqj4zL5e-v-T-eJ3b7U2-f3rX7w9Y-2yQ5M5F8="]
      },
      {
        "name": "Rotis",
        "quantity": 400,
        "unit": "Pieces",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "18:00",
        "itemImages": ["https://images.pexels.com/photos/8886361/pexels-photo-8886361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      }
    ],
    "numberOfPeopleFed": 100,
    "description": "Standard, nutritious dinner from our student hostel mess. Available for pickup after 9 PM.",
    "images": ["https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "Navrangpura University Area",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380009",
    "location": { "longitude": 72.5554, "latitude": 23.0380 },
    "contact": "9844445566",
    "email": "hello@greenhope.org",
    "personName": "Prakash Trivedi",
    "assignedNgoId": null
  },
  {
    "donorId": "689f2efb48fd1c6763401a40",
    "title": "Seasonal Fruit Donation - Mangoes",
    "source": "Home",
    "items": [
      {
        "name": "Kesar Mangoes",
        "quantity": 50,
        "unit": "Kilograms",
        "type": "Fruits & Vegetables",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "09:00",
        "itemImages": ["https://media.istockphoto.com/id/1328228555/photo/methi-thepla.jpg?s=612x612&w=0&k=20&c=e-6j5wV-G1X-5C7z9Z5q3b8k-g6e-6F7_y9j5b3k_mQ="]
      },
      {
        "name": "Ripe Bananas",
        "quantity": 20,
        "unit": "Kilograms",
        "type": "Fruits & Vegetables",
        "condition": "Slightly Used",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "09:00",
        "itemImages": ["https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      }
    ],
    "numberOfPeopleFed": 80,
    "description": "Excess yield of fresh, ripe Kesar mangoes and other fruits from our personal farm on the outskirts of Ahmedabad.",
    "images": ["https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "Satellite Road",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380015",
    "location": { "longitude": 72.5186, "latitude": 23.0289 },
    "contact": "9844445566",
    "email": "hello@greenhope.org",
    "personName": "Mehul Mehta",
    "assignedNgoId": null
  },
  // Donations for Donor 5: Smile Foundation (689f2efb48fd1c6763401a41)
  {
    "donorId": "689f2efb48fd1c6763401a41",
    "title": "Leftover Punjabi Cuisine from a Birthday Party",
    "source": "Event",
    "items": [
      {
        "name": "Shahi Paneer",
        "quantity": 10,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-21T00:00:00.000Z",
        "cookedTime": "20:00",
        "itemImages": ["https://images.pexels.com/photos/4057733/pexels-photo-4057733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Butter Chicken",
        "quantity": 12,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Leftover",
        "cookedDate": "2025-08-21T00:00:00.000Z",
        "cookedTime": "20:30",
        "itemImages": ["https://images.pexels.com/photos/10579178/pexels-photo-10579178.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Garlic Naan",
        "quantity": 100,
        "unit": "Pieces",
        "type": "Bakery Products",
        "condition": "Leftover",
        "cookedDate": "2025-08-21T00:00:00.000Z",
        "cookedTime": "19:00",
        "itemImages": ["https://images.pexels.com/photos/14588640/pexels-photo-14588640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Phirni (Rice Pudding)",
        "quantity": 5,
        "unit": "Kilograms",
        "type": "Dairy Products",
        "condition": "Fresh",
        "cookedDate": "2025-08-21T00:00:00.000Z",
        "cookedTime": "15:00",
        "itemImages": ["https://media.istockphoto.com/id/1323412398/photo/chaler-payesh-a-popular-bengali-sweet-dish-made-with-rice-and-milk-top-view.jpg?s=612x612&w=0&k=20&c=27V6y-gQ00J4Kk03hU-8l8sD9n8Y_P2K6T6d-K1B13I="]
      }
    ],
    "numberOfPeopleFed": 85,
    "description": "Hearty and delicious Punjabi food from a birthday celebration held in Connaught Place. Food is untouched by guests and stored in catering containers.",
    "images": ["https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "15 Connaught Place",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "location": { "longitude": 77.2167, "latitude": 28.6330 },
    "contact": "9855556677",
    "email": "contact@smilefoundation.org",
    "personName": "Vikram Singh",
    "assignedNgoId": null
  },
  {
    "donorId": "689f2efb48fd1c6763401a41",
    "title": "Bakery surplus - Cakes and Pastries",
    "source": "Bakery",
    "items": [
      {
        "name": "Chocolate Truffle Pastries",
        "quantity": 40,
        "unit": "Pieces",
        "type": "Bakery Products",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "09:00",
        "itemImages": ["https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Pineapple Cake (1kg)",
        "quantity": 5,
        "unit": "Pieces",
        "type": "Bakery Products",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "10:00",
        "itemImages": ["https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      },
      {
        "name": "Vegetable Patties",
        "quantity": 100,
        "unit": "Pieces",
        "type": "Bakery Products",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "08:00",
        "itemImages": ["https://media.istockphoto.com/id/1304561763/photo/potato-fry.jpg?s=612x612&w=0&k=20&c=7B3y6Pqj4zL5e-v-T-eJ3b7U2-f3rX7w9Y-2yQ5M5F8="]
      }
    ],
    "numberOfPeopleFed": 100,
    "description": "Daily unsold items from our popular bakery in Khan Market. Includes cakes, pastries, and savory snacks.",
    "images": ["https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "22 Khan Market",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110003",
    "location": { "longitude": 77.2274, "latitude": 28.6001 },
    "contact": "9855556677",
    "email": "contact@smilefoundation.org",
    "personName": "Neha Kapoor",
    "assignedNgoId": null
  },
  {
    "donorId": "689f2efb48fd1c6763401a41",
    "title": "Donation of Packaged Food Items",
    "source": "Corporate",
    "items": [
      {
        "name": "Nutritional Supplement Powder",
        "quantity": 30,
        "unit": "Boxes",
        "type": "Nutritional Supplements",
        "condition": "Fresh",
        "expiryDate": "2026-09-01T00:00:00.000Z",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "15:00",
        "itemImages": ["https://media.istockphoto.com/id/1301499532/photo/famous-bengali-food-bhog-er-khichuri-made-of-rice-and-lentils-mixed-with-vegetables-served.jpg?s=612x612&w=0&k=20&c=p727fD7n5wI2mQ6w2gqg9ZzG-oGjvESt3LpC5Y_G5jY="]
      },
      {
        "name": "Fortified Atta (Flour)",
        "quantity": 50,
        "unit": "Packets",
        "type": "Raw Food",
        "condition": "Fresh",
        "expiryDate": "2026-03-01T00:00:00.000Z",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "15:00",
        "itemImages": ["https://media.istockphoto.com/id/1328228555/photo/methi-thepla.jpg?s=612x612&w=0&k=20&c=e-6j5wV-G1X-5C7z9Z5q3b8k-g6e-6F7_y9j5b3k_mQ="]
      },
      {
        "name": "Packaged Red Lentils (Masoor Dal)",
        "quantity": 50,
        "unit": "Kilograms",
        "type": "Raw Food",
        "condition": "Fresh",
        "expiryDate": "2026-10-01T00:00:00.000Z",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "15:00",
        "itemImages": ["https://media.istockphoto.com/id/1294488337/photo/urad-dal-split-black-gram-in-a-white-bowl-on-a-wooden-background.jpg?s=612x612&w=0&k=20&c=6n-zL4j-b9oJ-2A3s-jT7hD_hL7Wk1YV5c2h_lF21gY="]
      }
    ],
    "numberOfPeopleFed": 400,
    "description": "As part of our CSR activity, we are donating a large stock of essential packaged food items. All items are sealed and have long expiry dates.",
    "images": ["https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "Cyber City, DLF Phase 2",
    "city": "Gurugram",
    "state": "Haryana",
    "pincode": "122002",
    "location": { "longitude": 77.0883, "latitude": 28.4941 },
    "contact": "9855556677",
    "email": "contact@smilefoundation.org",
    "personName": "Aditi Verma",
    "assignedNgoId": null
  },
  {
    "donorId": "689f2efb48fd1c6763401a41",
    "title": "Street Food Vendor Donation - Chole Bhature",
    "source": "Other",
    "items": [
      {
        "name": "Chole (Chickpea Curry)",
        "quantity": 15,
        "unit": "Kilograms",
        "type": "Cooked Food",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "10:00",
        "itemImages": ["https://media.istockphoto.com/id/1304561763/photo/potato-fry.jpg?s=612x612&w=0&k=20&c=7B3y6Pqj4zL5e-v-T-eJ3b7U2-f3rX7w9Y-2yQ5M5F8="]
      },
      {
        "name": "Bhature (Fried Bread)",
        "quantity": 250,
        "unit": "Pieces",
        "type": "Cooked Food",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "10:00",
        "itemImages": ["https://media.istockphoto.com/id/1318228038/photo/gujarati-kadhi.jpg?s=612x612&w=0&k=20&c=2e-6l-7Z-q-h-1k-e-Q9i-8z-7b-9f-1l-3k-8g-7h-I="]
      },
      {
        "name": "Onion Salad",
        "quantity": 5,
        "unit": "Kilograms",
        "type": "Fruits & Vegetables",
        "condition": "Fresh",
        "cookedDate": "2025-08-22T00:00:00.000Z",
        "cookedTime": "09:30",
        "itemImages": ["https://images.pexels.com/photos/1759367/pexels-photo-1759367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]
      }
    ],
    "numberOfPeopleFed": 100,
    "description": "A generous street food vendor in Chandni Chowk wishes to donate his day's unsold Chole Bhature to feed the needy.",
    "images": ["https://images.pexels.com/photos/11574974/pexels-photo-11574974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
    "status": "New",
    "address": "Chandni Chowk",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110006",
    "location": { "longitude": 77.2294, "latitude": 28.6562 },
    "contact": "9855556677",
    "email": "contact@smilefoundation.org",
    "personName": "Ramesh Kumar",
    "assignedNgoId": null
  }
];

const seedDB = async () => {
  try {
    // Optional: Clear existing donations before inserting new ones
    // await Donation.deleteMany({});
    // console.log("Cleared existing donations.");

    // Insert the new donation data
    await Donation.insertMany(donationsData);
    console.log(`Successfully inserted ${donationsData.length} donation records.`);
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};



// Donation IDs
const donationIds = [
  "68a876c6751f9c96ecc26e53",
  "68a876c6751f9c96ecc26e4f",
  "68a876c6751f9c96ecc26e57"
];

// NGO IDs
const ngoIds = [
  "689f2efb48fd1c6763401a42",
  "689f2efb48fd1c6763401a4b",
  "689f2efb48fd1c6763401a44",
  "689f2efb48fd1c6763401a3e",
  "689f2efb48fd1c6763401a48",
  "689f2efb48fd1c6763401a4a",
  "689f2efb48fd1c6763401a40",
  "689f2efb48fd1c6763401a49",
  "689f2efb48fd1c6763401a3f",
  "689f2efb48fd1c6763401a45",
  "689f2efb48fd1c6763401a47",
  "689f2efb48fd1c6763401a43"
];

async function insertRequests() {
  try {
    const requests = [];

    // loop donations properly
    for (const donationId of donationIds) {
      // get donorId from Donation doc
      const donation = await Donation.findById(donationId, { donorId: 1 });
      if (!donation) {
        console.log(`Donation ${donationId} not found`);
        continue;
      }
      const donorId = donation.donorId;

      // loop NGOs
      for (const ngoId of ngoIds) {
        requests.push({
          donationId,
          donorId,
          ngoId,
          message: `Request from NGO ${ngoId} for donation ${donationId}`,
          status: "New"
        });
      }
    }

    console.log(`${requests.length} requests prepared`);

    // bulk insert
    const result = await DonationRequest.insertMany(requests, { ordered: false });
    console.log("Requests inserted successfully!");
    console.log(result.length, "records inserted");

  } catch (error) {
    console.error("Error inserting requests:", error);
  }
}




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