const fs = require('fs');
const Donation = require('../models/donation.model');

// Helper 1: Processes food items from the form, returning clean data and old image paths
// const processFoodItemsFromRequest = (formFoodItems = []) => {
//     const foodItemsMap = [];
//     const oldItemImages = [];

//     for (const tempItem of formFoodItems) {
//         if (!tempItem.name && !tempItem.quantity) continue;

//         if (tempItem.expiryDate === 'null' || tempItem.expiryDate === '') tempItem.expiryDate = null;
//         if (tempItem.expiryTime === 'null' || tempItem.expiryTime === '') tempItem.expiryTime = null;

//         foodItemsMap.push({
//             name: tempItem.name,
//             quantity: parseInt(tempItem.quantity),
//             unit: tempItem.unit,
//             type: tempItem.type,
//             condition: tempItem.condition,
//             itemImages: tempItem.itemImages || [],
//             cookedDate: tempItem.cookedDate,
//             cookedTime: tempItem.cookedTime,
//             expiryDate: tempItem.expiryDate,
//             expiryTime: tempItem.expiryTime,
//         });

//         if (tempItem.oldItemImages && tempItem.oldItemImages.length > 0) {
//             oldItemImages.push(...tempItem.oldItemImages);
//         }
//     }
//     return { foodItemsMap, oldItemImages };
// };

// // Helper 2: Processes newly uploaded files
// const processImageUploads = (files = [], foodItemsMap = []) => {
//     const newDonationImages = [];
//     files.forEach(file => {
//         const { fieldname, path } = file;
//         const formattedPath = '/' + path.replace(/\\/g, '/').split('public/')[1];

//         if (fieldname.startsWith('images')) {
//             newDonationImages.push(formattedPath);
//         }

//         const match = fieldname.match(/^foodItems\[(\d+)]\[itemImages]\[(\d+)]$/);
//         if (match) {
//             const index = match[1];
//             if (foodItemsMap[index] && foodItemsMap[index].itemImages) {
//                 foodItemsMap[index].itemImages.push(formattedPath);
//             }
//         }
//     });
//     return { newDonationImages, updatedFoodItemsMap: foodItemsMap };
// };

// // Helper 3: Determines which images to save and which to delete
// const manageDonationImages = (formFields, newDonationImages) => {
//     let finalDonationImages = [];
//     let imagesToDelete = [];

//     if (newDonationImages.length > 0) {
//         finalDonationImages = newDonationImages;
//         if (formFields.oldDonationImages) {
//             imagesToDelete.push(...formFields.oldDonationImages);
//         }
//     } else {
//         finalDonationImages = formFields.donationImages || [];
//     }
//     return { finalDonationImages, imagesToDelete };
// };

// Helper 1: Deletes files from the filesystem
const deleteFiles = (imagePaths = []) => {
    imagePaths.forEach(image => {
        if (!image) return;
        const imagePath = 'public/' + image.replace(/^\//, '');
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted old image: ${imagePath}`);
        } else {
            console.warn(`Old image not found, skipping deletion: ${imagePath}`);
        }
    });
};

// Helper 2: Constructing the food items map
const constructFoodItemsMap = (foodItems, oldImages) => {
    let foodItemsMap = [];
    for (let itemIndex in foodItems) {
        tempItem = foodItems[itemIndex];
        if (!tempItem.name && !tempItem.quantity && !tempItem.unit && !tempItem.type && !tempItem.condition && !tempItem.cookedDate && !tempItem.cookedTime) {
            continue;
        }
        if (tempItem.expiryDate === 'null' || tempItem.expiryDate === '') {
            tempItem.expiryDate = null;
        }
        if (tempItem.expiryTime === 'null' || tempItem.expiryTime === '') {
            tempItem.expiryTime = null;
        }

        if (tempItem.oldItemImages) {
            oldImages.push(...tempItem.oldItemImages);
            // console.log('Old item images to delete: ', tempItem.oldItemImages);
            delete tempItem.oldItemImages;
        }

        tempItem.quantity = parseInt(tempItem.quantity);
        const item = { ...tempItem };
        foodItemsMap.push(item);
    }
    return foodItemsMap;
}

// Helper 3: Extract image paths
const extractImagePaths = (files, donationImages, foodItemsMap) => {
    files.forEach(file => {
        const { fieldname, path } = file;

        // Store donation images
        if (fieldname.startsWith('donation[images[]]')) {
            donationImages.push('/' + path.replace(/\\/g, '/').split('public/')[1]);
        }

        // Store food item images
        const match = fieldname.match(/^foodItems\[(\d+)]\[itemImages]\[(\d+)]$/);
        if (match) {
            const index = match[1];
            if (!foodItemsMap[index].itemImages) foodItemsMap[index].itemImages = [];
            // if (!foodItemsMap[index].itemImages) foodItemsMap[index].itemImages = [];
            foodItemsMap[index].itemImages.push('/' + path.replace(/\\/g, '/').split('public/')[1]);
        }
    });
};

// Helper 4: Construct donation data object
const constructDonationData = (body, files, donorId, res, donationId = null) => {
    console.log("Constructing donation data...");
    // console.log('Request Body:', body);
    // console.log('\nUploaded Files:', files);
    try {
        let donationImages = [];
        let foodItemsMap = [];
        let oldImages = [];
        const donationData = { ...body.donation };
        // console.log('Initial donation data:', donationData);

        // If updating and oldDonationImages found means new images uploaded, so mark old ones for deletion 
        if (donationData.oldDonationImages) {
            oldImages.push(...donationData.oldDonationImages);
            delete donationData.oldDonationImages;
        }
        // If updatingi and images found means no new images uploaded, so keep old ones in donationImages array
        if (donationData.images) {
            donationImages.push(...donationData.images);
        }

        // Construct food items array
        foodItemsMap = constructFoodItemsMap(body.foodItems, oldImages);

        // Handle file uploads / get image file paths
        extractImagePaths(files, donationImages, foodItemsMap);

        // console.log('\nFood items images: ');
        // foodItemsMap.forEach(item => {
        //     if(item.itemImages) {
        //         console.log(item.itemImages);
        //     }
        // });

        console.log('\nOld deletable images: ', oldImages);

        // clean up and construct final donation data object
        if (donationData.description === 'null' || donationData.description === '') {
            donationData.description = null;
        }
        donationData.donorId = donorId;
        donationData.items = foodItemsMap;
        donationData.images = donationImages;

        donationData.numberOfPeopleFed = parseInt(donationData.numberOfPeopleFed);
        const location = {
            latitude: parseFloat(donationData.latitude),
            longitude: parseFloat(donationData.longitude)
        }
        donationData.location = location;
        delete donationData.latitude;
        delete donationData.longitude;

        if (donationId) {
            return { donationData, oldImages };
        }
        return donationData;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    // processFoodItemsFromRequest,
    // processImageUploads,
    // manageDonationImages,
    deleteFiles,
    constructDonationData
};