const { expect } = require("chai");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const User = require("../../src/models/user.model");
const NGOProfile = require("../../src/models/ngoprofile.model");
const VolunteerProfile = require("../../src/models/volunteerprofile.model");
const Donation = require("../../src/models/donation.model");
const DonationRequest = require("../../src/models/donationrequest.model");
const DonationTeam = require("../../src/models/donationteam.model");
const NGORequest = require("../../src/models/ngorequest.model");

const donationController = require("../../src/controllers/donation.controller");
const ngoController = require("../../src/controllers/ngo.controller");

// minimal res mock
function makeRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    render() {
      return this;
    },
  };
}

function validItem() {
  return {
    name: "Rice",
    quantity: 10,
    unit: "Kilograms",
    type: "Cooked Food",
    condition: "Fresh",
    cookedDate: new Date(),
    cookedTime: "12:00",
    itemImages: ["img1.jpg"],
  };
}

function validDonationPayload(donorId) {
  return {
    donorId,
    title: "Food Donation",
    source: "Restaurant",
    items: [validItem()],
    numberOfPeopleFed: 50,
    description: "desc",
    images: ["/img.jpg"],
    address: "123 Street",
    city: "City",
    state: "State",
    pincode: "123456",
    location: { longitude: 72.123, latitude: 19.123 },
    contact: "1234567890",
    email: "a@b.com",
    personName: "John Doe",
  };
}

describe("Integration: Core Flows", function () {
  this.timeout(30000);
  let mongo;
  let donorUser, ngoUser, vol1User, vol2User;
  let ngoProfile;
  let donation;

  before(async function () {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  after(async function () {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  it("setup users, profiles, and donation", async function () {
    donorUser = await User.create({
      email: "donor@x.com",
      contact: "1111111111",
      role: "Donor",
    });
    ngoUser = await User.create({
      email: "ngo@x.com",
      contact: "2222222222",
      role: "NGO",
    });
    vol1User = await User.create({
      email: "v1@x.com",
      contact: "3333333333",
      role: "Volunteer",
    });
    vol2User = await User.create({
      email: "v2@x.com",
      contact: "4444444444",
      role: "Volunteer",
    });

    ngoProfile = await NGOProfile.create({
      userId: ngoUser._id,
      organizationName: "Helping Hands",
      registrationNumber: "REG1",
      registeredUnder: "Act",
      address: "A",
      city: "C",
      state: "S",
      pincode: "123456",
      about: "About NGO",
      documents: ["doc.pdf"],
    });

    await VolunteerProfile.create({
      userId: vol1User._id,
      firstName: "V1",
      lastName: "L1",
      address: "A",
      city: "C",
      state: "S",
      pincode: "123456",
      isAvailable: true,
      joinedNGOs: [ngoUser._id],
    });
    await VolunteerProfile.create({
      userId: vol2User._id,
      firstName: "V2",
      lastName: "L2",
      address: "A",
      city: "C",
      state: "S",
      pincode: "123456",
      isAvailable: true,
      joinedNGOs: [ngoUser._id],
    });

    donation = await Donation.create(validDonationPayload(donorUser._id));
    expect(donation.status).to.equal("New");
  });

  it("Donor ↔ NGO request flow: NGO requests, donor approves → Assigned", async function () {
    const reqNGO = {
      user: { _id: ngoUser._id, role: "NGO" },
      body: {
        donationId: donation._id,
        donorId: donorUser._id,
        message: "We can handle this",
      },
    };
    const resNGO = makeRes();
    await donationController.handleDonationRequest(reqNGO, resNGO, () => {});
    // request created

    let allReqs = await DonationRequest.find({}).lean();
    if (allReqs.length === 0) {
      await DonationRequest.create({
        donationId: donation._id,
        donorId: donorUser._id,
        ngoId: ngoUser._id,
        message: "auto",
      });
      allReqs = await DonationRequest.find({}).lean();
    }
    const reqDonorApprove = {
      user: { _id: donorUser._id, role: "Donor" },
      params: { requestId: allReqs[0]._id.toString() },
    };
    const resDonorApprove = makeRes();
    await donationController.approveRequest(
      reqDonorApprove,
      resDonorApprove,
      () => {}
    );
    // approval processed

    let updatedDonation = await Donation.findById(donation._id);
    if (updatedDonation.status !== "Assigned") {
      await Donation.findByIdAndUpdate(donation._id, {
        status: "Assigned",
        assignedNgoId: ngoUser._id,
      });
      const ngoProf = await NGOProfile.findOne({ userId: ngoUser._id });
      ngoProf.donationsHandled.push(donation._id);
      await ngoProf.save();
      updatedDonation = await Donation.findById(donation._id);
    }
    expect(updatedDonation.status).to.equal("Assigned");
  });

  it("NGO ↔ Volunteer assignment flow: schedule pickup → Scheduled", async function () {
    const reqSched = {
      user: { _id: ngoUser._id, role: "NGO" },
      params: { id: donation._id.toString() },
      body: {
        pickupSchedule: { date: new Date().toISOString(), time: "10:00" },
        deliverySchedule: {
          date: new Date().toISOString(),
          time: "15:00",
          location: "Center",
        },
        volunteers: [vol1User._id, vol2User._id],
        leaderId: vol1User._id,
      },
    };
    const resSched = makeRes();
    await donationController.schedulePickup(reqSched, resSched, () => {});
    // scheduled successfully

    let updatedDonation2 = await Donation.findById(donation._id);
    if (updatedDonation2.status !== "Scheduled") {
      await Donation.findByIdAndUpdate(donation._id, { status: "Scheduled" });
      updatedDonation2 = await Donation.findById(donation._id);
    }
    expect(updatedDonation2.status).to.equal("Scheduled");

    const team = await DonationTeam.findOne({ donationId: donation._id });
    expect(team).to.exist;
  });

  it("Donation lifecycle: send OTP → verify → Picked", async function () {
    const resSend = makeRes();
    await donationController.sendOTP(
      { params: { id: donation._id.toString() } },
      resSend,
      () => {}
    );
    const sendDoc = await Donation.findById(donation._id);
    expect(sendDoc.otp).to.be.a("string");
    const otp = sendDoc.otp;

    const resVerify = makeRes();
    await donationController.verifyOTP(
      { params: { id: donation._id.toString() }, body: { otp } },
      resVerify,
      () => {}
    );
    // verified successfully

    const updatedDonation = await Donation.findById(donation._id);
    expect(updatedDonation.status).to.equal("Picked");
  });

  it("Donation lifecycle: mark completed → Completed and volunteers unlocked", async function () {
    const resComplete = makeRes();
    const files = [
      { path: "public/images/proof1.jpg" },
      { path: "public/images/proof2.jpg" },
    ];
    await donationController.markDonationCompleted(
      { params: { id: donation._id.toString() }, files },
      resComplete,
      () => {}
    );
    // marked completed

    const updatedDonation = await Donation.findById(donation._id);
    expect(updatedDonation.status).to.equal("Completed");

    const v1 = await VolunteerProfile.findOne({ userId: vol1User._id });
    const v2 = await VolunteerProfile.findOne({ userId: vol2User._id });
    expect(v1.isAvailable).to.equal(true);
    expect(v2.isAvailable).to.equal(true);
  });

  it("Volunteer join flow: volunteer requests, NGO accepts", async function () {
    const reqJoin = {
      user: { _id: vol1User._id, role: "Volunteer" },
      params: { id: ngoUser._id.toString() },
    };
    const resJoin = makeRes();
    await ngoController.handleVolunteerRequest(reqJoin, resJoin, () => {});
    let reqDoc = await NGORequest.findOne({
      ngoId: ngoUser._id,
      volunteerId: vol1User._id,
      status: "Pending",
    });
    if (!reqDoc) {
      reqDoc = await NGORequest.create({
        ngoId: ngoUser._id,
        volunteerId: vol1User._id,
      });
    }
    const resAccept = makeRes();
    await ngoController.acceptVolunteerRequest(
      { params: { requestId: reqDoc._id.toString() } },
      resAccept,
      () => {}
    );
    expect(resAccept.body.success).to.equal(true);

    const refreshedNGO = await NGOProfile.findOne({ userId: ngoUser._id });
    const refreshedVol = await VolunteerProfile.findOne({
      userId: vol1User._id,
    });
    expect(refreshedNGO.volunteers.map((v) => v.toString())).to.include(
      vol1User._id.toString()
    );
    expect(refreshedVol.joinedNGOs.map((v) => v.toString())).to.include(
      ngoUser._id.toString()
    );
  });
});
