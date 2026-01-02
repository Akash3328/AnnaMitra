document.addEventListener('DOMContentLoaded', (e) => {

    console.log('validators loaded');

    //  ==========================  Login page JS  ============================

    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        validateLoginForm(loginForm);
    }



    //  ==========================  Registration page JS  ============================

    // const form = document.querySelector('.register-form');
    const registrationForm = document.getElementById('register-form');
    if (registrationForm) {
        validateRegistrationForm(registrationForm);
    }




    //  ==========================  Forgot & reset password page JS  ============================

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        validateForgetResetForm(forgotPasswordForm);
    }
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        validateForgetResetForm(resetPasswordForm);
    }






    //  ==========================  Donate page JS  ============================

    // Validate the donation form
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
        validateDonationForm(donationForm, 'new');
    }

    const editDonationForm = document.getElementById('edit-donation-form');
    if (editDonationForm) {
        validateDonationForm(editDonationForm, 'edit');
    }

    // Add food item to the donation list in modal form
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        validateItemForm(itemForm, 'new');
    }

    // Edit food item in the donation list
    const editItemForm = document.getElementById('editItemForm');
    if (editItemForm) {
        validateItemForm(editItemForm, 'edit');
    }



    //  ==========================  Donation page JS  ============================




    // Handle request pickup form
    const requestDonationForm = document.getElementById('requestDonationForm');
    if (requestDonationForm) {
        validateRequestDonationForm(requestDonationForm);
    }


});





/*  ---------------------------  Handler Functions  ---------------------------  */




// Function to validate the regisitration form
function validateRegistrationForm(form) {
    console.log("Dynamic registration form detected ✅");

    const showError = (input, message) => {
        input.classList.add("input-error");
        let error = input.parentElement.querySelector(".error-message");
        if (!error) {
            error = document.createElement("div");
            error.className = "error-message text-danger small mt-1";
            input.parentElement.appendChild(error);
        }
        error.textContent = message;
    };

    const showSuccess = (input) => {
        input.classList.remove("input-error");
        const error = input.parentElement.querySelector(".error-message");
        if (error) error.textContent = "";
    };

    const isEmailValid = (email) => {
        const re = /^[a-zA-Z0-9._&-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    };

    const isPasswordSecure = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return re.test(password);
    };

    const isContactValid = (contact) => /^\d{10}$/.test(contact);

    const validateForm = () => {
        let isValid = true;

        // ---------------- Common User Fields ----------------
        const email = form.querySelector("[name='user[email]']");
        const contact = form.querySelector("[name='user[contact]']");
        const password = form.querySelector("[name='user[password]']");
        const confirmPassword = form.querySelector("[name='user[confirmPassword]']");
        const role = form.querySelector("[name='user[role]']").value;

        if (!email.value.trim()) {
            showError(email, "Email is required.");
            isValid = false;
        } else if (!isEmailValid(email.value.trim())) {
            showError(email, "Please enter a valid email address.");
            isValid = false;
        } else {
            showSuccess(email);
        }

        if (!contact.value.trim()) {
            showError(contact, "Contact is required.");
            isValid = false;
        } else if (!isContactValid(contact.value.trim())) {
            showError(contact, "Please enter a valid 10-digit contact number.");
            isValid = false;
        } else {
            showSuccess(contact);
        }

        if (!password.value.trim()) {
            showError(password, "Password is required.");
            isValid = false;
        } else if (!isPasswordSecure(password.value)) {
            showError(
                password,
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
            );
            isValid = false;
        } else {
            showSuccess(password);
        }

        if (!confirmPassword.value.trim()) {
            showError(confirmPassword, "Please confirm your password.");
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            showError(confirmPassword, "Passwords do not match.");
            isValid = false;
        } else {
            showSuccess(confirmPassword);
        }

        // ---------------- Role-Specific Fields ----------------
        if (role === "Donor") {
            const firstName = form.querySelector("[name='donorProfile[firstName]']");
            const lastName = form.querySelector("[name='donorProfile[lastName]']");
            const address = form.querySelector("[name='donorProfile[address]']");
            const city = form.querySelector("[name='donorProfile[city]']");
            const state = form.querySelector("[name='donorProfile[state]']");
            const pincode = form.querySelector("[name='donorProfile[pincode]']");

            if (!firstName.value.trim()) {
                showError(firstName, "First name is required.");
                isValid = false;
            } else showSuccess(firstName);

            if (!lastName.value.trim()) {
                showError(lastName, "Last name is required.");
                isValid = false;
            } else showSuccess(lastName);

            if (!address.value.trim()) {
                showError(address, "Address is required.");
                isValid = false;
            } else if (address.value.length > 300) {
                showError(address, "Address cannot exceed 300 characters.");
                isValid = false;
            } else showSuccess(address);

            if (!city.value.trim()) {
                showError(city, "City is required.");
                isValid = false;
            } else showSuccess(city);

            if (!state.value.trim()) {
                showError(state, "State is required.");
                isValid = false;
            } else showSuccess(state);

            if (!pincode.value.trim()) {
                showError(pincode, "Pincode is required.");
                isValid = false;
            } else showSuccess(pincode);
        }

        if (role === "NGO") {
            const organizationName = form.querySelector("[name='ngoProfile[organizationName]']");
            const registrationNumber = form.querySelector("[name='ngoProfile[registrationNumber]']");
            const registeredUnder = form.querySelector("[name='ngoProfile[registeredUnder]']");
            const documents = form.querySelector("[name='ngoProfile[documents][]']");
            const about = form.querySelector("[name='ngoProfile[about]']");
            const address = form.querySelector("[name='ngoProfile[address]']");
            const city = form.querySelector("[name='ngoProfile[city]']");
            const state = form.querySelector("[name='ngoProfile[state]']");
            const pincode = form.querySelector("[name='ngoProfile[pincode]']");

            if (!organizationName.value.trim()) {
                showError(organizationName, "Organization name is required.");
                isValid = false;
            } else showSuccess(organizationName);

            if (!registrationNumber.value.trim()) {
                showError(registrationNumber, "Registration number is required.");
                isValid = false;
            } else showSuccess(registrationNumber);

            if (!registeredUnder.value.trim()) {
                showError(registeredUnder, "Registered Under is required.");
                isValid = false;
            } else showSuccess(registeredUnder);

            if (!documents || documents.files.length === 0) {
                showError(documents, "At least one document is required.");
                isValid = false;
            } else showSuccess(documents);

            if (!about.value.trim()) {
                showError(about, "About section is required.");
                isValid = false;
            } else if (about.value.length > 1000) {
                showError(about, "About section cannot exceed 1000 characters.");
                isValid = false;
            } else showSuccess(about);

            if (!address.value.trim()) {
                showError(address, "Address is required.");
                isValid = false;
            } else if (address.value.length > 300) {
                showError(address, "Address cannot exceed 300 characters.");
                isValid = false;
            } else showSuccess(address);

            if (!city.value.trim()) {
                showError(city, "City is required.");
                isValid = false;
            } else showSuccess(city);

            if (!state.value.trim()) {
                showError(state, "State is required.");
                isValid = false;
            } else showSuccess(state);

            if (!pincode.value.trim()) {
                showError(pincode, "Pincode is required.");
                isValid = false;
            } else showSuccess(pincode);
        }

        if (role === "Volunteer") {
            const firstName = form.querySelector("[name='volunteerProfile[firstName]']");
            const lastName = form.querySelector("[name='volunteerProfile[lastName]']");
            const address = form.querySelector("[name='volunteerProfile[address]']");
            const city = form.querySelector("[name='volunteerProfile[city]']");
            const state = form.querySelector("[name='volunteerProfile[state]']");
            const pincode = form.querySelector("[name='volunteerProfile[pincode]']");

            if (!firstName.value.trim()) {
                showError(firstName, "First name is required.");
                isValid = false;
            } else showSuccess(firstName);

            if (!lastName.value.trim()) {
                showError(lastName, "Last name is required.");
                isValid = false;
            } else showSuccess(lastName);

            if (!address.value.trim()) {
                showError(address, "Address is required.");
                isValid = false;
            } else if (address.value.length > 300) {
                showError(address, "Address cannot exceed 300 characters.");
                isValid = false;
            } else showSuccess(address);

            if (!city.value.trim()) {
                showError(city, "City is required.");
                isValid = false;
            } else showSuccess(city);

            if (!state.value.trim()) {
                showError(state, "State is required.");
                isValid = false;
            } else showSuccess(state);

            if (!pincode.value.trim()) {
                showError(pincode, "Pincode is required.");
                isValid = false;
            } else showSuccess(pincode);
        }

        return isValid;
    };

    // Form submit listener
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(alertTypes.Danger, "Please fix the errors in the form before submitting.");
        } else {
        registerUser(form);
        }
    });

    // Live validation on input
    form.addEventListener("input", (e) => {
        if (e.target.classList.contains("input-error")) {
            validateForm();
        }
    });
}

// Register user by manually sending POST request to /auth/register
function registerUser(form) {
    const formData = new FormData(form);
    console.log(Object.fromEntries(formData.entries()));
    // const params = new URLSearchParams();
    // for (const [key, value] of formData.entries()) {
    //     params.append(key, value);
    // }

    fetch("/auth/register", {
        method: "POST",
        body: formData,
        // headers: { "Content-Type": "application/x-www-form-urlencoded" },
        // body: params
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                showAlert(alertTypes.Success, data.message || "Registration successful!");
                setTimeout(() => {
                    window.location.href = `/${data.role}/`; // Redirect to home or login page
                }, 1000);
            } else {
                showAlert(alertTypes.Danger, data.message || "Registration failed. Please try again.");
            }
        })
        .catch((err) => {
            console.error("Error during registration:", err);
            showAlert(alertTypes.Danger, "An error occurred. Please try again later.");
        });
}


// Function to validate the login form
function validateLoginForm(form) {
    console.log('Login form found');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const showError = (input, message) => {
        const formGroup = input.parentElement;
        input.classList.add('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = message;
    };

    const showSuccess = (input) => {
        const formGroup = input.parentElement;
        input.classList.remove('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = '';
    };

    const isEmailValid = (email) => {
        const re = /^[a-zA-Z0-9._&-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    };

    const validateForm = () => {
        let isValid = true;

        if (email.value.trim() === '') {
            showError(email, 'Email is required.');
            isValid = false;
        } else if (!isEmailValid(email.value.trim())) {
            showError(email, 'Please enter a valid email address.');
            isValid = false;
        } else {
            showSuccess(email);
        }

        if (password.value.trim() === '') {
            showError(password, 'Password is required.');
            isValid = false;
        } else {
            showSuccess(password);
        }

        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(alertTypes.Danger, 'Please fix the errors in the form before submitting.');
        }
        else {
            loginUser(form); // Call the function to handle form submission
        }
    });

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateForm();
            }
        });
    });
}

// Login user by manually sending POST request to /auth/login
function loginUser(form) {
    const formData = new FormData(form);
    console.log(Object.fromEntries(formData.entries()));
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        params.append(key, value);
    }
    fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            setTimeout(() => {
                window.location.href = `/${data.role}/`; // Redirect to home or dashboard
            }, 1000);
            showAlert(alertTypes.Success, data.message || 'Login successful!');
        } else {
            showAlert(alertTypes.Danger, data.message || 'Login failed. Please try again.');
        }
    })
    .catch(err => {
        console.error('Error during login:', err);
        showAlert(alertTypes.Danger, 'An error occurred. Please try again later.');
    });
}



// Function to validate the forgot and reset password form
function validateForgetResetForm(form) {
    console.log('Form found:', form.id);

    // Inputs
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');
    const cpassword = form.querySelector('#cpassword');

    // Helper functions
    const showError = (input, message) => {
        const formGroup = input.parentElement;
        input.classList.add('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = message;
    };

    const showSuccess = (input) => {
        const formGroup = input.parentElement;
        input.classList.remove('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = '';
    };

    const isEmailValid = (email) => {
        const re = /^[a-zA-Z0-9._&-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    };

    const isPasswordSecure = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return re.test(password);
    };

    const validateForm = () => {
        let isValid = true;

        // Forgot Password form
        if (email) {
            if (email.value.trim() === '') {
                showError(email, 'Email is required.');
                isValid = false;
            } else if (!isEmailValid(email.value.trim())) {
                showError(email, 'Please enter a valid email address.');
                isValid = false;
            } else {
                showSuccess(email);
            }
        }

        // Reset Password form
        if (password) {
            if (password.value.trim() === '') {
                showError(password, 'Password is required.');
                isValid = false;
            } else if (isPasswordSecure(password.value) === false) {
                showError(password, 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
                isValid = false;
            } else {
                showSuccess(password);
            }
        }

        if (cpassword) {
            if (cpassword.value.trim() === '') {
                showError(cpassword, 'Please confirm your password.');
                isValid = false;
            } else if (password && cpassword.value.trim() !== password.value.trim()) {
                showError(cpassword, 'Passwords do not match.');
                isValid = false;
            } else {
                showSuccess(cpassword);
            }
        }

        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(alertTypes.Danger, 'Please fix the errors in the form before submitting.');
        } else {
            if (email) submitForgotPassword(form);
            else submitResetPassword(form);
        }
    });

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateForm();
            }
        });
    });
}

function submitForgotPassword(form) {
    const formData = new FormData(form);
    // console.log(Object.fromEntries(formData.entries()));
    fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries()))  
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showAlert(alertTypes.Success, data.message || 'Password reset link sent to your email.');
            window.location.href = '/auth/login';
        } else {
            showAlert(alertTypes.Danger, data.message || 'Failed to send reset link. Please try again.');
        }
    })
    .catch(err => {
        console.error('Error during forgot password:', err);
        showAlert(alertTypes.Danger, 'An error occurred. Please try again later.');
    });
}

function submitResetPassword(form) {
    const formData = new FormData(form);
    // console.log(Object.fromEntries(formData.entries()));
    let token = window.resetToken;
    if (!token) {
        showAlert(alertTypes.Danger, 'Invalid or missing token. Please try again.');
        return;
    }
    fetch(`/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries()))  
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showAlert(alertTypes.Success, data.message || 'Password has been reset successfully.');
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 2000);
        } else {
            showAlert(alertTypes.Danger, data.message || 'Failed to reset password. Please try again.');
        }
    })
    .catch(err => {
        console.error('Error during reset password:', err);
        showAlert(alertTypes.Danger, 'An error occurred. Please try again later.');
    });
}





// Function to handle the donation form submission
function validateDonationForm(donationForm, action) {
    console.log('Donation form found');

    const donationImages = donationForm.querySelector('[name="donation[images[]]"]');

    const showError = (input, message) => {
        const formGroup = input.closest('div');
        input.classList.add('input-error');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) errorDiv.textContent = message;
    };

    const showSuccess = (input) => {
        const formGroup = input.closest('div');
        input.classList.remove('input-error');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) errorDiv.textContent = '';
    };

    const isEmailValid = email =>
        /^[a-zA-Z0-9._&-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email.trim());

    const isPhoneValid = phone => /^\d{10}$/.test(phone.trim());

    const isPincodeValid = pincode => /^\d{6}$/.test(pincode.trim());

    const validateForm = () => {
        let isValid = true;

        const requiredFields = [
            'donation[title]', 'donation[source]', 'donation[numberOfPeopleFed]', 'donation[address]', 'donation[city]',
            'donation[state]', 'donation[pincode]', 'donation[personName]', 'donation[contact]', 'donation[email]'
        ];

        requiredFields.forEach(name => {
            const input = donationForm.querySelector(`[name="${name}"]`);
            if (!input || input.disabled) return;

            if (input.value.trim() === '' || input.value === null) {
                showError(input, 'This field is required.');
                isValid = false;
            } else {
                showSuccess(input);
            }
        });

        const emailInput = donationForm.querySelector('[name="donation[email]"]');
        if (emailInput && emailInput.value && !isEmailValid(emailInput.value)) {
            showError(emailInput, 'Invalid email address.');
            isValid = false;
        }

        const phoneInput = donationForm.querySelector('[name="donation[contact]"]');
        if (phoneInput && phoneInput.value && !isPhoneValid(phoneInput.value)) {
            showError(phoneInput, 'Enter a valid 10-digit contact number.');
            isValid = false;
        }

        const pincodeInput = donationForm.querySelector('[name="donation[pincode]"]');
        if (pincodeInput && pincodeInput.value && !isPincodeValid(pincodeInput.value)) {
            showError(pincodeInput, 'Enter a valid 6-digit pincode.');
            isValid = false;
        }

        if (foodItems.length === 0) {
            showError(donationForm.querySelector('[name="foodItems"]'), 'At least one food item is required.');
            isValid = false;
        }

        if (donationImages && donationImages.files.length > 0 && donationImages.files.length <= 5) {
            showSuccess(donationImages);
            const invalidFiles = [...donationImages.files].filter(file => !file.type.startsWith('image/'));
            if (invalidFiles.length > 0) {
                showError(donationImages, 'Only image files are allowed.');
                isValid = false;
            } else {
                showSuccess(donationImages);
            }
        } else if (action === 'new') {
            showError(donationImages, 'Select 1 to 5 images.');
            isValid = false;
        }

        return isValid;
    };

    donationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(alertTypes.Danger || 'danger', 'Please fix the errors before submitting.');
        }
        else {
            handleSubmitFoodDonataionForm(e, donationForm, action); // Call the function to handle form submission
        }
    });

    donationForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateForm();
            }
        });
    });
}

function handleSubmitFoodDonataionForm(e, donationForm, action) {
    const formData = new FormData(donationForm);
    const donationImageFiles = donationForm.querySelector('input[name="donation[images[]]"]').files;
    let path = "";
    if (action === 'new') {
        path = "/donations/";
    }
    else if (action === 'edit') {
        path = `/donations/${formData.get('donationId')}?_method=PUT`;
    }

    // Append each food item as nested fields
    foodItems.forEach((item, index) => {
        formData.append(`foodItems[${index}][name]`, item.name);
        formData.append(`foodItems[${index}][quantity]`, item.quantity);
        formData.append(`foodItems[${index}][unit]`, item.unit);
        formData.append(`foodItems[${index}][type]`, item.type);
        formData.append(`foodItems[${index}][condition]`, item.condition);
        formData.append(`foodItems[${index}][cookedDate]`, item.cookedDate);
        formData.append(`foodItems[${index}][cookedTime]`, item.cookedTime);
        formData.append(`foodItems[${index}][expiryDate]`, item.expiryDate);
        formData.append(`foodItems[${index}][expiryTime]`, item.expiryTime);

        // Add images for this item
        if (item.itemImageFiles && item.itemImageFiles.length > 0) {
            item.itemImageFiles.forEach((file, j) => {
                formData.append(`foodItems[${index}][itemImages][${j}]`, file);
            });
            if (action === 'edit') {
                oldItemImages[index].forEach((image, j) => {
                    formData.append(`foodItems[${index}][oldItemImages][${j}]`, image);
                });
            }
        }
        else if (action === 'edit') {
            item.itemImages.forEach((image, j) => {
                formData.append(`foodItems[${index}][itemImages][${j}]`, image);
            });
        }
    });

    if (action === 'edit') {
        if (donationImageFiles.length !== 0) {
            // If editing and new images selected, append old images if any
            const oldDonationImages = window.oldDonationImages || [];
            oldDonationImages.forEach((image, i) => {
                formData.append(`donation[oldDonationImages][${i}]`, image);
            });
        }
        else {
            // If editing and no new images, append old images as donation images if any
            const oldDonationImages = window.oldDonationImages || [];
            oldDonationImages.forEach((image, i) => {
                formData.append(`donation[images][${i}]`, image);
            });
        }
    }

    console.log(Object.fromEntries(formData.entries()));

    // Send via fetch to your route
    fetch(path, {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = `/donations/${data.donationId}`;
            }
            else {
                if (action === 'new') {
                    showAlert(alertTypes.Danger, data.message || 'Failed to submit donation. Please try again.');
                }
                else if (action === 'edit') {
                    showAlert(alertTypes.Danger, data.message || 'Failed to edit donation. Please try again.');
                }
            }
        })
        .catch(err => {
            if (action === 'new') {
                showAlert(alertTypes.Danger, 'Submission failed.');
            }
            else if (action === 'edit') {
                showAlert(alertTypes.Danger, 'Edit failed.');
            }
            console.error(err);
        });
}




// Function to validate the item form
function validateItemForm(form, action) {
    const name = form.querySelector('[name="item[name]"]');
    const quantity = form.querySelector('[name="item[quantity]"]');
    const unit = form.querySelector('[name="item[unit]"]');
    const type = form.querySelector('[name="item[type]"]');
    const condition = form.querySelector('[name="item[condition]"]');
    const expiryDate = form.querySelector('[name="item[expiryDate]"]');
    const expiryTime = form.querySelector('[name="item[expiryTime]"]');
    const cookedDate = form.querySelector('[name="item[cookedDate]"]');
    const cookedTime = form.querySelector('[name="item[cookedTime]"]');
    const itemImages = form.querySelector('[name="item[images[]]"]');

    const showError = (input, message) => {
        const formGroup = input.closest('.mb-4') || input.parentElement;
        input.classList.add('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = message;
    };

    const showSuccess = (input) => {
        const formGroup = input.closest('.mb-4') || input.parentElement;
        input.classList.remove('input-error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.textContent = '';
    };

    const validateForm = () => {
        let isValid = true;

        if (!name.value.trim()) {
            showError(name, 'Item name is required.');
            isValid = false;
        } else {
            showSuccess(name);
        }

        if (!quantity.value || isNaN(quantity.value) || Number(quantity.value) <= 0) {
            showError(quantity, 'Enter a valid quantity.');
            isValid = false;
        } else {
            showSuccess(quantity);
        }

        if (!unit.value) {
            showError(unit, 'Select a unit.');
            isValid = false;
        } else {
            showSuccess(unit);
        }

        if (!type.value) {
            showError(type, 'Select a food type.');
            isValid = false;
        } else {
            showSuccess(type);
        }

        if (!condition.value) {
            showError(condition, 'Select the condition.');
            isValid = false;
        } else {
            showSuccess(condition);
        }

        if (!cookedDate.value) {
            showError(cookedDate, 'Cooked date is required.');
            isValid = false;
        } else {
            showSuccess(cookedDate);
        }

        if (!cookedTime.value) {
            showError(cookedTime, 'Cooked time is required.');
            isValid = false;
        } else {
            showSuccess(cookedTime);
        }

        // Optional but still validate format if provided
        if (expiryDate.value && !/^\d{4}-\d{2}-\d{2}$/.test(expiryDate.value)) {
            showError(expiryDate, 'Invalid expiry date format.');
            isValid = false;
        } else {
            showSuccess(expiryDate);
        }

        if (expiryTime.value && !/^\d{2}:\d{2}$/.test(expiryTime.value)) {
            showError(expiryTime, 'Invalid expiry time format.');
            isValid = false;
        } else {
            showSuccess(expiryTime);
        }

        // Optional: file type check (image)
        if (itemImages && itemImages.files.length > 0 && itemImages.files.length <= 3) {
            showSuccess(itemImages);
            const invalidFiles = [...itemImages.files].filter(file => !file.type.startsWith('image/'));
            if (invalidFiles.length > 0) {
                showError(itemImages, 'Only image files are allowed.');
                isValid = false;
            } else {
                showSuccess(itemImages);
            }
        } else if (action === 'new') {
            showError(itemImages, 'Select 1 to 3 images.');
            isValid = false;
        }

        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(alertTypes.Danger, 'Please fix the errors in the item form.');
        } else {
            if (action === 'new') {
                handleNewFoodItem(e); // Call the handler to add the item
            }
            else if (action === 'edit') {
                handleEditFoodItem(e); // Call the handler to edit the item
            }
        }
    });

    // Re-validate on input change
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateForm();
            }
        });
    });
}

// Handler for adding a new food item to the donation list
function handleNewFoodItem(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    if (foodItems.length === 0) {
        itemsTable.lastElementChild.innerHTML = ''
    }

    const formData = new FormData(itemForm);
    let rawDetails = Object.fromEntries(formData.entries());
    let itemDetails = {
        name: rawDetails['item[name]'],
        quantity: rawDetails['item[quantity]'],
        unit: rawDetails['item[unit]'],
        type: rawDetails['item[type]'],
        condition: rawDetails['item[condition]'],
        expiryDate: rawDetails['item[expiryDate]'],
        expiryTime: rawDetails['item[expiryTime]'],
        cookedDate: rawDetails['item[cookedDate]'],
        cookedTime: rawDetails['item[cookedTime]'],
        // images handled separately
    };
    itemDetails.itemImages = selectedItemImages;
    const imageFiles = itemForm.querySelector('input[name="item[images[]]"]').files;
    itemDetails.itemImageFiles = Array.from(imageFiles); // store File objects, not blob URLs
    foodItems.push(itemDetails);
    // console.log(itemDetails);

    event.target.reset(); // Reset the form after submission
    event.target.querySelector('.imagesPreview').innerHTML = ''; // Clear image previews
    selectedItemImages = []; // Clear the selected images array
    handleTableInsert(); // Update the items table with the new item
    showAlert(alertTypes.Success, 'Food item added successfully!');

    const foodItemsError = document.querySelector('input[name="foodItems"]').closest('div').querySelector('.error-message');
    if (foodItemsError) {
        foodItemsError.innerText = '';
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('new-item-modal'));
    modal.hide();
}

// Function to insert a new row in the items table
function handleTableInsert() {
    const item = foodItems[foodItems.length - 1]; // Get the last added item
    const row = document.createElement('tr');
    let expDT = `${item.expiryDate} - ${item.expiryTime}`;
    if (item.expiryDate === '' && item.expiryTime === '') {
        expDT = 'N/A';
    }
    let imgHTML = 'N/A';
    if (item.itemImages.length > 0) {
        imgHTML = `
                <div class="border rounded p-1" style="max-width: 100px;">
                    <img src="${item.itemImages[0]}" alt="food item" class="img-fluid">
                    <div class="text-center hover-blue" data-bs-toggle="modal" data-bs-target="#images-modal">View all</div>
                </div>`;
    }
    row.innerHTML = `
            <td>${foodItems.length}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.condition}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td>${item.cookedDate} - ${item.cookedTime}</td>
            <td>${expDT}</td>
            <td>${imgHTML}</td>
            <td class="text-center align-middle">
                <!-- Edit Button -->
                <button class="btn btn-outline-primary btn-sm me-1" type="button"
                    data-bs-toggle="modal" data-bs-target="#edit-item-modal" data-bs-placement="top" title="Edit this item">
                    <i class="fas fa-pen"></i>
                </button>

                <!-- Delete Button -->
                <button class="btn btn-outline-danger btn-sm" type="button"
                    data-bs-toggle="tooltip" data-bs-placement="top" title="Delete this item">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>

        `;
    itemsTable.lastElementChild.appendChild(row);
}

// Function to handle the edit food item form submission
function handleEditFoodItem(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    console.log('Editing item...');

    const form = event.target;
    const itemIndex = parseInt(form.dataset.index); // Get the index of the item being edited
    let rawDetails = Object.fromEntries(new FormData(form).entries());
    let updatedItem = {
        name: rawDetails['item[name]'],
        quantity: rawDetails['item[quantity]'],
        unit: rawDetails['item[unit]'],
        type: rawDetails['item[type]'],
        condition: rawDetails['item[condition]'],
        expiryDate: rawDetails['item[expiryDate]'],
        expiryTime: rawDetails['item[expiryTime]'],
        cookedDate: rawDetails['item[cookedDate]'],
        cookedTime: rawDetails['item[cookedTime]'],
        // images handled separately
    };

    const imageFiles = form.querySelector('input[name="item[images[]]"]').files;
    if (imageFiles.length === 0) {
        updatedItem['itemImages'] = foodItems[itemIndex].itemImages; // Keep existing images if no new ones
    }
    else {
        updatedItem['itemImages'] = selectedItemImages;
        updatedItem['itemImageFiles'] = Array.from(imageFiles);
    }

    updatedItem['quantity'] = parseInt(updatedItem['quantity']);
    foodItems[itemIndex] = updatedItem; // Update the foodItems array

    // Update the table row
    const itemsTable = document.getElementById('itemsTable');
    console.log(itemsTable);
    const row = itemsTable.rows[itemIndex + 1]; // Adjust for header row
    console.log(updatedItem);

    row.cells[1].innerText = updatedItem.name;
    row.cells[2].innerText = updatedItem.type;
    row.cells[3].innerText = updatedItem.condition;
    row.cells[4].innerText = `${updatedItem.quantity} ${updatedItem.unit}`;
    row.cells[5].innerText = `${updatedItem.cookedDate} - ${updatedItem.cookedTime}`;
    if (updatedItem.expiryDate || updatedItem.expiryTime) {
        row.cells[6].innerText = `${updatedItem.expiryDate} - ${updatedItem.expiryTime}`;
    }
    else {
        row.cells[6].innerText = 'N/A';
    }

    let imgHTML = 'N/A';
    if (updatedItem.itemImages.length > 0) {
        imgHTML = `
                <div class="border rounded p-1" style="max-width: 100px;">
                    <img src="${updatedItem.itemImages[0]}" alt="food item" class="img-fluid">
                    <div class="text-center hover-blue" data-bs-toggle="modal" data-bs-target="#images-modal">View all</div>
                </div>
            `;
    }
    row.cells[7].innerHTML = imgHTML;

    event.target.reset(); // Reset the form after submission
    event.target.querySelector('.imagesPreview').innerHTML = ''; // Clear image previews
    selectedItemImages = []; // Clear the selected images array
    showAlert(alertTypes.Success, 'Food item updated successfully!');

    const modal = bootstrap.Modal.getInstance(document.getElementById('edit-item-modal'));
    modal.hide();
}




// Function to validate donation request form
function validateRequestDonationForm(form) {
    function validateForm() {
        const messageInput = form.querySelector("#message");
        const errorId = "messageError";

        // remove existing error if any
        let oldError = document.getElementById(errorId);
        if (oldError) oldError.remove();

        const message = messageInput.value.trim();

        function showError(inputEl, msg, errorId) {
            const error = document.createElement("div");
            error.id = errorId;
            error.className = "text-danger mt-1 small";
            error.textContent = msg;
            inputEl.insertAdjacentElement("afterend", error);
        }

        // Validation checks
        if (message.length === 0) {
            showError(messageInput, "Message cannot be empty.", errorId);
            return false;
        }

        if (message.length > 500) {
            showError(messageInput, "Message cannot exceed 500 words.", errorId);
            return false;
        }

        return true;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateForm()) {
            submitRequestDonationForm(form);
        } else {
            showAlert(alertTypes.Danger, "Please fix the errors in the form.");
        }
    });
}

// Function to handle the request donation form submission
async function submitRequestDonationForm(form) {
    const donationId = document.getElementById("donationId").value;
    const donorId = document.getElementById("donorId").value;
    const message = document.getElementById("message").value;

    try {
        // POST request
        const response = await fetch(`/donations/${donationId}/requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ donationId, donorId, message })
        });

        const result = await response.json();

        if (result.success) {
            showAlert(alertTypes.Success, result.message);
            form.reset();

            const modal = bootstrap.Modal.getInstance(document.getElementById("requestDonationModal"));
            modal.hide();

            // Change the "Request Pickup" button to "Requested" with a right icon and disable modal opening
            const requestPickupBtn = document.getElementById("requestPickupBtn");
            if (requestPickupBtn) {
                requestPickupBtn.innerHTML = '<i class="bi bi-check2-circle me-1"></i>Requested';
                requestPickupBtn.classList.remove('btn-outline-warning');
                requestPickupBtn.classList.add('btn-success');
                requestPickupBtn.removeAttribute('data-bs-toggle');
                requestPickupBtn.removeAttribute('data-bs-target');
                requestPickupBtn.disabled = true; // Optionally disable the button
            }
        } else {
            showAlert(alertTypes.Danger, result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        showAlert(alertTypes.Danger, "Failed to send request. Please try again later.");
    }
}

