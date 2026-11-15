
// =====================================
// 1. LIBRARIAN LOGIN CREDENTIALS
// =====================================

// Demo credentials for our college project
const librarianUsername = "Anshuman";
const librarianPassword = "Library@123";


// =====================================
// 2. GET HTML ELEMENTS
// =====================================

const loginForm = document.getElementById("librarianLoginForm");

const usernameInput =
    document.getElementById("librarianUsername");

const passwordInput =
    document.getElementById("librarianPassword");

const loginMessage =
    document.getElementById("loginMessage");


// =====================================
// 3. CHECK LOGIN DETAILS
// =====================================

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const enteredUsername = usernameInput.value.trim();
    const enteredPassword = passwordInput.value;

    if (
        enteredUsername === librarianUsername &&
        enteredPassword === librarianPassword
    ) {

        // Save librarian login session
        sessionStorage.setItem("librarianLoggedIn", "true");

        // Open librarian dashboard
        window.location.href = "librarian-dashboard.html";

    } else {

        loginMessage.textContent =
            "Incorrect username or password. Please try again.";

        passwordInput.value = "";

    }

});
