// Define the page variable
let page = 1;
const usersPerPage = 10;
let allUsers = [];
let filteredUsers = [];

// Get references to the pagination buttons and search input
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const searchInput = document.getElementById("search-input");

// Get reference to the user list container
const userList = document.getElementById("user-list");

function fetchUsers() {
	fetch(`http://localhost:5153/api/user`)
		.then((response) => response.json())
		.then((data) => {
			console.log("API Response:", data); // Log the entire response

			if (Array.isArray(data) && data.length > 0) {
				allUsers = data;
				filteredUsers = allUsers;
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
	if (page <= 1) {
		prevButton.disabled = true;
	} else {
		prevButton.disabled = false;
	}

	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
	if (page >= totalPages) {
		nextButton.disabled = true;
	} else {
		nextButton.disabled = false;
	}
}

if (prevButton) {
	prevButton.addEventListener("click", () => {
		if (page > 1) {
			page--;
			displayUsers();
			updatePaginationButtons();
		}
	});
}

if (nextButton) {
	nextButton.addEventListener("click", () => {
		const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
		if (page < totalPages) {
			page++;
			displayUsers();
			updatePaginationButtons();
		}
	});
}

if (searchInput) {
	searchInput.addEventListener("input", (e) => {
		const query = e.target.value.toLowerCase();
		filteredUsers = allUsers.filter(
			(user) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
		);
		page = 1;
		displayUsers();
		updatePaginationButtons();
	});
}

// Initial fetch
fetchUsers();
