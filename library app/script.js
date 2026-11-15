
// =====================================
// 1. SAMPLE BOOK COLLECTION
// =====================================

const books = [
    {
        id: 1,
        title: "Python Programming",
        author: "Reema Thareja",
        category: "Programming"
    },
    {
        id: 2,
        title: "Java: The Complete Reference",
        author: "Herbert Schildt",
        category: "Programming"
    },
    {
        id: 3,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Programming"
    },
    {
        id: 4,
        title: "Engineering Mathematics",
        author: "B. S. Grewal",
        category: "Mathematics"
    },
    {
        id: 5,
        title: "Higher Engineering Mathematics",
        author: "B. V. Ramana",
        category: "Mathematics"
    },
    {
        id: 6,
        title: "Concepts of Physics",
        author: "H. C. Verma",
        category: "Physics"
    },
    {
        id: 7,
        title: "Fundamentals of Physics",
        author: "Halliday and Resnick",
        category: "Physics"
    },
    {
        id: 8,
        title: "Engineering Chemistry",
        author: "Jain and Jain",
        category: "Chemistry"
    }
];


// =====================================
// 2. GET HTML ELEMENTS
// =====================================

const loginSection = document.getElementById("loginSection");
const mainContent = document.getElementById("mainContent");

const studentLoginForm = document.getElementById("studentLoginForm");
const studentNameInput = document.getElementById("studentName");
const studentIdInput = document.getElementById("studentId");

const loginMessage = document.getElementById("loginMessage");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const bookContainer = document.getElementById("bookContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const reservationContainer =
    document.getElementById("reservationContainer");

const categoryButtons =
    document.querySelectorAll(".category-btn");


// =====================================
// 3. CURRENT STUDENT
// =====================================

let currentStudent =
    JSON.parse(localStorage.getItem("currentStudent")) || null;


// =====================================
// 4. STUDENT LOGIN
// =====================================

function updateLoginScreen() {

    if (currentStudent) {

        loginSection.hidden = true;
        mainContent.hidden = false;

        loginBtn.hidden = true;
        logoutBtn.hidden = false;

        displayBooks(books);
        displayReservations();

    } else {

        loginSection.hidden = false;
        mainContent.hidden = true;

        loginBtn.hidden = false;
        logoutBtn.hidden = true;
    }
}


studentLoginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const studentName = studentNameInput.value.trim();
    const studentId = studentIdInput.value.trim();

    if (!studentName || !studentId) {
        loginMessage.textContent = "Please enter your details.";
        return;
    }

    currentStudent = {
        name: studentName,
        studentId: studentId
    };

    localStorage.setItem(
        "currentStudent",
        JSON.stringify(currentStudent)
    );

    studentLoginForm.reset();

    loginMessage.textContent = "";

    updateLoginScreen();
});


// =====================================
// 5. STUDENT LOGOUT
// =====================================

logoutBtn.addEventListener("click", function() {

    currentStudent = null;

    localStorage.removeItem("currentStudent");

    updateLoginScreen();
});


// =====================================
// 6. DISPLAY BOOKS
// =====================================

function displayBooks(bookList) {

    bookContainer.innerHTML = "";

    if (bookList.length === 0) {
        bookContainer.innerHTML = "<p>No books found.</p>";
        return;
    }

    bookList.forEach(function(book) {

        const card = document.createElement("div");

        card.className = "book-card";

        card.innerHTML = `
            <h3>${book.title}</h3>

            <p><strong>Author:</strong> ${book.author}</p>

            <p><strong>Category:</strong> ${book.category}</p>

            <button onclick="reserveBook(${book.id})">
                Reserve Book
            </button>
        `;

        bookContainer.appendChild(card);

    });
}


// =====================================
// 7. SEARCH BOOKS
// =====================================

function searchBooks() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const filteredBooks = books.filter(function(book) {

        return (
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText) ||
            book.category.toLowerCase().includes(searchText)
        );

    });

    displayBooks(filteredBooks);
}

searchBtn.addEventListener("click", searchBooks);

searchInput.addEventListener("input", searchBooks);


// =====================================
// 8. CATEGORY FILTERS
// =====================================

categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        categoryButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedCategory = button.dataset.category;

        if (selectedCategory === "All") {

            displayBooks(books);

        } else {

            const filteredBooks = books.filter(function(book) {

                return book.category === selectedCategory;

            });

            displayBooks(filteredBooks);
        }

        searchInput.value = "";

    });

});


// =====================================
// 9. LOAD ALL RESERVATIONS
// =====================================

function getAllReservations() {

    return JSON.parse(
        localStorage.getItem("reservations")
    ) || [];

}


// =====================================
// 10. RESERVE A BOOK
// =====================================

function reserveBook(bookId) {

    if (!currentStudent) {
        alert("Please login first.");
        return;
    }

    let reservations = getAllReservations();

    const alreadyReserved = reservations.some(function(reservation) {

        return (
            reservation.studentId === currentStudent.studentId &&
            reservation.bookId === bookId &&
            ["Pending", "Approved"].includes(reservation.status)
        );

    });

    if (alreadyReserved) {
        alert("You already have an active request for this book.");
        return;
    }

    const book = books.find(function(book) {
        return book.id === bookId;
    });

    const newReservation = {

        reservationId: Date.now(),

        bookId: book.id,

        title: book.title,

        author: book.author,

        category: book.category,

        studentName: currentStudent.name,

        studentId: currentStudent.studentId,

        status: "Pending",

        requestedAt: new Date().toISOString(),

        approvedAt: null,

        pickupDeadline: null

    };

    reservations.push(newReservation);

    localStorage.setItem(
        "reservations",
        JSON.stringify(reservations)
    );

    alert("Your reservation request has been submitted!");

    displayReservations();
}


// =====================================
// 11. DISPLAY STUDENT RESERVATIONS
// =====================================

function displayReservations() {

    reservationContainer.innerHTML = "";

    if (!currentStudent) {
        return;
    }

    const reservations = getAllReservations();

    const myReservations = reservations.filter(function(reservation) {

        return reservation.studentId === currentStudent.studentId;

    });

    if (myReservations.length === 0) {

        reservationContainer.innerHTML =
            "<p>You have no reservations yet.</p>";

        return;
    }

    myReservations.forEach(function(reservation) {

        const card = document.createElement("div");

        card.className = "book-card";

        let deadlineText = "";

        if (reservation.status === "Approved") {

            deadlineText = `
                <p><strong>Pickup deadline:</strong>
                ${new Date(reservation.pickupDeadline).toLocaleString()}
                </p>
            `;

        }

        card.innerHTML = `
            <h3>${reservation.title}</h3>

            <p><strong>Author:</strong> ${reservation.author}</p>

            <p><strong>Status:</strong> ${reservation.status}</p>

            ${deadlineText}
        `;

        reservationContainer.appendChild(card);

    });

}


// =====================================
// 12. INITIAL PAGE SETUP
// =====================================

updateLoginScreen();
