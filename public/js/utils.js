
document.addEventListener("DOMContentLoaded", function () {
    const formStep = document.getElementById("register-form");
    if (formStep) {
        renderForm();
    }
});





/*  ---------------------------  Utility Functions  ---------------------------  */



// Show alert with a timer bar
let alertTypes = {
    'Primary': 'primary',
    'Secondary': 'secondary',
    'Success': 'success',
    'Danger': 'danger',
    'Warning': 'warning',
    'Info': 'info',
};

let alertTimeout = null;
function showAlert(type = 'info', message = 'This is a message') {
    const alertContainer = document.getElementById('alertContainer');

    // Remove existing alert if any
    alertContainer.innerHTML = '';

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show shadow-sm border rounded mx-auto`;
    alert.style.position = 'relative';

    alert.innerHTML = `${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    <div class="progress-timer position-absolute bottom-0 start-0" style="height: 4px; background: rgba(0,0,0,0.15); width: 100%;"></div>`;
    alertContainer.appendChild(alert);

    // Animate the timer bar
    const timerBar = alert.querySelector('.progress-timer');
    timerBar.animate([
        { width: '100%' },
        { width: '0%' }
    ], {
        duration: 5000,
        easing: 'linear',
        fill: 'forwards'
    });

    // Auto-remove after 5 seconds
    alertTimeout = setTimeout(() => {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
        bsAlert.close();
    }, 5000);

    // If closed manually, clear the timeout
    alert.querySelector('.btn-close').addEventListener('click', () => {
        clearTimeout(alertTimeout);
    });
}


function logoutUser() {
    fetch('/auth/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', data.message);
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 700);
        } else {
            showAlert('danger', data.message || 'Logout failed.');
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
        showAlert('danger', 'An error occurred during logout.');
    });
}


// Generate dynamic registration form
function renderForm() {
    const roleSelect = document.getElementById("roleSelect");
    const nextBtn = document.getElementById("nextBtn");
    const roleStep = document.getElementById("role-step");
    const formStep = document.getElementById("register-form");
    const dynamicFields = document.getElementById("dynamic-fields");
    const changeRole = document.getElementById("changeRole");

    // Enable next button when role is selected
    roleSelect.addEventListener("change", () => {
        nextBtn.disabled = !roleSelect.value;
    });

    // Role-based fields
    const roleForms = {
        Donor: `
            <h5 class="mb-3 text-white">Donor Registration</h5>
            <input type="hidden" name="user[role]" value="Donor">

            <div class="mb-3">
                <label for="donor-firstName" class="form-label text-white">First Name</label>
                <input id="donor-firstName" class="form-control login-input" type="text" 
                       name="donorProfile[firstName]" placeholder="Enter your first name">
            </div>
            <div class="mb-3">
                <label for="donor-lastName" class="form-label text-white">Last Name</label>
                <input id="donor-lastName" class="form-control login-input" type="text" 
                       name="donorProfile[lastName]" placeholder="Enter your last name">
            </div>
            <div class="mb-3">
                <label for="donor-address" class="form-label text-white">Address</label>
                <textarea id="donor-address" class="form-control login-input" 
                          name="donorProfile[address]" placeholder="Enter your address"></textarea>
            </div>
            <div class="mb-3">
                <label for="donor-city" class="form-label text-white">City</label>
                <input id="donor-city" class="form-control login-input" type="text" 
                       name="donorProfile[city]" placeholder="City">
            </div>
            <div class="mb-3">
                <label for="donor-state" class="form-label text-white">State</label>
                <input id="donor-state" class="form-control login-input" type="text" 
                       name="donorProfile[state]" placeholder="State">
            </div>
            <div class="mb-3">
                <label for="donor-pincode" class="form-label text-white">Pincode</label>
                <input id="donor-pincode" class="form-control login-input" type="text" 
                       name="donorProfile[pincode]" placeholder="Pincode">
            </div>
        `,
        NGO: `
            <h5 class="mb-3 text-white">NGO Registration</h5>
            <input type="hidden" name="user[role]" value="NGO">

            <div class="mb-3">
                <label for="ngo-orgName" class="form-label text-white">Organization Name</label>
                <input id="ngo-orgName" class="form-control login-input" type="text" 
                       name="ngoProfile[organizationName]" placeholder="Organization Name">
            </div>
            <div class="mb-3">
                <label for="ngo-regNumber" class="form-label text-white">Registration Number</label>
                <input id="ngo-regNumber" class="form-control login-input" type="text" 
                       name="ngoProfile[registrationNumber]" placeholder="Registration Number">
            </div>
            <div class="mb-3">
                <label for="ngo-registeredUnder" class="form-label text-white">Registered Under</label>
                <input id="ngo-registeredUnder" class="form-control login-input" type="text" 
                       name="ngoProfile[registeredUnder]" placeholder="Registered Under">
            </div>
            <div class="mb-3">
                <label for="ngo-documents" class="form-label text-white">NGO Legal documents</label>
                <input id="ngo-documents" class="form-control login-input" type="file" multiple
                       name="ngoProfile[documents][]" placeholder="Upload Verification Documents">
            </div>
            <div class="mb-3">
                <label for="ngo-about" class="form-label text-white">About NGO</label>
                <textarea id="ngo-about" class="form-control login-input" 
                          name="ngoProfile[about]" placeholder="Write about your NGO"></textarea>
            </div>
            <div class="mb-3">
                <label for="ngo-address" class="form-label text-white">Address</label>
                <textarea id="ngo-address" class="form-control login-input" 
                          name="ngoProfile[address]" placeholder="Address"></textarea>
            </div>
            <div class="mb-3">
                <label for="ngo-city" class="form-label text-white">City</label>
                <input id="ngo-city" class="form-control login-input" type="text" 
                       name="ngoProfile[city]" placeholder="City">
            </div>
            <div class="mb-3">
                <label for="ngo-state" class="form-label text-white">State</label>
                <input id="ngo-state" class="form-control login-input" type="text" 
                       name="ngoProfile[state]" placeholder="State">
            </div>
            <div class="mb-3">
                <label for="ngo-pincode" class="form-label text-white">Pincode</label>
                <input id="ngo-pincode" class="form-control login-input" type="text" 
                       name="ngoProfile[pincode]" placeholder="Pincode">
            </div>
        `,
        Volunteer: `
            <h5 class="mb-3 text-white">Volunteer Registration</h5>
            <input type="hidden" name="user[role]" value="Volunteer">

            <div class="mb-3">
                <label for="vol-firstName" class="form-label text-white">First Name</label>
                <input id="vol-firstName" class="form-control login-input" type="text" 
                       name="volunteerProfile[firstName]" placeholder="First Name">
            </div>
            <div class="mb-3">
                <label for="vol-lastName" class="form-label text-white">Last Name</label>
                <input id="vol-lastName" class="form-control login-input" type="text" 
                       name="volunteerProfile[lastName]" placeholder="Last Name">
            </div>
            <div class="mb-3">
                <label for="vol-address" class="form-label text-white">Address</label>
                <textarea id="vol-address" class="form-control login-input" 
                          name="volunteerProfile[address]" placeholder="Address"></textarea>
            </div>
            <div class="mb-3">
                <label for="vol-city" class="form-label text-white">City</label>
                <input id="vol-city" class="form-control login-input" type="text" 
                       name="volunteerProfile[city]" placeholder="City">
            </div>
            <div class="mb-3">
                <label for="vol-state" class="form-label text-white">State</label>
                <input id="vol-state" class="form-control login-input" type="text" 
                       name="volunteerProfile[state]" placeholder="State">
            </div>
            <div class="mb-3">
                <label for="vol-pincode" class="form-label text-white">Pincode</label>
                <input id="vol-pincode" class="form-control login-input" type="text" 
                       name="volunteerProfile[pincode]" placeholder="Pincode">
            </div>
        `
    };

    // Common fields for all users
    const commonFields = `
        <h5 class="mb-3 text-white">Account Information</h5>
        <div class="mb-3">
            <label for="user-email" class="form-label text-white">Email</label>
            <input id="user-email" class="form-control login-input" type="email" 
                   name="user[email]" placeholder="Email">
        </div>
        <div class="mb-3">
            <label for="user-contact" class="form-label text-white">Contact</label>
            <input id="user-contact" class="form-control login-input" type="tel" 
                   name="user[contact]" placeholder="Contact">
        </div>
        <div class="mb-3">
            <label for="user-password" class="form-label text-white">Password</label>
            <input id="user-password" class="form-control login-input" type="password" 
                   name="user[password]" placeholder="Password">
        </div>
        <div class="mb-3">
            <label for="user-confirmPassword" class="form-label text-white">Confirm Password</label>
            <input id="user-confirmPassword" class="form-control login-input" type="password" 
                   name="user[confirmPassword]" placeholder="Confirm Password">
        </div>
    `;

    // On Next → build form dynamically
    nextBtn.addEventListener("click", function () {
        const role = roleSelect.value;
        if (!role) return;

        // Build fields
        dynamicFields.innerHTML = roleForms[role] + commonFields;

        // Toggle steps
        roleStep.style.display = "none";
        formStep.style.display = "block";
    });

    // Change role → go back to role selection
    changeRole.addEventListener("click", function (e) {
        e.preventDefault();
        formStep.style.display = "none";
        roleStep.style.display = "block";
        dynamicFields.innerHTML = "";
        roleSelect.value = "";
        nextBtn.disabled = true;
    });
}
