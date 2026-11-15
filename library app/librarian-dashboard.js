
// 1. Check librarian login
if (sessionStorage.getItem("librarianLoggedIn") !== "true") {
    window.location.href = "librarian-login.html";
}

// 2. Get dashboard elements
const requestContainer = document.getElementById("requestContainer");
const logoutBtn = document.getElementById("logoutBtn");

// 3. Get reservations from localStorage
function getReservations() {
    return JSON.parse(localStorage.getItem("reservations")) || [];
}

// 4. Save updated reservations
function saveReservations(reservations) {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

// 5. Check whether approved reservations have expired
function checkExpiredReservations() {
    const reservations = getReservations();
    const currentTime = Date.now();

    reservations.forEach(function(reservation) {
        if (
            reservation.status === "Approved" &&
            reservation.pickupDeadline &&
            currentTime >= reservation.pickupDeadline
        ) {
            reservation.status = "Expired";
        }
    });

    saveReservations(reservations);
}

// 6. Approve a reservation
function approveReservation(reservationId) {
    const reservations = getReservations();

    const reservation = reservations.find(function(item) {
        return item.reservationId === reservationId;
    });

    if (reservation && reservation.status === "Pending") {
        const currentTime = Date.now();

        reservation.status = "Approved";
        reservation.approvedAt = currentTime;

        // 30 minutes after librarian approval
        reservation.pickupDeadline = currentTime + (30 * 60 * 1000);

        saveReservations(reservations);
        displayRequests();

        alert("Reservation approved! Student has 30 minutes to collect the book.");
    }
}

// 7. Reject a reservation
function rejectReservation(reservationId) {
    const reservations = getReservations();

    const reservation = reservations.find(function(item) {
        return item.reservationId === reservationId;
    });

    if (reservation && reservation.status === "Pending") {
        reservation.status = "Rejected";

        saveReservations(reservations);
        displayRequests();
    }
}

// 8. Mark book as collected
function markAsCollected(reservationId) {
    const reservations = getReservations();

    const reservation = reservations.find(function(item) {
        return item.reservationId === reservationId;
    });

    if (reservation && reservation.status === "Approved") {
        if (Date.now() >= reservation.pickupDeadline) {
            reservation.status = "Expired";
            saveReservations(reservations);
            displayRequests();

            alert("The 30-minute collection deadline has passed.");
            return;
        }

        reservation.status = "Collected";
        reservation.collectedAt = Date.now();

        saveReservations(reservations);
        displayRequests();
    }
}

// 9. Display reservation requests
function displayRequests() {
    checkExpiredReservations();

    const reservations = getReservations();

    requestContainer.innerHTML = "";

    if (reservations.length === 0) {
        requestContainer.innerHTML =
            "<p>No reservation requests yet.</p>";
        return;
    }

    reservations.forEach(function(reservation) {
        const card = document.createElement("div");
        card.className = "request-card";

        let deadlineText = "";

        if (reservation.status === "Approved") {
            deadlineText =
                "<p><strong>Collect before:</strong> " +
                new Date(reservation.pickupDeadline).toLocaleString() +
                "</p>";
        }

        let actionButtons = "";

        if (reservation.status === "Pending") {
            actionButtons = `
                <button class="approve-btn"
                    onclick="approveReservation(${reservation.reservationId})">
                    Approve
                </button>

                <button class="reject-btn"
                    onclick="rejectReservation(${reservation.reservationId})">
                    Reject
                </button>
            `;
        } else if (reservation.status === "Approved") {
            actionButtons = `
                <button class="collect-btn"
                    onclick="markAsCollected(${reservation.reservationId})">
                    Mark as Collected
                </button>
            `;
        }

        card.innerHTML = `
            <h3>${reservation.title}</h3>

            <p><strong>Student:</strong> ${reservation.studentName}</p>
            <p><strong>Student ID:</strong> ${reservation.studentId}</p>
            <p><strong>Category:</strong> ${reservation.category}</p>
            <p><strong>Request Date:</strong>
                ${new Date(reservation.requestedAt).toLocaleString()}
            </p>

            <p class="status">
                <strong>Status:</strong> ${reservation.status}
            </p>

            ${deadlineText}

            <div class="request-actions">
                ${actionButtons}
            </div>
        `;

        requestContainer.appendChild(card);
    });
}

// 10. Librarian logout
logoutBtn.addEventListener("click", function() {
    sessionStorage.removeItem("librarianLoggedIn");
    window.location.href = "librarian-login.html";
});

// 11. Load dashboard
displayRequests();

// Refresh expiry checks every 10 seconds
setInterval(displayRequests, 10000);
