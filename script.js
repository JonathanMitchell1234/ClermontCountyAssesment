// Define the page variable
let page = 1;
const usersPerPage = 10;
let allUsers = [];
let filteredUsers = [];

// Get references to the DOM elements
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const userList = document.getElementById("user-list");
const searchInput = document.getElementById("search-input");

// Ensure that the DOM elements exist before adding event listeners
if (prevButton) {
	prevButton.addEventListener("click", onPrevPage);
}

if (nextButton) {
	nextButton.addEventListener("click", onNextPage);
}

if (searchInput) {
	searchInput.addEventListener("input", onSearch);
}

function fetchUsers() {
	fetch(`http://localhost:5153/api/user`)
		.then((response) => response.json())
		.then((data) => {
			console.log("API Response:", data); // Log the entire response

			if (Array.isArray(data) && data.length > 0) {
				allUsers = data;
				filteredUsers = [...allUsers]; // Initialize filteredUsers
				page = 1; // Reset to first page
				displayUsers();
				updatePaginationButtons();
			} else {
				console.error("No users found in the response.");
			}
		})
		.catch((error) => {
			console.error("Error fetching users:", error);
		});
}

function displayUsers() {
	userList.innerHTML = "";

	if (filteredUsers.length === 0) {
		userList.innerHTML = "<p>No users found.</p>";
		return;
	}

	const startIndex = (page - 1) * usersPerPage;
	const endIndex = startIndex + usersPerPage;
	const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

	usersToDisplay.forEach((user) => {
		const card = document.createElement("div");
		card.className = "user-card";

		card.innerHTML = `
            <a href="user-details.html?uuid=${user.uuid}" class="user-link">
                <img src="${user.thumbnailPicture}" alt="${user.firstName} ${user.lastName}" class="user-image">
                <div class="user-info">
                    <h2>${user.firstName} ${user.lastName}</h2>
                    <p>${user.email}</p>
                    <p>${user.phone}</p>
                </div>
            </a>
        `;

		userList.appendChild(card);
	});
}

function updatePaginationButtons() {
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

	prevButton.disabled = page <= 1;
	nextButton.disabled = page >= totalPages || totalPages === 0;
}

function onPrevPage() {
	if (page > 1) {
		page--;
		displayUsers();
		updatePaginationButtons();
	}
}

function onNextPage() {
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
	if (page < totalPages) {
		page++;
		displayUsers();
		updatePaginationButtons();
	}
}

function onSearch() {
	const query = searchInput.value.trim().toLowerCase();

	if (query === "") {
		// If the search query is empty, show all users
		filteredUsers = [...allUsers];
	} else {
		// Filter the allUsers array based on the query
		filteredUsers = allUsers.filter((user) => {
			const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
			const email = user.email.toLowerCase();
			return fullName.includes(query) || email.includes(query);
		});
	}

	page = 1; // Reset to the first page
	displayUsers();
	updatePaginationButtons();
}

// Initial fetch
fetchUsers();
