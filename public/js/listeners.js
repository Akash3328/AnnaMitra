window.foodItems = window.foodItems || [];
let imagesModalURLs = [];
let imagesModalIndex = 0;

document.addEventListener('DOMContentLoaded', (e) => {

    console.log('listeners loaded');

    //  ==========================  Common JS  ============================

    const notificationToggle = document.getElementById('notificationsToggler');
    if (notificationToggle) {
        // turn on notification if input is checked otherwise turn off 
        notificationToggle.addEventListener('change', function (event) {
            const isEnabled = event.target.checked;
            // if notifications enabled, request permission from browser else disable notifications permission
            if (isEnabled) {
                if (Notification.permission !== 'granted') {
                    Notification.requestPermission().then(function (permission) {
                        if (permission === 'granted') {
                            showAlert(alertTypes.Success, 'Notification permission granted.');
                        } else {
                            showAlert(alertTypes.Warning, 'Notification permission denied. You will not receive notifications.');
                            notificationToggle.checked = false; // revert toggle state
                            return;
                        }
                    });
                }
            } else {
                // No direct way to revoke permission, just inform user
                showAlert(alertTypes.Info, 'To completely disable notifications, please change permissions in your browser settings.');
            }
            
            const role = window.user ? window.user.role.toLowerCase() : null;
            fetch(`/${role}/toggle-notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ enabled: isEnabled })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    showAlert(alertTypes.Success, `Notifications ${isEnabled ? 'enabled' : 'disabled'} successfully.`);
                } else {
                    showAlert(alertTypes.Danger, `Failed to ${isEnabled ? 'enable' : 'disable'} notifications. Please try again.`);
                    notificationToggle.checked = !isEnabled; // revert toggle state
                }
            })
            .catch((err) => {
                showAlert(alertTypes.Danger, `An error occurred. Please try again.`);
                console.error('Notification toggle error:', err);
                notificationToggle.checked = !isEnabled; // revert toggle state
            });
        });
    }



    //  ==========================  Login page JS  ============================

    



    //  ==========================  Registration page JS  ============================

    
    



    //  ==========================  Donate page JS  ============================

    // Handle image input
    const itemImages = document.getElementById('itemImages');
    if (itemImages) {
        itemImages.addEventListener('change', handleImageUpload);
    }
    const editItemImages = document.getElementById('editItemImages');
    if (editItemImages) {
        editItemImages.addEventListener('change', handleImageUpload);
    }
    const donationImages = document.getElementById('donationImages'); // unchanged, input name is images[]
    if (donationImages) {
        donationImages.addEventListener('change', handleImageUpload);
    }

    // Table click listener for event delegation
    const itemsTable = document.getElementById('itemsTable');
    if (itemsTable) {
        itemsTable.addEventListener('click', function (event) {
            if (event.target.classList.contains('fa-trash-alt') || event.target.classList.contains('btn-outline-danger')) {
                handleDeleteFoodItem(event);
            }
            if (event.target.classList.contains('fa-pen') || event.target.classList.contains('btn-outline-primary')) {
                handleOpenEditFoodItemModal(event);
            }
            if (event.target.classList.contains('hover-blue')) {
                handleOpenImagesModal(event, 'item-table');
            }
        });
    }

    // Handle image modal navigation
    const viewerImage = document.getElementById('viewerImage');
    const nextImageBtn = document.getElementById('nextImage');
    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', function (event) {
            imagesModalIndex++;
            if (imagesModalIndex === imagesModalURLs.length) {
                imagesModalIndex = 0;
            }
            viewerImage.src = imagesModalURLs[imagesModalIndex];
        });
    }
    const prevImageBtn = document.getElementById('prevImage');
    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', function (event) {
            imagesModalIndex--;
            if (imagesModalIndex < 0) {
                imagesModalIndex = imagesModalURLs.length - 1;
            }
            viewerImage.src = imagesModalURLs[imagesModalIndex];
        });
    }

    const viewerDonationImage = document.getElementById('viewerDonationImage');
    if (viewerDonationImage) {
        const nextDonationImageBtn = document.getElementById('nextDonationImage');
        const prevDonationImageBtn = document.getElementById('prevDonationImage');
        if (viewerDonationImages.length === 0) {
            nextDonationImageBtn.disabled = true;
            prevDonationImageBtn.disabled = true;
        }
        else {
            nextDonationImageBtn.addEventListener('click', function (event) {
                viewerDonationImagesIndex++;
                if (viewerDonationImagesIndex === viewerDonationImages.length) {
                    viewerDonationImagesIndex = 0;
                }
                viewerDonationImage.src = viewerDonationImages[viewerDonationImagesIndex];
            });

            prevDonationImageBtn.addEventListener('click', function (event) {
                viewerDonationImagesIndex--;
                if (viewerDonationImagesIndex < 0) {
                    viewerDonationImagesIndex = viewerDonationImages.length - 1;
                }
                viewerDonationImage.src = viewerDonationImages[viewerDonationImagesIndex];
            });
        }
    }

    // Handle current location button click
    const currentLocationBtn = document.getElementById('currentLocation');
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', handleGetCurrentLocation);
    }

    // Handle city input blur event to set location
    const donationCityInput = document.getElementById('donationCity');
    if (donationCityInput) {
        donationCityInput.addEventListener('blur', handleSetCityLocation);
    }




    //  ==========================  All Donations page JS  ============================

    const searchTitleDesc = document.getElementById('searchTitleDesc');
    if (searchTitleDesc) {
        console.log('search filters initialized');
        setDonationFilters();
    }





    //  ==========================  Donor dashboard page JS  ============================



});




/*  ---------------------------  Handler Functions  ---------------------------  */




// Image handler for the image input
let selectedItemImages = [];
let selectedDonationImages = [];
function handleImageUpload(event) {
    const files = event.target.files;
    const preview = document.getElementById('preview');
    fs = files;
    let imageLimit = 3;
    if (event.target === donationImages) {
        imageLimit = 5; // Maximum number of images allowed
    }

    if (files.length > imageLimit) {
        showAlert(alertTypes.Warning, `You can only select up to ${imageLimit} images.`);
        event.target.value = ''; // Reset input
        event.target.nextElementSibling.innerText = "Upload an image of the food you're donating";
        return;
    }

    const names = Array.from(files).map(file => file.name).join(', ');
    event.target.nextElementSibling.innerText = 'Selected: ' + names;
    event.target.nextElementSibling.nextElementSibling.innerHTML = ''; // Clear previous previews
    if (event.target === donationImages) {
        selectedDonationImages = [];
    }
    else {
        selectedItemImages = [];
    }
    [...files].forEach(file => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        if (event.target === donationImages) {
            selectedDonationImages.push(img.src);
        }
        else {
            selectedItemImages.push(img.src);
        }
        img.className = 'img-thumbnail me-2 mb-2';
        img.style.maxWidth = '150px';
        event.target.nextElementSibling.nextElementSibling.appendChild(img);
    });
}

// Function to handle deletion of a food item from the table
function handleDeleteFoodItem(event) {
    const row = event.target.closest('tr');
    const itemIndex = row.rowIndex - 1; // Adjust for header row
    foodItems.splice(itemIndex, 1); // Remove item from array
    itemsTable.deleteRow(row.rowIndex); // Remove row from table
    updateIndexes();
    showAlert(alertTypes.Success, 'Food item deleted successfully!');
} 

// Function to update the index numbers in the items table
// This is called after deleting an item
function updateIndexes() {
    const trs = itemsTable.lastElementChild.childNodes;
    for (i = 0; i < trs.length; i++) {
        trs[i].firstElementChild.innerText = i + 1;
    }
}

// Function to open edit food item model
function handleOpenEditFoodItemModal(event) {
    const row = event.target.closest('tr');
    const itemIndex = row.rowIndex - 1; // Adjust for header row
    let item = foodItems[itemIndex]; // Get the item to edit

    // Get the form
    const form = document.getElementById('editItemForm');

    // Fill the input fields
    form.elements['item[name]'].value = item.name || '';
    form.elements['item[quantity]'].value = item.quantity || '';
    form.elements['item[unit]'].value = item.unit || '';
    form.elements['item[type]'].value = item.type || '';
    form.elements['item[condition]'].value = item.condition || '';

    // Expiry
    if (item.expiryDate && item.expiryDate.length > 10) {
        item.expiryDate = item.expiryDate.slice(0, 10); // Ensure date is in YYYY-MM-DD format
    }
    form.elements['item[expiryDate]'].value = item.expiryDate || '';
    form.elements['item[expiryTime]'].value = item.expiryTime || '';

    // Cooked
    if (item.cookedDate && item.cookedDate.length > 10) {
        item.cookedDate = item.cookedDate.slice(0, 10); // Ensure date is in YYYY-MM-DD format
    }
    form.elements['item[cookedDate]'].value = item.cookedDate || '';
    form.elements['item[cookedTime]'].value = item.cookedTime || '';

    // Clear preview area first
    const previewContainer = form.querySelector('.imagesPreview');
    previewContainer.innerHTML = '';

    // Show previews of existing images (if blob URLs)
    if (item.itemImages && item.itemImages.length > 0) {
        item.itemImages.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'food item';
            img.classList.add('img-thumbnail', 'me-2', 'mb-2');
            img.style.maxWidth = '150px';
            previewContainer.appendChild(img);
        });
    }

    // Store index in a hidden field if you plan to update item in foodItems
    form.dataset.index = itemIndex;
}

// Function to open the image modal and display images
function handleOpenImagesModal(event, tableType) {
    const nextImageBtn = document.getElementById('nextImage');
    const prevImageBtn = document.getElementById('prevImage');
    const viewerImage = document.getElementById('viewerImage');
    let ind = event.target.closest('tr').rowIndex - 1;

    if (tableType === 'donation-table') {
        imagesModalURLs = donationItems[ind]['images'];
    }
    else if(tableType === 'donation-completion'){
        imagesModalURLs = completionImages;
    }
    else {
        imagesModalURLs = foodItems[ind]['itemImages'];
    }

    imagesModalIndex = 0;
    viewerImage.src = imagesModalURLs[imagesModalIndex];
    if (imagesModalURLs.length === 1) {
        nextImageBtn.disabled = true;
        prevImageBtn.disabled = true;
    }
    else {
        nextImageBtn.disabled = false;
        prevImageBtn.disabled = false;
    }
}

// Function to get the user's current location
function handleGetCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                // Optionally, you can also update the map marker here
                marker.setLatLng([lat, lng]);
                map.setView([lat, lng], 15);
                updateAddress(lat, lng);
                document.querySelector("input[name='donation[latitude]']").value = lat;
                document.querySelector("input[name='donation[longitude]']").value = lng;
            },
            function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        showAlert(alertTypes.Warning, "Please allow location access to find your current location.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        showAlert(alertTypes.Danger, "Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        showAlert(alertTypes.Warning, "The request to get user location timed out.");
                        break;
                    default:
                        showAlert(alertTypes.Danger, "An unknown error occurred.");
                        break;
                }
            }
        );
    }
    else {
        showAlert(alertTypes.Danger, 'Geolocation is not supported by this browser.');
    }
}

// Function to set the city location based on user input
function handleSetCityLocation(event) {
    const cityName = event.target.value;
    if (!cityName) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                // console.log(`Coordinates for ${cityName}:`, lat, lon);
                document.querySelector("input[name='donation[latitude]']").value = lat;
                document.querySelector("input[name='donation[longitude]']").value = lon;
                map.setView([lat, lon], 12);
                marker.setLatLng([lat, lon]);
                updateAddress(lat, lon);
            }
            else {
                showAlert(alertTypes.Warning, `Can't find location for City - "${cityName}" in maps.`);
            }
        })
        .catch(err => {
            // console.error("Geocoding error:", err);
            // alert("Something went wrong. Try again.");
        });
}

// Function appy js to make filters working
function setDonationFilters() {
    const searchInput = document.getElementById("searchTitleDesc");
    const activeFiltersContainer = document.getElementById("activeFiltersContainer");
    const clearAllBtn = document.querySelector(".clear-all");

    // Friendly names for filters
    const filterNames = {
        searchTitleDesc: "Search",
        foodType: "Food Type",
        foodCondition: "Food Condition",
        source: "Food Source",
        expiryDate: "Expiry Date",
        cookedDate: "Cooked Date",
        minPeopleFed: "Min People Fed",
        maxPeopleFed: "Max People Fed",
        donor: "Donor",
        state: "State",
        city: "City",
        pincode: "Pincode",
    };

    // Store current active filters
    let activeFilters = {};

    // Create a badge span for an active filter
    function createFilterBadge(type, value, id = "") {
        const span = document.createElement("span");
        span.className = "badge bg-secondary text-dark mx-1 d-flex align-items-center";
        span.setAttribute("data-filter-type", type);
        span.setAttribute("data-filter-value", value);
        if (id) span.setAttribute("data-filter-id", id);
        span.style.userSelect = "none";
        span.style.cursor = "default";

        span.innerHTML = `${filterNames[type] || type}: ${value} <i class="bi bi-x ms-2" style="cursor:pointer;"></i>`;
        return span;
    }

    // Update the active filters display area
    function updateActiveFiltersUI() {
        activeFiltersContainer.innerHTML = "";
        for (const [type, val] of Object.entries(activeFilters)) {
            if (Array.isArray(val)) {
                val.forEach(({ value, id }) => {
                    activeFiltersContainer.appendChild(createFilterBadge(type, value, id));
                });
            } else if (val !== "" && val !== null && val !== undefined) {
                activeFiltersContainer.appendChild(createFilterBadge(type, val));
            }
        }
    }

    // Read filters from all inputs and update activeFilters object
    function gatherFilters() {
        activeFilters = {};

        // Search input
        if (searchInput.value.trim() !== "") {
            activeFilters.searchTitleDesc = searchInput.value.trim();
        }

        // Checkboxes: foodType, foodCondition, source, donor (with data-filter-type)
        document.querySelectorAll("input[type=checkbox][data-filter-type]").forEach(chk => {
            if (chk.checked) {
                const type = chk.getAttribute("data-filter-type");
                if (!activeFilters[type]) activeFilters[type] = [];
                activeFilters[type].push({ value: chk.value, id: chk.id });
            }
        });

        // Date inputs
        ["expiryDate", "cookedDate"].forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value) {
                activeFilters[id] = el.value;
            }
        });

        // Number inputs minPeopleFed and maxPeopleFed
        const minPeople = document.getElementById("minPeopleFed")?.value.trim();
        const maxPeople = document.getElementById("maxPeopleFed")?.value.trim();
        if (minPeople) activeFilters.minPeopleFed = minPeople;
        if (maxPeople) activeFilters.maxPeopleFed = maxPeople;

        // Select inputs: state, city
        ["stateFilter", "cityFilter"].forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value) {
                activeFilters[id.replace("Filter", "")] = el.value;
            }
        });

        // Pincode input
        const pincodeInput = document.getElementById("pincodeFilter");
        if (pincodeInput && pincodeInput.value.trim()) {
            activeFilters.pincode = pincodeInput.value.trim();
        }
    }

    // Apply activeFilters back to inputs & checkboxes
    function applyFiltersToInputs() {
        // Clear all inputs first
        searchInput.value = "";
        document.querySelectorAll("input[type=checkbox][data-filter-type]").forEach(chk => (chk.checked = false));
        ["expiryDate", "cookedDate", "minPeopleFed", "maxPeopleFed", "pincodeFilter"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        ["stateFilter", "cityFilter"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        // Set search input
        if (activeFilters.searchTitleDesc) {
            searchInput.value = activeFilters.searchTitleDesc;
        }

        // Set checkboxes
        for (const [type, vals] of Object.entries(activeFilters)) {
            if (Array.isArray(vals)) {
                vals.forEach(({ id }) => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }

        // Set date inputs
        if (activeFilters.expiryDate) document.getElementById("expiryDate").value = activeFilters.expiryDate;
        if (activeFilters.cookedDate) document.getElementById("cookedDate").value = activeFilters.cookedDate;

        // Set number inputs
        if (activeFilters.minPeopleFed) document.getElementById("minPeopleFed").value = activeFilters.minPeopleFed;
        if (activeFilters.maxPeopleFed) document.getElementById("maxPeopleFed").value = activeFilters.maxPeopleFed;

        // Set selects
        if (activeFilters.state) document.getElementById("stateFilter").value = activeFilters.state;
        if (activeFilters.city) document.getElementById("cityFilter").value = activeFilters.city;

        // Set pincode
        if (activeFilters.pincode) document.getElementById("pincodeFilter").value = activeFilters.pincode;
    }

    // Remove a single filter from activeFilters
    function removeFilter(type, value, id = "") {
        if (Array.isArray(activeFilters[type])) {
            activeFilters[type] = activeFilters[type].filter(item => item.value !== value || item.id !== id);
            if (activeFilters[type].length === 0) delete activeFilters[type];
        } else {
            if (activeFilters[type] === value) delete activeFilters[type];
        }
    }

    // Called when any filter input changes
    function filtersChanged() {
        gatherFilters();
        updateActiveFiltersUI();
        applyFiltersToInputs();
        // TODO: Call your filtering function to fetch/display filtered donations here
    }

    // Initial setup
    filtersChanged();

    // Event listeners
    // Search input (with debounce)
    let debounceTimer;
    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filtersChanged, 300);
    });

    // Checkbox, select, date, number inputs
    document.querySelectorAll("input[data-filter-type], select[data-filter-type], #minPeopleFed, #maxPeopleFed").forEach(el => {
        el.addEventListener("change", filtersChanged);
    });

    // Remove single active filter on badge × click
    activeFiltersContainer.addEventListener("click", e => {
        if (e.target.tagName === "I") {
            const span = e.target.parentElement;
            const type = span.getAttribute("data-filter-type");
            const value = span.getAttribute("data-filter-value");
            const id = span.getAttribute("data-filter-id") || "";
            removeFilter(type, value, id);
            updateActiveFiltersUI();
            applyFiltersToInputs();
            // TODO: Call your filtering function here after removal
        }
    });

    // Clear all button
    clearAllBtn.addEventListener("click", () => {
        activeFilters = {};
        updateActiveFiltersUI();
        applyFiltersToInputs();
        // TODO: Call your filtering function here after clearing all
    });
}







/*  ---------------------------  Helper Functions  ---------------------------  */










// Initialize google maps api
// let map, marker, geocoder;

// function initGMap() {
//     const defaultLoc = { lat: 21.5222, lng: 70.4579 };

//     map = new google.maps.Map(document.getElementById("pickupMap"), {
//         center: defaultLoc,
//         zoom: 15,
//     });

//     marker = new google.maps.Marker({
//         position: defaultLoc,
//         map,
//         draggable: true,
//     });

//     geocoder = new google.maps.Geocoder();

//     // When marker is dragged
//     marker.addListener("dragend", () => {
//         const pos = marker.getPosition();
//         getAddressFromCoords(pos.lat(), pos.lng());
//     });

//     // When map is clicked
//     map.addListener("click", (e) => {
//         marker.setPosition(e.latLng);
//         getAddressFromCoords(e.latLng.lat(), e.latLng.lng());
//     });

//     // Get initial address
//     getAddressFromCoords(defaultLoc.lat, defaultLoc.lng);
// }

// function getAddressFromCoords(lat, lng) {
//     const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

//     geocoder.geocode({ location: latlng }, (results, status) => {
//         if (status === "OK" && results[0]) {
//             document.querySelector('input[name="address"]').value = results[0].formatted_address;
//             console.log("Full Address:", results[0].formatted_address);
//         } else {
//             console.warn("Geocoder failed due to: " + status);
//         }
//     });
// }


